/**
 * Created by ext on 12/20/2016.
 */

var ItemCandy = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        var withMay = 274;
        this.itemWidth = withMay/3;
        this.disHCell = 70;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#egg_item"+ (idItem).toString()+".png";
        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        this.spriteHoaQua = spriteHoaQua;


        var slot_bg_win = new cc.Sprite("#egg_item"+ (idItem).toString()+"a.png");
        slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        slot_bg_win.setVisible(false);
        this.addChild(slot_bg_win,-1);
        this.slot_bg_win = slot_bg_win;

        // slot_bg_win.runAction(new cc.RepeatForever(
        //     new cc.Sequence(
        //         new cc.FadeTo(0.3,100),
        //         new cc.FadeTo(0.3,255)
        //     )
        // ));


        // var bg = new cc.Sprite("#egg_item"+ (idItem).toString()+"a.png");
        // bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // bg.setVisible(false);
        // this.bg = bg;
        // this.addChild(bg,-2);
    },
    setWin:function (isWin,isLigth) {
        this.slot_bg_win.setVisible(isLigth);
        // this.bg.setVisible(isWin);
    }
});
// 2  5  8
// 1  4  7
// 0  3  6

var LINE_SLOT_CANDY = [
    [2,5,8], [1,4,7],[0,3,6],[2,3,8],[0,5,6],
    [2,4,8], [2,4,6],[0,4,8],[1,3,7],[1,5,7],
    [0,4,6],[2,5,7],[1,4,6],[1,4,8],[0,3,7],
    [1,5,8],[0,4,7],[2,4,7],[1,3,6],[2,3,7]];

var ARR_HUTHUONG_CANDY_MONEY = [100,1000,10000];

