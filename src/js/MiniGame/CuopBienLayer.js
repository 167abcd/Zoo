/**
 * Created by ext on 12/20/2016.
 */

var ItemCuopBien = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        var withMay = 441;
        this.itemWidth = withMay/3;
        this.disHCell = 130;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#pirate_item"+ (idItem).toString()+".png";
        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        this.spriteHoaQua = spriteHoaQua;

        if(idItem == 8){
            spriteHoaQua.setVisible(false);
            var skull  = sp.SkeletonAnimation.createWithCache("skull");
            skull.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
            this.addChild(skull);
            skull.setAnimation(0,"run",true);
        }else  if(idItem == 0){
            spriteHoaQua.setVisible(false);
            var skull  = sp.SkeletonAnimation.createWithCache("pirate");
            skull.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
            this.addChild(skull);
            skull.setAnimation(0,"run",true);
        }


        // var slot_bg_win = new cc.Sprite("#pirate_item"+ (idItem).toString()+"a.png");
        // slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // slot_bg_win.setVisible(false);
        // this.addChild(slot_bg_win,-1);
        // this.slot_bg_win = slot_bg_win;

        // slot_bg_win.runAction(new cc.RepeatForever(
        //     new cc.Sequence(
        //         new cc.FadeTo(0.3,100),
        //         new cc.FadeTo(0.3,255)
        //     )
        // ));


        // var bg = new cc.Sprite("#pirate_item"+ (idItem).toString()+"a.png");
        // bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // bg.setVisible(false);
        // this.bg = bg;
        // this.addChild(bg,-2);
    },
    setWin:function (isWin,isLigth) {
        // this.slot_bg_win.setVisible(isLigth);
        // this.bg.setVisible(isWin);
    },
    stop:function (distance) {
        this.moveSpeed = 3200;
        this.isStop = true;
        var y1 = this.y;//ban dau
        var y3 = y1 - Math.abs(distance - this.disHCell/2);//cuoi
        var y2 = this.biendo; //biendo*2
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        var s = Math.abs(y1 - y3) + y2*2 ;
        this.timeElapsed = 0.0;
        this.acceleration = -(this.moveSpeed*this.moveSpeed) / (s*2);
        this.maxTime = s*2 / this.moveSpeed;

    },
});
// 2  5  8
// 1  4  7
// 0  3  6

var ItemDup = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        var withMay = 260;
        this.itemWidth = withMay/2;
        this.disHCell = 80;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#pirate_item"+ (idItem).toString()+".png";

        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        spriteHoaQua.setScale(0.6);
        this.spriteHoaQua = spriteHoaQua;
        if(idItem==8){

            spriteHoaQua.setVisible(false);
            var skull  = sp.SkeletonAnimation.createWithCache("skull");
            skull.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
            this.addChild(skull);
            skull.setScale(0.7);
            skull.setAnimation(0,"run",true);
        }

        // var slot_bg_win = new cc.Sprite("#pirate_item"+ (idItem).toString()+"a.png");
        // slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // slot_bg_win.setVisible(false);
        // this.addChild(slot_bg_win,-1);
        // this.slot_bg_win = slot_bg_win;

        // slot_bg_win.runAction(new cc.RepeatForever(
        //     new cc.Sequence(
        //         new cc.FadeTo(0.3,100),
        //         new cc.FadeTo(0.3,255)
        //     )
        // ));


        // var bg = new cc.Sprite("#pirate_item"+ (idItem).toString()+"a.png");
        // bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // bg.setVisible(false);
        // this.bg = bg;
        // this.addChild(bg,-2);
    },
    setWin:function (isWin,isLigth) {
        //this.slot_bg_win.setVisible(isLigth);
        // this.bg.setVisible(isWin);
    }
});

var LINE_SLOT_CUOPBIEN = [
    [2,5,8], [2,5,7],[2,5,6],[2,4,8],[2,4,7],
    [2,4,6], [2,3,8],[2,3,7],[2,3,6],[1,5,8],
    [1,5,7],[1,5,6],[1,4,8],[1,4,7],[1,4,6],
    [1,3,8],[1,3,7],[1,3,6],[0,5,8],[0,5,7],
    [ 0,5,6],[0,4,8],[0,4,7],[0,4,6],[0,3,8],
    [0,3,7],[0,3,6]];

