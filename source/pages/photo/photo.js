import { AppBase } from "../../app/AppBase";
import { AlbumApi } from '../../apis/album.api';


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.album_id=1;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
  }
  onShow() {
    var that = this;
    super.onShow();
    var albumapi = new AlbumApi();
    albumapi.photos({ album_id: this.Base.options.album_id},(list)=>{
      this.Base.setMyData({list:list});
    })
  }
  gotoPhoto(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '../file/file?id='+id,
    })
  }
  uploadpic() {
    var that = this;
    this.Base.uploadImage("memberphoto",(src)=>{

      var api = new AlbumApi();
      api.upload({
        album_id: that.Base.options.album_id,
        content: src,
        filetype: "P",
        location: that.Base.getMyData().address
      }, (ret) => {
        
      });
    }, () => {
      console.log("??");
      setTimeout(function(){

        console.log("??");
        var albumapi = new AlbumApi();
        albumapi.photos({ album_id: that.Base.options.album_id }, (list) => {
          that.Base.setMyData({ list: list });
        })
      },2000);
    })
  }
  uploadvid() {
    var that = this;
    this.Base.uploadVideo("memberphoto", (src) => {
      console.log(src);
      var api = new AlbumApi();
      api.upload({
        album_id: that.Base.options.album_id,
        content: src,
        filetype: "V",
        location: that.Base.getMyData().address
      }, (ret) => {

      });
    }, () => {
      console.log("??");
      setTimeout(function () {
        console.log("??");
        var albumapi = new AlbumApi();
        albumapi.photos({ album_id: that.Base.options.album_id }, (list) => {
          that.Base.setMyData({ list: list });
        })
      }, 2000);
    })
  }
  onPullDownRefresh(){

    var albumapi = new AlbumApi();
    albumapi.photos({ album_id: this.Base.options.album_id }, (list) => {
      this.Base.setMyData({ list: list });
    })
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.gotoPhoto = page.gotoPhoto;
body.uploadpic = page.uploadpic; 
body.uploadvid = page.uploadvid;
body.onPullDownRefresh = page.onPullDownRefresh;
Page(body)