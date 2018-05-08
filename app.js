//var fm = require('../page/component/fm/index.js');
App({
  onLaunch: function () {
    var that = this;
    wx.onBackgroundAudioStop(function () {
      if (that.globalData.globalStop) {
        
        return;
        
      }
      //that.nextplay(1);
    });

  },
  
  nextplay: function (t) {
    //播放列表中下一首
    this.preplay();
    var list = this.globalData.list_am;
    var index = this.globalData.index_am;
    if (t == 1) {
      index++;
    } else {
      index--;
    }
    index = index > list.length - 1 ? 0 : (index < 0 ? list.length - 1 : index);
    this.globalData.curplay = list[index] || {};
    this.globalData.index_am = index;
    this.seekmusic(1)
  },


  nextfm: function () {
    //下一首fm
    this.preplay()
    var that = this;
    var list = that.globalData.list_fm;
    var index = that.globalData.index_fm;
    index++;
    this.globalData.playtype = 2;
    if (index > list.length - 1) {
      that.getfm();

    } else {
      console.log("获取下一首fm")
      that.globalData.index_fm = index;
      that.globalData.curplay = list[index];
      that.seekmusic(2);
    }

  },
  preplay: function () {
    //歌曲切换 停止当前音乐
    this.globalData.globalStop = true;
    wx.stopBackgroundAudio();
  },


  getfm: function () {
    var that = this;
    console.log("重新获取")
    wx.request({
      url: 'https://n.sqaiyan.com/fm?t=' + (new Date()).getTime(),
      method: 'GET',
      success: function (res) {
        that.globalData.list_fm = res.data.data;
        that.globalData.index_fm = 0;
        that.globalData.curplay = res.data.data[0];
        that.seekmusic(2);
      }
    })
  },


  stopmusic: function (type, cb) {
    var that = this;
    wx.pauseBackgroundAudio();
    wx.getBackgroundAudioPlayerState({
      complete: function (res) {
        that.globalData.currentPosition = res.currentPosition || '0'
      }
    })
  },

  //暂停后播放
  seekmusic: function (type, cb, seek) {
    var that = this;
    console.log("type:",type);
    console.log("seek:"+seek);
    var m = that.globalData.curplay;
    console.log("music_id:" + that.globalData.curplay.id);
    that.globalData.playtype = type;
    if (type == 1) {
      wx.request({
        url: that.globalData.homeUrl+'/getSong?id=' + that.globalData.curplay.id,
        success: function (res) {
          console.log("success"+JSON.stringify(res));
          that.globalData.curplay = res.data.songs;
          wx.playBackgroundAudio({
            dataUrl: res.data.songs.location,
            title: res.data.songs.courseName,
            success: function (res) {
              console.log("mp3:" + JSON.stringify(res));
              if (seek != undefined) {
                wx.seekBackgroundAudio({ position: seek })
              };
              that.globalData.globalStop = false;
              cb && cb();
            },
            fail: function (res) {
              //that.nextplay(1)
              console.log("fail:" + JSON.stringify(res));
            }
          })
        },
        fail: function(res){
          console.log("fail:" + JSON.stringify(res));
        }
      })
    }

    wx.playBackgroundAudio({
      dataUrl: res.data.songs.location,
      title: res.data.songs.courseName,
      success: function (res) {
        console.log("mp3:" + JSON.stringify(res));
        if (seek != undefined) {
          wx.seekBackgroundAudio({ position: seek })
        };
        that.globalData.globalStop = false;
        cb && cb();
      },
      fail: function (res) {
        //that.nextplay(1)
        console.log("fail:" + JSON.stringify(res));
      }
    })

    
  },
  shuffleplay: function (shuffle) {
    //播放模式shuffle，1顺序，2单曲，3随机
    var that = this;
    that.globalData.shuffle = shuffle;
    if (shuffle == 1) {
      that.globalData.list_am = that.globalData.list_sf;
    }
    else if (shuffle == 2) {
      that.globalData.list_am = [that.globalData.curplay]
    }
    else {
      that.globalData.list_am = [].concat(that.globalData.list_sf);
      var sort = that.globalData.list_am;
      sort.sort(function () {
        return Math.random() - (0.5) ? 1 : -1;
      })

    }
    for (let s in that.globalData.list_am) {
      if (that.globalData.list_am[s].id == that.globalData.curplay.id) {
        that.globalData.index_am = s;
      }
    }
  },
  onShow: function () {
  },
  onHide: function () {
    wx.setStorageSync('globalData', this.globalData);
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    homeUrl:"https://w.xueyouyou.vip", 
    //mp3UrlHeader:"https://mp3.xueyouyou.vip/",
    mp3UrlHeader: "https://w.xueyouyou.vip/course/",
    iconUrlHeader: "https://w.xueyouyou.vip/icon/", 
    list_am: [],
    list_fm: [],
    list_sf: [],
    index_fm: 0,
    index_am: 0,
    playtype: 1, //播放音频
    curplay: {},
    shuffle: 1,
    duration: '00:00',
    globalStop: true,
    currentPosition: 0,
    activeSortingIndex: 0,
    activeCuritem:0,
    activeSortingName: "",
    activeSubtypeIndex: -1,
    activeSubtypeName:"",
    playStop: false
  }
})