var SlotCandy = SlotLayer.extend({
    ctor: function (soCot) {
        this._super(soCot);
        this.nodeSlot.setContentSize(cc.size(274,210));
        this.arrResuft = [];
    },
    newItem:function (idItem) {
        var temp = new ItemCandy(idItem);
        temp.soCot = this.soCot;
        return temp;
    },
    showLineWin:function (line,mask) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
            for(var j = 0; j < LINE_SLOT_CANDY[line].length; j++){
                if(i == LINE_SLOT_CANDY[line][j]){
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
                var randomItem = Math.floor(Math.random()*6);
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


var SelectLineCandy =  cc.Node.extend({
    ctor:function () {
        this._super();
        var thiz = this;
        thiz.setContentSize(cc.size(495,480))
        var dialogBg = new ccui.Scale9Sprite("egg_bg_line.png", cc.rect(4,4,4,4));
        dialogBg.setPreferredSize(cc.size(495,480));
        // dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition(495/2 , 480/2-1);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(thiz.preTouchPointBg != null){
                    return false;
                }
                if(thiz.isVisible()){
                    var p = dialogBg.convertToNodeSpace(touch.getLocation());
                    // var p2 = thiz.convertToNodeSpace(bg_sc.getPosition());
                    // var rect = this.getBoundingBox();
                    if (!cc.rectContainsPoint( cc.rect(0, 0, dialogBg.getContentSize().width, dialogBg.getContentSize().height), p)) {
                         thiz.setVisible(false);

                    }
                    return true;
                }
                else{
                    return false;
                }

            }
        }, dialogBg);


        var closeButton = new ccui.Button("egg_btnClose.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(cc.p(460,450));
        closeButton.addClickEventListener(function () {
            thiz.setLineSend();
        });
        var lbl = new cc.Sprite("#egg_tille_chondong.png");
        lbl.setPosition(dialogBg.getContentSize().width/2,450);

        dialogBg.addChild(lbl);

        this.addChild(dialogBg);
        dialogBg.addChild(closeButton);

        // var nodeLine = new ccui.Widget();
        // nodeLine.setContentSize(cc.size(700, 440));
        // nodeLine.setPosition(1060/2,823/2);
        // dialogBg.addChild(nodeLine)
        this.arrLine = [];
        this.arrNumLine = [];
        for(var i = 0; i < 20; i++){
            (function () {
                var xP =  48+ 90*(i%5) ;
                var yP =  160+ 75*Math.floor(i/5);
                var wgTemp = new ccui.Widget();
                wgTemp.setTouchEnabled(true);
                wgTemp.setContentSize(90,75);


                var bg = new cc.Sprite("#egg_nl_bg1.png");
                // bg.setZoomScale(0);
                // var bg = new cc.Sprite("#slot_sl_bg.png");
                var lol = (3-Math.floor(i/5))*5;
                var num = lol + i%5;

                // var bg_num = new cc.Sprite("#slot_sl_bg_num.png");
                // bg_num.setPosition(bg.getContentSize().width/2, -20);
                // bg.addChild(bg_num);

                var line = new cc.Sprite("#egg_nl_"+(num+1).toString() +".png");

                line.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
                // if(num>10 ){
                //     line.setPosition(bg.getContentSize().width/2 -8, bg.getContentSize().height/2 +10);
                // }
                // if(num == 12 ){
                //     line.setPosition(bg.getContentSize().width/2 - 16, bg.getContentSize().height/2+20 );
                // }

                bg.addChild(line);
                thiz.arrNumLine.push(num+1);
                // var lbl = new cc.LabelTTF((num+1).toString(), cc.res.font.Roboto_Medium,14);
                // lbl.setColor(cc.color("#ebd592"));
                // lbl.setAnchorPoint(1,0.5);
                // lbl.setPosition( 30, 93);
                // bg.addChild(lbl);
                bg.setTag(1);
                dialogBg.addChild(wgTemp);
                bg.setPosition(60,30);
                wgTemp.addChild(bg);
                wgTemp.setPosition(cc.p(xP,yP));
                wgTemp.addClickEventListener(function () {
                    thiz.handleClickLine(num);
                });

                thiz.arrLine.push({"line":bg,"isActive":true,"id":num});
            })();



        }
        var okChan = new ccui.Button("egg_btnChan.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogBg.addChild(okChan);
        okChan.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?false:true);
            }
            thiz.setLineSendNotHiden();
        });
        okChan.setPosition(72,43);
        var aaa = 115;
        var okLe =new ccui.Button("egg_btnLe.png","","", ccui.Widget.PLIST_TEXTURE);
        okLe.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?true:false);
            }
            thiz.setLineSendNotHiden();
        });
        dialogBg.addChild(okLe);
        okLe.setPosition(72+ aaa,43);

        var okAll =new ccui.Button("egg_btnAll.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogBg.addChild(okAll);
        okAll.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],true);
            }
            thiz.setLineSendNotHiden();
        });
        okAll.setPosition(72+ 2*aaa,43);


        var okDone = new ccui.Button("egg_btnBo.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogBg.addChild(okDone);
        okDone.addClickEventListener(function () {
            thiz.setLineSend();
        });
        okDone.setPosition(72+ 3*aaa,43);
        this.initView();
    },

    setLineReconnect:function (arrLineSeLect) {

        for(var j = 0; j < this.arrLine.length; j++){
            var isActive = false;
            for(var i = 0; i < arrLineSeLect.length; i++){
                if(this.arrLine[j]["id"] == arrLineSeLect[i]-1){
                    isActive = true;
                    break;
                }
            }
            this.setActiveBt(this.arrLine[j],isActive);
        }
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        // if(thiz._lineReconnect){
        //     thiz._lineReconnect();
        // }
    },
    setLineSend:function () {
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        this.setVisible(false);
        if(thiz._lineClickHandler){
            thiz._lineClickHandler();
        }
    },

    setLineSendNotHiden:function () {
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }

        if(thiz._lineClickHandler){
            thiz._lineClickHandler();
        }
    },

    getLineWithID :function (idLine) {
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["id"]==idLine){
                return   this.arrLine[i];
            }
        }
        return 0;
    },
    selectLineWhenJoin:function (arrIdLine) {
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            this.arrLine[i]["isActive"] = false;
        }
        for(var i = 0; i < arrIdLine.length; i++){
            var line = this.getLineWithID(arrIdLine[i]);
            line["isActive"] = true;
        }

        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }

        if(thiz._lineClickHandler){
            thiz._lineClickHandler();
        }
    },
    initView:function () {
        var thiz = this;
        this.mTouch = cc.rect(0, 0 ,495,480);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),495,480);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(!thiz.isVisible())
                {
                    return false;
                }
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(thiz.mTouch, p)){
                    thiz.setLineSend();
                    thiz.setVisible(false);
                    // thiz.removeFromParent(true);
                    return true;
                }
                else {
                    return false;
                }

            },
        }, layerBlack);
        this.addChild(layerBlack,-1);


    },
    getLines:function () {
        return this.arrNumLine;
    },
    setActiveBt : function(btnClick,enabled){
        // btnClick["line"].setOpacity(enabled?255:80);
        // btnClick["line"].setEnabled(enabled);
        btnClick["line"].setSpriteFrame(enabled?"egg_nl_bg1.png":"egg_nl_bg2.png");
        // btnClick["line"].getChildByTag(2).setOpacity(enabled?255:80);
        btnClick["isActive"] = enabled;
    },
    handleClickLine:function (num) {
        cc.log(num);
        var thiz = this;
        var numLineActive = 0;
        var btnClick = null;
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                numLineActive++;
            }
            if(this.arrLine[i]["id"] == num){
                btnClick = this.arrLine[i];
            }
        }
        if(numLineActive>1){
            this.setActiveBt(btnClick,!btnClick["isActive"]);
            if(thiz._clickOneLine){
                thiz._clickOneLine(num,btnClick["isActive"]);
            }
        }else{

            // MessageNode.getInstance().show("Bạn phải chọn ít nhất 1 line!");
            if(thiz._clickOneLine){
                thiz._clickOneLine(num,true);
            }
            this.setActiveBt(btnClick,true);
        }

    }
});

