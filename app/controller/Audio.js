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
        audioContext : null,
        oscillator   : null
    },
    onPlayCell   : function (cell) {
        console.log('playing cell', cell);
        this.generateTone(cell);
    },
    generateTone : function(e) {
        var oscillator = this.getOscillator();
        oscillator.connect(this.getAudioContext().destination); // Connect to speakers
        oscillator.start(0); // Start generating sound immediately

        oscillator.frequency.value = e.physicalPos.x + e.physicalPos.y; // in hertz
    },
    init         : function() {
        this.setAudioContext(new webkitAudioContext());
        this.setOscillator(this.getAudioContext().createOscillator());
    }
});