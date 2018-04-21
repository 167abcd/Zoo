
var ResourceLoader = cc.Class.extend({
    ctor: function () {
        this._resouces = [];
        this._textures = [];
        this._spineData = [];
        this._module = [];
        this._autoRetry = false;
    },

    addModule: function (module) {
        var res = module._resouces;
        for(var i=0;i<res.length;i++){
            if(this._resouces.indexOf(res[i]) === -1){
                this._resouces.push(res[i]);
            }
        }

        var tex = module._textures;
        for(var i=0;i<tex.length;i++){
            if(this._textures.indexOf(tex[i]) === -1){
                this._textures.push(tex[i]);
            }
        }

        var spine = module._spineData;
        for(var i=0;i<spine.length;i++){
            if(this._spineData.indexOf(spine[i]) === -1){
                this._spineData.push(spine[i]);
            }
        }

        this._module.push(module);
    },

    _updateLoadResources : function () {
        if(!this._resouces || this._resouces.length === 0){
            this._status = ResourceLoader.OnLoadTexture;
            return;
        }

        this._status = ResourceLoader.OnWaitingLoadResources;
        var thiz = this;
        var current = 0;
        var target = this._resouces.length;
        for(var i=0;i<this._resouces.length;i++){
            (function () {
                var res = thiz._resouces[i];
                var cb = function (success) {
                    if(success){
                        thiz._currentStep++;
                        thiz._onLoadProcess();

                    }
                    else{
                        if(thiz._autoRetry){
                            thiz.onLoadFailureWithAutoRetry();
                            setTimeout(function () {
                                ResourceLoader.load(res, cb);
                            }, 1000);
                            return;
                        }
                    }

                    current++;
                    if(current === target){ //finished
                        if(thiz._currentStep < thiz._resouces.length){
                            thiz.itemLoaded = 0;
                            thiz._status = ResourceLoader.OnLoadFinished;
                        }
                        else{
                            thiz.itemLoaded = 0;
                            thiz._status = ResourceLoader.OnLoadTexture;
                        }
                    }
                };
                ResourceLoader.load(res, cb);
            })();
        }
    },

    _updateLoadTexture : function () {
        if(this.itemLoaded >= this._textures.length){
            this.itemLoaded = 0;
            this._status = ResourceLoader.OnLoadSpine;
        }
        else{
            var step = 10;
            var maxStep = this._textures.length - this.itemLoaded;
            if(step >  maxStep){
                step = maxStep;
            }

            for(var i=0;i<step;i++){
                var texture = this._textures[this.itemLoaded + i];
                if(texture["plist"]){
                    cc.spriteFrameCache.addSpriteFrames(texture["plist"], texture["img"]);
                }
            }

            this.itemLoaded += step;
            this._currentStep += step;
            this._onLoadProcess();
        }
    },

    _updateLoadSpine : function () {
        if(this.itemLoaded >= this._spineData.length){
            this.itemLoaded = 0;
            this._status = ResourceLoader.OnLoadFinished;
        }
        else{
            var step = 10;
            var maxStep = this._spineData.length - this.itemLoaded;
            if(step >  maxStep){
                step = maxStep;
            }

            for(var i=0;i<step;i++){
                var spine = this._spineData[this.itemLoaded + i];
                spine._load();
            }

            this.itemLoaded += step;
            this._currentStep += step;
            this._onLoadProcess();
        }
    },

    _updateLoadFinished : function () {
        cc.director.getScheduler().unscheduleUpdate(this);
        if(this._currentStep < this._targetStep){
            this.onLoadFailure();
        }
        else{
            for(var i=0;i<this._module.length;i++){
                this._module[i]._moduleLoaed = true;
            }
            this.onLoadSuccess();
        }
    },

    _onLoadProcess : function () {
        this.onLoadProcess(this._currentStep, this._targetStep);
    },

    update : function () {
        switch (this._status){
            case (ResourceLoader.OnLoadResources) : {
                this._updateLoadResources();
                break;
            }
            case (ResourceLoader.OnLoadTexture) : {
                this._updateLoadTexture();
                break;
            }
            case (ResourceLoader.OnLoadSpine) : {
                this._updateLoadSpine();
                break;
            }
            case (ResourceLoader.OnLoadFinished) : {
                this._updateLoadFinished();
                break;
            }
        }
    },

    load : function () {
        this._targetStep = this._resouces.length;
        this._targetStep += this._textures.length;
        this._targetStep += this._spineData.length;
        this._currentStep = 0;

        this._status = LaucherStatus.OnLoadResources;
        cc.director.getScheduler().scheduleUpdate(this, 0, false);
    },

    onLoadProcess : function (current, target) {},
    onLoadSuccess : function () {},
    onLoadFailure : function () {},
    onLoadFailureWithAutoRetry : function () {}
});

