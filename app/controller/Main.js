/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 4/26/13
 * Time: 1:19 PM
 */
Ext.define('TNR.controller.Main', {
    extend : 'Ext.app.Controller',
    config : {
        views   : [
            'Main'
        ],
        refs    : {
            main : 'main'
        },
        control : {

        }
    },
    launch : function () {
        Ext.Viewport.add({
            xtype : 'main'
        });
    }
})