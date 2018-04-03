import { AppBase } from "../../app/AppBase"; 
import { AlbumApi } from '../../apis/album.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  goupload(){
    var that=this;
    wx.showActionSheet({
      itemList: ['照片', '视频'],
      success: function (res) {
        if (!res.cancel) {
          if(res.tapIndex==0){
            that.Base.takeImage("memberphoto",(path)=>{
              var api = new AlbumApi();
              api.upload({
                content:path,
                filetype:"P"
              },(ret)=>{
                if(ret.code=="0"){
                  wx.showToast({
                    title: '图片上传成功',
                  })
                }
              });
            });
          }
          if (res.tapIndex == 1) {
            that.Base.takeImage("memberphoto", (path) => {
              var api = new AlbumApi();
              api.upload({
                content: path,
                filetype: "V"
              }, (ret) => {
                if (ret.code == "0") {
                  wx.showToast({
                    title: '视频上传成功',
                  })
                }
              });
            });
          }
        }
      }
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.goupload = page.goupload;
Page(body)