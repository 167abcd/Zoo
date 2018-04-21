/**
 * Created by Balua on 7/26/17.
 */


var BXHMiniTaixiuLayer = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(1120, 638));
        // this._paddingBottom = 30;

        var tit = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "BẢNG XẾP HẠNG");
        tit.setScale(1.2);
        tit.setColor(cc.color("#ffc600"));
        this.addChild(tit, 1);
        tit.setPosition(cc.p(this.width/2, 576));




        var arr_tit = ["Hạng", "Tên nhân vật", "Tổng thắng"];
        var arr_tit_pos = [176, 490, 845];


        var forebg = new ccui.Scale9Sprite("tx_headerbg_chitietphien.png", cc.rect(20, 0, 4, 38));
        forebg.setPreferredSize(cc.size(1049, 38));
        forebg.setPosition(cc.p(this.width/2, 497));
        this.addChild(forebg, 1);


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, arr_tit[i].toUpperCase());
            m_lb.setPosition(cc.p(arr_tit_pos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }



        var mList = new newui.TableView(cc.size(1049, 459) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(35, 17));
        this.addChild(mList, 1);
        this.mList = mList;

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        this.loadingNode = loadingNode;

    },

    addItemBXHTaiXiu : function (thutu, tennhanvat, tongthang) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2 ===0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }


        if(this.mList.getChildrenCount() < 3)
        {
            var lb_thutu = cc.Label.createWithBMFont(cc.res.font.Roboto_Bold_TitleDialog, thutu);
            lb_thutu.setScale(20.0/32.0);
            lb_thutu.setPosition(cc.p(166, container.height/2));
            container.addChild(lb_thutu);
        }
        else {
            var lb_thutu = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thutu);
            lb_thutu.setPosition(cc.p(166, container.height/2));
            container.addChild(lb_thutu);
        }




        var lb_tennhanvat = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tennhanvat);
        lb_tennhanvat.setPosition(cc.p(490, container.height/2));
        container.addChild(lb_tennhanvat);

        var lb_tongthang = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(tongthang));
        lb_tongthang.setColor(cc.color("#ffea00"));
        lb_tongthang.setPosition(cc.p(849, container.height/2));
        container.addChild(lb_tongthang);


        this.mList.pushItem(container);
    },

    onEnter : function () {
        this._super();
        this.mList.removeAllItems();
        SocketClient.getInstance().addHTTPListener("get_bxh", this.onGetBXHTaiXiu, this);
        var request = {
            command : "get_bxh",
            game : "mini_taixiu",
            size : 10
        };
        this.loadingNode.setVisible(true);
        SocketClient.getInstance().sendHttpGetRequest(request);

        // for(var i = 0; i < 20; i++)
        // {
        //     this.addItemBXHTaiXiu(i+1, "sasukee babebe", 1000000);
        // }


    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    onGetBXHTaiXiu : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data && data["status"] === 0){
            var listbxh = data["data"];
            for(var i = 0; i < listbxh.length; i++){
                var obj = listbxh[i];
                var name = obj["nickname"];
                var money = obj["sumExchange"];
                this.addItemBXHTaiXiu(i + 1, name, money);
            }
        }
    }
});