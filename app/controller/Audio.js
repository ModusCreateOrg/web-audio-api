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
                'waveformChange'        : 'onWaveformChange'
            }
        },
        audioContext : null,
        gainNode     : null,
        recorder     : null
    },
    init           : function () {
        var me = this,
            audioContext = new webkitAudioContext(),
            gainNode = audioContext.createGainNode();

        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.5;

        me.setAudioContext(audioContext);
        me.setGainNode(gainNode);
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
            frequencyDivide = canvasGrid.getFrequencyDivide(),
            waveformType    = canvasGrid.getWaveformType(),
            fps;

        oscillator.connect(me.getGainNode()); // Connect to speakers

        oscillator.start(0); // Start generating sound immediately

        oscillator.type = waveformType;
        oscillator.frequency.value = ((e.physicalPos.x + e.physicalPos.y) / frequencyDivide); // in hertz
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
    }
});