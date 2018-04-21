/**
 * Created by Balua on 9/14/17.
 */

(function(){
    var TaiXiuAnimation = cc.Node.extend({
        ctor: function (size) {
            this._super();
            this.setContentSize(size);
            this.arrHistory = [];

            this.drawnodeTongHat = new cc.DrawNode();
            this.addChild(this.drawnodeTongHat);
        },

        drawTongHat:function () {
            var removeCount = this.arrHistory.length - 13;
            if(removeCount > 0){
                this.arrHistory.splice(0,removeCount);
            }

            var arrNum = this.arrHistory;

            this.drawnodeTongHat.clear();
            this.drawnodeTongHat.removeAllChildren();
            if(arrNum.length <= 0){
                return;
            }

            var x = 52.5;
            var dx = 13;
            var y = 32.5;
            var dy = 12/3;

            for(var i = 0; i < arrNum.length; i++){
                if(i < arrNum.length - 1){
                    this.drawnodeTongHat.drawSegment(cc.p(x+i*dx ,y + (arrNum[i]-3)*dy),cc.p(x+(i+1)*dx ,y + (arrNum[i+1]-3)*dy), 1, cc.color("#ebc61f"));
                }

                var spriteDot = new cc.Sprite(arrNum[i] > 10 ? "#lobby_gameIcon_mntx_history_2.png" : "#lobby_gameIcon_mntx_history_1.png");
                spriteDot.setPosition(cc.p(x+i*dx ,y + (arrNum[i]-3)*dy));
                this.drawnodeTongHat.addChild(spriteDot);

                // if(i === arrNum.length - 1){
                //     var  ictx_last  = new cc.Sprite("#ictx_last.png");
                //     ictx_last.setPosition(spriteDot.getPosition());
                //     this.drawnodeTongHat.addChild(ictx_last,1)
                // }
            }

            arrNum.reverse();
        },

        onResuft:function (cmd, message) {
            var param = message["data"];
            var itemXucXac = param[1];

            var totalDiem = 0;
            for (var i = 0; i < itemXucXac.length; i++) {
                totalDiem += itemXucXac[i];
            }
            this.arrHistory.push(totalDiem);
            this.drawTongHat();
        },

        onJoinGame:function (cmd, message) {
            this.arrHistory = [];
            if(message["ch"] === "mini_taixiu") {
                var arr = message["data"][4];
                for(var i = arr.length - 1; i >= 0 ; i--){
                    this.arrHistory.push(arr[i]);
                }
                this.drawTongHat();
            }
        },

        onEnter: function () {
            this._super();
            SocketClient.getInstance().addListener("1016", this.onResuft, this);
            SocketClient.getInstance().addListener("1008", this.onJoinGame, this);
            var request = {
                c: "game",
                g: "mini_taixiu",
                a:1012
            };
            SocketClient.getInstance().send(request);
        },

        onExit: function () {
            this._super();
            SocketClient.getInstance().removeListener(this);
        }
    });


    //xocdia animation
    var XocDiaAnimation = cc.Node.extend({
        ctor: function (size) {
            this._super();
            this.setContentSize(size);

            var historyNode = new cc.Node();
            this.addChild(historyNode);
            this.historyNode = historyNode;
        },
        _refreshView: function(){
            cc.log("_refreshView", this.arrHistory);
            this.historyNode.removeAllChildren(true);
            var row = 6;
            var col = 13;

            var historyData = [];
            var _addData = function(history){
                if (historyData.length === 0) {
                    historyData.push(history);
                    return;
                }

                var maxItem = row * col;
                var lastHistory = historyData[historyData.length - 1];
                if ((lastHistory % 2) !== (history % 2)) {
                    //fill empty
                    var emptyCount = historyData.length % row;
                    if (emptyCount > 0) {
                        emptyCount = row - emptyCount;
                        for (var i = 0; i < emptyCount; i++) {
                            historyData.push(-1);
                        }
                    }
                }
                historyData.push(history);
                if (historyData.length > maxItem) {
                    historyData.splice(0, row);
                }
            };
            for(var i=this.arrHistory.length-1;i>=0;i--){
                _addData(this.arrHistory[i]);
            }

            var p = cc.p(42, 102);
            var itemSize = cc.size(13, 13);
            for (var i = 0; i < historyData.length; i++) {
                if (historyData[i] >= 0) {
                    var x = p.x + itemSize.width* Math.floor(i / row);
                    var y = p.y - itemSize.height* (i % row);
                    if (historyData[i] % 2) {
                        var historyIcon = new cc.Sprite("#lobby_gameIcon_xocdia_history_1.png");
                    }
                    else {
                        var historyIcon = new cc.Sprite("#lobby_gameIcon_xocdia_history_2.png");
                    }
                    historyIcon.setPosition(x, y);
                    this.historyNode.addChild(historyIcon, 0);
                }
            }

        },
        onEnter: function () {
            this._super();
            this.arrHistory = [];
            SocketClient.getInstance().addListener("5008", this.onRecvHistory, this);
            var request = {
                c: "game",
                g: "game_shakedisk",
                a: 5012
            };
            SocketClient.getInstance().send(request);
        },
        onExit: function () {
            this._super();
            SocketClient.getInstance().removeListener(this);
        },
        onRecvHistory: function(cmd, data){
            if(data["ch"] === "game_shakedisk"){
              this.arrHistory = data["data"]["4"];
              this._refreshView();
            }
        }
    });

    window._createHomeIconAnimation = function (gameId, size) {
        switch (gameId){
            case GameType.MiniGame_TaiXiu: {
                return new TaiXiuAnimation(size);
            }
            case GameType.GAME_XocDia: {
                return new XocDiaAnimation(size);
            }
        }
        return null;
    };
})();