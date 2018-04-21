/**
 * Created by Balua on 7/26/17.
 */

var LichSuTaiXiuLayer = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(1120, 638));
        // this._paddingBottom = 30;

        var tit = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "LỊCH SỬ CHƠI");
        tit.setScale(1.2);
        tit.setColor(cc.color("#ffc600"));
        this.addChild(tit, 1);
        tit.setPosition(cc.p(this.width/2, 576));


        var forebg = new ccui.Scale9Sprite("tx_headerbg_chitietphien.png", cc.rect(20, 0, 4, 38));
        forebg.setPreferredSize(cc.size(1049, 38));
        forebg.setPosition(cc.p(this.width/2, 497));
        this.addChild(forebg, 1);


        var arr_tit = ["Phiên", "Thời gian", "Đặt cửa", "Tiền đặt", "Kết quả", "Trả lại", "Thắng"];
        var arr_tit_pos = [71, 265, 429, 558, 687, 824, 964];


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, arr_tit[i].toUpperCase());
            m_lb.setPosition(cc.p(arr_tit_pos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }

        var _magin = 17;

        var mListLichsu = new newui.TableView(cc.size(1049, 430) , 1);
        mListLichsu.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mListLichsu.setScrollBarEnabled(false);
        mListLichsu.setAnchorPoint(cc.p(0.0, 0.0));
        mListLichsu.setPosition(cc.p(36, 45));
        this.addChild(mListLichsu, 1);
        this.mListLichsu = mListLichsu;


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

        for(var i = 0; i < 20; i++)
        {
            this.addItemLsuTaiXiu("22321321312", "12:12:12 12/12/1212", 1, "12321313", "122132321", "242343243", "dsjhfsdjhfskd");
        }

    },

    addItemLsuTaiXiu : function (phien, thoigian, datcua, tiendat, ketqua, tralai, thang) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mListLichsu.width, 46));

        if(this.mListLichsu.getChildrenCount() %2 === 0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        var lb_phien = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_22, phien);
        lb_phien.setPosition(cc.p(71, container.height/2));
        lb_phien.setColor(cc.color("#768ab6"));
        container.addChild(lb_phien);


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_22, thoigian);
        lb_thoigian.setColor(cc.color("#768ab6"));
        lb_thoigian.setPosition(cc.p(265, container.height/2));
        container.addChild(lb_thoigian);



        var lb_datcua = new cc.Sprite(datcua === 1?"#tx_txt_tai.png":"#tx_txt_xiu.png");
        lb_datcua.setPosition(cc.p(429, container.height/2));
        lb_datcua.setScale(0.5);
        container.addChild(lb_datcua);

        var lb_tiendat = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_22, tiendat);

        lb_tiendat.setColor(cc.color("#fff000"));
        lb_tiendat.setPosition(cc.p(558, container.height/2));
        container.addChild(lb_tiendat);

        var lb_ketqua = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_22, ketqua);
        lb_ketqua.setColor(cc.color("#768ab6"));
        lb_ketqua.setPosition(cc.p(687, container.height/2));
        container.addChild(lb_ketqua);

        var lb_tralai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_22, tralai);

        lb_tralai.setColor(cc.color("#fff000"));
        lb_tralai.setPosition(cc.p(830, container.height/2));
        container.addChild(lb_tralai);

        var lb_thang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_22, thang);

        lb_thang.setColor(cc.color("#fff000"));
        lb_thang.setPosition(cc.p(964, container.height/2));
        container.addChild(lb_thang);




        this.mListLichsu.pushItem(container);
    },

    onEnter : function () {
        this._super();
        this.mListLichsu.removeAllItems();

        SocketClient.getInstance().addListener("1004", this._recvData, this);
        var request = {
            c: "game",
            g: "mini_taixiu",
            a: 1004
        };
        SocketClient.getInstance().send(request);
        this.loadingNode.setVisible(true);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _recvData : function (cmd, data) {
        this.loadingNode.setVisible(false);
        var list = data["data"]["2"];
        var limitcell = list.length;
        if(limitcell > 50)
        {
            limitcell = 50;
        }

        for(var i = 0; i < limitcell; i++){
            var childdata = list[i];
            var mangxucxac = childdata["8"];
            var ketqua = mangxucxac[0] + "-" + mangxucxac[1] + "-" + mangxucxac[2] + "  " + (mangxucxac[0] + mangxucxac[1] + mangxucxac[2]);
            this.addItemLsuTaiXiu(childdata["2"], cc.Global.DateToString(new Date(childdata["6"]), " "), childdata["1"], childdata["3"], ketqua , childdata["4"], childdata["5"]);
        }
    }
});