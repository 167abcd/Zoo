/**
 * Created by Balua on 10/31/17.
 */
var NoHuMiniGameLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var _background = new cc.Sprite("res/Texture/nohu_win_bantrung/nohu_background.png");
        _background.setScale(0.0);
        _background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this._background = _background;
        this.addChild(_background);


        var _anhsang = new cc.Sprite("res/Texture/nohu_win_bantrung/nohu_anhsang.png");
        _anhsang.setPosition(cc.winSize.width/2 + 130, cc.winSize.height/2 + 80);
        _anhsang.setScale(1.5);
        this.addChild(_anhsang, -2);
        _anhsang.runAction(new cc.RepeatForever(new cc.RotateBy(3.0, 360.0)));


        var _anhsang1 = new cc.Sprite("res/Texture/nohu_win_bantrung/nohu_anhsang.png");
        _anhsang1.setPosition(cc.winSize.width/2 + 130, cc.winSize.height/2 + 80);
        _anhsang1.setScale(1.5);
        this.addChild(_anhsang1, -2);
        _anhsang1.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(0.1), new cc.RotateBy(3.0, 360.0))));


        var _anhsang2 = new cc.Sprite("res/Texture/nohu_win_bantrung/nohu_anhsang.png");
        _anhsang2.setPosition(cc.winSize.width/2 + 130, cc.winSize.height/2 + 80);
        _anhsang2.setScale(1.5);
        this.addChild(_anhsang2, -2);
        _anhsang2.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(0.2), new cc.RotateBy(3.0, 360.0))));



        var lb_huthuong = cc.Label.createWithBMFont("res/Texture/nohu_win_bantrung/font_nohu_rename.fnt", "1,234,456");
        lb_huthuong.setPosition(cc.p(_background.width/2 - 30, _background.height/2 - 49));
        _background.addChild(lb_huthuong, 1);
        this.lb_huthuong = lb_huthuong;


        var goldMini = new  cc.ParticleSystem("res/Texture/lv_nohu_xu.plist");
        goldMini.setScale(2.5);
        goldMini.setVisible(false);
        goldMini.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        this.addChild(goldMini, -1);
        this.goldMini = goldMini;


        var firework = new  cc.ParticleSystem("res/Texture/nohu_win_bantrung/particle_texture.plist");
        firework.setPosition(cc.p(cc.winSize.width/2, -10));
        firework.setVisible(false);
        this.addChild(firework, 1);
        this.firework = firework;

        var firework1 = new  cc.ParticleSystem("res/Texture/nohu_win_bantrung/particle_texture.plist");
        firework1.setPosition(cc.p(cc.winSize.width/2, -10));
        firework1.setVisible(false);
        this.addChild(firework1, 1);
        this.firework1 = firework1;

        var firework2 = new  cc.ParticleSystem("res/Texture/nohu_win_bantrung/particle_texture.plist");
        firework2.setPosition(cc.p(cc.winSize.width/2, -10));
        firework2.setVisible(false);
        this.addChild(firework2, 1);
        this.firework2 = firework2;

    },

    showHuThuong : function (valuehuthuong) {
        var thiz = this;
        this.lb_huthuong.setString(valuehuthuong);
        this._background.stopAllActions();
        this._background.runAction(new cc.Sequence(new cc.EaseSineOut(new cc.ScaleTo(0.3, 1.0, 1.0)), new cc.CallFunc(function () {
            thiz.goldMini.setVisible(true);
            thiz.firework.setVisible(true);
            thiz.firework1.setVisible(true);
            thiz.firework2.setVisible(true);
        }), new cc.DelayTime(10), new cc.CallFunc(function () {
            thiz.goldMini.setVisible(false);
            thiz.firework.setVisible(false);
            thiz.firework1.setVisible(false);
            thiz.firework2.setVisible(false);
        }), new cc.EaseSineIn(new cc.ScaleTo(0.3, 0.0, 0.0)) , new cc.CallFunc(function () {
            thiz.removeFromParent();
        })));


    },

});

