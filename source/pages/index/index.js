import { AppBase } from "../../app/AppBase";
import { CategoryApi } from "../../apis/category.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that=this;
    var categoryApi = new CategoryApi();
    categoryApi.list({},function(data){
      
      that.Base.setMyData({categories:data});
    });
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  gotoList(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '../list/list?category_id='+id,
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.gotoList = page.gotoList;
Page(body)