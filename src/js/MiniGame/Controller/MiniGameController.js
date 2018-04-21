/**
 * Created by anhvt on 12/5/2016.
 */

var MiniGameController = cc.Class.extend({
    ctor: function () {
        SocketClient.getInstance().addListener("logout", this.onLogout, this);
    },

    onLogout: function () {
        this._view.closeButtonHandler();
    },

    initWithView: function (view) {
        this._view = view;
    },

    releaseController: function () {
        this._view = null;
        SocketClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },

    sendJoinGame : function () {
        
    }
});