/**
 * Created by kk on 2/2/18.
 */
var SlotLblBmt = cc.LabelBMFont.extend({
    ctor: function (str, fntFile, width, alignment, imageOffset) {
        this._super(str, fntFile, width, alignment, imageOffset);
        this.gold = 0;
    },
    setTotalGoldWithEffect : function ( currGold, targetGold) {
        if(currGold == targetGold) return;
        this.gold = targetGold;
        this.stopActionByTag(100);
        //this.setString("0");
        var ac =new cc.ActionNumber(1,targetGold);
        this.timerGoldEffect = this.runAction(ac);
        this.timerGoldEffect.setTag(100);
    },
    hideAll : function () {
        /*if(this.timerGoldEffect){
            this.stopAction(this.timerGoldEffect);
            this.timerGoldEffect = null;
        }*/
        this.stopActionByTag(100);
        this.setString("");
    }
});


cc.ActionTimeRemaining2 = cc.CustomAction.extend({
    ctor : function (duration, cb, cbTarget) {
        this._super();
        this._fromNumber = duration;
        this._currentNumber = this._fromNumber;
        this.initWithDuration(duration);
        this.cb = cb;
        this.cbTarget =cbTarget;
    },

    onUpdate : function (dt) {
        var number = Math.ceil((1.0 - dt) * this._fromNumber);
        if(number == this._currentNumber){
            return;
        }
        this._currentNumber = number;
        this._target.setString("Tự động chơi sau "+number.toString());
        if(this.isDone() || this._currentNumber == 0){
            this._target.setString("");
            if(this.cb && this.cbTarget) this.cb(this.cbTarget);
            this.cb = null;
        }
    },

    onStartWithTarget : function (target) {
        this._target = target;
        this._target.setString("Tự động chơi sau "+this._fromNumber.toString());
    }
});
var SlotLbl = cc.LabelTTF.extend({
    ctor: function (str, fntFile, fntSize) {
        this._super(str, fntFile, fntSize);
        this.gold = 0;
        this.timerGoldEffect =null;
        //this.setString(""+this.gold);
    },
    setTotalGoldWithEffect : function ( currGold, targetGold) {
        this.setVisible(true);
        if(currGold == targetGold) return;
        this.gold = targetGold;
                                 
                                 this.stopActionByTag(100);
       // this.setString("0");
        var ac = new cc.ActionNumber(1,targetGold);
        this.timerGoldEffect =this.runAction(ac);
                                 this.timerGoldEffect.setTag(100);
    },
    hideAll : function () {
        this.stopActionByTag(200);
        this.stopActionByTag(100);
        // this.setString("");
        this.setVisible(false);
    },
    remainTime : function(delay, duration, cb, cbTarget){
        var thiz = this;
        thiz.cb = cb;
        thiz.stopActionByTag(200);
        this.setString("");
        var ac  = new cc.ActionTimeRemaining2(duration, cb, cbTarget);
        var seq = cc.sequence(cc.delayTime(delay), ac);
        seq.setTag(200);
        this.runAction(seq);
    },
    stopRemainTime : function () {
        this.stopActionByTag(200);
        this.setString("");
    },
});


var MiniGameLbl = cc.LabelBMFont.extend({
    ctor: function (str, fntFile, width, alignment, imageOffset) {
        this._super(str, fntFile, width, alignment, imageOffset);
        this.num = 0;
    },
    setTotal : function(num, strPrifix){
        this.num = num;
        if(!this.strPrifix) this.strPrifix = strPrifix ? strPrifix : "";
        this.setString(this.strPrifix +" "+this.num);
    },
    reduce : function(){
        this.num -=1;
        this.setTotal(this.num);
    },
    add : function(){
        this.num +=1;
        this.setTotal(this.num);
    },
    hideAll : function(){
        this.setString("");
    },


});

var FreeSpinLbl = cc.LayerColor.extend({
    ctor: function (bmtfont, rect, containerImg) {
        this._super(cc.color(0,0,0,0),rect.width,  rect.height);
        var img = containerImg ? containerImg : "#freespin_container.png";
        var bg = new cc.Sprite(img);
        bg.setNormalizedPosition(.5,.5);
        this.addChild(bg);
        // new cc.LabelTTF("10",cc.res.font.Tahoma,20);
        this.lblTotalFreeSpin =  new  cc.LabelBMFont("10", bmtfont); //cc.Label.createWithBMFont("10", bmtfont);
        this.lblTotalFreeSpin.setColor(cc.color("#fff373"));
        this.lblTotalFreeSpin.setAnchorPoint(.5, .5);
        // this.lblTotalFreeSpin.setPosition( rect.x + rect.width/2,rect.y+ rect.height/2 );
        this.lblTotalFreeSpin.setNormalizedPosition(.5,.5);
        this.addChild(this.lblTotalFreeSpin);


        this.numFree = 2;
        this.setTotalFree(this.numFree);

    },
    haveFreeSpin : function(){
        return this.numFree > 0 ? true : false;
    },
    setTotalFree : function(num){
        this.numFree = num;
        this.lblTotalFreeSpin.setString("Lươt quay miễn phí: "+this.numFree);
        if(this.numFree > 0) this.setVisible(true);
        else this.setVisible(false);

    },
    reduce : function(){
        this.numFree -=1;
        this.setTotalFree(this.numFree);
    },
    add : function(){
        this.numFree +=1;
        this.setTotalFree(this.numFree);
    }

});


