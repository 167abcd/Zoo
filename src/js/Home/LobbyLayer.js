/**
 * Created by ext on 7/15/2017.
 */

var s_lobby_game_name = s_lobby_game_name || {};
s_lobby_game_name[GameType.GAME_MauBinh] = "Mậu binh";
s_lobby_game_name[GameType.GAME_TienLenMN] = "Tiến lên MN";
s_lobby_game_name[GameType.GAME_Phom] = "Phỏm";
s_lobby_game_name[GameType.GAME_Sam] = "Sâm";
s_lobby_game_name[GameType.GAME_BaCay] = "Ba Cây";
s_lobby_game_name[GameType.GAME_XocDia] = "Xóc Đĩa";
s_lobby_game_name[GameType.GAME_TaiXiu] = "Tài Xỉu";
s_lobby_game_name[GameType.GAME_TLMN_Solo] = "TLMN Solo";
s_lobby_game_name[GameType.GAME_Sam_Solo] = "Sâm Solo";
s_lobby_game_name[GameType.GAME_Lieng] = "Liêng";
s_lobby_game_name[GameType.GAME_BaCayChuong] = "Ba cây chương";
s_lobby_game_name[GameType.GAME_Poker] = "Poker";
s_lobby_game_name[GameType.GAME_MauBinh_Free] = "Mậu binh";
s_lobby_game_name[GameType.GAME_TienLenMN_Free] = "Tiến lên MN";
s_lobby_game_name[GameType.GAME_Phom_Free] = "Phỏm";
s_lobby_game_name[GameType.GAME_Sam_Free] = "Sâm";
s_lobby_game_name[GameType.GAME_BaCay_Free] = "Ba Cây";
s_lobby_game_name[GameType.GAME_XocDia_Free] = "Xóc Đĩa";
s_lobby_game_name[GameType.GAME_TaiXiu_Free] = "Tài Xỉu";
s_lobby_game_name[GameType.GAME_TLMN_Solo_Free] = "TLMN Solo";
s_lobby_game_name[GameType.GAME_Sam_Solo_Free] = "Sâm Solo";
s_lobby_game_name[GameType.GAME_Lieng_Free] = "Liêng";
s_lobby_game_name[GameType.GAME_BaCayChuong_Free] = "Ba cây chương";
s_lobby_game_name[GameType.GAME_Poker_Free] = "Poker";

var s_lobby_subscribe_name = s_lobby_subscribe_name || {};
s_lobby_subscribe_name[GameType.GAME_MauBinh] = "ChinesePoker";
s_lobby_subscribe_name[GameType.GAME_TienLenMN] = "tlmn_tudo";
s_lobby_subscribe_name[GameType.GAME_Phom] = "Phom";
s_lobby_subscribe_name[GameType.GAME_Sam] = "sam_tudo";
s_lobby_subscribe_name[GameType.GAME_BaCay] = "ThreeCards";
s_lobby_subscribe_name[GameType.GAME_XocDia] = "ShakeDisk";
s_lobby_subscribe_name[GameType.GAME_TaiXiu] = "TaiXiu";
s_lobby_subscribe_name[GameType.GAME_TLMN_Solo] = "tlmn_solo";
s_lobby_subscribe_name[GameType.GAME_Sam_Solo] = "sam_solo";
s_lobby_subscribe_name[GameType.GAME_Lieng] = "lieng";
s_lobby_subscribe_name[GameType.GAME_BaCayChuong] = "bacaychuong";
s_lobby_subscribe_name[GameType.GAME_Poker] = "Poker";


s_lobby_subscribe_name[GameType.GAME_TienLenMN_Free] = "tlmn_tudo_silver";
s_lobby_subscribe_name[GameType.GAME_TLMN_Solo_Free] = "tlmn_solo_silver";
s_lobby_subscribe_name[GameType.GAME_Sam_Free] = "sam_tudo_silver";
s_lobby_subscribe_name[GameType.GAME_Sam_Solo_Free] = "sam_solo_silver";
s_lobby_subscribe_name[GameType.GAME_Poker_Free] = "Poker_silver";
s_lobby_subscribe_name[GameType.GAME_Phom_Free] = "Phom_silver";
s_lobby_subscribe_name[GameType.GAME_BaCay_Free] = "ThreeCards_silver";
s_lobby_subscribe_name[GameType.GAME_Poker_Free] = "Poker_silver";
s_lobby_subscribe_name[GameType.GAME_MauBinh_Free] = "ChinesePoker_silver";
s_lobby_subscribe_name[GameType.GAME_XocDia_Free] = "ShakeDisk_silver";
s_lobby_subscribe_name[GameType.GAME_TaiXiu_Free] = "TaiXiu_silver";