var ARR_HUTHUONG_CUOPBIEN_MONEY = [100,1000,10000];
s_random_cuop = [0,1,2,3,4,8];
var SlotCuopBien = SlotLayer.extend({
    ctor: function (soCot) {
        this._super(soCot);
        this.nodeSlot.setContentSize(cc.size(441, 391));
        this.arrResuft = [];
    },
    newItem:function (idItem) {
        var temp = new ItemCuopBien(idItem);
        temp.soCot = this.soCot;
        return temp;
    },
    showLineWin:function (line,mask) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
            for(var j = 0; j < LINE_SLOT_CUOPBIEN[line].length; j++){
                if(i == LINE_SLOT_CUOPBIEN[line][j]){
                    // isLight = ((mask >> j) & 1);
                    isWin = true;
                    // break;
                }
            }
            // this.arrResuft[i].setWin(isWin,isLight);
            this.arrResuft[i].spriteHoaQua.setOpacity(isWin?255:150);
        }

    },
    initRandom:function () {
        this.clearAll();
        this.arrItemRandom = [];
        for (var i = 0; i < 3; i++) { // cot

            var subItem = [];
            var subItemRan = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = s_random_cuop[Math.floor(Math.random()*6)];// Math.floor(Math.random()*6);
                var item = this.newItem(randomItem);
                item.createItem(i,j,0);
                item.isRunning = false;
                this.nodeSlot.addChild(item);
                subItemRan.push(randomItem);
                subItem.push(item);

            }
            this.arrItemRandom.push(subItemRan);
            this.arrItems.push(subItem);
        }
    },
    stopNow:function (ketqua) {
        this.stopAllActions();
        var thiz = this;
        for (var i = this.clolumnCurrent+1; i< this.arrItems.length; i++) {
            (function () {
                var inew = i;
                var subItems = thiz.arrItems[inew];

                thiz.runAction(new cc.Sequence(new cc.DelayTime(inew*0.1),new  cc.CallFunc(function () {
                var  itemTemp = thiz.arrItems[inew][0];//phan tu dau tien cua cot
                var distance = itemTemp.distance2Item + thiz.getMaxYOfColumn(inew,4) ;

                for(var j = 0 ;j < subItems.length; j++)
                {
                    var items = subItems[j];
                    items.stop(distance);
                }
                thiz.initItemsColumn(3,inew,ketqua[inew],distance,true);

                })));

            })();
        }
    },
    clearAllItemInLine:function () {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {

            this.arrResuft[i].setWin(false,false);
            this.arrResuft[i].spriteHoaQua.setOpacity(255);
        }

    }

});

s_random_dup = [5,6,7,8];
var SlotDup = SlotLayer.extend({
    ctor: function (soCot) {
        this._super(soCot);
        this.nodeSlot.setContentSize(cc.size(260, 240));
        this.arrResuft = [];
    },
    newItem:function (idItem) {
        var temp = new ItemDup(idItem);
        temp.soCot = this.soCot;
        return temp;
    },
    showLineWin:function (line,mask) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
            for(var j = 0; j < LINE_SLOT_CUOPBIEN[line].length; j++){
                if(i == LINE_SLOT_CUOPBIEN[line][j]){
                    isLight = ((mask >> j) & 1);
                    isWin = true;
                    // break;
                }
            }
            this.arrResuft[i].setWin(isWin,isLight);
            this.arrResuft[i].spriteHoaQua.setOpacity(isWin?255:150);
        }

    },
    initRandom:function () {
        this.clearAll();
        this.arrItemRandom = [];
        for (var i = 0; i < 3; i++) { // cot

            var subItem = [];
            var subItemRan = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = s_random_dup[Math.floor(Math.random()*4)];
                var item = this.newItem(randomItem);
                item.createItem(i,j,0);
                item.isRunning = false;
                this.nodeSlot.addChild(item);
                subItemRan.push(randomItem);
                subItem.push(item);

            }
            this.arrItemRandom.push(subItemRan);
            this.arrItems.push(subItem);
        }
    },
    clearAllItemInLine:function () {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {

            this.arrResuft[i].setWin(false,false);
            this.arrResuft[i].spriteHoaQua.setOpacity(255);
        }

    }

});



