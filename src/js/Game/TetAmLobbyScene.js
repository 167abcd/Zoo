/**
 * Created by Balua on 7/31/17.
 */
var TetAmLobbyScene = IScene.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite("res/Texture/TetAm/tetAm_bg.jpg");
        bg.setAnchorPoint(cc.p(0,1));
        this.addChild(bg,-1);
        this.bg = bg;
        this.sceneLayer.setContentSize(cc.size(2000, 900));
        var deche = new TetAmGameLayer();
        this.deche = deche;
        this.sceneLayer.addChild(deche);

    },
    onCanvasResize : function () {
        this._super();
        var scaleY = cc.winSize.height / this.bg.height;
        if(scaleY < 1.0){
            scaleY = 1.0;
        }
        this.bg.setScale(scaleY);
        this.bg.y = cc.winSize.height;
    }
});

var TetAmGameLayer = cc.Node.extend({


    ctor: function () {
        this._super();
        SceneNavigator.addBackKeyEvent(this);

        var thiz = this;


        // var menuTop = new TopBarTouchLayer(true);
        // menuTop.topBar.btn_back.addClickEventListener(function () {
        //     SceneNavigator.replaceScene(new HomeScene());
        // });
        //
        // menuTop.loginLayer.btn_back.addClickEventListener(function () {
        //     SceneNavigator.replaceScene(new HomeScene());
        // });
        // menuTop.showGameTopBar(false);
        // this.addChild(menuTop, 1);
        // this.menuTop = menuTop;


        //
        var logo = new cc.Sprite("#tetlobby_banner.png");
        logo.setAnchorPoint(cc.p(0.5, 1.0));
        logo.setPosition(cc.p(2000/2, 900));
        this.addChild(logo);


        var btn_menu = new ccui.Button("tetlobby_btnMenu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_menu.setZoomScale(0.01);
        btn_menu.setPosition(cc.p(120, 110));
        // btn_menu.setAnchorPoint(cc.p(0.5, 1.0));
        // btn_menu.setPosition(cc.p(200 * cc.winSize.screenScale, 900));
        btn_menu.addClickEventListener(function () {
            thiz.onBackMenu();
        });
        logo.addChild(btn_menu);


        // var tophuthuong = new TopHuLayer();
        // this.addChild(tophuthuong, 1);


        var btn_choithu = new ccui.Button("tetlobby_btnChoiThu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_choithu.setAnchorPoint(cc.p(0.5, 0.0));
        btn_choithu.setPosition(cc.p(2000/2, 100+ 73));
        btn_choithu.addClickEventListener(function () {
            SceneNavigator.replaceScene(new TetAmScene(2,true));
        });
        this.addChild(btn_choithu);
        // btn_choithu.loadTextureNormal();

        var posCell = [2000/2 - 350, 2000/2, 2000/2 + 350];
        var scrollView = new ccui.ListView();
        scrollView.setContentSize(cc.size(1080, 500));
        // scrollView.setAnchorPoint(cc.p(0.0, 1.0));
        // scrollView.setScale(cc.winSize.screenScale);
        scrollView.setPosition(2000/2 -1080/2 , 900/2 - (500/2 - 60));
        scrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);

        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        this.addChild(scrollView);
        this.scrollView = scrollView;
            this.arrCell = [];
        for(var i = 0; i < posCell.length; i++){
            (function () {
                var inew = i;
                var bgCell =  new ccui.Widget();
                bgCell.setContentSize(360,500);
                var bettingCell = new TetAmBettingRoomLayer(inew);
                bettingCell.setPosition(360/2,500/2);
                bgCell.addChild(bettingCell);
                scrollView.pushBackCustomItem(bgCell);
                thiz.arrCell.push(bettingCell);
                // bettingCell.setPosition(cc.p(posCell[i], 900/2 - 30));
                // thiz.addChild(bettingCell);
            })();

        }
    },

    _onKeyBackHandler : function () {
        this.onBackMenu();
        return true;
    },
    onBackMenu:function () {
        var homeScene = new HomeScene();
        homeScene.startGame();
        SceneNavigator.replaceScene(homeScene);
    }
});

var TetAmBettingRoomLayer = ccui.Button.extend({
    ctor : function (tit) {
        this._super();

        this.loadTextureNormal("tetlobby_betting_icon" + (tit+1) + ".png", ccui.Widget.PLIST_TEXTURE);

        var _bg = this.getRendererNormal();

        // var _title = new cc.Sprite("#tetlobby_betting_title" + (tit+1) + ".png");
        // _title.setPosition(cc.p(this.width/2, this.height - 40));
        // _bg.addChild(_title);
        //
        //
        // var _icon = new cc.Sprite("#tetlobby_betting_icon" + (tit+1) + ".png");
        // _icon.setPosition(cc.p(this.width/2, this.height/2 + 60));
        // _bg.addChild(_icon);

        var _lb_hu = cc.Label.createWithBMFont("res/Texture/TetAm/font_mony_tetAm.fnt", "0");
        // _lb_hu.setScale(1.1);
        // _lb_hu.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_AOE,ARR_BET_SLOT[tit])));
        _lb_hu.setPosition(cc.p(this.width/2, 25));
        _bg.addChild(_lb_hu);
        this._lb_hu = _lb_hu;


        _lb_hu._jackpotLabel = _lb_hu;

        JackpotEvent.addEventForTarget(_lb_hu, GameType.GAME_TET_AM, ARR_BET_SLOT[tit]);

        // var iconvang = new cc.Sprite("#tetlobby_betting_" + (tit+1) + ".png");
        // iconvang.setPosition(cc.p(this.width/2, 66));
        // _bg.addChild(iconvang);
        this.addClickEventListener(function () {
            SceneNavigator.replaceScene(new TetAmScene(tit,false));
        })

    },

    setLbHuThuong : function (tit) {
        this._lb_hu.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_TET_AM,ARR_BET_SLOT[tit])));
    }
});