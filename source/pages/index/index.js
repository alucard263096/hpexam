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
    this.Base.setMyData({ showtype: "P", longtype:false });
  }
  onShow() {
    var that = this;
    super.onShow();

    var albumapi = new AlbumApi();
    albumapi.list({}, (albums) => {
      this.Base.setMyData({ albums: albums });
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
    wx.navigateTo({
      url: '/pages/capture/capture?takingtype=1',
    })
    //this.Base.setMyData({  showtype: "P" });
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

    wx.navigateTo({
      url: '/pages/capture/capture?takingtype=2',
    })

    //this.Base.setMyData({ showtype: "V" });
  }
  clickTaking(){
    var showtype = this.Base.getMyData().showtype=="P"?"1":"2";
    wx.navigateTo({
      url: '/pages/capture/capture?takingtype='+showtype,
    })
  }
  gotoPhoto(e) {
    console.log(e);
    var id = e.currentTarget.id;

    var longtype=this.Base.getMyData().longtype;
    if(longtype==true){
      var files=this.Base.getMyData().files;
      for(var i=0;i<files.length;i++){
        if(files[i].id==id){
          if (firstlongtype==true){
            files[i].selected =true;
            firstlongtype=false;
          }else{
            files[i].selected = files[i].selected == true ? false : true;
          }
          break;
        }
      }
      this.Base.setMyData({ files: files});
    }else{
      wx.navigateTo({
        url: '../file/file?id=' + id,
      })
    }
  }
  photoLong(e){
    console.log(e);

    var id = e.currentTarget.id;
    var files = this.Base.getMyData().files;
    for (var i = 0; i < files.length; i++) {
      if (files[i].id == id) {
        files[i].selected = true;
      }else{
        files[i].selected = false;
      }
    }
    this.Base.setMyData({ longtype: true, files: files});
    firstlongtype=true;
  }
  cancelLongtype(){
    this.Base.setMyData({ longtype: false});
  }
  deleteFiles(){
    var ids=[];
    var nofiles=[];
    var files = this.Base.getMyData().files;
    for (var i = 0; i < files.length; i++) {
      if (files[i].selected == true) {
        ids.push(files[i].id);
      }else{
        nofiles.push(files[i]);
      }
    }
    if(ids.length==0){
      wx.showModal({
        title: '提示',
        content: '请至少选择一个图片删除',
        showCancel:false
      })
      return;
    }
    var that=this;
    wx.showModal({
      title: '提示',
      content: '删除后将不可恢复，请点击确认继续',
      success(res){
        if(res.confirm){

          that.Base.setMyData({ longtype: false });
          var idsstr=ids.join(",");
          var albumapi = new AlbumApi();
          albumapi.deletephoto({ idlist: idsstr }, (ret) => {
            if (ret.code == 0) {
              wx.showToast({
                title: '删除成功',
              });
              that.Base.setMyData({files:nofiles});
            }
          });
        }
      }
    })

  }
  moveAlbum(){
    var ids = [];
    var nofiles = [];
    var files = this.Base.getMyData().files;
    for (var i = 0; i < files.length; i++) {
      if (files[i].selected == true) {
        ids.push(files[i].id);
      } else {
        nofiles.push(files[i]);
      }
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

        var albumapi = new AlbumApi();
        albumapi.movealbum({ file_id: idsstr, newalbum_id: albums[res.tapIndex].id }, (ret) => {
          if (ret.code == 0) {
            wx.showToast({
              title: '移动成功',
            });
            that.Base.setMyData({ files: nofiles, longtype: false });
          } else {
            wx.showToast({
              title: '移动失败，请重新尝试',
            })
          }
        },false);
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  }
  viewPhoto() {
    var ids = [];
    var nofiles = [];
    var files = this.Base.getMyData().files;
    for (var i = 0; i < files.length; i++) {
      if (files[i].selected == true) {
        ids.push(files[i].id);
      } else {
        nofiles.push(files[i]);
      }
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
    var files = data.files;
    
    var ids = [];
    var nofiles = [];
    for (var i = 0; i < files.length; i++) {
      if (files[i].selected == true) {
        ids.push(files[i].id);
        var url = data.uploadpath + "memberphoto/" + files[i].content;
        var f = files[i];
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
    if (ids.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个图片下载',
        showCancel: false
      })
      return;
    }else{

      this.Base.setMyData({ longtype: false });
      wx.showToast({
        title: '已保存到本地',
      })
    }
    
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
var firstlongtype=false;
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.goupload = page.goupload;
body.clickPhoto = page.clickPhoto; 
body.clickVideo = page.clickVideo; 
body.gotoPhoto = page.gotoPhoto; 
body.clickTaking = page.clickTaking; 
body.photoLong = page.photoLong; 
body.cancelLongtype = page.cancelLongtype; 
body.deleteFiles = page.deleteFiles; 
body.moveAlbum = page.moveAlbum;
body.viewPhoto = page.viewPhoto;
body.download = page.download;
body.addNew = page.addNew;
body.openAlbum = page.openAlbum;
body.openPhotos = page.openPhotos;
Page(body)