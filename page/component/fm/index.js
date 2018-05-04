var common = require('../../../utils/util.js');
let app = getApp();
let seek = 0;
let defaultdata = {
  playing: false,
  music: {},
  playtime: '00:00',
  duration: '00:00',
  percent: 1,
  disable: false
};
Page({
    data: {
        userInfo: {},
        music: {},
        playtime: "00:00",
        duration: "00:00",
        percent: 1,
        imgload: false,
        playing: false,
        commentscount: 0,
        sortingChioceIcon: "/image/music88.png",

        music_title:"美丽的多瑙河",

        activeSortingIndex: 0,
        activeSortingName: "小学一年级",
        activeSubtypeIndex: -1,
        activeSubtypeName:"",

        //判断缓存是否已经读完
        // flag_sortId:false,
        // flage_sortName:false,
        // flag_subtypeId:false,
        // flag_subtypeName:false,
        // flag_music_id:false,

        //判断是否有缓存
        flag_storage:false,


        chioceSorting: false,
        // playStorage: [{activeSortingIndex: 0,
        //   activeSortingName: 0,
        //   music_id: 0,
        //   activeSubtypeIndex: 0}],
       
        
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
      subtypesList:{
         subtypesList1:[{subtypesId: '1', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '2', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '3', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '4', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList2:[{ subtypesId: '5', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '6', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '7', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '8', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList3: [{ subtypesId: '9', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '10', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '11', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '12', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList4: [{ subtypesId: '13', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '14', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '15', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '16', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList5: [{ subtypesId: '13', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '14', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '15', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '16', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList6: [{ subtypesId: '13', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '14', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '15', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '16', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList7: [{ subtypesId: '13', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '14', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '15', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '16', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }],
         subtypesList8: [{ subtypesId: '13', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '14', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '15', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { subtypesId: '16', subtypeName: '活力早餐', subtypeIcon: '/image/music88.png' }]
    }
        },
    onLoad: function () {
        var that = this;
        
        this.playMusic(1);

        app.getUserInfo(function (userInfo) {
          //更新数据  
          that.setData({
            userInfo: userInfo
          })
        });

        //加载类别列表
        wx.request({
          url: app.globalData.homeUrl+'/getSortinglists',
          success: function (res) {
            that.setData({
              //sortingList: res.data.sortingList,
              sortingList: res.data.sortingList,
            });
          }
        });
        
        //调用API从本地缓存中获取分类id数据
        if (wx.getStorageSync('activeSortingIndex') != null) {
          app.globalData.activeSortingIndex = wx.getStorageSync('activeSortingIndex');
          console.log("读取分类id缓存成功" + app.globalData.activeSortingIndex);
          that.setData({
            activeSortingIndex: app.globalData.activeSortingIndex,
            flag_storage: true
          });
        }

        //调用API从本地缓存中获取分类名称数据
        if (wx.getStorageSync('activeSortingName')!=null){
          app.globalData.activeSortingName = wx.getStorageSync('activeSortingName');
          console.log("读取分类名称缓存成功" + app.globalData.activeSortingName);
          that.setData({
            activeSortingName: wx.getStorageSync('activeSortingName'),
            flag_storage: true
          });
        }

        //调用API从本地缓存中获取子分类id数据
        if (wx.getStorageSync('activeSubtypeIndex')!=null){
          app.globalData.activeSubtypeIndex = wx.getStorageSync('activeSubtypeIndex');
          console.log("读取子分类id缓存成功" + app.globalData.activeSubtypeIndex);
          that.setData({
            flag_storage: true,
            activeSubtypeIndex: app.globalData.activeSubtypeIndex
          });
        }
        

        //调用API从本地缓存中获取子分类名称数据
        if (wx.getStorageSync('activeSubtypeName')!=null){
          app.globalData.activeSubtypeName = wx.getStorageSync('activeSubtypeName');
          console.log("读取子分类名称缓存成功" + app.globalData.activeSubtypeName);
          that.setData({
            flag_storage: true,
            activeSubtypeName: app.globalData.activeSubtypeName
          });
        };


        //调用API从本地缓存中获取音乐id数据
        if (wx.getStorageSync('music_id') != null) {
          app.globalData.curplay.music_id = wx.getStorageSync('music_id');
          console.log("读取子分类名称缓存成功" + app.globalData.curplay.music_id);
          that.setData({
            flag_storage: true
          });
        };

        // 加载历史缓存
        // if (playStorage!=[]){
        //   this.setData({
        //     activeSortingIndex: that.data.index,
        //     activeSortingName: that.data.sortingList[index].value,
        //     music_id: that.globalData.curplay.id,
        //     activeSubtypeIndex: that.data.activeSubtypeIndex
        //   })
        // }

        if (!that.data.flag_storage){ //没有音乐缓存，加载第一个分类的子分类，并等用户点击子分类再播放
          //没有音乐播放
          console.log("that" + that.data.flag_storage);
          app.globalData.globalStop = true;
          wx.stopBackgroundAudio();
          console.log("name" + app.globalData.activeSortingName);

          //加载子分类列表
          wx.request({
            url: app.globalData.homeUrl +'/getSubtypelist?key=0',
            success: function (res) {
              that.setData({
                subtypesList: res.data.subtypesList,
              });
            }
          });

          //在右上角显示用户选择的分类
          app.globalData.activeSortingIndex=0;
          app.globalData.activeSortingName=this.data.sortingList[0].value;
          this.setData({
            sortingChioceIcon: "/image/music88.png",
            activeSortingIndex:0,
            activeSortingName:this.data.sortingList[0].value,
            pageIndex: 1,
            loadOver: false,
            isLoading: true,
            'currentItem': 0
          })
        }
        //有音乐缓存则播放之前的音乐
        else{
          that.playMusic(app.globalData.curplay.music_id);
        }

        /**
             * 监听音乐自然播完停止
             */
        wx.onBackgroundAudioStop(function () {
          console.log('onBackgroundAudioStop')
          that.playother(1);
        })
        
    },
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },

    playMusic: function (id) {
      var that = this;
      //无接口测试，要删的！！
      that.setData({
        duration: "02:56"
      })
      wx.request({
        url: app.globalData.homeUrl +'/getSong?id=' + id,
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          app.globalData.curplay = res.data.songs[0];
          if (!res.data.songs[0].mp3Url) {
            console.log("mp3链接不存在");
            that.setData({
              disable: true
            })
          } else {
            console.log("获取成功");
            wx.playBackgroundAudio({
              dataUrl: app.globalData.curplay.mp3Url,
              title: app.globalData.curplay.name,
              success: function (res) {
                app.globalData.globalStop = false;
                this.setPlayStorage();//存缓存
                that.setData({
                  music_title: app.globalData.curplay.name,
                  playing:true,
                  duration: common.formatduration(app.globalData.curplay.duration * 1000)
                })
                
              }
            });
            wx.setNavigationBarTitle({ title: app.globalData.curplay.name});
          }
        },
        fail: function(e){
          console.log("获取失败");



          //假设数据test
          console.log("获取成功");
          
          wx.playBackgroundAudio({

            dataUrl: 'https://t1.aixinxi.net/o_1cciqnctd7tqqa41isru211uc7c.mp3',
            title: "啦啦啦",

            success: function (res) {
              app.globalData.globalStop = false;
              that.setPlayStorage();//存缓存
              that.setData({
                music_title: "啦啦啦",
                playing: true
              })

              console.log("duration" + that.data.duration);
            }
          });
          wx.setNavigationBarTitle({
            title: "啦啦啦"
          });
        }
      });
    },

    // loadlrc: function () {
    //     common.loadlrc(this);
    // },
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
        clearInterval(seek);
        setPlayStorage();
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

    //暂停和播放
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
            duration: common.formatduration(0),
            percent: .1,
            music: {},
            commentscount: 0,
            playing: false,
            showlrc: false
        })
        app.preplay();
 
        app.globalData.curplay = list[index] || {};

    },

    //切换音频
    playother: function (e) { //signal为1时下一首，为-1时上一首
      this.setPlayStorage();//存缓存
      var type = 1;
      if(e == 1){
        var signal = 1;
      }
      else{
        var signal = e.currentTarget.dataset.signal;
      }
      console.log("signal"+signal);
      this.setData({
        imgload: true,
        playtime: common.formatduration(0),
        duration: common.formatduration(0),
        percent: .1,
        music: {},
        commentscount: 0,
        playing: false,
        showlrc: false
      }) //音频数据清空
     
      //加载下一播放音频id
      wx.request({
        url: app.globalData.homeUrl + '/getOtherSong?id='+app.globalData.activeSubtypeIndex+ +'&music_id=' + app.globalData.curplay.music_id+'&signal='+signal,
        success: function (res) {
          app.globalData.curplay.music_id = res.data.music_id; 
          app.globalData.activeSortingIndex = res.data.sorting_id;
          app.globalData.activeSubtypeIndex = res.data.subtype_id;
          app.globalData.activeSortingName = res.data.sorting_name;

          this.setData({//把分类和子类都刷新一下
            activeSortingIndex: res.data.sorting_id,
            activeSortingName: res.data.sorting_name,
            activeSubtypeIndex: res.data.subtype_id,
            activeSubtypeName: res.data.subtype_name,
            
          });

          //播放新音频
          playMusic(app.globalData.curplay.music_id);
        }
      });
    },

      hideAllChioce: function () {
      this.setData({
        sortingChioceIcon: "/image/music88.png",
        chioceSorting: false,
      });
    },
      //条件选择
      choiceItem: function (e) {
        this.setData({
          chioceSorting: true,
        });
      },

        //选择分类
  selectSorting: function (e) {
        var index = e.currentTarget.dataset.index;

        //加载子分类列表
        wx.request({
          url: app.globalData.homeUrl+'/getSubtypelist?key=' + this.data.sortingList[index].key,
          success: function (res) {
            that.setData({
              subtypesList: res.data.subtypesList ,
            });
          }
        });

        //显示选择的分类
        this.setData({
          sortingChioceIcon: "/image/music88.png",
          activeSortingIndex: this.data.sortingList[index].key,
          activeSortingName: this.data.sortingList[index].value,
          productList: [],
          pageIndex: 1,
          loadOver: false,
          isLoading: true,
          'currentItem': index
        })

        console.log("key" + this.data.activeSortingIndex);
      },


  //选择子分类
  choiceSub: function (e) {
    var obj = e.currentTarget.dataset.obj;
    var index = e.currentTarget.index;
    //显示选择的子分类
    this.setData({
      sortingChioceIcon: "/image/music88.png",
      activeSubtypeIndex: obj.subtypesId,
      activeSubtypeName: obj.subtypeName,
      pageIndex: 1,
      loadOver: false,
      isLoading: true,
    })
    console.log("subtypeName" + obj.subtypeName);

    //根据子分类来获取音频：

    var that = this;
    wx.request({
      url: app.globalData.homeUrl + '/getFirstSong?id=' + obj.subtypesId,
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        app.globalData.curplay = res.data.songs[0];
        if (!res.data.songs[0].mp3Url) {
          console.log("mp3链接不存在");
          that.setData({
            disable: true
          })
        } else {
          wx.playBackgroundAudio({
            dataUrl: res.data.songs[0].mp3Url,
            title: res.data.songs[0].name,
            success: function (res) {
              app.globalData.globalStop = false;
              that.setData({
                playing: true
              })
            }
          });
          wx.setNavigationBarTitle({
            title: app.globalData.curplay.name
            // + "-" + app.globalData.curplay.artists[0].name 
          });
        }
      }
    });
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

  typescrll: function (e) {
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

  //添加当前播放记录到缓存
  setPlayStorage: function () {
    //将播放记录更新到缓存
    var that = this;
    
    wx.setStorage({
      key: 'activeSortingIndex',
      data: that.data.activeSortingIndex,
      success: function (res) {
        console.log('异步保存分类id成功')
      }
    }),
      wx.setStorage({
        key: 'music_id',
        data: app.globalData.curplay.music_id,
        success: function (res) {
          console.log('异步保存音乐id成功')
        }
      }),
      wx.setStorage({
        key: 'activeSortingName',
        data: that.data.activeSortingName,
      success: function (res) {
        console.log('异步保存分类名称成功')
      }
    }),

      wx.setStorage({
        key: 'activeSubtypeIndex',
        data: that.data.activeSubtypeIndex,
          success: function (res) {
            console.log('异步保存子分类id成功')
          }
      }),

      wx.setStorage({
      key: 'activeSubtypeName',
      data: that.data.activeSubtypeName,
      success: function (res) {
        console.log('异步保存子分类名称成功')
      }
    }),

      // var playData = that.data.playStorage;
    // playData.push({
    //   activeSortingIndex: that.data.index,
    //   activeSortingName: that.data.sortingList[index].value,
    //   music_id: that.data.music_id,
    //   activeSubtypeIndex: that.data.activeSubtypeIndex
    // })

    //wx.setStorageSync('playData', playData);
    that.setData({ StorageFlag: false, })
  },

  //转发
  onShareAppMessage: (res) => {
    if (res.from === 'view') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单");
    }
    return {
      title: '学优优FM',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
    
  } 
})