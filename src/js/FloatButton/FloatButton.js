var s_float_button_games = s_float_button_games || [
    GameType.MiniGame_Poker,
    GameType.MiniGame_TaiXiu,
    GameType.MiniGame_CuopBien_Slot,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_Candy_Slot
];
var s_float_button_animationDuration = s_float_button_animationDuration || 0.2;

var FloatButtonCenter = cc.Node.extend({
    ctor : function () {
        this._super();
        var normalSprite = new cc.Sprite("#floatBt-1.png");
        this.addChild(normalSprite);
        this.setContentSize(normalSprite.getContentSize());

        // var showSprite = new cc.Sprite("#floatBt-2.png");
        // this.addChild(showSprite);

        this.normalSprite = normalSprite;
        //  this.showSprite = showSprite;
    },

    onEnter: function () {
        this._super();
        this.hide();
        //  this.showSprite.runAction(new cc.RepeatForever(new cc.RotateBy(3.0, 360)));
    },

    show : function () {
        // this.showSprite.visible = false;
    },
    hide : function () {
        //   this.showSprite.visible = true;
    }
});

var FloatButton = (function() {
    var instance = null;
    var FloatButtonClass = cc.Node.extend({
        ctor : function () {
            this._super();
            this.showAll = false;
            this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            this.setScale(0.7);
            var bg = new cc.Sprite("#floatBt-bg.png");
            bg.visible = false;
            this.addChild(bg);
            this.bg = bg;

            var _newCountMiniTaiXiu = new MiniTaiXiuNotification();
            _newCountMiniTaiXiu.setPosition(cc.p(42,42));
            this.addChild(_newCountMiniTaiXiu, 10);
            _newCountMiniTaiXiu.setVisible(false);
            this.newCountMiniTaiXiu = _newCountMiniTaiXiu;

            this.initComponent();
            this.initButtonCenter();

            this.setPosition(1700, cc.winSize.height - 200);
            this.forceHide();

            SceneNavigator.resizeEvent(this);

            this.setMouseOverEnable();
        },

        _onMouseMove : function () {
            return this.showAll;
        },

        onCanvasResize : function () {
            if(this.winSizeHeight !== undefined){
                this.y += -(this.winSizeHeight - cc.winSize.height);
            }
            this.winSizeHeight = cc.winSize.height;

            this.updateMove();
        },
        initButtonCenter : function () {
            var btCenter = new FloatButtonCenter();
            btCenter.setPosition(0,0);
            this.addChild(btCenter);

            this.rectTouch = cc.rect(-btCenter.getContentSize().width/2, -btCenter.getContentSize().height/2, btCenter.getContentSize().width, btCenter.getContentSize().height);
            this.btCenter = btCenter;

            this.boudingSizeMin = cc.size(btCenter.getContentSize().width, btCenter.getContentSize().height);
            this.boudingSizeMax = cc.size(this.bg.getContentSize().width, this.bg.getContentSize().height);
            this.boudingSize = this.boudingSizeMin;
        },
        initComponent : function () {
            var radius = cc.p(0, 140);
            var size = s_float_button_games.length;
            var allComponent = [];
            for(var i=0;i<size;i++){
                var component = new FloatButtomComponent(s_float_button_games[i]);
                var angle = cc.PI * 2 / size * i;
                component.targetPosition =  cc.pRotateByAngle(radius, cc.p(0,0), angle);
                component.visible = false;
                this.addChild(component);
                allComponent.push(component);

                component.setPosition(component.targetPosition);
            }
            this.allComponent = allComponent;
        },
        _moveToBoder : function () {

        },
        show : function () {
            // var currentParent = this.getParent();
            // if(currentParent){
            //     currentParent.removeChild(this);
            // }
            // parent.addChild(this,100);
            this.setVisible(true);
            this.forceHide();
            // cc.log("show");
        },
        hide: function () {
            this.setVisible(false);
        },
        onEnter : function () {
            this._super();
            this.isTouch = false;
            this._moveToBoder();

            var thiz = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function (touch, event) {
                    if(thiz.isTouch){
                        return false;
                    }
                    var b = thiz.onTouchBegan(touch, event);
                    if(b){
                        thiz.isTouch = true;
                    }
                    return b;
                },
                onTouchMoved : function (touch, event) {
                    thiz.onTouchMoved(touch, event);
                },
                onTouchEnded : function (touch, event) {
                    thiz.isTouch = false;
                    thiz.onTouchEnded(touch, event);
                }
            }, this);
        },
        onExit : function () {
            this._super();
            cc.eventManager.removeListeners(this);
        },
        onTouchBegan : function (touch, event){
            if(!cc.Global.NodeIsVisible(this)){
                return false;
            }
            var p = this.convertToNodeSpace(touch.getLocation());
            if(cc.rectContainsPoint(this.rectTouch, p)){
                this.stopAllActions();

                this.startPosition = touch.getLocation();
                this.isMoved = false;
                this.canMoved = true;
                return true;
            }
            else{
                if(this.showAll){
                    this.canMoved = false;
                    this.hideAllComponent();
                    return true;
                }
            }
            return false;
        },
        onTouchMoved : function (touch, event){
            if(!this.canMoved){
                return;
            }
            var p = touch.getLocation();
            if(!this.isMoved){
                var d = cc.pDistance(this.startPosition, p);
                if(cc.pDistance(this.startPosition, p) >= 10){
                    this.isMoved = true;
                }
                else{
                    return;
                }
            }

            //fix position
            var x = this.x + (p.x - this.startPosition.x);
            var y = this.y + (p.y - this.startPosition.y);
            this.setPosition(x, y);
            this.updateMove();
            this.startPosition = p;
        },
        onTouchEnded : function (touch, event){
            if(!this.canMoved){
                return;
            }
            if(!this.isMoved){
                if(this.showAll){
                    this.hideAllComponent();
                }
                else{
                    this.showAllComponent();
                }
            }
            else{
                this._moveToBoder();
            }
        },

        updateMove : function () {
            var x = this.x;
            var y = this.y;

            var left = x - this.boudingSize.width/2;
            var right = x + this.boudingSize.width/2;
            var top = y + this.boudingSize.height/2;
            var bottom = y - this.boudingSize.height/2;
            if(left < 0){
                x = this.boudingSize.width/2;
            }
            if(right > cc.winSize.width){
                x = cc.winSize.width - this.boudingSize.width/2;
            }
            if(bottom < 0){
                y = this.boudingSize.height/2;
            }
            if(top > cc.winSize.height){
                y = cc.winSize.height - this.boudingSize.height/2;
            }

            this.x = x;
            this.y = y;
        },

        showAllComponent : function () {
            this.newCountMiniTaiXiu.setVisible(false);

            this.showAll = true;
            this.btCenter.show();
            for(var i=0;i<this.allComponent.length;i++){
                this.allComponent[i].show(s_float_button_animationDuration);
            }
            this.bg.visible = true;
            this.bg.setScale(0.0);
            this.bg.stopAllActions();
            this.bg.runAction(new cc.EaseSineOut(new cc.ScaleTo(s_float_button_animationDuration, 1.0)));

            this.boudingSize = this.boudingSizeMax;
            this._moveToBoder();
        },
        hideAllComponent : function () {
            this.newCountMiniTaiXiu.setVisible(true);
            this.showAll = false;
            this.btCenter.hide();
            for(var i=0;i<this.allComponent.length;i++){
                this.allComponent[i].hide(s_float_button_animationDuration);
            }
            this.bg.stopAllActions();
            var scaleAction = new cc.EaseSineIn(new cc.ScaleTo(s_float_button_animationDuration, 0.0));
            var thiz = this;
            var finishedAction = new cc.CallFunc(function () {
                thiz.bg.visible = false;
            });
            this.bg.runAction(new cc.Sequence(scaleAction, finishedAction));

            this.boudingSize = this.boudingSizeMin;
            this._moveToBoder();
        },
        forceHide : function () {
            this.newCountMiniTaiXiu.setVisible(true);
            this.showAll = false;
            this.btCenter.hide();
            for(var i=0;i<this.allComponent.length;i++){
                this.allComponent[i].visible = false;
            }
            this.bg.visible = false;

            this.boudingSize = this.boudingSizeMin;
            this._moveToBoder();
        }
    });

    FloatButtonClass.getInstance = function() {
        if (!instance) {
            instance = new FloatButtonClass();
            instance.retain();
        }
        return instance;
    };

    return FloatButtonClass;
})();
