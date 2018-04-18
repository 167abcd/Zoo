/**
 * Created by cocos2d on 6/20/2017.
 */

var ModuleStatus = ModuleStatus || {};
ModuleStatus.UpdateFailure = 1;
ModuleStatus.UpdateOk = 2;
ModuleStatus.LoadResourceFailure = 3;
ModuleStatus.LoadResourceFinished = 4;

var ModuleManager = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;
                this._manager = new laucher.ModuleManager();
                this._manager.setTarget(this);

                this._manager.onUpdateModule = function (name, current, target) {
                    thiz.onUpdateModule(name, current, target);
                };

                this._manager.onLoadModule = function (name, current, target) {
                    thiz.onLoadModule(name, current, target);
                };
                
                this._manager.onLoadModuleStatus = function (name, status) {
                    thiz.onLoadModuleStatus(name, status);
                };

                this._manager.onUnLoadModule = function (name, current, target) {
                    thiz.onUnLoadModule(name, current, target);
                };

                this._manager.onUnLoadModuleStatus = function (name, status) {
                    thiz.onUnLoadModuleStatus(name, status);
                };
            }
        },

        onUpdateModule : function (name, current, target) {
            GlobalEvent.getInstance().postEvent("onUpdateModule",
                {
                    module : name,
                    current : current,
                    target : target
                }
            );
        },

        onLoadModule : function (name, current, target) {
            GlobalEvent.getInstance().postEvent("onLoadModule",
                {
                    module : name,
                    current : current,
                    target : target
                }
            );
        },

        onLoadModuleStatus : function(name, status){
            GlobalEvent.getInstance().postEvent("onLoadModuleStatus",
                {
                    module : name,
                    status : status
                }
            );
        },

        onUnLoadModule : function (name, current, target) {
            GlobalEvent.getInstance().postEvent("onUnLoadModule",
                {
                    module : name,
                    current : current,
                    target : target
                }
            );
        },

        onUnLoadModuleStatus : function(name, status){
            GlobalEvent.getInstance().postEvent("onUnLoadModuleStatus",
                {
                    module : name,
                    status : status
                }
            );
        },

        createSpineFromCache : function (name, scale) {
            if(scale){
                return this._manager.createSpineFromCache(name, scale);
            }
            else{
                return this._manager.createSpineFromCache(name);
            }
        },

        getModule : function (moduleName) {
            return this._manager.getModule(moduleName);
        },

        allModuleName : function () {
            return this._manager.allModuleName();
        }
    });
    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();

sp.SkeletonAnimation.createWithCache = function (spineName, scale) {
    return ModuleManager.getInstance().createSpineFromCache(spineName, scale);
};