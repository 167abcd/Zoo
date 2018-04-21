/**
 * Created by Balua on 7/25/17.
 */




var InboxLayer = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        this.initWithSize(cc.size(1095, 584));

        var title = new cc.Sprite("#home_inbox_title.png");
        title.setAnchorPoint(cc.p(0.5, 0.0));
        title.setPosition(cc.p(this.width/2, this.height + 10));
        this.addChild(title, 2);

        this._paddingBottom = 30;

        
        var nodelist = new cc.Node();
        nodelist.setContentSize(this.getContentSize());
        this.addChild(nodelist, 1);
        this.nodelist = nodelist;


        var m_list_titlecolumn = ["THỜI GIAN", "NGƯỜI GỬI", "NỘI DUNG"];
        var m_list_titlecolumnPos = [28, 213, 570];


        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 72));
        forebg.setPosition(cc.p(this.width/2, this.height - 53));
        nodelist.addChild(forebg);



        for(var i = 0; i < m_list_titlecolumn.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, m_list_titlecolumn[i]);
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(m_list_titlecolumnPos[i], forebg.height/2));
            forebg.addChild(m_lb);
        }


        var btn_allDelete = new ccui.Button("home_inbox_btnalldelete.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_allDelete.setPosition(cc.p(950, forebg.height/2));
        btn_allDelete.addClickEventListener(function () {
            if(thiz.mList.size() > 0)
            {
                var dialog = new MessageConfirmDialog();
                dialog.setMessage("Bạn chắc chắn muốn tất cả tin nhắn trong hộp thư ?");
                dialog.btn_ok.addClickEventListener(function () {
                    for(var i = 0; i < thiz.mList.size(); i++)
                    {
                        thiz.deleteMessageID(thiz.mList.getItem(i).ID);
                    }
                    dialog.hide();
                });
                dialog.show();
            }
            else
            {
                var mesdialog = new MessageDialog();
                mesdialog.setMessage("Hộp thư rỗng!");
                mesdialog.show();
            }
        });
        forebg.addChild(btn_allDelete);



        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 482));
        forebg1.setPosition(cc.p(this.width/2, 16));
        nodelist.addChild(forebg1);



        var _magin = 17;


        var mList = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 17) , 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setAnchorPoint(cc.p(0.0, 0.0));
        mList.setPosition(cc.p(_magin - 8, _magin));
        forebg1.addChild(mList, 10);
        this.mList = mList;


        // nodelist.setVisible(false);


        var _inboxdetailLyer = new InboxDetailLayer(this.getContentSize());
        _inboxdetailLyer.setVisible(false);
        this.addChild(_inboxdetailLyer, 1);
        this._inboxdetailLyer = _inboxdetailLyer;
        _inboxdetailLyer.btn_back.addClickEventListener(function () {
           _inboxdetailLyer.setVisible(false);
           nodelist.setVisible(true);
           thiz.sendRequestInbox();
        });


        _inboxdetailLyer.btn_xoa.addClickEventListener(function () {
            thiz.deleteMessageID(_inboxdetailLyer.idMes);
        });

        var loadingNode = new LoadingDataNode();
        loadingNode.setPosition(cc.p(this.width/2, this.height/2));
        this.addChild(loadingNode, 100);
        loadingNode.setVisible(true);
        this.loadingNode = loadingNode;


        // _inboxdetailLyer.setMessage("chao mung den voi game onlien", "asdksajhdjaskhd akdhasjkd asdhaskjd asdjhsajkdh ");



        // for(var i = 0; i < 20; i++)
        // {
        //     this.addItemInbox("12/12/1212 12:12:12", "addddd", "sdfdfdsfsdfdf", "sddfdfdsfdf", "sdfdsfdsfds", (i%2)===0?true:false);
        // }

    },


    addItemInbox : function (thoigian, nguoigui, title, noidung, id, isviewed) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.mList.width, 56));

        if(this.mList.getChildrenCount() %2 === 0)
        {
            var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
            bg_cell.setPreferredSize(container.getContentSize());
            bg_cell.setPosition(cc.p(container.width/2, container.height/2));
            container.addChild(bg_cell);
        }

        container.ID = id;


        // var isread = new cc.Sprite(isviewed?"#home_inbox_read.png":"#home_inbox_new.png");
        // isread.setPosition(cc.p(isread.width/2 + 10, container.height/2));
        // container.addChild(isread);


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, thoigian, cc.TEXT_ALIGNMENT_CENTER, 100);
        lb_thoigian.setColor(cc.color(isviewed?"#a9a8a8":"#ffffff"));
        lb_thoigian.setPosition(cc.p(70, container.height/2));
        container.addChild(lb_thoigian);
        //
        //
        var lb_nguoigui = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, nguoigui);
        lb_nguoigui.setColor(cc.color(isviewed?"#a9a8a8":"#0096ff"));
        lb_nguoigui.setPosition(cc.p(252, container.height/2));
        container.addChild(lb_nguoigui);
        //
        var lb_title = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, title, cc.TEXT_ALIGNMENT_LEFT, 470);
        lb_title.setColor(cc.color(isviewed?"#a9a8a8":"#fed100"));
        lb_title.setPosition(cc.p(604, container.height/2));
        container.addChild(lb_title);
        //
        var thiz = this;

        var btn_xoa = new ccui.Button("home_inbox_btndelete.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_xoa.setPosition(cc.p(940, container.height/2));
        btn_xoa.addClickEventListener(function () {
            if(isviewed)
            {
                thiz.deleteMessageID(id);
            }
            else
            {
                var dialog = new MessageConfirmDialog();
                dialog.setMessage("Bạn chắc chắn muốn xoá tín nhắn này ?");
                dialog.btn_ok.addClickEventListener(function () {
                    thiz.deleteMessageID(id);
                    dialog.hide();
                });
                dialog.show();
            }


        });


        container.addChild(btn_xoa);

        var thizzzz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            thizzzz.nodelist.setVisible(false);
            thizzzz._inboxdetailLyer.setMessage(title, noidung, id);
        });

        this.mList.pushItem(container);
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("search_message", this._getMessages, this);
        SocketClient.getInstance().addHTTPListener("remove_message", this._removeMessages, this);
        this.sendRequestInbox();

    },
    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);

    },

    sendRequestInbox : function () {
        this.mList.removeAllItems();
        var request = {
            command : "search_message"
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
        this.loadingNode.setVisible(true);
    },
    _getMessages : function (cmd, data) {
        cc.log(data);
        this.loadingNode.setVisible(false);
        if(data["status"] === 0)
        {
            var listdata = data["data"]["data"];

            for(var i = 0; i < listdata.length; i++)
            {
                var childObj = listdata[i];
                var thoigian = childObj["timestamp"];
                var sender = childObj["sender"];
                var title = childObj["title"];
                var content = childObj["content"];
                var id = childObj["id"];
                var isviewed = childObj["viewed"];
                this.addItemInbox(thoigian, sender, title, content, id, isviewed);
            }

        }
    },
    _removeMessages : function (cmd, data) {
        if(data["status"] === 0)
        {
            if(this._inboxdetailLyer.visible)
            {
                this._inboxdetailLyer.setVisible(false);
                this.nodelist.setVisible(true);
            }
            this.sendRequestInbox();
            MessageNode.getInstance().show("Xoá tin nhắn thành công !");
        }
    },

    deleteMessageID : function (id) {
        var request = {
            command : "remove_message",
            id : id
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    }
});

