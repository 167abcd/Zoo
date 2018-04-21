/**
 * Created by ext on 12/20/2016.
 */
var MiniGamePopup = cc.Node.extend({
    ctor: function () {
        this._super();
        this._audioSource = new SoundPlayer.AudioSource();

        var x = cc.winSize.width / 2;
        var y = cc.winSize.height / 2;
        if(cc.winSize.height > 1000){
            y = cc.winSize.height - 500;
        }
        this.setPosition(x, y);

        this.initController();
        SceneNavigator.addBackKeyEvent(this);
        SceneNavigator.resizeEvent(this);
    },

    _onMouseMove: function (event) {
        var p = this.convertToNodeSpace(event.getLocation());
        if (cc.rectContainsPoint(this._boudingRect, p)) {
            return true;
        }
        return false;
    },

    _onMouseScrolling: function (event) {
        var p = this.convertToNodeSpace(event.getLocation());
        if (cc.rectContainsPoint(this._boudingRect, p)) {
            return true;
        }
        return false;
    },

    onCanvasResize : function () {
        if(this.winSizeHeight !== undefined){
            this.y += -(this.winSizeHeight - cc.winSize.height);
        }
        this.winSizeHeight = cc.winSize.height;
        this._updatePosition();
    },

    _onKeyBackHandler : function () {
        this.closeButtonHandler();
        return true;
    },

    onEnter: function () {
        this._super();
        var thiz = this;

        this.setMouseOverEnable();
        newui._addMouseScrollEvent(this, function (e) {
            return thiz._onMouseScrolling(e);
        });

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            }
        }, this);
    },

    initController: function () {

    },

    onExit: function () {
        this._super();
        //this._controller.releaseController();
    },

    onTouchBegan: function (touch, event) {
        if (this._touchStartPoint) {
            return false;
        }

        this._touchStartPoint = touch.getLocation();
        var p = this.convertToNodeSpace(this._touchStartPoint);
        if (cc.rectContainsPoint(this._boudingRect, p)) {
            MiniGameNavigator.focus(this);
            return true;
        }
        this._touchStartPoint = null;
        return false;
    },

    onTouchMoved: function (touch, event) {
        if (!this._touchStartPoint) {
            return;
        }
        var p = touch.getLocation();
        this.moveNode(cc.p(p.x - this._touchStartPoint.x, p.y - this._touchStartPoint.y));
        this._touchStartPoint = p;
    },

    onTouchEnded: function (touch, event) {
        this._touchStartPoint = null;
    },

    moveNode: function (ds) {
        this.x += ds.x;
        this.y += ds.y;

        //this._updatePosition();
    },

    _updatePosition: function () {
        var lb = this.convertToWorldSpace(cc.p(this._boudingRect.x, this._boudingRect.y));
        var rt = this.convertToWorldSpace(cc.p(this._boudingRect.x + this._boudingRect.width, this._boudingRect.y + this._boudingRect.height));

        if (lb.x < 0) {
            this.x -= lb.x;
        }
        if (rt.x > cc.winSize.width) {
            this.x -= (rt.x - cc.winSize.width);
        }
        if (lb.y < 0) {
            this.y -= lb.y;
        }
        if (rt.y > cc.winSize.height) {
            this.y -= (rt.y - cc.winSize.height);
        }
    },

    show: function () {
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(false);
            parent.removeFromParent(false);
        }

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 0));
        bg.addChild(this);

        var runningScene = cc._mainScene;
        if (runningScene) {
            if (runningScene.miniGameLayer) {
                runningScene.miniGameLayer.addChild(bg)
            }
            else {
                runningScene.addChild(bg);
            }
        }
        this._controller.sendJoinGame();
    },

    changeLayerOrder : function (order) {
        var thiz = this;
        var mParent = thiz.getParent();
        if(mParent){
            mParent.setLocalZOrder(order);
        }
    },

    hide: function () {
        this._controller.releaseController();
        this._audioSource.stopAllSound();
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(true);
            parent.removeFromParent(true)
        }
        // SoundPlayer.stopAllSound();
    },

    closeButtonHandler : function () {
       // this.hide();
        MiniGameNavigator.hideGame(this.gameType);
    },

    playSound: function (sound, loop) {
        return this._audioSource.playSound(sound, loop);
    },
    stopSound : function (soundName) {
        return this._audioSource.stopSound(soundName);
    },
    playSoundLoop: function (soundName) {
        return this._audioSource.playSoundLoop(soundName);
    },
    stopSoundLoop: function (sound) {
        return this._audioSource.stopSoundLoop(sound);
    },
    stopAllSound: function () {
        return this._audioSource.stopAllSound();
    },
    setSoundVolume: function (volume) {
        return this._audioSource.setSoundVolume(volume);
    }
});

