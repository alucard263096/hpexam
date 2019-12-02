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
    this.Base.setMyData({
      array: ["请选择", "日期", "面单号", "投递地址", "收件人姓名", "收件人电话", "代收货款", "备注"],
      array2: ["", "riqi", "miandanhao", "dizhi", "xingming", "dianhua", "huokuan", "beizhu"],
      st:[]
    });
  }
  onMyShow() {
    var that = this;
  }
  uploadmyphoto(){
    this.Base.uploadImage("facetest",(ret)=>{
      this.Base.setMyData({myphoto:ret});
      var instApi = new InstApi();
      instApi.card({ photo: ret }, (res)=>{
        this.Base.setMyData({
          shujulist: res.words_result,
          st: []});
      });
    });
  }
  bindPickerChange(e){

    console.log(e);

    var val = Number(e.detail.value);
    var st=this.Base.getMyData().st;
    st[e.currentTarget.id]=val;
    this.Base.setMyData({st});
    
  }
  submit(e){
    console.log(e);
    var instApi = new InstApi();
    instApi.upload(e.detail.value, (res) => {
      this.Base.info(res.result);
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.uploadmyphoto = content.uploadmyphoto;
body.uploadyourphoto = content.uploadyourphoto; 
body.merge = content.merge;
body.submit = content.submit;
body.bindPickerChange = content.bindPickerChange;
Page(body)