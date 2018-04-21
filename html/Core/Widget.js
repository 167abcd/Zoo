/**
 * Created by cocos2d on 11/9/2016.
 */
var newui = newui || {};
newui.Widget = ccui.Widget.extend({
    ctor : function (containerSize) {
        ccui.Widget.prototype.ctor.call(this);
        this.ignoreContentAdaptWithSize(true);

        this.setVirtualRendererSize(containerSize);
    },
    setVirtualRendererSize : function (containerSize) {
        this._vitualSize = cc.size(containerSize);
        this.setContentSize(containerSize);
    },
    getVirtualRendererSize : function () {
        if(this._vitualSize){
            return cc.size(this._vitualSize);
        }
        else{
            return ccui.Widget.prototype.getVirtualRendererSize.call(this);
        }
    }
});

//add hover event
(function () {
    cc.Node.prototype.setMouseOverEnable = function () {
        var thiz = this;
        thiz._isMouseEnter = false;
        if(thiz._onMouseOver === undefined){
            thiz._onMouseOver = function (isOver) {
                cc.log("_onMouseOver:" + isOver);
            };
        }

        if(thiz._onMouseMove === undefined){
            thiz._onMouseMove = function (event) {

                var locationInNode = this.convertToNodeSpace(event.getLocation());
                var rect = cc.rect(0, 0, this.width, this.height);

                var mouseOver = false;
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    mouseOver = true;
                    //ccui.Widget
                    if(thiz.isClippingParentContainsPoint && !thiz.isClippingParentContainsPoint(event.getLocation())){
                        mouseOver = false;
                    }
                }

                if (this._isMouseEnter !== mouseOver) {
                    this._isMouseEnter = mouseOver;
                    if (this._onMouseOver) {
                        this._onMouseOver(mouseOver);
                    }
                }
                return mouseOver;
            }
        }

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var node = thiz;
                while(node){
                    if(node.isVisible() === false){
                        return false;
                    }
                    node = node.getParent();
                }

                if(event._isSwallowMouseEvent !== true){
                    if(thiz._onMouseMove(event)){
                        event._isSwallowMouseEvent = true;
                    }
                }
                else{
                    if(thiz._isMouseEnter === true){
                        thiz._isMouseEnter = false;
                        if (thiz._onMouseOver) {
                            thiz._onMouseOver(false);
                        }
                    }
                }
            }
        },this);
    };

    //add for button
    ccui.Widget.prototype._onMouseOver = function(isOver){
        if(this.isEnabled() && this.isTouchEnabled()){
            if(isOver){
                this._onPressStateChangedToPressed();
            }
            else{
                this._onPressStateChangedToNormal();
            }
        }
    };

    ccui.Widget.prototype.setMouseOverEnable = function () {
        if(this.isRunning()){
            cc.Node.prototype.setMouseOverEnable.apply(this, arguments);
        }
        this._isMouseOverEnable = true;
    };

    var uiWidgetOnEnter = ccui.Widget.prototype.onEnter;
    ccui.Widget.prototype.onEnter = function () {
        uiWidgetOnEnter.apply(this, arguments);
        if(this._isMouseOverEnable){
            this.setMouseOverEnable();
        }
    };

    var uiButtonCtor = ccui.Button.prototype.ctor;
    ccui.Button.prototype.ctor = function () {
        uiButtonCtor.apply(this, arguments);
        this.setMouseOverEnable();
    };
})();