/**
 * Created by kk on 5/2/2018.
 */
var NONG_TRAI_RES = "res/Texture/SlotFruit/";
var SLOT_FRUIT_SIZE = cc.size(1280, 720);
var NONG_TRAI_SLOT_SIZE =cc.size(863,430);
var LINE_SLOT_NUM_NT = [4,2,8,6,1,7,10,9,3,5,14,12,18,20,16,11,17,15,13,19];

var NT_LINE_POSITION = [
    [ 1, 1, 1, 1, 1],//HANG NGANG GIUA
    [ 2, 2, 2, 2, 2],
    [ 0, 0, 0, 0, 0],
    [ 2, 1, 0, 1, 2],
    [ 0, 1, 2, 1, 0],
    [ 1, 2, 1, 2, 1],//6
    [ 1, 0, 1, 0, 1],
    [ 2, 2, 1, 0, 0],
    [ 0, 0, 1, 2, 2],
    [ 1, 0, 1, 2, 1],//10
    [ 1, 2, 1, 0, 1],
    [ 2, 1, 1, 1, 2],//12
    [ 0, 1, 1, 1, 0],
    [ 2, 1, 2, 1, 2],//14
    [ 0, 1, 0, 1, 0],
    [ 1, 1, 2, 1, 1],//16
    [ 1, 1, 0, 1, 1],
    [ 2, 2, 0, 2, 2],//18
    [ 0, 0, 2, 0, 0],
    [ 2, 0, 0, 0, 2]//20

];
var ItemSlotFruit = SlotItem.extend({
    ctor: function (name, idItem) {
        this._super(name, idItem);
    },
    startAction:function () {
        
    },
    setWild:function () {
        this.idItem = 0;
        this.swapTexture("items/wild.png");
    },

    showLightWinEffect:function () {
        if(this.fire){
            this.fire.stopAllActions();
            this.fire.setVisible(true);
        }else{
            var fire = new cc.Sprite("#Bao_o_trung_00000.png");
            fire.setNormalizedPosition(.5, .5);
            this.addChild(fire);
            this.fire = fire;
            this.fire.setScale(0.8);
        }
        var thiz = this;
        var animFrames = [];
        var str = "";
        for (var k = 0; k <= 23; k++) {
            if(k<10)  str = "Bao_o_trung_0000"+k+ ".png";
            else str = "Bao_o_trung_000"+k+ ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            animFrames.push(animFrame);
        }
        var animation = cc.Animation.create(animFrames, 0.04, 1);
        var animate   = cc.animate(animation);
        var seq = cc.sequence(animate, cc.callFunc(function () {
            thiz.fire.setVisible(false);
        }));
        thiz.fire.runAction(seq);
    }
});
var SlotSlotFruit = SlotLayer.extend({
    DELAY_COL_SPIN : 0.2, //SECONDS
//IN SPIN_TIME ITEM must move atleast this.sizeSlot.height for pricise move, other will make some row result not move to bot bcz time too short
    SPIN_SPEED : 2500, //this.sizeSlot.height / thiz.SPIN_SPEED <= thiz.SPIN_TIME + (thiz.DELAY_COL_SPIN * thiz.DELAY_COL -1)
    SPIN_TIME : 2,
    BOUNCE_TIME : 0.2,
    BOUNCE_SPEED : 100,
    ctor: function (row, col) {
        this._super(row, col);
        this.sizeSlot = NONG_TRAI_SLOT_SIZE;
        if( (this.sizeSlot.height +this.BOUNCE_TIME* this.BOUNCE_SPEED ) / this.SPIN_SPEED > ( this.SPIN_TIME + this.BOUNCE_TIME + (this.DELAY_COL_SPIN * this.col -1) )){
            alert("this.sizeSlot.height / this.SPIN_SPEED must < this.SPIN_TIME");
        }
        
        this.nodeSlot.setContentSize(this.sizeSlot);
        this.itemWidth = NONG_TRAI_SLOT_SIZE.width/col;//5 cot
        this.itemHeight = NONG_TRAI_SLOT_SIZE.height/row;//3 hang

        this.isSpin = false;//true la dang spining
        this.isFree = 0;
        this.idxMax = 6;//0->6
        this.fixRowSpin = this.idxMax +1;//total item spin
        this.arrBlurItem = [ [], [], [], [], [] ];
        this.arrResultItem = [ [], [], [], [], [] ];
        this.resultSpinParser = null;

        this.arrId = [0,1,2,3,4,5,6];
        this.timeSpin = 0;
        this.timeDelayEachCol = 0.0;
        this.timeDelayEachColResult = 0;
        this.soundEnable = false; //cc.Global.GetSetting(SLOTFRUIT_SOUND_SETTING, true);
        this.effectEnable =false;  //cc.Global.GetSetting(SLOTFRUIT_EFFECT_SETTING, true);
        //if(TEST_MODE){
        //    var layerBlack = new cc.LayerColor(cc.color(0,255,0,100),this.nodeSlot.width,this.nodeSlot.height);
        //    this.addChild(layerBlack, -1);
        //}

    },
    newItem:function (idItem) {
        /*var name ="#items/"+ idItem+".png";
        var temp = new ItemSlotFruit(name,idItem);
        temp.soCot = this.soCot;
        return temp;*/
    },
    startSpin:function (data) {
        //{"iJ":true,"b":10000,"gid":this.gameId,"hMG":false,"sbs":[1,1,1,1,1,1,0,1,2,0,4,4,3,3,1],"fss":0,"lsp":{"gs":false,"aid":1,"m":100902000,"gT":0,"iF":false,"ex2":false},"mX":100902000,"sid":41,"hFS":false,"cmd":1302,"aid":1,"wls":[{"iJ":true,"crd":50002000,"lid":2},{"iJ":true,"crd":50000000,"lid":6},{"iJ":false,"crd":50000,"lid":7},{"iJ":false,"crd":50000,"lid":8},{"iJ":false,"crd":50000,"lid":12},{"iJ":false,"crd":50000,"lid":13},{"iJ":false,"crd":50000,"lid":14},{"iJ":false,"crd":300000,"lid":16},{"iJ":false,"crd":300000,"lid":18},{"iJ":false,"crd":50000,"lid":19}]}

        this.isSpin = true;
        this.timeSpin = 0;
        this.timeDelayEachCol = 0.0;
        this.timeDelayEachColResult = 0;
        //reset blur item va result item if need, reset item.waitToShow
        this.getPrefix();
        this.resetAllBlurItem();
        this.resetAllResultItem(true);
        if(this.effectEnable) SoundPlayer.playSoundLoop("nt_quay");
    },
    showLineWin:function (line,mask) {

    },
    showItemWin:function (arrItemWin) {
    },
    showWild:function (arrItemWild) {
    },
    setIsFree:function (isfree) {
        this.isFree = isfree?10:0;
    },
    getFreeSpining:function () {
        if(this.isFree == 10){
            return true;
        }
        return false;
    },
    initAllItemSlotFruit:function () {
        this.getPrefix();
        var prefix = this.prefix;
        this.startX = this.itemWidth/2;
        this.startY = this.sizeSlot.height + this.itemHeight/2 ;
        this.minY =  - this.itemHeight/2 ;

        for(var i = 0 ; i < this.col; i++){
            var arrId = this.arrId.slice(0);
            for(var j = 0 ; j < this.fixRowSpin; j++){
                var index = Math.floor(Math.random()*arrId.length);
                var item = new ItemSlotFruit(prefix + arrId[index]+".png" , arrId[index]);
                arrId.splice(index, 1);
                item.setPosition(this.startX + i*this.itemWidth, this.startY + j*this.itemHeight);
                this.nodeSlot.addChild(item);
                this.arrBlurItem[i].push(item);
            }
        }

        //create result spin test
        this.startYResult = this.itemHeight/2 ;
        for(var i = 0 ; i < this.col; i++){
            var arrId = this.arrId.slice(0);
            for(var j = 0 ; j < this.row; j++){
                var index = Math.floor(Math.random()*arrId.length);
                var item = new ItemSlotFruit(this.prefixResult + arrId[index]+".png" , arrId[index]);
                arrId.splice(index, 1);
                item.setPosition(this.startX + i*this.itemWidth, this.startYResult + j*this.itemHeight);
                item.setFinalPos(cc.p(item.x, item.y));
                this.nodeSlot.addChild(item);
                this.arrResultItem[i].push(item);
            }
        }
    },
    getPrefix : function () {
        this.prefix ="#fruit_item";// "#items/";
        this.prefixResult ="#fruit_item";// "#items/";
       /* if(this.getFreeSpining()){
            this.prefix = "#items_free/";
            this.prefixResult = "#items_free/";
            return;
    
        }*/
    },
    onEnter : function () {
        this._super();
        var thiz = this;
        this.scheduleUpdate();
    },
    onExit : function () {
        this._super();
        var thiz = this;
        this.unscheduleUpdate();
    },
    resetAllSpinItem : function () {
        this.getPrefix();
        this.resetAllBlurItem();
        this.resetAllResultItem();
    },
    isSpining : function(){
        return this.isSpin;

    },
    update:function (dt) {
        if(!this.isSpin) return;
        //SPIN result last turn
        this.timeSpin+=dt;
        this.timeDelayEachCol+=dt;
        var isShowResult = false;
        if(this.timeSpin >= this.SPIN_TIME){
            //slowly stop spin, show result
            isShowResult = true;
            this.timeDelayEachColResult+= dt;
        }

        var dY = -dt*this.SPIN_SPEED;

        var totalFinish = 0;

        for(var i = 0 ; i< this.col;i++){
            if(i > 0 && !isShowResult && this.timeDelayEachCol < this.DELAY_COL_SPIN * i){
                continue;
            }
            for(var j = 0 ; j< this.row;j++){
                var item = this.arrResultItem[i][j];
                item.visible = true;
                if(item.waitToShow && !isShowResult) continue;
                if(i >0 && isShowResult && this.timeDelayEachColResult < this.DELAY_COL_SPIN * i){
                    //delay move result obj down to show col>=1 when time spin begin end
                    continue;
                }
                var __addY =dY;

                if(!isShowResult && item.bounceTop >0){
                    item.bounceTop-=dt;
                    __addY = dt* this.BOUNCE_SPEED;
                    if(item.bounceTop < 0){
                        __addY += item.bounceTop*this.SPIN_SPEED;
                        item.bounceTop = 0;
                    }
                }
                var newY = item.y + __addY;
                if(isShowResult){
                    // dang spin cac item result tu row 11 12 13 xuong pos final
                    if(newY <= item.getFinalPos().y){
                        //stop move
                        totalFinish++;
                        newY = item.getFinalPos().y;
                        if(!item.stopUpdatePos){
                            item.y = newY;
                            item.runBounceToFinish();
                            //this.playEffect(this.audioMng, this.SOUNDS.colMN_STOP);
                        }
                    }
                }else{
                    //bat dau spin thi move cac item result van truoc xuong duoi
                    //spin dưới khung thi` move len tren cung` sau blur item va` set cac item réult vao
                    if(newY <= this.minY){
                        // + tiep 3 item height vi`  startY tinh tu pos0 ma visibile tu starY - 3. itemHeight
                        //newY =  this.startY - (this.row + j)*this.itemHeight + this.fixRowSpin*this.itemHeight;
                        newY =  this.minY + this.itemHeight/2  + (this.fixRowSpin -1 + j)*this.itemHeight;
                        //var idResult = this.slotData[(this.fixRowSpin -1 - j)* this.col + i ];
                        var idResult = this.resultSpinParser.getIconWin(i ,j);
                        item.swapTexture(this.prefixResult+idResult+".png");
                        item.setWaitToShow(true);
                    }
                }
                if(!item.stopUpdatePos)item.y = newY;
            }
        }
        //SPIN BLUr  ITEM AFTER
        for(var i = 0 ; i< this.col;i++){
            if(i > 0 && !isShowResult && this.timeDelayEachCol < this.DELAY_COL_SPIN * i){
                continue;
            }
            for(var j = 0 ; j< this.fixRowSpin;j++){
                var item = this.arrBlurItem[i][j];
                item.visible = true;
                var __addY =dY;
                if(!isShowResult && item.bounceTop >0){
                    item.bounceTop-=dt;
                    __addY = dt* this.BOUNCE_SPEED;
                    if(item.bounceTop < 0){
                        __addY += item.bounceTop*this.SPIN_SPEED;
                        item.bounceTop = 0;
                    }
                }
                var newY = item.y + __addY;
                if(newY <= this.minY){
                    newY = newY + (this.fixRowSpin -1) * this.itemHeight;
                    //show result thi nhun item blur nao` move xuong roi thi ko visible nua
                    //item.visible = !isShowResult;
                    if(isShowResult){
                        if(i >0 && isShowResult && this.timeDelayEachColResult < this.DELAY_COL_SPIN * i){
                            //delay move result obj down to show col>=1 when time spin begin end
                        }else{
                            newY = this.minY - 50;//item.y;// STOP MOVE
                        }
                    }
                }

                item.y = newY;
            }
        }
        if(totalFinish >= (this.row * this.col)){
            this.resetAllBlurItem();
            if(this.effectEnable) SoundPlayer.stopSoundLoop("nt_quay");
            this._finishedHandler();
        }
    },
    _finishedHandler : function(){
        cc.log("===== _finishedHandler");

    },
    resetAllBlurItem : function(){
        for(var i = 0 ; i < this.col; i++){
            var arrId = this.arrId.slice(0);
            if(this.getFreeSpining()){
                arrId = this.arrId.slice(0);//quay free chi co 0 -8 icon
            }
            for(var j = 0 ; j < this.fixRowSpin; j++){
                var index = Math.floor(Math.random()*arrId.length);
                var item = this.arrBlurItem[i][j];
                item.setPosition(this.startX + i*this.itemWidth, this.startY + j*this.itemHeight);
                item.swapTexture(this.prefix + arrId[index]+".png") ;
                arrId.splice(index, 1);
                item.resetAll();
            }
        }
    },
    resetAllResultItem : function(noSwap){
        for(var i = 0 ; i < this.col; i++){
            var arrId = this.arrId.slice(0);
            if(this.getFreeSpining()){
                arrId = this.arrId.slice(0);//quay free chi co 0 -8 icon
            }
            for(var j = 0 ; j < this.row; j++){
                var index = Math.floor(Math.random()*arrId.length);
                var item = this.arrResultItem[i][j];
                item.setPosition(this.startX + i*this.itemWidth, this.startYResult + j*this.itemHeight);
                if(!noSwap) item.swapTexture(this.prefixResult + arrId[index]+".png") ;

                item.resetAll();
            }
        }
    },
    
});

