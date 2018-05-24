import { AppBase } from "../../app/AppBase";
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    //options.album=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
    var albumapi = new AlbumApi();
    if(options.id!=undefined){
      albumapi.getinfo({ id: options.id },(ret)=>{
        ret.primary_id=ret.id;
        this.Base.setMyData({info:ret});
      });
    }else{
      this.Base.setMyData({ info: { id: "0", name: "", isdefault: "N", status: "A", password: "", albumtype: options.albumtype} });
    }
  }
  onShow() {
    var that = this;
    super.onShow();
  } 
  changeName(e){
    var val=e.detail.value;
    var info=this.Base.getMyData().info;
    info.name = val;
    this.Base.setMyData({ info: info });
  }
  changePassword(e) {
    var val = e.detail.value;
    var info = this.Base.getMyData().info;
    info.password = val;
    this.Base.setMyData({ info: info });
  }
  changeDefault(e){
    var info = this.Base.getMyData().info;
    info.isdefault = info.isdefault == "Y" ? "N" : "Y";
    this.Base.setMyData({ info: info });
  }
  save(){

    var info = this.Base.getMyData().info; 
    if(info.name==""){
      wx.showModal({
        title: '提示',
        content: '相册名称不能为空',  
        showCancel:false
      });
      return;
    }
    var albumapi = new AlbumApi(); 
    albumapi.update(info, (ret) => {
      if(ret.code=="0"){
        wx.showToast({
          title: '保存成功',
        })
        wx.navigateBack({
          
        });
      }
      
    });
  }
  back(){
    wx.navigateBack({

    });
  }
  deletea() {
    var info = this.Base.getMyData().info; 
    wx.showModal({
      title: '提示',
      content: '删除相册后将不可逆，是否继续操作？',
      success(res){
        if(res.confirm){
          var albumapi = new AlbumApi();
          albumapi.delete({ idlist: info.id }, (ret) => {
            if (ret.code == "0") {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack({

              });
            }

          });
        }
      }
    })
    
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow; 
body.changeName = page.changeName;
body.changePassword = page.changePassword; 
body.changeDefault = page.changeDefault;
body.save = page.save;
body.back = page.back;
body.deletea = page.deletea;
Page(body)