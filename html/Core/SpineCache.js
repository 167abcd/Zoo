/**
 * Created by cocos2d on 6/22/2017.
 */

var SpineDataItem = cc.Class.extend({
    ctor : function (name) {
        this.spineName = name;
        SpineCache.getInstance().addItem(this.spineName, this);
    },

    _initWithData : function (data) {
        this._jsonFile = data["json"];
        this._atlasFile = data["atlas"];
        this._texture = [];
        var _tex = data["texture"];
        for(var i=0;i<_tex.length;i++){
            this._texture.push(_tex[i]);
        }
    },

    _load : function () {
        var data = cc.loader.getRes(this._atlasFile);
        sp._atlasLoader.setAtlasFile(this._atlasFile);
        var atlas = new spine.TextureAtlas(data, sp._atlasLoader.load.bind(sp._atlasLoader));
        this._atlasData = atlas;

        var attachmentLoader = new spine.AtlasAttachmentLoader(this._atlasData);
        var skeletonJsonReader = new spine.SkeletonJson(attachmentLoader);
        skeletonJsonReader.scale = 1.0;

        var skeletonJson = cc.loader.getRes(this._jsonFile);
        var skeletonData = skeletonJsonReader.readSkeletonData(skeletonJson);
        this._atlasData.dispose(skeletonJsonReader);

        this._defaultSkeletonData = skeletonData;


    },

    _createNewAnimation : function (scale) {
        scale =  scale || 1 / cc.director.getContentScaleFactor();
        if(scale === 1.0){
            return new sp.SkeletonAnimation(this._defaultSkeletonData, false);
        }
        else{
            var attachmentLoader = new spine.AtlasAttachmentLoader(this._atlasData);
            var skeletonJsonReader = new spine.SkeletonJson(attachmentLoader);
            skeletonJsonReader.scale = scale;

            var skeletonJson = cc.loader.getRes(this._jsonFile);
            var skeletonData = skeletonJsonReader.readSkeletonData(skeletonJson);
            this._atlasData.dispose(skeletonJsonReader);

            return new sp.SkeletonAnimation(skeletonData, true);
        }
    }
});

var SpineCache = (function() {
    var instance = null;

    var Clazz = cc.Class.extend({
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this._itemCache = {};
            }
        },

        addItem : function (name, spineDataItem) {
            this._itemCache[name] = spineDataItem;
        },
        
        getItem : function (name) {
            return this._itemCache[name];
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

sp.SkeletonAnimation.createWithCache = function (spineName, scale) {
    var spineData = SpineCache.getInstance().getItem(spineName);
    if(spineData){
        return spineData._createNewAnimation(scale);
    }
    return null;
};