var ARR_BET_SLOT = [100,1000,10000];



var AutoSpinButton = ccui.Button.extend({
    ctor:function (normal, press, isPlist, size) {
        this.isPlist = isPlist ? isPlist : true;
        this._super(normal, "", "", this.isPlist ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE);
        this.setZoomScale(-0.05);
        if(size) this.setContentSize(size);
        this.normalTexture = normal;
        this.pressTexture = press;
        this.stateAuto = false;
    },
    setAutoSpin:function (isAuto) {
        //isAuto thi show btn dung`, !auto show btn tu quay
        var name = isAuto ? this.pressTexture: this.normalTexture  ;
        this.loadTextureNormal(name, this.isPlist ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE);
        this.stateAuto = isAuto;
    },
});
var CuCaiButton = ccui.Button.extend({
    ctor:function (normal,  isPlist, size) {
        this.isPlist = isPlist ? isPlist : true;
        this._super(normal, "", "", this.isPlist ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE);
        this.setZoomScale(-0.05);
        if(size) this.setContentSize(size);
        this.winSprite = "cu_cai_hole.png";
        this.loseSprite = "cu_cai_fail.png";

        var lblWin = new SlotLbl("" , cc.res.font.Tahoma, 25);
        lblWin.setColor(cc.color(97,245,7)) ;
        lblWin.setAnchorPoint(0.5,.5);
        lblWin.setPosition(this.width/2, this.height/2);
        this.addChild(lblWin);
        this.lblWin = lblWin;

    },
    setWin:function (isWin, money) {
        var name = isWin ? this.winSprite: this.loseSprite  ;
        this.loadTextureNormal(name, this.isPlist ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE);
        if(isWin && money > 0){
            this.lblWin.setString(cc.Global.NumberFormat1(money));
        }
        this.setEnabled(false);
    },
});

var SlotFruitMiniGame = cc.Node.extend({
    ctor : function (size, data) {
        this._super();
        var thiz = this;
        thiz.setContentSize(size);
        //this.setScale(cc.winSize.width/SLOT_FRUIT_SIZE.width);
        this.numberFight = 5;
        this.openedNumber = 0;
        this.hsNhan = 1;
        this.dataResult = data;
        // var blackBg = new cc.LayerColor(cc.color(0,0,0,170), cc.winSize.width, cc.winSize.height);
        // this.addChild(blackBg);
        var bgStart = new cc.Sprite(NONG_TRAI_RES+"bg_minigame.png");
        bgStart.setAnchorPoint(0.5,0.5);
        bgStart.setPosition(cc.p(size.width/2,size.height/2));
        this.addChild(bgStart,3);
        this.bgStart =bgStart;

        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize( cc.winSize.width, cc.winSize.height);
        dontTouchLayer.setAnchorPoint(cc.p(0.5, 0.5));
        dontTouchLayer.setTouchEnabled(true);
        dontTouchLayer.setPosition(size.width/2  , size.height/2);
        dontTouchLayer.addClickEventListener(function () {
            cc.log("SlotFruitMiniGame::prevent click");
            //thiz.setVisible(false);
        });
        this.addChild(dontTouchLayer);
        var bgWinPoint =  new cc.Sprite("#dialog_diemthang.png");
        bgWinPoint.setAnchorPoint(0.5,1);
        bgWinPoint.setPosition(bgStart.width/2,bgStart.height);
        bgStart.addChild(bgWinPoint,4);

        this.winPoint =0;
        var lblWin = new SlotLbl(""+ this.winPoint , cc.res.font.Tahoma, 25);
        lblWin.setColor(cc.color(97,245,7)) ;
        lblWin.setAnchorPoint(0.5,.5);
        lblWin.setPosition(bgWinPoint.width/2, 35);
        bgWinPoint.addChild(lblWin);
        this.lblWin = lblWin;


        var gameName = new cc.Sprite("#title_minigame.png");
        gameName.setAnchorPoint(0.5,0.4);
        gameName.setPosition(bgStart.width/2,bgStart.height/2);
        this.bgStart.addChild(gameName,2);
        this.gameNameSprite = gameName;

        // bot - top trai - phai
        var pos = [
            cc.p(100, 230),
            cc.p(218, 305),
            cc.p(360, 360),
            cc.p(310, 215),
            cc.p(415, 288),
            cc.p(518, 347),

            cc.p(530, 194),
            cc.p(612, 270),
            cc.p(688, 340),

            cc.p(744, 185),
            cc.p(790, 264),
            cc.p(826, 332),

            cc.p(960, 189),
            cc.p(960, 285),
            cc.p(1152, 153),
            cc.p(1134, 246)
        ];

        

        var thiz = this;
        this.btnList = [];
        for(var i = 0 ; i < pos.length; i++){
            (function () {
                var idx= i;
                
                var cucai = new CuCaiButton("cu_cai.png");
                // cc.log(idx+" pos[idx] "+pos[idx].x + " , "+pos[idx].y);
                cucai.setPosition(pos[idx]);
                cucai.addClickEventListener(function () {
                    cc.log("cucai touch "+idx + " numberFight "+thiz.numberFight);

                    //thiz.lblRemain.setString("Số lần còn lại : "+ thiz.numberFight);

                    thiz.showResultCuCai(idx);
                    thiz.lblAutoPlay.remainTime(3, 10, thiz.autoCuCai, thiz);
                });
                thiz.btnList.push(cucai);
                thiz.bgStart.addChild(cucai);
            })();
        }

        var lblAutoPlay = new SlotLbl("Tự động chơi sau " , cc.res.font.Tahoma, 25);
        lblAutoPlay.setColor(cc.color(255,255,255)) ;
        lblAutoPlay.setAnchorPoint(0,.5);
        lblAutoPlay.setPosition(250, 30);
        this.bgStart.addChild(lblAutoPlay);

        // var cbAutoPlay =cc.callFunc(function(){
        //     thiz.autoAttack();
        // });
        this.lblAutoPlay =lblAutoPlay;
        this.arrIdxAuto = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        lblAutoPlay.remainTime(3, 10, thiz.autoCuCai, thiz);
    },
    setVisible:function (isVisible) {
        if(this._popupClose && !isVisible && this.isVisible()){
            this._popupClose();
            this._popupClose = null;
        }
        this._super(isVisible);
    },
    endMini:function () {
        if(this._closeHandler ) this._closeHandler();
    },
    startMini:function () {
        this.gameNameSprite.setVisible(true);
        this.gameNameSprite.setOpacity(255);
        var cb = cc.callFunc(function () {
            ToastMessage.getInstance().show(GP_TEXT.CHOOSE_CU_CAI, 2);
        });
        var ac = cc.sequence(cc.delayTime(1), cc.fadeOut(.5), cb);
        this.gameNameSprite.runAction(ac);
    },
    autoCuCai : function (target) {
        var delay = 0;
        var thiz = target;
        var cb = cc.callFunc(function () {
            var rd = Math.floor(Math.random() * thiz.arrIdxAuto.length);
            thiz.showResultCuCai(thiz.arrIdxAuto[rd]);
        });
        var arr = [];
        for(var i = 0 ; i < thiz.numberFight; i++){
            arr.push(cc.delayTime(delay));
            arr.push(cb.clone());
            delay+=.5;
        }
        var ac =  cc.sequence(arr);
        ac.setTag(101);
        thiz.runAction(ac);
    },
    showResultCuCai : function (index) {
        cc.log("showResultCuCai "+index);
        if(this.numberFight <=0) return;
        this.numberFight--;
        this.arrIdxAuto.splice(index, 1);
        cc.log("===== " + index + " =>> "+ JSON.stringify(this.arrIdxAuto) );


        var moneyOpen =  this.dataResult.getRewardOpen(this.openedNumber);
        if(moneyOpen > 0){
            if(this.playSoundHandler) this.playSoundHandler("nt_nhocucai",false);
        }else{
            if(this.playSoundHandler) this.playSoundHandler("nt_nhocucai_thatbai",false);
        }
        this.btnList[index].setWin(moneyOpen > 0 ? true : false, moneyOpen);
        this.btnList[index].setLocalZOrder(50-this.numberFight);
        this.winPoint += moneyOpen;
        this.lblWin.setString(cc.Global.NumberFormat1(this.winPoint));
        this.openedNumber++;
        if(this.numberFight <=0 && !this.isShowTreasure){
            this.isShowTreasure = true;
            var thiz = this;
            var ac = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                thiz.showTreasureDialog();
            }));
            thiz.runAction(ac);
        }
    },
    showTreasureDialog : function () {
        this.lblAutoPlay.stopRemainTime();
        var dialog = new SlotFruitTreasureDialog(this.dataResult);
        var thiz = this;
        dialog.playSoundHandler = function (sound, loop) {
            if(thiz.effectEnable) SoundPlayer.playSound(sound, loop);
        }
        dialog.showWithAnimationScale();
        var thiz = this;
        dialog.tongketHander = function () {
            thiz.showTongKetDialog();
        };
    },
    showTongKetDialog : function () {
        var dialog = new CustomMessageDialog("dialog_minigame_win.png", true);
        dialog.setTitle("Điểm thắng");
        dialog.setMessage("Chúc mừng bạn đã thắng \n"+ this.dataResult.getMoneyWinMiniGame() +" gold");
        dialog.showWithAnimationScale();
        dialog.setCloseTouchOutSide(true);
        dialog.setCloseAfterTime(3);
        cc.log("show dialog tong ket");
        this.endMini();
    }
});



