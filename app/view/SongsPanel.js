Ext.define('TNR.view.SongsPanel', {
    extend:'Ext.Panel',
    xtype :'songspanel',

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
        items:[

            {
                xtype      :'container',
                dockedItems:[
                    {
                        xtype :'toolbar',
                        ui    :'light',
                        docked:'top',
                        layout:'hbox',
                        title: 'MY SONG LIST',
                        items :[
                            {
                                xtype       :'button',
                                cls         : 'close-btn',
                                ui          :'back',
                                width       : 100,
                                text        :'CLOSE',
                                docked      :'left',
                                bubbleEvents:['closeSongsPanel'],
                                handler     :function () {
                                    this.fireEvent('closeSongsPanel');
                                }
                            }
                        ]
                    }

                ],
                items      :[
                    {
                        xtype :'songlist',
                        height:450
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
