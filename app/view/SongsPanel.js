Ext.define('TNR.view.SongsPanel', {
    extend : 'Ext.Panel',
    xtype  : 'songspanel',

    requires : [
        'Ext.Toolbar',
        'TNR.view.SongList'
    ],

    config : {
        cls           : 'list-modal',
        showAnimation : {
            type      : 'slide',
            duration  : 300,
            direction : 'up'
        },

        modal    : true,
        centered : true,
        width    : 400,
        hidden   : true,
        items    : [

            {
                xtype  : 'container',
                config : {
                    dockedItems : [
                        {
                            xtype  : 'toolbar',
                            ui     : 'light',
                            docked : 'top',
                            layout : 'hbox',
                            title  : 'MY SONG LIST',
                            items  : [
                                {
                                    xtype        : 'button',
                                    cls          : 'close-btn',
                                    ui           : 'back',
                                    width        : 100,
                                    text         : 'CLOSE',
                                    docked       : 'left',
                                    bubbleEvents : ['closeSongsPanel'],
                                    handler      : function () {
                                        this.fireEvent('closeSongsPanel');
                                    }
                                }
                            ]
                        }

                    ],
                    items       : [
                        {
                            xtype  : 'songlist',
                            height : 450
                        }
                    ]
                }


            }

        ]
    }
});
