/**
 * Created by cocos2d on 11/9/2016.
 */

// var s_loading_tips = s_loading_tips || [
//         "Nhấn Dừng khi đang quay để xem ngay kết quả.",
//         "Chọn nhiều dòng để tăng tỷ lệ nổ hũ.",
//         "Tính năng quay tự động sẽ dừng khi Nổ Hũ.",
//         "VP có thể dùng để đổi ra xLot.",
//         "Có thể chơi minigame cùng lúc với game slot.",
//         "Đăng nhập hàng ngày để nhận vòng quay miễn phí",
//         "Nhấn Dừng khi đang quay để xem ngay kết quả.",
//         // "Dễ nổ hũ lắm anh em ơi! Nhoằng cái có ngay vài củ tiêu rồi.",
//         "Anh em tham gia \"Đập hũ\" LUÔN VÀ NGAY nhá!"
//
//     ];

var LoadingProcessAction = cc.CustomAction.extend({
    ctor : function (duration, from, to, callback) {
        this._super();
        this.callback = callback;
        this._from = from;
        this._to = to;
        this.initWithDuration(duration);
    },

    onUpdate : function (dt) {
        if(this.callback){
            this.callback(this._from + (this._to - this._from) * dt);
        }
    }
});

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        //img loadingScene need preloadin g_resources in main.js
        var bg = new cc.Sprite("res/Texture/LoadingScene/bgLoading.jpg");
        bg.setAnchorPoint(cc.p(0,1));
        this.addChild(bg);
        this.bg = bg;

        var sceneLayer = new cc.Node();
        sceneLayer.setContentSize(cc.size(1920, 1080));
        sceneLayer.setAnchorPoint(cc.p(0, 1));
        this.addChild(sceneLayer);
        this.sceneLayer = sceneLayer;

        /*var logo = new cc.Sprite("res/LoadingScene_logo.png");
        logo.setPosition(1026, 591);
        sceneLayer.addChild(logo);*/

        /*var loadingBarBg = new cc.Sprite("res/LoadingScene_bar_1.png");
        loadingBarBg.setPosition(cc.p(sceneLayer.width/2, 342));
        sceneLayer.addChild(loadingBarBg);*/

        var loadingBar = new cc.ProgressTimer(new cc.Sprite("res/Texture/LoadingScene/slider.png"));
        loadingBar.setType(cc.ProgressTimer.TYPE_BAR);
        loadingBar.setBarChangeRate(cc.p(1.0,0.0));
        loadingBar.setMidpoint(cc.p(0.0, 0.5));
        loadingBar.setPosition(sceneLayer.width/2, 342);
        sceneLayer.addChild(loadingBar);
        this.loadingBar = loadingBar;
        loadingBar.setPercentage(0.0);

        var label = new ccui.Text("Đang tải...", "arial", 30);
        label.setPosition(sceneLayer.width/2, 280);
        this.title = label;
        sceneLayer.addChild(label);

        var loadingLabel = new ccui.Text("", "arial", 20);
        loadingLabel.setPosition(loadingBar.getPosition());
        sceneLayer.addChild(loadingLabel);
        this.loadingLabel = loadingLabel;

        var thiz = this;
        var resLoader = new ResourceLoader();
        resLoader._autoRetry = true;
        resLoader.onLoadProcess = function (current, target) {
            thiz.updateProcess(100 * current / target);
        };
        resLoader.onLoadSuccess = function () {
            thiz.updateProcess(100);
        };
        resLoader.onLoadFailureWithAutoRetry = function () {
            thiz.__setStatus("Tải thất bại, vui lòng kiểm tra lại mạng");
        };

        this.gameLaucher = new GameLaucher();
        this.gameLaucher.loadMainModule = function () {
            resLoader.addModule(ModuleManager.getInstance().getModule("main"));
            // resLoader.addModule(ModuleManager.getInstance().getModule("GameTLMN"));
            resLoader.load();
        };
        this.gameLaucher.onLoadResourceFailure = function () {
            thiz.__setStatus("Tải thất bại, vui lòng kiểm tra lại mạng");
            setTimeout(function () {
                thiz.startLoadResources();
            }, 1000)
        };
    },

    onCanvasResize: function () {
        this.sceneLayer.setPosition(0, cc.winSize.height);
        var scale = cc.winSize.height / 1080;
        this.bg.setScale(scale < 1 ? 1 : scale);
        this.bg.setPosition(0, cc.winSize.height);
    },

    updateProcess: function (percentage) {
        this.currentPer = percentage;
        this._refreshProcess = true;
    },

    update : function (dt) {
        var currentPer = this.loadingBar.getPercentage();
        if(currentPer >= 100){
            this.unscheduleUpdate();
            setTimeout(function () {
                window._cc_finished_Loading();
            }, 0);
        }
        else{
            if(this._refreshProcess){
                var nextPer = dt * 100 + currentPer;
                if(nextPer >= this.currentPer){
                    nextPer = this.currentPer;
                    this._refreshProcess = false;
                }
                this.__setProcess(nextPer);
            }
        }
    },

    onEnter : function () {
        this._super();
        //fix
        cc.director.replaceScene = cc.director.replaceScene || function (scene) {
            cc.director.runScene(scene);
        };

        this.onCanvasResize();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.CUSTOM,
            eventName : "canvas-resize",
            callback : function () {
                thiz.onCanvasResize();
            }
        }, this);

        this.scheduleUpdate();
        this.startLoadResources();
    },

    onExit : function () {
        this._super();
        this.gameLaucher = null;
        this.unscheduleUpdate();
    },

    startLoadResources : function () {
        if(window.cc_resources_search_path){
            cc.loader.resPath = window.cc_resources_search_path;
        }
        else{
            cc.loader.resPath = "";
        }
        this.gameLaucher.start();
    },

    __setProcess : function (per) {
        this.loadingBar.setPercentage(per);
        if(per > 100){
            per = 100;
        }
        this.loadingLabel.setString(Math.round(per) + "%");
    },

    __setStatus : function (status) {
        this.title.setString(status);
    }
});