import { AppBase } from "../../app/AppBase";
import { NoteApi } from '../../apis/note.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
    wx.hideShareMenu();
  }
  onShow() {
    var that = this;
    super.onShow();
    var api = new NoteApi();
    api.list({}, (list) => {
      for(var i=0;i<list.length;i++){
        list[i].updatetimespan = this.Base.util.Datetime_str(list[i].updatetimespan);
        list[i].content = list[i].content.substr(0,100);
      }
      this.Base.setMyData({ list: list });
    });
  }


}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
Page(body)