var s_lobby_subscribe_id = _map_swap_key_value(s_lobby_subscribe_name, function (key) {
    return parseInt(key);
});

var s_lobby_gameId_group = s_lobby_gameId_group || {};
s_lobby_gameId_group[GameType.GAME_TienLenMN] = [GameType.GAME_TienLenMN, GameType.GAME_TienLenMN_Free];
s_lobby_gameId_group[GameType.GAME_TLMN_Solo] = [GameType.GAME_TLMN_Solo, GameType.GAME_TLMN_Solo_Free];
s_lobby_gameId_group[GameType.GAME_Sam] = [GameType.GAME_Sam, GameType.GAME_Sam_Free];
s_lobby_gameId_group[GameType.GAME_Sam_Solo] = [GameType.GAME_Sam_Solo, GameType.GAME_Sam_Solo_Free];
s_lobby_gameId_group[GameType.GAME_BaCay] = [GameType.GAME_BaCay, GameType.GAME_BaCay_Free];
s_lobby_gameId_group[GameType.GAME_MauBinh] = [GameType.GAME_MauBinh, GameType.GAME_MauBinh_Free];
s_lobby_gameId_group[GameType.GAME_Poker] = [GameType.GAME_Poker, GameType.GAME_Poker_Free];
s_lobby_gameId_group[GameType.GAME_Phom] = [GameType.GAME_Phom, GameType.GAME_Phom_Free];

s_lobby_gameId_group[GameType.GAME_TienLenMN_Free] = s_lobby_gameId_group[GameType.GAME_TienLenMN];
s_lobby_gameId_group[GameType.GAME_TLMN_Solo_Free] = s_lobby_gameId_group[GameType.GAME_TLMN_Solo];
s_lobby_gameId_group[GameType.GAME_Sam_Free] = s_lobby_gameId_group[GameType.GAME_Sam];
s_lobby_gameId_group[GameType.GAME_Sam_Solo_Free] = s_lobby_gameId_group[GameType.GAME_Sam_Solo];
s_lobby_gameId_group[GameType.GAME_BaCay_Free] = s_lobby_gameId_group[GameType.GAME_BaCay];
s_lobby_gameId_group[GameType.GAME_MauBinh_Free] = s_lobby_gameId_group[GameType.GAME_MauBinh];
s_lobby_gameId_group[GameType.GAME_Poker_Free] = s_lobby_gameId_group[GameType.GAME_Poker];
s_lobby_gameId_group[GameType.GAME_Phom_Free] = s_lobby_gameId_group[GameType.GAME_Phom];

var HomeLobbyBetting = ccui.Widget.extend({
    ctor: function () {
        this._super();
        this.setMouseOverEnable();
    },
    _onPressStateChangedToPressed: function () {
        this.setScale(1.1);
    },
    _onPressStateChangedToNormal: function () {
        this.setScale(1.0);
    }
});

var HomeLobbyLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var thiz = this;
        this._currentGameId = null;

        var bg = new cc.Sprite("#home_lobby_betting_name_bg.png");
        bg.setPosition(1000, 689);
        this.addChild(bg);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "nameLabel");
        nameLabel.setColor(cc.color("#ffffff"));
        nameLabel.setPosition(bg.x, bg.y);
        this.addChild(nameLabel);
        this.nameLabel = nameLabel;

        this._initListBetting();
    },

    _initListBetting : function () {
        var left = 530;
        var right = 2000 - left;
        var top = 635;
        var bottom = 115;

        var listBetting = new newui.TableView(cc.size(right - left, (top - bottom)), 3);
        listBetting.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listBetting.setPadding(14);
        listBetting.setBounceEnabled(true);
        listBetting.setMargin(10,20,0,0);
        listBetting.setScrollBarEnabled(false);
        listBetting.setPosition(left, bottom);
        this.listBetting = listBetting;
        this.addChild(listBetting);

        // for(var i=0;i<12;i++){
        //     this.addBetting(1000);
        // }
    },

    _getGameName : function (gameId) {
        if(gameId === undefined){
            gameId = this._currentGameId;
        }
        if(gameId !== null){
            var name = s_lobby_subscribe_name[gameId];
            if(name){
                return name;
            }
        }
        return "";
    },

    addBetting1 : function (betting, gameName, minMoney) {
        var container = new HomeLobbyBetting();
        this.listBetting.pushItem(container);

        var bg = new cc.Sprite("#home_betting_bg_1.png");
        container.setContentSize(bg.getContentSize());
        bg.setPosition(container.width/2, container.height/2);
        container.addChild(bg);

        var goldLabel = cc.Label.createWithBMFont("res/fonts/home_betting_gold_1.fnt", cc.Global.NumberFormat2(betting));
        goldLabel.setPosition(146, 55);
        container.addChild(goldLabel);

        var thiz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            //LoadingDialog.getInstance().show("Đang vào phòng");
            thiz._betting = betting;
            var request = {
                command : "get_play_now_server",
                game : gameName,
                bet : betting
            };
           // SocketClient.getInstance().send(request);
            SocketClient.getInstance().sendHttpGetRequest(request);
        });
    },

    addBetting2 : function (betting, minMoney) {
        var container = new HomeLobbyBetting();
        container.setContentSize(196, 75);
        this.listBetting.pushItem(container);

        var bg = new cc.Sprite("#home_betting_bg_2.png");
        bg.setPosition(container.width/2, container.height/2);
        container.addChild(bg);

        var goldLabel = cc.Label.createWithBMFont("res/fonts/home_betting_gold_1.fnt", cc.Global.NumberFormat2(betting));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(84, 42);
        container.addChild(goldLabel);

        var thiz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            //LoadingDialog.getInstance().show("Đang vào phòng");
            thiz._betting = betting;
            var request = {
                command : "get_play_now_server",
                game : thiz._getGameName(),
                bet : betting
            };
            // SocketClient.getInstance().send(request);
            SocketClient.getInstance().sendHttpGetRequest(request);
        });
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("subscribe_game_lobby", this.onSubscribe, this);
        SocketClient.getInstance().addHTTPListener("get_play_now_server", this.onGetGameServer, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
        this.unSubscribe();
    },

    startWithGame : function (gameId) {
        if(cc.isString(gameId)){
            //initWithGameName

        }
        else{
            this.subscribe(gameId);
            this.nameLabel.setString(s_lobby_game_name[gameId]);
        }
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible === false){
            this.unSubscribe();
        }
    },

    onSubscribe : function (cmd, event) {
        var gameName = event["data"]["g"];
        var gameId = s_lobby_subscribe_id[gameName];
        if(gameId === this._currentGameId){
            this.listBetting.removeAllItems();

            var bettings = event["data"]["bettings"];
            for(var i=0;i<bettings.length;i++){
                var b = bettings[i];
                if(gameId < 200){
                    this.addBetting1(b["betting"], gameName, b["minMoney"]);
                }
                else{
                    this.addBetting2(b["betting"], gameName, b["minMoney"]);
                }
            }
        }
    },

    onGetGameServer : function (cmd, event) {
        if(event){
            var serverId = event["data"];
            var serverInfo = window._sfsServer[serverId];
            if(this._betting && serverInfo){
                SmartfoxClient.getInstance().findAndJoinRoom(serverInfo, this._getGameName(), this._betting);
                cc.log(serverInfo);
            }
        }
    },

    subscribe : function (gameId) {
        this.unSubscribe();

        var name = this._getGameName(gameId);
        if(name){
            this._currentGameId = gameId;
            this.listBetting.removeAllItems();

            var request = {
                c : "subscribe_game_lobby",
                g : name
            };
            SocketClient.getInstance().send(request);
        }
    },

    unSubscribe : function () {
        if(this._currentGameId !== null){
            var name = this._getGameName();
            if(name){
                var request = {
                    c : "un_subscribe_game_lobby",
                    g : name
                };
                SocketClient.getInstance().send(request);
            }
            this._currentGameId = null;
        }
    }
});