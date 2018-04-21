/**
 * Created by anhvt on 12/5/2016.
 */


// s_sfs_error_msg[10] = "Không đủ tiền để quay";
//  s_sfs_error_msg[1002] = "Bình tĩnh em ơi!";
// s_sfs_error_msg[1003] = "Lựa chọn không hợp lệ";
// s_sfs_error_msg[1004] = "Phải chọn ít nhất 1 line";
// s_sfs_error_msg[1005] = "Chưa chọn mức cược";
var LarvaController = cc.Class.extend({
    ctor: function (view) {
        this.isNohu = false;
        this.initWithView(view);
    },

    initWithView: function (view) {
        this._view = view;
        this.gameGroup = "slot_25";

        SocketClient.getInstance().addListener("1551", this.onResuftRotate, this);
        SocketClient.getInstance().addListener("1552", this.onResuftRotate, this);
        SocketClient.getInstance().addListener("1553", this.onDuplicate, this);

        SocketClient.getInstance().addListener("ua", this._onUpdateAsset, this);
        SocketClient.getInstance().addListener("err", this.onError, this);
        SocketClient.getInstance().addListener("jackpot", this.onJacpot, this);
        SocketClient.getInstance().addListener("1000", this.onJoinGame, this);
        SocketClient.getInstance().addListener("uJackpot", this.onUpJacpot, this);
        SocketClient.getInstance().addListener("preJackpot", this.onPreJacpot, this);
        SocketClient.getInstance().addHTTPListener("get_history_for_user", this.getHisChoiXlot,this);
        SocketClient.getInstance().addHTTPListener("get_vinh_danh", this.getVinhDanhGame,this);
        SocketClient.getInstance().addHTTPListener("get_no_hu", this.getNoHuGame,this);

    },
    onPreJacpot: function (cmd, message) {
        if(message["ch"] == this.gameGroup){
            this.isNohu = true;
        }

    },
    onUpJacpot:function (cmd, message) {
        if(message["g"] == this.gameGroup &&  !this.isNohu){
            this._view.updateHuThuong();
        }
    },
    onJacpot: function (cmd, message) {
        this._view.saveDataJackpot( message["data"]["2"]);

    },

    onError: function (cmd, message) {
        // if(message["code"]==1001){
        if(message["g"] == this.gameGroup) {
            this._view.onError(message);
            // }
        }
    },
    _onUpdateAsset : function (cmd, data) {
        if(data["r"] >=0){
            this._view.updateInfor();
        }
    },
    releaseController: function () {
        this._view = null;

        SocketClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },

    getVinhDanhGame : function (cmd, data) {
        cc.log(data);

        if(data["status"] === 0)
        {
            this._view.listVinhDanh.removeAllItems();
            var mlist = data["data"];
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this._view.addBangVinhDanh(mdata["date"], mdata["nickname"], cc.Global.NumberFormat1(mdata["bet"]),cc.Global.NumberFormat1(mdata["totalBet"]), cc.Global.NumberFormat1(mdata["winMoney"]), mdata["desc"]);
            }
        }
    },

    getNoHuGame : function (cmd, data) {
        cc.log(data);

        if(data["status"] === 0)
        {
            this._view.listNH.removeAllItems();
            var mlist = data["data"];
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this._view.addBangNoHu(mdata["date"], mdata["nickname"], cc.Global.NumberFormat1(mdata["bet"]),cc.Global.NumberFormat1(mdata["totalBet"]), cc.Global.NumberFormat1(mdata["winMoney"]), mdata["desc"]);
            }
        }
    },
    getHisChoiXlot : function (cmd, data) {
        cc.log(data);

        if(data["status"] === 0)
        {
            var mlist = data["data"];
            this._view.listLichsu.removeAllItems();
            for(var i = 0; i < mlist.length; i++)
            {
                var mdata = mlist[i];
                this._view.addLsuChoiXlot(mdata["gameId"], mdata["date"], cc.Global.NumberFormat1(mdata["totalBet"]), mdata["winMoney"], mdata["desc"]);
            }
        }
    },


        _onPerformChangeRewardFund : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }

        this._view.performChangeRewardFund(content.p.data["1"]);
    },

    onJoinGame : function(cmd, message){
        if (message["ch"] != this.gameGroup){
            return;
        }
        var thiz = this;
        if( message["data"]["1"] > 0){
            this._view.setFreeSpin(message["data"]["1"]);


        };
        if( message["data"]["4"] ){
            this._view.setFreeSpinVQ(message["data"]["4"]);
        };


        setTimeout(function () {
        if(message["data"]["2"]){

                thiz._view.selectLine.selectLineWhenJoin(message["data"]["2"]);


        }
        if(message["data"]["3"]){
            thiz._view.handleResuftZ(true,message["data"]["3"]);
        }
        }, 0.1);
    },
    _onFreeSpin:function (messageType, content) {
        this.onFreeSpin(content.p["data"]);
    },

    _onReconnect : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }
        this._view.initHuThuong(content.p.data["pbs"]);
        this.onReconnect(content.p["data"]);
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
            LoadingDialog.getInstance().hide();
        })));
    },
    _onNhanThuong:function (messageType, content) {
        this._view.onNhanThuong();
    },
    _onNohu:function (messageType, content) {

        this._view.showJackpot ();
    },
    _onLucky:function (messageType, content) {

        this.onLucky(content.p["data"]);
    },

    _onBonus:function (messageType, content) {

        this.onBonus(content.p["data"]);
    },

    _onExitGame:function (messageType, content) {
        this._view.exitToGame();
    },
    _onResuftRotate:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftRotate(content.p["data"]);
    },
    _onResuftTry:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftTry(content.p["data"]);
    },

    onDuplicate:function (cmd, message) {
        var param = message["data"];
        this._view.onDuplicate(param);
    },
    onResuftRotate:function (cmd, message) {

        var param = message["data"];
        // this._view.lblID.setString("ID: "+ param[1]);
        this._view.handleResuftZ(false,param);
    },
    onResuftTry:function (param) {
        this._view.lblID.setString("ID: "+ param[1]);

        this._view.handleResuftZ(false,param);
    },

    onFreeSpin:function (param) {

        this._view.onFreeSpin(param);
    },
    onReconnect: function (param) {
        var arrItem = param["10"]["2"];
        var arrLine = param["10"]["3"]["1"];
        this._view.lblID.setString("ID: "+  param["10"]["1"]);
       // this._view.handleResuft(true,arrItem,arrLine,param["10"]["4"],param["10"]["5"]);

        var arrLineSelect = param["10"]["8"];
        this._view.showNumLineReconnect(arrLineSelect,param["10"]["7"]-1);
        this._view.handleResuftZ(true,param["10"]);
    },
    onBonus:function (param) {
        this._view.onBonus(param[1],param[2],param[3]);
    },
    onLucky:function (param) {
        if(param[3])
        {
            this._view.openAllLucky(param[3],param[4]);
        }
        else {
            this._view.openOneLucky(param[2],param[1]);
        }

    },

    onChangeAssets: function (gold, changeAmount) {
        if (changeAmount < 0) {
            return;
        }
        this._view.onChangeAssets(gold, changeAmount);
    },

    onGetLastSessionInfo: function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if (info && info.ip && info.port) {
            var serverInfo = SocketClient.getInstance().createServerInfo(info);
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            SmartfoxClient.getInstance().connect(serverInfo);
            return;
        }
        else {
            //LoadingDialog.getInstance().hide();
        }
        this._view.exitToGame();
    },

    requestQuitRoom: function () {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:9999
        };
        SocketClient.getInstance().send(request);
    },

    sendJoinGame: function (idMucCuoc) {
        var request = {
            c: "game",
            g: this.gameGroup,
            a:1000,
            p:{1:idMucCuoc}
        };
        SocketClient.getInstance().send(request);
    },
    sendRouteRequest:function (indexBet,lineBets) {

        this.isNohu = false;
        var request = {
            c: "game",
            g: this.gameGroup,
            p:{1:indexBet+1, 2:lineBets}, // 111 bonuss 222 free 00000//no hu
            a:1551
        };
        SocketClient.getInstance().send(request);

        // SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet});//,3:1  7 bonus -1 no hu 8 la free
    },

    getBXHVinhDanhGame : function (gameID) {
        if(!SocketClient.getInstance().isLoggin()){
            return;
        }
        // this.mList.removeAllItems();
        var request = {
            command : "get_vinh_danh",
            game: s_gameName[gameID]
        };

        SocketClient.getInstance().sendHttpGetRequest(request);
    },
    getNoHuList : function (gameID) {
        if(!SocketClient.getInstance().isLoggin()){
            return;
        }
        // this.mList.removeAllItems();
        var request = {
            command : "get_no_hu",
            game: s_gameName[gameID]
        };

        SocketClient.getInstance().sendHttpGetRequest(request);
    },
    getLichSuGame : function (gameID) {
        // this.mList.removeAllItems();
        if(!SocketClient.getInstance().isLoggin()){
            return;
        }
        var request = {
            command : "get_history_for_user",
            game: s_gameName[gameID]
        };

        SocketClient.getInstance().sendHttpGetRequest(request);


    },

    sendRouteRequest3:function (lineBets,indexBet,line1,line2,line3) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet,4:line1,5:line2,6:line3});//,3:1  7 bonus -1 no hu 8 la free
    },
    sendRouteRequestCh:function (lineBets,indexBet,id) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet,3:id});//,3:1  7 bonus -1 no hu 8 la free
    },
    sendRouteRequestTry:function (indexBet,lineBets,id,numberFree) {
        cc.log("id gui " + id);
        var request = {
            c: "game",
            g: this.gameGroup,
            p:{1:indexBet+1, 2:lineBets,3:id, 4:numberFree}, // 111 bonuss 222 free 00000//no hu
            a:1552
        };
        SocketClient.getInstance().send(request);

         },
    sendX2Request:function (indexBet,idCua) {

        var request = {
            c: "game",
            g: this.gameGroup,
            p:{1:indexBet+1,2:idCua}, // 111 bonuss 222 free 00000//no hu
            a:1553
        };
        SocketClient.getInstance().send(request);
    },

    sendBonus:function (idBonus) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1002", {1: idBonus});
    },
    sendGetTopRequest: function () {
    },
    sendGiveGold:function (indexBet) {
        var request = {
            c: "game",
            g: this.gameGroup,
            p:{1:indexBet+1}, // 111 bonuss 222 free 00000//no hu
            a:1554
        };
        SocketClient.getInstance().send(request);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1007", null);
    },
    sendHistory:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1005", null);
    },
    sendGetUserHistory: function () {
    }
});