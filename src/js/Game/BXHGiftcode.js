/**
 * Created by Balua on 9/12/17.
 */
var BXHGiftCode = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(1081, 597));
        this.title.setString("BẢNG XẾP HẠNG");

        var btn_phientruoc = new ccui.Button("deche_giftcode_phientruoc.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_phientruoc.setAnchorPoint(cc.p(0.0, 0.5));
        btn_phientruoc.setPosition(cc.p(this.width/2 - 430, 635));
        this.addChild(btn_phientruoc);
        this.btn_phientruoc = btn_phientruoc;


        var btn_phiensau = new ccui.Button("deche_giftcode_phiensau.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn_phiensau.setAnchorPoint(cc.p(0.0, 0.5));
        btn_phiensau.setPosition(cc.p(this.width/2 + 430, 635));
        this.addChild(btn_phiensau);
        this.btn_phiensau = btn_phiensau;


        var thiz = this;
        btn_phientruoc.addClickEventListener(function () {

            if(thiz.prePhien != 0)
            {
                thiz.getBxhFromIDphien(thiz.prePhien);
            }
        });

        btn_phiensau.addClickEventListener(function () {
            if(thiz.nexPhien != 0)
            {
                thiz.getBxhFromIDphien(thiz.nexPhien);
            }
        });

        this.initTableView();

        this.prePhien = 0;
        this.nexPhien = 0;



        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        loadingNode.setVisible(true);
        this.loadingNode = loadingNode;
    },

    initTableView : function () {


        var forebg = new ccui.Scale9Sprite("home_shop_bg_tab.png", cc.rect(50, 0, 4, 72));
        forebg.setPreferredSize(cc.size(1033, 72));
        forebg.setPosition(cc.p(this.width/2, this.height - 53));
        this.addChild(forebg);


        var arr_tit = ["Phiên", "Top", "tài khoản", "Bin", "Giftcode"];

        var arr_tit_pos = [88, 276, 507, 737, 958];

        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_20, arr_tit[i].toUpperCase());
            m_lb.setPosition(cc.p(arr_tit_pos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }

        var forebg1 = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1048, 482));
        forebg1.setPosition(cc.p(this.width/2, 15));
        this.addChild(forebg1);


        var _magin = 17;

        var mList = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 10) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, _magin));
        forebg1.addChild(mList, 1);
        this.mList = mList;


    },

    _createCell : function (idphien, top, tkhoan, xlot, giftcode) {

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
        // lb_idphien.setAnchorPoint(cc.p(0.0, 0.5));
        lb_idphien.setPosition(cc.p(88, container.height/2));
        container.addChild(lb_idphien);

        var lb_top = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, top);
        // lb_top.setAnchorPoint(cc.p(0.0, 0.5));
        lb_top.setPosition(cc.p(276, container.height/2));
        container.addChild(lb_top);

        var lb_tkhoan = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tkhoan);
        // lb_tkhoan.setAnchorPoint(cc.p(0.0, 0.5));
        lb_tkhoan.setPosition(cc.p(507, container.height/2));
        container.addChild(lb_tkhoan);


        var lb_xlot = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, xlot);
        // lb_xlot.setAnchorPoint(cc.p(0.0, 0.5));
        lb_xlot.setColor(cc.color("#ffea00"));
        lb_xlot.setPosition(cc.p(737, container.height/2));
        container.addChild(lb_xlot);

        var lb_giftcode = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, giftcode);
        // lb_giftcode.setAnchorPoint(cc.p(0.0, 0.5));
        lb_giftcode.setColor(cc.color("#ffea00"));
        lb_giftcode.setPosition(cc.p(958, container.height/2));
        container.addChild(lb_giftcode);

        this.mList.pushItem(container);

    },


    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("1605", this._onListBXHGiftcode, this);
        this.getBxhFromIDphien();
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    getBxhFromIDphien : function (idphien) {
        this.mList.removeAllItems();
        var request;
        if(idphien === undefined)
        {
            request = {
                c : "game",
                a:1605,
                g:"gift_hunting"
            };
        }
        else
        {
            request = {
                c : "game",
                a:1605,
                g:"gift_hunting",
                p:{
                    1:idphien
                }
            };
        }
        this.loadingNode.setVisible(true);
        SocketClient.getInstance().send(request);
        // LoadingDialog.getInstance().show();

        // for(var i = 0; i < 20; i++)
        // {
        //     this._createCell("23236483264324", "1", "balua8888", "1000000", "100000");
        // }
    },

    _onListBXHGiftcode : function (cmd, data) {
        // cc.log("=>>" + data);
        // LoadingDialog.getInstance().hide();
        this.loadingNode.setVisible(false);
        var databxh = data["data"];
        if(!databxh)
        {
            return;
        }

        if(databxh["2"]){
            this.prePhien = databxh["2"];
        }
        else
        {
            this.prePhien = 0;
        }

        if(databxh["3"]){
            this.nexPhien = databxh["3"];
        }
        else
        {
            this.nexPhien = 0;
        }


        if(this.prePhien === 0)
        {
            this.btn_phientruoc.setEnabled(false);
        }
        else
        {
            this.btn_phientruoc.setEnabled(true);
        }

        if(this.nexPhien === 0)
        {
            this.btn_phiensau.setEnabled(false);
        }
        else
        {
            this.btn_phiensau.setEnabled(true);
        }

        var mlist = databxh["1"];
        if(mlist && mlist.length > 0)
        {
            for(var i = 0; i < mlist.length; i++)
            {
                var obj = mlist[i];
                this._createCell(cc.Global.DateToString(new Date(obj["1"]), "  "), obj["2"], obj["3"], cc.Global.NumberFormat1(obj["4"]), cc.Global.NumberFormat1(obj["5"]));
            }

        }
    }
});