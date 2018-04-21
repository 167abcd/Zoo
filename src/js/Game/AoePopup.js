/**
 * Created by Balua on 8/1/17.
 */


var AoePopup = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(2000, 900));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        // toucWidget.setTouchEnabled(true);
        // toucWidget.addClickEventListener(function () {
        //     thiz.setOpen(false);
        // });
        this.addChild(toucWidget);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {

                thiz.removeFromParent(true);

            },
        }, toucWidget);

        var cuonngang1 = new cc.Sprite("#dialog_ngang1.png");
        cuonngang1.setPosition(cc.p(2000/2, 450));
        this.addChild(cuonngang1, 2);

        var cuonngang2 = new cc.Sprite("#dialog_ngang2.png");
        cuonngang2.setPosition(cc.p(2000/2, 420));
        this.addChild(cuonngang2, 1);
        this.cuonngang2 = cuonngang2;

        var bg_cuon = new cc.Sprite("#dialog_bgbg.png");
        bg_cuon.setAnchorPoint(cc.p(0.5, 1.0));
        bg_cuon.setPosition(bg_cuon.width/2,bg_cuon.height);
        this.bg_cuon = bg_cuon;



        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(cc.size(cuonngang1.width, 30+ bg_cuon.height));
        dontTouchLayer.setAnchorPoint(cc.p(0.5, 1.0));
        dontTouchLayer.setTouchEnabled(true);
        dontTouchLayer.setPosition(cc.p(2000/2  , cuonngang1.y+15));
        dontTouchLayer.addClickEventListener(function () {
                cc.log("touchher");
        });
        this.addChild(dontTouchLayer);






        var clippingNode = new ccui.Layout();
        clippingNode.setClippingEnabled(true);
        clippingNode.setAnchorPoint(cc.p(0.5, 1.0));
        clippingNode.setContentSize(cc.size(bg_cuon.width, 30));
        clippingNode.setPosition(2000 / 2, cuonngang1.y + 15);
        clippingNode.addChild(bg_cuon);
        this.addChild(clippingNode);
        this.clippingNode = clippingNode;


        this.isopen = false;
        // var btn_choithu = new ccui.Button("dialog_btn_dangky.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_choithu.setPosition(cc.p(2000/2 - 200, 10));
        // btn_choithu.addClickEventListener(function () {
        //     thiz.setOpen(true);
        // });
        // this.addChild(btn_choithu);
        //
        //
        // var btn_choithu1 = new ccui.Button("dialog_btn_dangky.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_choithu1.setPosition(cc.p(2000/2 + 200, 10));
        // btn_choithu1.addClickEventListener(function () {
        //     thiz.setOpen(false);
        // });
        // this.addChild(btn_choithu1);
        thiz.setOpen(true);
    },

    update : function (dt) {
        if(this.isopen)
        {
            if(this.clippingNode.height <= this.bg_cuon.height){


                var nextsize = this.clippingNode.height + (dt * 1500);
                if(nextsize > this.bg_cuon.height)
                {
                    nextsize = this.bg_cuon.height;
                }

                var nextpos = this.cuonngang2.y -  (dt * 1500);

                if(nextpos < 200.0)
                {
                    nextpos = 200.0;
                }

                this.clippingNode.setContentSize(cc.size(this.clippingNode.width, nextsize));
                this.bg_cuon.y = this.clippingNode.height;
               // this.bg_cuon.setPosition(cc.p(this.bg_cuon.x, this.bg_cuon.y + (dt * 100)));
                this.cuonngang2.setPosition(cc.p(this.cuonngang2.x, nextpos));


            }
            else
            {
                this.unscheduleUpdate();
            }
        }
        else
        {
            if(this.clippingNode.height > 0 && this.clippingNode.height <= this.bg_cuon.height){

                var nextsize = this.clippingNode.height - (dt * 1500);
                if(nextsize < 30)
                {
                    nextsize = 30;
                }

                var nextpos = this.cuonngang2.y +  (dt * 1500);

                if(nextpos > 420.0)
                {
                    nextpos = 420.0;

                }

                this.clippingNode.setContentSize(cc.size(this.clippingNode.width, nextsize));
                this.bg_cuon.y = this.clippingNode.height;
                this.cuonngang2.setPosition(cc.p(this.cuonngang2.x, nextpos));

                if(nextpos === 420.0)
                {
                    // this.setVisible(false);
                }
            }
            else
            {
                this.unscheduleUpdate();
            }
        }



    },

    setOpen : function (isopen) {
        this.isopen = isopen;
        this.scheduleUpdate();
    }


});

var AoePopupNew = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(2000, 900));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        // toucWidget.setTouchEnabled(true);
        // toucWidget.addClickEventListener(function () {
        //     thiz.setOpen(false);
        // });
        this.addChild(toucWidget);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {

                thiz.removeFromParent(true);

            },
        }, toucWidget);

      var  dialogBg = new ccui.Scale9Sprite("aoe_bg_pup_new.png", cc.rect(16,16,4,4));
        dialogBg.setPreferredSize(cc.size(353,264));
        dialogBg.setPosition(2000/2 , 900/2);
        this.bg_cuon = dialogBg;
        this.addChild(dialogBg);
    }





});

var AoePopupFree = AoePopupNew.extend({
    ctor : function () {
        this._super();
        var lb_content = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER, 350);
        lb_content.setColor(cc.color("#f3ca72"));
        lb_content.setPosition(cc.p(this.bg_cuon.width/2, this.bg_cuon.height/2));
        this.lb_content = lb_content;
        this.bg_cuon.addChild(lb_content);
    },
    setContent:function (content) {
        this.lb_content.setString("Chúc mừng bạn có "+ content+ " lượt quay miễn phí");
    }
});

var AoePopupHom = AoePopupNew.extend({
    ctor : function () {
        this._super();
        var lb_content = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER, 350);
        lb_content.setColor(cc.color("#f3ca72"));
        lb_content.setPosition(cc.p(this.bg_cuon.width/2, this.bg_cuon.height/2-20));
        var temp = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30,  "Chúc mừng bạn tìm được", cc.TEXT_ALIGNMENT_CENTER, 350);
        temp.setColor(cc.color("#f3ca72"));
        temp.setPosition(cc.p(this.bg_cuon.width/2, this.bg_cuon.height/2+20));

        this.lb_content = lb_content;
        this.bg_cuon.addChild(lb_content);
        this.bg_cuon.addChild(temp  );
    },
    setContent:function (content) {
        var mScene = cc.director.getRunningScene();
        if(mScene.isGiftCode){
            this.lb_content.setString(content+ " điểm");
        }else {
            this.lb_content.setString(content+ " Bin");
        }

    }

});