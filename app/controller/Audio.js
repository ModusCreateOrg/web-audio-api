/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 4/26/13
 * Time: 1:15 PM
 */
Ext.define('TNR.controller.Audio', {
    extend           : 'Ext.app.Controller',
    config           : {
        views        : [
            'CanvasGrid'
        ],
        refs         : {
            canvasGrid : 'canvasgrid'
        },
        control      : {
            'canvasgrid' : {
                'playCell'       : 'onPlayCell',
                'startRecording' : 'onStartRecording',
                'stopRecording'  : 'onStopRecording'
            }
        },
        audioContext : null,
        gainNode     : null,
        recorder     : null
    },
    init             : function () {
        var me           = this,
            audioContext = new webkitAudioContext(),
            gainNode     = audioContext.createGainNode();

        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.5;

        me.setAudioContext(audioContext);
        me.setGainNode(gainNode);
    },
    onPlayCell       : function (cell) {
        this.generateTone(cell);
    },
    generateTone     : function (e) {
        var me           = this,
            audioContext = me.getAudioContext(),
            oscillator   = audioContext.createOscillator(),
            fps          = (me.getCanvasGrid().getBpm() / 60);

        oscillator.connect(me.getGainNode()); // Connect to speakers

        oscillator.start(0); // Start generating sound immediately
        oscillator.frequency.value = ((e.physicalPos.x + e.physicalPos.y) / 2); // in hertz
        function stopNote() {
            setTimeout(function () {
                requestAnimationFrame(stopNote);
                oscillator.disconnect();
            }, 1000 / fps);
        };
        stopNote();
    },
    onStartRecording : function () {
        var me       = this,
            recorder = new Recorder(me.getGainNode(), {
                workerPath : 'lib/recorderjs/recorderWorker.js'
            });
        console.log('start recording');
        recorder.record();
        me.setRecorder(recorder);

    },
    onRecordAudioProcess : function(e) {

//        console.log(e.inputBuffer.getChannelData(0));
    },
    onStopRecording  : function () {
        console.log('stop');
        var recorder = this.getRecorder();

        recorder.stop();

        recorder.exportWAV(function(buffer) {
            Recorder.forceDownload(buffer);
        });
    }
});