var NoHuRungMaQuai = NoHuMiniGameLayer.extend({
    ctor: function () {
        this._super();
        this._background.removeFromParent();
        var _background = new cc.Sprite("res/Texture/nohu_win_bantrung/nohu_background2.png");
        _background.setScale(0.0);
        _background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this._background = _background;
        this.addChild(_background);

        var lb_huthuong = cc.Label.createWithBMFont("res/Texture/nohu_win_bantrung/font_nohu_rename.fnt", "1,234,456");
        lb_huthuong.setPosition(cc.p(_background.width/2 - 30, _background.height/2 - 49));
        _background.addChild(lb_huthuong, 1);
        this.lb_huthuong = lb_huthuong;


        // var goldMini = new  cc.ParticleSystem("res/Texture/lv_nohu_xu.plist");
        // goldMini.setScale(2.5);
        // goldMini.setVisible(false);
        // goldMini.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        // _background.addChild(goldMini, -1);
        // this.goldMini = goldMini;

    }
});

var BigWinRungMaQuai = NoHuMiniGameLayer.extend({
    ctor : function () {
        this._super();
        this._background.removeFromParent();
        var _background = new cc.Sprite("res/Texture/nohu_win_bantrung/nohu_background3.png");
        _background.setScale(0.0);
        _background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this._background = _background;
        this.addChild(_background);

        var lb_huthuong = cc.Label.createWithBMFont("res/Texture/nohu_win_bantrung/font_nohu_rename.fnt", "1,234,456");
        lb_huthuong.setPosition(cc.p(_background.width/2 - 70, _background.height/2 - 29));
        _background.addChild(lb_huthuong, 1);
        this.lb_huthuong = lb_huthuong;


        var goldMini = new  cc.ParticleSystem("res/Texture/lv_nohu_xu.plist");
        goldMini.setScale(2.5);
        goldMini.setVisible(false);
        goldMini.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        _background.addChild(goldMini, -1);
        this.goldMini = goldMini;
    }
});
var NoHuCuopBien = NoHuMiniGameLayer.extend({
    ctor: function () {
        this._super();
        this._background.removeFromParent();
        var _background = new cc.Sprite("res/Texture/CuopBien/cuopbien_bg_nohu.png");
        _background.setScale(0.0);
        _background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this._background = _background;
        this.addChild(_background);

        var lb_huthuong = cc.Label.createWithBMFont("res/Texture/CuopBien/fnt_cuopbien_nohu.fnt", "1,234,456");
        lb_huthuong.setPosition(cc.p(_background.width/2 - 30, _background.height/2 - 50));
        _background.addChild(lb_huthuong, 1);
        this.lb_huthuong = lb_huthuong;



    }
});

var BigWinCuopBien = NoHuMiniGameLayer.extend({
    ctor : function () {
        this._super();
        this._background.removeFromParent();
        var _background = new cc.Sprite("res/Texture/CuopBien/cuopbien_bg_thanglon.png");
        _background.setScale(0.0);
        _background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this._background = _background;
        this.addChild(_background,2);

        var lb_huthuong = cc.Label.createWithBMFont("res/Texture/CuopBien/fnt_cuopbien_nohu.fnt", "1,234,456");
        lb_huthuong.setPosition(cc.p(_background.width/2 - 30 , _background.height/2 - 50));
        _background.addChild(lb_huthuong, 1);
        this.lb_huthuong = lb_huthuong;


        var goldMini = new  cc.ParticleSystem("res/Texture/lv_nohu_xu.plist");
        goldMini.setScale(2.5);
        goldMini.setVisible(false);
        goldMini.setPosition(cc.p(_background.width/2, _background.height/2));
        _background.addChild(goldMini, -1);
        this.goldMini = goldMini;
    }
});