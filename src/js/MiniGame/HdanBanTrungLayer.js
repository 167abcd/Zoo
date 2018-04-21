/**
 * Created by Balua on 9/11/17.
 */

var HdanBanTrungLayer = IDialog.extend({
    ctor : function () {
        this._super();

        this._marginLeft = 0.0;
        this._marginRight = 0.0;
        this._marginTop = 0.0;
        this._marginBottom = 0.0;


        var dialogBg = new cc.Sprite("#hdan_3x_bg.png");
        dialogBg.setAnchorPoint(cc.p(0.0,0.0));
        this.addChild(dialogBg, 1);
        this.setContentSize(dialogBg.getContentSize());
        this.dialogBg = dialogBg;

        var thiz = this;


        var closeButton = new ccui.Button("hdan_3x_btnclos.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(cc.p(618, 470));
        dialogBg.addChild(closeButton);
        closeButton.addClickEventListener(function () {
            thiz.hide();
        });



        var scrollView = new newui.TableView(cc.size(569, 426), 1);
        scrollView.setPosition(29, 27);
        // scrollView.setPadding(30);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        dialogBg.addChild(scrollView);
        this.scrollView = scrollView;



        var hdan1 = new cc.Sprite("#hdan_3x_dong1.png");
        hdan1.setAnchorPoint(cc.p(0.5, 1.0));
        var hdan2 = new cc.Sprite("#hdan_3x_dong2.png");
        hdan2.setAnchorPoint(cc.p(0.5, 1.0));

        var height = hdan1.height + hdan2.height + 30;

        this.scrollHeight = height - this.scrollView.getContentSize().height;
        this.startAutoScroll(4.0);
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.scrollView.getContentSize().width - 10, height));

        hdan1.setPosition(cc.p(container.width/2, height));
        hdan2.setPosition(cc.p(hdan1.x, height - hdan1.height - 30));
        container.addChild(hdan1);
        container.addChild(hdan2);
        this.scrollView.pushItem(container);


        this.initTouchView();

    },


     initTouchView : function () {

        this.mTouch = cc.rect(this._marginLeft, this._marginBottom, this.dialogBg.width - this._marginRight, this.dialogBg.height - this._marginTop);
        this._maxLeft = this.dialogBg.width/2 + 4;
        this._maxRight = cc.winSize.width - this.dialogBg.width/2 - 4;
        this._maxBottom = this.dialogBg.height/2 + 4;
        this._maxTop = cc.winSize.height - this.dialogBg.height/2 - 4;
    },
    onEnter : function () {
      this._super();
        // this.startAutoScroll(2.0);
    },

    startAutoScroll : function (delayTime) {
        // var thiz = this;
        // this.scrollView.stopAllActions();
        // this.scrollView.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
        //     var duration =  thiz.scrollHeight / 40.0;
        //     thiz.scrollView.scrollToBottom(duration, false);
        // })));
    },
});