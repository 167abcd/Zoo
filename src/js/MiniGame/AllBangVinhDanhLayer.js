/**
 * Created by Balua on 8/16/17.
 */
var AllBangVinhDanhLayer = Dialog.extend({
    ctor : function (gameID) {
        this._super();

        this.initWithSize(cc.size(1081, 597));

        var title = new cc.Sprite("#home_vinhdanh_title.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(cc.p(this.width/2, this.height+10));
        this.addChild(title, 1);

        this._paddingBottom = 30;



        var _tabNapVangName = ["NỔ HŨ", "THẮNG LỚN"];
        var _tabNapVangPos = [105, 311];


        var thiz = this;


        var bg_tab = new ccui.Scale9Sprite("home_shop_bg_tab2.png", cc.rect(40, 0, 4, 82));
        bg_tab.setPreferredSize(cc.size(417, 82));
        bg_tab.setPosition(cc.p(this.width/2, this.height - 58));
        this.addChild(bg_tab, 1);



        var mToggle = new ToggleNodeGroup();
        bg_tab.addChild(mToggle);
        this.mToggle = mToggle;

        this.allLayer = [new BVDThangLonLayer(this.getContentSize(), 0, gameID), new BVDThangLonLayer(this.getContentSize(), 1, gameID)];
        for(var i = 0; i < this.allLayer.length; i++)
        {
            this.addChild(this.allLayer[i], 1);
        }


        var tab_select = new cc.Sprite("#home_shop_tab_select2.png");
        bg_tab.addChild(tab_select);


        for(var i = 0; i < _tabNapVangName.length; i++)
        {
            (function () {

                var _btnTab = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, _tabNapVangName[i]);
                _btnTab.setPosition(cc.p(_tabNapVangPos[i], bg_tab.height/2));
                bg_tab.addChild(_btnTab);


                var mNode = thiz.allLayer[i];

                var toggleItem = new ToggleNodeItem(tab_select.getContentSize());
                toggleItem.setAnchorPoint(cc.p(0.5, 0.5));
                toggleItem.setPosition(_btnTab.getPosition());
                mToggle.addItem(toggleItem);

                toggleItem.onSelect = function (force) {
                    tab_select.setPosition(_btnTab.getPosition());
                    // _btnTab.setScale(1.3);
                    _btnTab.setColor(cc.color("#5b391a"));
                    mNode.setVisible(true);
                };
                toggleItem.onUnSelect = function () {
                    _btnTab.setColor(cc.color("#a59f9a"));
                    // _btnTab.setScale(1.0);
                    mNode.setVisible(false);
                }
            })();

        }





    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);

    },

    onExit : function () {
        this._super();

    }
});

var BVDThangLonLayer = cc.Node.extend({
    ctor : function (mSize, type, gameID) {
        this._super();
        this.setContentSize(mSize);
this.gameID = gameID;
this.typeCommand = "get_vinh_danh";
if(type === 0)
{
    this.typeCommand = "get_no_hu";
}
        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg.setAnchorPoint(cc.p(0.5, 0));
        forebg.setPreferredSize(cc.size(1054, 482));
        forebg.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg, 1);
        this.forebg = forebg;

        var arr_tit = [];
        if(gameID === GameType.MiniGame_Vong_Quay_May_Man)
        {
            arr_tit = ["Thời gian", "Tài khoản", "Phòng", "Cược", "Vòng trong", "Vòng ngoài"];
        }
        else
        {
            arr_tit = ["Thời gian", "Tài khoản", "Phòng", "Cược", "Thắng", "Mô tả"];
        }

        var arr_tit_pos = [119, 335, 474, 606, 728, 910];


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, arr_tit[i].toUpperCase());
            // m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(arr_tit_pos[i], 446));
            forebg.addChild(m_lb);
        }

        //
        // var forebg1 = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        // forebg1.setAnchorPoint(cc.p(0.5, 0));
        // forebg1.setPreferredSize(cc.size(1048, 482));
        // forebg1.setPosition(cc.p(this.width/2, 15));
        // this.addChild(forebg1);


        var _magin = 17;

        var mList = new newui.TableView(cc.size(forebg.width - _magin, forebg.height - 72) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, _magin));
        forebg.addChild(mList, 1);
        this.mList = mList;

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;


    },
    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener(this.typeCommand, this.getVinhDanhGame,this);
    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    setVisible : function (isVisible) {
        this._super(isVisible);
        if(isVisible)
        {
            this.getBXHVinhDanhGame(this.gameID);
        }
    },

    addBangVinhDanh : function (thoigian, nickname, room, cuoc, thang, mota) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2 === 0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(110, container.height/2));
        container.addChild(lb_thoigian);

        var lb_nickname = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, nickname);

        lb_nickname.setPosition(cc.p(325, container.height/2));
        container.addChild(lb_nickname);

        var lb_phong = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, room);

        lb_phong.setPosition(cc.p(462, container.height/2));
        container.addChild(lb_phong);


        var lb_cuoc = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cuoc);
        lb_cuoc.setColor(cc.color("#ffea00"));

        lb_cuoc.setPosition(cc.p(596, container.height/2));
        container.addChild(lb_cuoc);

        var lb_thang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thang);
        lb_thang.setColor(cc.color("#ffea00"));

        lb_thang.setPosition(cc.p(719, container.height/2));
        container.addChild(lb_thang);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_TitleDialog, mota, cc.TEXT_ALIGNMENT_CENTER, 400);
        lb_mota.setScale(14.0/32.0);
        lb_mota.setPosition(cc.p(900, container.height/2));
        container.addChild(lb_mota);


        this.mList.pushItem(container);
    },

    getBXHVinhDanhGame : function (gameID) {
        this.mList.removeAllItems();
        var request = {
            command : this.typeCommand,
            game: s_gameName[gameID]
        };

        this.loadingNode.setVisible(true);
        SocketClient.getInstance().sendHttpGetRequest(request);

        // for(var i = 0; i < 20; i++)
        // {
        //     this.addBangVinhDanh("12/12/1212", "sasukee babebe", 1000, 1000, 10000, "sdjdjsad ahsdjsa");
        // }
    },

    getVinhDanhGame : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var mlist = data["data"];
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this.addBangVinhDanh(mdata["date"], mdata["nickname"], cc.Global.NumberFormat1(mdata["bet"]),cc.Global.NumberFormat1(mdata["totalBet"]), cc.Global.NumberFormat1(mdata["winMoney"]), mdata["desc"]);
            }
        }
    }

});