/**
 * Created by ext on 3/21/2017.
 */

var s_activity_tab_name = s_activity_tab_name || [
    "ĐIỂM DANH",
    "TÍCH LŨY ĐN",
    "ONLINE NHẬN QUÀ",
    "NHIỆM VỤ",
    "SỰ KIỆN"
];

var ActivityCountNode = cc.Node.extend({
    ctor : function () {
        this._super();
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("updateLandmarkCompleted", this.refreshView, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },
    refreshView : function () {
        if(PlayerMe.missionCount <= 0){

        }
        else{

        }
    }
});

var ActivityTab = ToggleNodeItem.extend({
    ctor : function (title) {
        this._super(cc.size(191, 72));

        var tabSprite = new cc.Sprite("#home_shop_tab_select.png");
        tabSprite.setPosition(this.width/2, this.height/2);
        this.addChild(tabSprite);

        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_16, title);
        title.setPosition(this.width/2, this.height/2);
        this.addChild(title);

        this.tabSprite = tabSprite;
        this.title = title;
    },
    setStatus : function (status) {
        //this.statusLabel.setString(status);
    },
    select : function (isForce, ext) {
        this.tabSprite.visible = true;
        this.title.setColor(cc.color("#5b391a"));

        this._super(isForce, ext);
    },
    unSelect : function (isForce, ext) {
        this.tabSprite.visible = false;
        this.title.setColor(cc.color("#a59f9a"));

        this._super(isForce, ext);
    }
});

var ActivityDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(1081, 597));
        this.title.setString("HOẠT ĐỘNG");

        var bg_tab = new ccui.Scale9Sprite("home_shop_bg_tab.png", cc.rect(50, 0, 4, 72));
        bg_tab.setPreferredSize(cc.size(1035, 72));
        bg_tab.setPosition(cc.p(this.width/2, 544));
        this.addChild(bg_tab);

        var bg = new ccui.Scale9Sprite("misssion_bg_3.png", cc.rect(40,40,4,4));
        bg.setPreferredSize(cc.size(1048, 482));
        bg.setPosition(cc.p(540, 256));
        this.addChild(bg);

        this._initView();
    },

    _initView : function () {
        var allLayer = [
            new ActivityDiemDanhLayer(),
            new ActivityLoginLayer(),
            new ActivityOnlineLayer(),
            new ActivityQuestLayer(),
            new ActivityEventLayer()
        ];

        for(var i=0;i<allLayer.length;i++){
            this.addChild(allLayer[i]);
        }

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.allTab = [];
        var thiz = this;
        this.addChild(mToggle);
        for(var i = 0; i<s_activity_tab_name.length; i++){
            (function () {
                var mNode = allLayer[i];

                var tab = new ActivityTab(s_activity_tab_name[i]);
                thiz.allTab.push(tab);
                tab.setPosition(65 + 191 * (i + 0.5), 544);
                tab.onSelect = function (isForce) {
                    mNode.setVisible(true);
                };

                tab.onUnSelect = function () {
                    mNode.setVisible(false);
                };
                mToggle.addItem(tab);
            })();
        }
    },

    _onRecvActivityStatus : function (cmd, data) {
        var type = data["data"]["typeMission"];
        var info = data["data"]["shortInfo"];
        if(type == 0){
            this.allTab[0].setStatus(info);
        }
        else if(type == 2){
            this.allTab[1].setStatus(info);
        }
        else if(type == 3){
            this.allTab[2].setStatus(info);
        }
        else if(type == 1){
            this.allTab[3].setStatus(info);
        }
    },

    onEnter : function () {
        this._super();

        this.mToggle.selectItem(0);

        for(var i=0;i<this.allTab.length;i++){
            this.allTab[i].setStatus("");
        }

        SocketClient.getInstance().addListener("fetchUserMissionInfo", this._onRecvActivityStatus, this);
        SocketClient.getInstance().addListener("fetchUserMissionStatus", this._onRecvActivityStatus, this);

        SocketClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 0});
        SocketClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 2});
        SocketClient.getInstance().send({command : "fetchUserMissionStatus", typeMission : 3});
        SocketClient.getInstance().send({command : "fetchUserMissionStatus", typeMission : 1});
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});