var LINE_CUOPBIEN_NUM = [1,4,6,8,12,16,14,15,2,20,13,10,9,18,11,7,3,5,17,19];
var NumberSlotCuopBien  = ccui.Widget.extend({// ccui.Button.extend({
    ctor:function (s) {
        //  this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this._super();
        this.setContentSize(20,20);
        var sp1 = new cc.Sprite("#pirate_numa_"+ s +".png");
        sp1.setPosition(10,10);
        this.addChild(sp1);


        var sp2 = new cc.Sprite("#pirate_num_"+ s +".png");
        sp2.setPosition(10,10);
        this.addChild(sp2);
        sp2.setVisible(true);

        this.sp1 = sp1;
        this.sp2 = sp2;
        // var lblBel = new cc.LabelTTF(s, cc.res.font.Roboto_CondensedBold,16);
        // // lblBel.setColor(cc.color(95,115,217));
        // lblBel.setPosition(cc.p(this.getContentSize().width/2-2, this.getContentSize().height/2));
        // this.addChild(lblBel);
        // this.lblBel = lblBel;

    },
    visibleNew:function (isVisible) {
        this.sp1.setVisible(isVisible);
        this.sp2.setVisible(!isVisible);
    },
});
var CuopBienLayer = MiniGamePopup.extend({
    ctor: function () {

        this._super();
        var thiz = this;
        // thiz.setScale(1.3);
        this.isHaveData = true;
        this._boudingRect = cc.rect(220, 102, 858, 580);

        this.rolling = false;
        // this.timeRemainingInterval = null;
        // this.timeRemaining = 0;


        var bgUnder = new cc.Sprite("#pirate_bg2.png");
        bgUnder.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgUnder);


        var bg = new cc.Sprite("#pirate_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this.bg = bg;

        // 3*3
        var slotfui = new SlotCuopBien(3);
        slotfui.setPosition(cc.p(260,171));
        bgUnder.addChild(slotfui);
        slotfui.initRandom();
        slotfui._finishedHandler = function () {

            if(!thiz.btnStop.istop ){
                thiz.slotDup.stopSlotWithResuft( thiz.dataSlot[3]);
            }

        };
        this.slotfui = slotfui;



        var slotDup = new SlotDup(2);
        slotDup.setPosition(cc.p(743,223));
        bgUnder.addChild(slotDup);
        slotDup._finishedHandler = function () {
            thiz.onFinishQuay();


        };
        slotDup.initRandom();

        this.slotDup = slotDup;

        var pirate_cover = new cc.Sprite("#pirate_cover.png");
        // pirate_cover.setAnchorPoint(0,0);
        pirate_cover.setPosition(cc.p(872,346));
        this.bg.addChild(pirate_cover);

        var bxhButton = new ccui.Button("pirate_btnBxh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhButton.setPosition(1056, 339);
        bg.addChild(bxhButton, 5);
        bxhButton.addClickEventListener(function () {
            var bangvinhdanh = new AllBangVinhDanhLayer(GameType.MiniGame_CuopBien_Slot);
            bangvinhdanh.show();
        });

        var tutorialButton = new ccui.Button("pirate_btnTutorial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.setPosition(1056, 274);
        bg.addChild(tutorialButton, 5);
        tutorialButton.addClickEventListener(function () {
            var hdan = new CuopBienHuongDanDialog();
            hdan.show();
        });

        this.isSieuToc = false;
        var pirate_sieutoc = new ccui.Button("pirate_sieutoc_off.png", "", "", ccui.Widget.PLIST_TEXTURE);
        pirate_sieutoc.addClickEventListener(function () {
            thiz.isSieuToc = !thiz.isSieuToc;
            pirate_sieutoc.loadTextureNormal(thiz.isSieuToc?"pirate_sieutoc_on.png":"pirate_sieutoc_off.png",ccui.Widget.PLIST_TEXTURE);
        });
        pirate_sieutoc.setPosition(337, 126);
        bg.addChild(pirate_sieutoc, 5);


        var historyButton = new ccui.Button("pirate_btnHistory.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.addClickEventListener(function () {
            var lichsupop = new AllLichSuLayer(GameType.MiniGame_CuopBien_Slot);
            lichsupop.show();
        });
        historyButton.setPosition(1056, 405);
        bg.addChild(historyButton, 5);

        var closeButton = new ccui.Button("pirate_btnClose.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(745, 575);
        bg.addChild(closeButton, 5);
        closeButton.addClickEventListener(function () {
            thiz.closeButtonHandler();
        });

        var btnRotate = new ccui.Button("pirate_btnRoate.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRotate.setPosition(494, 126);
        bg.addChild(btnRotate);
        btnRotate.addClickEventListener(function () {
            thiz.enableAutoRotate(false);
            thiz.rotateRequest();
        });
        thiz.btnRotate = btnRotate;

        // var btn20Row = new ccui.Button("pirate_btn20.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // btn20Row.setPosition(180, 72);
        // bg.addChild(btn20Row, 5);
        // this.btn20Row = btn20Row;
        var tesst = 0;
        // btn20Row.addClickEventListener(function () {
        //
        //     // for(var k = 0; k < thiz.arrLine.length; k++){
        //     //     thiz.arrLine[k].setVisible(false);
        //     // }
        //     // thiz.arrLine[tesst].setVisible(true);
        //
        //     thiz.selectLine.setVisible(true);
        //     thiz.enableAutoRotate(false);
        //
        // });


        // var lblRowNumber =   cc.Label.createWithBMFont("res/Texture/Egg/fnt_line3x3.fnt", "20 dòng");
        // lblRowNumber.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2 + 5);
        // btn20Row.addChild(lblRowNumber);
        //
        //
        //
        // this.lblRowNumber = lblRowNumber;


        var btnAuto=   new ccui.Button("pirate_btnAuto.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(622, 126);
        bg.addChild(btnAuto, 5);
        this.btnAuto = btnAuto;
        this.isAutoRotate = false;
        btnAuto.addClickEventListener(function () {
            thiz.clickAutoQuay();
        });

        var huThuongLabel =    cc.Label.createWithBMFont("res/Texture/CuopBien/fnt_cuopbien_hu.fnt", "0");
        // huThuongLabel.setColor(cc.color("#ffea00"));
        // huThuongLabel.setAnchorPoint(cc.p(0, 0.5));
        huThuongLabel.setPosition(885, 500);
        bg.addChild(huThuongLabel, 1);

        this.huThuongLabel = huThuongLabel;
        var jacpotEvent = new JackpotMultiplyEvent.GameIconNoMove(GameType.MiniGame_CuopBien_Slot,1);
        thiz.jacpotEvent = jacpotEvent;
        jacpotEvent.setPosition(266, 565 );
        this.addChild(jacpotEvent,100);
        this.initBetting();

        // var pirate_tittle =new cc.Sprite("#pirate_tittle.png");
        // pirate_tittle.setPosition(525,604);
        // this.bg.addChild(pirate_tittle);



        var btnStop = new ccui.Button("pirate_btnStop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnStop.setPosition(btnRotate.getPosition());
        this.bg.addChild(btnStop);
        btnStop.setVisible(false);
        btnStop.istop = false;
        this.btnStop = btnStop;

        btnStop.addClickEventListener(function () {
            btnStop.istop = true;
            thiz.handelStopButton();
        });
        this.initLine();


        // var selectLine = new SelectLineCuopBien();
        // selectLine.setAnchorPoint(cc.p(0.5, 0.5));
        // selectLine.setPosition(this.bg.width/2, this.bg.height/2);
        // this.bg.addChild(selectLine,10);
        // selectLine._lineClickHandler = function () {
        //     thiz.stopAllActions();
        //     thiz.clearAllLine();
        //     // thiz.onSetTextBet();
        //
        //     for(var i = 0; i < thiz.arrNum.length; i++){
        //         thiz.arrNum[i].visibleNew(false);
        //     }
        //     var lines = selectLine.getLines();
        //     for(var i = 0; i < lines.length; i++){
        //         thiz.arrNum[thiz.getLine(lines[i])].visibleNew(true);
        //
        //     }
        //     // thiz.lblRowNumber.setString(lines.length.toString() + " dòng");
        // };
        // selectLine._clickOneLine = function (line,isShow) {
        //     thiz.arrNum[thiz.getLine(line+1)].visibleNew(isShow);
        //     // thiz.lblRowNumber.setString(selectLine.getLines().length.toString() + " dòng" );
        // };
        // selectLine.setVisible(false);
        // this.selectLine = selectLine;

        // var bg_money = new cc.Sprite("#pirate_bg_money.png");
        // bg_money.setPosition(bg.width/2,bg.height/2 - 20);
        // bg.addChild(bg_money,5);

        var lblMoneyWin  =  new cc.LabelBMFont("", "res/Texture/CuopBien/fnt_cuopbien_tienthang.fnt");
        // lblMoneyWin.setColor(cc.color(255,216,36,255));
        lblMoneyWin.setPosition(533,322);
        bg.addChild(lblMoneyWin,5);
        this.lblMoneyWin = lblMoneyWin;
        // this.bg_money = bg_money;
        this.setTextWin("0");




        // this.moneyJackpot = 50000;
        //
        // this.showJackpot();
        //
        // this.showBigWin(5000);

        //
        // var fire = new  cc.ParticleSystem("res/Texture/CuopBien/particle_texture.plist");
        // fire.setScale(0.7);
        // fire.setPosition(cc.p(295, 137));
        // this.bg.addChild(fire,5);
        //
        // var fire1 = new  cc.ParticleSystem("res/Texture/CuopBien/particle_texture.plist");
        // fire1.setScale(0.7);
        // fire1.setPosition(cc.p(769, 137));
        // this.bg.addChild(fire1,5);


        // setTimeout((function () {
        //     testSpine.setAnimation(0,"idle",false);
        // }),1000);


    },
    show: function () {
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(false);
            parent.removeFromParent(false);
        }

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 0));
        bg.addChild(this);

        var runningScene = cc._mainScene;
        if (runningScene) {
            if (runningScene.miniGameLayer) {
                runningScene.miniGameLayer.addChild(bg)
            }
            else {
                runningScene.addChild(bg);
            }
        }
        this._controller.sendJoinGame(this.indexBeting+1);
    },
    setTextWin:function (value) {
        // this.bg_money.setVisible(false);
        // this.lblMoneyWin.stopAllActions();
        if(parseInt(value) == 0){
            this.lblMoneyWin.setString("");
        }
        else{
            // this.bg_money.setVisible(true);
            this.lblMoneyWin.setString(cc.Global.NumberFormat1(parseInt(value)));
            // var action = new ext.ActionNumber(0.5, parseInt(value));
            // this.lblMoneyWin.runAction(action);
        }

    },

    handelStopButton:function () {
        this.enableAutoRotate(false);
        this.slotfui.stopNow(this.dataSlot["2"]);
        this.slotDup.stopNow(this.dataSlot["3"]);
    },
    clickAutoQuay:function () {
        if(!SocketClient.getInstance().isLoggin() ){
            MessageNode.getInstance().show("Bạn chưa login");
            return;
        }

        if(this.isTry){
            MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
            return;
        }
        if(this.isAutoRotate ){
            if(this.btnStop.isVisible()){
                this.handelStopButton();
            }
            this.enableAutoRotate(false);
            return;
        }
        if(!this.isHaveData  ){

            return;
        }
        this.enableAutoRotate(true);

        this.rotateRequest();


        // if(!this.isHaveData  || this.isAutoRotate){
        //     return;
        // }
        //
        // this.enableAutoRotate(true);
        //
        // this.rotateRequest();
    },
    getLine:function (index) {
        for(var i = 0; i < LINE_CUOPBIEN_NUM.length; i++){
            if(LINE_CUOPBIEN_NUM[i] == index){
                return i;
            }
        }
        return 0;
    },
    initLine:function () {
        this.arrLine = [];
        for(var i = 0; i< 27;i++){
            var line = new cc.Sprite("#cb_line" + (i+1).toString()+ ".png");
            line.setPosition(cc.p(line.getContentSize().width/2,line.getContentSize().height/2));
            line.setVisible(false);
            this.bg.addChild(line,3);
            this.arrLine.push(line);
        }
        this.arrNum = [];
        // for(var i = 0; i < 20; i++){
        //     var buttonNumer = new NumberSlotCuopBien(LINE_CUOPBIEN_NUM[i].toString());
        //     buttonNumer.setPosition(cc.p((i%2==0)?183:521, 347 - Math.floor(i/2)*25));
        //     this.bg.addChild(buttonNumer);
        //     this.arrNum.push(buttonNumer);
        //     buttonNumer.visibleNew(true);
        // }
    },
    rotateRequest:function () {


        if(SocketClient.getInstance().isLoggin() ){
            // this.sceneLayer.removeChildByTag(7777);
            // this.sceneLayer.removeChildByTag(6666);
            // this.sceneLayer.removeChildByTag(5555);
            if(this.nodeBigWin != undefined && this.nodeBigWin != null){
                this.nodeBigWin.removeFromParent(true);
                this.nodeBigWin = null;
            }

            this.setTextWin("0");
            this.activeButtonNewGame(false);
            // this.btnX2.setVisible(false);
            this.clearLineDraw();
            this.stopAllActions();
            //
            //
            this.slotfui.rotate();
            this.slotDup.rotate();
            this.btnStop.istop = false;
            this.isHaveData = false;
            this.setBettingSelectEnable(false);
            this._controller.sendRouteRequest(this.indexBeting+1);
            if( this._soundRotate != undefined &&  this._soundRotate != null){
                SoundPlayer.stopSoundLoop(this._soundRotate );
            }
            // this._soundRotate =   SoundPlayer.playSoundLoop("quayrepeat");
        }else {
            MessageNode.getInstance().show("Bạn chưa login");

        }




    },

    clearLineDraw:function () {
        for(var i = 0;i<27;i++){
            this.arrLine[i].setVisible(false);
            // this.arrNum[i].visibleNew(false);

        }
    },
    clearAllLine:function () {
        this.clearLineDraw();
        this.slotfui.clearAllItemInLine();
    },
    initBetting:function () {
        var thiz = this;
        this.arrButtonBet = [];
        for(var i = 0; i < 3; i++){
            (function () {
                var inew = i;
                var btnBet = new ccui.Button("pirate_btnBet1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnBet.setPosition(207, 465 -  inew*104);
                // btnBet.setScale9Enabled(true);
                btnBet.addClickEventListener(function () {
                    thiz.onClickBetting(inew);
                });
                // var label = new cc.LabelBMFont(ARR_BET_MONEY[inew], cc.res.font.Roboto_Medium_20);
                // label.setScale(0.8);
                // label.setColor(cc.color(255,216,36,255));
                // label.setPosition(23,-8);
                // btnBet.addChild(label);
                // btnBet.lblM = label;
                thiz.bg.addChild(btnBet);
                thiz.arrButtonBet.push(btnBet);
            })();


        }
        this.isEnableBetting = true;
        this.onClickBetting(0);
    },
    onClickBetting:function (index) {
        if(!this.isEnableBetting){
            return;
        }
        this.indexBeting = index;
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_CuopBien_Slot,ARR_HUTHUONG_CUOPBIEN_MONEY[index])));
        for(var i = 0; i < this.arrButtonBet.length; i++){
           // this.arrButtonBet[i].lblM.setColor(cc.color("f6bc70"));
            this.arrButtonBet[i].loadTextureNormal("pirate_btnBet"+(i+1).toString()+".png",ccui.Widget.PLIST_TEXTURE);
        }
        // this.arrButtonBet[index].lblM.setColor(cc.color("ffd824"));
        this.arrButtonBet[index].loadTextureNormal("pirate_btnBet"+(index+1).toString()+"a.png",ccui.Widget.PLIST_TEXTURE);
        this._controller.sendJoinGame(this.indexBeting+1);
        this.jacpotEvent.setBetting(this.indexBeting+1);
    },


    setBettingSelectEnable:function (isEnable) {
        this.isEnableBetting = isEnable;
        // for(var i = 0; i < this.arrButtonBet.length; i++){
        //     // setEN    this.arrButtonBet
        //     this.setActiveBt(this.arrButtonBet[i],isEnable);
        // }
    },

    onFinishQuay:function () {


        var  thiz =  this;
        var moneyWin =   this.dataSlot["4"]["3"];
        this.setTextWin(moneyWin);
        SocketClient.getInstance().postEvent("refreshAsset", {});


        this.activeButtonNewGame(true);


        var timeNoHu = 0;
        if(this.dataSlot["4"]["4"]){
            timeNoHu = 5;
            this.updateHuThuong();
            this.showJackpot();
        }
        //
        if(parseInt(moneyWin) >= 200*ARR_HUTHUONG_CUOPBIEN_MONEY[this.indexBeting] && !this.dataSlot["4"]["4"])
        {
            thiz.showBigWin(moneyWin);
        }



        // SoundPlayer.playSound("slot_win");

        this.btnStop.setVisible(false);


        this.runAction(new cc.Sequence(new cc.CallFunc(function () {
              thiz.showAllLineWin();
            }),
            new cc.DelayTime(this.isAutoRotate?1:0.5),
            new cc.CallFunc(function () {
                thiz.setTextWin("0");
               thiz.clearAllLine();
            }),
            new cc.CallFunc(function () {
               if(!thiz.isAutoRotate)
              thiz.showOneLine();
            })
        ));

        if(this.isAutoRotate){
            this.runAction(new cc.Sequence(new cc.DelayTime((moneyWin>0?1.5:0.7) + timeNoHu),new cc.CallFunc(function () {
                if(!thiz.isHaveData){
                    return;
                }
                if(thiz.isAutoRotate){

                    thiz.rotateRequest();
                }
                else{
                    thiz.setBettingSelectEnable(true);
                }
            })));

        }else{
            this.setBettingSelectEnable(true);
        }
    },
    activeButtonNewGame:function (isActive) {

        // this.setActiveBt(this.btnTry,isActive);
        // this.setActiveBt(this.btn20Row,isActive);
        this.setActiveBt(this.btnRotate,isActive);


    },

    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },

    showAllLineWin:function(){
        var obArrLine = this.dataSlot["4"]["1"];

        for(var i = 0; i < obArrLine.length  ; i++){
            var line = obArrLine[i];
            var idLine =  line["1"]-1;
            this.arrLine[idLine].setVisible(true);
            this.slotfui.showLineWin(idLine,line["3"]);
        }


    },
    showOneLine:function () {
        var thiz = this;
        var arrAction  = [];
        var obArrLine = this.dataSlot["4"]["1"];
        var money1Line = 0;
        this.isPlaySound = true;
        for(var i = 0; i < obArrLine.length  ; i++){

            (function () {
                var iNew = i;
                var line = obArrLine[iNew];
                var idLine =  line["1"]-1;
                money1Line += parseInt(line["4"]);
                var zzz = money1Line;
                var actionLine = new cc.CallFunc(function () {
                    thiz.arrLine[idLine].setVisible(true);
                    // thiz.lblMoneyLine.stopAllActions();
                    // if(iNew==0 ){
                    //     thiz.lblMoneyLine.setString("0");
                    // }
                    // if(obArrLine.length>1)
                    // {
                    //     thiz.lblMoneyLine.runAction(new ext.ActionNumber(0.25, zzz));
                    // }
                    // else {
                    //     thiz.lblMoneyLine.setString(cc.Global.NumberFormat1(zzz));
                    // }
                    // if(obArrLine.length == iNew+1){
                    //     thiz.lblMoneyLine.setVisible(false);
                    // }

                    thiz.slotfui.showLineWin(idLine,line["3"]);
                    if(thiz.isPlaySound){
                        // SoundPlayer.playSound("slot_line");
                    }

                    if(iNew ==obArrLine.length-1 ){
                        thiz.isPlaySound = false;
                    }
                });
                var clearzzz =  new cc.CallFunc(function () {
                    thiz.clearAllLine();
                });
                var delayTime = new cc.DelayTime(1);

                arrAction.push(actionLine);
                arrAction.push(delayTime);
                arrAction.push(clearzzz);
            })();

        }
        if(arrAction.length!=0){
            this.runAction(new cc.RepeatForever(new cc.Sequence(arrAction)));
        }

        thiz.setTextWin("0");
    },

    onError:function(params){
        SoundPlayer.stopAllSound();
        this.setBettingSelectEnable(true);
        if(params["code"] == 102) {

            MessageNode.getInstance().show("Bạn chưa login");
        }

        this.slotfui.clearAll();
        this.slotDup.clearAll();

        this.isHaveData = true;
        this.activeButtonNewGame(true);
        this.enableAutoRotate(false);
        if(this.dataSlot == undefined)
        {
            if( this.slotfui.arrItemRandom != undefined && this.slotfui.arrItemRandom.length !=0  ){
                this.slotfui.showNotEffect(this.slotfui.arrItemRandom);

            }
            else {
                this.slotfui.initRandom();
            }


        }else if(this.dataSlot[2]!= null && this.dataSlot[2].length >0){
            this.slotfui.showNotEffect(this.dataSlot[2]);
        }

        // }
    },
    playSoundLost : function () {
        // SoundPlayer.playSound("thuaroi");
    },

    initHistory: function () {
        var historyList = new newui.TableView(cc.size(450, 41), 1);
        historyList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        historyList.setReverse(true);
        historyList.setPosition(30, 24);
        // historyList.setMargin(margin, margin, 0, 0);
        // historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        this.bg.addChild(historyList, 3);
        this.historyList = historyList;

        // for(var i=0;i<4;i++){
        //     this.addHistory(0);
        //     //this.addHistory( Math.floor((Math.random() * 13)));
        // }
    },

    initController: function () {
        this._controller = new CuopBienController(this);
    },


    update: function (dt) {
        if (this.rolling) {
            // dang quay
            this.delta += dt;
            // if (this.delta < 0.1)
            //     return;
            var randNum = Math.floor(Math.random() * 51 + 4);
            var thiz = this;
            var texture = "" + Math.floor(randNum / 4) +
                s_card_suit[randNum % 4] + ".png";
            this.card.setSpriteFrame(texture);
            this.delta = 0;
        }
    },
    showJackpot: function () {

        var nohu = new NoHuCuopBien();
        var scen = cc.director.getRunningScene();
        scen.addChild(nohu, 100000);
        nohu.showHuThuong(cc.Global.NumberFormat1(parseInt(this.moneyJackpot)));
        this._controller.isNohu = false;
        return;


        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(7777);
        nodeJackpot.isCanRemove = false;

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(this.bg.width, this.bg.height));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                nodeJackpot.removeFromParent();
        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        }),new cc.DelayTime(2),new cc.CallFunc(function () {
            nodeJackpot.removeFromParent();
        }) ));
        nodeJackpot.addChild(toucWidget);

        var jackpotSprite = new cc.Sprite("#pirate_nohu.png");
        jackpotSprite.setScale(0.8);
        jackpotSprite.setPosition(this.bg.width/2, this.bg.height/2);
        nodeJackpot.addChild(jackpotSprite,1);

        var effectXu = new cc.Sprite("#pirate_anhsang.png");
        // effectXu.setAnchorPoint(cc.p(0.7, 0.7));
        effectXu.setScale(0.8);
        effectXu.setPosition(this.bg.width/2, this.bg.width/2);
        nodeJackpot.addChild(effectXu);
        effectXu.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));


        this.bg.addChild(nodeJackpot, 1000);
        var lblHuno = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_25, cc.Global.NumberFormat1(parseInt(this.moneyJackpot)));
        lblHuno.setPosition(jackpotSprite.width/2-10,68);
        lblHuno.setColor(cc.color(255,222,0,255));
        jackpotSprite.addChild(lblHuno);
    },
    showBigWin: function (money) {


        var nohu = new BigWinCuopBien();
        var scen = cc.director.getRunningScene();
        scen.addChild(nohu, 100000);
        nohu.showHuThuong(cc.Global.NumberFormat1(parseInt(money)));
        return;

        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(8888);
        nodeJackpot.isCanRemove = false;

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(this.bg.width, this.bg.height));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                nodeJackpot.removeFromParent();
        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        }),new cc.DelayTime(4),new cc.CallFunc(function () {
            nodeJackpot.removeFromParent();
        }) ));
        nodeJackpot.addChild(toucWidget);

        var jackpotSprite = new cc.Sprite("#pirate_bg_bigwin.png");
        jackpotSprite.setPosition(this.bg.width/2, this.bg.height/2);
        nodeJackpot.addChild(jackpotSprite,1);

        var effectXu = new cc.Sprite("#pirate_bigWin.png");
        // effectXu.setScale(1);
        effectXu.setPosition(this.bg.width/2, this.bg.width/2+50);
        nodeJackpot.addChild(effectXu);
        effectXu.runAction( new cc.RepeatForever(new cc.RotateBy(3,360)));


        this.bg.addChild(nodeJackpot, 1000);
        var lblHuno = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_25, cc.Global.NumberFormat1(parseInt(money)));
        lblHuno.setPosition(jackpotSprite.width/2,40);
        lblHuno.setColor(cc.color(255,222,0,255));
        jackpotSprite.addChild(lblHuno);

    },


    saveDataJackpot:function (money) {
        this.moneyJackpot =   money;
    },
    updateHuThuong:function () {
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_CuopBien_Slot,ARR_HUTHUONG_CUOPBIEN_MONEY[this.indexBeting])) );
    },



    enableAutoRotate:function (isEnable) {
        // this.setActiveBt(this.btnAuto,!isEnable);
        this.isAutoRotate = isEnable;
        this.btnAuto.loadTextureNormal(isEnable?"pirate_btnAutoa.png":"pirate_btnAuto.png",ccui.Widget.PLIST_TEXTURE);

    },

    setGameId: function (gameId) {
        this.gameIdLabel.setString("(" + gameId+")");
    },

    handleResuftZ:function(isReconnect,param){
        if(!isReconnect){
            this.runAction(new cc.Sequence(new cc.DelayTime(0.05), new cc.CallFunc(function () {
                // SoundPlayer.stopSoundLoop(thiz._soundRotate);


            })));

        }
        this.dataSlot = param;
        var arrItem = param["2"];
        var moneyWin = param["4"]["2"];
        this.isHaveData = true;

        if(moneyWin == null){
            this.moneyWin = "0";
        }

        var thiz =  this;

        if(arrItem.length > 0 ){
            this.btnStop.setVisible(true);
        }
        if(isReconnect){
            this.arrFreeSpin = [];
            this.isFreeSpin = 0;
            this.slotfui.showNotEffect(arrItem);
            thiz.onFinishQuay();
        }else {
            if( !this.isSieuToc ){
                this.slotfui.stopSlotWithResuft(arrItem);
            }else {
                thiz.btnStop.istop = true;
                this.slotfui.stopNow(arrItem);
                this.slotDup.stopNow(this.dataSlot["3"]);
            }

        }

    },



    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        //s_CaoThapLayer = this;
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_CaoThapLayer = null;
    },

    // onError: function (param) {
    //     this._super(param);
    //
    //     //het tien
    //     this.setRolling(false);
    //     this.clearTurn();
    // }
});

