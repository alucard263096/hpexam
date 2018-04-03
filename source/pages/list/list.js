import { AppBase } from "../../app/AppBase";
import { ExamApi } from "../../apis/exam.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=5;
    this.Base.Page = this;
    super.onLoad(options);

    var that = this;
    var examApi = new ExamApi();
    examApi.list({category_id:options.category_id}, function (data) {
      if (data.length == 1) {
        wx.navigateBack({
          success() {
            wx.navigateTo({
              url: '../exam/exam?id=' + data[0].id,
            });
          }
        });
        return;
      }
      that.Base.setMyData({ exams: data });
    });
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  gotoExam(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../exam/exam?id=' + id,
    });
  }
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad;
body.onShow = page.onShow;
body.gotoExam = page.gotoExam;
Page(body)