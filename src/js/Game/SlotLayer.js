/**
 * Created by qkk on 12/20/2016.
 */

var SlotItem = cc.Sprite.extend({

    ctor: function (fileName, id) {
        this._super(fileName);
        this.BONCE_TAG = 100;
        this.finalPos =  cc.p(0,0);
        this.idItem = id;
        this.resetAll();
                            
    },
    swapTexture:function (newTexture, idItem) {
        this.idItem = idItem;
        newTexture = newTexture.replace("#","");
        this.setSpriteFrame(newTexture);
    },

    setFinalPos:function (p) {
        this.finalPos = p;
    },
    getFinalPos : function( ) {
        // pos show result sau moi lan spin
        return this.finalPos;
    },
    setWaitToShow : function( b) {
        this.waitToShow = b;
    },
    resetAll : function( ) {
        // do not reset finalPos
        this.waitToShow = false;
        this.bounceTop =.2;
        this.bounceBot =this.bounceTop;
        this.stopUpdatePos = false;
        this.setScale(1);
        this.stopActionByTag(this.BONCE_TAG);
        
    },
    runBounceToFinish : function( ) {
        this.stopUpdatePos = true;
        this.stopActionByTag(this.BONCE_TAG);
        
        var ac1 = cc.moveBy(.1, cc.p(0, -20));
        var ac2 = cc.moveBy(.1, cc.p(0, 20));

        this.bounceAction = this.runAction( cc.sequence(ac1, ac2 ) );
        this.bounceAction.setTag(this.BONCE_TAG);
    }
});



var SlotLayer = cc.Node.extend({
    ctor: function (row, col) {
        this._super();
        var nodeSlot = new ccui.Layout();
        nodeSlot.setAnchorPoint(cc.p(0,0));
        nodeSlot.setClippingEnabled(true);

        this.addChild(nodeSlot);
        this.nodeSlot = nodeSlot;
        this.row = row;
        this.col = col;

    },

    newItem:function (name, idItem) {
        return new SlotItem(name, idItem);
    },


});
