
var GameController = cc.Class.extend({
    ctor: function () {
        this.gameId = 0;
    },

    initWithView: function (view) {
        this._view = view;
    },

    releaseController: function () {
        this._view = null;
        SocketClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },

    sendRequest: function (request) {
        request["id"] = this.gameId;
        SocketClient.getInstance().send(request);
    },

    addListener: function (cmd, listener, target) {
        SocketClient.getInstance().addListener(cmd, listener, target);
    },

    sendJoinGame : function () {

    },

    requestQuitRoom: function () {

    }
});