var InboxDetailLayer = cc.Node.extend({
    ctor : function (mSize) {
        this._super();
        this.setContentSize(mSize);

        this.idMes = "";
        var forebg = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg.setPreferredSize(cc.size(1054, 72));
        forebg.setPosition(cc.p(this.width/2, this.height - 53));
        this.addChild(forebg);


        var btn_back = new ccui.Button("home_ttcn_btn_back.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_back.setPosition(cc.p(39, forebg.height/2));
        forebg.addChild(btn_back);
        this.btn_back = btn_back;


        var lb_title = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, "");
        lb_title.setPosition(cc.p(forebg.width/2, forebg.height/2));
        lb_title.setColor(cc.color("#a59f9a"));
        forebg.addChild(lb_title);
        this.lb_title = lb_title;


        var btn_xoa = new ccui.Button("home_inbox_btndelete.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_xoa.setPosition(cc.p(980, forebg.height/2));
        forebg.addChild(btn_xoa);
        this.btn_xoa = btn_xoa;


        var forebg1 = new ccui.Scale9Sprite("home_napvang_bg_tygia1.png", cc.rect(20, 20, 4, 4));
        forebg1.setAnchorPoint(cc.p(0.5, 0));
        forebg1.setPreferredSize(cc.size(1054, 482));
        forebg1.setPosition(cc.p(this.width/2, 16));
        this.addChild(forebg1);


        var _magin = 37;

        var scrollView = new newui.TableView(cc.size(forebg1.width - _magin, forebg1.height - _magin - 20), 1);
        // scrollView.setContentSize(cc.size(forebg1.width - _magin, forebg1.height - _magin - 10));
        scrollView.setAnchorPoint(cc.p(0.0, 0.0));
        scrollView.setPosition(cc.p(_magin - 8, _magin));
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        this.addChild(scrollView);
        this.scrollView = scrollView;


    },

    setMessage : function (title, message, messageID) {
        this.setVisible(true);
        this.lb_title.setString(title.toUpperCase());

        this.sendServerMessIsRead(messageID);

        this.scrollView.removeAllItems();
        if(this.getChildByTag(10)) {
            this.removeChildByTag(10);
        }

        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24, message, cc.TEXT_ALIGNMENT_LEFT, this.scrollView.getContentSize().width - 50);
        messageLabel.setTag(10);
        var height = messageLabel.getContentSize().height + 20.0;

        if(height <= this.scrollView.getContentSize().height){
            this.scrollView.setEnabled(false);
            messageLabel.setAnchorPoint(cc.p(0.0, 1.0));
            messageLabel.setPosition(cc.p(60, 477));
            this.addChild(messageLabel);
        }
        else
        {
            this.scrollView.setEnabled(true);
            this.scrollHeight = height - this.scrollView.getContentSize().height;
            this.startAutoScroll(4.0);
            var container = new ccui.Widget();
            container.setContentSize(cc.size(this.scrollView.getContentSize().width - 10, height));
            container.addChild(messageLabel);
            messageLabel.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
            this.scrollView.pushItem(container);
        }
    },

    startAutoScroll : function (delayTime) {
        var thiz = this;
        this.scrollView.stopAllActions();
        this.scrollView.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            var duration =  thiz.scrollHeight / 40.0;
            thiz.scrollView.scrollToBottom(duration, false);
        })));
    },

    sendServerMessIsRead : function (id) {
        this.idMes = id;
        var request = {
            command : "view_message",
            id : id
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    }
});