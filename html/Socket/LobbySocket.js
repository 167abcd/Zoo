/**
 * Created by cocos2d on 11/9/2016.
 */

var socket = socket || {};

/* lobby */
socket.LobbySocket = socket.LobbySocket || {};
socket.LobbySocket.NotConnection = 0;
socket.LobbySocket.Connecting = 1;
socket.LobbySocket.Connected = 2;
socket.LobbySocket.ConnectFailure = 3;
socket.LobbySocket.LostConnection = 4;
socket.LobbySocket.Closed = 5;

socket.LobbySocket.StatusName = socket.LobbySocket.StatusName || {};
socket.LobbySocket.StatusName[socket.LobbySocket.NotConnection] = "NotConnected";
socket.LobbySocket.StatusName[socket.LobbySocket.Connecting] = "Connecting";
socket.LobbySocket.StatusName[socket.LobbySocket.Connected] = "Connected";
socket.LobbySocket.StatusName[socket.LobbySocket.ConnectFailure] = "ConnectFailure";
socket.LobbySocket.StatusName[socket.LobbySocket.LostConnection] = "LostConnection";
socket.LobbySocket.StatusName[socket.LobbySocket.Closed] = "Closed";

socket.LobbyClient = cc.Class.extend({
    ctor : function () {
        this.wsocket = null;
        this.socketStatus = socket.LobbySocket.NotConnection;
    },
    connect : function (url) {
       // url = "ws://uat1.puppetserver.com:8887/websocket";
        if(this.wsocket){
            this.close();
        }
        this.setSocketStatus(socket.LobbySocket.Connecting);
        var wsocket = new WebSocket(url);
        this.wsocket = wsocket;

        var thiz = this;

        this.wsocket.onopen = function (event) {
            if(thiz.socketStatus === socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.Connected);
            }
        };
        this.wsocket.onmessage = function (event) {
            thiz.onRecvMessage(event.data);
        };
        this.wsocket.onerror = function (event) {
            thiz.closeSocket();
            if(thiz.socketStatus === socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.ConnectFailure);
            }
            else if(thiz.socketStatus === socket.LobbySocket.Connected){
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
        this.wsocket.onclose = function (event) {
            thiz.closeSocket();
            if(thiz.socketStatus === socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.ConnectFailure);
            }
            else if(thiz.socketStatus === socket.LobbySocket.Connected){
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
    },
    close : function () {
        this.closeSocket();
        if(this.socketStatus === socket.LobbySocket.Connected){
            this.setSocketStatus(socket.LobbySocket.Closed);
        }
    },
    closeSocket : function () {
        if(this.wsocket){
            this.resetSocket();
            if(this.wsocket.readyState === 0){ //connecting
                var ws = this.wsocket;
                ws.onopen = function () { //close when open
                    ws.close();
                };
            }
            else if(this.wsocket.readyState === 1){ //open
                this.wsocket.close();
            }
            this.wsocket = null;
        }
    },
    closeLostPing: function () {
        this.closeSocket();
    },
    resetSocket : function () {
        if(this.wsocket){
            this.wsocket.onopen = 0;
            this.wsocket.onmessage = 0;
            this.wsocket.onerror = 0;
            this.wsocket.onclose = 0;
        }
    },
    setSocketStatus : function (status) {
        this.socketStatus = status;
        if(this.onEvent){
            this.onEvent("socketStatus", socket.LobbySocket.StatusName[this.socketStatus]);
        }
    },
    onRecvMessage : function (data) {
        if(this.onEvent) {
            this.onEvent("message", data);
        }
    },
    getStatus : function () {
        return this.socketStatus;
    },
    send : function (data) {
        if(this.wsocket && this.socketStatus === socket.LobbySocket.Connected){
            this.wsocket.send(data);
        }
    },
});

/* lobby */
socket.LobbyClient.NotConnection = 0;
socket.LobbyClient.Connecting = 1;
socket.LobbyClient.Connected = 2;
socket.LobbyClient.ConnectFailure = 3;
socket.LobbyClient.LostConnection = 4;
socket.LobbyClient.Closed = 5;

socket.LobbyClient.UDT = 0;
socket.LobbyClient.TCP = 1;