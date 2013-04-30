/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 4/26/13
 * Time: 1:15 PM
 */
Ext.define('TNR.controller.Audio', {
    extend     : 'Ext.app.Controller',
    config     : {
        views   : [
            'CanvasGrid'
        ],
        refs    : {
            canvasGrid : 'canvasgrid'
        },
        control : {
            'canvasgrid' : {
                'playCell' : 'onPlayCell'
            }
        },
        audioContext : null
    },
    onPlayCell   : function (cell) {
        console.log('playing cell', cell);
        this.generateTone(cell);
    },
    generateTone : function(e) {
        var me           = this,
            audioContext = me.getAudioContext(),
            oscillator   = audioContext.createOscillator(),
            fps          = (me.getCanvasGrid().getBpm() / 60);

        console.log(oscillator);
        oscillator.connect(audioContext.destination); // Connect to speakers

        oscillator.start(0); // Start generating sound immediately
        oscillator.frequency.value = ((e.physicalPos.x + e.physicalPos.y)/2); // in hertz
        function stopNote() {
            setTimeout(function () {
                requestAnimationFrame(stopNote);
                oscillator.disconnect();
            }, 1000 / fps);
        };
        stopNote();
//        setTimeout(function() {
//            oscillator.disconnect();
//        }, 500);
    },
    init         : function() {
        this.setAudioContext(new webkitAudioContext());
    }
});