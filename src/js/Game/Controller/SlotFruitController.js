/**
 * Created by kk on 5/3/2018.
 */

var SlotFruitController = GameController.extend({
    ctor: function (view, gameId) {
        this.isNohu = false;
        this.gameId = gameId;
        this.initWithView(view);
    },

    initWithView: function (view) {
        this._view = view;
        this.gameGroup = "game_slotfruit";

        SocketClient.getInstance().addListener(kEvent.CHANGE_LINES_SLOT, this.onChangeLines, this);
        SocketClient.getInstance().addListener("100", this.onGameInfo, this);
        SocketClient.getInstance().addListener("101", this.onResultSpin, this);
        // SocketClient.getInstance().addListener("102", this.onResultSpin, this);
        SocketClient.getInstance().addListener("103", this.onFreeSpin, this);

        this.sendJoinGame();

    },
    sendJoinGame: function () {
        var request = {
            "c" : 20,
            "d" : PlayerMe.Token
        };
        this.sendRequest(request);
    },
    requestQuitRoom: function () {
        var request = {
            "c" : 21,
            "d" : PlayerMe.Token
        };
        this.sendRequest(request);
    },
    requestMinimizeGame: function () {
        var request = {
            "c" : 102,
            "d" : -1
        };
        this.sendRequest(request);
    },
    sendSpin: function (roomId, _lines, _type) {
        var request = {
            c: "101",
            d: {
                r: roomId + 1,//1 2 3
                lines: _lines,
                type : _type // 0  bt, 1 : quay free
            }
        };
        this.sendRequest(request);
    },
    sendJoinRoom: function (roomId) {
        var request = {
            c: "102",
            d: (roomId + 1),//1 2 3 0: sảnh, -1 : chạy ẩn
        };
        this.sendRequest(request);
    },
    sendJoinLobby: function () {
        var request = {
            c: "102",
            d: 0,//1 2 3 0: sảnh, -1 : chạy ẩn
        };
        this.sendRequest(request);
    },
    sendMinimizeGame: function () {
        var request = {
            c: "102",
            d: -1,//1 2 3 0: sảnh, -1 : chạy ẩn
        };
        this.sendRequest(request);
    },


    onChangeLines: function (cmd, message) {
        this._view._onChangeLines(cmd, message);
    },
    onGameInfo: function (cmd, data) {
        cc.log("TAMQUOC: onGameInfo", data);
        //{id: 200, c: 100, s: 1, d: "500140,5000000,50000000", m: ""}
        var status = data.s;
        if(status >0){
            var arrMoneyHu = data.d.split(",");
            this._view.updatemoneyHu(arrMoneyHu);
        }
    },
    onResultSpin: function (cmd, data) {
        cc.log("TAMQUOC: onResultSpin", data);
        //{id: 200, c: 100, s: 1, d: "500140,5000000,50000000", m: ""}
        this._view.startSpin(data);
    },
    onFreeSpin: function (cmd, data) {
        cc.log("TAMQUOC: onFreeSpin", data);
        //{id: 200, c: 100, s: 1, d: "500140,5000000,50000000", m: ""}
        var total = data.d;
        this._view.updatFreeSpin(total);
    },


});