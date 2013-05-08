/**
 * Song
 * @author: Alex Lazar
 * @extends Ext.Model
 * It is used to define the Song model
 */
Ext.define('TNR.model.Song', {
    extend:'Ext.data.Model',
    config:{
        fields:[
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'hashSong', type: 'string' }
        ],
        proxy :{
            type:'localstorage',
            id  :'wb-songs'
        }
    }
});
