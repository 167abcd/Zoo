
var JackpotEvent = JackpotEvent || {};
JackpotEvent.addEventForTarget = function (target, _gameId, _betting) {
    var _onEnter = target.onEnter;
    var _onExit = target.onExit;

    if(_gameId !== undefined){
        target.gameId = _gameId;
    }

    if(_betting !== undefined){
        target.betting = _betting;
    }

    if(target._setJackpot === undefined){
        var thiz = this;
        target._setJackpot = function (value) {
            if(target._jackpotLabel){
                // target._jackpotLabel.setString(cc.Global.NumberFormat1(value));
                target._jackpotLabel.stopAllActions();
                if(value > 0){
                    var str = target._jackpotLabel.getString().replace(/[.,]/g,'');
                    var startNumber = parseInt(str);
                    var delta = Math.abs(value - startNumber);
                    var time = delta / 7;
                    if(time > 4){
                        time = 4;
                    }

                    var getDelayTime = function () {
                        if(_gameId === GameType.MiniGame_CaoThap)
                        {
                            if(_betting === 1000)
                            {
                                return (Math.random() * (5.0 - 3.0) + 3.0);
                            }
                            else if(_betting === 10000)
                            {
                                return (Math.random() * (10.0 - 5.0) + 5);
                            }
                            else if(_betting === 50000)
                            {
                                return (Math.random() * (1200.0 - 500.0) + 500.0);
                            }
                            else
                            {
                                return (Math.random() * (5.0 - 3.0) + 3.0);
                            }
                        }
                        else
                        {
                            if(_betting === 100)
                            {
                                return (Math.random() * (5.0 - 3.0) + 3.0);
                            }
                            else if(_betting === 1000)
                            {
                                return (Math.random() * (10.0 - 5.0) + 5);
                            }
                            else if(_betting === 10000)
                            {
                                return (Math.random() * (1200.0 - 500.0) + 500.0);
                            }
                            else
                            {
                                return (Math.random() * (5.0 - 3.0) + 3.0);
                            }
                        }
                    };

                    var realAction = new ext.ActionNumber(time, value);
                    var fakeAction = function () {
                        var v = value - Math.floor(Math.random() * 100 + 700);
                        if(v < 0){
                            v = 0;
                        }
                        target._jackpotLabel.setString(v);
                        var delayAction = new cc.DelayTime(getDelayTime());
                        var callAction = new cc.CallFunc(fakeAction);
                        var numberAction = new ext.ActionNumber(3, value);
                        target._jackpotLabel.runAction(new cc.Sequence(numberAction, delayAction, callAction));
                    };

                    var action3 = new cc.Sequence(realAction, new cc.DelayTime(getDelayTime()), new cc.CallFunc(fakeAction));
                    target._jackpotLabel.runAction(action3);
                }
                else{
                    target._jackpotLabel.setString(cc.Global.NumberFormat1(value));
                }
            }
        };


    }
    target._setJackpot(0);
    target._onUpdateJackpot = function (cmd, data) {
        var gameId = s_GameId[data["g"]];
        var betting = data["bet"];
        if(gameId === target.gameId && betting === target.betting){
            // cc.log(data);
            this._setJackpot(data["value"]);
        }
    };

    target.onEnter = function () {
        _onEnter.apply(target, arguments);
        SocketClient.getInstance().addListener("uJackpot", target._onUpdateJackpot, target);
        this.refreshJackpot();
    };

    target.refreshJackpot = function () {
        var value = JackpotEvent.getJackPot(this.gameId, this.betting);
        this._setJackpot(value);
    };

    target.onExit = function(){
        _onExit.apply(target, arguments);
        SocketClient.getInstance().removeListener(target);
    };

    target.setGameId = function (gameId) {
        target.gameId = gameId;
        this.refreshJackpot();
    };

    target.setBetting = function (betting) {
        target.betting = betting;
        this.refreshJackpot();
    };
    target.delaytimeJackpot = function (betting, gameId) {
        var delaytime;

        if(gameId === GameType.MiniGame_CaoThap)
        {
            if(betting === 1000)
            {
                delaytime = new cc.DelayTime(Math.random() * (5.0 - 3.0) + 3.0);
            }
            else if(betting === 10000)
            {
                delaytime = new cc.DelayTime(Math.random() * (10.0 - 5.0) + 5);
            }
            else if(betting === 50000)
            {
                delaytime = new cc.DelayTime(Math.random() * (1200.0 - 500.0) + 500.0);
            }
            else
            {
                delaytime = new cc.DelayTime(Math.random() * (5.0 - 3.0) + 3.0);
            }
        }
        else
        {
            if(betting === 100)
            {
                delaytime = new cc.DelayTime(Math.random() * (5.0 - 3.0) + 3.0);
            }
            else if(betting === 1000)
            {
                delaytime = new cc.DelayTime(Math.random() * (10.0 - 5.0) + 5);
            }
            else if(betting >= 10000)
            {
                delaytime = new cc.DelayTime(Math.random() * (1200.0 - 500.0) + 500.0);
            }
            else
            {
                delaytime = new cc.DelayTime(Math.random() * (5.0 - 3.0) + 3.0);
            }
        }


        return delaytime;
    }
};

JackpotEvent.getJackPot = function (gameId, betting) {
    var jackpotId = gameId.toString() + "_" + betting.toString();
    var value = GameInfo.Jackpot[jackpotId];
    if(value === undefined){
        value = 0;
    }
    return value;
};