/**
 * Created by Balua on 8/1/17.
 */



var TetPopupNew = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        // var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 1000);
        // this.addChild(blackBg);

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(2000, 1000));
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

                thiz.onRemove();

            },
        }, toucWidget);

      var  dialogBg = new cc.Sprite("#tet_bg_thong_bao.png");
        // dialogBg.setPreferredSize(cc.size(353,264));
        dialogBg.setPosition(2000/2 , 900/2);
        this.bg_cuon = dialogBg;
        this.addChild(dialogBg);
    },


    onRemove:function () {
        this.removeFromParent(true);
    }




});

var TetPopupFree = TetPopupNew.extend({
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

var TetPopupHom = TetPopupNew.extend({
    ctor : function () {
        this._super();
        this.oneClick = false;
        var lb_content = cc.Label.createWithBMFont(cc.res.font.Font_money_26_tet, "", cc.TEXT_ALIGNMENT_CENTER, 350);
        // lb_content.setColor(cc.color("#f3ca72"));
        lb_content.setScale(1.2);
        lb_content.setAnchorPoint(0.5,0.5);
        lb_content.setPosition(cc.p(this.bg_cuon.width/2, this.bg_cuon.height/2-60));
        //
        // var lb_lDuoi = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, " Bin", cc.TEXT_ALIGNMENT_CENTER, 350);
        // lb_lDuoi.setAnchorPoint(0,0.5);
        // lb_lDuoi.setPosition(cc.p(this.bg_cuon.width/2+5+20 , this.bg_cuon.height/2-53));
        // this.lb_lDuoi = lb_lDuoi;
        var temp = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30,  "Chúc mừng bạn lấy được", cc.TEXT_ALIGNMENT_CENTER, 350);
        temp.setPosition(cc.p(this.bg_cuon.width/2, this.bg_cuon.height/2));

        this.lb_content = lb_content;
        this.bg_cuon.addChild(lb_content);
        // this.bg_cuon.addChild(lb_lDuoi);
        this.bg_cuon.addChild(temp);
    },
    setContent:function (content) {
        var mScene = cc.director.getRunningScene();
        this.lb_content.setString(content);
        // var lech =  (this.lb_content.width - 106)/2;
        // this.lb_content.setPositionX(this.lb_content.x + lech);
        // this.lb_lDuoi.setPositionX(this.lb_lDuoi.x + lech);


    },
    onRemove:function () {
        if( this.oneClick ){
            this.removeFromParent(true);
        }

    }
});