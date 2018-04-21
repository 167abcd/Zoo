/**
 * Created by Balua on 7/26/17.
 */
var VipLayer = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(1077, 566));

        this._paddingBottom = 30;

        var title = new cc.Sprite("#home_vip_title.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(cc.p(this.width/2, this.height + 10));
        this.addChild(title, 3);



        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 71));
        forebg.setPosition(cc.p(this.width/2, 519));
        this.addChild(forebg, 1);


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 476));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1, 1);


        var arr_tit = ["CẤP", "VP", "THƯỞNG LÊN CẤP", "VP RA BIN", "AVATAR 1", "AVATAR 2", "AVATAR 3", "UPLOAD AVATAR"];
        var arr_tit_pos = [40, 155, 234, 432, 550, 666, 780, 900];


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, arr_tit[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(arr_tit_pos[i], forebg.y));
            this.addChild(m_lb, 1);
        }


        var _magin = 18;


        var mList = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 17) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin + 2, _magin + 5));
        this.addChild(mList, 1);
        this.mList = mList;

        // cc.log(cc.Global.GetVip(100));


        for(var i = 1; i < VipData.length; i++){

            this.addItemVip("" + i, VipData[i]["vippoint"], VipData[i]["content"], VipData[i]["viprax"], VipData[i]["avatar1"], VipData[i]["avatar2"], VipData[i]["avatar3"], VipData[i]["upload"]);
        }


    },

    addItemVip : function (cap, diem, thuonglencap, viprax, codegamemoi, avatarvip, quasinhnhat, quavip) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 46));

        if(this.mList.getChildrenCount() %2 === 0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }


        // var lb_cap = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cap);

        var spri_cap = new cc.Sprite("#home_vip_" + cap + ".png");

        spri_cap.setPosition(cc.p(41, container.height/2));
        container.addChild(spri_cap);


        var lb_diem = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(diem));
        // lb_diem.setAnchorPoint(cc.p(0.0, 0.5));
        lb_diem.setPosition(cc.p(142, container.height/2));
        container.addChild(lb_diem);

        var lb_thuonglencap = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, cc.Global.NumberFormat1(thuonglencap));
        lb_thuonglencap.setColor(cc.color("#ffde00"));
        // lb_thuonglencap.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thuonglencap.setPosition(cc.p(290, container.height/2));
        container.addChild(lb_thuonglencap);

        var lb_viprax = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, viprax);
        lb_viprax.setColor(cc.color("#ffde00"));
        // lb_viprax.setAnchorPoint(cc.p(0.0, 0.5));
        lb_viprax.setPosition(cc.p(451, container.height/2));
        container.addChild(lb_viprax);



        var icon_codegamemoi = new cc.Sprite(codegamemoi?"#home_vip_checkok.png":"#home_vip_checknotok.png");
        icon_codegamemoi.setPosition(cc.p(568, container.height/2));
        container.addChild(icon_codegamemoi);

        var icon_avatarvip = new cc.Sprite(avatarvip?"#home_vip_checkok.png":"#home_vip_checknotok.png");
        icon_avatarvip.setPosition(cc.p(681, container.height/2));
        container.addChild(icon_avatarvip);

        var icon_quasinhnhat = new cc.Sprite(quasinhnhat?"#home_vip_checkok.png":"#home_vip_checknotok.png");
        icon_quasinhnhat.setPosition(cc.p(798, container.height/2));
        container.addChild(icon_quasinhnhat);

        var icon_quavip = new cc.Sprite(quavip?"#home_vip_checkok.png":"#home_vip_checknotok.png");
        icon_quavip.setPosition(cc.p(946, container.height/2));
        container.addChild(icon_quavip);


        this.mList.pushItem(container);
    }
});