var SlotNumber  = cc.Sprite.extend({// ccui.Button.extend({
    ctor:function (normalSprite, overSprite) {
        //  this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this._super("#"+normalSprite);
        this.normalSprite = normalSprite;
        this.overSprite = overSprite;
    },
    changeSprite:function (isOver) {
        this.setSpriteFrame(isOver ? this.overSprite : this.normalSprite);
    }
});


var TreasureObject = ccui.Button.extend({
    ctor:function (money, normal, opened, isPlist, size) {
        this.isPlist = isPlist ? isPlist : true;
        this._super(normal, "", "", this.isPlist ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE);
        this.setZoomScale(-0.05);
        if(size) this.setContentSize(size);
        this.normalTexture = normal;
        this.openedTexture = opened;
        var thiz = this;
        this.addClickEventListener(function () {
            thiz._openRuongEffect();
            if(thiz.openHander ) thiz.openHander();
        });

        var light = new cc.Sprite("#effect_treasure.png");
        this.addChild(light, -1);
        light.setNormalizedPosition(.5, .5);
        var ac = cc.rotateBy(5, 720);
        light.runAction(cc.repeatForever(ac));
        light.setVisible(false);
        this.light = light;
        this.money = money;

        var container = new cc.Sprite("#treasure_txt_container.png");
        this.addChild(container);
        container.setAnchorPoint(.5, 1);
        container.setPosition(this.width/2,  -5);

        var lbl = new SlotLbl( cc.Global.NumberFormat1(this.money) , cc.res.font.Tahoma, 18);
        lbl.setColor(cc.color(207,173,86)) ;
        lbl.setAnchorPoint(.5, .5);
        lbl.setNormalizedPosition(.5, .5);
        container.addChild(lbl);
        container.setVisible(false);
        this.container = container;
        this.lbl = lbl;
    },
    _openRuongEffect:function () {
        this.loadTextureNormal(this.openedTexture, this.isPlist ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE);
        this.light.setVisible(true);



        this.showMoney();



     },
    showMoney:function (money) {
        if(money){
            this.money = money;
            this.lbl.setString(cc.Global.NumberFormat1(this.money)) ;
        }
        this.container.setVisible(true);
        this.setTouchEnabled(false);
    }
});


