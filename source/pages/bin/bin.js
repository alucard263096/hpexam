// pages/content/content.js
import { AppBase } from "../../app/AppBase";
import { ApiConfig } from "../../apis/apiconfig";
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.hideShareMenu({
      
    })
  }

  onShow() {
    var that = this;
    super.onShow();
    
    var albumapi = new AlbumApi();
    albumapi.binphoto({},(list)=>{
      this.Base.setMyData({list});
    });
  }

  selectItem(e){
    console.log(e);
    var id=e.currentTarget.id;
    var list=this.Base.getMyData().list;
    for(var i=0;i<list.length;i++){
      if(list[i].id==id){
        list[i].selected = list[i].selected==true?false:true;
      }
    }
    this.Base.setMyData({list:list});
  }
  recover(){
    var ids=[];
    var list = this.Base.getMyData().list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].selected == true) {
        ids.push(list[i].id);
      }
    }
    if(ids.length==0){
      wx.showModal({
        title: '提示',
        content: '请至少选择一个文件进行恢复',
        showCancel:false
      })
    }
    var albumapi = new AlbumApi();
    albumapi.recoverphoto({ids:ids.join(",")}, (ret) => {
      if(ret.code==0){
        albumapi.binphoto({}, (list) => {
          this.Base.setMyData({ list });
        });
      }
    });
  }
}
var content = new Content();
content.PageName = "content";
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onShow = content.onShow; 
body.selectItem = content.selectItem;
body.recover = content.recover;
Page(body)