ResourceLoader.OnLoadResources = 1;
ResourceLoader.OnLoadTexture = 2;
ResourceLoader.OnLoadSpine = 3;
ResourceLoader.OnLoadFinished = 4;

(function () {
    if(window._multiHost){
        var multiHost = window._multiHost;
        window._maxDownloadResConnection = multiHost * 5;

        for(var i=0;i<multiHost.length;i++){
            var host = multiHost[i];
            if(host !== ""){
                if(host.endsWith("/")){
                    host = host.substr(0, host.length-1);
                }
                multiHost[i] = host + window.location.pathname;
            }
        }

        var _urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
        for(var i=0;i<multiHost.length;i++){
            if(multiHost[i] !== "" && !multiHost[i].endsWith("/")){
                multiHost[i] += "/";
            }
        }
        var hostIdx = 0;
        var allRegister = cc.loader.getAllRegister();
        for (var key in allRegister) {
            if (!allRegister.hasOwnProperty(key)) continue;
            (function () {
                var _oldLoader = allRegister[key];
                var _newLoader = {};
                allRegister[key] = _newLoader;
                _newLoader.load = function (realUrl, url, item, cb) {
                    if(_urlRegExp.test(realUrl)){
                       // console.log("load real url: " + realUrl);
                        _oldLoader.load(realUrl, url, item, cb);
                    }
                    else{
                        if(hostIdx >= multiHost.length){
                            hostIdx = 0;
                        }
                        var newRealUrl = multiHost[hostIdx] + realUrl;
                        hostIdx++;
                        //console.log("load newRealUrl: " + newRealUrl);
                        _oldLoader.load(newRealUrl, url, item, function (err, data) {
                            cb(err, data);
                            // if(err){
                            //     _oldLoader.load(realUrl, url, item, cb);
                            // }
                            // else{
                            //     cb(err, data);
                            // }
                        });
                    }
                };
            })();
        }
    }
})();

(function () {
    var _request = {};
    var _cache = {};
    if(window._maxDownloadResConnection === undefined){
        window._maxDownloadResConnection = 6;
    }

    var maxConnect = window._maxDownloadResConnection;
    var currentResLoad = 0;
    var pendingResLoad = [];

    var loadRes = function (resPath) {
        if(currentResLoad >= maxConnect){
            pendingResLoad.push(resPath);
            return;
        }
        currentResLoad++;
        cc.loader.load(resPath,
            function () {
                //process event
            },
            function (err) {
                if(err){
                    for(var i=0;i<_request[resPath].length;i++){
                        _request[resPath][i](false);
                    }
                }
                else{
                    _cache[resPath] = cc.loader.cache[resPath];
                    for(var i=0;i<_request[resPath].length;i++){
                        _request[resPath][i](true);
                    }
                }
                _request[resPath] = undefined;
                currentResLoad--;
                //finished
                if(pendingResLoad.length > 0){
                    var res = pendingResLoad[0];
                    pendingResLoad.splice(0, 1);
                    loadRes(res);
                }
            });
    };

    var mLoader = function (resPath, cb) {
        if(cc.isArray(resPath)){
            var isOk = 0;
            var loaded = 0;
            var finisedFunc = function (isSuccess) {
                loaded++;
                if(isSuccess){
                    isOk++;
                }
                if(loaded === resPath.length){
                    cb(loaded === isOk);
                }
            };
            for(var i=0;i<resPath.length;i++){
                mLoader(resPath[i], function (ok) {
                    finisedFunc(ok);
                })
            }
            return;
        }

        if(_cache[resPath]){
            cb(true);
            return;
        }

        if(_request[resPath]){
            _request[resPath].push(cb);
            return;
        }

        _request[resPath] = [];
        _request[resPath].push(cb);

        loadRes(resPath);
    };
    ResourceLoader.load = mLoader;
})();