var ResultSpin = function(data,betting, row, col){
    //{"id":200,"c":101,"s":1,"d":{"r":1,"b":9997795,"jp":0,"mg":{"c":0,"x":0,"v":""},"fs":0,"ls":[],"i":"535632273576765"},"m":""}
    // data = {"r":1,"b":9997795,"jp":0,"mg":{"c":0,"x":0,"v":""},"fs":0,"ls":[],"i":"535632273576765"}
    this.dataResult = data;
    this.betting = betting;
    this.totalUserMoney = data["b"];

    this.iconData = [ ];
    for(var j = 0 ; j <col ;j++){
        this.iconData[j] = [];
    }
    var str = data["i"] ? data["i"] : "535632273576765";
    var k = 0;
    for(var i = row-1 ; i >=0 ;i--){
        for(var j = 0 ; j <col ;j++){
            this.iconData[j][i] = parseInt(str.charAt(k)) -1;// server tra ve id tu 1 -> 7 nhung client luu tu 0 ->6
            k++;
        }
    }

    /*for(var i = 0 ; i <row ;i++){
        for(var j = 0 ; j <col ;j++){
            this.iconData[j][i] = data["i"][k] -1;// server tra ve id tu 1 -> 7 nhung client luu tu 0 ->6
            k++;
        }
    }*/


    this.lineWin = [];
    this.arrMoneyWin = [];
    this.totalMoneyWinLines = 0;
    this.lineWinIcon = {};
    if(data.iJ)  data.jp = data.iJ;
    if(!data.ls) data.ls = data.wls;
    var lineCount = data.ls.length;
    if (lineCount > 0) {
        for(var i = 0 ; i <lineCount ;i++){
            var lid = data.ls[i].id ? data.ls[i].id : (data.ls[i].lid +1);
            var m = data.ls[i].crd  ? data.ls[i].crd : data.ls[i].c;
            this.lineWin.push(lid );//id line win server tra ve tu 1->max line
            this.arrMoneyWin.push(m);
            this.totalMoneyWinLines+=m;
            this.lineWinIcon[lid] = data.ls[i]["i"] -1;
        }
        // cc.log(" lineWinIcon "+JSON.stringify(this.lineWinIcon));
    }
    var totalWin = this.totalMoneyWinLines;


    this.canPlayX2Game = data.lsp ?  data.lsp.ex2 : false;
    this.X2Gamedata = data.lsp;

    if (data.mg) {
        this.hasBonusGame = true;
        this.dataBonusGame = data.mg;
        var arrX = data.mg["v"].split("x");
        arrX.shift();//REMOVE 1ST elemtn no slit startwith x thi 1st la ro^ng~
        var c  = data.mg["c"];
        var hs = data.mg["x"];
        var arrTreasureX = data.mg["b"].split("x");
        arrTreasureX.shift();//REMOVE 1ST elemtn no slit startwith x thi 1st la ro^ng~
        var total=0;
        for(var i in arrX) {
            total += parseInt(arrX[i]);
        }
        total+= parseInt(arrTreasureX[0]);
        var moneyMinigame = total* c * hs;
        this.moneyMinigame =moneyMinigame;
        totalWin+=moneyMinigame;
        this.coinBase = c;
        this.dataBonusGame.arrX =arrX;
        this.dataBonusGame.arrTreasureX =arrTreasureX;

        /*mg:{"c":1,"x":5,"v":"x4x6x4x8x8x25"}
        c: coin cơ bản
        x: tỉ lệ nhân
        v: x4x6x4x8x8x25    totalWin minigame = (30*c + 25*c)*X
        x4x6x4x8x8 => kết quả 5 lần mở  => win 5 lan open = 30*c
        x25 => Kết quả lần mở cuối cùng*=> win  25*c

        ====> total win = (30*c + 25*c)*X  /
        this.hasBonusGame = true;
        this.dataBonusGame = data.mg;
        var countIconBonus = 0;
       /* for(var i = 0 ; i < data.sbs.length; i++){
            var item = data.sbs[i];
            if(item == 10){
                countIconBonus += 1;
            }
        };*/
        var countIconBonus = 0;
        if(countIconBonus > 5){
            countIconBonus = 5;
        }
        var arrayHesonhan = [1,2,3];
        switch(countIconBonus){
            case 3:
                arrayHesonhan = [1,2,3];
                break;
            case 4:
                arrayHesonhan = [2,3,4];
                break;
            case 5:
                arrayHesonhan = [3,4,5];
                break;
            default:
                break;
        }
        this.arrayHesonhan = arrayHesonhan;
    }
    this.dataResult.mX = totalWin;

    if (data.fss){
        this.hasFreeSpin = true;
        //add them money win freespin neu no trung bonus game or .... sau
        //this.totalMoneyFreeSpin =this.dataResult.mX;
    }

    //cc.log("just win========== "+ this.dataResult.mX);


    if (data.jp)
        this.isJackPot = true;
    if (this.totalMoneyWinLines >= 70 * this.betting)
        this.isBigWin = true;
    if (this.totalMoneyWinLines >= 200 * this.betting)
        this.isSuperBigWin = true;


};
ResultSpin.prototype.getLineWinIcon = function(lineId){
    //linedID start tu 1
    //console.log(c+ ":"+r);
    return this.lineWinIcon[""+lineId];
};
ResultSpin.prototype.getTotalUserMoney = function(){
    //console.log(c+ ":"+r);
    return this.totalUserMoney;
};
ResultSpin.prototype.getHSNhan = function(){
    //console.log(c+ ":"+r);
    return this.dataBonusGame["x"];
};
ResultSpin.prototype.getTreasureOpen = function(index){
    //console.log(c+ ":"+r);
    return this.dataBonusGame.arrTreasureX[index]* this.coinBase;
};
ResultSpin.prototype.getTreasureHsNhanOpen = function(index){
    //console.log(c+ ":"+r);
    return this.dataBonusGame.arrTreasureX[index];
};
ResultSpin.prototype.getRewardOpen = function(index){
    //console.log(c+ ":"+r);
    return this.dataBonusGame.arrX[index]* this.coinBase;
};
ResultSpin.prototype.getMoneyWinMiniGame = function(){
    //cc.log("this.moneyMinigame "+this.moneyMinigame);
    return this.moneyMinigame;
};
ResultSpin.prototype.getIconWin = function(c, r){
    // console.log("getIconWin " + c+ ":"+r);
    return this.iconData[c][r];
};
ResultSpin.prototype.getMoneyWin = function(){
    return this.totalMoneyWinLines;
};
ResultSpin.prototype.getAllLineWin = function(){
    return this.lineWin;
};

cc.Global.convertLines = function (lines, totalLine) {
    var str ="";
    for(var i=0; i < totalLine ; i++){
        if(lines.indexOf(i) != -1) str+="1";
        else str+="0";
    }
    return str;
};
