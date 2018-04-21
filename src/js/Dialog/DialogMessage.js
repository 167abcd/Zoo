/**
 * Created by ext on 7/16/2016.
 */

/**
 * Created by kk on 7/16/2016.
 */

var DialogMessage = IDialog.extend({
    ctor : function (size) {
        this._super();

        this.sizeDialog = size? size : cc.size(543, 230);
        this._paddingBottom = 0;





        var forebg = new ccui.Scale9Sprite("TableGui/bg_alert.png", cc.rect(30, 84, 473, 119));
        forebg.setPreferredSize(this.sizeDialog);

        this.setContentSize(forebg.getPreferredSize());
        this.mTouch = cc.rect(0,0,this.width,this.height);

        forebg.setAnchorPoint(cc.p(0.5,1));
        forebg.setPosition(cc.p(this.width/2, this.height));
        this.addChild(forebg, 1);
        this.forebg = forebg;


        var title = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, "THÔNG BÁO");
        title.setPosition(cc.p(this.width/2, this.height - 40));
        this.addChild(title, 1);
        this.title = title;


        var scrollView = new ccui.ListView();
        scrollView.setContentSize(cc.size(forebg.width - 20, forebg.height - 40));
        scrollView.setPosition(cc.p(20, 20));
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        forebg.addChild(scrollView);
        this.scrollView = scrollView;
    },

    setTitle : function (title) {
        this.title.setString(title);
    },

    setMessage : function (message, textAlignment) {
        if(textAlignment === undefined){
            textAlignment = cc.TEXT_ALIGNMENT_CENTER;
        }
        this.scrollView.removeAllItems();
        if(this.getChildByTag(10))
        {
            this.getChildByTag(10).removeFromParent();
        }
        // var messageLabel = new cc.LabelTTF(message, cc.res.font.Roboto_Condensed, 22, cc.size(this.scrollView.getContentSize().width - 10, 0), textAlignment);
        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, message, textAlignment, this.scrollView.width - 10);
        var height = messageLabel.height + 20.0;

        if(height <= this.scrollView.height){
            this.scrollView.setEnabled(false);
            messageLabel.setAnchorPoint(cc.p(0.5, 0.5));
            messageLabel.setPosition(cc.p(this.forebg.width/2, this.forebg.height/2));
            messageLabel.setTag(10);
            this.forebg.addChild(messageLabel);
        }
        else
        {
            this.scrollView.setEnabled(true);
            this.scrollHeight = height - this.scrollView.height;
            this.startAutoScroll(4.0);
            var container = new ccui.Widget();
            container.setContentSize(cc.size(this.scrollView.width - 10, height));
            container.addChild(messageLabel);
            messageLabel.setPosition(container.width/2, container.height/2);
            this.scrollView.pushBackCustomItem(container);
        }
    },

    startAutoScroll : function (delayTime) {
        var thiz = this;
        this.scrollView.stopAllActions();
        this.scrollView.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            var duration =  thiz.scrollHeight / 40.0;
            thiz.scrollView.scrollToBottom(duration, false);
        })));
    }
});

