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
    var examApi = new ExamApi();
    examApi.detail({ exam_id: options.id }, function (data) {
      for(var i=0;i<data.length;i++){
        data[i].no = i + 1;
        data[i].val = "";
      }
      that.Base.setMyData({ questions: data, current: 1, fillno: 0,issubmit:false });
    });
  }
  onShow() {
    var that = this;
    super.onShow();
  }
  lastQ() {
    
    var current=Number(this.Base.getMyData().current);
    if(current==1){
      return;
    }
    this.Base.setMyData({  current: current-1 });
  }
  nextQ(){
    var data = this.Base.getMyData();
    var current = Number(data.current);
    if (current >= data.length) {
      return;
    }
    this.Base.setMyData({  current: current +1 });
  }
  radioChange(e){
    console.log(e);
    
    var id=e.currentTarget.id;
    var value=e.detail.value;
    var data=this.Base.getMyData();
    var questions=data.questions;

    var issubmit = data.issubmit;
    if(issubmit==true){
      return;
    }
    console.log("??");
    var fillno=0;
    for(var i=0;i<questions.length;i++){
      if (questions[i].no == id){
        questions[i].val = value;
      }
      if (questions[i].val!=""){
        fillno++;
      }
    }
    var current = Number(data.current);
    if (current < questions.length) {
      current++;
    }
    //current: current , 
    this.Base.setMyData({ questions: questions, fillno: fillno});
  }
  showCard(){

    this.Base.setMyData({ showcard:true });
  }
  gotoQuetion(e){
    var no = e.currentTarget.id;
    this.Base.setMyData({ showcard: false,current:no });
  }
  submit(e) {
    var data = this.Base.getMyData();
    var questions = data.questions;
    var fillno = data.fillno;
    var that=this;
    if (fillno<questions.length){
      wx.showModal({
        title: '你的题目还没有' + (questions.length - fillno).toString()+'题完成，是否确认提交?',
        content: '',
        success:function(e){
            if(e.confirm){
              var score=0;
              for(var i=0;i<questions.length;i++){
                score+=questions[i].val==questions[i].anwser?1:0;
              }
              score = score * 1.0 / questions.length*100;
              score = score.toFixed(0);
              that.Base.setMyData({ issubmit: true, showcard: true, score });
            }
        }
      })
    }else{
      wx.showModal({
        title: '是否确认提交?',
        content: '',
        success: function (e) {
          if (e.confirm) {
            var score = 0;
            for (var i = 0; i < questions.length; i++) {
              score += questions[i].val == questions[i].anwser ? 1 : 0;
            }
            score = score*1.0 / questions.length*100;
            score = score.toFixed(0);
            that.Base.setMyData({ issubmit: true, showcard: true, score });
          }
        }
      })
    }
  }
  makebooking(){
    wx.navigateTo({
      url: '../rader/rader',
    })
  }
  
}
var page = new Content();
var body = page.generateBodyJson();
body.onLoad = page.onLoad; 
body.onShow = page.onShow;
body.lastQ = page.lastQ; 
body.nextQ = page.nextQ;
body.radioChange = page.radioChange; 
body.showCard = page.showCard; 
body.gotoQuetion = page.gotoQuetion; 
body.submit = page.submit;
body.makebooking = page.makebooking;
Page(body)