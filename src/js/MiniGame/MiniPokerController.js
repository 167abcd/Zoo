/**
 * Created by VGA10 on 12/6/2016.
 */
var MiniPokerController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.rolling = false;
        this.lastBetType = 1;
        this.gameGroup = "mini_poker";
        this.isNohu = false;
    },

    initWithView : function (view) {
        this._super(view);
        SocketClient.getInstance().addListener("1000", this.onJoinGame, this);
        SocketClient.getInstance().addListener("1051", this.onRollResult, this);
        SocketClient.getInstance().addListener("err", this.onError, this);
        SocketClient.getInstance().addListener("jackpot", this.onJacpot, this);
        SocketClient.getInstance().addListener("uJackpot", this.onUpJacpot, this);
        SocketClient.getInstance().addListener("preJackpot", this.onPreJacpot, this);

        // SocketClient.getInstance().addListener("1051", this.onRollResult, this);
    },
    onPreJacpot: function (cmd, message) {
        if(message["ch"] ==this.gameGroup){
            this.isNohu = true;
        }

    },
    onJacpot: function (cmd, message) {
        this._view.saveDataJackpot( message["data"]["2"]);

    },
    onError: function (cmd, message) {
        if(message["g"] == this.gameGroup || message["code"] == 102){
            //het tien
            // if(message["code"] == 102){
            //     MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
            // }
            // this._view.setRolling(false);
            // this._view.setQuayBtEnable(true);
            // this._view.setBettingSelectEnable(true);
            this._view.onError(cmd);
        }

    },

    onUpJacpot:function (cmd, message) {
        if(message["g"] == this.gameGroup &&  !this.isNohu){
            this._view.updateHuThuong();
        }
    },

    onJoinGame:function (cmd, message) {
        if(message["ch"] == this.gameGroup){
        this.isNohu = false;
        var param = message["data"];
        if(param[17]){
            this.onHandleDataMain(param[17],0);
        }
        }
    },
    onRollFinished : function (msg, content) {
        this.onRollResult(content.p.data);
    },

    onMiniGameStatus : function (msg, content) {
        var param = content["p"];
        var status = param["1"];
        if(status === 2){ //rolling
            this._view.setQuayBtEnable(false);
            this._view.rollCard();
        }
    },



    onChangeAssets: function (gold, changeAmount) {
        // changeAmount = changeAmount < 0 ? changeAmount : 0;
        // this._view.onChangeAssets(gold, changeAmount);
    },

    onRollResult: function (cmd, message) {
        var thiz = this;
        var param = message["data"];

      this.onHandleDataMain(param,this._view.timeDelay);


    },
    onHandleDataMain:function(param,timeDelay){
        var thiz = this;
        var gameId = param["3"];
        this._view.gameIdLabel.setString("(" + gameId +")");
        var cardArray = param["4"];
        var result = param["5"];
        var rewardIndexes = param["6"];
        var rewardCardRank = param["7"];
        var money = param["8"];

        var rewardIndexesArray = [];
        for (var i = 0; i < 5; i++){
            rewardIndexesArray[i] = (rewardIndexes >> i) & 1;
        }

        this._view.runAction(new cc.Sequence(new cc.DelayTime(timeDelay), new cc.CallFunc(function () {

            thiz._view.activateReward(result, rewardCardRank);
            thiz._view.setCardArray(cardArray);
            if (result ==  9999 && timeDelay>0) {
                thiz._view.showJackpot();
                thiz._view.updateHuThuong();
                thiz.isNohu = false;
            }
            thiz._view.setRewardCards(rewardIndexesArray);
            setTimeout(function () {
                SocketClient.getInstance().postEvent("refreshAsset", {});
            }, 0.01);
        })));

    },
    sendJoinGame: function () {
        var request = {
            c: "game",
            g: "mini_poker",
            a:1000
        };
        SocketClient.getInstance().send(request);
    },

    sendRollRequest: function (betType) {

        var request = {
            c: "game",
            g: "mini_poker",
            p:{1:betType},

            a:1051
        };
        SocketClient.getInstance().send(request);
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        this._view.setFlashing(isRolling);
        this._view.setRolling(isRolling);
        if (isRolling) {
            this._view.setRewardCards([0, 0, 0, 0, 0]);
            for (var i = 0; i < 5; i++)
                this._view.setRollCard(i, true);
        }
    },

    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: "mini_poker",
            a:9999
        };
        SocketClient.getInstance().send(request);
    },

    sendGetTopRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "353", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "354", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "352", null);
    }
});