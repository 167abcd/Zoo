/**
 * Created by kd on 7/11/2018.
 */

var IDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        this._parentDialog = null;

        this._isShow = false;
        this._moveEnable = false;
        this._touchOutSideClose = true;
        this.mTouch = cc.rect(0,0,0,0);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._maxLeft = 0;
        this._maxRight = cc.winSize.width;
        this._maxBottom = 0;
        this._maxTop = cc.winSize.height;

        SceneNavigator.addBackKeyEvent(this);
    },

    onCanvasResize : function () {
        this.colorLayer.setContentSize(cc.winSize);

        // if(this.winSizeHeight !== undefined){
        //     this.y += -(this.winSizeHeight - cc.winSize.height);
        // }
        // this.winSizeHeight = cc.winSize.height;
        if(cc.winSize.height > 1000){
            this.setPosition(cc.winSize.width/2, cc.winSize.height - 500);
        }
        else{
            this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        }
    },

    _onKeyBackHandler : function () {
        this.hide();
        return true;
    },

    adjustlel : function () {

    },
    show : function (rootNode) {
        this._isShow = true;
        var parentNode = this.getParent();
        if(parentNode){
            this.removeFromParent(true);
            parentNode.removeFromParent(true);
            parentNode = null;
        }

        if(!rootNode){
            rootNode = cc.director.getRunningScene();
        }

        if(rootNode){
            if(rootNode.popupLayer){
                parentNode = rootNode.popupLayer;
            }
            else{
                parentNode = rootNode;
            }

            this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            if(!this._bgColor){
                this._bgColor = cc.color(0,0,0,200);
            }
            var colorLayer = new cc.LayerColor(this._bgColor, cc.winSize.width, cc.winSize.height);
            this.colorLayer = colorLayer;
            colorLayer.addChild(this);
            parentNode.addChild(colorLayer);
        }

        if(this._parentDialog){
            this._parentDialog.setDialogVisible(false);
        }
    },

    showWithAnimationScale : function () {
        IDialog.prototype.show.apply(this, arguments);

        var defaultScale = this.getScale();
        this.setScale(0.0);
        var scaleAction = new cc.EaseBackOut(new cc.ScaleTo(0.7, defaultScale));
        this.runAction(scaleAction);
    },

    showWithAnimationMove : function () {
        IDialog.prototype.show.apply(this, arguments);
        var currentPosition = this.getPosition();
        this.y = cc.winSize.height + this.getContentSize().height/2;
        var moveAction = new cc.EaseBounceOut(new cc.MoveTo(0.7, currentPosition));
        this.runAction(moveAction);
    },

    hide : function () {
        this._isShow = false;
        var parent = this.getParent();
        if(parent && !this.dontclosepoup){
            this.removeFromParent(true);
            parent.removeFromParent(true);
        }

        if(this._parentDialog){
            this._parentDialog.setDialogVisible(true);
            this._parentDialog = null;
        }
    },

    isShow : function () {
        //return this._running;
        return this._isShow;
    },

    onTouchDialog : function () {

    },
    setCloseTouchOutSide : function (val) {
        this._touchOutSideClose = val;
    },
    onExit : function () {
        this._super();
        this._isShow = false;
    },

    onEnter : function () {
        this._super();
        this._isShow = true;

        this._onMouseMove = function () {
            return true;
        };
        // this.setMouseOverEnable(true);

        this.addTouchEvent();

        // newui._addMouseScrollEvent(this, function () {
        //     return true;
        // });
    },
    addTouchEvent : function () {
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved : function (touch, event){
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded : function (touch, event) {
                thiz.onTouchEnded(touch, event);;
            }
        }, this);
    },
    onTouchBegan : function (touch, event) {
        if(this._moveEnable){
            var p = this.convertToNodeSpace(touch.getLocation());
            if(cc.rectContainsPoint(this.mTouch, p)){
                this.onTouchDialog();
                return true;
            }
            return false;
        }
        else{
            var p = this.convertToNodeSpace(touch.getLocation());
            if(cc.rectContainsPoint(this.mTouch, p)){
                this._touchInside = true;
                this.adjustlel();
            }
            return true;
        }
        return false;
    },

    onTouchMoved : function (touch, event){
        if(this._moveEnable){
            this.moveDialog(touch.getDelta());
        }
    },

    onTouchEnded : function (touch, event) {
        if(this._moveEnable){

        }
        else{
            if(this._touchInside){
                this._touchInside = false;
                return;
            }
            var p = this.convertToNodeSpace(touch.getLocation());
            if(!cc.rectContainsPoint(this.mTouch, p)){
                if(this._touchOutSideClose) this.hide();
            }
        }
        cc.log(this._moveEnable);
    },

    moveDialog : function (ds) {
        this.x += ds.x;
        this.y += ds.y;
        if(this.x < this._maxLeft){
            this.x = this._maxLeft;
        }
        if(this.x > this._maxRight){
            this.x = this._maxRight;
        }
        if(this.y < this._maxBottom){
            this.y = this._maxBottom;
        }
        if(this.y > this._maxTop){
            this.y = this._maxTop;
        }
    },

    setDialogVisible: function (isVisible) {
        var parent = this.getParent();
        if(parent){
            parent.setVisible(isVisible);
        }
    }
});


