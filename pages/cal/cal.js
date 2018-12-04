Page({

  /**
   * 页面的初始数据
   */
  data: {
    id1: "back",
    id2: "clear",
    id3: "negative",
    id4: "+",
    id5: "9",
    id6: "8",
    id7: "7",
    id8: "-",
    id9: "6",
    id10: "5",
    id11: "4",
    id12: "×",
    id13: "3",
    id14: "2",
    id15: "1",
    id16: "÷",
    id17: "0",
    id18: ".",
    id19: "history",
    id20: "=",
    screenData: "0", //显示的数据
    lastIsOperator: false, //最后一位是否操作符
    arr: [], //一次计算的操作数
    logs: [] //本地保存的日志
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 跳转到历史页面
   */
  toHistory: function() {
    wx.navigateTo({
      url: '../history/history',
    })
  },

  /**
   * 点击按钮
   */
  clickButton: function(event) {
    console.log(event.target.id);
    var id = event.target.id;
    if (id == this.data.id1) { //退格
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }
      data = data.substring(0, data.length - 1); //去掉最后一位
      if (data == "" || data == "-") {
        data = 0;
      }
      this.setData({
        screenData: data
      });
      this.data.arr.pop(); //弹出数组的最后一位
    } else if (id == this.data.id2) { //清屏
      this.setData({
        screenData: "0"
      });
      this.data.arr.length = 0; //数组清空
    } else if (id == this.data.id3) { //正负号
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }
      var firstWord = data.substring(0, 1); //截取符号位
      if (firstWord == "-") { //如果是负号，再次点击则删除符号位
        data = data.substring(1, data.length);
        this.data.arr.shift();
      } else { //如果是正号，再次点击则添加符号位
        data = "-" + data;
        this.data.arr.unshift("-");
      }
      this.setData({
        screenData: data
      });
    } else if (id == this.data.id20) { // =
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }
      var lastWord = data.substring(data.length - 1, data.length); //截取最后一位
      if (isNaN(lastWord)) { //最后一位不是数字
        return;
      }
      var num = "";
      var lastOperator; //最后一个操作符
      var arr = this.data.arr;
      var optarr = []; //把所有的操作符放到数组中
      for (var i in arr) {
        if (isNaN(arr[i]) == false || arr[i] == this.data.id18 || arr[i] == this.data.id3) {
          num += arr[i];
        } else {
          lastOperator = arr[i];
          optarr.push(num);
          optarr.push(arr[i]);
          num = "";
        }
      }
      optarr.push(Number(num));
      var result = Number(optarr[0]) * 1.0;
      console.log(result)
      for (var i = 1; i < optarr.length; i++) {
        if (isNaN(optarr[i])) {
          if (optarr[1] == this.data.id4) {
            result += Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id8) {
            result -= Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id12) {
            result *= Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id16) {
            result /= Number(optarr[i + 1]);
          }
        }
      }

      //把算术和结果缓存到本地
      this.data.logs.push(data + "=" + result);
      wx.setStorageSync('calLogs', this.data.logs);
      this.data.arr.length = 0;
      this.data.arr.push(result);
      this.setData({
        screenData: result + ""
      });
    } else {
      if (id == this.data.id4 || id == this.data.id8 || id == this.data.id12 || id == this.data.id16) { // + - * /
        if (this.data.lastIsOperator == true || this.data.screenData == 0) {
          return;
        }
      }
      var sd = this.data.screenData;
      var data;
      if (sd == 0) {
        data = id;
      } else {
        data = sd + id; //把数字拼接到一起
      }
      this.setData({
        screenData: data
      });
      this.data.arr.push(id);

      if (id == this.data.id4 || id == this.data.id8 || id == this.data.id12 || id == this.data.id16) { // + - * /
        this.setData({
          lastIsOperator: true
        });
      } else {
        this.setData({
          lastIsOperator: false
        });
      }
    }
  }
})