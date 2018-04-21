/**
 * Created by Balua on 7/25/17.
 */

var SubScene = IDialog.extend({
    ctor : function (subLayer) {
        this._super();
        var thiz = this;
        var bg = new cc.Sprite("res/Texture/game_bg.jpg");
        bg.setPosition(0, 0);
        bg.setTag(10);
        this.addChild(bg);
        this.bg = bg;

        subLayer.setPosition(0, cc.winSize.height/2);



        this.mTouch = cc.rect(-cc.winSize.width/2, -cc.winSize.height/2, cc.winSize.width, cc.winSize.height);
        this.addChild(subLayer,2);
        subLayer.subTopBar.btn_back.addClickEventListener(function () {
            thiz.onClickBack();
        });

        this.subLayer = subLayer;
    },
    changeBackground : function (newBg) {
        if(this.getChildByTag(10))
        {
            this.getChildByTag(10).removeFromParent();
            var bg = new cc.Sprite(newBg);
            bg.setPosition(0, 0);
            bg.setTag(10);
            this.addChild(bg);
            this.bg = bg;
        }
    },
    _onKeyBackHandler : function () {
        this.onClickBack();
        return true;
    },

    onClickBack : function () {
        if(!this.subLayer.onClickBack()){
            this.hide();
        }
    }
});