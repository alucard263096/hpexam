// pages/content/content.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { MemberApi } from "../../apis/member.api";
import { WechatApi } from '../../apis/wechat.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ mobile: "", });
  }
  onShow() {
    var that = this;
    super.onShow();
    var api = new MemberApi();
    api.memberinfo({}, (info) => {
      if (info != null) {
        if(info.mobile==null){
          info.mobile="";
        }
        this.Base.setMyData({ mobile: info.mobile });
      }
    });
  }
  save() {
    var data = this.Base.getMyData();
    var mobile = data.mobile;

    var api = new MemberApi();
    api.mobileupdate({ mobile: mobile }, (ret) => {
      if (ret.code == 0) {
        wx.navigateBack({

        })
      } else {
        wx.showToast({
          title: '保存失败',
          icon: "none"
        })
      }
    });
  }
  getPhoneNumber(e){
    console.log(e);
    var wechatapi = new WechatApi();
    var json = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    };
    console.log(json);
    wechatapi.decrypteddata(json,(ret)=>{
      if(ret.code==0){
        var mobile=ret.return.phoneNumber;
        this.Base.setMyData({mobile:mobile});
      }
    });
  }
}
var content = new Content();
content.PageName = "content";
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onShow = content.onShow;
body.getPhoneNumber = content.getPhoneNumber;
body.save = content.save;
Page(body)