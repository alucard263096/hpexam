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
    var takingtype=2;
    if(options.takingtype!=null){
      takingtype=options.takingtype;
    }
    var that = this;
    this.ctx = wx.createCameraContext();
    this.Base.setMyData({ takingtype: takingtype, cameratype: "back", photos: [], recording:false});
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
            wx.showModal({
              title: 'aaa',
              content: JSON.stringify(ret),
            })
          });

        });

      }
    })
  }
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  }
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
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

    var recording = this.Base.getMyData().recording;
    recording = !recording;
    this.Base.setMyData({ recording: recording });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.takePhoto = page.takePhoto;
body.startRecord = page.startRecord;
body.stopRecord = page.stopRecord; 
body.error = page.error;
body.changeTakingType = page.changeTakingType; 
body.changeCameraType = page.changeCameraType;
body.tapRecording = page.tapRecording;
Page(body)