var LINE_CANDY_NUM = [1,4,6,8,12,16,14,15,2,20,13,10,9,18,11,7,3,5,17,19];
var NumberSlotCandy  = ccui.Widget.extend({// ccui.Button.extend({
    ctor:function (s) {
        //  this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this._super();
        this.setContentSize(20,20);
        var sp1 = new cc.Sprite("#egg_numa_"+ s +".png");
        sp1.setPosition(10,10);
        this.addChild(sp1);


        var sp2 = new cc.Sprite("#egg_num_"+ s +".png");
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
var CandyLayer = MiniGamePopup.extend({
    ctor: function () {

        this._super();
        var thiz = this;
        thiz.setScale(1.3);
        this.isHaveData = true;
        this._boudingRect = cc.rect(-20, 20, 398, 460);

        this.rolling = false;
        // this.timeRemainingInterval = null;
        // this.timeRemaining = 0;


        var bg = new cc.Sprite("#egg_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        cc.log(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this.bg = bg;

        var bxhButton = new ccui.Button("egg_btnBxh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhButton.setPosition(385, 246);
        bg.addChild(bxhButton, 5);
        bxhButton.addClickEventListener(function () {
            var bangvinhdanh = new AllBangVinhDanhLayer(GameType.MiniGame_Candy_Slot);
            bangvinhdanh.show();
        });

        var tutorialButton = new ccui.Button("egg_btnTutorial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.setPosition(385, 304);
        bg.addChild(tutorialButton, 5);
        tutorialButton.addClickEventListener(function () {
            var hdan = new HdanBanTrungLayer();
            hdan.show();
        });


        var historyButton = new ccui.Button("egg_btnHistory.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.addClickEventListener(function () {
            var lichsupop = new AllLichSuLayer(GameType.MiniGame_Candy_Slot);
            lichsupop.show();
        });
        historyButton.setPosition(385, 190);
        bg.addChild(historyButton, 5);

        var closeButton = new ccui.Button("egg_btnClose.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(357, 381);
        bg.addChild(closeButton, 5);
        closeButton.addClickEventListener(function () {
            thiz.closeButtonHandler();
        });

        var btnRotate = new ccui.Button("egg_btnRoate.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRotate.setPosition(312, 91);
        bg.addChild(btnRotate);
        btnRotate.addClickEventListener(function () {
            thiz.enableAutoRotate(false);
            thiz.rotateRequest();
        });
        thiz.btnRotate = btnRotate;

        var btn20Row = new ccui.Button("egg_btn20.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn20Row.setPosition(80, 91);
        bg.addChild(btn20Row, 5);
        this.btn20Row = btn20Row;
        var tesst = 0;
        btn20Row.addClickEventListener(function () {

            // for(var k = 0; k < thiz.arrLine.length; k++){
            //     thiz.arrLine[k].setVisible(false);
            // }
            // thiz.arrLine[tesst].setVisible(true);

            thiz.selectLine.setVisible(true);
            thiz.enableAutoRotate(false);

        });


        var lblRowNumber =   cc.Label.createWithBMFont("res/Texture/Egg/fnt_line3x3.fnt", "20 DÒNG");
        // lblRowNumber.setScale(0.7);
        // lblRowNumber.setColor(cc.color(204,204,204));
        lblRowNumber.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2+5);
        btn20Row.getRendererNormal().addChild(lblRowNumber);



        this.lblRowNumber = lblRowNumber;


        var btnAuto= new ccui.Button("egg_btnAuto.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(186, 91);
        bg.addChild(btnAuto, 5);
        this.btnAuto = btnAuto;
        this.isAutoRotate = false;
        btnAuto.addClickEventListener(function () {
            thiz.clickAutoQuay();
        });

        var huThuongLabel =   cc.Label.createWithBMFont("res/Texture/Egg/fnt_3x3_hu.fnt", "0");
        // huThuongLabel.setColor(cc.color("#ffea00"));
        // huThuongLabel.setAnchorPoint(cc.p(0, 0.5));
        huThuongLabel.setPosition(bg.width/2, 387);
        bg.addChild(huThuongLabel, 1);

        this.huThuongLabel = huThuongLabel;
        this.initBetting();


        // 3*3
        var slotfui = new SlotCandy(3);
        slotfui.setPosition(cc.p(49,155));
        this.bg.addChild(slotfui);
        slotfui.initRandom();
        slotfui._finishedHandler = function () {
            thiz.onFinishQuay();
        };
        this.slotfui = slotfui;


        var btnStop = new ccui.Button("egg_btnStop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnStop.setPosition(btnRotate.getPosition());
        this.bg.addChild(btnStop);
        btnStop.setVisible(false);
        this.btnStop = btnStop;

        btnStop.addClickEventListener(function () {
            thiz.handelStopButton();
        });
        this.initLine();


        var selectLine = new SelectLineCandy();
        selectLine.setPosition(-100,0);
        this.bg.addChild(selectLine,10);
        selectLine._lineClickHandler = function () {
            thiz.stopAllActions();
            thiz.clearAllLine();
            // thiz.onSetTextBet();

            for(var i = 0; i < thiz.arrNum.length; i++){
                thiz.arrNum[i].visibleNew(false);
            }
            var lines = selectLine.getLines();
            for(var i = 0; i < lines.length; i++){
                thiz.arrNum[thiz.getLine(lines[i])].visibleNew(true);

            }
            thiz.lblRowNumber.setString(lines.length.toString() + " DÒNG");
        };
        selectLine._clickOneLine = function (line,isShow) {
            thiz.arrNum[thiz.getLine(line+1)].visibleNew(isShow);
            thiz.lblRowNumber.setString(selectLine.getLines().length.toString() + " DÒNG" );
        };
        selectLine.setVisible(false);
        this.selectLine = selectLine;

        var bg_money = new cc.Sprite("#egg_bg_money.png");
        bg_money.setPosition(bg.width/2,bg.height/2);
        bg.addChild(bg_money,5);

        var lblMoneyWin  =  new cc.LabelBMFont("", "res/Texture/Egg/fontCandyMoney.fnt");
        // lblMoneyWin.setColor(cc.color(255,216,36,255));
        lblMoneyWin.setPosition(bg.width/2-10,bg.height/2);
        bg.addChild(lblMoneyWin,5);
        this.lblMoneyWin = lblMoneyWin;
        this.bg_money = bg_money;
        this.setTextWin("0");






    },
    setTextWin:function (value) {
        this.bg_money.setVisible(false);
        // this.lblMoneyWin.stopAllActions();
        if(parseInt(value) == 0){
            this.lblMoneyWin.setString("");
        }
        else{
            this.bg_money.setVisible(true);
            this.lblMoneyWin.setString(cc.Global.NumberFormat1(parseInt(value)));
            // var action = new ext.ActionNumber(0.5, parseInt(value));
            // this.lblMoneyWin.runAction(action);
        }

    },

    handelStopButton:function () {
        this.enableAutoRotate(false);
        this.slotfui.stopNow(this.dataSlot["2"]);
    },
    clickAutoQuay:function () {
        if(!SocketClient.getInstance().isLoggin() ){
            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
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
        for(var i = 0; i < LINE_CANDY_NUM.length; i++){
            if(LINE_CANDY_NUM[i] == index){
                return i;
            }
        }
        return 0;
    },
    initLine:function () {
        this.arrLine = [];
        for(var i = 0; i< 20;i++){
            var line = new cc.Sprite("#egg_line" + (i+1).toString()+ ".png");
            this.bg.addChild(line,3);
            line.setPosition(cc.p(line.getContentSize().width/2,line.getContentSize().height/2));
            cc.log(line.getContentSize());
            line.setVisible(false);
            // this.bg.addChild(line,3);
            this.arrLine.push(line);
        }
        this.arrNum = [];
        for(var i = 0; i < 20; i++){
            var buttonNumer = new NumberSlotCandy(LINE_CANDY_NUM[i].toString());
            buttonNumer.setPosition(cc.p((i%2==0)?30:344,345 - Math.floor(i/2)*20));
            this.bg.addChild(buttonNumer);
            this.arrNum.push(buttonNumer);
            buttonNumer.visibleNew(true);
        }
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
            this.isHaveData = false;
            this.setBettingSelectEnable(false);
            this._controller.sendRouteRequest(this.indexBeting+1,this.selectLine.getLines());
            if( this._soundRotate != undefined &&  this._soundRotate != null){
                SoundPlayer.stopSoundLoop(this._soundRotate );
            }
            // this._soundRotate =   SoundPlayer.playSoundLoop("quayrepeat");
        }else {
            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");

        }




    },
    rotateRequestNo:function (nameG) {


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
            this.isHaveData = false;

            var request = {
                c: "game",
                g: "slot_3x3",
                p:{3:this.indexBeting+1, 2:this.selectLine.getLines(), 4:nameG},
                a:1250
            };
            SocketClient.getInstance().send(request);



            if( this._soundRotate != undefined &&  this._soundRotate != null){
                SoundPlayer.stopSoundLoop(this._soundRotate );
            }
            // this._soundRotate =   SoundPlayer.playSoundLoop("quayrepeat");
        }else {
            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");

        }




    },
    clearLineDraw:function () {
        for(var i = 0;i<20;i++){
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
                var btnBet = new ccui.Button("egg_btnBet1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnBet.setPosition(0, 180 +  inew*65);
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
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_Candy_Slot,ARR_HUTHUONG_CANDY_MONEY[index])));
        for(var i = 0; i < this.arrButtonBet.length; i++){
           // this.arrButtonBet[i].lblM.setColor(cc.color("f6bc70"));
            this.arrButtonBet[i].loadTextureNormal("egg_btnBet"+(i+1).toString()+".png",ccui.Widget.PLIST_TEXTURE);
        }
        // this.arrButtonBet[index].lblM.setColor(cc.color("ffd824"));
        this.arrButtonBet[index].loadTextureNormal("egg_btnBet"+(index+1).toString()+"a.png",ccui.Widget.PLIST_TEXTURE);
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
        var moneyWin =   this.dataSlot["3"]["2"];
        this.setTextWin(moneyWin);
        SocketClient.getInstance().postEvent("refreshAsset", {});


        this.activeButtonNewGame(true);



        if(this.dataSlot["3"]["4"]){
            this.updateHuThuong();
            this.showJackpot();
        }
        //
        if(parseInt(moneyWin) > 200*this.selectLine.getLines().length*ARR_HUTHUONG_CANDY_MONEY[this.indexBeting] && !this.dataSlot["3"]["4"])
        {
            thiz.showBigWin(moneyWin);
        }



        // SoundPlayer.playSound("slot_win");

        this.btnStop.setVisible(false);


        this.runAction(new cc.Sequence(new cc.CallFunc(function () {
               thiz.showAllLineWin();
            }),
            new cc.DelayTime(this.isAutoRotate?1:1),
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
            this.runAction(new cc.Sequence(new cc.DelayTime(1.5),new cc.CallFunc(function () {
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
        this.setActiveBt(this.btn20Row,isActive);
        this.setActiveBt(this.btnRotate,isActive);


    },

    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },

    showAllLineWin:function(){
        var obArrLine = this.dataSlot["3"]["1"];

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
        var obArrLine = this.dataSlot["3"]["1"];
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
        // SoundPlayer.stopAllSound();
        SoundPlayer.stopSoundLoop(this._soundRotate );
        this.setBettingSelectEnable(true);
        if(params["code"] == 102) {

            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
        }

        this.slotfui.clearAll();
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
        this._controller = new CandyController(this);
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

        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(7777);
        nodeJackpot.isCanRemove = false;

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(this.bg.width, this.bg.height));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                xubay.stopSystem();
                nodeJackpot.removeFromParent();
        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        }),new cc.DelayTime(30),new cc.CallFunc(function () {
            xubay.stopSystem();
            nodeJackpot.removeFromParent();
        }) ));
        nodeJackpot.addChild(toucWidget);

        var jackpotSprite = new cc.Sprite("#egg_nohu.png");
        jackpotSprite.setPosition(this.bg.width/2, this.bg.height/2);
        jackpotSprite.runAction(new cc.RepeatForever(
                  new cc.Sequence(
                      new cc.ScaleTo(0.5,0.95),
                      new cc.ScaleTo(0.5,1)
                  )
              ));
        nodeJackpot.addChild(jackpotSprite,1);

        var effectXu = new cc.Sprite("#egg_anhsang.png");
        // effectXu.setScale(1);
        effectXu.setPosition(this.bg.width/2, this.bg.width/2);
        nodeJackpot.addChild(effectXu);
        effectXu.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));

        var xubay = new cc.ParticleSystem("res/Texture/hu_xubay.plist");
        xubay.setPosition(this.bg.width/2, this.bg.width/2+50);
        nodeJackpot.addChild(xubay, 0);

        this.bg.addChild(nodeJackpot, 1000);
        var lblHuno = cc.Label.createWithBMFont("res/Texture/Egg/fnt_3x3_hu.fnt", cc.Global.NumberFormat1(parseInt(this.moneyJackpot)));
        lblHuno.setScale(1.5);
        lblHuno.setPosition(jackpotSprite.width/2-10,65);
        // lblHuno.setColor(cc.color(255,222,0,255));
        jackpotSprite.addChild(lblHuno);

    },
    showBigWin: function (money) {

        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(8888);
        nodeJackpot.isCanRemove = false;

        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(this.bg.width, this.bg.height));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                xubay.stopSystem();
                nodeJackpot.removeFromParent();

        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        }),new cc.DelayTime(15),new cc.CallFunc(function () {
            xubay.stopSystem();
            nodeJackpot.removeFromParent();
        }) ));
        nodeJackpot.addChild(toucWidget);

        var jackpotSprite = new cc.Sprite("#egg_bg_bigwin.png");
        jackpotSprite.setPosition(this.bg.width/2, this.bg.height/2);
        jackpotSprite.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1)
            )
        ));
        nodeJackpot.addChild(jackpotSprite,1);

        var effectXu = new cc.Sprite("#egg_bigWin.png");
        // effectXu.setScale(1);
        effectXu.setPosition(this.bg.width/2, this.bg.width/2+50);
        nodeJackpot.addChild(effectXu,-1);
        effectXu.runAction( new cc.RepeatForever(new cc.RotateBy(3,360)));
        var xubay = new cc.ParticleSystem("res/Texture/hu_xubay.plist");
        xubay.setPosition(this.bg.width/2, this.bg.width/2+50);
        nodeJackpot.addChild(xubay, 0);
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
        this.huThuongLabel.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.MiniGame_Candy_Slot,ARR_HUTHUONG_CANDY_MONEY[this.indexBeting])));
    },



    enableAutoRotate:function (isEnable) {
        // this.setActiveBt(this.btnAuto,!isEnable);
        this.isAutoRotate = isEnable;
        this.btnAuto.loadTextureNormal(isEnable?"egg_btnAutoa.png":"egg_btnAuto.png",ccui.Widget.PLIST_TEXTURE);

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
        var moneyWin = param["3"]["2"];
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
            this.slotfui.stopSlotWithResuft(arrItem);
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

