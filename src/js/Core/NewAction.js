/**
 * Created by ext on 6/30/2016.
 */

//Point()|cc.p()|
var ext = ext || {};
ext.ActionShake2D = cc.CustomAction.extend({
    ctor : function (duration, strength) {
        this._super();
        this.initWithDuration(duration);
        this._strength = cc.p(strength);
        this._originPosition = null;
        this._target = null;
        
    },

    onStop : function () {
        if(this._target && this._originPosition){
            this._target.setPosition(this._originPosition);
        }
    },

    onUpdate : function (dt) {
        if(!this._target){
            return;
        }
        if(!this._originPosition){
            this._originPosition = this._target.getPosition();
        }
        this._target.x = this._originPosition.x + this._strength.x - (Math.random() * this._strength.x * 2);
        this._target.y = this._originPosition.y + this._strength.y - (Math.random() * this._strength.y * 2);
    },

    onStartWithTarget : function (target) {
        this._target = target;
        this._originPosition = target.getPosition();
    }
});

ext.ActionNumber = cc.CustomAction.extend({
    ctor : function (duration, targetNumber) {
        this._super();
        this._startNumber = 0;
        this._targetNumber = targetNumber;
        this.initWithDuration(duration);
    },

    _updateValue: function () {
        this._target.setString(cc.Global.NumberFormat1(this._currentNumber));
    },

    onUpdate : function (dt) {
        var number = Math.floor((this._targetNumber - this._startNumber) * dt + this._startNumber);
        if(this._currentNumber === number){
            return;
        }
        this._currentNumber = number;
        this._updateValue();
    },

    onStartWithTarget : function (target) {
        this._target = target;
        var str = this._target.getString().replace(/[.,]/g,'');
        this._startNumber = parseInt(str);
        this._currentNumber = this._startNumber;
    }
});

ext.ActionNumber2 = ext.ActionNumber.extend({
    ctor : function (duration, targetNumber) {
        this._super(duration, targetNumber);
    },

    _updateValue: function () {
        this._target.setString(cc.Global.NumberFormat2(number));
    }
});

ext.ActionTimeRemaining = cc.CustomAction.extend({
    ctor : function (duration) {
        this._super();
        this._fromNumber = duration;
        this._currentNumber = this._fromNumber;
        this.initWithDuration(duration);
    },

    onUpdate : function (dt) {
        var number = Math.ceil((1.0 - dt) * this._fromNumber);
        if(number == this._currentNumber){
            return;
        }
        this._currentNumber = number;
        this._target.setString(number.toString());
    },

    onStartWithTarget : function (target) {
        this._target = target;
        this._target.setString(this._fromNumber.toString());
    }
});

ext.ActionTimer = cc.CustomAction.extend({
    ctor : function (duration, callback) {
        this._super();
        this.callback = callback;
        this.initWithDuration(duration);
    },

    onUpdate : function (dt) {
        if(this.callback){
            this.callback(dt);
        }
    }
});