var SlotFruitPopupFree = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);
        var lv_x2phanthuong = new cc.Sprite("#lv_ef_bigwin_light.png");
        lv_x2phanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(lv_x2phanthuong);
        lv_x2phanthuong.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));
        var goldMini = new  cc.ParticleSystem("res/Texture/SlotFruit/lv_thanglon1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini);
        var goldMini2 = new  cc.ParticleSystem("res/Texture/SlotFruit/lv_thanglon2.plist");
        goldMini2.setScale(2.5);
        goldMini2.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini2);
        var spritePhanthuong = new cc.Sprite("#lv_bg_phanthuong.png");
        spritePhanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(spritePhanthuong);
        spritePhanthuong.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));
        var lv_x2phanthuong = new cc.Sprite("#lv_x2phanthuong.png");
        lv_x2phanthuong.setPosition(cc.p(spritePhanthuong.width/2  ,-10));
        spritePhanthuong.addChild(lv_x2phanthuong);
        this.lv_x2phanthuong = lv_x2phanthuong;

        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(2000,900);
        dontTouchLayer.setAnchorPoint(cc.p(0, 0));
        dontTouchLayer.setTouchEnabled(true);
        // dontTouchLayer.setPosition(cc.p(2000/2 - spritePhanthuong.width/2  , 900/2 - spritePhanthuong.height/2));
        dontTouchLayer.addClickEventListener(function () {
            cc.log("touchher");
            thiz.setVisible(false);
        });
        this.addChild(dontTouchLayer);
    },
    setVisible:function (isVisible) {
        if(this._popupSlotFruitClose && !isVisible && this.isVisible()){
            this._popupSlotFruitClose();
        }
        this._super(isVisible);
        // if(this._popupSlotFruitClose && !isVisible){
        //     this._popupSlotFruitClose();
        // }
    },
    setContent:function (isx2) {
        this.lv_x2phanthuong.setVisible(isx2>1);
    }
});

var SlotFruitPopupJackPot= cc.Node.extend({
    ctor : function (gameSize) {
        this._super();
        var thiz = this;
        this.size=gameSize;// cc.winSize;
        // this.setAnchorPoint(0.5,.5);
        // var blackBg = new cc.LayerColor(cc.color(0,150,0,200), this.size.width, this.size.height);
        // this.addChild(blackBg);
        //this.setScale(cc.winSize.width/SLOT_FRUIT_SIZE.width);




      /*  var goldMini = new  cc.ParticleSystem("res/Texture/SlotFruit/lv_nohu1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        this.addChild(goldMini);

        var goldMini2 = new  cc.ParticleSystem("res/Texture/SlotFruit/lv_nohu2.plist");
        goldMini2.setScale(2.5);
        goldMini2.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        this.addChild(goldMini2);

        var taothao = new cc.Sprite("#Jackpot.png");
        taothao.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        this.addChild(taothao);

        var fireEffect = new  cc.ParticleSystem("res/Texture/SlotFruit/particle_texture_jackpot.plist");
        fireEffect.setPosition(cc.p(taothao.width/2  , 250));
        taothao.addChild(fireEffect);*/


        var jackpot = new cc.Sprite("#fruit_jp.png");
         jackpot.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        //jackpot.setNormalizedPosition(.5, .5);
        this.addChild(jackpot);
        this.jackpot = jackpot;



        var lblMoney = new SlotLblBmt("100",cc.res.font.Tahoma_Regular_24);// cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "1000000");
        // lblMoney.setScale(1);
        lblMoney.setColor(cc.color(6,50,3));
        lblMoney.setPosition(jackpot.width/2,110);
        jackpot.addChild(lblMoney);
        this.lblMoney = lblMoney;


        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(2000,900);
        dontTouchLayer.setAnchorPoint(cc.p(0, 0));
        dontTouchLayer.setTouchEnabled(true);
        // dontTouchLayer.setPosition(cc.p(2000/2 - spritePhanthuong.width/2  , 900/2 - spritePhanthuong.height/2));
        dontTouchLayer.addClickEventListener(function () {
            cc.log("touchher close jackpot");
            thiz.setVisible(false);
        });
        this.addChild(dontTouchLayer);


    },

    setVisible:function (isVisible) {
        if(this._popupClose && !isVisible && this.isVisible()){
            this._popupClose();
            this._popupClose = null;
        }
        this._super(isVisible);


    },
    setMoneyJackPot:function (money) {
        this.lblMoney.setString(0);
        var action = new cc.ActionNumber(1,parseInt(money));
        this.lblMoney.runAction(action);
    },
    runAnimationShow:function () {
        this.jackpot.setScale(0.1);
        this.jackpot.runAction( cc.scaleTo(.5, 1.0));
    },


});

var SlotFruitPopupBigWin = cc.Node.extend({
    ctor : function (gameSize) {
        this._super();
        var thiz = this;
        this.size=gameSize;// cc.winSize;
        // this.setAnchorPoint(0.5,.5);
        // var blackBg = new cc.LayerColor(cc.color(0,0,0,200), this.size.width, this.size.height);
        // this.addChild(blackBg);
        //this.setScale(cc.winSize.width/SLOT_FRUIT_SIZE.width);

        /*var goldMini = new  cc.ParticleSystem("res/Texture/SlotFruit/lv_nohu1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        this.addChild(goldMini);

        var goldMini2 = new  cc.ParticleSystem("res/Texture/SlotFruit/lv_nohu2.plist");
        goldMini2.setScale(2.5);
        goldMini2.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        this.addChild(goldMini2);*/

        var jackpot = new cc.Sprite("#fruit_bigwin.png");
        jackpot.setPosition(cc.p(this.size.width/2  , this.size.height/2));
        this.addChild(jackpot);
        this.jackpot = jackpot;

       /* var fireCandle = new  cc.ParticleSystem("res/Texture/SlotFruit/particle_texture_fire.plist");
        fireCandle.setScale(.2);
        fireCandle.setPosition(1000, 747);
        this.addChild(fireCandle);
        MyTest.fire = fireCandle;*/

        var lblMoney = new SlotLblBmt("100",cc.res.font.Tahoma_Regular_24);// cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "1000000");
        // lblMoney.setScale(1);
        lblMoney.setColor(cc.color(6,50,3));
        lblMoney.setPosition(jackpot.width/2,50);
        jackpot.addChild(lblMoney);
        this.lblMoney = lblMoney;


        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(2000,900);
        dontTouchLayer.setAnchorPoint(cc.p(0, 0));
        dontTouchLayer.setTouchEnabled(true);
        // dontTouchLayer.setPosition(cc.p(2000/2 - spritePhanthuong.width/2  , 900/2 - spritePhanthuong.height/2));
        dontTouchLayer.addClickEventListener(function () {
            cc.log("touchher close jackpot");
            thiz.setVisible(false);
        });
        this.addChild(dontTouchLayer);


    },

    setVisible:function (isVisible) {
        if(this._popupClose && !isVisible && this.isVisible()){
            this._popupClose();
            this._popupClose = null;
        }
        this._super(isVisible);


    },
    setMoneyJackPot:function (money) {
        this.lblMoney.setString(0);
        var action = new cc.ActionNumber(1,parseInt(money));
        this.lblMoney.runAction(action);
    },
    runAnimationShow:function () {
        this.jackpot.setScale(0.1);
        this.jackpot.runAction( cc.scaleTo(.5, 1.0));
    },


});

var SlotFruitPopupBonus = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);




        var spritePhanthuong = new cc.Sprite("#lv_ef_bonus.png");
        var larva_ligth_run =  new cc.Sprite("#larva_ligth_run.png");
        larva_ligth_run.setPosition(200,spritePhanthuong.height/2);
        spritePhanthuong.addChild(larva_ligth_run);
        larva_ligth_run.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.MoveTo(1,cc.p(spritePhanthuong.width-350,394)),
                new cc.MoveTo(1,cc.p(350,394))
            )
        ));

        spritePhanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(spritePhanthuong);
        spritePhanthuong.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));
        var lv_x2phanthuong = new cc.Sprite("#lv_ef_text.png");
        lv_x2phanthuong.setPosition(cc.p(spritePhanthuong.width/2  ,spritePhanthuong.height/2));
        spritePhanthuong.addChild(lv_x2phanthuong);
        this.lv_x2phanthuong = lv_x2phanthuong;

        var dontTouchLayer = new ccui.Widget();
        dontTouchLayer.setContentSize(2000,900);
        dontTouchLayer.setAnchorPoint(cc.p(0, 0));
        dontTouchLayer.setTouchEnabled(true);
        // dontTouchLayer.setPosition(cc.p(2000/2 - spritePhanthuong.width/2  , 900/2 - spritePhanthuong.height/2));
        dontTouchLayer.addClickEventListener(function () {
            cc.log("wtf1");
            thiz.setVisible(false);
        });


        var lblMoney = cc.Label.createWithBMFont("res/Texture/SlotFruit/fnt_lv_thanglon.fnt", "1000000");
        lblMoney.setScale(1.2);
        lblMoney.setPosition(spritePhanthuong.width/2,153);
        spritePhanthuong.addChild(lblMoney);
        this.lblMoney = lblMoney;

        this.addChild(dontTouchLayer);

    },
    setVisible:function (isVisible) {
        this._super(isVisible);
        if(this._popupSlotFruitClose && !isVisible){
            this._popupSlotFruitClose();
        }

    },
    setFist:function (isFirst) {
        this.lv_x2phanthuong.setVisible(!isFirst);
        this.lblMoney.setVisible(!isFirst);
    },
    setMoneyBonus:function (money) {

        var action = new cc.ActionNumber(0.5,parseInt(money));
        this.lblMoney.runAction(action);

    }
});

