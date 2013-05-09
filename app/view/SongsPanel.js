Ext.define('TNR.view.SongsPanel', {
    extend   : 'Ext.Panel',
    xtype    : 'songspanel',

    config   : {
        modal: true,
        showAnimation: {type: 'slide', duration: 500, direction: 'up'},
        hideAnimation: {type: 'slide', duration: 500, direction: 'down'},
        width: 300,
        dockedItems: [
            {
                xtype: 'button',
                text: 'Close',
                handler: function() {
                    this.fireEvent('closeSongsPanel');
                }
            }
        ],
        items  : [
            {
                xtype : 'songlist'
            }
        ]
    }
});
