Ext.define('TNR.view.SongsPanel', {
    extend  :'Ext.Panel',
    xtype   :'songspanel',

    requires:[
        'Ext.Toolbar',
        'TNR.view.SongList'
    ],

    config:{
        cls     :'list-modal',
        modal   :true,
        centered:true,
        width   :400,
        hidden  :true,
        title: 'MY LIST',

        items   :[

            {
                xtype:'container',
                dockedItems: [
                    {
                        xtype: 'button',
                        ui   : 'back',
                        width: 120,
                        text : 'CLOSE',
                        bubbleEvents: ['closeSongsPanel'],
                        handler: function() {
                            this.fireEvent('closeSongsPanel');
                        }
                    }
                ],
                items: [
                    {
                        xtype: 'songlist'
                    }
                ]

            }

        ]
    },
    show  :function (initialConfig) {
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);
        }

        if (!initialConfig) {
            return this.callParent();
        }
    }
});
