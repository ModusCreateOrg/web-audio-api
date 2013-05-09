Ext.define('TNR.view.SongsPanel', {
    extend  :'Ext.Sheet',
    xtype   :'songspanel',
    requires:[
        'Ext.Toolbar'
    ],

    config:{
        cls     :'list-modal',
        modal   :true,
        centered:true,
        width   :400,
        hidden  :true,
        items   :[
            {
                xtype :'toolbar',
                cls   : 'list-modal-toolbar',
                docked:'top',
                items: [
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
                ]
            },
            {
                xtype:'songlist'
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
