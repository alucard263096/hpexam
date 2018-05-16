// pages/content/content.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { MemberApi } from "../../apis/member.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    var today = this.Base.util.FormatDate(this.Base.util.FormatDateTime(new Date()));
    super.onLoad(options);
    this.Base.setMyData({ name: "", birth: today, enddate: today});
  }
  onShow() {
    var that = this;
    super.onShow();
    var api = new MemberApi();
    api.memberinfo({}, (info) => {
      if(info!=null){

        var today = this.Base.util.FormatDate(this.Base.util.FormatDateTime(new Date()));
        if (info.birth == null) {
          info.birth = today;
        }
        console.log("memberinfo");
        console.log(info);
        this.Base.setMyData({name:info.name,birth:info.birth });
      }
    });
  }
  changeName(e){
    var name=e.detail.value;  
    this.Base.setMyData({name:name});
  }
  birthChange(e) {
    var birth = e.detail.value;
    this.Base.setMyData({ birth: birth });
  }
  save(){
    var data=this.Base.getMyData();
    var name=data.name;
    var birth=data.birth;

    var api = new MemberApi();
    api.infoupdate({name:name,birth:birth}, (ret) => {
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }else{
        wx.showToast({
          title: '保存失败',
          icon:"none"
        })
      }
    });
  }
}
var content = new Content();
content.PageName = "content";
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onShow = content.onShow;
body.changeName = content.changeName; 
body.birthChange = content.birthChange;
body.save = content.save;
Page(body)