var SlotFruitLobbyLayer = LayerSwallowTouch.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        this.setScale(cc.winSize.width/SLOT_FRUIT_SIZE.width);
        this.size = SLOT_FRUIT_SIZE;
        // var blackBg = new cc.LayerColor(cc.color(0,0,0,180), SLOT_FRUIT_SIZE.width, SLOT_FRUIT_SIZE.height);
        // this.addChild(blackBg);
        // var bg = new cc.Sprite("res/Texture/SlotFruit/bg_tq.jpg");
        // bg.setAnchorPoint(cc.p(0,1));
        // this.addChild(bg);
        var thiz = this;
        var bgLobby = new cc.Sprite("#dialog_help.png");
        bgLobby.setPosition(this.size.width/2, this.size.height/2);
        this.addChild(bgLobby, 2);

        var title = new cc.Sprite("#lobby_chonmuccuoc.png");
        title.setPosition(cc.p(bgLobby.width/2  , bgLobby.height - 65));
        bgLobby.addChild(title);
        thiz.bgLobby = bgLobby;
        thiz.lblRoomJackPot = [];
        var posArr = [ thiz.bgLobby.width/4 -30, thiz.bgLobby.width/2,30+ 3*thiz.bgLobby.width/4];
        for(var i = 0; i < 3; i++){
        (function () {
                var iNew = i;
                var btnTemp = new ccui.Button("room"+ (i+1) +".png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnTemp.setZoomScale(-0.05);
                // btnTemp.setPosition(cc.p( 250+ (i-1)*310, thiz.bgLobby.height/2 - 30));
                btnTemp.setPosition(cc.p( posArr[i], thiz.bgLobby.height/2 - 30));
                btnTemp.addClickEventListener(function () {
                    if(thiz.choseRoomHander )thiz.choseRoomHander(iNew);
                });
                thiz.bgLobby.addChild(btnTemp);

                var lblMoney = new SlotLbl("100.000.000", cc.res.font.Roboto_CondensedBold, 35)  ;// cc.Label.createWithBMFont(cc.res.font.Font_NONG_TRAI_YELLOW, "1000000");
                lblMoney.setColor(cc.color(207,173,86));
                lblMoney.setPosition(btnTemp.width/2, 38);
                btnTemp.getVirtualRenderer().addChild(lblMoney);
                thiz.lblRoomJackPot.push(lblMoney);
        })();
        }
    },
    choseRoomHander:function (moneyArr) {
    },
    updateMoneyHu:function (moneyArr) {
        // var action = new cc.ActionNumber(0.5,parseInt(money));
        // this.lblMoney.runAction(action);
    },

    setVisible:function (isVisible) {
        this._super(isVisible);
    },
});

var SLOTFRUIT_EFFECT_SETTING = "nt_effect_on";
var SLOTFRUIT_SOUND_SETTING = "nt_sound_on";

