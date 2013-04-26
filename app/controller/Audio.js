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
        }
    },
    onPlayCell : function (cell) {
        console.log('playing cell', cell);
    }
})