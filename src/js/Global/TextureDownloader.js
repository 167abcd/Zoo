/**
 * Created by ext on 5/31/2017.
 */
var TextureDownloader = TextureDownloader || {};
//var s_TextureDownloaderCache = s_TextureDownloaderCache || {};

TextureDownloader.load = function (url, callback, isCache) {
    if(cc.sys.isNative){
        TextureDownloader._loadNative(url, callback,isCache);
    }
    else{
        TextureDownloader._loadWeb(url, callback);
    }
};

TextureDownloader._getUrlSec = function (url) {
    var url1 = url.substring(4, url.length);
    if(url1[0] === 's'){
        return url;
    }
    return ("https" + url1);
};

TextureDownloader._getUrlNotSec = function (url) {
    var url1 = url.substring(4, url.length);
    if(url1[0] !== 's'){
        return url;
    }
    return ("http" + url.substring(5, url.length));
};

TextureDownloader._loadNative = function (url, callback, isCache) {
    var textureInCache = cc.textureCache.getTextureForKey(url);
    if(textureInCache){
        callback(textureInCache);
        return;
    }
    ext.ResourcesDownloader.loadTexture(url, function (texture) {
        callback(texture);
    }, isCache);
};

TextureDownloader._callback = {};

TextureDownloader._loadWeb = function (url, callback) {
    var textureInCache = cc.textureCache.getTextureForKey(url);
    if(textureInCache){
        callback(textureInCache);
        return;
    }

    if(TextureDownloader._callback[url]){
        TextureDownloader._callback[url].push(callback);
        return;
    }

    TextureDownloader._callback[url] = [];
    TextureDownloader._callback[url].push(callback);

    cc.loader.loadImg(url, function (err, texture) {
        var arr = TextureDownloader._callback[url];
        if(err){
            for(var i=0;i<arr.length;i++){
                arr[i] (null);
            }
        }
        else{
            cc.textureCache.cacheImage(url, texture);
            for(var i=0;i<arr.length;i++){
                arr[i] (texture);
            }
        }
        TextureDownloader._callback[url] = [];
    });
};