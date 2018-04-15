import { AppBase } from "../../app/AppBase";
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
  }
  onShow() {
    var that = this;
    super.onShow();
    var albumapi = new AlbumApi();
    albumapi.list({}, (albums) => {
      this.Base.setMyData({ albums: albums });
    });
  }


  addNew() {
    wx.navigateTo({
      url: '../album/album',
    })
  }
  openAlbum(e) {
    console.log(e);
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../album/album?id=' + id,
    })
  }
  openPhotos(e) {

    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../photo/photo?album_id=' + id,
    })
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.addNew = page.addNew;
body.openAlbum = page.openAlbum;
body.openPhotos = page.openPhotos;
Page(body)