 /**
 * Created by Balua on 8/9/17.
 */
var AllLichSuLayer = Dialog.extend({
    ctor : function (gameID) {
        this._super();

        this.initWithSize(cc.size(1081, 597));
        this._paddingBottom = 30;

        var title = new cc.Sprite("#home_lichsu_title.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(cc.p(this.width/2, this.height+10));
        this.addChild(title, 1);


        var arr_tit = [];
        if(gameID === GameType.MiniGame_Vong_Quay_May_Man)
        {
            arr_tit = ["Phiên", "Thời gian", "Vòng ngoài", "Vòng nhỏ", "Vòng to"];
        }
        else
        {
            arr_tit = ["Phiên", "Thời gian", "Cược", "Thắng", "Mô tả"];
        }

        var arr_tit_pos = [110, 353, 563, 715, 910];


        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1048, 82));
        forebg.setPosition(cc.p(this.width/2, this.height - 58));
        this.addChild(forebg, 1);


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, arr_tit[i].toUpperCase());
            m_lb.setPosition(cc.p(arr_tit_pos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1048, 482));
        forebg1.setPosition(cc.p(this.width/2, 15));
        this.addChild(forebg1, 1);



        var _magin = 17;

        var mList = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 20) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, _magin));
        forebg1.addChild(mList, 1);
        this.mList = mList;


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

        this.getLichSuGame(gameID);
    },

    addLsuChoiXlot : function (idphien, thoigian, cuoc, thang, mota) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2 === 0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var lb_idphien = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, idphien);
        lb_idphien.setPosition(cc.p(105, container.height/2));
        container.addChild(lb_idphien);


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian);
        lb_thoigian.setPosition(cc.p(348, container.height/2));
        container.addChild(lb_thoigian);

        var lb_cuoc = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cuoc);
        lb_cuoc.setColor(cc.color("#ffea00"));
        lb_cuoc.setPosition(cc.p(553, container.height/2));
        container.addChild(lb_cuoc);

        var lb_thang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thang>0?("+" + cc.Global.NumberFormat1(thang)):thang.toString());
        lb_thang.setColor(cc.color("#ffea00"));
        lb_thang.setPosition(cc.p(705, container.height/2));
        container.addChild(lb_thang);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_TitleDialog, mota, cc.TEXT_ALIGNMENT_CENTER, 400);
        lb_mota.setScale(14.0/32.0);
        lb_mota.setPosition(cc.p(905, container.height/2));
        container.addChild(lb_mota);


        this.mList.pushItem(container);
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("get_history_for_user", this.getHisChoiXlot,this);

    },

     onExit : function () {
         this._super();
         SocketClient.getInstance().removeListener(this);
     },

    getLichSuGame : function (gameID) {
        this.mList.removeAllItems();
        var request = {
            command : "get_history_for_user",
            game: s_gameName[gameID]
        };
        this.loadingNode.setVisible(true);
        SocketClient.getInstance().sendHttpGetRequest(request);
        //
        // for(var i = 0; i < 20; i++)
        // {
        //     this.addLsuChoiXlot("1234324324", "12:12:12 12/12/1212", 10000, 10000, "thung pha sanh sanh ấnh ");
        // }


    },

    getHisChoiXlot : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var mlist = data["data"];
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this.addLsuChoiXlot(mdata["gameId"], mdata["date"], cc.Global.NumberFormat1(mdata["totalBet"]), mdata["winMoney"], mdata["desc"]);
            }
        }
    }

});