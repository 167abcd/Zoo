/**
 * Created by anhvt on 12/5/2016.
 */
var CaoThapController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        /*
         Trang thai game
         0 = chua bat dau
         1 = con luot
         2 = het luot
         */
        this.turnState = 0;
        this.result = -1;
        this.rolling = false;
        this.timeRemaining = 0;
        this.isNohu = false;
        this.gameGroup = "mini_caothap";
    },

    initWithView : function (view) {
        this._super(view);

        SocketClient.getInstance().addListener("1101", this._onInitGame, this);
        SocketClient.getInstance().addListener("1102", this.onPredictResult, this);
        SocketClient.getInstance().addListener("1000", this.onJoinGame, this);
        SocketClient.getInstance().addListener("1103", this.onLuotMoi, this);
        SocketClient.getInstance().addListener("err", this.onError, this);
        SocketClient.getInstance().addListener("jackpot", this.onJacpot, this);
        SocketClient.getInstance().addListener("preJackpot", this.onPreJacpot, this);
        SocketClient.getInstance().addListener("uJackpot", this.onUpJacpot, this);

        // SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
    },
    onUpJacpot:function (cmd, message) {
        if(message["g"] == this.gameGroup &&  !this.isNohu){
            this._view.updateHuThuong();
        }
    },
    onPreJacpot: function (cmd, message) {
       if(message["ch"] == "mini_caothap"){
           this.isNohu = true;
       }

    },
    onJacpot: function (cmd, message) {
        this._view.saveDataJackpot( message["data"]["2"]);

    },
    _onUpdateAsset : function (cmd, data) {

    },
    _onInitGame : function (cmd, message) {
        this.isNohu = false;
        var thiz = this;

        setTimeout(function () {
            thiz._view.setGameId(message["data"]["15"]);
            thiz.onInitGame(message["data"]);
        },500);
    },

    _onFinishedGame : function (messageType, content) {
        var thiz = this;
        setTimeout(function () {
            thiz.onPredictResult(content.p.data);
        }, 1000);
    },

    // onSFSExtension: function (messageType, content) {
    //     if (content.p.group != this.gameGroup){
    //         return;
    //     }
    //     this._super(messageType, content);
    //     var thiz = this;
    //     // var interval = null;
    //     switch (content.c) {
    //         case "407": // nhan thong tin la dau tien
    //             setTimeout(function () {
    //                 thiz.onInitGame(content.p.data);
    //             }, 1000);
    //             break;
    //
    //         case "408": // nhan ket qua cao thap
    //             setTimeout(function () {
    //                 thiz.onPredictResult(content.p.data);
    //             }, 1000);
    //             break;
    //         case "22" :
    //             this.onChangeAssets(content.p.data["1"],content.p.data["2"]);
    //             break;
    //     }
    // },



    onError: function (cmd, message) {

        if(message["ch"] == "mini_caothap" ||message["code"] == 102 ){
            if(message["code"] == 102){

            }
            //het tien
            this._view.setRolling(false);
            this._view.clearTurn();
        }
    },



    processData: function (data) {
        var gameId = "15";// data["1"];
        var bankValue = data["4"];
        var highReward = data["2"];
        var lowReward = data["3"];

        this._view.setReward(lowReward, highReward);
        this._view.setGameId(gameId);
        this._view.setBankValue(bankValue);

    },


    onPredictResult: function (cmd, message) {
        if(!this._view){
            return;
        }
        var thiz = this;
        setTimeout(function () {
            thiz.handleDataNew(message["data"]["17"]);
        }, 500);

    },
    onJoinGame:function (cmd, message) {
        if(message["ch"] == this.gameGroup) {

            this.isNohu = false;
            var data = message["data"]["11"];

            if (data) {
                this._view.setGameId(data["15"]);
                if (data["5"])
                    for (var i = 0; i < data["5"].length; i++) {

                        this._view.pushKing((data["5"][i] % 13) == 11);
                        this._view.addHistory(data["5"][i]);
                    }


                this.onInitGame(data);
            }
        }
    },
    onLuotMoi:function (cmd, message) {
        this._view.setBettingSelectEnable(true);
        this._view.setLuotMoiBtEnable(false);
        // this._view.setBocBtEnable(true);
    },


    onInitGame: function (data) {
        if(!this._view){
            return;
        }

        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(true);

       this.handleDataNew(data["17"]);


    },

    handleDataNew:function (data) {
        var thiz =  this;
        var resultCard = data["1"];
        var bankValue = data["4"];
        var highReward = data["2"];
        var lowReward = data["3"];
        var idBetting = data["9"];
        this._view.onClickBetting(idBetting-1);
        this._view.setReward(lowReward, highReward);

        this._view.setBankValue(bankValue);
        this._view.showResultCard(resultCard);
        this._view.pushKing((resultCard % 13) == 11);
        this.result = resultCard;
        this.turnState = data["16"];

        switch ( this.turnState) {
            case 0: // win
                this._view.setBettingSelectEnable(false);
                this._view.setHighLowBtEnable(true);
                this._view.setBocBtEnable(false);
                this._view.setLuotMoiBtEnable(true);
                break;
            case 1:
                this._view.setBettingSelectEnable(false);
                this._view.setTipString("Bạn chọn sai, chúc bạn may mắn lần sau!");
                this._view.playSoundLost();
                this._view.setLuotMoiBtEnable(true);
                this._view.setBocBtEnable(false);
                this._view.setHighLowBtEnable(false);
                break;
            case 2: // bat dau
                this._view.setBettingSelectEnable(false);
                this._view.setBocBtEnable(false);
                this._view.setHighLowBtEnable(true);
                break;
            case 3: //luot moi
                this._view.setBocBtEnable(false);
                this._view.setLuotMoiBtEnable(true);
                break;
            case 4: //no hu
                this._view.setBettingSelectEnable(false);
                this._view.setHighLowBtEnable(false);
                this._view.setBocBtEnable(false);
                this._view.setLuotMoiBtEnable(true);
                break;
        }


        if(data["14"] == 2){
            this._view.setHighBtEnable(true);
            this._view.setLowBtEnable(true);
        }else if(data["14"] == 0){
            this._view.setHighBtEnable(true);
            this._view.setLowBtEnable(false);
        } else if(data["14"] == 1) {
            this._view.setHighBtEnable(false);
            this._view.setLowBtEnable(true);
        }
        else if(data["14"] == -1) {
            this._view.setHighBtEnable(false);
            this._view.setLowBtEnable(false);
        }
        if(this.turnState == 4){
            setTimeout(function () {
                thiz._view.showJackpot();
                thiz._view.updateHuThuong();
                thiz.isNohu = false;
                thiz._view.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_CaoThap, ARR_HUTHUONG_CAOTHAP_MONEY[thiz._view.indexBeting])));
                setTimeout(function () {
                    SocketClient.getInstance().postEvent("refreshAsset", {});
                }, 0.01);
            }, 200);


        }
    },

    sendInitGame: function (betType) {

        var request = {
            c: "game",
            g: "mini_caothap",
            p:{9:betType},
            a:1101
        };
        SocketClient.getInstance().send(request);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
    },

    sendHighPredict: function () {

        var request = {
            c: "game",
            g: "mini_caothap",
            p:{8:0},
            a:1102
        };
        SocketClient.getInstance().send(request);
        //this.setRolling(true);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
        this._view.addHistory(this.result);

    },

    sendChaet: function (idCh) {

        var request = {
            c: "game",
            g: "mini_caothap",
            p:{8:idCh},
            a:1106
        };
        SocketClient.getInstance().send(request);
        //this.setRolling(true);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
        this._view.addHistory(this.result);

    },

    sendLowPredict: function () {

        var request = {
            c: "game",
            g: "mini_caothap",
            p:{8:1},
            a:1102
        };
        SocketClient.getInstance().send(request);
        //this.setRolling(true);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
        this._view.addHistory(this.result);

    },

    getTurnState: function () {
        return this.turnState;
    },

    // setRolling: function (isRolling) {
    //     this.rolling = isRolling;
    //     this._view.setRolling(isRolling);
    // },

    sendLuotMoiRequest: function () {

        var request = {
            c: "game",
            g: "mini_caothap",
            a:1103
        };
        SocketClient.getInstance().send(request);
        this._view.setTipString("");

        // this.setRolling(false);
        this._view.clearTurn();
        this._view.pushClearKing(false);
    },

    sendJoinGame: function () {
        var request = {
            c: "game",
            g: "mini_caothap",
            a:1000
        };
        SocketClient.getInstance().send(request);
    },

    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: "mini_caothap",
            a:9999
        };
        SocketClient.getInstance().send(request);
    },

    sendGetTopRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "402", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "403", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "401", null);
    }
});