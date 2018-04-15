import { AppBase } from "../../app/AppBase";
import { ApiConfig } from '../../apis/apiconfig';
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);
    var takingtype=2;
    if(options.takingtype!=null){
      takingtype=options.takingtype;
    }
    var that = this;
    this.ctx = wx.createCameraContext();
    this.Base.setMyData({ takingtype: takingtype, cameratype: "back", photos: [], recording:false,lastimg:null,second:0});

    wx.hideShareMenu({
      
    })
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  takePhoto() {
    var that=this;
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        var photos=this.Base.getMyData().photos;
        photos.push(res.tempImagePath);
        this.Base.setMyData({  photos: photos });

        this.Base.uploadFile("memberphoto", res.tempImagePath, (imgurl)=>{
          var api = new AlbumApi();
          
          api.upload({
            content: imgurl,
            filetype: "P",
            location: that.Base.getMyData().address
          }, (ret) => {
            this.Base.setMyData({lastimg: ret.return });
          });

        });

      }
    })
  }
  error(e) {
    console.log(e.detail)
  }
  changeTakingType(e){
    var id=e.currentTarget.id;
    this.Base.setMyData({takingtype:id});
  }
  changeCameraType(){
    var cameratype = this.Base.getMyData().cameratype;
    cameratype=cameratype=="back"?"front":"back";
    this.Base.setMyData({ cameratype: cameratype});
  }
  tapRecording(){
    var that=this;
    var recording = this.Base.getMyData().recording;
    if(recording==false){
      this.ctx.startRecord({
        success: (res) => {
          console.log('startRecord');
          that.Base.setMyData({ second: 0 });
          recondingtimer = setInterval(function () {
            var second = that.Base.getMyData().second;
            if (second == 10) {
              //that.Base.tapRecording();
              //clearInterval(recondingtimer);

              that.ctx.stopRecord({
                success: (res) => {
                  //this.setData({
                  //  src: res.tempThumbPath,
                  //  videoSrc: res.tempVideoPath
                  //})
                  clearInterval(recondingtimer);
                  var photos = that.Base.getMyData().photos;
                  photos.push(res.tempThumbPath);
                  that.Base.setMyData({ photos: photos });
                  that.Base.uploadFile("memberphoto", res.tempThumbPath, (coverimg) => {

                    that.Base.uploadFile("memberphoto", res.tempVideoPath, (imgurl) => {
                      var api = new AlbumApi();
                      api.upload({
                        content: imgurl,
                        cover: coverimg,
                        filetype: "V",
                        location: that.Base.getMyData().address
                      }, (ret) => {
                        that.Base.setMyData({ lastimg: ret.return });
                      });

                    });

                  });

                }
              });
              that.Base.setMyData({ recording: false });



              return;
            }
            second++;
            that.Base.setMyData({ second: second });
          }, 1000);
        }
      });

      this.Base.setMyData({ recording: true });
    }else{
      this.ctx.stopRecord({
        success: (res) => {
          //this.setData({
          //  src: res.tempThumbPath,
          //  videoSrc: res.tempVideoPath
          //})
          clearInterval(recondingtimer);
          var photos = this.Base.getMyData().photos;
          photos.push(res.tempThumbPath);
          this.Base.setMyData({ photos: photos });
          this.Base.uploadFile("memberphoto", res.tempThumbPath,(coverimg)=>{

            this.Base.uploadFile("memberphoto", res.tempVideoPath, (imgurl) => {
              var api = new AlbumApi();
              api.upload({
                content: imgurl,
                cover: coverimg,
                filetype: "V",
                location: that.Base.getMyData().address
              }, (ret) => {
                this.Base.setMyData({ lastimg: ret.return });
              });

            });

          });

        }
      });
      this.Base.setMyData({ recording: false });
    }
  }
  gotoFile(){
    var latestid = this.Base.getMyData().lastimg.id;
    wx.navigateTo({
      url: '../../pages/file/file?id='+latestid,
    })
  }
}

var recondingtimer=null;


var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.takePhoto = page.takePhoto;
body.error = page.error;
body.changeTakingType = page.changeTakingType; 
body.changeCameraType = page.changeCameraType;
body.tapRecording = page.tapRecording;
body.gotoFile = page.gotoFile;
Page(body)