var common = require('../../../utils/util.js');
let app = getApp();
let seek = 0;
Page({
    data: {
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
    onLoad: function () {
        var music = app.globalData.list_fm[app.globalData.index_fm];
        var activeSortingName = "小学一年级";
        app.globalData.playtype = 2;
        var that = this;
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
            lrc: [],
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
        switch (e.currentTarget.dataset.item) {
          case "2":
            if (this.data.chioceSorting) {
              this.setData({
                sortingChioceIcon: "/image/fm/icon-go-black.png",
                chioceSorting: false,
              });
            }
            else {
              this.setData({
                sortingChioceIcon: "/image/fm/icon-down-black.png",
                chioceSorting: true,
              });
            }
            break;
        }
      },

        //综合排序
  selectSorting: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
          sortingChioceIcon: "/image/fm/icon-go-black.png",
          chioceSorting: false,
          activeSortingIndex: index,
          activeSortingName: this.data.sortingList[index].value,
          productList: [],
          pageIndex: 1,
          loadOver: false,
          isLoading: true
        })
      }
})