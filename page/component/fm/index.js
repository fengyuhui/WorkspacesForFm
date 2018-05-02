var common = require('../../../utils/util.js');
let app = getApp();
let seek = 0;
Page({
    data: {
        userInfo: {},
        music: {},
        playtime: "00:00",
        duration: "00:00",
        percent: 1,
        imgload: false,
        playing: true,
        commentscount: 0,
        sortingChioceIcon: "/image/fm/icon-go-black.png",
        activeSortingIndex: -1,
        chioceSorting: false,
        activeSortingName:"小学一年级",
        playStorage: {},
        play_id:-1,
        sortingList: [{ 
          key: 1, value: "小学一年级"
        }, {
          key: 2, value: "小学二年级"
        }, {
          key: 3, value: "小学三年级"
        }, {
          key: 4, value: "小学四年级"
        }, {
          key: 5, value: "小学五年级"
        }, {
          key: 6, value: "小学六年级"
        }], 
    },
    //事件处理函数  
    bindViewTap: function () {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },
    onLoad: function () {
        var that = this;

        app.getUserInfo(function (userInfo) {
          //更新数据  
          that.setData({
            userInfo: userInfo
          })
        });
         
        //加载列表
        wx.request({
          url: 'https://n.sqaiyan.com/sortinglists?id=2',
          success: function (res) {
            that.setData({
              sortingList: res.data.sortingList,
            });
          }
        });
        

        //加载历史
        this.setData({
          playStorage: wx.getStorageSync('playData') || [],   //调用API从本地缓存中获取数据
          StorageFlag: true,
          listFlag: true
        })

        if(playStorage!=[]){
          this.setData({
            id: playData.length,
            activeSortingIndex: that.data.index,
            activeSortingName: that.data.sortingList[index].value,
            play_id: that.globalData.curplay.id
          })
        }

        var music = app.globalData.list_fm[app.globalData.index_fm];
        var activeSortingName = "小学一年级";
        app.globalData.playtype = 2;


        if (music) {
            this.setData({
                music: music,
                duration: common.formatduration(music.duration),
            });
            common.loadrec(0, 0, that.data.music.commentThreadId, function (res) {
                that.setData({
                    commentscount: data.total
                })
            })
        } else {
            app.nextfm();
        }
    },
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },

    loadlrc: function () {
        common.loadlrc(this);
    },
    onShow: function () {
        var that = this;
        if (app.globalData.playtype == 1) {
            app.nextfm();
        }
        seek = setInterval(function () {
            common.playAlrc(that, app)
        }, 1000);
      //  wx.setNavigationBarTitle({ title: app.globalData.curplay.name + "-" + app.globalData.curplay.artists[0].name || "" });
    },
    onHide: function () {
        clearInterval(seek)
    },
    like: function () {

    },
    trash: function () {

    },
    loadimg: function (e) {
        this.setData({
            imgload: true
        })
    },
    play: function (m) {
        var that = this
        if (this.data.playing) {
            that.setData({ playing: false });
            app.stopmusic(1);
        } else {
            app.seekmusic(2, function () {
                that.setData({
                    playing: true
                });
            }, app.globalData.currentPosition);
        }
    },
    nextplay: function () {
        this.setData({
            imgload: true,
            playtime: common.formatduration(0),
            percent: .1,
            music: {},
            commentscount: 0,
            playing: false,
            showlrc: false
        })
        app.nextfm();
    },
      hideAllChioce: function () {
      this.setData({
        sortingChioceIcon: "/image/fm/icon-go-black.png",
        chioceSorting: false,
      });
    },
      //条件选择
      choiceItem: function (e) {
        this.setData({
          chioceSorting: true,
        });
      },

        //综合排序
  selectSorting: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
          sortingChioceIcon: "/image/fm/icon-go-black.png",
          activeSortingIndex: index,
          activeSortingName: this.data.sortingList[index].value,
          productList: [],
          pageIndex: 1,
          loadOver: false,
          isLoading: true,
          'currentItem': index
        })
      },
  
  ensure_type: function(e){
    chioceSorting: false,
      this.setData({
        chioceSorting:false
      })
    },
      
  scrll: function (e) {
    var scrollTop = e.detail.scrollTop
    if (scrollTop > 600) {
      this.setData({
        scrollTop: 1,
        hidden: false
      })
    } else {
      this.setData({
        scrollTop: 1,
        hidden: true
      });
    }
  },

  goTop: function () {
    this.setData({
      scrollTop: 0,
      hidden: true
    })
  },

  //添加搜索记录并搜索
  setPlayStorage: function () {
    var that = this;
    //将播放记录更新到缓存
    var playData = that.data.playStorage;
    playData.push({
      activeSortingIndex: that.data.index,
      activeSortingName: that.data.sortingList[index].value,
      play_id: that.data.play_id
    })
    wx.setStorageSync('playData', playData);
    that.setData({ StorageFlag: false, })
  }

})