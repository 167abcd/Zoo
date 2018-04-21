/**
 * Created by Balua on 7/26/17.
 */
var tongCuocTai = 0;
var tongCuocXiu = 0;
var tongHoanTai = 0;
var tongHoanXiu = 0;
var ChiTietPhienLayer = Dialog.extend({
    ctor : function (idPhien) {
        tongCuocTai = 0;
        tongCuocXiu = 0;
        tongHoanTai = 0;
        tongHoanXiu = 0;
        this._super();
        this.initWithSize(cc.size(1120, 638));
        // this._paddingBottom = 30;
        var thiz = this;

        var tit = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "LỊCH SỬ PHIÊN");
        tit.setScale(1.2);
        tit.setColor(cc.color("#ffc600"));
        this.addChild(tit, 1);
        tit.setPosition(cc.p(this.width/2, 575));

        var tit_idphien = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "Phiên #" + idPhien);
        tit_idphien.setColor(cc.color("#9ca7e5"));
        this.addChild(tit_idphien, 1);
        tit_idphien.setPosition(cc.p(this.width/2, 535));


        var dice = [];
        for(var i=0; i< 3; i++){
            var xucxac = new cc.Sprite("#mntx_dice1.png");
            xucxac.setPosition(468 + 66 * i, 475);
            thiz.addChild(xucxac, 1);
            dice.push(xucxac);
            xucxac.setVisible(false);
        }
        this.dice = dice;


        var lb_tai = new cc.Sprite("#tx_txt_tai.png");
        lb_tai.setAnchorPoint(cc.p(0.0, 0.5));
        lb_tai.setPosition(cc.p(234, 475));
        thiz.addChild(lb_tai, 1);

        var lb_xiu = new cc.Sprite("#tx_txt_xiu.png");
        lb_xiu.setAnchorPoint(cc.p(0.0, 0.5));
        lb_xiu.setPosition(cc.p(771, 475));
        thiz.addChild(lb_xiu, 1);

        var lb_tong = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        lb_tong.setScale(1.5);
        lb_tong.setPosition(cc.p(697, 475));
        this.addChild(lb_tong, 1);
        this.lb_tong = lb_tong;




        var forebg1 = new cc.Node();
        forebg1.setAnchorPoint(cc.p(0.5, 1.0));
        forebg1.setContentSize(cc.size(1017, 371));
        forebg1.setPosition(cc.p(this.width/2, 434));
        this.addChild(forebg1, 1);
        this.forebg1 = forebg1;

        var headerbg1 = new ccui.Scale9Sprite("tx_headerbg_chitietphien.png", cc.rect(20, 0, 4, 38));
        headerbg1.setPreferredSize(cc.size(488, 38));
        headerbg1.setAnchorPoint(cc.p(0.0, 1.0));
        headerbg1.setPosition(cc.p(0.0, forebg1.height));
        forebg1.addChild(headerbg1);

        var headerbg2 = new ccui.Scale9Sprite("tx_headerbg_chitietphien.png", cc.rect(20, 0, 4, 38));
        headerbg2.setPreferredSize(cc.size(488, 38));
        headerbg2.setAnchorPoint(cc.p(1.0, 1.0));
        headerbg2.setPosition(cc.p(forebg1.width, forebg1.height));
        forebg1.addChild(headerbg2);



        var lbl_tongDatTai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "TỔNG");
        lbl_tongDatTai.setAnchorPoint(cc.p(0.0, 0.5));
        lbl_tongDatTai.setPosition(137, 19);
        forebg1.addChild(lbl_tongDatTai,1000);



        var lbl_tongCuocTai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_18, "");
        // lbl_tongCuocTai.setAnchorPoint(cc.p(0.0, 0.5));
        lbl_tongCuocTai.setPosition(338, 19);
        lbl_tongCuocTai.setColor(cc.color("#fff996"));
        forebg1.addChild(lbl_tongCuocTai);
        this.lbl_tongCuocTai = lbl_tongCuocTai;

        var lbl_tongHoanTai = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_18, "");
        // lbl_tongHoanTai.setAnchorPoint(cc.p(0.0, 0.5));
        lbl_tongHoanTai.setPosition(445, 19);
        lbl_tongHoanTai.setColor(cc.color("#fff996"));
        forebg1.addChild(lbl_tongHoanTai);
        this.lbl_tongHoanTai= lbl_tongHoanTai;

        var lbl_tongDatXiu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, "TỔNG");
        // lbl_tongDatXiu.setAnchorPoint(cc.p(0.0, 0.5));
        lbl_tongDatXiu.setPosition(657, 19);
        forebg1.addChild(lbl_tongDatXiu,1000);

        var lbl_tongCuocXiu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_18, "");
        lbl_tongCuocXiu.setColor(cc.color("#fff996"));
        // lbl_tongCuocXiu.setAnchorPoint(cc.p(0.0, 0.5));
        lbl_tongCuocXiu.setPosition(849, 19);
        forebg1.addChild(lbl_tongCuocXiu);
        this.lbl_tongCuocXiu = lbl_tongCuocXiu;

        var lbl_tongHoanXiu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_18, "");
        // lbl_tongHoanXiu.setAnchorPoint(cc.p(0.0, 0.5));
        lbl_tongHoanXiu.setPosition(976, 19);
        lbl_tongHoanXiu.setColor(cc.color("#fff996"));
        forebg1.addChild(lbl_tongHoanXiu);
        this.lbl_tongHoanXiu = lbl_tongHoanXiu;



        var arr_tit = ["Thời gian", "Tên", "Đặt", "Hoàn", "Thời gian", "Tên", "Đặt", "Hoàn"];
        var arr_tit_pos = [10, 138, 305, 398, 539, 657, 833, 923];


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, arr_tit[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(arr_tit_pos[i], 352));
            forebg1.addChild(m_lb);
        }


        this._createTai();
        this._createXiu();


        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        loadingNode.setVisible(true);
        this.loadingNode = loadingNode;

        var request = {
            c: "game",
            g: "mini_taixiu",
            a: 1005,
            p:{
                1: 0,
                2: 4000,
                3:idPhien
            }
        };
        SocketClient.getInstance().send(request);
