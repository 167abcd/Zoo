/**
 * Created by cocos2d on 11/9/2016.
 */

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var label = new ccui.Text("Quyết đẹp trai", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2;
        this.title = label;
        this.addChild(label);

        this.gameLaucher = new GameLaucher();
    },

    onEnter : function () {
        this._super();
        GlobalEvent.getInstance().addListener("onUpdateModule", this.onUpdateModule, this);
        GlobalEvent.getInstance().addListener("onLoadModule", this.onLoadModule, this);
        GlobalEvent.getInstance().addListener("onLoadModuleStatus", this.onLoadModuleStatus, this);

        //fix
        cc.director.replaceScene = cc.director.replaceScene || function (scene) {
            cc.director.runScene(scene);
        };
        this.schedule(this.startLoadResources, 0.3);
    },
    onExit : function () {
        this._super();
        this.gameLaucher = null;
        GlobalEvent.getInstance().removeListener(this);
    },
    startLoadResources : function () {
        this.unschedule(this.startLoadResources);
        this.gameLaucher.start();
    },

    onUpdateModule : function (name, data) {
        // var current = data["current"];
        // var target = data["target"];
        // if(data["module"] === "main"){
        //     var per = Math.floor(current / target * 50) + 25;
        // }
        // else{
        //     var per = Math.floor(this.moduleIndex / this.moduleReady.length * current / target * 25) + 75;
        // }
        // this.title.setString("Đang tải tài nguyên[" + per + "%]");
    },

    onLoadModule : function (name, data) {
        var current = data["current"];
        var target = data["target"];
        if(data["module"] === "main"){
            var per = Math.floor(current / target * 50) + 25;
        }
        else{
            var _p1 = 25.0 / this.moduleReady.length;
            var _p2 = (this.moduleIndex-1) *  _p1;
            var per = Math.floor(current / target / _p1  + _p2 + 75);
        }
        this.title.setString("Đang tải tài nguyên[" + per + "%]");
    },

    onLoadModuleStatus : function (name, data) {
        var status = data["status"];
        if(status === ModuleStatus.UpdateFailure){
            this.title.setString("Cập nhật thất bại");
        }
        if(data["module"] === "main"){
            if(status === ModuleStatus.LoadResourceFinished){
                this._getAllReadyModule();
                this._loadReadyModule();
            }
        }
        else{
            if(status === ModuleStatus.LoadResourceFinished){
                this._loadReadyModule();
            }
        }
    },

    _getAllReadyModule : function () {
        var allModule = ModuleManager.getInstance().allModuleName();
        var moduleReady = [];
        // for(var i=0;i<allModule.length;i++){
        //     if(allModule[i] !== "main"){
        //         var module = ModuleManager.getInstance().getModule(allModule[i]);
        //         moduleReady.push(module);
        //     }
        // }
        this.moduleReady = moduleReady;
        this.moduleIndex = 0;
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

    // updateLoadResources : function (current, target) {
    //     cc.log("updateLoadResources: "+current +"/"+target);
    // },
    // updateLoadTexture : function (current, target) {
    //     cc.log("updateLoadTexture: "+current +"/"+target);
    // },
    // onUpdateStatus : function (status) {
    //     cc.log("onUpdateStatus: "+status);
    //     if(status == LaucherStatus.OnLoadFinished){
    //         this.nextScene();
    //     }
    // }
});