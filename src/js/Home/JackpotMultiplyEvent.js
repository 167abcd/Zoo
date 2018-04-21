
var JackpotMultiplyEvent = JackpotMultiplyEvent || {};

(function () {
    JackpotMultiplyEvent._jackpotMultiplyEventInfo = {};

    var initGlobalListener = function () {
        var listener = {};
        listener.onUpdate = function (cmd, event) {
          //  cc.log("data: ", event);
            var gameName = event["g"];
            var data = event["data"];
            var title = data["1"];
            var multi = data["2"];
            var betting = data["3"];
            var active = data["6"];
            var detail = data["7"];
            var name = (betting) ? (gameName + "_" + betting) : gameName;
            JackpotMultiplyEvent._jackpotMultiplyEventInfo[name] = {
                active: active,
                title: title,
                detail: detail,
                multi: multi
            };
        };

        SocketClient.getInstance().addListener("jackpotEventInfo", listener.onUpdate, listener);
    };

    var func = window._cc_finished_Loading;
    window._cc_finished_Loading = function () {
        initGlobalListener();
        func();
    };
})();

JackpotMultiplyEvent.HomeIcon = cc.Node.extend({
    ctor: function (gameId) {
        this._super();
        this._gameName = s_gameName[gameId];
        this._betting = null;
        this._initView();
    },

    _initView: function () {
        var bgIcon = new cc.Sprite("#jackpot_multi_icon.png");
        this.setContentSize(bgIcon.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        bgIcon.setPosition(this.width/2, this.height/2);
        this.addChild(bgIcon);

        var multiIcon = new cc.Sprite("#jackpot_multi_icon_x2.png");
        multiIcon.setPosition(bgIcon.getPosition());
        this.addChild(multiIcon);
        this.multiIcon = multiIcon;

        this._initTitle();
    },

    _initTitle: function () {
        var titleNode = new cc.Node();
        this.addChild(titleNode);
        this.titleNode = titleNode;

        var titleBg = new cc.Sprite("#jackpot_multi_bg_1.png");
        titleBg.setPosition(this.width/2, 15);
        titleNode.addChild(titleBg);

        var clippingMessage = new ccui.Layout();
        clippingMessage.setContentSize(100, 20);
        clippingMessage.setClippingEnabled(true);
        clippingMessage.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingMessage.setAnchorPoint(cc.p(0.0, 0.0));
        clippingMessage.setPosition(titleBg.x - clippingMessage.width/2, titleBg.y - clippingMessage.height/2);
        titleNode.addChild(clippingMessage);
        this.clippingMessage = clippingMessage;

        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "abcdefghij");
        messageLabel.setAnchorPoint(cc.p(0.0, 0.5));
        messageLabel.setColor(cc.color("#FFFFFF"));
        messageLabel.setPosition(cc.p(0, clippingMessage.height/2));
        clippingMessage.addChild(messageLabel);
        this.messageLabel = messageLabel;

       // this.onUpdateTitle("deptrai 123");
    },

    _onUpdateEventInfo: function (cmd, data) {
        if(this._gameName && this._gameName === data["g"]){
            if(this._betting !== null){
                if(this._betting === data["data"]["3"]){
                    this._refreshView();
                }
            }
            else{
                this._refreshView();
            }
        }
    },

    _refreshView: function () {
        if(this._betting !== null){
            var infoName = this._gameName + "_" + this._betting;
        }
        else{
            var infoName = this._gameName;
        }
        var info = JackpotMultiplyEvent._jackpotMultiplyEventInfo[infoName];
        if(info){
            var active = info["active"];
            this.onActive(active);
            if(active){
                this.onUpdateMultiply(info["multi"]);
                this.onUpdateTitle(info["title"]);
                this.onUpdateDetail(info["detail"]);
            }
        }
        else{
            this.onActive(false);
        }
    },

    onEnter: function () {
        this._super();
        SocketClient.getInstance().addListener("jackpotEventInfo", this._onUpdateEventInfo, this);
        this._refreshView();
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    onActive: function (active) {
        this.setVisible(active);
    },

    onUpdateMultiply: function (multi) {
        if(multi === 2){
            this.multiIcon.setSpriteFrame("jackpot_multi_icon_x2.png");
        }
        else if(multi === 4){
            this.multiIcon.setSpriteFrame("jackpot_multi_icon_x4.png");
        }
        else{
            this.multiIcon.setSpriteFrame("jackpot_multi_icon_x10.png");
        }
    },

    onUpdateTitle: function (title) {
        var msgLabel = this.messageLabel;
        var clipping = this.clippingMessage;
        var originX = this.clippingMessage.width;

        msgLabel.stopAllActions();
        msgLabel.setString(title);
        msgLabel.setAnchorPoint(cc.p(0.0, 0.5));
        msgLabel.setPositionX(originX);
        var ds = clipping.width + msgLabel.width + 10;
        var action = new cc.Sequence(new cc.MoveBy(ds / 20, cc.p(-ds, 0)), new cc.CallFunc(function () {
            msgLabel.setPositionX(originX);
        }));
        msgLabel.runAction(new cc.RepeatForever(action));
    },

    onUpdateDetail: function (detail) {

    },

    setBetting: function (betting) {
        this._betting = betting;
        this._refreshView();
    },

    setGameId: function (gameId) {
        this._gameName = s_gameName[gameId];
        this._refreshView();
    }
});

JackpotMultiplyEvent.GameIcon = JackpotMultiplyEvent.HomeIcon.extend({
    ctor: function (gameId, betting) {
        this._super(gameId);
        this._betting = betting;
        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.boundingRect = cc.rect(0,0, this.width, this.height);

        if(SceneNavigator.resizeEvent){
            SceneNavigator.resizeEvent(this);
        }

        // if(this.setMouseOverEnable){
        //     this.setMouseOverEnable();
        // }

        this.onUpdateTitle("abc abc abc abc abc abc abc abc abc abc abc abc abc abc ");
    },

    onCanvasResize : function () {
        if(this.winSizeHeight !== undefined){
            this.y += -(this.winSizeHeight - cc.winSize.height);
        }
        this.winSizeHeight = cc.winSize.height;

        this.updateMove();
    },

    // _onMouseOver: function (isOver) {
    //     this.showDetail(isOver);
    // },

    _initView: function () {
        this._super();
        this._initDetail();
    },

    _initDetail: function () {
        var detailNode = new cc.Node();
        this.addChild(detailNode);
        this.detailNode = detailNode;

        var detailBg = new cc.Sprite("#jackpot_multi_bg_1.png");
        detailBg.setPosition(cc.p(this.width/2, 0));
        detailBg.setScaleX(290/ detailBg.width);
        detailNode.addChild(detailBg);
        this.detailBg = detailBg;

        var detailLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "", cc.TEXT_ALIGNMENT_CENTER, 260);
        detailLabel.setPosition(detailBg.getPosition());
        detailNode.addChild(detailLabel);
        this.detailLabel = detailLabel;
    },

    onUpdateDetail: function (detail) {
        this.detailLabel.setString(detail);

        var bgHeigh =  this.detailLabel.height + 20;
        if(bgHeigh < 40){
            bgHeigh = 40;
        }
        this.detailBg.setScaleY(bgHeigh / this.detailBg.height);
        this.detailBg.y = 20 - bgHeigh / 2;
        this.detailLabel.setPosition(this.detailBg.getPosition());
    },

    showDetail: function (show) {
        this.titleNode.setVisible(!show);
        this.detailNode.setVisible(show);
    },

    onClicked: function () {
        if(this.titleNode.isVisible()){
            this.showDetail(true);
        }
        else{
            this.showDetail(false);
        }
    },

    onEnter: function () {
        this._super();
        var thiz = this;
        this.titleNode.setVisible(true);
        this.detailNode.setVisible(false);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            },
            onTouchCancelled: function (touch, event) {
                thiz.onTouchCancelled(touch, event);
            }
        }, this);
    },

    onExit: function () {
        this._super();
    },

    onTouchBegan : function (touch, event){
        var node = this;
        while(node){
            if(node.isVisible() === false){
                return false;
            }
            node = node.getParent();
        }

        if(this.prePoint){
            return false;
        }

        var p = this.convertToNodeSpace(touch.getLocation());
        if(cc.rectContainsPoint(this.boundingRect, p)){
            this.prePoint = touch.getLocation();
            this.isMoved = false;
            return true;
        }
        return false;
    },
    onTouchMoved : function (touch, event){
        var p = touch.getLocation();
        if(!this.isMoved){
            if(cc.pDistance(this.prePoint, p) >= 10){
                this.isMoved = true;
            }
            else{
                return;
            }
        }

        //fix position
        var x = this.x + (p.x - this.prePoint.x);
        var y = this.y + (p.y - this.prePoint.y);
        this.setPosition(x, y);
        this.prePoint = p;

        this.updateMove();
    },
    onTouchEnded : function (touch, event){
        if(!this.isMoved){
            this.onClicked();
        }
        this.prePoint = null;
    },
    onTouchCancelled: function (touch, event){
        this.prePoint = null;
    },
    updateMove : function () {
        var x = this.x;
        var y = this.y;

        var left = x - this.boundingRect.width/2;
        var right = x + this.boundingRect.width/2;
        var top = y + this.boundingRect.height/2;
        var bottom = y - this.boundingRect.height/2;
        if(left < 0){
            x = this.boundingRect.width/2;
        }
        if(right > cc.winSize.width){
            x = cc.winSize.width - this.boundingRect.width/2;
        }
        if(bottom < 0){
            y = this.boundingRect.height/2;
        }
        if(top > cc.winSize.height){
            y = cc.winSize.height - this.boundingRect.height/2;
        }

        this.x = x;
        this.y = y;
    }
});

JackpotMultiplyEvent.GameIconNoMove = JackpotMultiplyEvent.GameIcon.extend({
    onTouchMoved : function (touch, event) {
        var p = touch.getLocation();
        if(!this.isMoved){
            if(cc.pDistance(this.prePoint, p) >= 10){
                this.isMoved = true;
            }
            else{
                return;
            }
        }
    }
});