//
//         for(var i=0;i<20;i++){
//             var name = "shgdhsshgdhsdgssds";
//
//             if (name.length > 10)
//                 name = name.substring(0, 10) ;
//
// var type = i%2===0?1:2;
//             var obj = {
//                 time : "12/12/1212",
//                 name : name,
//                 betting : "10000",
//                 retValue : "1100000"
//             };
//             if(type === 1){
//                 this.arrTai.push(obj);
//             }
//             else{
//                 this.arrXiu.push(obj);
//             }
//         }
//
//         this.listTai.refreshView();
//         this.listXiu.refreshView();


    },

    _createTai : function () {
        var thiz = this;

        this.arrTai = [];


        var _left1 = 0.0;
        var _right1 = 488.0;

        var _top1 = 333.0;
        var _bottom1 = 40.0;

        var listTai = new newui.ListViewWithAdaptor(cc.size(_right1 - _left1, _top1 - _bottom1));
        listTai.setPadding(5);
        listTai.setAnchorPoint(cc.p(0.0, 1.0));
        listTai.setPosition(cc.p(_left1, _top1));
        this.forebg1.addChild(listTai);

        listTai.setCreateItemCallback(function () {
            return thiz._createCell();
        });
        listTai.setSizeCallback(function () {
            return thiz.arrTai.length;
        });
        listTai.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrTai[idx]);
        });
        this.listTai = listTai;
    },

    _createXiu : function () {
        var thiz = this;

        this.arrXiu = [];

        var _left2 = 529.0;
        var _right2 = 1017.0;

        var _top2 = 333.0;
        var _bottom2 = 40.0;

        var listXiu = new newui.ListViewWithAdaptor(cc.size(_right2 - _left2, _top2 - _bottom2));
        listXiu.setPadding(5);
        listXiu.setAnchorPoint(cc.p(0.0, 1.0));
        listXiu.setPosition(cc.p(_left2, _top2));
        this.forebg1.addChild(listXiu);
        listXiu.setCreateItemCallback(function () {
            return thiz._createCell();
        });
        listXiu.setSizeCallback(function () {
            return thiz.arrXiu.length;
        });
        listXiu.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrXiu[idx]);
        });
        this.listXiu = listXiu;
    },

    _createCell : function () {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(490, 62));

        var bg = new ccui.Scale9Sprite("home_napvang_bg_tygia2.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(container.getContentSize());
        bg.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg);


        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_17, "time", cc.TEXT_ALIGNMENT_LEFT, 130);
        timeLabel.setAnchorPoint(cc.p(0.0, 0.5));
        timeLabel.setPosition(9, container.height/2);
        container.addChild(timeLabel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_17, "time", cc.TEXT_ALIGNMENT_LEFT);
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(137, timeLabel.y);
        container.addChild(nameLabel);

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_17, "time", cc.TEXT_ALIGNMENT_LEFT);
        // bettingLabel.setAnchorPoint(cc.p(0.0, 0.5));
        bettingLabel.setPosition(325, timeLabel.y);
        bettingLabel.setColor(cc.color("#ffc600"));
        container.addChild(bettingLabel);

        var returnLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoRegular_17, "time", cc.TEXT_ALIGNMENT_LEFT);
        // returnLabel.setAnchorPoint(cc.p(0.0, 0.5));
        returnLabel.setPosition(430, timeLabel.y);
        returnLabel.setColor(cc.color("#ffc600"));
        container.addChild(returnLabel);

        container.timeLabel = timeLabel;
        container.nameLabel = nameLabel;
        container.bettingLabel = bettingLabel;
        container.returnLabel = returnLabel;

        return container;
    },

    _setData : function (view, data) {
        view.timeLabel.setString(data["time"]);
        view.nameLabel.setString(data["name"]);
        view.bettingLabel.setString(cc.Global.NumberFormat1(cc.Global.NumberFromString(data["betting"])));
        view.returnLabel.setString(cc.Global.NumberFormat1(cc.Global.NumberFromString(data["retValue"])));
    },

    _recvData : function (cmd, data) {
        cc.log(data);
        // this.lblDate.setString(data["p"]["1"]["3"]["5"]);
        this.loadingNode.setVisible(false);
        var dice = data["data"]["3"];
        this.lb_tong.setString(dice[0] + dice[1] + dice[2]);
        // this.bg_tongdiem.runAction(new cc.MoveBy(0, dice[0] + dice[1] + dice[2]>10?-234:0,0));
        for(var i=0;i<dice.length;i++){
            this.dice[i].setVisible(true);
            this.dice[i].setSpriteFrame("mntx_dice" + dice[i] + ".png");
            // this.dice[i].runAction(new cc.MoveBy(0, dice[0] + dice[1] + dice[2]>10?117:0,0));
        }

        var items = data["data"]["4"];
        cc.log(items.length);
        for(var i=0;i<items.length;i++){
            var name = items[i]["2"];

            if (name.length > 15)
                name = name.substring(0, 15) ;

            var type = items[i]["1"];
            var betting = items[i]["3"];
            var retValue = items[i]["4"];
            var time = items[i]["6"];
            var obj = {
                time : cc.Global.DateToString(new Date(time)),
                name : name,
                betting : betting,
                retValue : retValue
            };
            if(type === 1){
                this.arrTai.push(obj);
                tongCuocTai = tongCuocTai + parseInt(betting.replace(/[.,]/g,''));
                tongHoanTai = tongHoanTai + parseInt(retValue.replace(/[.,]/g,''));
            }
            else{
                this.arrXiu.push(obj);
                tongCuocXiu = tongCuocXiu + parseInt(betting.replace(/[.,]/g,''));
                tongHoanXiu = tongHoanXiu + parseInt(retValue.replace(/[.,]/g,''));
            }
        }
        this.listTai.refreshView();
        this.listXiu.refreshView();
        this.lbl_tongCuocTai.setString(cc.Global.NumberFormat1(tongCuocTai));
        this.lbl_tongHoanTai.setString(cc.Global.NumberFormat1(tongHoanTai));
        this.lbl_tongCuocXiu.setString(cc.Global.NumberFormat1(tongCuocXiu));
        this.lbl_tongHoanXiu.setString(cc.Global.NumberFormat1(tongHoanXiu));

    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("1005", this._recvData, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});