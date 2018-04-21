
var HomeMenuLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var bg = new cc.Sprite("#home_menu_bg.png");
        this.setContentSize(bg.getContentSize());
        bg.setAnchorPoint(cc.p(0,0));
        this.addChild(bg);
        this.setAnchorPoint(cc.p(1.0, 1.0));
        this.setPosition(1280 - 14, 629);
        this.rectTouch = cc.rect(0,0, this.width, this.height);

        var activityBt = new ccui.Button("home_menu_activityBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        activityBt.setPosition(101, 46 + 89*3);
        this.addChild(activityBt);

        var rankBt = new ccui.Button("home_menu_rankBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rankBt.setPosition(101, 46 + 89*2);
        this.addChild(rankBt);

        // var vipBt = new ccui.Button("home_menu_vipBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // vipBt.setPosition(101, 46 + 89);
        // this.addChild(vipBt);

        var settingBt = new ccui.Button("home_menu_settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(101, 46);
        this.addChild(settingBt);

        activityBt.addClickEventListener(function () {
            var dialog = new ActivityDialog();
            dialog.show();
        });

        rankBt.addClickEventListener(function () {
            var poprank = new SubScene(new RankLayer());
            poprank.show();
        });

        settingBt.addClickEventListener(function () {
            var dialog = new SettingDialog();
            dialog.show();
        });

        // vipBt.addClickEventListener(function () {
        //     var dialog = new SubScene(new VipLayer());
        //     dialog.show();
        // });

        this.setVisible(false);
    },

    checkVisible : function () {
        var node = this;
        while(node){
            if(!node.visible){
                return false;
            }
            node = node.getParent();
        }
        return true;
    },

    show : function () {
        this.onShowButtonHandler();
    },

    onShowButtonHandler : function () {
        var thiz = this;
        if(thiz.visible){
            thiz.runAction(cc.sequence(new cc.EaseSineOut(cc.scaleTo(0.1, 0.0)), cc.callFunc(function () {
                thiz.visible = false;
            })));
        }
        else{
            thiz.visible = true;
            thiz.setScale(0.0);
            thiz.runAction(new cc.EaseSineOut(cc.scaleTo(0.1, 1.0)));
        }
    },

    onEnter : function () {
        this._super();

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
                thiz.onTouchEnded(touch, event);
            }
        }, this);
    },

    onTouchBegan : function (touch, event) {
        if(!this.checkVisible()){return false;};

        var p = this.convertToNodeSpace(touch.getLocation());
        this._touchInside = cc.rectContainsPoint(this.rectTouch, p);
        return true;
    },
    onTouchMoved : function (touch, event){},
    onTouchEnded : function (touch, event) {
        if(!this.checkVisible()){return;};

        if(this._touchInside === false){
            this.show();
        }
    }
});