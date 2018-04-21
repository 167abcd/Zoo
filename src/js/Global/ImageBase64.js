
var ImageBase64 = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5,0.5));
        this._maxSize = null;
    },

    _setSprite : function (mSprite) {
        if(mSprite === null){
            cc.log("[ImageBase64] cannot render");
            return;
        }

        if(this.mSprite){
            this.mSprite.removeFromParent(true);
            this.mSprite = null;
        }

        if(this._maxSize){
            var ratioX = mSprite.getContentSize().width / this.getContentSize().width;
            var ratioY = mSprite.getContentSize().height / this.getContentSize().height;
            var ratio = ratioX < ratioY ? ratioX : ratioY;
            if(ratio < 1.0){
                mSprite.setScale(ratio);
            }
        }
        else{
            this.setContentSize(mSprite.getContentSize());
        }
        this.mSprite = mSprite;
        mSprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(mSprite);
    },
    
    setImageData : function (base64) {
        var thiz = this;

        if(cc.sys.isNative){
            var tex = SystemPlugin.getInstance().textureFromBase64(base64);
            if(tex){
                thiz._setSprite(new cc.Sprite(tex));
            }
            else{
                thiz._setSprite(null);
            }
        }
        else{
            cc.loader.loadImg('data:image/png;base64,' + base64, {isCrossOrigin : false }, function(err, img){
                if(err){
                    thiz._setSprite(null);
                }
                else{
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    thiz._setSprite(new cc.Sprite(texture2d));
                }
            });
        }
    },

    setMaxContentSize: function (size) {
        this._maxSize = cc.size(size);
        this.setContentSize(size);
    }
});