import { AppBase } from "../../app/AppBase";
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id = "103,108,111";
    //options.id = "104,105";
    //options.id = ;
    if(options.id!=undefined){
      options.id=options.id.replace("%2C",",");
    }
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;

    var albumapi = new AlbumApi();
    albumapi.file({ id: options.id }, (ret) => {
      if(ret.length==0){
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
      this.Base.setMyData({ files: ret,current:0, showbar: true });

      albumapi.list({albumtype:ret[0].filetype}, (albums) => {
        that.Base.setMyData({ albums: albums });
      });
    });
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  toggleShowbar() {
    var showbar = this.Base.getMyData().showbar;
    this.Base.setMyData({ showbar: !showbar });
  }
  moveAlbum() {
    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;
    var files = data.files;
    var info = files[0];
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
        if (info.album_id == albums[res.tapIndex].id) {
          return;
        }
        var albumapi = new AlbumApi();
        albumapi.movealbum({ file_id: that.Base.options.id, newalbum_id: albums[res.tapIndex].id }, (ret) => {
          if (ret.code == 0) {
            wx.showToast({
              title: '移动成功',
            });
            info.album_id = albums[res.tapIndex].id;
            files[0] = info;
            that.Base.setMyData({ files: files });

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
    var files = data.files;

    for (var i = 0; i < files.length; i++) {
      var info = files[i];
      var url = data.uploadpath + "memberphoto/" + info.content;

      wx.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            if (info.filetype == 'P') {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                  wx.showToast({
                    title: '已保存到本地',
                  })
                },
                fail(resd) {
                  wx.showToast({
                    title: '保存失败，可能是微信版本导致，请升级后测试',
                  })
                }
              });
            } else {
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                  wx.showToast({
                    title: '已保存到本地',
                  })
                },
                fail(resd) {
                  wx.showToast({
                    title: '保存失败，可能是微信版本导致，请升级后测试',
                  })
                }
              });
            }
          }
        },
        fail(res) {
          console.log(res);
        }
      })
    }
  }
  deletefile() {
    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;

    wx.showModal({
      title: '提示',
      content: '确认删除后将无法找回，是否确认？',
      success(res) {
        if (res.confirm) {

          var albumapi = new AlbumApi();
          albumapi.deletephoto({ idlist: that.Base.options.id }, (ret) => {
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
  changeFileIndex(e){
    this.Base.setMyData({current:e.detail.current});
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
body.changeFileIndex = page.changeFileIndex;
Page(body)