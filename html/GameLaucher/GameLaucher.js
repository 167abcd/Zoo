/**
 * Created by cocos2d on 11/15/2016.
 */

var LaucherStatus = LaucherStatus || {};
LaucherStatus.OnLoadNotRun = 0;
LaucherStatus.OnLoadResources = 1;
LaucherStatus.OnWaitingLoadResources = 2;
LaucherStatus.OnLoadTexture = 3;
LaucherStatus.OnLoadFonts = 4;
LaucherStatus.OnLoadSound = 5;
LaucherStatus.OnLoadFinished = 6;

var GameLaucher = cc.Class.extend({
    ctor : function () {

    },

    start : function () {
        var thiz = this;
        if(window.cc_resources_search_path){
            var versionFile = window.cc_resources_search_path + "/version.json";
        }
        else{
            var versionFile = "version.json";
        }
        ModuleManager.getInstance().init(versionFile, function () {
            thiz.loadMainModule();
        });
    },

    loadMainModule : function () {
        var mainModule = ModuleManager.getInstance().getModule("main");
        mainModule.loadModule(function () {
            // var currentScene = cc.director.getRunningScene();
            // if(currentScene.nextScene){
            //     currentScene.nextScene();
            // }
        });
    }
});