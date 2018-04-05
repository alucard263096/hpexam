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
    var albumapi = new AlbumApi();
    if(options.id!=undefined){
      albumapi.getinfo({ id: options.id },(ret)=>{
        this.Base.setMyData({info:ret});
      });
    }
  }
  onShow() {
    var that = this;
    super.onShow();
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
Page(body)