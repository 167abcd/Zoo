/**
 * Created by Balua on 7/18/17.
 */


var DialogSignUp = Dialog.extend({
    ctor : function(){
        this._super();
    },
    onTouchEnded : function (touch, event) {
        if(this._moveEnable){

        }
        else{
            if(this._touchInside){
                this._touchInside = false;
                return;
            }
            var p = this.convertToNodeSpace(touch.getLocation());
            if(!cc.rectContainsPoint(this.mTouch, p)){

            }
        }
        cc.log(this._moveEnable);
    }
});

var SignupLayer = DialogSignUp.extend({
    ctor : function(){
        this._super();

        var thiz = this;

        this.initWithSize(cc.size(692, 564), "ĐĂNG KÝ");
        this._paddingBottom = 0;



        var forebg = new ccui.Scale9Sprite("dialog_fore.png", cc.rect(30, 30, 4, 4));
        forebg.setPreferredSize(cc.size(671, 407));
        forebg.setAnchorPoint(cc.p(0.5, 1.0));
        forebg.setPosition(cc.p(this.width/2, this.height - 71));
        this.addChild(forebg, 1);
        this.forebg = forebg;


        var btn_dky = new ccui.Button("home_signup_btn_dky.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_dky.setPosition(cc.p(this.width/2, 51));
        this.addChild(btn_dky, 1);
        this.btn_dky = btn_dky;

        var tf_bg1 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg1.setPreferredSize(cc.size(407, 68));
        tf_bg1.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg1.setPosition(forebg.width/2, 319);
        forebg.addChild(tf_bg1);


        var tf_bg2 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg2.setPreferredSize(cc.size(407, 68));
        tf_bg2.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg2.setPosition(tf_bg1.x, 244);
        forebg.addChild(tf_bg2);


        var tf_bg3 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg3.setPreferredSize(cc.size(407, 68));
        tf_bg3.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg3.setPosition(tf_bg1.x, 165);
        forebg.addChild(tf_bg3);



        var userDkyText = new newui.TextField(cc.size(tf_bg1.getContentSize().width - 6, tf_bg1.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        userDkyText.setAlignment(0);
        userDkyText.setPlaceHolder("Tên tài khoản");
        userDkyText.setTextColor(cc.color("#525252"));
        userDkyText.setPlaceHolderColor(cc.color("#525252"));
        userDkyText.setMaxLength(32);
        userDkyText.setAnchorPoint(cc.p(0.5, 0.0));
        userDkyText.setPosition(cc.p(tf_bg1.x + 3, tf_bg1.y + 1));
        forebg.addChild(userDkyText,1);

        this.userDkyText = userDkyText;

        var niknameDkyText = new newui.TextField(cc.size(tf_bg2.getContentSize().width - 6, tf_bg2.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        niknameDkyText.setAlignment(0);
        niknameDkyText.setPlaceHolder("Tên hiển thị");
        niknameDkyText.setTextColor(cc.color("#525252"));
        niknameDkyText.setPlaceHolderColor(cc.color("#525252"));
        niknameDkyText.setMaxLength(16);
        niknameDkyText.setAnchorPoint(cc.p(0.5, 0.0));
        niknameDkyText.setPosition(cc.p(tf_bg2.x + 3, tf_bg2.y + 1));
        forebg.addChild(niknameDkyText,1);
        this.niknameDkyText = niknameDkyText;

        var passwordDkyText = new newui.TextField(cc.size(tf_bg3.getContentSize().width - 6, tf_bg3.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        passwordDkyText.setAlignment(0);
        passwordDkyText.setPlaceHolder("Mật khẩu");
        passwordDkyText.setTextColor(cc.color("#525252"));
        passwordDkyText.setPlaceHolderColor(cc.color("#525252"));
        passwordDkyText.setMaxLength(32);
        passwordDkyText.setAnchorPoint(cc.p(0.5, 0.0));
        passwordDkyText.setPosition(cc.p(tf_bg3.x + 3, tf_bg3.y + 1));
        passwordDkyText.setPasswordEnable(true);
        forebg.addChild(passwordDkyText,1);
        this.passwordDkyText =passwordDkyText;

        var tf_bg4 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg4.setPreferredSize(cc.size(165, 68));
        tf_bg4.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg4.setPosition(215, 90);
        forebg.addChild(tf_bg4);

        var recapchaText = new newui.TextField(cc.size(tf_bg4.getContentSize().width - 6, tf_bg4.getContentSize().height - 2), cc.res.font.Roboto_UTMAvoBold_24);
        recapchaText.setAlignment(0);
        recapchaText.setPlaceHolder("Nhập mã");
        recapchaText.setTextColor(cc.color("#525252"));
        recapchaText.setPlaceHolderColor(cc.color("#525252"));
        recapchaText.setMaxLength(5);
        recapchaText.setAnchorPoint(cc.p(0.5, 0.0));
        recapchaText.setPosition(cc.p(tf_bg4.x + 3, tf_bg4.y + 1));
        forebg.addChild(recapchaText,1);
        this.recapchaText = recapchaText;

        var tf_bg5 = new ccui.Scale9Sprite("home_napvang_tf.png",cc.rect(20, 20, 4, 4));
        tf_bg5.setPreferredSize(cc.size(165, 68));
        tf_bg5.setAnchorPoint(cc.p(0.5, 0.0));
        tf_bg5.setPosition(390, 90);
        forebg.addChild(tf_bg5);


        var captchaView = new ImageCaptcha();
        captchaView.setScale(1.2);
        captchaView.setPosition(cc.p(tf_bg5.width/2,tf_bg5.height/2));
        tf_bg5.addChild(captchaView);
        this.captchaView = captchaView;


        userDkyText.nextTextField = niknameDkyText;
        niknameDkyText.nextTextField = passwordDkyText;
        passwordDkyText.nextTextField = recapchaText;


        var btn_refreshCapcha = new ccui.Button("home_signup_refresh.png","","", ccui.Widget.PLIST_TEXTURE);
        btn_refreshCapcha.setAnchorPoint(cc.p(0.5, 0.0));
        btn_refreshCapcha.setPosition(cc.p(515, 85));
        btn_refreshCapcha.addClickEventListener(function () {
            captchaView.sendGetCapcha();
            recapchaText.setText("");

        });
        forebg.addChild(btn_refreshCapcha);

        var checkseepass = new ccui.CheckBox();
        checkseepass.loadTextureBackGround("home_signup_noseepass.png", ccui.Widget.PLIST_TEXTURE);
        checkseepass.loadTextureFrontCross("home_signup_seepass.png", ccui.Widget.PLIST_TEXTURE);
        checkseepass.setAnchorPoint(cc.p(0.5, 0.5));
        checkseepass.setPosition(cc.p(tf_bg1.x + tf_bg1.width/2 + 50, tf_bg3.y + tf_bg3.height/2));
        forebg.addChild(checkseepass);
        checkseepass.addEventListener(function (target,event) {
            if(event == ccui.CheckBox.EVENT_SELECTED)
            {
                passwordDkyText.setPasswordEnable(false);
            }
            else
            {
                passwordDkyText.setPasswordEnable(true);
            }
        });



        var checkacc = new cc.Sprite("#home_signup_uncheck1.png");
        checkacc.setAnchorPoint(cc.p(0.5, 0.5));
        checkacc.setPosition(cc.p(tf_bg1.x + tf_bg1.width/2 + 50, tf_bg1.y + tf_bg1.height/2));
        forebg.addChild(checkacc);
        checkacc.setVisible(false);
        this.checkacc = checkacc;

        var checknamedisplay = new cc.Sprite("#home_signup_uncheck1.png");
        checknamedisplay.setAnchorPoint(cc.p(0.5, 0.5));
        checknamedisplay.setPosition(cc.p(tf_bg1.x + tf_bg1.width/2 + 50, tf_bg2.y + tf_bg2.height/2));
        forebg.addChild(checknamedisplay);
        checknamedisplay.setVisible(false);
        this.checknamedisplay = checknamedisplay;


        var tit_dieukien = new ccui.Button("home_lbdieukhoan.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tit_dieukien.setAnchorPoint(cc.p(0.0, 0.5));
        tit_dieukien.setZoomScale(0);
        tit_dieukien.setPosition(cc.p(200, 45));
        // tit_dieukien.addClickEventListener(function () {
        //     var popdkhoan = new DieuKhoanDialog();
        //     popdkhoan.show();
        // });
        forebg.addChild(tit_dieukien);


        this.checkBox = new ccui.CheckBox();
        this.checkBox.loadTextureBackGround("home_signup_uncheck.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.loadTextureFrontCross("home_signup_check.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.setPosition(cc.p(160, 45));
        forebg.addChild( this.checkBox);
        // this.checkBox.setSelected(cc.Global.GetSetting("savePassword", true));
        this.checkBox.addEventListener(function (target,event) {
            // cc.Global.SetSetting("savePassword", event == ccui.CheckBox.EVENT_SELECTED);
            // if(event == ccui.CheckBox.EVENT_SELECTED)
            // {
            //
            // }
        });


        this.btn_dky.addClickEventListener(function () {
            var username = thiz.userDkyText.getText();
            var nikname = thiz.niknameDkyText.getText();
            var password = thiz.passwordDkyText.getText();
            var capchatext = thiz.recapchaText.getText();
            if(!username && username.length === 0){
                MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
                thiz.showUsernameIsWrong();
                thiz.userDkyText.showKeyboard();
                return;
            }

            if(!username && username.length < 6){
                MessageNode.getInstance().show("Tài khoản từ 6 - 16 kí tự");
                thiz.showUsernameIsWrong();
                thiz.userDkyText.showKeyboard();
                return;
            }

            if(!nikname && nikname.length === 0){
                MessageNode.getInstance().show("Bạn phải nhập tên hiển thị");
                thiz.showDisplaynameIsWrong();
                thiz.niknameDkyText.showKeyboard();
                return;
            }

            if(username === nikname){
                MessageNode.getInstance().show("Tài khoản và tên hiển thị không được giống nhau");
                thiz.showDisplaynameIsWrong();
                thiz.niknameDkyText.showKeyboard();
                return;
            }

            if(password === username){
                MessageNode.getInstance().show("Tài khoản và mật khẩu không được giống nhau");
                thiz.passwordDkyText.showKeyboard();
                return;
            }

            if(!password && password.length === 0){
                MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
                thiz.passwordDkyText.showKeyboard();
                return;
            }

            // if(repassword !== password)
            // {
            //     MessageNode.getInstance().show("Mật khẩu không giống nhau");
            //     thiz.repasswordDkyText.showKeyboard();
            //     return;
            // }


            if(!capchatext && capchatext.length === 0)
            {
                MessageNode.getInstance().show("Bạn chưa nhập mã xác nhận");
                thiz.recapchaText.showKeyboard();
                return;
            }

            if(!thiz.checkBox.isSelected())
            {
                MessageNode.getInstance().show("Bạn chưa đồng ý điều khoản sử dụng");
                return;
            }

            // if(!thiz.isPasswordOK(password))
            // {
            //     MessageNode.getInstance().show("Mật khẩu phải có cả số và chữ.");
            //     thiz.repasswordDkyText.showKeyboard();
            //     return;
            // }
            //LoadingDialog.getInstance().show("Đang đăng ký");
            SocketClient.getInstance().sendRegister(username, password, thiz.captchaView.captchaKey, capchatext, nikname);
        });


        userDkyText.setTextChangeListener(function (type, newString) {
            userDkyText.setText(newString);
            thiz.checkacc.setVisible(false);
            return true;
        });

        niknameDkyText.setTextChangeListener(function (type, newString) {
            niknameDkyText.setText(newString);
            thiz.checknamedisplay.setVisible(false);
            return true;
        });

    },

    _onRegister : function (cmd, data) {
        if(data){
            var status = data["status"];
            this.recapchaText.setText("");
            this.captchaView.sendGetCapcha();
            if(status === 0)
            {
                this.hide();
            }
            else if(status === 3 || status === 5 || status === 6 || status === 8 || status == 32)
            {
                this.showUsernameIsWrong();
                this.userDkyText.showKeyboard();
            }
            else if(status === 9)
            {
                this.showUsernameIsWrong();
                this.showDisplaynameIsWrong();
                this.userDkyText.showKeyboard();
            }
            else if(status === 11 || status === 12 || status === -1)
            {
                this.showDisplaynameIsWrong();
                this.niknameDkyText.showKeyboard();
            }
            else if(status === 7 || status === 31 || status === 33)
            {
                this.passwordDkyText.showKeyboard();
            }

        }
    },


    showUsernameIsWrong : function () {
        this.checkacc.setVisible(true);
        this.checkacc.setSpriteFrame("home_signup_uncheck1.png");
    },
    showDisplaynameIsWrong : function () {
        this.checknamedisplay.setVisible(true);
        this.checknamedisplay.setSpriteFrame("home_signup_uncheck1.png");
    },

    isPasswordOK : function(str) {
        if(str.match(/[a-zA-Z]/) && str.match(/[0-9]/))
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    onEnter : function () {
        this._super();
        // SoundPlayer.playSoundLoop("nhacnen_dky");
        SocketClient.getInstance().addHTTPListener("register", this._onRegister, this);
    },

    onExit : function () {
        this._super();
        // SoundPlayer.stopAllSound();
        SocketClient.getInstance().removeListener(this);
    }

});