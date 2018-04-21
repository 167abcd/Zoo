/**
 * Created by cocos2d on 11/9/2016.
 */
var SystemPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                //init
            }
        },

        getPackageName :function () {
            return "com.bin.web";
        },

        getVersionName : function () {
            return "1.0.0";
        },

        getDeviceUUID: function () {
            if(SystemPlugin._fingerprint2_uniqueId){
                return SystemPlugin._fingerprint2_uniqueId;
            }
            else{
                var uniqueId = localStorage.getItem("___uniqueId___");
                if (!uniqueId) {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                    }
                    uniqueId = (function () {
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                    })();
                    localStorage.setItem("___uniqueId___", uniqueId);
                }
                return uniqueId;
            }
        },

        getDeviceUUIDWithKey: function (key) {
            return this.getDeviceUUID();
        },

        buyIAPItem : function (itemBundle) {

        },

        iOSInitStore : function (itemList) {

        },

        //event
        // onBuyItemFinishAndroid : function (returnCode, signature, json) {
        //
        // },
        //
        // onBuyItemFinishIOS : function (returnCode, signature) {
        //
        // },
        //
        // onRegisterNotificationSuccess : function (deviceId, token) {
        //
        // },
        exitApp : function () {

        },
        enableMipmapTexture : function (texture) {
            if(cc._renderType === cc.game.RENDER_TYPE_WEBGL){
                var tex = cc.textureCache.getTextureForKey(texture);
                if(tex){
                    tex.generateMipmap();
                    tex.setAntiAliasTexParameters();
                    tex.setTexParameters(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
                }
            }
        },
        showCallPhone : function (phoneNumber) {

        },
        androidRequestPermission : function (permissions, requestCode) {

        },
        androidCheckPermission : function (permission) {

        },
        startLaucher : function () {

        },
        checkFileValidate : function (file) {

        },
        showSMS : function (smsNumber, smsContent) {

        },
        getCarrierName : function () {

        },
        getPushNotificationToken : function () {

        },
        downloadFile : function (url, savePath, callback) {

        },

        _htmlProcressImageSelect: function (imgData, maxWidth, maxHeight, requireRatio) {
            var thiz = this;

            var img = document.createElement("img");
            img.onload = function () {
                if(requireRatio && requireRatio > 0){
                    var maxRatio = requireRatio > 1.0 / requireRatio ? requireRatio : 1.0 / requireRatio;
                    var minRatio = requireRatio < 1.0 / requireRatio ? requireRatio : 1.0 / requireRatio;
                    var imgRatio = img.width / img.height;
                    if(imgRatio > maxRatio || imgRatio < minRatio){
                        thiz.onTakeImageData("invalid_ratio");
                        return;
                    }
                }

                if(maxWidth === undefined || !maxWidth){
                    maxWidth = img.width;
                    maxHeight = img.height;
                }
                var width = img.width;
                var height = img.height;

                var ratioX = maxWidth/width;
                var ratioY = maxHeight/height;
                var ratio = ratioX < ratioY ? ratioX :ratioY;
                if(ratio < 1.0){
                    width *= ratio;
                    height *= ratio;
                }

                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                var newImage = document.createElement("img");
                newImage.onload = function () {
                    var imgBitmap = new cc.ImageBitmap(newImage);
                    thiz.onTakeImageData(imgBitmap);
                };
                newImage.src = ctx.canvas.toDataURL("image/jpeg");
            };
            img.src = imgData;
        },

        showImagePicker : function (maxWidth, maxHeight, maxRatio) {
            var thiz = this;
            var imagePicker = document.getElementById("imageSelected");
            if(imagePicker === undefined || imagePicker === null){
                imagePicker = document.createElement("INPUT");
                imagePicker.type = "file";
                imagePicker.accept = "image/*";
                imagePicker.style.display = "none";
                imagePicker.id = "imageSelected";
                document.body.appendChild(imagePicker);
            }
            imagePicker.onchange = function (e) {
                if(imagePicker.files && imagePicker.files.length === 1){
                    var reader  = new FileReader();
                    reader.addEventListener("load", function (e) {
                       thiz. _htmlProcressImageSelect(reader.result, maxWidth, maxHeight, maxRatio);
                    }, false);

                    reader.readAsDataURL(imagePicker.files[0]);
                }
                e.target.value = '';
            };
            imagePicker.click();
        },
        onTakeImageData : function (base64Data) {
            cc.log(base64Data);
        },
        copyTextClipboard: function (content) {
            var textCopy = document.getElementById("TextToClipboard");
            if(textCopy === null || textCopy === undefined){
                textCopy = document.createElement("TEXTAREA");
                textCopy.id = "TextToClipboard";
                textCopy.style.display = "none";
                textCopy.style.zIndex = 10;
                textCopy.value = "Hello I'm some text";
                document.body.appendChild(textCopy);
            }

            try {
                textCopy.style.display = "block";
                textCopy.value = content;
                textCopy.select();
                document.execCommand('copy');
                textCopy.value = "";
            } catch (err) {
                cc.log(err);
            }
            textCopy.style.display = "none";
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };
    return Clazz;
})();

(function () {
    SystemPlugin._fingerprint2_uniqueId = null;
    new Fingerprint2().get(function(result, components){
        // console.log(result); //a hash, representing your device fingerprint
        // console.log(components); // an array of FP components
        SystemPlugin._fingerprint2_uniqueId = result;
    });
})();
