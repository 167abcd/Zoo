/**
 * Created by cocos2d on 6/20/2017.
 */
var GlobalEvent = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.allListener = [];
            }
        },

        postEvent : function (eventName, params) {
            var arr = this.allListener[eventName];
            if(arr){
                this.isBlocked = true;
                for(var i=0;i<arr.length;){
                    var target = arr[i];
                    if(target){
                        target.listener.apply(target.target, [eventName, params]);
                    }
                    else{
                        arr.splice(i,1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },

        addListener : function (eventName, _listener, _target) {
            var arr = this.allListener[eventName];
            if(!arr){
                arr = [];
                this.allListener[eventName] = arr;
            }
            for(var i=0;i<arr.length;i++){
                if(arr[i] && arr[i].target === _target){
                    return;
                }
            }
            arr.push({
                listener : _listener,
                target : _target
            });
        },

        removeListener : function (target) {
            for (var key in this.allListener) {
                if(!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for(var i=0;i<arr.length;){
                    if(arr[i] && arr[i].target === target){
                        if(this.isBlocked){
                            arr[i] = null;
                        }
                        else{
                            arr.splice(i,1);
                            continue;
                        }
                    }
                    i++;
                }
            }
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