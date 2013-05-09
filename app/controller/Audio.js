/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 4/26/13
 * Time: 1:15 PM
 */
Ext.define('TNR.controller.Audio', {
    extend         : 'Ext.app.Controller',
    config         : {
        views        : [
            'CanvasGrid'
        ],
        refs         : {
            canvasGrid : 'canvasgrid'
        },
        control      : {
            'canvasgrid' : {
                'playCell'              : 'onPlayCell',
                'record'                : 'onRecord',
                'resetGrid'             : 'onResetGrid',
                'adjustBPM'             : 'onAdjustBPM',
                'frequencyDivideChange' : 'onFrequencyDivideChange',
                'waveformChange'        : 'onWaveformChange',
                'filterChange'          : 'onFilterChange',
                'saveGrid'              : 'onSaveGrid'
            }
        },
        audioContext : null,
        gainNode     : null,
        recorder     : null
    },
    init           : function () {
        var me = this,
            audioContext = new webkitAudioContext(),
            gainNode = audioContext.createGainNode(),
            compressor = audioContext.createDynamicsCompressor();

        gainNode.connect(compressor);
        gainNode.gain.value = 0.5;
        compressor.connect(audioContext.destination);

        me.setAudioContext(audioContext);
        me.setGainNode(gainNode);
    },
    onSaveGrid     : function() {
        var canvasGrid = this.getCanvasGrid(),
            hashSong = canvasGrid.getPositions(),
            songObject,
            songsStore = Ext.getStore("Songs");
        if (hashSong && hashSong.length > 0) {
            Ext.Msg.prompt('Save Song', 'Please enter a name for it:', function(btn, value) {
                if (btn == 'ok') {
                    hashSong = Ext.encode(hashSong);
                    songObject = Ext.create('TNR.model.Song', {name: value, hashSong: hashSong});
                    songsStore.add(songObject);
                    songsStore.sync();
                }
            });
        } else {
            Ext.Msg.alert("Save Error", "There is no song created yet. Tap on the grid to create a song");
        }

    },
    onResetGrid    : function () {
        this.getCanvasGrid().resetGrid();
    },
    onPlayCell     : function (cell) {
        this.generateTone(cell);
    },
    generateTone   : function (e) {
        var me              = this,
            audioContext    = me.getAudioContext(),
            oscillator      = audioContext.createOscillator(),
            canvasGrid      = me.getCanvasGrid(),
            gainNode        = audioContext.createGainNode(),
            frequencyDivide = canvasGrid.getFrequencyDivide(),
            waveformType    = canvasGrid.getWaveformType(),
            filterType      = canvasGrid.getFilterType(),
            filter          = audioContext.createBiquadFilter(),
            currTime        = audioContext.currentTime,
            fps;

        gainNode.connect(me.getGainNode());

        oscillator.connect(filter); // Connect to speakers

        // set up our filter
        filter.type = filterType;
        filter.frequency.value = 4400.0; // arbitrary value for now
        filter.connect(gainNode);

        gainNode.gain.linearRampToValueAtTime(0, currTime);
        gainNode.gain.linearRampToValueAtTime(0.5, currTime + .1);
        oscillator.start(0); // Start generating sound immediately

        oscillator.type = waveformType;
        oscillator.frequency.value = ((e.physicalPos.x + e.physicalPos.y) / frequencyDivide); // in hertz
        gainNode.gain.linearRampToValueAtTime(0.5, currTime + .1);
        gainNode.gain.linearRampToValueAtTime(0.0, currTime + .5);


        function stopNote() {
            fps = (canvasGrid.getBpm() / 60);
            setTimeout(function () {
                requestAnimationFrame(stopNote);
                oscillator.disconnect();
            }, 1000 / fps);
        }

        stopNote();
    },
    onRecord       : function () {
        var me         = this,
            canvasGrid = me.getCanvasGrid();

        if (canvasGrid.isRecording()) {
            me.stopRecording();
        } else {
            me.startRecording();
        }
    },
    startRecording : function () {
        var me       = this,
            recorder = new Recorder(me.getGainNode(), {
                workerPath : 'lib/recorderjs/recorderWorker.js'
            });

        recorder.record();
        me.setRecorder(recorder);
        me.getCanvasGrid().setRecording(true);
    },

    stopRecording           : function () {
        var recorder = this.getRecorder();

        recorder.stop();

        recorder.exportWAV(function (buffer) {
            Recorder.forceDownload(buffer);
        });

        this.getCanvasGrid().setRecording(false);
    },
    onAdjustBPM             : function (button) {
        var canvasGrid = this.getCanvasGrid(),
            bpm        = canvasGrid.getBpm(),
            offset     = button.hasCls("plus") ? 1 : -1,
            newBPM     = bpm + offset;

        canvasGrid.setBpm(newBPM);
    },
    onFrequencyDivideChange : function (button) {
        var canvasGrid = this.getCanvasGrid(),
            value      = parseInt(button.getHtml(), 10);

        canvasGrid.setFrequencyDivide(value);
    },
    onWaveformChange        : function (button) {
        var canvasGrid = this.getCanvasGrid(),
            value      = parseInt(button.dom.dataset.value, 10);

        canvasGrid.setWaveformType(value);
    },
    onFilterChange        : function (button) {
        var canvasGrid = this.getCanvasGrid(),
            value      = parseInt(button.dom.dataset.value, 10);
        canvasGrid.setFilterType(value);
    }
});