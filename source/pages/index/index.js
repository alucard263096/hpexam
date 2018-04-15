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
    var api = new AlbumApi();
    api.tempfile({album_id:0},(ret)=>{
      this.Base.setMyData({ albums: ret, showtype:"P"});
     });
  }
  goupload() {
    var that = this;
    wx.showActionSheet({
      itemList: ['照片', '视频'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.Base.takeImage("memberphoto", (path) => {
              var api = new AlbumApi();
              api.upload({
                content: path,
                filetype: "P"
              }, (ret) => {
                if (ret.code == "0") {
                  wx.navigateTo({
                    url: '../file/file?id=' + ret.return,
                  })
                }
              });
            });
          }
          if (res.tapIndex == 1) {
            that.Base.takeImage("memberphoto", (path) => {
              var api = new AlbumApi();
              api.upload({
                content: path,
                filetype: "V"
              }, (ret) => {
                if (ret.code == "0") {
                  wx.navigateTo({
                    url: '../file/file?id='+ret.return,
                  })
                }
              });
            });
          }
        }
      }
    });
  }
  clickPhoto() {
    // var that = this;
    // that.Base.takeImage("memberphoto", (path) => {
    //   var api = new AlbumApi();
    //   api.upload({
    //     content: path,
    //     filetype:"P",
    //     location:that.Base.getMyData().address
    //   }, (ret) => {
    //     if (ret.code == "0") {
    //       wx.navigateTo({
    //         url: '../file/file?id=' + ret.return,
    //       })
    //     }
    //   });
    // });
    //wx.navigateTo({
    //  url: '/pages/capture/capture?takingtype=1',
    //})
    this.Base.setMyData({  showtype: "P" });
  }
  clickVideo() {
    // var that = this;
    // that.Base.takeVideo("memberphoto", (path) => {
    //   var api = new AlbumApi();
    //   api.upload({
    //     content: path,
    //     filetype: "V",
    //     location: that.Base.getMyData().address
    //   }, (ret) => {
    //     if (ret.code == "0") {
    //       wx.navigateTo({
    //         url: '../file/file?id=' + ret.return,
    //       })
    //     }
    //   });
    // });

    //wx.navigateTo({
    //  url: '/pages/capture/capture?takingtype=2',
    //})

    this.Base.setMyData({ showtype: "V" });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.goupload = page.goupload;
body.clickPhoto = page.clickPhoto; 
body.clickVideo = page.clickVideo; 
Page(body)