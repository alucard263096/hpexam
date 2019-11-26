// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ yourphoto:"bd783cb210128ca64ad23a208541e93a_19110616017_2027498578.jpeg"})
  }
  onMyShow() {
    var that = this;
  }
  uploadmyphoto(){
    this.Base.uploadImage("facetest",(ret)=>{
      this.Base.setMyData({myphoto:ret});
    });
  }
  uploadyourphoto() {

    this.Base.uploadImage("facetest", (ret) => {
      this.Base.setMyData({ yourphoto: ret });
    });
  }
  merge(){
    var json=this.Base.getMyData();
    var that=this;

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'facemerge/test',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function (res) {
        console.log(res);
        that.Base.setMyData({ res: res.data.error_message, mergephoto:res.data.result});
        
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.uploadmyphoto = content.uploadmyphoto;
body.uploadyourphoto = content.uploadyourphoto;
body.merge = content.merge;
Page(body)