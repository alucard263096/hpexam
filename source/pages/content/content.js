// pages/content/content.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { ContentApi } from "../../apis/content.api";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onShow(){
    var keycode = this.Base.options.keycode;
    var title = this.Base.options.title;
    var contentapi = new ContentApi();
    var that = this;
    contentapi.geta({ keycode: keycode}, function (data) {
      if (data == false||data==null) {
        WxParse.wxParse('content', 'html', "请去后台设置文字内容", that, 10);
        that.setData({ title: title });
      }else{

        data.content = that.Base.util.HtmlDecode(data.content);
        WxParse.wxParse('content', 'html', data.content, that, 10);
        that.setData({ title: data.name });
      }
    });
  }
}
var content = new Content();
content.PageName = "content";
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onShow = content.onShow;
Page(body)