var SlotFruitScene = IScene.extend({
     ROOM_ID : {
        ROOM_100: 0,
        ROOM_1000: 1,
        ROOM_10000: 2,
         TRIAL: 3
    },
    ctor: function (gameId) {
        this._super();
        var bg = new cc.Sprite("res/Texture/Home/web.jpg");
        bg.setAnchorPoint(cc.p(0,1));
        bg.setPosition(0, cc.winSize.height);
        this.addChild(bg,-1);
        this.trialGame = true;
        this.bg = bg;
        if(cc.sys && cc.sys.isNative){
            SLOT_FRUIT_SIZE = cc.size(1280, 720);
            this.sceneLayer.setContentSize(cc.size(1280, 720));
            this.sceneLayer.setAnchorPoint(0.5, 0.5);
            this.sceneLayer.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            this.sceneLayer.setScale(cc.winSize.screenScale);
                                  
                                  this.popupLayer.setContentSize(SLOT_FRUIT_SIZE);
                                  this.popupLayer.setAnchorPoint(0.5, 0.5);
                                  this.popupLayer.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                                  this.popupLayer.setScale(cc.winSize.screenScale);
                                  

            cc.log("============== ctor mobile");

            this.gameSize = SLOT_FRUIT_SIZE;
            var khungSlot = new cc.Sprite("res/Texture/SlotFruit/fruit_bg.png");
            khungSlot.setNormalizedPosition(.5,.5);
            this.sceneLayer.addChild(khungSlot);
            this.bgSlot = khungSlot;
        }else{
            //web
            this.sceneLayer.setContentSize(cc.size(1920, 1080));
            //this.sceneLayer.setAnchorPoint(0.5,1);
            this.sceneLayer.setPosition(0, cc.winSize.height - this.sceneLayer.height);
            //this.sceneLayer.setScale(.7);


            this.popupLayer.setContentSize(cc.size(1920, 1080));
            this.popupLayer.setPosition(0, cc.winSize.height - this.popupLayer.height);



            cc.log("============== ctor web");

            this.gameSize = SLOT_FRUIT_SIZE;
            var khungSlot = new cc.Sprite("res/Texture/SlotFruit/fruit_bg.png");
            khungSlot.setAnchorPoint(.5,1);
            khungSlot.setPosition(this.sceneLayer.width/2, this.sceneLayer.height);
            this.sceneLayer.addChild(khungSlot);
            this.bgSlot = khungSlot;
        }

        var bgBot = new cc.Sprite("res/Texture/SlotFruit/fruit_bg_bot.png");
        bgBot.setAnchorPoint(.5,0);
        bgBot.setPosition(this.bgSlot.width/2, 0);
        this.bgSlot.addChild(bgBot);



        var layerBlack = new cc.LayerColor(cc.color(0,0,0,180), cc.winSize.width, cc.winSize.height);
        layerBlack.ignoreAnchorPointForPosition(false);
        layerBlack.setAnchorPoint(cc.p(0,1));
        layerBlack.setPosition(0,this.popupLayer.height);
        this.popupLayer.addChild(layerBlack,1);
        // this.addChild(layerBlack,-1);
        this.layerBlack = layerBlack;
        this.layerBlack.setVisible(false);

        SceneNavigator.addBackKeyEvent(this);


        this.betVaule = ARR_BET_SLOT[0];
        var thiz = this;
        this.gameId = gameId;
        this.enableButton = true;//prevent spam click spin, auto spin, change muc cuoc,... when spining
        this.enableClickX2Button = false;
        this.currJackPot = [0,0,0,0];// quy~ thuong cac phong choi thu, 100, 1k, 10k
        this.totalFreeSpinCount = [0,0,0,0];
        this.arrayLinesFree = [
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
        ];
        this.isAutoSpin = false;// tu dong quay
        this.isPlayingX2 = false;
        this.isPlayingBonus = false;
        this.initController();
        this.initGame();
        this.initView();
        this.initPopupSlotFruit();
        this.initBettingLobby();
    },
    onCanvasResize : function () {
        this._super();
        var scaleY = cc.winSize.height / this.bg.height;
        if(scaleY < 1.0){
            scaleY = 1.0;
        }
        this.bg.setScale(scaleY);
        this.bg.y = cc.winSize.height;
        if(this.layerBlack){
            this.layerBlack.setScale(scaleY);
            //this.layerBlack.y = cc.winSize.height;
        }
        if(this.popupLayer){
            //this.popupLayer.setScale(scaleY);
            this.popupLayer.y = cc.winSize.height - this.popupLayer.height;
        }
        /*if(this.poupJackpot){
            this.poupJackpot.setPosition(this.popupLayer.width/2,this.popupLayer.height/2);

        }*/
    },

    showBlackLayer:function (isShow) {
        this.layerBlack.setVisible(isShow);
    },

    _onKeyBackHandler : function () {
        if(this.selectLine.isVisible() === true)
        {
            this.selectLine.setVisible(false);
            return true;
        }
        this.exitToGame();
        return true;
    },
    initBettingLobby:function () {
        //fruit ko co lobby thoi thi coi nhu vao luon room 1

        this.trialGame = false;
        this.showGameLayer(this.ROOM_ID.ROOM_100);
        this.lblTotalMoney.setString(cc.Global.NumberFormat1(PlayerMe.gold));
        this.lblTotalWin.setString("");

    },
    choseRoom : function (id) {
        //if(this.soundEnable) SoundPlayer.stopSound("nt_nhacnen_lobby");
        if(this.soundEnable) SoundPlayer.playSound("nt_nhacnen",true);
        var thiz = this;
        if(id == this.ROOM_ID.TRIAL ) {
            this.trialGame = true;
            this.showGameLayer(id);
            // this.logoGame.x =this.winSize.width /2 -50;
            //update so du choi thu
            thiz.totalMoneyChoiThu = 50000000;
            thiz.totalMoneyHuChoiThu = 50000000;
            thiz.updatemoneyChoiThu();
        }else{
        // }else if(this.checkLogin() ){
            this.trialGame = false;
            this.showGameLayer(id);
            thiz.lblTotalMoney.setString(cc.Global.NumberFormat1(PlayerMe.gold));
            thiz.lblTotalWin.setString("");
        }
        /*else{
            //show msg login first
            var msg = "Vui lòng đăng nhập để thực hiện chức năng";
            ToastMessage.getInstance().show(msg);
        }*/
    },
    checkLogin : function () {
        /*if (SocketClient.getInstance().isLoginDone()) {
            return true;
        }*/
        return false;
    },
    updatemoneyChoiThu : function () {
         //console.log("aaa updatemoneyChoiThu");
        this.lblTotalMoney.setTotalGoldWithEffect( this.lblTotalMoney.gold, this.totalMoneyChoiThu);
        this.lblTotalMoneyHu.setTotalGoldWithEffect( this.lblTotalMoneyHu.gold, this.totalMoneyHuChoiThu);
    },
    showGameLayer : function (roomId) {
        this.roomId = roomId;
        var thiz = this;
        var freeSpinNum = 0;
        switch (roomId){
            case thiz.ROOM_ID.TRIAL:{
                thiz.betting = 10000;
                freeSpinNum =0;
                break;
            }
            case thiz.ROOM_ID.ROOM_100:{
                thiz.betting = 100;
                freeSpinNum =thiz.totalFreeSpinCount[1];
                break;
            }
            case thiz.ROOM_ID.ROOM_1000:{
                thiz.betting = 1000;
                freeSpinNum =thiz.totalFreeSpinCount[2];
                break;
            }
            case thiz.ROOM_ID.ROOM_10000:{
                thiz.betting = 10000;
                freeSpinNum =thiz.totalFreeSpinCount[3];
                break;
            }
        }
        this._onChangeLines(kEvent.CHANGE_LINES_SLOT, this.lines);
        this.gotoGameLayer();
        this.freeSpinLbl.setTotalFree(freeSpinNum);
    },
    _onChangeLines : function (cmd, data ) {
        var thiz = this.currentTarget ? this.currentTarget : this;
        data.sort(function(a, b){return a-b});
        thiz.lines = data;
        cc.log(" change line "+ JSON.stringify(data));
        thiz.refreshCuoc();
    },
    refreshCuoc : function ( ) {
        this.lblMucCuoc.setString(cc.Global.NumberFormat1(this.betting));
        this.lblDong.setString(""+this.lines.length);
        this.lblTotalBet.setString(cc.Global.NumberFormat1(this.betting *this.lines.length) );
    },
    resetAllSpinItem : function ( ) {
        this.slotfui.resetAllSpinItem();
    },
    gotoGameLayer : function ( ) {
        this.freeSpinLbl.setTotalFree(this.totalFreeSpinCount[this.roomId ]);
        if(this.btnX2){
            this.btnX2.visible = true;
            this.btnX2.tint =0xcc000000;
        }
        this.disableClickLines = false;
        this.resetAllSpinItem();
                                  this.stopActionByTag(200);
        //if(this.drawSequenceLineActions ){
        //    this.stopAction(this.drawSequenceLineActions);
        //    this.drawSequenceLineActions = null;
        //}

        if( !this.slotfui.getFreeSpining()){
            // this.containerFreeWild.removeChildren();
        }

        if(this.lineGraphic) this.lineGraphic.clear();
        this.winLbl.hideAll();
    },

    initPopupSlotFruit:function () {


        var poupBigWin =  new SlotFruitPopupBigWin(this.gameSize);
        //poupBigWin.setAnchorPoint(this.bgSlot.getAnchorPoint());
        poupBigWin.setContentSize(this.gameSize);
        // poupBigWin.setPosition(this.bgSlot.getPositionX() , this.bgSlot.getPositionY());
        poupBigWin.setAnchorPoint(.5, .5);
        poupBigWin.setPosition(this.popupLayer.width/2,this.popupLayer.height -  this.bgSlot.height/2);

        // this.sceneLayer.addChild(poupBigWin,3);
        this.popupLayer.addChild(poupBigWin,3);
        this.poupBigWin = poupBigWin;
        var poupJackpot =  new SlotFruitPopupJackPot(this.gameSize);
        //poupJackpot.setAnchorPoint(this.bgSlot.getAnchorPoint());
        poupJackpot.setContentSize(this.gameSize);
        // poupJackpot.setPosition(this.bgSlot.getPositionX() , this.bgSlot.getPositionY());
        poupJackpot.setAnchorPoint(.5, .5);

        poupJackpot.setPosition(this.popupLayer.width/2,this.popupLayer.height -  this.bgSlot.height/2);
        //poupJackpot.setPosition(this.popupLayer.width/2, this.popupLayer.height - this.bgSlot.height/2);
        // this.sceneLayer.addChild(poupJackpot,3);
        this.popupLayer.addChild(poupJackpot,3);
        // this.addChild(poupJackpot,3);
        this.poupJackpot = poupJackpot;

        this.poupBigWin.setVisible(false);
        this.poupJackpot.setVisible(false);
        // thiz.hiddenAllPopup();
    },
    hiddenAllPopup:function () {
        /*this.sceneLayer.removeChildByTag(167);
        this.poupBonusFirst.setVisible(false);
        this.poupFreeEnd.setVisible(false);
        this.bonusLucky.setVisible(false);
        */
        this.showBlackLayer(false);
        this.poupBigWin.setVisible(false);
        this.poupJackpot.setVisible(false);
        if(this.dialogMini){
            this.dialogMini.removeFromParent(false);
            this.dialogMini = null;
        }
    },

    initGame:function () {
        this.betting = 0;
        this.bettingArr = [100, 1000, 10000];
        this.lines = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        this.totalMoneyChoiThu =50000000;
        this.totalMoneyHuChoiThu = 50000000;
        this.dataChoithu = [
            {"id":200,"c":101,"s":1,"d":{"r":1,"b":10027295,"jp":1,"fss":0,"ls":[{"id":7,"i":2,"c":100}],"i":"471574627432727"},"m":""},
            {"id":200,"c":101,"s":1,"d":{"r":1,"b":10027295,"jp":0,"fss":0,"ls":[{"id":5,"i":2,"c":100}, {"id":1,"i":2,"c":300}],"i":"131574427632322"},"m":""},
            {"id":200,"c":101,"s":1,"d":{"r":1,"b":10027295,"jp":0,"mg":{"c":100,"x":1,"v":"x4x8x6x8x4","b":"x3x1x5x2x4"},"fs":0,"ls":[{"id":9,"i":2,"c":500}, {"id":18,"i":2,"c":700}],"i":"471574627432727"},"m":""},
        //

        ];
    },
    initView:function () {
        var thiz = this;
        setTimeout(function () {
            console.log("===============play sound");
            if(thiz.soundEnable) SoundPlayer.playSound("nt_nhacnen",true);
        }, 0.1);

        var btnContainer = new cc.Node();
        btnContainer.setPosition(this.bgSlot.width/2, this.bgSlot.height);
        btnContainer.setContentSize(this.bgSlot.getContentSize());
        btnContainer.setAnchorPoint(0.5,1);
        this.btnContainer = btnContainer;
        this.initButton();
        this.bgSlot.addChild(btnContainer,1);


        var slotfui = new SlotSlotFruit(3, 5);
        slotfui.initAllItemSlotFruit();
        slotfui.setPosition(this.bgSlot.width/2 - slotfui.sizeSlot.width/2 ,this.bgSlot.height/2 - slotfui.sizeSlot.height/2 +4);
        this.bgSlot.addChild(slotfui);

        var thiz = this;
        slotfui._finishedHandler = function () {
            thiz.finishSpin();
        };
        slotfui._playsoundStopItem = function () {
           // SoundPlayer.playSound("lv_stop");
        };
        this.slotfui = slotfui;


        this.initLabel();
        this.initAllLine();
    },
    clickAutoSpin:function (callFromAutoSpin) {
        if(!SocketClient.getInstance().isLoggin()){
            if(!this.trialGame){
                ToastMessage.getInstance().show('Vui lòng đăng nhập hoặc chơi thử để thực hiện chức năng!');
                return;
            }
        }else if (this.lines == null || this.lines.length <= 0) {
            ToastMessage.getInstance().show('Bạn phải chọn dòng chơi!');
            return;
        }
        this.isAutoSpin = !this.isAutoSpin;
        // this.swapTexture(this.autoSpinBtn, PIXI.Texture.fromImage(this.isAutoSpin ? "btn_dung.png" : "btn_tuquay.png"));
        this.btnAutoSpinBt.setAutoSpin(this.isAutoSpin);
        if(!this.isAutoSpin){
            //isSpin = false when finish current spin if have, no stop here
            //this.slotfruit.isSpin = false;//stop spin
            return;
        }

        if(this.slotfui.getFreeSpining()){// && this.prefixResult != "item_quaymp/"
            this.slotfui.resetAllSpinItem();
        }
        //test - remove 2 line
        var rand = Math.floor(Math.random() * (this.dataChoithu.length - 1));
        this.startSpin(this.dataChoithu[rand]);
        
                                  /* var sendObj = [
                                   command.ZonePluginMessage,
                                   Constant.CONSTANT.ZONE_NAME_MINI_GAME,
                                   miniGamePlugin.PLUGIN_SLOT_GAME,
                                   {
                                   'cmd': CMD_SLOT_MACHINE.SPIN,
                                   'gid': this.gameId,
                                   'aid': this.moneyType,
                                   'ls': this.lines,
                                   'b': this.betting
                                   }
                                   ];
                                   SocketClient.getInstance().send(sendObj);*/
        

        this.enableButton = false;
        this.stopAllActions();
    },
    clickSpin:function (callFromAutoSpin) {
       // if(!callFromAutoSpin) this.playEffect(this.audioMng2, ThanDen.SOUNDS.SPINE);
       // this.playEffect(this.audioMng, ThanDen.SOUNDS.SPINE_AUTO);

        if(!SocketClient.getInstance().isLoggin()){
            if(!this.trialGame){
                ToastMessage.getInstance().show('Vui lòng đăng nhập hoặc chơi thử để thực hiện chức năng!');
                return;
            }
        }
        if (this.lines == null || this.lines.length <= 0) {
            ToastMessage.getInstance().show('Bạn phải chọn dòng chơi!');
            return;
        }

        if(this.isAutoSpin && !callFromAutoSpin){
            ToastMessage.getInstance().show('Đang tự quay. Vui lòng dừng tự quay trước đã');
            return;
        }
        if(this.slotfui.getFreeSpining()){//&& this.prefixResult != "item_quaymp/"
            this.resetAllSpinItem();
        }
        this.enableButton = false;
        this.enableClickX2Button = false;
        this.stopAllActions();
        //this.btnQuay.playAnimation();
        if(this.trialGame){
            var rand = Math.floor(Math.random() * (this.dataChoithu.length - 1));
            this.startSpin(this.dataChoithu[rand]);
        }else{
            //pending nen return state luon
            this.enableButton = true;
            ToastMessage.getInstance().show("Chưa ghép api. Vui lòng chơi thử trước thôi",1);
            cc.log("sending msg spin to serrver");
            /*var sendObj = [
                command.ZonePluginMessage,
                Constant.CONSTANT.ZONE_NAME_MINI_GAME,
                miniGamePlugin.PLUGIN_SLOT_GAME,
                {
                    'cmd': CMD_SLOT_MACHINE.SPIN,
                    'gid': this.gameId,
                    'aid': this.moneyType,
                    'ls': this.lines,
                    'b': this.betting
                }
            ];
            SocketClient.getInstance().send(sendObj);*/
        }
    },
    startSpin:function (data) {
        //{"c":1300,"gid":217,"mgs":"Bạn không đủ số dư","cmd":1302}
        //{"c":1309,"gid":217,"mgs":"Bạn không thể quay trong khi chơi X2","cmd":1302}
        //if(!this.numSpin) this.numSpin =0;
        //this.numSpin++;
        //if(this.numSpin > 0 & this.numSpin%2 == 0)
        //data = {"iJ":false,"b":100,"gid":217,"hMG":true,"sbs":[3,2,8,7,8,7,10,3,4,6,8,5,10,10,7],"fss":0,"lsp":{"gs":false,"aid":1,"m":7500,"gT":0,"iF":false,"ex2":true},"mX":7500,"sid":1620,"hFS":false,"MG":{"rate":1,"stg":[{"b2":0.3,"b":0,"id":0},
        //        {"b2":0.6,"b":0,"id":1},{"b2":0.9,"b":0,"id":2},{"b2":1.2,"b":1,"id":3}],"items":[3,0,0,3,-1],"m":7500},"cmd":1302,"aid":1,"wls":[]};
        //data = {"iJ":true,"b":10000,"gid":217,"hMG":false,"sbs":[10,3,10,0,0,3,0,5,5,0,6,10,0,5,0],"fss":0,"lsp":{"gs":false,"aid":1,"m":2560000,"gT":0,"iF":false,"ex2":true},
        //    "mX":2560000,"sid":46,"hFS":false,"MG":{"rate":3,"stg":[{"b2":4,"b":4,"id":0},{"b2":10,"b":10,"id":1},{"b2":15,"b":15,"id":2},{"b2":20,"b":20,"id":3}],"items":[0,0,-1,0,0,0],"m":2510000},"cmd":1302,"aid":1,"wls":[{"iJ":false,"crd":0,"lid":3},{"iJ":false,"crd":0,"lid":7},{"iJ":false,"crd":50000,"lid":8},{"iJ":false,"crd":0,"lid":10}]};
        //    console.log("spin data "+JSON.stringify(data) );
        if(data.mgs && data.mgs.length){
            ToastMessage.getInstance().show(data.mgs);
            this.stopSpinAndEnableClick();
            this.isAutoSpin = false;
            this.btnAutoSpinBt.setAutoSpin(this.isAutoSpin);

            if(data.c == 1309){
                //{"c":1309,"gid":217,"mgs":"Bạn không thể quay trong khi chơi X2","cmd":1302}
                //dang choi x2 tat web, bjo vao lai choi khi quay se co thong bao nay
                // = > send finish x2
                var sendObj = [
                    command.ZonePluginMessage,
                    Constant.CONSTANT.ZONE_NAME_MINI_GAME,
                    miniGamePlugin.PLUGIN_SLOT_GAME,
                    {
                        'cmd': CMD_SLOT_MACHINE.FINISH_X2_GAME,
                        'gid': this.gameId,
                        'aid': this.moneyType
                    }
                ];

                SocketClient.getInstance().send(sendObj);
            }
            return;
        }
        this.disableClickLines = false;

        //if(this.btnX2 )this.btnX2.tint = 0xcc000000;
        
        this.slotfui.startSpin(data);
        
        //remove all line draw if have
        /*this.containerSpineEffect.removeChildren();

        if(this.freeSpinLbl && !this.freeSpinLbl.haveFreeSpin()){
            this.containerFreeWild.removeChildren();
        }*/

        if(this.lineGraphic) this.lineGraphic.clear();
        this.winLbl.hideAll();
        /!*  show just win, de phong aniation win chua het da click quay moi => just win chua kip update *!/
        if(this.resultSpinParser){
            this.updateMoneyLbl();
            this.lblTotalWin.setString(cc.Global.NumberFormat1(this.resultSpinParser.dataResult.mX));
        }
        //console.log("======== test b4spin "+ this.showWinAction);
        if(this.showWinAction){
            // start new spin when showWinACtion before not end
            //LobbyRequest.getInstance().requestUpdateMoney();
        }

        this.dataResult = data;
        cc.log("data "+ JSON.stringify(data)  );


        this.resultSpinParser = new ResultSpin(data["d"], this.betting, this.slotfui.row, this.slotfui.col);
        this.slotfui.resultSpinParser =this.resultSpinParser;
        if(this.trialGame){
            var moneyBet = this.lines.length* this.betting;
            this.totalMoneyChoiThu-= moneyBet;
            this.totalMoneyHuChoiThu+= 0.02*moneyBet;
            this.updatemoneyChoiThu();
            if( this.resultSpinParser.isJackPot) this.resultSpinParser.dataResult.mX = this.totalMoneyHuChoiThu;
        }
    },
    
    enableAutoSpin:function (isEnable) {
        this.isAutoSpin = isEnable;
       this.btnAutoSpinBt.setAutoSpin(isEnable);
    },

    initAllLine:function () {
         var thiz = this;
        var MyTest =   MyTest || {};

            MyTest.draw = function (idx) {
             var order = LINE_SLOT_NUM_NT;
             thiz.drawLine(order[idx], idx, true);
         };
        var starX =  186;
        var starY =  542;
        var dY = 35;
        this.lineBtnArr = [];
        var order = LINE_SLOT_NUM_NT;
        if(!this.orderLine) this.orderLine = order;
        var thiz = this;
        for(var i = 0 ; i < 20; i++){
            (function(){
                var idx = i;
                var normal =  "fruit_number_circle.png";
                var over = "fruit_number_circle.png";
                var buttonNumer = new SlotNumber(normal, over);
                var lbl = new cc.LabelTTF(""+LINE_SLOT_NUM_NT[idx], cc.res.font.Tahoma, 16);
                lbl.setColor(cc.color.BLACK);
                lbl.setNormalizedPosition(.5, .5);
                buttonNumer.addChild(lbl);
                if(!cc.sys.isNative){
                    if(buttonNumer.setMouseOverEnable){
                        buttonNumer.setMouseOverEnable();
                        buttonNumer._onMouseOver = function (isOver) {
                            if(!thiz.disableClickLines){
                                buttonNumer.changeSprite(isOver);
                                if(isOver) thiz.drawLine(order[idx], idx, true);
                                //else if(thiz.lineGraphic) thiz.lineGraphic.clear();
                            }
                        };
                    }

                }
                var x = idx <10 ? starX : (thiz.btnContainer.width - 184);
                //if(idx >=10) starY =610;
                buttonNumer.setPosition( x ,starY - (i%10)*dY );
                // console.log( "x =  "+x);
                thiz.btnContainer.addChild(buttonNumer,5);
                thiz.lineBtnArr[i] = buttonNumer;
            })();
        }
    },
    drawLine:function (lineNum, idx, clear, zoom){
         // console.log("draw lineeee "+lineNum);
        if(!this.lineGraphic){
            this.lineGraphic =  new cc.DrawNode();
            //this.lineGraphic.setPosition(this.containerLine.x, this.containerLine.y);
            this.btnContainer.addChild(this.lineGraphic);
        }
        if(!this.lineColors){
            this.lineColors = [];
            // red       yellow    blue        brown    violet       green    orange
            var colors = ["#FF0000", "#FFFF00", "#0000FF", "#FFDEAD"	, "#EE82EE" , "#32CD32", "#FFA500"];
            var colors = ["#a4ef35"];
            var _idx =0;
            for(var i = 0 ; i < 25;i++){
                _idx = i % colors.length;
                this.lineColors.push(colors[_idx]);
            }
        }
        if(clear) this.lineGraphic.clear();
        this.lineGraphic.setLineWidth(5);
        this.lineGraphic.setDrawColor(cc.color(this.lineColors[lineNum-1]));
        var from = cc.p(this.lineBtnArr[idx].x,this.lineBtnArr[idx].y);

        var arrIndex = NT_LINE_POSITION[lineNum -1];
        var nodeSpace = this.slotfui.getParent().convertToWorldSpace();
        //cc.winSize.width/SLOT_FRUIT_SIZE.width /
        var scale =  this.sceneLayer.getScale();// this.slotfui.getScale();
        // cc.log("scale========> "+scale);
        if(idx<10){// 0 => 9 been trai
            for(var i = 0 ; i < arrIndex.length; i++){
                var x = this.slotfui.startX*scale + i*this.slotfui.itemWidth*scale;
                var y =this.slotfui.startYResult*scale + arrIndex[i]*this.slotfui.itemHeight*scale;
                var worldSpace = this.slotfui.getParent().convertToWorldSpace(this.slotfui.getPosition() );
                var nodeSpace = this.btnContainer.convertToNodeSpace(cc.pAdd(worldSpace, cc.p(x, y) ) );
                this.lineGraphic.drawSegment(from , nodeSpace );
                //cc.log("from "+from.x + " : "+ from.y + " => "+x + " : "+y);
                from =  nodeSpace;
            }
        }else{
            for(var i = arrIndex.length -1 ; i >=0; i--){
                var x =this.slotfui.startX*scale + i*this.slotfui.itemWidth*scale;
                var y =this.slotfui.startYResult*scale + arrIndex[i]*this.slotfui.itemHeight*scale;

                var worldSpace = this.slotfui.getParent().convertToWorldSpace(this.slotfui.getPosition() );
                var nodeSpace = this.btnContainer.convertToNodeSpace(cc.pAdd(worldSpace, cc.p(x, y) ) );
                this.lineGraphic.drawSegment(from , nodeSpace );
                //cc.log("from "+from.x + " : "+ from.y + " => "+x + " : "+y);
                from =  nodeSpace;
            }
        }
        if(zoom){
            for(var i = 0 ; i < arrIndex.length; i++){
                var ac1 = cc.scaleTo(.4, 1.1);
                var ac2 = cc.scaleTo(.4, 1.0);
                var action = cc.sequence(ac1, cc.delayTime(0.2), ac2);
                this.slotfui.arrResultItem[i][arrIndex[i]].stopAllActions();
                this.slotfui.arrResultItem[i][arrIndex[i]].runAction( action);
                this.slotfui.arrResultItem[i][arrIndex[i]].showLightWinEffect();
            }
        }
    },
    drawMultLine:function (firstDelay ,arrlineNum, isSequence){
        cc.log("drawMultiLine ======");
        this.disableClickLines = true;
        var delay =firstDelay;
        var thiz = this;
        var arr =[];
        for(var i = 0 ; i < arrlineNum.length; i++){
            (function(){
                var lineNum = arrlineNum[i];
                var idx = thiz.orderLine.indexOf(lineNum);
                var delayAc = cc.delayTime(delay);
                var callFun = cc.callFunc(function(){
                    var clearAndZoom = false;
                    if(isSequence) clearAndZoom = true;
                    thiz.drawLine(lineNum, idx , clearAndZoom, clearAndZoom);
                });
                arr.push(delayAc);
                arr.push(callFun);
                if(isSequence) delay= 1;
            })();

        }
        /*arr.push(cc.delayTime(delay));
        arr.push(cc.callFunc(function(){
            if(thiz.lineGraphic) thiz.lineGraphic.clear();
            //enableClickAllLine
            if(isSequence) thiz.disableClickLines = false;
        }));*/

        var action =null;
        if(!isSequence){
            action =  cc.sequence(cc.spawn(arr), cc.delayTime(1), cc.callFunc(function(){
                if(thiz.lineGraphic) thiz.lineGraphic.clear();
                //enableClickAllLine
                if(isSequence) thiz.disableClickLines = false;
            }) );
        }
        else{
            arr.push(cc.delayTime(delay));
            arr.push(cc.callFunc(function(){
                if(thiz.lineGraphic) thiz.lineGraphic.clear();
                //enableClickAllLine
                if(isSequence) thiz.disableClickLines = false;
            }));
            action = cc.sequence(arr);
        }
        //if(this.drawSequenceLineActions ){
        //    this.stopAction(this.drawSequenceLineActions);
        //}
                                  this.stopActionByTag(200);
        this.drawSequenceLineActions =this.runAction( action);
                                  this.drawSequenceLineActions.setTag(200);
    },

    initLabel:function () {
        //hu thuong
    },

    initButton:function (sizeCotnainer) {
        var thiz = this;
        var size = sizeCotnainer ? sizeCotnainer : this.bgSlot.getContentSize();
        var backBt = new ccui.Button("fruit_back.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setZoomScale(-0.05);
        backBt.setPosition(110, 614);
        this.btnContainer.addChild(backBt);
        backBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            ToastMessage.getInstance().show("minimum slot");
            SceneNavigator.replaceScene(new HomeScene());
        });



        this.soundEnable =  false; //cc.Global.GetSetting(SLOTFRUIT_SOUND_SETTING, true);
        this.effectEnable =  false;// cc.Global.GetSetting(SLOTFRUIT_EFFECT_SETTING, true);


        var dy__ = 75;

        var bxhBt = new ccui.Button("fruit_vinhdanh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhBt.setZoomScale(-0.05);
        bxhBt.setPosition(910, 617);
        bxhBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            // var bangvinhdanhpop = new HistoryJackPotSlotFruitLayer();
            // bangvinhdanhpop.showWithAnimationScale();
        });
        this.btnContainer.addChild(bxhBt);


        var lsHuBt = new ccui.Button("fruit_lsgd.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lsHuBt.setZoomScale(-0.05);
        lsHuBt.setPosition(bxhBt.x+dy__, bxhBt.y);
        lsHuBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
        });
        this.btnContainer.addChild(lsHuBt);

        var helpBt = new ccui.Button("fruit_help.png", "", "", ccui.Widget.PLIST_TEXTURE);
        helpBt.setZoomScale(-0.05);
        helpBt.setPosition(lsHuBt.x+dy__, bxhBt.y);

        helpBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
        });
        this.btnContainer.addChild(helpBt);

        var settingBt = new newui.ButtonToggle("#fruit_sound_on.png", "#fruit_sound_off.png");
        settingBt.setPosition(helpBt.x+dy__, bxhBt.y);

        settingBt.onSelect = function(target, isSelect){
            cc.Global.SetSetting(SLOTFRUIT_SOUND_SETTING, isSelect);
            thiz.soundEnable = isSelect;
            cc.log("========soundEnable "+isSelect);
            thiz.slotfui.soundEnable = isSelect;
            if(thiz.soundEnable){
                //SoundPlayer.playSound("nt_nhacnen",true);
            }else{
                SoundPlayer.stopAllSound();
            }
        };
        this.btnContainer.addChild(settingBt,6);


        /*var titleContainer = new cc.Sprite("#hu_container.png");
        titleContainer.setAnchorPoint(.5,1);
        titleContainer.setPosition(size.width/2 + 5 , size.height -2);
        this.btnContainer.addChild(titleContainer);*/

        this.lblTotalMoneyHu = new SlotLbl("100.000.000", cc.res.font.Tahoma, 55);
        this.lblTotalMoneyHu.setColor(cc.color(226,184,2));
        this.lblTotalMoneyHu.setPosition(this.btnContainer.width/2, 630);
        this.btnContainer.addChild(this.lblTotalMoneyHu);


        var container_name = new cc.Sprite("#fruit_name_container.png");
        container_name.setPosition(282 , 682);
        this.btnContainer.addChild(container_name);

        var font =cc.res.font.Tahoma;// cc.res.font.Roboto_Condensed_25;

        var lblPlayer = new cc.LabelTTF(PlayerMe.displayName,font,24);//cc.Label.createWithBMFont(font,"Total bet");
        lblPlayer.setColor(cc.color(131,51,3));
        lblPlayer.setAnchorPoint(0.5,.5);
        lblPlayer.setPosition( container_name.width/2,43);
        container_name.addChild(lblPlayer);

        this.lblTotalMoney = new SlotLbl("2500",font,22);// new SlotLblBmt("1000000",cc.res.font.Font_NONG_TRAI_YELLOW);
        this.lblTotalMoney.setColor(cc.color.BLACK);
        this.lblTotalMoney.setAnchorPoint(0.5,.5);
        this.lblTotalMoney.setPosition(container_name.width/2, 22);
        container_name.addChild(this.lblTotalMoney);


        var switchMode = new newui.ButtonToggle("#fruit_btn_choi_that.png", "#fruit_btn_choi_thu.png");
        switchMode.onSelect = function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            thiz.trialGame = !thiz.trialGame;
            if(thiz.trialGame){
                thiz.totalMoneyChoiThu = 50000000;
                thiz.totalMoneyHuChoiThu = 50000000;
                thiz.updatemoneyChoiThu();
                ToastMessage.getInstance().show("Bạn vừa chọn chế độ chơi thử");
            }else{
                ToastMessage.getInstance().show("Bạn vừa chọn chế độ chơi thật");
                thiz.lblTotalMoney.setTotalGoldWithEffect( thiz.lblTotalMoney.gold, PlayerMe.gold);
                //thiz.lblTotalMoneyHu.setTotalGoldWithEffect( thiz.lblTotalMoneyHu.gold, thiz.totalMoneyHuChoiThu);
            }

        };
        switchMode.setPosition(80, 130);
        this.btnContainer.addChild(switchMode);


        var justWinContainer = new cc.Sprite("#fruit_win_container.png");
        justWinContainer.setPosition(size.width/2 , 102);
        this.btnContainer.addChild(justWinContainer);

        var botY = 100;


        var muccuocBt = new ccui.Button("fruit_btn_cuoc.png", "", "", ccui.Widget.PLIST_TEXTURE);
        muccuocBt.setZoomScale(-0.05);
        muccuocBt.setPosition(382, botY);
        muccuocBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            thiz.onChangeCuoc();
        });
        this.btnContainer.addChild(muccuocBt);

        var lineBt = new ccui.Button("fruit_btn_dong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lineBt.setZoomScale(-0.05);
        lineBt.setPosition(204, botY);
        lineBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            /*var linesDialog = new ChonDongSlotFruitLayer(thiz.lines);
            linesDialog.showWithAnimationScale();*/
        });
        this.btnContainer.addChild(lineBt);

        var color = cc.color(150,2,36);
        this.lblMucCuoc = new cc.LabelTTF("100",font,25);// cc.Label.createWithBMFont(font, "100");
        this.lblMucCuoc.setColor(color);
        this.lblMucCuoc.setPosition(muccuocBt.width/2,+30);
        muccuocBt.addChild(this.lblMucCuoc);

        this.lblDong = new cc.LabelTTF("20",font,25);// cc.Label.createWithBMFont(font, "20");
        this.lblDong.setColor(color);
        this.lblDong.setPosition(lineBt.width/2,+30);
        lineBt.addChild(this.lblDong);

        this.lblTotalBetLbl = new cc.LabelTTF("CƯỢC:",font,25);//cc.Label.createWithBMFont(font,"2500");
        this.lblTotalBetLbl.setColor(cc.color.WHITE);
        this.lblTotalBetLbl.setAnchorPoint(0,.5);
        this.lblTotalBetLbl.setPosition(50,90);
        justWinContainer.addChild(this.lblTotalBetLbl);

        this.lblTotalBet = new cc.LabelTTF("2500",font,25);//cc.Label.createWithBMFont(font,"2500");
        this.lblTotalBet.setColor(cc.color.WHITE);
        this.lblTotalBet.setAnchorPoint(0,.5);
        this.lblTotalBet.setPosition( justWinContainer.width/2,90);
        justWinContainer.addChild(this.lblTotalBet);


        this.lblTotalWinLbl = new cc.LabelTTF("THẮNG:",font,25);//cc.Label.createWithBMFont(font, "0");
        this.lblTotalWinLbl.setColor(cc.color.WHITE);
        this.lblTotalWinLbl.setAnchorPoint(0,.5);

        this.lblTotalWinLbl.setPosition( this.lblTotalBetLbl.x,48);
        justWinContainer.addChild(this.lblTotalWinLbl);

        this.lblTotalWin = new cc.LabelTTF("0",font,25);//cc.Label.createWithBMFont(font, "0");
        this.lblTotalWin.setColor(cc.color.WHITE);
        this.lblTotalWin.setAnchorPoint(0,.5);

        this.lblTotalWin.setPosition( justWinContainer.width/2,48);
        justWinContainer.addChild(this.lblTotalWin);





        //lbl trong khung game show so tien thang
        this.winLbl = new SlotLbl("100", cc.res.font.Tahoma,40);
        this.winLbl.setColor(cc.color(255, 210, 0));
        this.winLbl.setPosition(size.width/2 ,200 );
        this.btnContainer.addChild(this.winLbl);


        var rec = cc.rect(-NONG_TRAI_SLOT_SIZE.width/2 , 200, NONG_TRAI_SLOT_SIZE.width ,  70);
        this.freeSpinLbl = new FreeSpinLbl( cc.res.font.Tahoma_Regular_24, rec, "#fruit_dialog_title.png");
        this.freeSpinLbl.ignoreAnchorPointForPosition(false);
        this.freeSpinLbl.setAnchorPoint(.5, 0);
        this.freeSpinLbl.setPosition(size.width/2, 170);
        this.btnContainer.addChild(this.freeSpinLbl);
        this.freeSpinLbl.setTotalFree(11);


        var btnAutoSpinBt = new AutoSpinButton("fruit_btn_tuquay.png", "fruit_btn_stop.png");
        btnAutoSpinBt.setPosition(914, 95);
        btnAutoSpinBt.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            ToastMessage.getInstance().show("tự quay chưa hỗ trợ");
            return;
            //auto spin cacn start / stop every time
            if(thiz.isPlayingBonus) return;
            // thiz.playEffect(thiz.audioMng, ThanDen.SOUNDS.SPINE_AUTO);
            if(thiz.trialGame){
                ToastMessage.getInstance().show("Không hỗ trợ tự quay ở chế độ chơi thử");
                return;
            }
            //if(!thiz.canClickBtn()) return;
            if(thiz.slotfui.isSpin && !thiz.isAutoSpin){
                var msg = "Vui lòng chờ lượt quay kết thúc đã";
                ToastMessage.getInstance().show(msg);
                return;
            }
            thiz.clickAutoSpin();
                
        });
        this.btnContainer.addChild(btnAutoSpinBt);
        this.btnAutoSpinBt = btnAutoSpinBt;
        //Quay_button
        var btnQuay =   new ccui.Button("fruit_btn_quay.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnQuay.setAnchorPoint(.5,0.5);
        btnQuay.setZoomScale(-0.05);
        btnQuay.setPosition(cc.p(1130,  140));
        btnQuay.addClickEventListener(function () {
            if(thiz.soundEnable) SoundPlayer.playSound("nt_clickchuot");
            if(thiz.isAutoSpin){
                var msg = "Đang tự động quay. Vui lòng dừng tự quay trước";
                ToastMessage.getInstance().show(msg);
                return;
            }
            if(!thiz.canClickBtn()) return;
            thiz.clickSpin();
        });
        this.btnContainer.addChild(btnQuay);
        this.btnQuay = btnQuay;
    },
    canClickBtn: function () {
        var returnVal = this.enableButton;
        if(!returnVal){
            var msg = "Đang quay vui lòng chờ";
            //var dialog = new SlotThanDenOkDialog();
            //dialog.setMessage(msg);
            ////dialog.show(true);
            //dialog.showWithAnimationScale();

            ToastMessage.getInstance().show(msg);

        }
        return returnVal;
    },
    exitToGame: function (message) {
        var homeScene = new HomeScene();
        SceneNavigator.replaceScene(homeScene);
        if (message) {
            ToastMessage.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },
    onChangeCuoc:function () {
        var idx = this.bettingArr.indexOf(this.betting);
        if(idx == (this.bettingArr.length -1) ) idx =0;
        else idx+=1;
        this.betting = this.bettingArr[idx];
        this.refreshCuoc();
    },
    stopSpinAndEnableClick:function () {
        this.enableButton = true;
        this.slotfui.isSpin = false;
    },
    finishSpin:function () {
        var  thiz =  this;
        //thiz.btnQuay.stopAnimation();
        
        this.stopSpinAndEnableClick();
        this.enableClickX2Button =true;
        this.totalMoneyChoiThu+= this.resultSpinParser.dataResult.mX;
        //show animation win - bonus game - .....
        //var data = this.dataResult;
        //check if have wild in any col then call antion
        var isFreeSpin = false;
        if( this.slotfui.getFreeSpining()){
            isFreeSpin = true;
        }
        var thiz = this;
        var callFun = cc.callFunc(function(){
            thiz.showWin();
        });
        var ac = cc.sequence(cc.delayTime(thiz.slotfui.BOUNCE_TIME), callFun );
        //if(this.finishSpinAction){
        //    this.stopAction(this.finishSpinAction);
        //    this.finishSpinAction = null;
        //}
                                  this.stopActionByTag(300);
        this.finishSpinAction =this.runAction( ac);
                                  this.finishSpinAction.setTag(300);
    },
    showWin:function () {
        if(!this.trialGame && !SocketClient.getInstance().isLoggin()){
            return;// case dang quay chua kip show kq click logout tren top thi ko show kq luon
        }
        if(this.resultSpinParser.getMoneyWin() > 0){
            if (this.resultSpinParser.getAllLineWin().length > 0) {
                //show allLine win 1st
                if(this.lineGraphic)this.lineGraphic.clear();
                this.drawMultLine(0, this.resultSpinParser.getAllLineWin() , false);
            }
        }else{
            this.disableClickLines = false;
        }

        var thiz = this;
         //this.resultSpinParser.isJackPot = true;
         //this.resultSpinParser.isSuperBigWin = true;
         //this.resultSpinParser.isBigWin = false;
        this.resultSpinParser.hasBonusGame = false;

         cc.log("=== isJack "+thiz.resultSpinParser.isJackPot);
         //this.resultSpinParser.dataResult.fss = 4;
        var callFun = cc.callFunc(function(){
            if(thiz.lineGraphic)thiz.lineGraphic.clear();
            if (thiz.resultSpinParser.dataResult.fss && thiz.resultSpinParser.dataResult.fss > 0) {
                thiz.totalFreeSpinCount[thiz.roomId] = thiz.resultSpinParser.dataResult.fss;
                thiz.arrayLinesFree[thiz.roomId] = thiz.lines;
                thiz.freeSpinLbl.setTotalFree(thiz.totalFreeSpinCount[thiz.roomId]);
            } else {
                thiz.totalFreeSpinCount[thiz.roomId] =0;
                thiz.freeSpinLbl.setTotalFree(0);
            }
            if (thiz.resultSpinParser.isJackPot) {
                thiz.createEffectJackpot();
            }else if (thiz.resultSpinParser.hasFreeSpin) {
                thiz.createEffectFree();

            }else if (thiz.resultSpinParser.isSuperBigWin) {
                // thiz.createEffectSuperBigWin();
                thiz.createEffectBigWin();
            }else if (thiz.resultSpinParser.isBigWin) {
                thiz.createEffectBigWin();
            } else if (thiz.resultSpinParser.getMoneyWin() > 0) {
                thiz.createEffectWin();
            }else{
                thiz.freeOrBonus();
            }
        });
        var ac = cc.sequence(cc.delayTime(1), callFun );
        //if(this.showWinAction){
        //    this.stopAction(this.showWinAction);
        //    this.showWinAction = null;
        //}
        this.stopActionByTag(100);
        this.showWinAction =this.runAction( ac);
        this.showWinAction.setTag(100);
    },
    showJustWin: function () {
        this.winLbl.visible = true;
        var winMoney = 0;
        if(this.resultSpinParser){
            winMoney = this.trialGame ? this.resultSpinParser.dataResult.mX : this.resultSpinParser.getMoneyWin();
        }
        this.winLbl.setTotalGoldWithEffect(0, winMoney);
    },
    updateMoneyLbl: function (callUpdate) {
        var thiz = this;
        if (thiz.trialGame) {
            //update so du choi thu
            //thiz.lblTotalMoney.text = cc.Global.NumberFormat1(thiz.totalMoneyChoiThu);
            thiz.lblTotalMoney.setTotalGoldWithEffect( thiz.lblTotalMoney.gold, thiz.totalMoneyChoiThu);
            //thiz.lblTotalMoneyHu.text = "0";
            if(thiz.resultSpinParser)thiz.lblTotalWin.setString(cc.Global.NumberFormat1(thiz.resultSpinParser.dataResult.mX));
        } else {
            // if(callUpdate) LobbyRequest.getInstance().requestUpdateMoney();
            if(thiz.resultSpinParser) thiz.lblTotalWin.setString(cc.Global.NumberFormat1(thiz.resultSpinParser.dataResult.mX));
        }
    },
    createEffectJackpot: function () {
        // this.playEffect(this.audioMng, ThanDen.SOUNDS.JACKPOT);
        var winMoney = 0;
        if(this.resultSpinParser){
            winMoney = this.trialGame ? this.resultSpinParser.dataResult.mX : this.resultSpinParser.getMoneyWin();
        }
        var thiz = this;
        this.pausePlayJackpot(false);
        this.showBlackLayer(true);
        this.poupJackpot.setVisible(true);
        this.poupJackpot.setMoneyJackPot(winMoney);
        this.poupJackpot.runAnimationShow();
        this.poupJackpot._popupClose = function () {
            cc.log("vao day kjo poupJackpot._popupSlotFruitClose");
            thiz.pausePlayJackpot(true);
            thiz.freeOrBonus();
            thiz.showBlackLayer(false);
        };

        if(this.trialGame){
            this.totalMoneyHuChoiThu = 50000000;
            this.updatemoneyChoiThu();
        }
        cc.log("show jackpot====");
        //this.showJustWin();
                                  cc.log("updateMoneyLbl====");
        this.updateMoneyLbl(true);
                                  cc.log("updateMoneyLbl==== end");
        this.isAutoSpin = false;
        
        this.btnAutoSpinBt.setAutoSpin(this.isAutoSpin);
    },

    createEffectBonus: function () {

        ///////
        this.finishBonusGame();
        return;
        ////////////

        this.isPlayingBonus = true;//enableButton
        // ToastMessage.getInstance().show("Bonus game .....");
        var thiz = this;
        if(this.dialogMini){
            this.dialogMini.removeFromParent();
            this.dialogMini = null;
        }
        var dialogMini = new SlotFruitMiniGame(this.gameSize, this.resultSpinParser);
        dialogMini.setAnchorPoint(0.5,0.5);
        // dialogMini.setPosition(this.bgSlot.getPositionX() , this.bgSlot.getPositionY());
        dialogMini.setNormalizedPosition(.5,.5);

        dialogMini.playSoundHandler = function (sound, loop) {
            if(thiz.effectEnable) SoundPlayer.playSound(sound, loop);
        }
        this.sceneLayer.addChild(dialogMini,3);
        /*if(TEST_MODE){
            var layerBlack = new cc.LayerColor(cc.color(255,255,0,100),dialogMini.getContentSize().width,dialogMini.getContentSize().height);
            //layerBlack.setIgnoreAnchorPointForPosition(false);
            dialogMini.addChild(layerBlack);
        }*/
        MyTest.dialog = dialogMini;

        this.dialogMini = dialogMini;
        this.dialogMini.startMini();
        var thiz = this;
        this.dialogMini._closeHandler = function () {
            thiz.dialogMini.removeFromParent();
            thiz.dialogMini = null;
            thiz.finishBonusGame();
        };
        // var ac = cc.sequence(cc.delayTime(2), cc.callFunc(this.finishBonusGame));
        // this.runAction(ac);
    },
    finishBonusGame: function (target) {
        var thiz = target? target : this;
        thiz.isPlayingBonus = false;
        //if(thiz.isAutoSpin){
        thiz.finishTurn();
        //}
    },

    createEffectFree: function () {
        /*var thiz = this;
        var cb = function(){
            thiz.runSpineByName(ThanDen.SPINE.FREE_SPIN, thiz.delayThenEndSpinResult);
        };
        thiz.loadSpineThenCallBack(ThanDen.SPINE.FREE_SPIN, cb, thiz);
        */
        this.showJustWin();
        var ac = cc.sequence(cc.delayTime(2), cc.callFunc(this.delayThenEndSpinResult));
        this.runAction(ac);
    },

    showBonusGameFindItem: function (visible) {
    },
    delayThenEndSpinResult: function (target) {
        cc.log("delayThenEndSpinResult =====");
        var thiz =target ? target : this;
        callFun = cc.callFunc(function(){
            thiz.hiddenAllPopup();
            thiz.freeOrBonus();
        });
        var ac = cc.sequence(cc.delayTime(1), callFun );
        //if(thiz.endSpinResult){
        //    thiz.stopAction(thiz.endSpinResult);
        //    thiz.endSpinResult = null;
        //}
                                  thiz.stopActionByTag(400);
        thiz.endSpinResult = thiz.runAction( ac);
                                  thiz.endSpinResult.setTag(400);
    },

    createEffectBigWin: function () {
        // this.playEffect(this.audioMng, ThanDen.SOUNDS.JACKPOT);
        var winMoney = 0;
        if(this.resultSpinParser){
            winMoney = this.trialGame ? this.resultSpinParser.dataResult.mX : this.resultSpinParser.getMoneyWin();
        }
        var thiz = this;
        this.showBlackLayer(true);
        this.pausePlayBigWin(false);
        this.poupBigWin.setVisible(true);
        this.poupBigWin.setMoneyJackPot(winMoney);
        this.poupBigWin.runAnimationShow();
        this.poupBigWin._popupClose = function () {
            cc.log("vao day ko poupJackpot._popupSlotFruitClose");
            thiz.pausePlayBigWin(true);
            thiz.freeOrBonus();
            thiz.showBlackLayer(false);
        };
        //this.showJustWin();
        var ac = cc.sequence(cc.delayTime(2), cc.callFunc(this.delayThenEndSpinResult));
        this.runAction(ac);
    },

    createEffectWin: function () {
        if(this.soundEnable) SoundPlayer.playSound("nt_thangnho");
        this.winLbl.visible = true;
        var winMoney = this.trialGame ? this.resultSpinParser.dataResult.mX : this.resultSpinParser.getMoneyWin();
        this.winLbl.setTotalGoldWithEffect(0, parseInt(winMoney));
        var thiz = this;
        callFun = cc.callFunc(function(){
            thiz.freeOrBonus();
        });
        var ac = cc.sequence(cc.delayTime(2), callFun );
        //if(this.effectWin){
        //    this.stopAction(this.effectWin);
        //    this.effectWin = null;
        //}
                                  this.stopActionByTag(500);
        this.effectWin = this.runAction(ac);
                                  this.effectWin.setTag(500);
    },

    freeOrBonus: function () {
        this.clearAllEffectWin();
        if (this.resultSpinParser.hasBonusGame) {
            //if(!this.isAutoSpin){//tu quay thi show kq luon ko open bonus
            this.createEffectBonus();
            return;
            //}
        }
        if(!this.isPlayingX2 && !this.isPlayingBonus){
            this.finishTurn();
        }
    },
    clearAllEffectWin:function () {
        this.stopActionByTag(100);
        //if(this.showWinAction){
        //    this.stopAction(this.showWinAction);
        //    this.showWinAction = null;
        //}
        this.winLbl.visible = false;
        //clear 20 line
        if(this.lineGraphic) this.lineGraphic.clear();
        //remove any spine eff
        //this.containerSpineEffect.removeChildren();
    },
    finishTurn:function (target, playedX2) {
        var thiz = target? target : this;
        if(!cc.Global.isUndefined(playedX2)){
            //call from slot2dialog when playing or not play x2
            thiz.resultSpinParser.canPlayX2Game = !playedX2;
            thiz.isPlayingX2 = false;
        }
        thiz.updateMoneyLbl(true);
        thiz.winLbl.visible = false;
        if(thiz.btnX2){
            if(thiz.resultSpinParser.canPlayX2Game ) thiz.btnX2.tint  = 0xFFFFFF;//REMOVE TINT EFF IF HAVE
            else thiz.btnX2.tint  = 0xcc000000;
        }


        if(thiz.isAutoSpin){
            var delay = cc.delayTime(.5);

            var cf = cc.callFunc(function(){
                if(thiz.isPlayingX2 || thiz.isPlayingBonus){
                    //prevent click x2btn after finishTurn got ccall
                    return;
                }
                thiz.clickSpin(true);
            });
            var action = cc.sequence(delay, cf);
            thiz.runAction( action);
        }else{
            //draw line win sequnencely
            var lineWin = thiz.resultSpinParser.getAllLineWin();
            if (lineWin != null && lineWin.length > 0) {
                thiz.drawMultLine(0.5, lineWin, true);
            }
        }
    },
    pausePlayJackpot:function (isPause) {
        SoundPlayer.stopAllSound();
        if(isPause)
        {
            if(this.soundEnable) SoundPlayer.playSound("nt_nhacnen",true);
            if(this.soundEnable) SoundPlayer.stopSound("nt_jackpot");
        }else {
            if(this.soundEnable) SoundPlayer.playSound("nt_jackpot",true);
            if(this.soundEnable) SoundPlayer.stopSound("nt_nhacnen");
        }
    },
    pausePlayBigWin:function (isPause) {
        SoundPlayer.stopAllSound();
        if(isPause)
        {
            if(this.soundEnable) SoundPlayer.playSound("nt_nhacnen",true);
            if(this.soundEnable) SoundPlayer.stopSound("nt_thanglon");
        }else {
            if(this.soundEnable) SoundPlayer.playSound("nt_thanglon",true);
            if(this.soundEnable) SoundPlayer.stopSound("nt_nhacnen");
        }
    },
    onExit: function () {
        this._super();
        SoundPlayer.stopAllSound();
        if (this._controller) {
            this._controller.releaseController();
            this._controller = null;
        }
        ToastMessage.getInstance().resetBg();
    },

    onEnter : function () {
        this._super();
        var thiz = this;
        // this.scheduleUpdate();
        SceneNavigator.addBackKeyEvent(this);
        //ToastMessage.getInstance().setBg("dialog_msg.png");
    },
    backButtonClickHandler: function () {
        this.exitToGame();
    },

    initController: function () {
        this._controller = new SlotFruitController(this);
    }
});


