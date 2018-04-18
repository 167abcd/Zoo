/**
 * Created by cocos2d on 9/21/2016.
 */

var GameLaucherStatus = GameLaucherStatus || {};
GameLaucherStatus.GetUpdate = 0;
GameLaucherStatus.TestVersion = 1;
GameLaucherStatus.TestHashFiles = 2;
GameLaucherStatus.Updating = 3;
GameLaucherStatus.UpdateFailure = 4;
GameLaucherStatus.LoadResource = 5;
GameLaucherStatus.LoadScript = 6;
GameLaucherStatus.LoadAndroidExt = 7;
GameLaucherStatus.Finished = 8;

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var label = new ccui.Text("Đang kiểm tra phiên bản", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2;
        this.title = label;
        this.addChild(label);
    },

    update : function (dt) {
        this._timeElapsed += dt;
        var per = (50.0 * this._timeElapsed / 2.0) + 50.0;
        this.__setProcess(per);
        if(per > 100){
            this.unscheduleUpdate();
            window._cc_finished_Loading();
        }
    },

    onEnter : function () {
        this._super();
        GlobalEvent.getInstance().addListener("onUpdateModule", this.onUpdateModule, this);
        GlobalEvent.getInstance().addListener("onLoadModule", this.onLoadModule, this);
        GlobalEvent.getInstance().addListener("onLoadModuleStatus", this.onLoadModuleStatus, this);

        SystemPlugin.getInstance().startLaucher();
    },

    onExit : function () {
        this._super();
        GlobalEvent.getInstance().removeListener(this);
    },

    onUpdateModule : function (name, data) {
        if(data["module"] === "main"){
            var current = data["current"];
            var target = data["target"];
            var per = (current / target * 25);
            this.__setProcess(per);
        }
        else{

        }
    },

    onLoadModule : function (name, data) {
        var current = data["current"];
        var target = data["target"];
        if(data["module"] === "main"){
            var per = (current / target * 25) + 25;
        }
        else{
            var _p1 = 50.0 / this.moduleReady.length;
            var _p2 = (this.moduleIndex-1) *  _p1;
            var per = current / target / _p1  + _p2 + 50;
        }

        this.__setProcess(per);
    },

    onLoadModuleStatus : function (name, data) {
        var status = data["status"];
        if(status === ModuleStatus.UpdateFailure){
            this.__setStatus("Cập nhật thất bại");
        }
        if(data["module"] === "main"){
            if(status === ModuleStatus.LoadResourceFinished){
                this._getAllReadyModule();
            }
        }
        else{
            if(status === ModuleStatus.LoadResourceFinished){
                this._loadReadyModule();
            }
        }
    },

    _getAllReadyModule : function () {
        if(ModuleManager.getInstance().getReadyModule !== undefined){
            this.moduleReady = ModuleManager.getInstance().getReadyModule();
        }
        else{
            this.moduleReady = [];
        }
        this.moduleIndex = 0;
        if(this.moduleReady.length > 0){
            this._loadReadyModule();
        }
        else{
            this._timeElapsed = 0.0;
            this.scheduleUpdate();
        }
    },

    _loadReadyModule : function () {
        if(this.moduleIndex >= this.moduleReady.length){
            window._cc_finished_Loading();
        }
        else{
            this.moduleIndex++;
            this.moduleReady[this.moduleIndex-1].loadModule();
        }
    },

    onProcessStatus : function (status) {

    },

    onStartLoadModule : function () {
        //this._getAllReadyModule();
    },
    
    __setProcess : function (per) {
        this.title.setString("Đang tải tài nguyên[" + Math.floor(per) + "%]");
    },

    __setStatus : function (status) {
        this.title.setString(status);
    }
});