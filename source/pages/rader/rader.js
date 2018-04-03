import { AppBase } from "../../app/AppBase";
import { ExamApi } from "../../apis/exam.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=1;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
  }
  onShow() {
    var that = this;
    setTimeout(function(){
      that.Base.setMyData({showteacher:true});
    },5000);
  }
  selectteacher() {
    var that = this;
    that.Base.setMyData({ selected: true });
  }
  gopayment(){
    wx.showModal({
      title: '支付',
      content: '该老师需要支付20元进行题目讲解，请问是否支付',
      success:function(e){
        if(e.confirm){
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];  //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面

          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            inasking: true
          })

          wx.navigateBack();

        }
      }
    })
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.selectteacher = page.selectteacher;
body.gopayment = page.gopayment;
Page(body)