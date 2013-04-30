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
        var oscillator = this.getAudioContext().createOscillator();
        console.log(oscillator);
        oscillator.connect(this.getAudioContext().destination); // Connect to speakers

        oscillator.start(0); // Start generating sound immediately
        oscillator.frequency.value = ((e.physicalPos.x + e.physicalPos.y)/2); // in hertz
        setTimeout(function() {
            oscillator.disconnect();
        }, 500);
    },
    init         : function() {
        this.setAudioContext(new webkitAudioContext());
    }
});