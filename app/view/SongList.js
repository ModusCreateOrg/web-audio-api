/**
 * SongList
 * @author: Alex Lazar
 * @extends Ext.List
 * It is used to define the Songs list view
 */
Ext.define('TNR.view.SongList', {
    extend:'Ext.List',
    xtype :'songlist',

    config:{
        cls             :'song-list',
        styleHtmlContent:true,
        store           :'Songs',
        emptyText       : '<div class="empty">No song added yet. Create your song and save it</div>',
        itemTpl          :'<h3>{name}</h3>',
        itemCls         :'song-list-item',
        onItemDisclosure: function(item) {

            this.fireEvent('renderSong', item);
        }
    }
});