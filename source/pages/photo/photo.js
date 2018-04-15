import { AppBase } from "../../app/AppBase";
import { AlbumApi } from '../../apis/album.api';


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.album_id = 10;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
    this.Base.setMyData({ longtype: false });

    wx.hideShareMenu({
      
    })
  }
  onShow() {
    var that = this;
    super.onShow();
    var albumapi = new AlbumApi();
    albumapi.photos({ album_id: this.Base.options.album_id }, (list) => {
      this.Base.setMyData({ list: list });
    });
    albumapi.list({}, (albums) => {
      this.Base.setMyData({ albums: albums });
    });
  }
  uploadpic() {
    var that = this;
    this.Base.uploadImage("memberphoto", (src) => {

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
      setTimeout(function () {

        console.log("??");
        var albumapi = new AlbumApi();
        albumapi.photos({ album_id: that.Base.options.album_id }, (list) => {
          that.Base.setMyData({ list: list });
        })
      }, 2000);
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
  onPullDownRefresh() {

    var albumapi = new AlbumApi();
    albumapi.photos({ album_id: this.Base.options.album_id }, (list) => {
      this.Base.setMyData({ list: list });
    })
  }

  gotoPhoto(e) {
    var id = e.currentTarget.id;
    var longtype = this.Base.getMyData().longtype;
    if (longtype == true) {
      var list = this.Base.getMyData().list;
      for (var akb = 0; akb < list.length; akb++) {
        for (var i = 0; i < list[akb].vals.length; i++) {
          if (list[akb].vals[i].id == id) {
            if (firstlongtype == true) {
              list[akb].vals[i].selected = true;
              firstlongtype = false;
            } else {
              list[akb].vals[i].selected = list[akb].vals[i].selected == true ? false : true;
            }
            break;
          }
        }
      }
      this.Base.setMyData({ list: list });

    } else {

      wx.navigateTo({
        url: '../file/file?id=' + id,
      })
    }
  }
  photoLong(e) {
    console.log(e);

    var id = e.currentTarget.id;
    var list = this.Base.getMyData().list;
    for (var akb = 0; akb < list.length; akb++) {

      for (var i = 0; i < list[akb].vals.length; i++) {
        if (list[akb].vals[i].id == id) {
          list[akb].vals[i].selected = true;
        } else {
          list[akb].vals[i].selected = false;
        }
      }
    }
    this.Base.setMyData({ longtype: true, list: list });
    firstlongtype = true;
  }
  cancelLongtype() {
    this.Base.setMyData({ longtype: false });
  }
  deleteFiles() {
    var ids = [];

    var list = this.Base.getMyData().list;
    for (var akb = 0; akb < list.length; akb++) {
      var nofiles = [];
      for (var i = 0; i < list[akb].vals.length; i++) {
        if (list[akb].vals[i].selected == true) {
          ids.push(list[akb].vals[i].id);
        } else {
          nofiles.push(list[akb].vals[i]);
        }
      }
      list[akb].vals = nofiles;
    }
    if (ids.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个图片删除',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.showModal({
      title: '提示',
      content: '删除后将不可恢复，请点击确认继续',
      success(res) {
        if (res.confirm) {

          that.Base.setMyData({ longtype: false });
          var idsstr = ids.join(",");
          var albumapi = new AlbumApi();
          albumapi.deletephoto({ idlist: idsstr }, (ret) => {
            if (ret.code == 0) {
              wx.showToast({
                title: '删除成功',
              });
              that.Base.setMyData({ list: list });
            }
          });
        }
      }
    })

  }
  moveAlbum() {
    var ids = [];
    var ids = [];

    var list = this.Base.getMyData().list;
    for (var akb = 0; akb < list.length; akb++) {
      var nofiles = [];
      for (var i = 0; i < list[akb].vals.length; i++) {
        if (list[akb].vals[i].selected == true) {
          ids.push(list[akb].vals[i].id);
        } else {
          nofiles.push(list[akb].vals[i]);
        }
      }
      list[akb].vals = nofiles;
    }
    if (ids.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个图片加入相册',
        showCancel: false
      })
      return;
    }
    var that = this;

    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;

    var items = [];
    for (var i = 0; i < albums.length; i++) {
      items.push(albums[i].name);
    }

    wx.showActionSheet({
      itemList: items,
      success: function (res) {
        var idsstr = ids.join(",");
        //console.log(albums[res.tapIndex].id);
        var albumapi = new AlbumApi();
        albumapi.movealbum({ file_id: idsstr, newalbum_id: albums[res.tapIndex].id }, (ret) => {
          if (ret.code == 0) {
            wx.showToast({
              title: '移动成功',
            });
            that.Base.setMyData({ list: list, longtype: false });
          } else {
            wx.showToast({
              title: '移动失败，请重新尝试',
            })
          }
        }, false);
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  }
  viewPhoto() {
    var ids = [];
    var ids = [];

    var list = this.Base.getMyData().list;
    for (var akb = 0; akb < list.length; akb++) {
      var nofiles = [];
      for (var i = 0; i < list[akb].vals.length; i++) {
        if (list[akb].vals[i].selected == true) {
          ids.push(list[akb].vals[i].id);
        } else {
          nofiles.push(list[akb].vals[i]);
        }
      }
      list[akb].vals = nofiles;
    }
    if (ids.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个图片查看',
        showCancel: false
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/file/file?id=' + ids.join(",")
    });


  }




  download() {

    var that = this;
    var data = that.Base.getMyData();
    var albums = data.albums;

    var ids = [];
    var list = this.Base.getMyData().list;
    for (var akb = 0; akb < list.length; akb++) {

      for (var i = 0; i < list[akb].vals.length; i++) {
        if (list[akb].vals[i].selected == true) {
          ids.push(list[akb].vals[i].id);
          var url = data.uploadpath + "memberphoto/" + list[akb].vals[i].content;
          var f = list[akb].vals[i];
          wx.downloadFile({
            url: url, //仅为示例，并非真实的资源
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                if (f.filetype == 'P') {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                    },
                    fail(resd) {
                      console.log(res);
                      console.log(resd);
                    }
                  });
                } else {
                  console.log("???here2");
                  wx.saveVideoToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                      wx.showToast({
                        title: '已保存到本地',
                      })
                    },
                    fail(resd) {
                      console.log(res);
                      console.log(resd);
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


    }

    if (ids.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个图片下载',
        showCancel: false
      })
      return;
    } else {

      this.Base.setMyData({ longtype: false });
      wx.showToast({
        title: '已保存到本地',
      })
    }
  }

}
var firstlongtype = false;
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.gotoPhoto = page.gotoPhoto;
body.uploadpic = page.uploadpic;
body.uploadvid = page.uploadvid;
body.onPullDownRefresh = page.onPullDownRefresh;

body.photoLong = page.photoLong;
body.cancelLongtype = page.cancelLongtype;
body.deleteFiles = page.deleteFiles;
body.moveAlbum = page.moveAlbum;
body.viewPhoto = page.viewPhoto;
body.download = page.download;
Page(body)