var CustomDialogMessage = IDialog.extend({
    ctor : function (bgImg, isPlist) {
        this._super();
        this._bgColor = cc.color(0,0,0,170);
        var path = isPlist ? "#"+bgImg : bgImg;
        var bg = new cc.Sprite(path);

        this.addChild(bg, 1);
        this.bg =bg;

        var title = new SlotLbl( "" , cc.res.font.Tahoma, 25);
        title.setColor(cc.color(207,173,86)) ;
        title.setPosition(bg.width/2, bg.height - 30);
        bg.addChild(title);
        this.title = title;

        this.setCloseTouchOutSide(false);

        var scrollView = new ccui.ListView();
        scrollView.setContentSize(cc.size(bg.width - 20, bg.height - 40));
        scrollView.setPosition(cc.p(20, 20));
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        bg.addChild(scrollView);
        this.scrollView = scrollView;


    },
    setCloseAfterTime : function (sec) {
        var thiz = this;
        var ac = cc.sequence(cc.delayTime(sec), cc.callFunc(function () {
            thiz.hide();
        }) );
        this.runAction(ac);
    },

    setTitle : function (title) {
        this.title.setString(title);
    },

    setMessage : function (message, textAlignment) {
        if(textAlignment === undefined){
            textAlignment = cc.TEXT_ALIGNMENT_CENTER;
        }
        this.scrollView.removeAllItems();
        if(this.getChildByTag(10))
        {
            this.getChildByTag(10).removeFromParent();
        }
        var messageLabel = new cc.LabelTTF(message, cc.res.font.Tahoma, 22, cc.size(this.scrollView.getContentSize().width - 10, 0), textAlignment);
        // var messageLabel = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, message, textAlignment, this.scrollView.width - 10);
        messageLabel.setColor(cc.color(207,173,86)) ;
        var height = messageLabel.height + 20.0;

        if(height <= this.scrollView.height){
            this.scrollView.setEnabled(false);
            messageLabel.setAnchorPoint(cc.p(0.5, 0.5));
            messageLabel.setPosition(cc.p(this.bg.width/2, this.bg.height/2));
            messageLabel.setTag(10);
            this.bg.addChild(messageLabel);
        }
        else
        {
            this.scrollView.setEnabled(true);
            this.scrollHeight = height - this.scrollView.height;
            this.startAutoScroll(4.0);
            var container = new ccui.Widget();
            container.setContentSize(cc.size(this.scrollView.width - 10, height));
            container.addChild(messageLabel);
            messageLabel.setPosition(container.width/2, container.height/2);
            this.scrollView.pushBackCustomItem(container);
        }
    },

    startAutoScroll : function (delayTime) {
        var thiz = this;
        this.scrollView.stopAllActions();
        this.scrollView.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            var duration =  thiz.scrollHeight / 40.0;
            thiz.scrollView.scrollToBottom(duration, false);
        })));
    }
});

var MessageConfirmDialog = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(829, 458));
        this._paddingBottom = 0;

        var title = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, "THÔNG BÁO");
        title.setPosition(cc.p(this.width/2, this.height - 33));
        this.addChild(title, 1);
        this.title = title;

        this.closeButton.setVisible(false);


        var thiz = this;

        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(804, 348));
        forebg.setAnchorPoint(cc.p(0.5, 1.0));
        forebg.setPosition(cc.p(this.width/2, this.height - 65));
        this.addChild(forebg, 1);
        this.forebg = forebg;

        var btn_cancel = new ccui.Button("dialog_btn_cancel.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_cancel.setPosition(cc.p(this.width/2 - 140, 50));
        forebg.addChild(btn_cancel, 1);
        btn_cancel.addClickEventListener(function () {
            thiz.hide();
        });


        var btn_ok = new ccui.Button("dialog_btn_ok.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_ok.setPosition(cc.p(this.width/2 + 140, 50));
        forebg.addChild(btn_ok, 1);
        this.btn_ok = btn_ok;



        var scrollView = new ccui.ListView();
        scrollView.setContentSize(cc.size(forebg.width - 20, forebg.height - 60 - 50));
        scrollView.setPosition(cc.p(20, 90));
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        forebg.addChild(scrollView);
        this.scrollView = scrollView;
    },

    setTitle : function (title) {
        this.title.setString(title);
    },

    setMessage : function (message, textAlignment) {
        if(textAlignment === undefined){
            textAlignment = cc.TEXT_ALIGNMENT_CENTER;
        }
        this.scrollView.removeAllItems();
        if(this.getChildByTag(10))
        {
            this.getChildByTag(10).removeFromParent();
        }

        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Tahoma_Regular_24, message, textAlignment, this.scrollView.width - 10);
        var height = messageLabel.height + 20.0;

        if(height <= this.scrollView.height){
            this.scrollView.setEnabled(false);
            messageLabel.setAnchorPoint(cc.p(0.5, 0.5));
            messageLabel.setPosition(cc.p(this.forebg.width/2, this.forebg.height/2));
            messageLabel.setTag(10);
            this.forebg.addChild(messageLabel);
        }
        else
        {
            this.scrollView.setEnabled(true);
            this.scrollHeight = height - this.scrollView.height;
            this.startAutoScroll(4.0);
            var container = new ccui.Widget();
            container.setContentSize(cc.size(this.scrollView.width - 10, height));
            container.addChild(messageLabel);
            messageLabel.setPosition(container.width/2, container.height/2);
            this.scrollView.pushBackCustomItem(container);
        }
    },

    startAutoScroll : function (delayTime) {
        var thiz = this;
        this.scrollView.stopAllActions();
        this.scrollView.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            var duration =  thiz.scrollHeight / 40.0;
            thiz.scrollView.scrollToBottom(duration, false);
        })));
    }
});