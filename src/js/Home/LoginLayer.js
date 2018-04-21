/**
 * Created by Balua on 7/18/17.
 */


var LoginLayer = cc.Node.extend({
    ctor : function(){
        this._super();

        var thiz = this;

        var _bg = new cc.Sprite("#home_bar_4.png");
        _bg.setAnchorPoint(cc.p(0.5, 1.0));
        _bg.setPosition(1000, 860);
        this.addChild(_bg);
        this._bg = _bg;

        var btn_back = new ccui.Button("home_buttonBack.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_back.setPosition(360, 826);
        this.addChild(btn_back);
        btn_back.setVisible(false);
        this.btn_back = btn_back;

        var _btn_fb = new ccui.Button("home_btn_fb.png","","", ccui.Widget.PLIST_TEXTURE);
        _btn_fb.setPosition(cc.p(1453, 826));
        this.addChild(_btn_fb);
        _btn_fb.addClickEventListener(function () {
            FacebookPlugin.getInstance().showLogin();
        });

        var _bg_tf_username = new ccui.Scale9Sprite("home_bg_textfield.png", cc.rect(40, 0, 4, 54));
        _bg_tf_username.setPreferredSize(cc.size(259, 54));
        _bg_tf_username.setPosition(cc.p(699, 824));
        this.addChild(_bg_tf_username);

        var _bg_tf_password = new ccui.Scale9Sprite("home_bg_textfield.png", cc.rect(40, 0, 4, 54));
        _bg_tf_password.setPreferredSize(cc.size(259, 54));
        _bg_tf_password.setPosition(cc.p(971, _bg_tf_username.y));
        this.addChild(_bg_tf_password);

        var userText = new newui.TextField(cc.size(_bg_tf_username.width - 20, 50), cc.res.font.Roboto_UTMAvoBold_24);
        userText.setPlaceHolder("Tài khoản");
        userText.setTextColor(cc.color("#bfbfbf"));
        userText.setPlaceHolderColor(cc.color("#ffffff"));
        userText.setMaxLength(16);
        userText.setPosition(cc.p(_bg_tf_username.x, _bg_tf_username.y));
        this.addChild(userText,1);
        this.userText = userText;

        var passwordText = new newui.TextField(cc.size(_bg_tf_password.width - 20, 50), cc.res.font.Roboto_UTMAvoBold_24);
        passwordText.setPasswordEnable(true);
        passwordText.setPlaceHolder("Mật khẩu");
        passwordText.setTextColor(cc.color("#bfbfbf"));
        passwordText.setPlaceHolderColor(cc.color("#ffffff"));
        passwordText.setMaxLength(32);
        passwordText.setPosition(cc.p(_bg_tf_password.x, _bg_tf_password.y));
        this.addChild(passwordText,1);
        this.passwordText = passwordText;


        var requestLogin = function () {
            var username = userText.getText();
            var password =  passwordText.getText();
            if(!username || username.length === 0){
                MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
                userText.showKeyboard();
                return;
            }
            if(!password || password.length === 0){
                MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
                passwordText.showKeyboard();
                return;
            }
            SocketClient.getInstance().sendLogin(username, password);
        };


        userText.nextTextField = passwordText;
        passwordText.setReturnCallback(function () {
            requestLogin();
        });


        var btn_savepass = new ccui.CheckBox();
        btn_savepass.loadTextureBackGround("home_savePass2.png", ccui.Widget.PLIST_TEXTURE);
        btn_savepass.loadTextureFrontCross("home_savePass1.png", ccui.Widget.PLIST_TEXTURE);
        btn_savepass.setPosition(cc.p(1170, 823));
        this.addChild(btn_savepass);
        btn_savepass.addEventListener(function (target,event) {
            cc.Global.SetSetting("save_password", btn_savepass.isSelected());
        });
        btn_savepass.setSelected(cc.Global.GetSetting("save_password", false));
        this.btn_savepass = btn_savepass;

        var _btn_signin = new ccui.Button("home_login_dangnhap.png","","", ccui.Widget.PLIST_TEXTURE);
        _btn_signin.setPosition(cc.p(1326, 826));
        this.addChild(_btn_signin);

        var logo_top_bar_login = new cc.Sprite("#dialog-loading-logo.png");
        logo_top_bar_login.setPosition(360, 825);
        this.addChild(logo_top_bar_login);

        var _btn_signup = new ccui.Button("home_login_dangky.png","","", ccui.Widget.PLIST_TEXTURE);
        _btn_signup.setPosition(cc.p(480, 825));
        this.addChild(_btn_signup);

        var resetPwButton = new ccui.Button("home_resetPw_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        resetPwButton.setPosition(cc.p(1580, 827));
        this.addChild(resetPwButton);

        _btn_signup.addClickEventListener(function(){
            var pop = new SignupLayer();
            pop.show();

        });

        _btn_signin.addClickEventListener(function () {
            requestLogin();
        });

        resetPwButton.addClickEventListener(function () {
           var pop = new ForgetPasswordDialog();
           pop.show();
        });
    },


    setHidden : function(isHidden){
        if(isHidden !== this.isVisible()){
            return;
        }

        this.stopAllActions();
        var thiz = this;
        if(isHidden){
            this.runAction(cc.sequence(cc.moveTo(0.2, 0, 200), cc.callFunc(function () {
                thiz.setVisible(false);
            })));
        }
        else{
            thiz.setPosition(0, 200);
            thiz.setVisible(true);
            thiz.runAction(new cc.EaseCircleActionOut(cc.moveTo(0.2, 0, 0)));
            this.userText.setText(cc.Global.getSaveUsername());
            this.passwordText.setText(cc.Global.getSavePassword());
        }
    },

    onEnter : function () {
        this._super();
        this.setVisible(false);
        SocketClient.getInstance().addListener("login", this._onSocketLogin, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);

    },

    _onSocketLogin : function (cmd, data) {
        var status = data["stt"];
        if(status === 0){
            if(this.btn_savepass.isSelected())
            {
                cc.Global.setSaveUsername(this.userText.getText());
                cc.Global.setSavePassword(this.passwordText.getText());
            }
            else
            {
                cc.Global.setSaveUsername("");
                cc.Global.setSavePassword("");
            }
        }
    }
});