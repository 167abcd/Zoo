/**
 * Created by VGA10 on 12/8/2016.
 * Rat la dep trai
 */
var TX_CUA_TAI = 1;
var TX_CUA_XIU = 2;

var ChanLeController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        // return;
        this.turnState = 0;
        this.holdingList = [0, 0, 0, 0, 0];
        this.gameGroup = "mini_taixiu";
        SocketClient.getInstance().addListener("1000", this.onJoinGame, this);
        SocketClient.getInstance().addListener("1009", this.onStateGame, this);
        SocketClient.getInstance().addListener("1002", this.onBetSucess, this);
        SocketClient.getInstance().addListener("1003", this.onOtherBet, this);
        SocketClient.getInstance().addListener("1007", this.onResuft, this);
        SocketClient.getInstance().addListener("1016", this.onResuftNew, this);
        SocketClient.getInstance().addListener("1006", this.onHistory, this);
        SocketClient.getInstance().addListener("chat", this.onChat, this);
        SocketClient.getInstance().addListener("1011", this.onSoiCau, this);
        SocketClient.getInstance().addListener("1013", this.onCanCuaMe, this);
        SocketClient.getInstance().addListener("1017", this.onCanCuaTotal, this);
        SocketClient.getInstance().addListener("1018", this.onUpdateDuDay, this);
        SocketClient.getInstance().addListener("err", this.onError, this);

    },
    onError: function (cmd, message) {
        // if(message["code"]==1001){
        if(message["g"] == this.gameGroup) {
            this._view.onError(message);
            // }
        }
    },
    onSFSExtension: function (messageType, content) {
        if (content.p.group != this.gameGroup ) {
            return;
        }
        this._super(messageType, content);
        var thiz = this;
        // cc.log(content);
        switch (content.c) {
            case "701":
                this.onBetSucess(content.p);
                break;
            case "708":
                this.onStateGame(content.p);
                break;
            case  "260":
                this.onJoinGame(content.p.data);
                break;
            case  "709":
                this.onOtherBet(content.p);
                break;
            case "711":
                this.onHistory(content.p);
                break;
            case "706":
                this.onResuft(content.p);
                break;
            case "713":
                this._view.gameIdLabel.setString("ID: "+ content.p[1]);
                break;
            case "705":
                this.onShowMoneyExchange(content.p);
                break;
            case "22" :
                this.onChangeAssets(content.p.data["1"],content.p.data["2"]);
                break;
        }
    },
    onShowMoneyExchange:function (param) {

        this._view.onChangeAssets("",(parseInt(param[1])>0)? parseInt(param[1]):0);
    },

    onCanCuaMe:function (cmd, message) {

        var idCua = message["data"]["2"][0]["1"];
        var moneyMe = message["data"]["2"][0]["2"];
        if( message["data"]["1"][0]["2"]!=0){
            this._view.addChatMessageInfo(2, message["data"]["1"][0]["2"]);
        }
        this._view.setMoneyBetMe(idCua, parseInt(moneyMe));
    },
    onUpdateDuDay:function (cmd, message) {



        this._view.onUpdateDuDay ( message["data"]["1"],  message["data"]["2"]) ;


    },

    onCanCuaTotal:function (cmd, message) {

        var idCua = message["data"]["1"];
        var moneyTotal = message["data"]["2"];
        var moneyTru = message["data"]["3"];


        // this._view.setMonetBetTotal(idCua, moneyTotal);
        //
        // this._view.createMoneyCanCuaFly (idCua, moneyTru) ;


    },
    onSoiCau:function (cmd, message) {
        var arr = message["data"]["1"];
        if(message["data"]["1"].length > 0){
            this._view.onSoiCau(arr, message["data"]["2"]);
        }

    },
    onJoinGame:function (cmd, message) {
        if(message["ch"] == this.gameGroup) {
            var param = message["data"]["1"];
            var state = param[3];
            var timeState = param[5];
            var timeRemain = param[2];

            this._view.gameIdLabel.setString("(#" + param[1].toString() + ")");

            var data = param[4];
            if (state == 5 || state == 4) {
                // MessageNode.getInstance().show("Bạn vui lòng đợi ván mới!");
                // return;
            }
            if (state == 5 && param["9"]) {
               this._view.drawHatReconnect(param["9"]);
            }
            this.handleStateGame(state, timeRemain, false);

            for (var i = 0; i < data.length; i++) {
                var idCua = data[i]["1"];
                var moneyTotal = data[i]["3"];
                var moneyMe = parseInt(data[i]["2"]);
                var total = parseInt(moneyTotal);
                var userCount = data[i]["4"];
                this._view.setNumerPersonBet(idCua,userCount);
                this._view.setMoneyBetMe(idCua, moneyMe);
                this._view.setMonetBetTotal(idCua, total);

            }

            //
            if( message["data"]["2"]){
                this._view.onHanldeDuDay( message["data"]["2"], message["data"]["3"], message["data"]["4"]);
            }
        }
    },




    onBetSucess:function (cmd, message) {
        cc.log("wtfffff");
        // this._view.txtTai.setText("");
        // this._view.txtXiu.setText("");
        // this._view.btnXoa.setVisible(false);
        var param = message["data"];
        var idCua = param[1];
        var userCount = param[4];
        // PlayerMe.gold = parseInt(param[3]);

        this._view.setMoneyBetMe(idCua, parseInt(param[2]));
        this._view.setMonetBetTotal(idCua, parseInt(param[3]));
        this._view.setNumerPersonBet(idCua,userCount);
        this._view.addChatMessageInfo(1, parseInt(param[2]), idCua);
        if(idCua==1){
            // this._view.addChatMessageInfo(1, parseInt(param[2])-this._view.betTaiSave, idCua);
            this._view.betTaiSave = param[2];
            cc.log("lon" +   this._view.betTaiSave  );
        }
        else{
            // this._view.addChatMessageInfo(1, parseInt(param[2])-this._view.betXiuSave, idCua);
            this._view.betXiuSave = param[2];
            cc.log("lon" +   this._view.betXiuSave  );
        }
        this._view.onBetSucess(idCua);


    },
    onOtherBet:function (cmd, message) {
        var data = message["data"][1];

        for(var i = 0; i < data.length; i++){
            var idCua = data[i]["1"];
            var moneyTotal = data[i]["3"];
            var moneyMe =   parseInt(data[i]["2"]);
            var total =  parseInt(moneyTotal);
            var userCount = data[i]["4"];

            this._view.setMonetBetTotal(idCua, total);
            this._view.setNumerPersonBet(idCua,userCount);

        }
    },
    onResuft:function (cmd, message) {
        var thiz = this;
        var param = message["data"];

        betTaiSaveLast =   this._view.betTaiSave;
        var typeCua = param[2];
        betXiuSaveLast =   this._view.betXiuSave;
        var itemXucXac = param[1];
        // var nameCua = (typeCua == TX_CUA_TAI )?"#mntx_effect_tai.png":"#mntx_effect_xiu.png";
        thiz._view._addResultSprite(itemXucXac,typeCua,false);


    },

    onResuftNew:function (cmd, message) {
        var thiz = this;
        var param = message["data"];
        if (param[5]){
             this._view.addChatMessageInfo(3, param[5]);
        }
        var typeCua = param[2];
        var itemXucXac = param[1];
        // var nameCua = (typeCua == TX_CUA_TAI )?"#mntx_effect_tai.png":"#mntx_effect_xiu.png";
        var dataItemTx  = {
            type : typeCua,
            idVan : param[3]
        };
        thiz._view._addResultSprite(itemXucXac,typeCua,true);
        if(this.arrHistory){
            if(this.arrHistory.length > 0){
                this.arrHistory.splice(0,0,dataItemTx);
            }

            var temp =  this.arrHistory;
            this.drawHistory(temp);


            this._view.onResuftSoiCau(itemXucXac,param[3]);
        }

    },

    onHistory:function (cmd, message) {
        var param = message["data"];
        var  thiz = this;
        var arr_his = param["2"];


        thiz.arrHistory = [];
        if(arr_his){
            var len = (arr_his.length>15)?15:arr_his.length;
            this._view.wgResuft.removeAllChildren();
            var z = 0;
            for(var i = 0; i < len;i++){
                (function () {
                    var iNew = i;
                    var dataItemTx  = {
                        type : arr_his[iNew][2],
                        idVan : arr_his[iNew][1]
                    };
                    thiz.arrHistory.push(dataItemTx);
                    thiz._view.pushItemHistory(len-iNew-1,dataItemTx,i==0,false);

                    z++;

                })();
            }
        }

    },

    drawHistory:function (arr_his) {
        var  thiz = this;
        thiz.arrHistory = [];
        if(arr_his){
            var len = (arr_his.length>15)?15:arr_his.length;
            this._view.wgResuft.removeAllChildren();
            var z = 0;
            for(var i = 0; i < len;i++){
                (function () {
                    var iNew = i;
                    var dataItemTx = arr_his[iNew];
                    thiz.arrHistory.push(dataItemTx);
                    thiz._view.pushItemHistory(len-iNew-1,dataItemTx,i==0,true);

                    z++;

                })();
            }
        }
    },

    onStateGame:function (cmd, message) {
        var param = message["data"];
        var state = param[1];
        var timeState = param[2];
        if(param[3]){
            this._view.gameIdLabel.setString("(#" + param[3].toString()+")");
        }
        this.handleStateGame(state,timeState,true);
    },
    handleStateGame:function (state, timeState,isEffect) {
        this._view.gameState = state;
        switch (state) {
            case 1:
                cc.log("===============chuan bi xoc lo");

                this._view.resetGame();
                this._view.batSprite.setVisible(false);
                cc.log("===============xoc lo");
                this._view.closeDisk(false);
                this._view.shakeDisk();
                break;
            case 3 :
            {
                cc.log("===============bat dau dat cuoc");
                // this._view.setActiveBt(this._view.btnTai,true);
                // this._view.setActiveBt(this._view.btnXiu,true);
                this._view.isCountDownSound = true;
                this._view.startTime(timeState);
                this._view.showEffectNumber();
                this._view.batSprite.setVisible(false);

            }
                break;
            case 4 :
                cc.log("===============thua thieu");
                this._view.isCountDownSound = false;
                this._view.lblCanCua.setVisible(true);
                // this._view.setActiveBt(this._view.btnTai,false);
                // this._view.setActiveBt(this._view.btnXiu,false);
                break;
            case 5 :
                cc.log("===============mo bat");
                // this._view.batSprite.setVisible(true);
                this._view.startTimeUnder(timeState);
                this._view.lblCanCua.setVisible(false);
                this._view.openDisk(isEffect);
                this._view.hiddenEffectNumber();
                break;
        }
    },


    sendJoinGame: function () {
        var request = {
            c: "game",
            g: "mini_taixiu",
            a:1000
        };
        SocketClient.getInstance().send(request);
    },

    onReconnect: function (param) {
        var data = param["data"]["10"];
        var gameId = data["1"];
        var status = data["2"];
        var bankString = data["3"];
        this._view.setBankValue(parseInt(bankString));


    },

    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: "mini_taixiu",
            a:9999
        };
        SocketClient.getInstance().send(request);
    },
    requestSoiCau: function () {
        var request = {
            c: "game",
            g: "mini_taixiu",
            a:1011
        };
        SocketClient.getInstance().send(request);
    },

    sendBetTaiXiu: function (idCua, money) {
        var request = {
            c: "game",
            p:{1:idCua,2:money},
            g: "mini_taixiu",
            a: 1002
        };
        SocketClient.getInstance().send(request);
    },

    sendMessageChat: function (gameid, message) {
        var request = {
            c: "chat",
            ch:s_gameName[gameid],
            ct: message
        };
        SocketClient.getInstance().send(request);
    },


    onChat : function (cmd, data) {
        this._view.addChatMessage(data["sender"], data["ct"]);
        // for(var i = 0; i < 50; i++)
        // {
        //     this._view.addChatMessage(data["sender"], data["ct"]);
        // }
    },


    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "259", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "257", null);
    },


});