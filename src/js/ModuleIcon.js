/**
 * Created by ext on 7/18/2017.
 */

var CreateModuleIconEvent = function (target) {
    if(target.moduleName){
        var moduleName = target.moduleName;
        var module = ModuleManager.getInstance().getModule(moduleName);
        var isLoad = module.isLoaded();
        target.setModuleReady(isLoad);

        if(!isLoad){
            if(cc.sys.isNative){
                var moduleSize = module.getTotalSize();
                target.__onUpdateModule = function (name, data) {
                    if(data["module"] === moduleName){
                        if(target.setModuleUpdate){
                            if(cc.sys.isNative){
                                var targetCount = data["target"] + moduleSize;
                                var currentCount = data["current"] + moduleSize;
                            }
                            else{
                                var targetCount = data["target"];
                                var currentCount = data["current"];
                            }
                            if(currentCount > targetCount){
                                currentCount = targetCount;
                            }

                            var percentage = (currentCount / targetCount) * 50.0;
                            target.setModuleUpdate(percentage);

                         //   cc.log("per : " + percentage);
                        }
                    }
                };

                target.__onLoadModule = function (name, data) {
                    if(data["module"] === moduleName){
                        if(target.setModuleUpdate){
                            var targetCount = data["target"];
                            var currentCount = data["current"];

                            if(currentCount >= targetCount){
                                currentCount = targetCount - 1;
                            }
                            var percentage = 50.0 + (currentCount / targetCount) * 50.0;
                            target.setModuleUpdate(percentage);

                          //  cc.log("per : " + percentage);
                        }
                    }
                };
            }
            else{
                target.__onUpdateModule = function (name, data) {

                };

                target.__onLoadModule = function (name, data) {
                    if(data["module"] === moduleName){
                        if(target.setModuleUpdate){
                            var targetCount = data["target"];
                            var currentCount = data["current"];

                            if(currentCount >= targetCount){
                                currentCount = targetCount - 1;
                            }
                            var percentage = (currentCount / targetCount) * 100.0;
                            target.setModuleUpdate(percentage);
                        }
                    }
                };
            }

            target.__onLoadModuleStatus = function (name, data) {
                if(data["module"] === moduleName){
                    var status = data["status"];
                    if(status === ModuleStatus.LoadResourceFinished){
                        target.setModuleUpdate(100.0);
                        target.setModuleReady(true);
                    }
                    else if(
                        status === ModuleStatus.LoadResourceFailure ||
                        status === ModuleStatus.UpdateFailure
                    ){
                        target.setModuleUpdate(0);
                        target.setModuleReady(false);
                    }
                }
            };

            var _onEnter = target.onEnter;
            var _onExit = target.onExit;

            target.onEnter = function () {
                _onEnter.apply(target, arguments);

                GlobalEvent.getInstance().addListener("onUpdateModule", target.__onUpdateModule, target);
                GlobalEvent.getInstance().addListener("onLoadModule", target.__onLoadModule, target);
                GlobalEvent.getInstance().addListener("onLoadModuleStatus", target.__onLoadModuleStatus, target);
            };

            target.onExit = function(){
                _onExit.apply(target, arguments);
                GlobalEvent.getInstance().removeListener(this);
            };
        }
    }
};