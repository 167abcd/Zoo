/**
 * Created by ext on 7/16/2016.
 */

var UserAvatar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this._initAvatar();
        this._setDefaultAvatar();

        var bg = new cc.Sprite("#avatarDefault_bg_1.png");
        bg.setPosition(this.width/2, this.height/2);
        this.addChild(bg);
    },

    _initAvatar : function () {
        var defaultAvatar = new cc.Sprite("#avatarDefault.png");
        this.setContentSize(defaultAvatar.getContentSize());
        defaultAvatar.setPosition(this.width/2, this.height/2);
        this.addChild(defaultAvatar);
        this.defaultAvatar = defaultAvatar;

        this._initClipper();
    },
    
    _initClipper : function () {
        var defaultAvatar = new cc.Sprite("#avatarDefault.png");
        var stencil = new cc.Node();
        stencil.addChild(defaultAvatar);
        stencil.retain();

        var clipper = new cc.ClippingNode(stencil);
        clipper.setContentSize(defaultAvatar.getContentSize());
        clipper.setAlphaThreshold(0.05);
        clipper.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(clipper);

        this.clipper = clipper;
    },

    _setDefaultAvatar : function () {
        this.defaultAvatar.setVisible(true);
        this.clipper.setVisible(false);
        if(this.avatarImg){
            this.avatarImg.removeFromParent(true);
            this.avatarImg = 0;
        }
    },
    
    _setAvatarWithTexture : function (texture) {
        if(this.avatarImg){
            this.avatarImg.removeFromParent(true);
            this.avatarImg = 0;
        }

        this.clipper.setVisible(true);
        this.defaultAvatar.setVisible(false);

        var newAvt = new cc.Sprite(texture);
        this.clipper.addChild(newAvt);
        this.avatarImg = newAvt;

        var scaleX = this.width / newAvt.width;
        var scaleY = this.height / newAvt.height;
        if(scaleX < 1.0 && scaleY < 1.0){
            var scale = scaleX > scaleY ? scaleX : scaleY;
        }
        else{
            var scale = scaleX < scaleY ? scaleX : scaleY;
        }
        newAvt.setScale(scale);

        cc.log("w: " + newAvt.width);
        cc.log("h: " + newAvt.height);
    },

    setAvatar : function (url) {
        if(!url || url == ""){
            return;
        }

        this._setDefaultAvatar();
        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            if(tex){
                thiz._setAvatarWithTexture(tex);
            }
        });
    },
    
    setAvatarMe : function () {
        this.setAvatar(PlayerMe.avatar);
    }
});

var UserAvatarMe = UserAvatar.extend({
    ctor : function () {
        this._super();
        this.setAvatarMe();
    },

    onEnter : function () {
        this._super();
        SocketClient.getInstance().addListener("avatarUpdated", this.setAvatarMe, this);
    },

    onExit : function () {
        this._super();
        SocketClient.getInstance().removeListener(this);
    }
});

UserAvatar.createMe = function () {
    var avt = new UserAvatarMe();
    return avt;
};

UserAvatar.createAvatar = function () {
    var avt = new UserAvatar();
    return avt;
};

UserAvatar.createAvatarWithId = function (avatarId) {
    var avt = new UserAvatar();
    avt.setAvatar(avatarId);
    return avt;
};
