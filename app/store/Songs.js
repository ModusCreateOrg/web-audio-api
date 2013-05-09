/**
 * Songs Store
 * @author: Alex Lazar
 * @extends Ext.data.Store
 * It is used to define the Songs Store which has a proxy to the local-storage
 */
Ext.define('TNR.store.Songs', {
    extend  :'Ext.data.Store',
    requires:'Ext.data.proxy.LocalStorage',
    config  :{
        storeId:'Songs',
        model  :'TNR.model.Song',
        proxy  :{
            type:'localstorage',
            id  :'wb-songs'
        },
        autoLoad:true
    }
});
