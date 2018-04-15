import { AppBase } from "../../app/AppBase";
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;

    var albumapi = new AlbumApi();
    albumapi.file({ id: options.id }, (info) => {
      this.Base.setMyData({ info: info, showbar: true });
    });
  }
  onShow() {
    var that = this;
    super.onShow();
    var albumapi = new AlbumApi();
    albumapi.list({}, (albums) => {
      this.Base.setMyData({ albums: albums });
    });
  }
  toggleShowbar() {
    var showbar = this.Base.getMyData().showbar;
    this.Base.setMyData({ showbar: !showbar });
  }
  moveAlbum() {
    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;
    var info = data.info;

    var items = [];
    for (var i = 0; i < albums.length; i++) {
      if (albums[i].id == info.album_id) {
        items.push(albums[i].name + "(当前)");
      }
      else {

        items.push(albums[i].name);
      }
    }

    wx.showActionSheet({
      itemList: items,
      success: function (res) {
        if (info.album_id == albums[res.tapIndex].id){
          return;
        }
        var albumapi = new AlbumApi();
        albumapi.movealbum({file_id:info.id,oldalbum_id:info.album_id,newalbum_id:albums[res.tapIndex].id}, (ret) => {
          if(ret.code==0){
            wx.showToast({
              title: '移动成功',
            });
            info.album_id = albums[res.tapIndex].id;
            that.Base.setMyData({ info: info });

          } else {
            wx.showToast({
              title: '移动失败，请重新尝试',
            })
          }
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  }
  download() {

    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;
    var info = data.info;
    var url = data.uploadpath + "memberphoto/" + info.content;

    console.log("???here0");
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log("???here1");
        if (res.statusCode === 200) {
          if (data.info.filetype=='P'){
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                wx.showToast({
                  title: '已保存到本地',
                })
              },
              fail(resd) {
                console.log(res);
                console.log(resd);
                //var ext = res.tempFilePath.split(".");
                //ext=ext[ext.length-1];
                //wx.showModal({
                //  title: ext,
                //  content: resd.errMsg,
                //})
                wx.showToast({
                  title: '保存失败，可能是微信版本导致，请升级后测试',
                })
              }
            });
          }else{
            console.log("???here2");
            wx.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
              success(){
                wx.showToast({
                  title: '已保存到本地',
                })
              },
              fail(resd) {
                console.log(res);
                console.log(resd);
                //var ext = res.tempFilePath.split(".");
                //ext=ext[ext.length-1];
                //wx.showModal({
                //  title: ext,
                //  content: resd.errMsg,
                //})
                wx.showToast({
                  title: '保存失败，可能是微信版本导致，请升级后测试',
                })
              }
            });
          }
        }
      },
      fail(res){
        console.log(res);
      }
    })

  }
  deletefile(){
    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;
    var info = data.info;

    wx.showModal({
      title: '提示',
      content: '确认删除后将无法找回，是否确认？',
      success(res){
        if(res.confirm){

          var albumapi = new AlbumApi();
          albumapi.deletephoto({ idlist: info.id, album_id: info.album_id }, (ret) => {
            if (ret.code == 0) {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack({

              })
            }
          });
        }
      }
    })

  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.toggleShowbar = page.toggleShowbar;
body.moveAlbum = page.moveAlbum;
body.download = page.download;
body.deletefile = page.deletefile;
Page(body)