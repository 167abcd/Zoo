
var cc = cc || {};
cc.ImageBitmap = cc.Class.extend({
    ctor : function (data) {
        this.srcData = null;
        this.width = 0;
        this.height = 0;
        this.srcData = data;
    },

    initWithImageData : function (base64Data) {

    },

    crop : function (newImgRect, callback) {
        newImgRect.width = Math.floor(newImgRect.width);
        newImgRect.height = Math.floor(newImgRect.height);
        newImgRect.x = Math.floor(newImgRect.x);
        newImgRect.y = Math.floor(newImgRect.y);

        //converto to opengl
        newImgRect.y = this.getHeight() - newImgRect.y - newImgRect.height;

        if (newImgRect.x < 0){
            newImgRect.x = 0;
        }

        if (newImgRect.y < 0){
            newImgRect.y = 0;
        }

        if (cc.rectGetMaxX(newImgRect) > this.getWidth()){
            newImgRect.width -= (cc.rectGetMaxX(newImgRect) - this.getWidth());
        }

        if (cc.rectGetMaxY(newImgRect) > this.getHeight()){
            newImgRect.height -= (cc.rectGetMaxY(newImgRect) - this.getHeight());
        }

        var canvas = document.createElement("canvas");
        canvas.width = newImgRect.width;
        canvas.height = newImgRect.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.srcData, newImgRect.x, newImgRect.y, newImgRect.width, newImgRect.height, 0, 0, newImgRect.width, newImgRect.height);

        var thiz = this;
        var newImage = document.createElement("img");
        newImage.onload = function () {
            thiz.srcData = newImage;
            if(callback){
                callback(thiz);
            }
        };
        newImage.src = ctx.canvas.toDataURL("image/jpeg");
    },

    resizeTo : function (mSize, callback) {
        mSize.width = Math.floor(mSize.width);
        mSize.height = Math.floor(mSize.height);

        var canvas = document.createElement("canvas");
        canvas.width = mSize.width;
        canvas.height = mSize.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.srcData, 0, 0, mSize.width, mSize.height);

        var thiz = this;
        var newImage = document.createElement("img");
        newImage.onload = function () {
            thiz.srcData = newImage;
            if(callback){
                callback(thiz);
            }
        };
        newImage.src = ctx.canvas.toDataURL("image/jpeg");
    },

    getWidth : function () {
        if(this.srcData){
            return this.srcData.width;
        }
        return this.width;
    },

    getHeight : function () {
        if(this.srcData){
            return this.srcData.height;
        }
        return this.height;
    },

    saveToJPEG : function () {
        if(this.srcData){
            var src = this.srcData.src;
            //return src;
            return src.replace("data:image/jpeg;base64,", "");
        }
        return "";
    },

    createTexture : function () {

    },

    retain : function () {
    },
    release : function () {
    }
});