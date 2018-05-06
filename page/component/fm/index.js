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
        activeCuritem: 0,
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
          id: 1, typeName: "小学一年级"
        }, {
          id: 2, typeName: "小学二年级"
        }, {
          id: 3, typeName: "小学三年级"
        }, {
          id: 4, typeName: "小学四年级"
        }, {
          id: 5, typeName: "小学五年级"
        }, {
          id: 6, typeName: "小学六年级"
        }], 

      subtypesList_new:{},

      subtypesList:[
        { id: '1', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '2', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '3', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '4', typeName: '活力早餐', subtypeIcon: '/image/music88.png' },
        { id: '5', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '6', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '7', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '8', typeName: '活力早餐', subtypeIcon: '/image/music88.png' },
        { id: '9', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '10', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '11', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '12', typeName: '活力早餐', subtypeIcon: '/image/music88.png' },
        { id: '13', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '14', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '15', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '16', typeName: '活力早餐', subtypeIcon: '/image/music88.png' },
        { id: '13', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '14', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '15', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '16', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '16', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '16', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }, { id: '16', typeName: '活力早餐', subtypeIcon: '/image/music88.png' }
      ]
        },
    onLoad: function () {
        var that = this;

        //that.playMusic(1);

        that.turnSubtype();

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

        //调用API从本地缓存中获取分类index数据
        if (wx.getStorageSync('activeCuritem') != null) {
          app.globalData.activeCuritem = wx.getStorageSync('activeCuritem');
          console.log("读取分类index缓存成功" + app.globalData.activeCuritem);
          that.setData({
            activeCuritem: app.globalData.activeCuritem,
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
          app.globalData.curplay.id = wx.getStorageSync('music_id');
          console.log("读取音乐id缓存成功" + app.globalData.curplay.id);
          that.setData({
            flag_storage: true
          });
        };

        // 加载历史缓存
        // if (playStorage!=[]){
        //   this.setData({
        //     activeSortingIndex: that.data.index,
        //     activeSortingName: that.data.sortingList[index].typeName,
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
                subtypesList: res.data.sortingList,
              });
              that.turnSubtype();
            }
          });

          //在右上角显示用户选择的分类
          app.globalData.activeSortingIndex=0;
          app.globalData.activeSortingName=that.data.sortingList[0].typeName;
          that.setData({
            sortingChioceIcon: "/image/music88.png",
            activeSortingIndex:0,
            activeSortingName:that.data.sortingList[0].typeName,
            pageIndex: 1,
            loadOver: false,
            isLoading: true,
            'currentItem': 0
          })
        }
        //有音乐缓存则播放之前的音乐
        else{
          that.playMusic(app.globalData.curplay.id);//为了测试暂时删掉这行，要加回来的！
          //that.playMusic(1);
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


      that.setPlayStorage();//存缓存

      console.log("music_id"+id);

      //清除播放进度
      wx.seekBackgroundAudio({
        position: 0
      })

      wx.request({
        url: app.globalData.homeUrl +'/getSong?id=' + id,
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          app.globalData.curplay = res.data.songs[0];
          if (!res.data.songs[0].location) {
            console.log("mp3链接不存在");
            that.setData({
              disable: true
            })
          } else {
            console.log("获取成功");
            wx.playBackgroundAudio({
              dataUrl: mp3UrlHeader+app.globalData.curplay.location,
              title: app.globalData.curplay.courseName,
              success: function (res) {
                app.globalData.globalStop = false;
                
                that.setPlayStorage();//存缓存
                that.setData({
                  music_title: app.globalData.curplay.courseName,
                  playing:true,
                  music: app.globalData.curplay
                }) 
              }
            });
            wx.setNavigationBarTitle({ title: app.globalData.curplay.courseName});
          }
        },
        fail: function(e){
          console.log("获取失败");
          wx.showToast({
            title: '获取失败',
            duration: 1000,
            icon: 'loading',
            mask: true
          }
          );


          //假设数据test
          console.log("获取成功");
          
          wx.playBackgroundAudio({

            dataUrl: 'http://t1.aixinxi.net/o_1ccn07dld1jfr18fo1akauvp1st0a.mp3',
            title: "获取失败",

            success: function (res) {
              app.globalData.globalStop = false;
              that.setPlayStorage();//存缓存
              that.setData({
                music_title: "获取失败",
                playing: true
              })

              console.log("duration" + that.data.duration);
            }
          });
          wx.setNavigationBarTitle({
            title: app.globalData.curplay.courseName
          });
        }
      });
    },

    // loadlrc: function () {
    //     common.loadlrc(this);
    // },
    onShow: function () {
        var that = this;
        seek = setInterval(function () {
            common.playAlrc(that, app)
        }, 1000);
      //  wx.setNavigationBarTitle({ title: app.globalData.curplay.courseName + "-" + app.globalData.curplay.artists[0].name || "" });
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

    //切换音频
    playother: function (e) { //signal为1时下一首，为-1时上一首
      var that = this;
      that.setPlayStorage();//存缓存

      wx.getBackgroundAudioPlayerState({
        complete: function (res) {
          app.globalData.currentPosition = '0'
        }
      })

      var type = 1;
      if(e == 1){//自然播放完
        var signal = 1;
      }
      else{
        var signal = e.currentTarget.dataset.signal;
      }
      console.log("signal"+signal);
      that.setData({
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
        url: app.globalData.homeUrl + '/getOtherSong?id='+app.globalData.activeSubtypeIndex+ +'&music_id=' + app.globalData.curplay.id+'&signal='+signal,
        success: function (res) {
          app.globalData.curplay.id = res.data.music_message.music_id; 
          app.globalData.activeSortingIndex = res.data.music_message.sorting_id;
          app.globalData.activeSubtypeIndex = res.data.music_message.subtype_id;
          app.globalData.activeSortingName = res.data.music_message.sorting_name;
          app.globalData.activeSubtypeName = res.data.music_message.subtype_name;
          var curitem = 0;
          for (var i = 0; i < that.data.sortingList.length; i++){
            if (res.data.sorting_id == that.data.sortingList[i].id){
              curitem = i;
              app.globalData.activeCuritem = i;
            }
          }

          that.setData({//把分类和子类都刷新一下
            activeSortingIndex: res.data.sorting_id,
            activeSortingName: res.data.sorting_name,
            activeSubtypeIndex: res.data.subtype_id,
            activeSubtypeName: res.data.subtype_name,
            activeCuritem: curitem,
            
          });

          //播放新音频
          that.playMusic(app.globalData.curplay.id);
        },
        fail: function(e){
          //无法获取新音频
          wx.showToast({title: '获取失败',
            duration: 1000,
            icon: 'loading',
            mask:true}
            );
        }
      });
    },

      hideAllChioce: function () {
      var that = this;
      that.setData({
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
        var that = this;
        var index = e.currentTarget.dataset.index;



        //加载子分类列表
        wx.request({
          url: app.globalData.homeUrl+'/getSubtypelist?key=' + that.data.sortingList[index].id,
          success: function (res) {
            that.setData({
              subtypesList: res.data.sortingList ,
            });
            that.turnSubtype();
          }
        });

        //显示选择的分类
        that.setData({
          sortingChioceIcon: "/image/music88.png",
          activeSortingIndex: this.data.sortingList[index].id,
          activeSortingName: this.data.sortingList[index].typeName,
          pageIndex: 1,
          loadOver: false,
          isLoading: true,
          'currentItem': index,
          activeCuritem: index
        })

        app.globalData.activeCuritem = index;

        console.log("id" + this.data.activeSortingIndex);
      },


  //选择子分类
  choiceSub: function (e) {
    var obj = e.currentTarget.dataset.obj;
    var index = e.currentTarget.index;
    //显示选择的子分类
    this.setData({
      sortingChioceIcon: "/image/music88.png",
      activeSubtypeIndex: obj.id,
      activeSubtypeName: obj.typeName,
      pageIndex: 1,
      loadOver: false,
      isLoading: true,
    })
    console.log("subtypeName" + obj.typeName);

    //根据子分类来获取音频：

    var that = this;
    wx.request({
      url: app.globalData.homeUrl + '/getFirstSong?id=' + obj.id,
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        app.globalData.curplay = res.data.songs[0];
        if (!res.data.songs[0].location) {
          console.log("mp3链接不存在");
          that.setData({
            disable: true
          })
        } else {
          wx.playBackgroundAudio({
            dataUrl: mp3UrlHeader+res.data.songs[0].location,
            title: res.data.songs[0].courseName,
            success: function (res) {
              app.globalData.globalStop = false;
              that.setData({
                playing: true
              })
            }
          });
          wx.setNavigationBarTitle({
            title: app.globalData.curplay.courseName
          });
        }
      },
      fail:function(e){
        //无法获取新音频
        wx.showToast({
          title: '获取失败',
          duration: 1000,
          icon: 'loading',
          mask: true
        }
        );
      }
    });
  },

  ensure_type: function(e){
    chioceSorting: false,
      this.setData({
        chioceSorting:false
      })
    },

  cancel_type: function (e) {
    chioceSorting: false,
      this.setData({
        chioceSorting: false
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
        data: app.globalData.curplay.id,
        success: function (res) {
          console.log('异步保存音乐id成功' + app.globalData.curplay.id)
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
        key: 'activeCuritem',
        data: that.data.activeCuritem,
        success: function (res) {
          console.log('异步保存分类index成功')
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
    //   activeSortingName: that.data.sortingList[index].typeName,
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
    
  },

  //切换分类的小箭头
  switchType: function(e){
    var that = this;
    var signal = e.currentTarget.dataset.signal;
    console.log("signal"+signal);
    var index = 0;

    //取循环index
    if(signal == 1){
      if (app.globalData.activeCuritem<that.data.sortingList.length - 1){
        app.globalData.activeCuritem++;
        index = app.globalData.activeCuritem;
      }
      else{
        index = 0;
        app.globalData.activeCuritem = 0;
      }
    }
    if(signal == -1){
      if(app.globalData.activeCuritem == 0){
        app.globalData.activeCuritem = that.data.sortingList.length - 1;
        index = app.globalData.activeCuritem;
      }
      else{
        app.globalData.activeCuritem--;
        index = app.globalData.activeCuritem;
      }
    }

    //加载子分类列表
    wx.request({
      url: app.globalData.homeUrl + '/getSubtypelist?key=' + that.data.sortingList[index].id,
      success: function (res) {
        that.setData({
          subtypesList: res.data.sortingList,
        });
        that.turnSubtype();
      }
    });

    //显示选择的分类
    this.setData({
      sortingChioceIcon: "/image/music88.png",
      activeSortingIndex: this.data.sortingList[index].id,
      activeSortingName: this.data.sortingList[index].typeName,
      pageIndex: 1,
      loadOver: false,
      isLoading: true,
      'currentItem': index,
      activeCuritem: index
    })

  },

  turnSubtype:function(){//处理子分类使之适配界面
    var that = this;
    //处理子分类数据：
    var json = {};
    var old_length = that.data.subtypesList.length;
    //初始化子分类行数
    var row = old_length / 4;
    if ((old_length % 4 != 0) && old_length != 0) {
      row++;
    }
    console.log("row" + row);
    var index = 0;
    for (var i = 1; i < row + 1, index < old_length; i++) {
      var arry = [];
      for (var j = 0; j < 4; j++ ) {
        arry[j] = that.data.subtypesList[index];
        index++;
      }
      json[i - 1] = arry;
    }
    that.setData({
      subtypesList_new: json
    })

  } 
})