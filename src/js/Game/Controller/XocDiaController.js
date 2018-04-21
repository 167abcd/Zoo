/**
 * Created by ext on 12/5/2016.
 */

var XocDiaController = LobbyRoomGameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);
        this._initHandler();

        var thiz = this;
        this.setTimeout(function () {
            thiz.resetView();
            thiz._sendJoinRoomRequest();
        },0);
    },

    resetView: function () {
        this._view.setTimeRemaining(0, 0);
        this._view.hideDisk();
        this._view.resetGame();
        this._view.setHuyCuocButtonVisible(false);
        this._view.setDatLaiButtonVisible(false);
        this._view.setUserCount(0);
      //  this._view.setUsername("");
    },

    initWithView: function (view) {
        this._super(view);

        this.slotGold = [];
        this.userGoldSlot = [];

        this._bettingSlotCount = 7;
        this._gameChannel = "game_shakedisk";
    },

    _initHandler: function () {
        this._addListener("1000", this._onJoinRoomHandler, this);
        this._addListener("5002", this._onDatCuocThanhCongHandler, this);
        this._addListener("5003", this._onUpdateTotalBettingHandler, this);
        this._addListener("5006", this._onRecvHistory, this);
        this._addListener("5007", this._onOpenDiskHandler, this);
        this._addListener("5009", this._onUpdateGameStatusHandler, this);
        this._addListener("5014", this._updateUserGoldWin, this);
        this._addListener("5019", this._onUpdateUserCount, this);
        this._addListener("5020", this._onUpdateUserBettingHandler, this);
        this._addListener("5021", this._onUpdateButtonStatusHandler, this);
        this._addListener("5022", this._onHuyCuocThanhCongHandler, this);
        this._addListener("5023", this._onDatLaiThanhCongHandler, this);
       // this._addListener("9999", this._onQuitRoomHandler, this);
    },

    releaseController: function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    },

    _sendJoinRoomRequest: function () {
        var request = {
            a: "1000"
        };
        this._sendRequest(request);
    },

    //handler
    _onJoinRoomHandler: function (cmd, event) {
        this._updateChipValue(event["data"]["2"]);
        this._onUpdateGameStatus(event["data"]["1"]["2"], true);
        this._updateUserBetting(event["data"]["3"], true);
        this._updateTotalBetting(event["data"]["1"]["3"], true);
        this._onUpdateButtonStatus(event["data"]["4"]);
    },

    _onQuitRoomHandler: function (cmd, event) {
        this._view.exitToLobby();
    },

    _onUpdateGameStatusHandler: function (cmd, event) {
        this._onUpdateGameStatus(event["data"]);
    },

    _onUpdateButtonStatusHandler: function (cmd, event) {
        this._onUpdateButtonStatus(event["data"]);
    },

    _onHuyCuocThanhCongHandler: function (cmd, event) {
        this._view.huyCuocThanhCong();
    },

    _onDatLaiThanhCongHandler: function (cmd, event) {
        var arr = event["data"]["1"];
        for (var i=0;i<arr.length;i++) {
            this._onDatCuocThanhCong(arr[i]);
        }
    },

    _onDatCuocThanhCongHandler: function (cmd, event) {
        this._onDatCuocThanhCong(event["data"]);
    },

    _onUpdateTotalBettingHandler: function (cmd, event) {
        this._updateTotalBetting(event["data"]["1"]);
    },

    _onUpdateUserBettingHandler: function (cmd, event) {
        this._updateUserBetting(event["data"]["1"]);
    },

    _onRecvHistory: function (cmd, event) {
        var arr = event["data"]["2"];
        var historyList = [];
        for(var i=arr.length - 1; i>=0; i--){
            historyList.push(arr[i]["2"]);
        }
        this._view.setHistory(historyList);
    },

    _onOpenDiskHandler: function (cmd, event) {
        var allSlotWin = event["data"]["4"];
        var winSlot = [];
        var loseSlot = [];
        for(var i=0;i<this._bettingSlotCount;i++){
            if(allSlotWin.indexOf(i) < 0){
                loseSlot.push(i);
            }
            else{
                winSlot.push(i);
            }
        }

        var data = {
            result : event["data"]["1"],
            winSlot : winSlot,
            loseSlot : loseSlot
        };

        this._view.openDisk(data);
    },

    _updateUserGoldWin: function (cmd, event) {
        var gold = event["data"]["1"];
        if(cc.isString(gold)){
            gold = parseInt(gold);
        }
        var thiz = this;
        this.setTimeout(function () {
            thiz._view.setWinLabel(gold);
        }, 2000);
    },

    _onUpdateUserCount: function (cmd, event) {
        var userCount = event["data"]["1"];
        this._view.updateUserCount(userCount);
    },


    _onUpdateAssetHandler: function (cmd, data) {
        if(data["type"] === 1){ //gold
            this._view.updateGold(PlayerMe.username, PlayerMe.gold);

            var gold = data["delta"];
            if(gold !== 0){
                var delta = data["delta"];
                // if(delta > 0){
                //     this._view.changeGoldEffect(delta);
                // }
            }
        }
        else if(data["type"] === 5){ //freeGold

        }
    },

    _onSocketLoginHandler: function (cmd, data) {
        var status = data["stt"];
        if(status === 0){
            this._sendJoinRoomRequest();
            this._view.setUsername(PlayerMe.username);
        }
    },

    //private

    _onUpdateGameStatus: function (data, isJoin) {
        var status = data["1"];
        var currentTime = data["4"] / 1000;
        var maxTime = data["2"] / 1000;

        switch (status){
            case 1: //chuẩn bị ván mới
            {
                this.slotGold = [];
                this.userGoldSlot = [];
                this._view.setTimeRemaining(0, 0);
                this._view.hideDisk();
                this._view.resetGame();
                break;
            }
            case 4: //xóc đĩa
            {
                this.slotGold = [];
                this.userGoldSlot = [];
                this._view.setTimeRemaining(0, 0);
                this._view.shakeDisk();
                this._view.resetGame();
                break;
            }
            case 2: //đặt cược
            {
                this.slotGold = [];
                this.userGoldSlot = [];
                this._view.hideDisk();
                this._view.setTimeRemaining(currentTime, maxTime);
                this._view.playSoundDatCuoc(isJoin);
                break;
            }
            case 3: // mở bát
            {
                this._view.setTimeRemaining(0, 0);
                this._view.hideDisk();
                break;
            }
        }

        // this._view.setHuyCuocButtonVisible(data["5"]);
        // this._view.setDatLaiButtonVisible(data["6"]);
    },

    _onDatCuocThanhCong: function (data) {
        var slotId = data["1"];
        var totalGold = data["3"];
        var userGold = data["2"];

        //add chip
        var chipId = data["5"];
        if(chipId === undefined){
            if(this.userGoldSlot[slotId] === undefined){
                this._addFakeChip(slotId, userGold, true, 1); //fromMe
            }
            else{
                var deltaGold = userGold - this.userGoldSlot[slotId];
                if(deltaGold > 0){
                    this._addFakeChip(slotId, deltaGold, true, 1); //fromMe
                }
            }
        }
        else{
            this._view.addChipToSlot(slotId, chipId - 1, 1); //fromMe
        }

        this._updateGoldSlot(slotId, totalGold);
        this._updateUserGoldSlot(slotId, userGold);
    },

    _onUpdateButtonStatus: function (data) {
        this._view.setHuyCuocButtonVisible(data["1"]);
        this._view.setDatLaiButtonVisible(data["2"]);
    },

    _updateChipValue : function (chips) {
        this._chipValue = [];

        for(var i=0;i<chips.length;i++){
            var chipId = chips[i]["1"] - 1;
            var chipGold = chips[i]["2"];

            this._view.setChipValue(chipId, chipGold);

            this._chipValue.push({
                chipId : chipId,
                gold : chipGold
            });
        }

        //sort chip values;
        this._chipValue.sort(function (a, b) {
            return (a.gold - b.gold);
        });
    },

    _updateTotalBetting : function (data, isReconnect) {
        for(var i=0;i<data.length;i++){
            var slotId = data[i]["1"];
            var gold = data[i]["3"];

            if(isReconnect){
                if(this.userGoldSlot[slotId] !== undefined){
                    var fakeGold = gold - this.userGoldSlot[slotId];
                }
                else{
                    var fakeGold = gold;
                }
                if(fakeGold > 0){
                    this._addFakeChip(slotId, fakeGold, false, 2);
                }
            }
            else{
                if(this.slotGold[slotId] !== undefined){
                    var fakeGold = gold - this.slotGold[slotId];
                }
                else if(this.userGoldSlot[slotId] !== undefined){
                    var fakeGold = gold - this.userGoldSlot[slotId];
                }
                else{
                    fakeGold = gold;
                }
                this._addFakeChip(slotId, fakeGold, true, 2);
            }

            this._updateGoldSlot(slotId, gold);
        }
    },

    _updateUserBetting: function (data, fakeChip) {
        for (var slotId in data) {
            if (!data.hasOwnProperty(slotId)) continue;
            var userGold = data[slotId];
            if(cc.isString(slotId)){
                slotId = parseInt(slotId)
            }

            this._updateUserGoldSlot(slotId, userGold);
            if(fakeChip){
                if(userGold > 0 && !this._isRunning){
                    this._addFakeChip(slotId, userGold, false);
                }
            }
        }


        var totalBettingGold = 0;
        for(var i=0;i<this.userGoldSlot.length;i++){
            if(this.userGoldSlot[i]){
                totalBettingGold += this.userGoldSlot[i];
            }
        }
       // this._view.setHuyCuocButtonVisible(totalBettingGold > 0);
    },

    _updateGoldSlot : function (slotId, gold) {
        this._view.updateSlotGold(slotId, gold);
        this.slotGold[slotId] = gold;
    },

    _updateUserGoldSlot : function (slotId, gold) {
        this._view.updateUserGold(slotId, gold);
        this.userGoldSlot[slotId] = gold;

        var totalGold = 0;
        for(var i=0; i<this.userGoldSlot.length; i++){
            if(this.userGoldSlot[i]){
                totalGold += this.userGoldSlot[i];
            }
        }
        if(totalGold > 0){
            this._view.setTongCuocLabel(totalGold);
        }
        else{
            this._view.setTongCuocLabel(-1);
        }
    },

    _addFakeChip : function(slotId, gold, animation, from){
        while(gold > 0){
            var chipSelected = this._chipValue[0];
            for(var i=0;i<this._chipValue.length;i++){
                var chip = this._chipValue[i];
                if(chip.gold > gold){
                    break;
                }
                chipSelected = chip;
            }
            gold -= chipSelected.gold;
            this._view.addChipToSlot(slotId, chipSelected.chipId, from ? from : 1, null, animation ? false : true); //fromMe
        }
    },

    //request
    requestDatCuoc : function (slotId, chipId) {
        var request = {
            a : 5002,
            p : {
                1 : slotId,
                2 : chipId + 1
            }
        };
        this._sendRequest(request);
    },
    requestDatlai : function () {
        var request = {
            a: "5023"
        };
        this._sendRequest(request);
    },
    requestHuyCuoc : function () {
        var request = {
            a: "5022"
        };
        this._sendRequest(request);
    },
    requestQuitRoom : function () {
        //this._view.exitToLobby();
        var request = {
            a: "9999"
        };
        this._sendRequest(request);
        this._view.exitToLobby();
    }
});