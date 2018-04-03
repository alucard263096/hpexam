import { AppBase } from "../../app/AppBase";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
    this.ctx = wx.createCameraContext();
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
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
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.takePhoto = page.takePhoto;
body.startRecord = page.startRecord;
body.stopRecord = page.stopRecord;
body.error = page.error;
Page(body)