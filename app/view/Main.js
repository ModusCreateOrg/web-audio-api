Ext.define('TNR.view.Main', {
    extend   : 'Ext.Container',
    xtype    : 'main',
    config   : {
        layout : 'fit',
        items  : [
            {
                xtype : 'canvasgrid'
            }
        ]
    }
});
