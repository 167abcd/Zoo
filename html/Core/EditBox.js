/**
 * Created by cocos2d on 11/9/2016.
 */

var newui = newui || {};
newui.EditBox = cc.EditBox.extend({
    ctor : function (size, fontName, fontSize, placeHolderFontName, placeHolderFontSize) {
        this._super(size, null, null, null);
        this.setContentSize(size);
        this.setDelegate(this);
        this._returnCallback = null;
        this.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        if(fontName){
            this.setFont(fontName, fontSize);
            if(placeHolderFontName === undefined){
                placeHolderFontName = fontName;
                placeHolderFontSize = fontSize;
            }
            this.setPlaceholderFont(placeHolderFontName, placeHolderFontSize);
        }
    },

    _createRenderCmd: function () {
        var thiz = this;

        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var renderCmd = new cc.EditBox.CanvasRenderCmd(this);
        } else {
            var renderCmd = new cc.EditBox.WebGLRenderCmd(this);
        }

        var _createLabels = renderCmd._createLabels;
        renderCmd._createLabels = function () {
            if(this._clippingNode === undefined){
                var clipping = new ccui.Layout();
                clipping.setContentSize(thiz.getContentSize());
                clipping.setClippingEnabled(true);
                thiz.addChild(clipping, 100);
                this._clippingNode = clipping;
            }

            if (!this._textLabel) {
                this._textLabel = new cc.LabelTTF();
                this._textLabel.setAnchorPoint(cc.p(0, 0.5));
                this._clippingNode.addChild(this._textLabel, 1);
            }

            if (!this._placeholderLabel) {
                this._placeholderLabel = new cc.LabelTTF();
                this._placeholderLabel.setAnchorPoint(cc.p(0, 0.5));
                this._placeholderLabel.setColor(cc.color.GRAY);
                this._clippingNode.addChild(this._placeholderLabel, 0);
            }
            _createLabels.apply(renderCmd, arguments);
        };

        renderCmd._removeLabels = function () {
            if (!this._textLabel) return;
            this._textLabel.removeFromParent(true);
            this._textLabel = null;
        };

        renderCmd._updateLabelPosition = function (editBoxSize) {
            this._clippingNode.setContentSize(editBoxSize);
            this._textLabel.setPosition(2, this._clippingNode.height/2);
            this._placeholderLabel.setPosition(2, this._clippingNode.height/2);
        };

        var _createDomInput = renderCmd._createDomInput;
        renderCmd._createDomInput = function () {
            _createDomInput.apply(renderCmd, arguments);
            thiz._initTabKeyEvent();
        };

        var _createDomTextArea = renderCmd._createDomTextArea;
        renderCmd._createDomTextArea = function () {
            _createDomTextArea.apply(renderCmd, arguments);
            thiz._initTabKeyEvent();
        };

        return renderCmd;
    },

    _initTabKeyEvent: function () {
        var thiz = this;
        thiz.keyDownFunc = function (evt) {
            if (evt && evt.keyCode === cc.KEY.tab) {
                if(thiz._onKeyTabEvent()){
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            }
        };
        this._renderCmd._edTxt.addEventListener('keydown', thiz.keyDownFunc);
    },

    editBoxEditingDidBegin: function (sender) {},
    editBoxEditingDidEnd: function (sender) {},
    editBoxTextChanged: function (sender, text) {},
    editBoxReturn: function (sender) {
        if(this._returnCallback){
            this._returnCallback();
        }
    },

    _onKeyTabEvent: function () {
        if(this.nextTextField){
            if(this.nextTextField.showKeyboard){
                var thiz = this;
                setTimeout(function () {
                    thiz.nextTextField.showKeyboard();
                }, 0);
                return true;
            }
        }
        return false;
    },

    setReturnCallback: function (cb) {
        this._returnCallback = cb;
    },

    getText: function () {
        return this.getString();
    },
    setText: function (txt) {
        this.setString(txt);
    },
    showKeyboard: function () {
        this._renderCmd._beginEditing();
    },

    setTextColor: function (color) {
        this.setFontColor(color);
    },
    setPlaceHolderColor: function (color) {
        this.setPlaceholderFontColor(color);
    },
    setPasswordEnable: function (enable) {
        this.setInputFlag(enable?cc.EDITBOX_INPUT_FLAG_PASSWORD : cc.EDITBOX_INPUT_FLAG_SENSITIVE);
    },
    setAlignment: function () {

    },

    initWithSize : function(size){

    },

    setBackgoundMargin : function(left,top,right,bottom){

    }
});

newui.EditBox.prototype.create = function (size) {
    return newui.EditBox(size);
};