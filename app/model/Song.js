/**
 * Song
 * @author: Alex Lazar
 * @extends Ext.Model
 * It is used to define the Song model
 */
Ext.define('TNR.model.Song', {
    extend :'Ext.data.Model',
    config :{
        identifier: {
            type: 'uuid'
        },
        //identifier : 'sequential',
        fields:[
            { name:'id', type:'int' },
            { name:'name', type:'string' },
            { name:'hashSong', type:'string' }
        ]
    }
});
