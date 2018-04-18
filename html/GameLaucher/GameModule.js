/**
 * Created by cocos2d on 6/20/2017.
 */

var ResoucesLoaderStatus = ResoucesLoaderStatus || {};
ResoucesLoaderStatus.OnLoadResources = 1;
ResoucesLoaderStatus.OnLoadTexture = 2;
ResoucesLoaderStatus.OnLoadScript = 3;
ResoucesLoaderStatus.OnLoadFinished = 4;
ResoucesLoaderStatus.OnLoadSpine = 5;
ResoucesLoaderStatus.OnWaitingLoadResources = 100;

var ModuleStatus = ModuleStatus || {};
ModuleStatus.UpdateFailure = 1;
ModuleStatus.UpdateOk = 2;
ModuleStatus.LoadResourceFailure = 3;
ModuleStatus.LoadResourceFinished = 4;

var GameModule = cc.Class.extend({
    ctor : function (data) {
        this._resouces = [];
        this._textures = [];
        this._spineData = [];
        this._scripts = [];

        this._moduleLoaed = true;
        this._initFromData(data);
        this.itemLoaded = 0;

        var thiz = this;
        var resLoader = new ResourceLoader();
        resLoader.addModule(this);
        this.resLoader = resLoader;
        resLoader._autoRetry = false;
        resLoader.onLoadProcess = function (current, target) {
            thiz._onLoadProcess(current, target);
        };
        resLoader.onLoadSuccess = function () {
            thiz._onLoadSuccess();
        };
        resLoader.onLoadFailure = function () {
            thiz._onLoadFailure();
        };

        resLoader.onLoadFailureWithAutoRetry = resLoader.onLoadFailure;
    },

    _initFromData: function (data) {
        this._initFromModule(data["module"]);
        this._initTexture(data["texture"]);
        this._initBitmapFont(data["fonts"]);
        this._initSound(data["sound"]);
        this._initRawFile(data["raw"]);
        this._initSpine(data["spine"]);
        this._initScript(data["script"]);
    },

    _initFromModule: function (data) {
        if(!data){
            return;
        }

        for(var i=0;i<data.length;i++){
            var moduleFile = ModuleManager.getInstance().getModuleFile(data[i]);
            var moduleData = cc.loader.getRes(moduleFile);
            this._initFromData(moduleData);
        }
    },
    
    _initTexture : function (data) {
        if(!data){
            return;
        }

        for(var i=0;i<data.length;i++){
            var obj = data[i];
            this._initResource(obj["img"]);
            this._initResource(obj["plist"]);
            this._moduleLoaed = false;
            this._textures.push(data[i]);
        }
    },

    _initBitmapFont : function (data) {
        if(!data){
            return;
        }

        for(var i=0;i<data.length;i++){
            var obj = data[i];
            this._initResource(obj["img"]);
            this._initResource(obj["fnt"]);
            this._moduleLoaed = false;
        }
    },

    _initSound : function (data) {
        if(!data){
            return;
        }

        for(var i=0;i<data.length;i++){
            this._initResource(data[i]);
            this._moduleLoaed = false;
        }
    },

    _initScript : function (data) {
        if(!data || data.length === 0){
            return;
        }
        for(var i=0;i<data.length;i++){
            this._resouces.push((data[i]));
            this._scripts.push(data[i]);
        }
        this._moduleLoaed = false;
    },

    _initSpine : function (data) {
        for (var key in data) {
            if (!data.hasOwnProperty(key)) continue;
            var spine = new SpineDataItem(key);
            spine._initWithData(data[key]);
            this._spineData.push(spine);

            var tex = spine._texture;
            for(var i=0;i<tex.length;i++){
                this._resouces.push(tex[i]);
            }
            this._resouces.push(spine._jsonFile);
            this._resouces.push(spine._atlasFile);
            this._moduleLoaed = false;
        }
    },

    _initRawFile : function (data) {
        if(!data){
            return;
        }

        for(var i=0;i<data.length;i++){
            this._initResource(data[i]);
            this._moduleLoaed = false;
        }
    },

    _initResource : function (res) {
        if(res){
            this._resouces.push(res);
        }
    },

    _onLoadSuccess : function () {
        if(this._finishedCallback){
            this._finishedCallback(true);
        }
        GlobalEvent.getInstance().postEvent("onLoadModuleStatus",{
            module : this.name,
            status : ModuleStatus.LoadResourceFinished
        });
    },

    _onLoadFailure : function () {
        GlobalEvent.getInstance().postEvent("onLoadModuleStatus",{
            module : this.name,
            status : ModuleStatus.LoadResourceFailure
        });
    },

    _onLoadProcess: function (current, target) {
        GlobalEvent.getInstance().postEvent("onLoadModule",{
            module : this.name,
            current : current,
            target : target
        });
    },

    loadModule : function (cb) {
        this._finishedCallback = cb;
        if(this._moduleLoaed){
            this._onLoadSuccess();
        }
        else{
            //load
            this.resLoader.load();
        }
    },

    loadScript : function (cb) {
        var thiz;
        cc.loader.loadJs(cc.loader.resPath, this._scripts, function (err) {
            if (err){
                throw new Error(err);
            }
            else{
                //finished
                if(cb){
                    cb(thiz);
                }
            }
        });
    },

    unloadModule : function (cb) {

    },

    isLoaded : function () {
        return this._moduleLoaed;
    },

    isReady : function () {
        return true;
    }
});

var ModuleManager = (function() {
    var _instance = null;
    var Clazz = cc.Class.extend({
        ctor: function() {
            this._allModule = {};
        },

        init : function (versionFile, func) {
            var thiz = this;
            cc.loader.loadTxt(versionFile, function (err, txt) {
                if(err){
                    thiz.onLoadResourceFailure();
                }
                else{
                    var data = JSON.parse(txt);
                    thiz._loadModuleDefine(data["module"], func);
                }
            });
        },

        _loadModuleDefine : function (data, cb) {
            var thiz = this;
            this._allModuleFile = data;
            var files = [];
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                files.push(data[key]);
            }
            ResourceLoader.load(files, function (success) {
                if(success){
                    thiz._initAllModule(data);
                    if(cb){
                        cb();
                    }
                }
                else{
                    thiz.onLoadResourceFailure();
                }
            });
        },

        _initAllModule : function (data) {
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var moduleData = cc.loader.getRes(data[key]);
                var module = new GameModule(moduleData);
                module.name = key;
                this._allModule[key] = module;
            }
        },

        getModule : function (moduleName) {
            return this._allModule[moduleName];
        },

        getModuleFile: function (moduleName) {
            return this._allModuleFile[moduleName];
        },

        allModuleName : function () {
            var ret = [];
            for(var name in this._allModule){
                if(!this._allModule.hasOwnProperty(name)) continue;
                if(name !== "main"){
                    ret.push(name);
                }
            }
            return ret;
        },

        onLoadResourceFailure: function () {}
    });

    Clazz.getInstance = function() {
        if (!_instance) {
            _instance = new Clazz();
        }
        return _instance;
    };

    return Clazz;
})();