var Dialog = IDialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var dialogBg = new cc.Sprite("#dialog_bg_1.png");
        dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition(0,0);
        this.addChild(dialogBg);

        this.setContentSize(dialogBg.getContentSize());
        this.mTouch = cc.rect(0,0,this.width,this.height);

        var closeButton = new ccui.Button("dialog_close_bt.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(1058, 600);
        this.addChild(closeButton,10);
        closeButton.addClickEventListener(function () {
            if(thiz.closeButtonHandler){
                thiz.closeButtonHandler();
            }
        });

        this.dialogBg = dialogBg;
        this.closeButton = closeButton;
    },

    closeButtonHandler : function () {
        this.hide();
    }
});

Dialog.addBackground = function (mNode, img) {
    var bg = new cc.Sprite(img);
    bg.setPosition(bg.width/2, bg.height/2);
    mNode.addChild(bg);
};

Dialog.createButton1 = function (normalImg) {
    return new ccui.Button(normalImg, "", "", ccui.Widget.PLIST_TEXTURE);
};

Dialog.createCheckBox = function (bgImg, checkImg) {
    var checkBox = new ccui.CheckBox();
    checkBox.loadTextureBackGround(bgImg, ccui.Widget.PLIST_TEXTURE);
    checkBox.loadTextureFrontCross(checkImg, ccui.Widget.PLIST_TEXTURE);
    return checkBox;
};

var LayerTouchHide = cc.Node.extend({
    ctor : function (size) {
        this._super();
        var thiz = this;
        if(!size)  size= cc.size(1920,1080);

        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(size);
        dontTouchLayer.setAnchorPoint(cc.p(0, 0));
        dontTouchLayer.setTouchEnabled(true);
        // dontTouchLayer.setPosition(cc.p(2000/2 - spritePhanthuong.width/2  , 900/2 - spritePhanthuong.height/2));
        dontTouchLayer.addClickEventListener(function () {
            //cc.log("touchher");
            thiz.setVisible(false);
        });
        this.addChild(dontTouchLayer);
    },

    setVisible:function (isVisible) {
        /*if(this._popupTamQuocClose && !isVisible && this.isVisible()){
         this._popupTamQuocClose();
         }*/
        this._super(isVisible);
    },
});

var LayerSwallowTouch = cc.Node.extend({
    ctor : function (size) {
        this._super();
        var thiz = this;
        if(!size)  size= cc.size(1920,1080);

        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(size);
        dontTouchLayer.setAnchorPoint(cc.p(0, 0));
        dontTouchLayer.setTouchEnabled(true);
        // dontTouchLayer.setPosition(cc.p(2000/2 - spritePhanthuong.width/2  , 900/2 - spritePhanthuong.height/2));
        dontTouchLayer.addClickEventListener(function () {
            //swallow touch other layer below
        });
        this.addChild(dontTouchLayer);
    }

});