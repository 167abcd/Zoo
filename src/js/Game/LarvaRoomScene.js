/**
 * Created by Balua on 7/31/17.
 */
var LarvaRoomScene = IScene.extend({
    ctor: function () {
        this._super();
        var deche = new LarvaRoomLayer();
        this.sceneLayer.addChild(deche);

    }



});

var LarvaRoomLayer = cc.Node.extend({
    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },



    onEnter : function () {
        this._super();

    },
    onUpJacpot:function (cmd, message) {
        if(message["g"] == "slot_25" ){
            for(var i = 0; i < this.arrCell.length; i++){
                this.arrCell[i].setLbHuThuong(i);
            }
        }
    },
    _onKeyBackHandler : function () {
        SceneNavigator.replaceScene(new LobbyScene());
        return true;
    },
    ctor: function () {
        this._super();
        SceneNavigator.addBackKeyEvent(this);

        var thiz = this;
        var _bg_game = new cc.Sprite("res/Texture/Larva/bg_choiMan.jpg");
        _bg_game.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        this.addChild(_bg_game);

        var menuTop = new TopBarTouchLayer(true);
        menuTop.topBar.btn_back.addClickEventListener(function () {
            SceneNavigator.replaceScene(new LobbyScene());
        });

        // menuTop.loginLayer.btn_back.addClickEventListener(function () {
        //     SceneNavigator.replaceScene(new LobbyScene());
        // });
        // menuTop.showGameTopBar(false);
        this.addChild(menuTop, 1);

        var logo = new cc.Sprite("#lv_title.png");
        logo.setAnchorPoint(cc.p(0.5, 1.0));
        logo.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height));
        this.addChild(logo);


        var btn_menu = new ccui.Button("lv_menu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_menu.setPosition(cc.p(74, 667));
        btn_menu.addClickEventListener(function () {
            // SceneNavigator.replaceScene(new LobbyScene());
            menuTop.showGameTopBar(true);
        });
        this.addChild(btn_menu);

        var btn_choithu = new ccui.Button("lv_choiThu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_choithu.setPosition(cc.p(cc.winSize.width/2, 73));
        btn_choithu.addClickEventListener(function () {
            SceneNavigator.replaceScene(new LarvaScene(2,true));
        });
        this.addChild(btn_choithu);
        // btn_choithu.loadTextureNormal();

        var posCell = [cc.winSize.width/2 - 350, cc.winSize.width/2, cc.winSize.width/2 + 350];
        var scrollView = new ccui.ListView();
        scrollView.setContentSize(cc.size(1080, 500));
        // scrollView.setAnchorPoint(cc.p(0.0, 1.0));
        scrollView.setScale(cc.winSize.screenScale);
        scrollView.setPosition(cc.winSize.width/2 -1080/2 *cc.winSize.screenScale, cc.winSize.height/2 - (500/2 + 30)*cc.winSize.screenScale);
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
                var bettingCell = new BettingRoomLayerLarva(inew);
                bettingCell.setPosition(360/2,500/2);
                bgCell.addChild(bettingCell);
                scrollView.pushBackCustomItem(bgCell);
                thiz.arrCell.push(bettingCell);
                // bettingCell.setScale(cc.winSize.screenScale);
                // bettingCell.setPosition(cc.p(posCell[i], cc.winSize.height/2 - 30));
                // thiz.addChild(bettingCell);
            })();

        }

        // SocketClient.getInstance().addListener("uJackpot", this.onUpJacpot, this);

    }
});

var BettingRoomLayerLarva = ccui.Button.extend({
    ctor : function (tit) {
        this._super();

        this.loadTextureNormal("lv_bgRoom"+ (tit+1) + ".png", ccui.Widget.PLIST_TEXTURE);

        var _bg = this.getRendererNormal();

        // var _title = new cc.Sprite("#deche_betting_title" + (tit+1) + ".png");
        // _title.setPosition(cc.p(this.width/2, this.height - 40));
        // _bg.addChild(_title);
        //
        //
        // var _icon = new cc.Sprite("#deche_betting_icon" + (tit+1) + ".png");
        // _icon.setPosition(cc.p(this.width/2, this.height/2 + 60));
        // _bg.addChild(_icon);


        var _lb_hu = cc.Label.createWithBMFont("res/Texture/Larva/UTMCooperBlack.fnt", "0");
        // _lb_hu.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_Larva,ARR_BET_SLOT[tit])));

        _lb_hu.setPosition(cc.p(this.width/2, 80));
        _bg.addChild(_lb_hu);
        this._lb_hu = _lb_hu;


        _lb_hu._jackpotLabel = _lb_hu;

        JackpotEvent.addEventForTarget(_lb_hu, GameType.GAME_Larva, ARR_BET_SLOT[tit]);

        // var iconvang = new cc.Sprite("#deche_betting_" + (tit+1) + ".png");
        // iconvang.setPosition(cc.p(this.width/2, 66));
        // _bg.addChild(iconvang);
        this.addClickEventListener(function () {
            SceneNavigator.replaceScene(new LarvaScene(tit,false));
        })

    },

    setLbHuThuong : function (tit) {
       this._lb_hu.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_Larva,ARR_BET_SLOT[tit])));
    }
});