var MiniGameNavigator = MiniGameNavigator || {};
MiniGameNavigator.allGame = [];

MiniGameNavigator.createGameLayer = function (gameId) {
    if(gameId === GameType.MiniGame_CaoThap){
       return new CaoThapLayer();
    }
    else if(gameId === GameType.MiniGame_Poker){
       return new MiniPokerLayer();
    }
    else if(gameId === GameType.MiniGame_Candy_Slot){
       return new CandyLayer();
    }
    else if(gameId === GameType.MiniGame_TaiXiu){
       return new ChanLeLayer();
    }
    else if(gameId === GameType.MiniGame_Vong_Quay_May_Man){
       return new VongQuayLayer();
    }
    else if(gameId === GameType.MiniGame_CuopBien_Slot){
        return new CuopBienLayer();
    }
};

MiniGameNavigator.focus = function (view) {
    setTimeout(function () {
        var index = MiniGameNavigator.allGame.indexOf(view);
        MiniGameNavigator.allGame.splice(index, 1);
        MiniGameNavigator.allGame.push(view);

        for(var i=0;i<MiniGameNavigator.allGame.length;i++){
            MiniGameNavigator.allGame[i].changeLayerOrder(i);
        }
    }, 0);
};

MiniGameNavigator.hideAll = function () {
    for(var i=0;i<MiniGameNavigator.allGame.length;i++){
        MiniGameNavigator.allGame[i].hide();
        MiniGameNavigator.allGame[i].release();
    }
    MiniGameNavigator.allGame = [];
};

MiniGameNavigator.getRunning = function (gameId) {
    for(var i=0;i<MiniGameNavigator.allGame.length;i++) {
        var miniGame = MiniGameNavigator.allGame[i];
        if (miniGame.gameType === gameId) {
            return miniGame;
        }
    }
    return null;
};

MiniGameNavigator.showGame = function (gameId, position ) {

    for(var i=0;i<MiniGameNavigator.allGame.length;i++){
        var miniGame = MiniGameNavigator.allGame[i];
        if(miniGame.gameType === gameId){
            if(miniGame.isRunning()){
                cc.log("MiniGame " + gameId + " is running !!!");
            }
            else{
                miniGame.show();
                if(position){
                    miniGame.setPosition(position);
                }
            }
            MiniGameNavigator.focus(miniGame);
            return;
        }
    }

    var newMiniGame = MiniGameNavigator.createGameLayer(gameId);
    newMiniGame.gameType = gameId;
    MiniGameNavigator.allGame.push(newMiniGame);
    newMiniGame.show();
    MiniGameNavigator.focus(newMiniGame);
    if(position){
        miniGame.setPosition(position);
    }
    newMiniGame.retain();
};

MiniGameNavigator.hideGame = function (gameId) {
    for(var i=0;i<MiniGameNavigator.allGame.length;i++){
        var miniGame = MiniGameNavigator.allGame[i];
        if(miniGame.gameType === gameId){
            MiniGameNavigator.allGame.splice(i, 1);
            miniGame.hide();
            miniGame.release();
            return;
        }
    }
};