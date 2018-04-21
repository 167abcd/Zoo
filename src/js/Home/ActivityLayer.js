/**
 * Created by ext on 3/21/2017.
 */

var _activity_request_reward = function (itemId) {
    var request = {
        command : "getBonusMission",
        landmarkId : itemId
    };
    SocketClient.getInstance().send(request);
};

var ActivityDiemDanhLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        var content = new cc.Sprite("#mission_content_1.png");
        content.setAnchorPoint(cc.p(0,0));
        content.setPosition(cc.p(0, 0));
        mNode.addChild(content);

        var listItem = new newui.TableView(cc.size(709, 250), 1);
        listItem.setPosition(cc.p(194, 22));
        listItem.setMargin(6,10,0,0);
        listItem.setPadding(4);
        mNode.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20; i++){
        //     if(i%3 === 0){
        //         this.addItem("date", "reward1", 0);
        //     }
        //     else if(i%3 === 1){
        //         this.addItem("date", "reward2", 1);
        //     }
        //     else{
        //         this.addItem("date", "reward3", "chua hoan thanh");
        //     }
        // }
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("fetchAttendanceLandmark", this._onRecvData, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            SocketClient.getInstance().send({command : "fetchAttendanceLandmark"});
        }
    },

    _onRecvData : function (cmd, data) {
        var items = data["data"]["landmarks"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    addItem : function(date, reward, status, itemId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 50));
        this.listItem.pushItem(container);

        var bg = new ccui.Scale9Sprite("mission_bg_1.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(container.getContentSize());
        bg.setAnchorPoint(cc.p(0,0));
        container.addChild(bg);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, date);
        dateLabel.setColor(cc.color("#ffffff"));
        dateLabel.setPosition(52, container.height/2);
        container.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, reward);
        rewardLabel.setColor(cc.color("#ffffff"));
        rewardLabel.setPosition(289, dateLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, "Đã nhận");
            statusLabel.setColor(cc.color("#3ab918"));
            statusLabel.setPosition(622, dateLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("mission_activeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setPosition(622, container.height/2);
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;

                    dateLabel.setColor(cc.color("#ffffff"));
                    rewardLabel.setColor(cc.color("#ffffff"));
                    _activity_request_reward(itemId);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#987876"));
            statusLabel.setPosition(622, dateLabel.y);
            container.addChild(statusLabel);

            dateLabel.setColor(cc.color("#987876"));
            rewardLabel.setColor(cc.color("#987876"));
        }
    }
});

var ActivityLoginLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        SocketClient.getInstance().addListener("fetchLoginAccumulationLandmark", this._onRecvData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        var content = new cc.Sprite("#mission_content_2.png");
        content.setAnchorPoint(cc.p(0,0));
        content.setPosition(cc.p(0, 0));
        mNode.addChild(content);

        var listItem = new newui.TableView(cc.size(709, 220), 1);
        listItem.setPosition(cc.p(194, 22));
        listItem.setMargin(6,10,0,0);
        listItem.setPadding(4);
        mNode.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20; i++){
        //     if(i%3 === 0){
        //         this.addItem("date", "reward1", 0);
        //     }
        //     else if(i%3 === 1){
        //         this.addItem("date", "reward2", 1);
        //     }
        //     else{
        //         this.addItem("date", "reward3", "chua hoan thanh");
        //     }
        // }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            SocketClient.getInstance().send({command : "fetchLoginAccumulationLandmark"});
        }
    },

    _onRecvData : function (cmd, data) {
        var items = data["data"]["landmarks"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    addItem : function(date, reward, status, itemId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 50));
        this.listItem.pushItem(container);

        var bg = new ccui.Scale9Sprite("mission_bg_1.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(container.getContentSize());
        bg.setAnchorPoint(cc.p(0,0));
        container.addChild(bg);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, date);
        dateLabel.setAnchorPoint(cc.p(0.0, 0.5));
        dateLabel.setColor(cc.color("#ffffff"));
        dateLabel.setPosition(20, container.height/2);
        container.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, reward);
        rewardLabel.setColor(cc.color("#ffffff"));
        rewardLabel.setAnchorPoint(cc.p(1.0, 0.5));
        rewardLabel.setPosition(485, dateLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, "Đã nhận");
            statusLabel.setColor(cc.color("#3ab918"));
            statusLabel.setPosition(637, dateLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("mission_activeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setPosition(637, container.height/2);
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;

                    dateLabel.setColor(cc.color("#ffffff"));
                    rewardLabel.setColor(cc.color("#ffffff"));
                    _activity_request_reward(itemId);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#987876"));
            statusLabel.setPosition(622, dateLabel.y);
            container.addChild(statusLabel);

            dateLabel.setColor(cc.color("#987876"));
            rewardLabel.setColor(cc.color("#987876"));
        }
    }
});

var ActivityOnlineLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        SocketClient.getInstance().addListener("fetchPlayingBonusMilestone", this._onRecvData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        var content = new cc.Sprite("#mission_content_3.png");
        content.setAnchorPoint(cc.p(0,0));
        content.setPosition(cc.p(0, 0));
        mNode.addChild(content);


        var listItem = new newui.TableView(cc.size(709, 220), 1);
        listItem.setPosition(cc.p(194, 22));
        listItem.setMargin(6,10,0,0);
        listItem.setPadding(4);
        mNode.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20; i++){
        //     if(i%3 === 0){
        //         this.addItem("date", "reward1", 0);
        //     }
        //     else if(i%3 === 1){
        //         this.addItem("date", "reward2", 1);
        //     }
        //     else{
        //         this.addItem("date", "reward3", "chua hoan thanh");
        //     }
        // }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            SocketClient.getInstance().send({command : "fetchPlayingBonusMilestone"});
        }
    },

    _onRecvData : function (cmd, data) {
        var items = data["data"]["milestones"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    addItem : function(time, reward, status, itemId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width - 32, 50));
        this.listItem.pushItem(container);

        var bg = new ccui.Scale9Sprite("mission_bg_1.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(container.getContentSize());
        bg.setAnchorPoint(cc.p(0,0));
        container.addChild(bg);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, time);
        dateLabel.setAnchorPoint(cc.p(0.0, 0.5));
        dateLabel.setColor(cc.color("#ffffff"));
        dateLabel.setPosition(20, container.height/2);
        container.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, reward);
        rewardLabel.setColor(cc.color("#ffffff"));
        rewardLabel.setAnchorPoint(cc.p(1.0, 0.5));
        rewardLabel.setPosition(444, dateLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, "Đã nhận");
            statusLabel.setColor(cc.color("#3ab918"));
            statusLabel.setPosition(600, dateLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("mission_activeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setPosition(statusLabel.getPosition());
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;

                    dateLabel.setColor(cc.color("#ffffff"));
                    rewardLabel.setColor(cc.color("#ffffff"));
                    _activity_request_reward(itemId);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#987876"));
            statusLabel.setPosition(600, dateLabel.y);
            container.addChild(statusLabel);

            dateLabel.setColor(cc.color("#987876"));
            rewardLabel.setColor(cc.color("#987876"));
        }
    }
});

var ActivityQuestTab = ccui.Widget.extend({
    ctor : function (tabName) {
        this._super();

        var tabBg1 = new cc.Sprite("#mission_tab_3.png");
        this.setContentSize(tabBg1.getContentSize());
        tabBg1.setPosition(this.width/2, this.height/2);
        this.addChild(tabBg1);

        var tabBg2 = new cc.Sprite("#mission_tab_4.png");
        tabBg2.setPosition(tabBg1.getPosition());
        this.addChild(tabBg2);

        var nameLabel1 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tabName);
        nameLabel1.setColor(cc.color("#ffffff"));
        nameLabel1.setPosition(tabBg1.getPosition());
        this.addChild(nameLabel1, 1);

        var nameLabel2 = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, tabName);
        nameLabel2.setColor(cc.color("#5b391a"));
        nameLabel2.setPosition(tabBg1.getPosition());
        this.addChild(nameLabel2, 1);

        this.nameLabel1 = nameLabel1;
        this.tabBg1 = tabBg1;

        this.nameLabel2 = nameLabel2;
        this.tabBg2 = tabBg2;
    },

    select : function (selected) {
        if(selected){
           this.nameLabel1.visible = false;
           this.tabBg1.visible = false;

            this.nameLabel2.visible = true;
            this.tabBg2.visible = true;

            this.setTouchEnabled(false);
        }
        else{
            this.nameLabel1.visible = true;
            this.tabBg1.visible = true;

            this.nameLabel2.visible = false;
            this.tabBg2.visible = false;

            this.setTouchEnabled(true);
        }
    }
});

var ActivityQuestLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        SocketClient.getInstance().addListener("fetchQuestGroup", this._onRecvGroupData, this);
        SocketClient.getInstance().addListener("fetchMilestones", this._onRecvItemData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        this.itemNode = new cc.Node();
        mNode.addChild(this.itemNode);

        var bg = new cc.Sprite("#misssion_bg_2.png");
        bg.setAnchorPoint(cc.p(0,0));
        mNode.addChild(bg);

        var content = new cc.Sprite("#mission_content_4.png");
        content.setAnchorPoint(cc.p(0,0));
        content.setPosition(cc.p(0, 0));
        mNode.addChild(content);

        var listItem = new newui.TableView(cc.size(709, 417), 1);
        listItem.setPosition(cc.p(278, 22));
        listItem.setMargin(6,10,0,0);
        listItem.setPadding(13);
        this.itemNode.addChild(listItem);
        this.listItem = listItem;

        var groupList = new newui.TableView(cc.size(208, 458), 1);
        groupList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        groupList.setPosition(cc.p(33, 22));
        groupList.setMargin(0,0,27,27);
        groupList.setPadding(10);
        mNode.addChild(groupList);
        this.groupList = groupList;

        // for(var i=0;i<20; i++){
        //     this.addItem("name \nname\nname", "reward", 1);
        // }
        //
        // for(var i=0;i<20;i++){
        //     this.addGroup("ĐẸP TRAI", null);
        // }
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            SocketClient.getInstance().send({command : "fetchQuestGroup"});
        }
    },

    _onRecvGroupData : function (cmd, data) {
        this.groupItem = null;

        var items = data["data"]["userMissions"];
        if(items.length > 0){
            this.listItem.removeAllItems();
            this.groupList.removeAllItems();

            this.mNode.visible = true;
            this.itemNode.visible = false;
            for(var i=0;i<items.length;i++){
                var name = items[i]["name"];
                var groupId = items[i]["id"];
                this.addGroup(name, groupId);
            }
        }
    },

    _onRecvItemData : function (cmd, data) {
        var items = data["data"]["milestones"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.itemNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    _selectGroup : function (groupItem, groupId) {
        if(this.groupItem){
            this.groupItem.select(false);
            this.groupItem = null;
        }
        groupItem.select(true);
        this.groupItem = groupItem;

        if(groupId){
            var request = {
                command : "fetchMilestones",
                name : groupId
            };
            SocketClient.getInstance().send(request);
            this.itemNode.visible = false;
        }
    },

    addGroup : function (name, groupId) {
        var thiz = this;

        var groupItem = new ActivityQuestTab(name);
        this.groupList.pushItem(groupItem);
        groupItem.select(false);
        groupItem.addClickEventListener(function () {
            thiz._selectGroup(groupItem, groupId);
        });

        if(this.groupList.size() == 1){
            this.groupItem = null;
            thiz._selectGroup(groupItem, groupId);
        }
    },

    addItem : function(name, reward, status, itemId){
        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, name, cc.TEXT_ALIGNMENT_CENTER, 0);
        var containerHeight = dateLabel.height;
        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, reward);
        if(rewardLabel.height > containerHeight){
            containerHeight = rewardLabel.height;
        }

        if(containerHeight < 60){
            containerHeight = 60;
        }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, containerHeight + 11));
        this.listItem.pushItem(container);

        var bg = new ccui.Scale9Sprite("mission_bg_1.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(container.getContentSize());
        bg.setAnchorPoint(cc.p(0,0));
        container.addChild(bg);

        dateLabel.setColor(cc.color("#ffffff"));
        dateLabel.setAnchorPoint(cc.p(0.0, 0.5));
        dateLabel.setPosition(13, container.height/2);
        container.addChild(dateLabel);

        rewardLabel.setColor(cc.color("#ffffff"));
        rewardLabel.setPosition(404, dateLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Regular_20, "Đã nhận");
            statusLabel.setColor(cc.color("#3ab918"));
            statusLabel.setPosition(625, dateLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("mission_activeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setPosition(statusLabel.getPosition());
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;

                    dateLabel.setColor(cc.color("#ffffff"));
                    rewardLabel.setColor(cc.color("#ffffff"));
                    _activity_request_reward(itemId);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#987876"));
            statusLabel.setPosition(625, dateLabel.y);
            container.addChild(statusLabel);

            dateLabel.setColor(cc.color("#987876"));
            rewardLabel.setColor(cc.color("#987876"));
        }
    }
});

var ActivityEventPage = ccui.Widget.extend({
    ctor: function () {
        this._super();
    },

    _initWithTexture : function (tex) {
        var newSprite = new cc.Sprite(tex);
        newSprite.setPosition(this.width/2, this.height/2);
        this.addChild(newSprite);

        var scaleX = this.width / newSprite.width;
        var scaleY = this.height / newSprite.height;
        var scale = scaleX < scaleY ? scaleX : scaleY;
        if(scale < 1){
            newSprite.setScale(scale);
        }
    },

    loadFromUrl : function (url) {
        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            if(tex){
                thiz._initWithTexture(tex);
                thiz.onLoadSuccess();
            }
        }, false);
    },

    onLoadSuccess : function () {
        cc.log("onLoadSuccess");
    }
});

var ActivityEventLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var itemNode = new cc.Node();
        this.addChild(itemNode);
        this.itemNode = itemNode;

        var eventLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Black_25, "Sự kiện đang diễn ra");
        eventLabel.setColor(cc.color("#f5d17d"));
        eventLabel.setAnchorPoint(cc.p(0.0, 0.5));
        eventLabel.setPosition(cc.p(290, 504));
        itemNode.addChild(eventLabel);

        var listItem = new ccui.PageView();
        listItem.setContentSize(cc.size(735, 435));
        listItem.setPosition(cc.p(292, 44));
        itemNode.addChild(listItem);
        this.listItem = listItem;

        var detailNode = new cc.Node();
        this.addChild(detailNode);
        this.detailNode = detailNode;

        var backBt = new ccui.Button("mission_backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(310, 499);
        detailNode.addChild(backBt);
        backBt.addClickEventListener(function () {
            thiz.detailBackButtonHandler();
        });

        var detailLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Black_25, "detailLabel");
        detailLabel.setColor(cc.color("#f5d17d"));
        detailLabel.setAnchorPoint(cc.p(0.0, 0.5));
        detailLabel.setPosition(cc.p(335, 499));
        detailNode.addChild(detailLabel);
        this.detailLabel = detailLabel;
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("fetchEvents", this._onFetchEvents, this);
        SocketClient.getInstance().addListener("fetchContentEvent", this._onFetchContentEvent, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.itemNode.setVisible(false);
            this.detailNode.setVisible(false);

            //request
            SocketClient.getInstance().send({command : "fetchEvents"});

            //test
            // this.itemNode.setVisible(true);
            // for(var i=0;i<4;i++){
            //     this.addEventItem("event name", "eventId", "http://gameslot.test/src/res/Texture/Larva/bg_choiMan.jpg");
            // }

            // this.detailNode.setVisible(true);
            // this._showWebView("http://macao68.tk/sukien.html");
        }
        else{
            if(this.detailContent){
                this.detailContent.removeFromParent(true);
                this.detailContent = null;
            }
        }
    },

    _onFetchEvents : function (cmd, data) {
        var events = data["data"];
        if(events){
            this.itemNode.setVisible(true);
            this.listItem.removeAllItems();

            for(var i=0;i<events.length; i++){
                this.addEventItem(events[i]["name"], events[i]["id"]);
            }
        }
    },

    _onFetchContentEvent : function (cmd, event) {
        var data = event["data"];
        if(this.currentEventId === data["id"]){
            this._showWebView(data["content"]);
        }
    },

    _showWebView : function (html) {
        if(this.detailContent){
            this.detailContent.removeFromParent(true);
            this.detailContent = null;
        }

        var detailContent = new ccui.WebView();
        detailContent.setContentSize(735, 420);
        detailContent.setAnchorPoint(cc.p(0,0));
        detailContent.setPosition(292, 44);
        detailContent.setScalesPageToFit(false);
        this.detailNode.addChild(detailContent);

        if(html.startsWith("http")){
            detailContent.loadURL(html)
        }else{
            detailContent.loadHTMLString(html);
        }

        this.detailContent = detailContent;
    },

    addEventItem : function(eventName, eventId, imgUrl){
        var container = new ActivityEventPage();
        container.setContentSize(this.listItem.getContentSize());
        container.loadFromUrl(imgUrl);
        this.listItem.addPage(container);

        var thiz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            thiz.sendRequestFetchEventDetail(eventName, eventId);
        });
        return container;
    },

    sendRequestFetchEventDetail : function (eventName, eventId) {
        if(this.detailContent){
            this.detailContent.removeFromParent(true);
            this.detailContent = null;
        }
        this.detailLabel.setString(eventName);
        this.detailNode.setVisible(true);
        this.itemNode.setVisible(false);

        this.currentEventId = eventId;
        var request = {
            command : "fetchContentEvent",
            //product : "vbv",
            product : "c567",
            id : eventId
        };

        SocketClient.getInstance().send(request);
    },

    detailBackButtonHandler : function () {
        this.detailNode.setVisible(false);
        this.itemNode.setVisible(true);
        if(this.detailContent){
            this.detailContent.removeFromParent(true);
            this.detailContent = null;
        }
    }
});