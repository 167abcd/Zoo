/**
 * Created by Balua on 11/8/17.
 */

var s_game_rank_id = s_game_rank_id || [
    GameType.GAME_MauBinh,
    GameType.GAME_TienLenMN,
    GameType.GAME_TLMN_Solo,
    GameType.GAME_Sam,
    GameType.GAME_Sam_Solo,
    GameType.GAME_Phom,
    GameType.GAME_BaCay,
//    GameType.GAME_Poker,
    GameType.GAME_XocDia,
    GameType.GAME_TaiXiu
];

var s_game_rank_group = s_game_rank_group || {};
s_game_rank_group[GameType.GAME_MauBinh] = [GameType.GAME_MauBinh, GameType.GAME_MauBinh_Free];
s_game_rank_group[GameType.GAME_TienLenMN] = [GameType.GAME_TienLenMN, GameType.GAME_TienLenMN_Free];
s_game_rank_group[GameType.GAME_TLMN_Solo] = [GameType.GAME_TLMN_Solo, GameType.GAME_TLMN_Solo_Free];
s_game_rank_group[GameType.GAME_Sam] = [GameType.GAME_Sam, GameType.GAME_Sam_Free];
s_game_rank_group[GameType.GAME_Sam_Solo] = [GameType.GAME_Sam_Solo, GameType.GAME_Sam_Solo_Free];
s_game_rank_group[GameType.GAME_Phom] = [GameType.GAME_Phom, GameType.GAME_Phom_Free];
s_game_rank_group[GameType.GAME_Poker] = [GameType.GAME_Poker, GameType.GAME_Poker_Free];
s_game_rank_group[GameType.GAME_XocDia] = [GameType.GAME_XocDia, GameType.GAME_XocDia_Free];
s_game_rank_group[GameType.GAME_TaiXiu] = [GameType.GAME_TaiXiu, GameType.GAME_TaiXiu_Free];

var RankLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        this._gameIdSelected = null;
        this._tabSelected = null;

        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.5, 1.0));

        var rootLayer = new cc.Node();
        rootLayer.setPosition(640, 360);
        rootLayer.setContentSize(cc.size(1280, 720));
        rootLayer.setAnchorPoint(cc.p(0.5, 0.5));
        rootLayer.setScale(cc.winSize.screenScale);
        this.addChild(rootLayer);

        var subranklayer = new SubRankLayer();
        subranklayer.setPosition(640, 360);
        rootLayer.addChild(subranklayer);

        this.initRightView(rootLayer);


        var bg_tab = new cc.Sprite("#home_bar_6.png");
        bg_tab.setAnchorPoint(cc.p(0.5, 0.0));
        bg_tab.setScale(cc.winSize.screenScale);
        bg_tab.setPosition(cc.p(640, 0));
        this.addChild(bg_tab);

        var mToggle = new ToggleNodeGroup();
        bg_tab.addChild(mToggle);
        this.mToggle = mToggle;
        var _tabRankPos = [-130, 130];
        for(var i = 0; i < 2; i++)
        {
            (function () {
                var icon1 = new cc.Sprite("#home_tab_1.png");
                icon1.setPosition(cc.p(bg_tab.width/2 + _tabRankPos[i], bg_tab.height/2));
                bg_tab.addChild(icon1);

                var icon2 = new cc.Sprite("#home_tab_2.png");
                icon2.setPosition(icon1.getPosition());
                bg_tab.addChild(icon2);


                var label1 = new cc.Sprite("#rank_tab_tit_" + (i+1) + ".png");
                label1.setPosition(cc.p(icon1.width/2, icon1.height/2));
                icon1.addChild(label1);

                var label2 = new cc.Sprite("#rank_tab_tit_1" + (i+1) + ".png");
                label2.setPosition(cc.p(icon2.width/2, icon2.height/2));
                icon2.addChild(label2);


                var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(icon1.getPosition());
                mToggle.addItem(toggleItem);

                var idx = i;
                toggleItem.onSelect = function (force) {
                    icon1.visible = true;
                    icon2.visible = false;
                    thiz._tabSelected = idx;
                    thiz.requestGetTop();
                };
                toggleItem.onUnSelect = function () {
                    icon1.visible = false;
                    icon2.visible = true;
                }
            })();

        }

        //

        var subTopBar = new SubTopBar();
        subTopBar.setAnchorPoint(cc.p(0.5, 1.0));
        subTopBar.setPosition(cc.p(640, 720));
        subTopBar.setScale(cc.winSize.screenScale);
        subTopBar.setTitle("home_vinhdanh_title.png");
        subTopBar.ispop = false;
        this.addChild(subTopBar);
        this.subTopBar = subTopBar;
    },


    onClickBack : function () {
        return false;
    },

    onEnter : function () {
        this._super();

        this._gameIdSelected = null;
        this._tabSelected = null;

        this.mToggle.selectItem(0);
        this.typeToggle.selectItem(0);
    },


    initRightView : function (rootLayer) {
        var typeToggle = new ToggleNodeGroup();

        var itemCount = 0;
        for (var i = 0; i < s_game_rank_id.length; i++) {
            itemCount++;
        }

        var dy = 97.0;
        var width = 231.0;
        var height = dy * itemCount;
        var x = width/2;
        var y = height - dy/2;

        typeToggle.setAnchorPoint(cc.p(0.0,0.0));
        typeToggle.setContentSize(cc.size(width, height));

        var scrollView = new newui.TableView(cc.size(width, dy * 5), 1);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setPosition(1280 - width, 120);
        scrollView.pushItem(typeToggle);
        rootLayer.addChild(scrollView, 1);

        var containmu = new ccui.Widget();
        containmu.setAnchorPoint(cc.p(0.0, 0.0));
        containmu.setContentSize(scrollView.getContentSize());
        containmu.setPosition(scrollView.getPosition());
        rootLayer.addChild(containmu, 2);

        var muheader = new cc.Sprite("#rank_headermu.png");
        muheader.setPosition(containmu.width/2 + 20, containmu.height);
        containmu.addChild(muheader);

        var thiz = this;
        for (var i = 0; i < s_game_rank_id.length; i++) {
            (function () {
                var gameId = s_game_rank_id[i];

                var selectBg = new cc.Sprite("#rank_label_selected_1.png");
                selectBg.setPosition(x, y);
                typeToggle.addChild(selectBg);

                var selectIcon = new cc.Sprite("#rank_label_selected_2.png");
                selectIcon.setPosition(selectBg.getPosition());
                typeToggle.addChild(selectIcon);


                var icon1 = new cc.Sprite("#rank_label_" + gameId + "_1.png");
                var icon2 = new cc.Sprite("#rank_label_" + gameId + "_2.png");

                icon1.setPosition(cc.p(selectBg.width/2, selectBg.height/2));
                icon2.setPosition(cc.p(selectIcon.width/2, selectIcon.height/2));

                selectBg.addChild(icon1);
                selectIcon.addChild(icon2);

                var toggleItem = new ToggleNodeItem(selectBg.getContentSize());
                toggleItem.setPosition(selectBg.getPosition());
                typeToggle.addItem(toggleItem);
                toggleItem.onSelect = function () {
                    selectBg.setVisible(false);
                    selectIcon.setVisible(true);

                    thiz._gameIdSelected = gameId;
                    thiz.requestGetTop();
                };
                toggleItem.onUnSelect = function () {
                    selectBg.setVisible(true);
                    selectIcon.setVisible(false);
                };

                y -= dy;

            })();
        }

        this.typeToggle = typeToggle;
    },

    requestGetTop : function () {
        if(this._gameIdSelected !== null && this._tabSelected !== null){
            var gameId = s_game_rank_group[this._gameIdSelected][this._tabSelected];
            cc.log("requestGetTop: " + s_lobby_subscribe_name[gameId]);

            //request lay top channel here
            var request = {
                command: "getTop",
                type: 1,
                gameType: s_lobby_subscribe_name[gameId],
                limit: 10};
             SocketClient.getInstance().send(request);
        }
    }
});


var SubRankLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        //
        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.5, 0.5));
       // this.setScale(cc.winSize.screenScale);

        var arr_tit = ["Top", "Người chơi", "Ván thắng", "Ván thua"];
        var arr_tit_pos = [60, 325, 636, 848];


        var _bg = new ccui.Scale9Sprite("home_ttcn_lsu_bg.png", cc.rect(60, 60, 4, 4));
        _bg.setPreferredSize(cc.size(1012, 457));
        _bg.setAnchorPoint(cc.p(0.0, 1.0));
        _bg.setPosition(cc.p(30, 584));
        this.addChild(_bg);


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, arr_tit[i]);
            m_lb.setColor(cc.color("#fff156"));
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(arr_tit_pos[i], _bg.height - 27));
            _bg.addChild(m_lb);
        }


        var _left = 0.0;
        var _right = _bg.width;

        var _top = _bg.height - 55.0;
        var _bottom = 0.0;

        var mList = new newui.TableView(cc.size(_right - _left, _top - _bottom), 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setPadding(5);
        mList.setAnchorPoint(cc.p(0.0, 1.0));
        mList.setPosition(cc.p(_left, _top));
        _bg.addChild(mList);
        this.mList = mList;
    },

    addItemRank : function (top, playername, vanthang, vanthua) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 60));

        var line = new ccui.Scale9Sprite("home_ttcn_lsu_line.png", cc.rect(20, 0, 4, 1));
        line.setPreferredSize(cc.size(container.width, 1));
        line.setPosition(cc.p(container.width/2, 2));
        container.addChild(line);


        var lb_top = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_20, top);
        lb_top.setAnchorPoint(cc.p(0.5, 0.5));
        lb_top.setPosition(cc.p(72, container.height/2));
        container.addChild(lb_top);

        var lb_playername = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, playername);
        lb_playername.setAnchorPoint(cc.p(0.5, 0.5));
        lb_playername.setPosition(cc.p(379, container.height/2));
        container.addChild(lb_playername);

        var lb_vanthang = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, vanthang);
        lb_vanthang.setColor(cc.color("#fadf8e"));
        lb_vanthang.setAnchorPoint(cc.p(0.0, 0.5));
        lb_vanthang.setPosition(cc.p(636, container.height/2));
        container.addChild(lb_vanthang);

        var lb_vanthua = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, vanthua);
        lb_vanthua.setColor(cc.color("#bcbcbb"));
        lb_vanthua.setAnchorPoint(cc.p(0.0, 0.5));
        lb_vanthua.setPosition(cc.p(848, container.height/2));
        container.addChild(lb_vanthua);


        this.mList.pushItem(container);
    },

    onEnter : function () {
        this._super();
         SocketClient.getInstance().addListener("getTop", this.onGetTop, this);

        // for(var i = 0; i < 10; i++)
        // {
        //     this.addItemRank((i + 1), "balua156", 1000, 1000);
        // }
    },

    onExit : function () {
      this._super();
    },

    onGetTop : function (cmd, data) {
        data = data["data"]["1"];
        if (!data){
            return;
        }

        this.mList.removeAllItems();
        for (var i = 0; i < data.length; i++) {
            this.addItem(i + 1, data[i]["username"], data[i]["winGold"], data[i]["looseGold"]);
        }
    }
});