Ext.define('TNR.view.Main', {
    extend   : 'Ext.Container',
    xtype    : 'main',
    fullscreen: true,

    config   : {
        items  : [
            {
                xtype : 'canvasgrid'
            },
            {
                xtype: 'songspanel'
            }
        ]
    }
});