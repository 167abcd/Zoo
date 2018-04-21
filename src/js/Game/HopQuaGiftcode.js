/**
 * Created by Balua on 9/12/17.
 */

var HopQuaGiftCode = Dialog.extend(
    {
        ctor : function () {
            this._super();

            this.initWithSize(cc.size(1081, 597));
            this.title.setString("HỘP QUÀ");

            this.initTableView();

        },


        initTableView : function () {

            var forebg = new ccui.Scale9Sprite("home_shop_bg_tab.png", cc.rect(50, 0, 4, 72));
            forebg.setPreferredSize(cc.size(1033, 72));
            forebg.setPosition(cc.p(this.width/2, this.height - 53));
            this.addChild(forebg);

            var arr_tit = ["phiên", "mã giftcode", "giá trị", "hạn dùng", "nạp", "copy"];

            var arr_tit_pos = [88, 268, 440, 635, 824, 976];

            for(var i = 0; i < arr_tit.length; i++){
                var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, arr_tit[i].toUpperCase());
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


            var loadingNode = new LoadingDataNode();
            loadingNode.setPosition(cc.p(this.width/2, this.height/2));
            this.addChild(loadingNode, 100);
            loadingNode.setVisible(true);
            this.loadingNode = loadingNode;

        },

        _createCell : function (idphien, magiftcode, gtri, handung, invalidBtnNap) {

            var thiz = this;
            var container = new ccui.Widget();
            container.setContentSize(cc.size(this.mList.width, 46));

            if(this.mList.getChildrenCount() %2 === 0)
            {
                var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
                bg_cell.setPreferredSize(container.getContentSize());
                bg_cell.setPosition(cc.p(container.width/2, container.height/2));
                container.addChild(bg_cell);
            }


            var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, idphien);
            // lb_thoigian.setAnchorPoint(cc.p(0.0, 0.5));
            lb_thoigian.setPosition(cc.p(88, container.height/2));
            container.addChild(lb_thoigian);

            var lb_magiftcode = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, magiftcode);
            // lb_magiftcode.setAnchorPoint(cc.p(0.0, 0.5));
            lb_magiftcode.setColor(cc.color("#ffea00"));
            lb_magiftcode.setPosition(cc.p(268, container.height/2));
            container.addChild(lb_magiftcode);

            var lb_gtri = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, gtri);
            // lb_gtri.setAnchorPoint(cc.p(0.0, 0.5));
            lb_gtri.setColor(cc.color("#ffea00"));
            lb_gtri.setPosition(cc.p(440, container.height/2));
            container.addChild(lb_gtri);


            var lb_handung = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, handung);
            // lb_handung.setAnchorPoint(cc.p(0.0, 0.5));
            lb_handung.setPosition(cc.p(635, container.height/2));
            container.addChild(lb_handung);


            var btn_naplai = new ccui.Button("deche_giftcode_nap.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btn_naplai.setAnchorPoint(cc.p(0.0, 0.5));
            btn_naplai.setPosition(cc.p(824, container.height/2));
            container.addChild(btn_naplai);

            btn_naplai.setEnabled(!invalidBtnNap);

            var btn_copy = new ccui.Button("deche_giftcode_copy.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // btn_copy.setAnchorPoint(cc.p(0.0, 0.5));
            btn_copy.setPosition(cc.p(976, container.height/2));
            container.addChild(btn_copy);


            btn_naplai.addClickEventListener(function () {
                var naplayer = new GiftCodeLayer();
                naplayer.show();
                naplayer.seltecTab(1);
                naplayer.setTextFieldGiftcode(magiftcode);
            });

            btn_copy.addClickEventListener(function () {

                SystemPlugin.getInstance().copyTextClipboard(magiftcode);
            });


            this.mList.pushItem(container);

        },


        onEnter : function () {
            this._super();
            this.mList.removeAllItems();
            SocketClient.getInstance().addListener("1606", this._onListGiftcode, this);
            var request = {
                c : "game",
                a:1606,
                g:"gift_hunting"
                // p:{
                //     1:0,
                //     2:50
                // }
            };
            SocketClient.getInstance().send(request);
            this.loadingNode.setVisible(true);

            // this._createCell("12/12/1212 12:12:12 ", "copy text nay", "100.000k", "12 ngay", true);

        },

        onExit : function () {
          this._super();
          SocketClient.getInstance().removeListener(this);
        },

        _onListGiftcode : function (cmd, data) {
            this.loadingNode.setVisible(false);
            cc.log("=>>" + data);
            var mlist = data["data"]["1"];
            if(mlist && mlist.length > 0)
            {
                for(var i = 0; i < mlist.length; i++)
                {
                    var obj = mlist[i];
                    this._createCell(cc.Global.DateToString(new Date(obj["1"]), "  "), obj["2"], cc.Global.NumberFormat1(obj["4"]), cc.Global.DateToString(new Date(obj["3"])), obj["5"]);
                }

            }

        }
    }
);