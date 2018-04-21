
var HomeChatLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#home_lobby_bg_1.png");
        bg.setPosition(453, 403);
        this.addChild(bg);

        var top = 570;
        var bottom = 200;
        var left = 160;
        var right =420;

        var listMessage = new newui.TableView(cc.size(right -  left, top - bottom), 1);
        listMessage.setPosition(left, bottom);
        listMessage.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listMessage.setPadding(20);
        listMessage.setBounceEnabled(true);
        listMessage.setScrollBarEnabled(false);
        this.addChild(listMessage);
        this.listMessage = listMessage;
    },

    onEnter: function () {
        this._super();
        SocketClient.getInstance().addHTTPListener("get_activities", this.onRecvActivityData, this);
        this.requestGetActivity();

        //this.addMessage("<font color='#ffcb2c'>[DepTrai]</font><font color='#ffffff'> vừa đổi thưởng</font>");
    },

    onExit: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    checkVisible: function () {
        var node = this;
        while(node){
            if(node.isVisible() === false){
                return false;
            }
            node = node.getParent();
        }
        return true;
    },

    setVisible: function (visible) {
        this._super(visible);
        if(visible){
            this.listMessage.jumpToBottom();
            this.requestGetActivity();
        }
    },

    requestGetActivity: function () {
        var request = {
            command : "get_activities"
        };
        SocketClient.getInstance().sendHttpGetRequest(request);
    },

    onRecvActivityData: function (cmd, data) {
        var arr = data["data"];
        if(arr && arr.length > 0){
            this._activityData = arr;
            this.onPushActivity();
        }
        else{
            var thiz = this;
            this.stopAllActions();
            this.runAction(new cc.Sequence(
                new cc.DelayTime(5),
                new cc.CallFunc(function () {
                    thiz.requestGetActivity();
                })
            ));
        }
    },

    onPushActivity: function () {
        if(this._activityData.length > 0){
            var thiz = this;
            this.addMessage(this._activityData[0]);
            this._activityData.splice(0, 1);
            this.stopAllActions();

            if(this.checkVisible()) {
                this.runAction(new cc.Sequence(
                    new cc.DelayTime(1.5),
                    new cc.CallFunc(function () {
                        thiz.onPushActivity();
                    })
                ));
            }
            else{
                this.onPushActivity();
            }
        }
        else{
            if(this.checkVisible()) {
                this.requestGetActivity();
            }
        }
    },

    addMessage : function (message) {
        if(this.listMessage.size() > 20){
            this.listMessage.removeItem(0);
        }
        var textStr = "<font face='" + cc.res.font.Roboto_Regular+ "' size='18'>" + message + "</font>";
        var messageLabel = new ccui.RichText();
        messageLabel.ignoreContentAdaptWithSize(false);
        messageLabel.setLineBreakOnSpace(true);
        messageLabel.setContentSize(cc.size(280, 0));
        messageLabel.initWithXML(textStr, {});
        messageLabel.formatText();

        var listMessage = this.listMessage;

        listMessage.stopAutoScroll();
        listMessage.pushItem(messageLabel);

        var checkOutRangeFunc = function () {
            if(listMessage.size() > 20){
                listMessage.removeItem(0);
                listMessage.forceRefreshView();
            }
        };

        if(this.checkVisible()){
            listMessage.forceRefreshView();
            listMessage.scrollToBottom(0.5, true);
            listMessage.runAction(new cc.Sequence(
                new cc.DelayTime(0.6),
                new cc.CallFunc(checkOutRangeFunc)
            ));
        }
        else{
            checkOutRangeFunc();
            listMessage.jumpToBottom();
        }
    }
});