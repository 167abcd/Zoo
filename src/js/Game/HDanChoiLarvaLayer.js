/**
 * Created by Balua on 8/28/17.
 */


var HDanChoiLarvaLayer = IDialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        var bg = new cc.Sprite("#larva_hdan_bg.png");
        bg.setPosition(0, 0);
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width/2, -bg.height/2, bg.width, bg.height);

        // this.setScale(cc.winSize.screenScale);

        var hdan1 = new Hdan1(bg.getContentSize());
        // hdan1.setPosition(cc.p(-cc.winSize.width/2, -cc.winSize.height/2));
        bg.addChild(hdan1);

        var hdan2 = new Hdan2(bg.getContentSize());
        // hdan2.setPosition(cc.p(-cc.winSize.width/2, -cc.winSize.height/2));
        hdan2.setVisible(false);
        bg.addChild(hdan2);

        var hdan3 = new Hdan3(bg.getContentSize());
        // hdan3.setPosition(cc.p(-cc.winSize.width/2, -cc.winSize.height/2));
        hdan3.setVisible(false);
        bg.addChild(hdan3);

        var hdan4 = new Hdan4(bg.getContentSize());
        // hdan4.setPosition(cc.p(-cc.winSize.width/2, -cc.winSize.height/2));
        hdan4.setVisible(false);
        bg.addChild(hdan4);

        var hdan5 = new Hdan5(bg.getContentSize());
        // hdan5.setPosition(cc.p(-cc.winSize.width/2, -cc.winSize.height/2));
        hdan5.setVisible(false);
        bg.addChild(hdan5);

        var hdan6 = new Hdan6(bg.getContentSize());
        hdan6.setVisible(false);
        bg.addChild(hdan6);

        // var hdan7 = new Hdan7(bg.getContentSize());
        // hdan7.setVisible(false);
        // bg.addChild(hdan7);


        this.arr_hdan = [];
        this.arr_hdan.push(hdan1);
        this.arr_hdan.push(hdan2);
        this.arr_hdan.push(hdan3);
        this.arr_hdan.push(hdan4);
        this.arr_hdan.push(hdan5);
        this.arr_hdan.push(hdan6);
        // this.arr_hdan.push(hdan7);

        this.indexPage  = 0;


        var btnprevios = new ccui.Button("larva_hdan_btnprevious.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnprevios.setPosition(cc.p(bg.width/2 - 137, 58));
        bg.addChild(btnprevios);
        btnprevios.setVisible(false);
        btnprevios.addClickEventListener(function () {
            if(thiz.indexPage > 0)
            {
                thiz.indexPage -= 1;
                thiz.btnnext.setVisible(true);

                if(thiz.indexPage == 0)
                {
                    thiz.btnprevios.setVisible(false);
                }

                for(var i = 0; i < thiz.arr_hdan.length; i++)
                {
                    if(i == thiz.indexPage)
                    {
                        thiz.arr_hdan[i].setVisible(true);
                    }
                    else
                    {
                        thiz.arr_hdan[i].setVisible(false);
                    }
                }

            }
        });

        var btnnext = new ccui.Button("larva_hdan_btnnext.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnnext.setPosition(cc.p(bg.width/2 + 137, 58));
        btnnext.addClickEventListener(function () {
            if(thiz.indexPage < thiz.arr_hdan.length - 1 && thiz.indexPage >= 0)
            {
                thiz.indexPage += 1;

                thiz.btnprevios.setVisible(true);
                if(thiz.indexPage == thiz.arr_hdan.length - 1)
                {
                    thiz.btnnext.setVisible(false);
                }

                for(var i = 0; i < thiz.arr_hdan.length; i++)
                {
                    if(i == thiz.indexPage)
                    {
                        thiz.arr_hdan[i].setVisible(true);
                    }
                    else
                    {
                        thiz.arr_hdan[i].setVisible(false);
                    }
                }

            }
        });
        bg.addChild(btnnext);


        this.btnnext = btnnext;
        this.btnprevios = btnprevios;

        var btnclose = new ccui.Button("larva_hdan_btnclose.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnclose.setPosition(cc.p(bg.width - 40, bg.height - 40));
        btnclose.addClickEventListener(function () {
            thiz.hide();
        });
        bg.addChild(btnclose);


        var btnchoitiep = new ccui.Button("larva_hdan_btnchoitiep.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnchoitiep.setPosition(cc.p(bg.width/2, 58));
        bg.addChild(btnchoitiep);
        btnchoitiep.addClickEventListener(function () {
           thiz.hide();
        });
        this.btnchoitiep = btnchoitiep;

    }

});


var Hdan1 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();

        this.setContentSize(mSize);

        var title = new cc.Sprite("#larva_hdan_tit1.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd1.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(hdan1);


    }
});

var Hdan2 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        var title = new cc.Sprite("#larva_hdan_tit2.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd2.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2 + 20));
        this.addChild(hdan1);

    }
});

var Hdan3 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        var title = new cc.Sprite("#larva_hdan_tit3.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd3.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2 + 20));
        this.addChild(hdan1);
    }
});


var Hdan4 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        var title = new cc.Sprite("#larva_hdan_tit4.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd4.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2 + 20));
        this.addChild(hdan1);
    }
});


var Hdan5 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        var title = new cc.Sprite("#larva_hdan_tit5.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd5.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2 + 20));
        this.addChild(hdan1);
    }
});

var Hdan6 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        var title = new cc.Sprite("#larva_hdan_tit6.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd6.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2 + 20));
        this.addChild(hdan1);
    }
});

var Hdan7 = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);
        var title = new cc.Sprite("#larva_hdan_tit7.png");
        title.setPosition(cc.p(this.width/2 + 10, this.height - 30));
        this.addChild(title);


        var hdan1 = new cc.Sprite("#larva_hdan_hd7.png");
        hdan1.setPosition(cc.p(this.width/2, this.height/2- 10));
        this.addChild(hdan1);

        var btn_ngungchoi = new ccui.Button("larva_hdan_btnngungchoi.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_ngungchoi.setPosition(this.width/2 - 115, 30);
        this.addChild(btn_ngungchoi);

        var btn_tieptuc = new ccui.Button("larva_hdan_btntieptuc.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_tieptuc.setPosition(this.width/2 + 115, 30);
        this.addChild(btn_tieptuc);

    }
});