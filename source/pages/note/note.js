import { AppBase } from "../../app/AppBase";
import { NoteApi } from '../../apis/note.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    if(options.id==undefined){
      options.id=0;
    }
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
    wx.hideShareMenu();
    this.Base.setMyData({ id: options.id});
  }
  onShow() {
    var that = this;
    super.onShow();
    
    if(this.Base.options.id>0){
      var api = new NoteApi();
      api.one({ id: this.Base.options.id}, (info) => {
        this.Base.setMyData({ content: info.content });
      });
    }
  }
  changeContent(e){
    var val=e.detail.value;

    this.Base.setMyData({ content: val });
  }
  saveNote(){
    var content = this.Base.getMyData().content;
    var id = this.Base.getMyData().id;
    var json = {  content: content };
    if(id>0){
      json.primary_id = id;
    }
    var api = new NoteApi();
    api.update(json, (ret) => {
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }else{
        this.Base.info("保存失败");
      }
    });
  }
  deleteNote() {
    var content = this.Base.getMyData().content;
    var id = this.Base.getMyData().id;
    var json = { idlist: id };
    var api = new NoteApi();
    api.adelete(json, (ret) => {
      if (ret.code == 0) {
        wx.navigateBack({

        })
      } else {
        this.Base.info("删除失败");
      }
    });
  }

}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.changeContent = page.changeContent;
body.saveNote = page.saveNote;
body.deleteNote = page.deleteNote;
Page(body)