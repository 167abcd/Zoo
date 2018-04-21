/**
 * Created by ext on 10/5/2016.
 */

var xocdia_chip_color = xocdia_chip_color ||
    [
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff"
    ];

var XocDiaChip = ChipButton.extend({
    ctor : function (index) {
        this._super();
        this.chipIndex = index;

        var normalSprite = new cc.Sprite("#xocdia-chip-"+index+".png");
        var selectedSprite = new cc.Sprite("#xocdia-chipSelected-"+index+".png");
        this.addChild(normalSprite);
        this.addChild(selectedSprite);
        this.normalSprite = normalSprite;
        this.selectedSprite = selectedSprite;

        var label = cc.Label.createWithBMFont("res/Texture/XocDia/xocdia_chip_font.fnt", "50");
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(3, 7);
        label.setColor(cc.color(xocdia_chip_color[index-1]));
        this.addChild(label);
        this.label = label;

        var s = normalSprite.getContentSize();
        this.rectTouch = cc.rect(-s.width/2, -s.height/2, s.width, s.height);

        selectedSprite.visible = false;
    },
    select : function (isForce) {
        this._super();
        this.normalSprite.visible = false;
        this.selectedSprite.visible = true;
     //   this.label.setOpacity(255);
        var dy = 25.0 ;//* cc.winSize.screenScale;

        this.stopAllActions();
        var move1 = new cc.MoveTo(0.3, cc.p(this.x, this.originPoint.y + dy));
        var move2 = new cc.MoveTo(0.3, cc.p(this.x, this.originPoint.y));
        var move = new cc.Sequence(new cc.EaseSineOut(move1), new cc.EaseSineIn(move2));
        this.runAction(new cc.RepeatForever(move));
    },
    unSelect : function (isForce) {
        this._super();
        this.normalSprite.visible = true;
        this.selectedSprite.visible = false;
     //   this.label.setOpacity(125);

        this.stopAllActions();
        this.setPositionY(this.originPoint.y);
    },
    
    setGold : function (gold) {
        this.label.setString(cc.Global.NumberFormat2(gold));
    }
});