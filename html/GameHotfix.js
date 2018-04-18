/**
 * Created by cocos2d on 1/17/2017.
 */

var cc = cc || {};
cc.hotfixFunction = function () {
    cc.log("hotfixFunction");
    cc.GamePaused = false;
    cc.startUpdateBackground = function () {
        cc._lastUpdateTime = Date.now();
        var frame_rate = 1000.0 / 60;

        var cb = function () {
            if(cc._updateBackgroundFunc){
                window.clearTimeout(cc._updateBackgroundFunc);
            }
            cc.updateBackground();
            cc._updateBackgroundFunc = window.setTimeout(cb, frame_rate);
        };
        cc._updateBackgroundFunc = window.setTimeout(cb, frame_rate);
    };

    cc.stopUpdateBackground = function () {
        if(cc._updateBackgroundFunc){
            window.clearTimeout(cc._updateBackgroundFunc);
            cc.updateBackground();
        }
    };

    cc.updateBackground = function () {
        var now = Date.now();
        var dt = (now - cc._lastUpdateTime) / 1000;
        cc._lastUpdateTime = now;
        var frame_rate = 1.0/ 60.0;

        while(dt > 0){
            var deltaTime = dt < frame_rate ? dt : frame_rate;
            cc.director._scheduler.update(deltaTime);
            dt -= frame_rate;
            cc.eventManager.dispatchEvent(cc.director._eventAfterUpdate);
        }
    };

    cc.director.pause = function () {
        //nothing
    };

    cc.game.pause = function () {
        if(cc.GamePaused == false){
            cc.GamePaused = true;
            cc.startUpdateBackground();
            cc.log("pause");
        }

        // engine
        // if (this._paused) return;
        // this._paused = true;
        // // Pause audio engine
        // if (cc.audioEngine) {
        //     cc.audioEngine.stopAllEffects();
        //     cc.audioEngine.pauseMusic();
        // }
        // // Pause main loop
        // if (this._intervalId)
        //     window.cancelAnimationFrame(this._intervalId);
        // this._intervalId = 0;
    };

    cc.game.resume =  function () {
        if(cc.GamePaused == true){
            cc.GamePaused = false;
            cc.stopUpdateBackground();
            cc.log("resume");
        }

        //engine
        if (!this._paused) return;
        this._paused = false;
        // Resume audio engine
        if (cc.audioEngine) {
            cc.audioEngine.resumeMusic();
        }
        // Resume main loop
        this._runMainLoop();
    };

    //fix mouse move out canvas (iframe)
    cc._canvas.addEventListener("mouseout", function (event) {
        var selfPointer = cc.inputManager;
        if(selfPointer._mousePressed){
            selfPointer._mousePressed = false;
            var pos = selfPointer.getHTMLElementPosition(cc._canvas);
            var location = selfPointer.getPointByEvent(event, pos);
            selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, pos)]);

            var mouseEvent = selfPointer.getMouseEvent(location,pos,cc.EventMouse.UP);
            mouseEvent.setButton(event.button);
            cc.eventManager.dispatchEvent(mouseEvent);

            event.stopPropagation();
            event.preventDefault();
        }
    }, false);

    //yes
    // window.onbeforeunload = function () {
    //     SmartfoxClient.getInstance().close();
    //     LobbyClient.getInstance().close();
    // };
};

(function () {
    /* Fix by cocos2d, bangmatiengviet */
    cc.LabelTTF._wordRex = /([a-zA-Z0-9đĐÁáÀàÃãẢảẠạÂâẤấẦầẪẫẨẩẬậĂăẮắẰằẴẵẲẳẶặÉéÈèẼẽẺẻẸẹêẾếỀềỄễỂểỆệÍíÌìĨĩỈỉỊịÓóÒòÕõỎỏỌọÔôỐốỒồỖỗỔổỘộƠơỚớỜờỠỡỞởỢợÚúÙùŨũỦủỤụƯưỨứỪừỮữỬửỰựÝýỲỳỸỹỶỷỴỵ]+|\S)/;
    cc.LabelTTF._symbolRex = /^[!,.:;}\]%\?>、‘“》？。，！]/;
    cc.LabelTTF._lastWordRex = /([a-zA-Z0-9đĐÁáÀàÃãẢảẠạÂâẤấẦầẪẫẨẩẬậĂăẮắẰằẴẵẲẳẶặÉéÈèẼẽẺẻẸẹêẾếỀềỄễỂểỆệÍíÌìĨĩỈỉỊịÓóÒòÕõỎỏỌọÔôỐốỒồỖỗỔổỘộƠơỚớỜờỠỡỞởỢợÚúÙùŨũỦủỤụƯưỨứỪừỮữỬửỰựÝýỲỳỸỹỶỷỴỵ]+|\S)$/;
    cc.LabelTTF._lastEnglish = /[a-zA-Z0-9đĐÁáÀàÃãẢảẠạÂâẤấẦầẪẫẨẩẬậĂăẮắẰằẴẵẲẳẶặÉéÈèẼẽẺẻẸẹêẾếỀềỄễỂểỆệÍíÌìĨĩỈỉỊịÓóÒòÕõỎỏỌọÔôỐốỒồỖỗỔổỘộƠơỚớỜờỠỡỞởỢợÚúÙùŨũỦủỤụƯưỨứỪừỮữỬửỰựÝýỲỳỸỹỶỷỴỵ]+$/;
    cc.LabelTTF._firsrEnglish = /^[a-zA-Z0-9đĐÁáÀàÃãẢảẠạÂâẤấẦầẪẫẨẩẬậĂăẮắẰằẴẵẲẳẶặÉéÈèẼẽẺẻẸẹêẾếỀềỄễỂểỆệÍíÌìĨĩỈỉỊịÓóÒòÕõỎỏỌọÔôỐốỒồỖỗỔổỘộƠơỚớỜờỠỡỞởỢợÚúÙùŨũỦủỤụƯưỨứỪừỮữỬửỰựÝýỲỳỸỹỶỷỴỵ]/;
})();

(function () {
    /*
    //login form
    var loginForm = document.getElementById("login_form");
    if(loginForm === undefined || loginForm === null){
        loginForm = document.createElement("FORM");
        loginForm.id = "login_form";
        loginForm.style.display = "none";

        var username = document.createElement("INPUT");
        username.type = "text";
        username.name = "username";
        username.autocorrect = "off";
        username.autocapitalize = "off";
        loginForm.appendChild(username);

        var password = document.createElement("INPUT");
        password.type = "password";
        password.name = "password";
        password.autocorrect = "off";
        password.autocapitalize = "off";
        loginForm.appendChild(password);

        var doLogin = document.createElement("INPUT");
        doLogin.type = "submit";
        doLogin.name = "doLogin";
        doLogin.value = "Login";
        loginForm.appendChild(doLogin);

        document.body.appendChild(loginForm);
    }

    //login method
    var AccountManager = {};
    AccountManager.saveUsernamePassword = function (u, p) {
        setTimeout(function () {
            loginForm.username.value = u;
            loginForm.password.value = p;
            loginForm.doLogin.click();
        }, 0);
    };
    AccountManager.getSaveUsername = function () {
        return loginForm.username.value;
    };

    AccountManager.getSavePassword = function () {
        return loginForm.password.value;
    };

    loginForm.onsubmit = function (e) {
        e.preventDefault();
    };
    window.AccountManager = AccountManager;
    */
})();