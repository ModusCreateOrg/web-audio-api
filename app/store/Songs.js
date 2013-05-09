/**
 * Song
 * @author: Alex Lazar
 * @extends Ext.Model
 * It is used to define the Song model
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
        }
    }
});
