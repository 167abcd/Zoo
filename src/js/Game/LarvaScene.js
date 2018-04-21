/**
 * Created by ext on 12/20/2016.
 */
//var s_ChanLeLayer = null;
// s_sfs_error_msg[1001] = "Bạn không đủ điều kiện chơi bonus";
// s_sfs_error_msg[1000] = "Chưa hết thời gian chọn bonus!";
_arrPosVinhDanh = [20, 206, 351, 495, 634, 749];
_timeElapsed_Item_Lavar = [0.14,0.2,0.2,0.14,0.24,0.14,0.14,0.2,0.24,0.24,0.24,0,0,0.14,0.2,0.24,0.24,0.24,0.24,0.14,0.24];
_numberFrame_Item_Lavar = [8,2,2,8,4,8,8,2,4,4,4,0,0,8,2,4,4,4,4,8,4];
var TAG_AUTO_ROTATE = 1111;

var ItemLarva = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        this.idItemZ = idItem;
        this.isStartAction = false;
        var withMay = 927;
        this.itemWidth = withMay/5;
        this.disHCell = 164;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#lv_item_"+ (idItem).toString()+".png";
        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        this.spriteHoaQua = spriteHoaQua;
        if(idItem == 12){
            this.biendo = 0;
        }


        // var slot_bg_win = new cc.Sprite("#aoe_bg_effect_item.png");
        // slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // slot_bg_win.setVisible(false);
        // this.addChild(slot_bg_win,-1);
        // this.slot_bg_win = slot_bg_win;
        //
        // slot_bg_win.runAction(new cc.RepeatForever(
        //     new cc.Sequence(
        //         new cc.FadeTo(0.3,100),
        //         new cc.FadeTo(0.3,255)
        //     )
        // ));


        // var bg = new cc.Sprite("#aoe_bg_item_win.png");
        // bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        // bg.setVisible(false);
        // this.bg = bg;
        // this.addChild(bg,-2);
    },
    startAction:function () {
        var idItem = this.idItemZ;
        if(this.isStartAction){
            return;
        }
        this.isStartAction = true;
        if(_numberFrame_Item_Lavar[idItem]>0 && this.spriteHoaQua.getOpacity() == 255){
            var frames = [];
            for(var k = 1; k < _numberFrame_Item_Lavar[idItem]+1; k ++){
                var tempName = "lv_item_"+ (idItem).toString()+" ("+ k.toString()+ ").png";
                frames.push(cc.spriteFrameCache.getSpriteFrame(tempName));
            }

            var animation = new cc.Animation(frames, _timeElapsed_Item_Lavar[idItem], 1);
            var animateAction = new cc.Animate(animation);
            this.spriteHoaQua.runAction( new cc.RepeatForever(  animateAction ) );
        }
    },
    setWild:function () {
        this.idItemZ = 0;
        this.spriteHoaQua.setSpriteFrame("lv_item_0.png");
    },

    setWin:function (isWin,isLigth) {
        // this.slot_bg_win.setVisible(isLigth);
        // this.bg.setVisible(isWin);
        this.spriteHoaQua.setOpacity(isLigth?255:150);
        if(isLigth){
            this.startAction();
        }
    }
});
var SlotLarva = SlotLayer.extend({
    ctor: function (soCot) {
        this._super(soCot);
        this.nodeSlot.setContentSize(cc.size(927,490));
        this.arrResuft = [];
        this.isFree = 0;
    },
    newItem:function (idItem) {
        var temp = new ItemLarva(idItem);
        temp.soCot = this.soCot;
        return temp;
    },
    showLineWin:function (line,mask) {



        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
           for(var j = 0; j < LARVAR_LINE_SLOT[line].length; j++){
               if(i == LARVAR_LINE_SLOT[line][j]){
                   isLight = ((mask >> j) & 1);
                   isWin = true;
                   // break;
               }
           }
            // this.arrResuft[i].spriteHoaQua.setOpacity(isWin?255:150);
            this.arrResuft[i].setWin(isWin,isLight);

        }

    },
    showItemWin:function (arrItemWin) {
        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            this.arrResuft[i].spriteHoaQua.setOpacity(150);
        }
        for(var i = 0; i < arrItemWin.length; i++){
            if(arrItemWin[i]>=0){
                this.arrResuft[arrItemWin[i]].setWin(true,true);
                this.arrResuft[arrItemWin[i]].spriteHoaQua.setOpacity(255);
            }else {

            }
        }
    },
    showWild:function (arrItemWild) {

        for(var i = 0; i < arrItemWild.length; i++){
                for(var j = 0 ; j < arrItemWild[i].length; j++){
                    this.arrResuft[arrItemWild[i][j]].setWild();
                }


        }
    },
    setIsFree:function (isfree) {
        this.isFree = isfree?12:0;
    },
    getFreeSpining:function () {
        if(this.isFree == 12){
            return true;
        }
        return false;
    },
    initRandom:function () {
        this.clearAll();
        this.arrItemRandom = [];
        for (var i = 0; i < 5; i++) { // cot

            var subItem = [];
            var subItemRan = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = Math.floor(Math.random()*10);
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

    },
    rotate:function () {

        this.clearAll();
        for (var i = 0; i < this.soCot; i++) { // cot

            var subItem = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = this.isFree + Math.floor(Math.random()*10);
                var item = this.newItem(randomItem);
                item.createItem(i,j,0);
                this.nodeSlot.addChild(item);

                subItem.push(item);

            }
            this.arrItems.push(subItem);
        }
    },

});

var LINE_SLOT_NUM_LAVAR = [20,18,8,5,2,12,14,24,17,6,7,22,1,16,10,11,23,19,15,13,9,4,3,25,21];

var SelectLineLavar =  cc.Node.extend({
    ctor:function () {
        this._super();

        var thiz = this;
        this.isTouchLine = true;
        this.setContentSize(1473,402);



        // this.initView();

        // var nodeLine = new ccui.Widget();
        // nodeLine.setContentSize(cc.size(700, 440));
        // nodeLine.setPosition(1060/2,823/2);
        // dialogBg.addChild(nodeLine)
        this.arrLine = [];
        this.arrNumLine = [];
        for(var i = 0; i < 25; i++){
            (function () {
                var xP =  210+ 99*(i%5) ;
                var yP =  135+ 45*Math.floor(i/5);
                var lol = (4-Math.floor(i/5))*5;
                var num = lol + i%5;
                var bg = new ccui.Button("lv_slinea_" +(num+1).toString()+".png", "", "", ccui.Widget.PLIST_TEXTURE);
                bg.setScale(0.55);
                // bg.setZoomScale(0);
                // var bg = new cc.Sprite("#slot_sl_bg.png");
                // var lbl = new cc.LabelTTF((num+1).toString(), cc.res.font.Roboto_Medium,16);
                // lbl.setColor(cc.color("#ebd592"));
                // lbl.setAnchorPoint(1,0.5);
                // bg.addChild(lbl);
                thiz.arrNumLine.push(num+1);

                thiz.addChild(bg);
                bg.setPosition(cc.p(xP,yP));
                bg.addClickEventListener(function () {
                    thiz.handleClickLine(num);
                });
                thiz.arrLine.push({"line":bg,"isActive":true,"id":num});
            })();



        }
        // var okChan = new ccui.Button("lv_sline_chan.png","","", ccui.Widget.PLIST_TEXTURE);
        // if(!thiz.isTouchLine){
        //     return;
        // }
        // this.addChild(okChan);
        // okChan.addClickEventListener(function () {
        //     if(!thiz.isTouchLine){
        //         return;
        //     }
        //     for(var i = 0; i < thiz.arrLine.length; i++){
        //         thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?false:true);
        //     }
        //     thiz.setLineSendNotHiden();
        // });
        // okChan.setPosition(227,177);
        //
        // var okLe =new ccui.Button("lv_bnt_le.png","","", ccui.Widget.PLIST_TEXTURE);
        // okLe.addClickEventListener(function () {
        //     if(!thiz.isTouchLine){
        //         return;
        //     }
        //     for(var i = 0; i < thiz.arrLine.length; i++){
        //         thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?true:false);
        //     }
        //     thiz.setLineSendNotHiden();
        // });
        // this.addChild(okLe);
        // okLe.setPosition(227,246);
        //
        //
        // var okAll =new ccui.Button("lv_btn_tatca.png","","", ccui.Widget.PLIST_TEXTURE);
        // this.addChild(okAll);
        // okAll.addClickEventListener(function () {
        //     if(!thiz.isTouchLine){
        //         return;
        //     }
        //     for(var i = 0; i < thiz.arrLine.length; i++){
        //         thiz.setActiveBt(thiz.arrLine[i],true);
        //     }
        //     thiz.setLineSendNotHiden();
        // });
        // okAll.setPosition(227,314);
        // okAll.setScale(0.86);
        // okChan.setScale(0.86);
        // okLe.setScale(0.86);
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
            this.setActiveBt(this.arrLine[i],false);

        }
        for(var i = 0; i < arrIdLine.length; i++){
            var line = this.getLineWithID(arrIdLine[i]-1);
            line["isActive"] = true;
            this.setActiveBt(line,true);
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
        this.mTouch = cc.rect(1280/2 -thiz.bgSelect.width/2 , 720/2- thiz.bgSelect.height/2 ,thiz.bgSelect.width,thiz.bgSelect.height);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,0),thiz.bgSelect.width,thiz.bgSelect.height);
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
    resetState:function () {
        for(var i = 0; i < this.arrLine.length; i++){
            this.arrLine[i]["isActive"] = true;

            this.setActiveBt(this.arrLine[i],true);
        }
    },
    getLines:function () {
        //
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        return this.arrNumLine;
    },
    setActiveBt : function(btnClick,enabled){
        // btnClick["line"].setOpacity(enabled?255:80);
        var nameBut = (enabled?"lv_slinea_":"lv_sline_") +(btnClick["id"]+1).toString()+".png";
        btnClick["line"].loadTextureNormal(nameBut,ccui.Widget.PLIST_TEXTURE);
        // btnClick["line"].setEnabled(enabled);
        // btnClick["line"].getChildByTag(1).setOpacity(enabled?255:80);
        // btnClick["line"].getChildByTag(2).setOpacity(enabled?255:80);
        btnClick["isActive"] = enabled;
    },
    handleClickLine:function (num) {

        cc.log(num);
        var thiz = this;
        if(!thiz.isTouchLine){
            return;
        }
        for(var i = 0; i < this.arrLine.length; i++){

            if(this.arrLine[i]["id"] <= num){
                this.setActiveBt(this.arrLine[i],true);
            }else {
                this.setActiveBt(this.arrLine[i],false);
            }

        }
        thiz.setLineSendNotHiden();
        return;
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

    },
    resetLine:function () {
        for(var i = 0; i < this.arrLine.length; i++){
            this.setActiveBt(this.arrLine[i],true);


        }
        // this.setLineSendNotHiden();
    }
});

var DuplicateGold =  cc.Node.extend({
   ctor:function () {
       this._super();
       this.initView();
       this.enableTouchZ = true;
       this.isTry = false;
       this.moneyWin = 0;

   },
    setMoneyTryOrinal:function (money) {
        this.moneyForTry = money;
        cc.log("moneyForTry=" + this.moneyForTry);
    },
    initView:function () {

        var thiz = this;
        this.mTouch = cc.rect(2000/2 - (905/2),900/2 - (464/2) ,905,464);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,0),2000,900);
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
                    // thiz.setVisible(false);
                    // thiz.removeFromParent(true);
                }
                return true;
            },
        }, this);
        this.addChild(layerBlack);
        var bg = new cc.Sprite("#lc_bg_mobie.png");
        bg.setPosition(2000/2, 900/2);
        this.bg = bg;
        this.addChild(bg);

        var title = new cc.Sprite("#lv_tilte_x2.png");
        title.setPosition(bg.width/2, 508);
        bg.addChild(title);


        var lblHD = new cc.Sprite("#lv_x2_hd.png");
        lblHD.setPosition(bg.width/2, 389);
        bg.addChild(lblHD);
        this.lblHD = lblHD;

        this.arrButtonBonus = [];

        for(var i = 0; i < 4; i++){
            (function () {
                var iNew = i;
                var btnX = new ccui.Button("lv_windownClose.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnX.setPosition(211 + iNew*145, 284);
                btnX.isCanTouchZZ = true;
                btnX.setZoomScale(0);
                btnX.addClickEventListener(function () {
                    thiz.handelBonusClick(iNew,btnX);
                });

                bg.addChild(btnX);


                thiz.arrButtonBonus.push(btnX);



            })();

        }



        var btnGive = new ccui.Button("lv_bntStop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnGive.setPosition(297,28);
        btnGive.addClickEventListener(function () {
            thiz.setVisible(false);


            if(thiz._handeGiveClick){
                thiz._handeGiveClick(thiz.moneyForTry+ this.moneyWin);
            }

            thiz.setMoney("0");


        });

        bg.addChild(btnGive);
        this.btnGive = btnGive;
        var btnContinute = new ccui.Button("lv_bntTT.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnContinute.setPosition(565,28);

        btnContinute.addClickEventListener(function () {
            thiz.enableTouchZ = true;
            btnGive.setVisible(false);
            btnContinute.setVisible(false);
            btnclose.setVisible(false);
            thiz.lblHD.setSpriteFrame("lv_x2_hd.png");
            for(var i = 0; i < 4; i++){
                (function () {
                    var iNew = i;
                    var btnX = thiz.arrButtonBonus[iNew];
                    btnX.isCanTouchZZ = true;
                    btnX.setOpacity(255);
                    btnX.loadTextureNormal("lv_windownClose.png",ccui.Widget.PLIST_TEXTURE);
                })();

            }
        });

        bg.addChild(btnContinute);

        this.btnContinute = btnContinute;


        var btnclose = new ccui.Button("lv_close_dup.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnclose.setPosition(812,491);
        btnclose.addClickEventListener(function () {
            thiz.setVisible(false);
            if(thiz._handeGiveClick){

                    thiz._handeGiveClick(0);

            }

            thiz.setMoney("0");

        });
        this.btnclose = btnclose;
        bg.addChild(btnclose);


        var bg_give = new cc.Sprite("#lv_bg_dathang.png");
        bg_give.setPosition(292, 142);
        bg.addChild(bg_give);


        var bg_nhandoi = new cc.Sprite("#lv_bg_nhandoi.png");
        bg_nhandoi.setPosition(571, 142);
        bg.addChild(bg_nhandoi);

        var lblMoney = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "0");

        lblMoney.setPosition(bg_give.width/2,40);
        bg_give.addChild(lblMoney);
        this.lblMoney = lblMoney;

        var lblX2= cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "0");

        lblX2.setPosition(bg_nhandoi.width/2,37);
        bg_nhandoi.addChild(lblX2);

        this.lblX2 = lblX2;

    },
    setVisibleArrButton:function (isVisble) {
        // for(var  i = 0; i < this.arrButtonBonus.length; i++)
            // this.setActiveBt(this.arrButtonBonus[i],isVisble);
             this.enableTouchZ = isVisble;
    },



    randomResuft:function (isWin,idCua) {
        var arrRandom = [];
        if(isWin){
            arrRandom = ["lv_banhmi.png","lv_bom.png","lv_bom.png"];
        }else {
            arrRandom = ["lv_banhmi.png","lv_banhmi.png","lv_bom.png"];
        }
        for(var i =0; i < 4; i++){
            if(i!=idCua){
                var number =  Math.floor(Math.random()* arrRandom.length);
                this.arrButtonBonus[i].loadTextureNormal(arrRandom[number],ccui.Widget.PLIST_TEXTURE);
                arrRandom.splice(number,1);
                this.arrButtonBonus[i].setOpacity(100);
            }else {
                this.arrButtonBonus[i].loadTextureNormal(isWin?"lv_banhmi.png":"lv_bom.png",ccui.Widget.PLIST_TEXTURE);
            }
        }
    },

    handelResuft:function (data) {
        this.randomResuft((data[1]==2),data[4]);


        if(data["2"] != "0"){
            var action = new ext.ActionNumber(0.5,parseInt(data["2"]));
            this.lblMoney.runAction(action);



            this.lblHD.setSpriteFrame("lv_txt_findXucXich.png");
            if(!data[3]){ //thang
                // hinh anh ket thuc 3
                this.lblHD.setSpriteFrame("lv_dup_ngungchoi.png");
                this.lblX2.setString("");

            }else{
                if(this.isTry){
                    this.moneyWin = 2*this.moneyWin;
                }
                this.lblX2.runAction(new ext.ActionNumber(0.5,2*parseInt(data["2"])));
                // this.lblX2.setString(cc.Global.NumberFormat1( 2*parseInt(data["2"])));
            }


        }else {
            this.lblHD.setSpriteFrame("lv_txt_bom.png");
            this.lblMoney.setString("0");
            this.lblX2.setString("0");

        }

        if(data[3]){ //thang

            this.btnGive.setVisible(true);

            this.btnContinute.setVisible(true);
        }else {  // thua

            this.btnGive.setVisible(false);
            this.btnContinute.setVisible(false);
            this.btnclose.setVisible(true);
        }
        // openhandelResuftTry
    },
    handelResuftTry:function (data) {

        this.randomResuft((data[1]==2),data[4]);

        if(data["2"] != 0){
            var action = new ext.ActionNumber(0.5,parseInt(data["2"]));
            this.lblMoney.runAction(action);



            this.lblHD.setSpriteFrame("lv_txt_findXucXich.png");
            if(!data[3]){ //thang
                // hinh anh ket thuc 3
                this.lblHD.setSpriteFrame("lv_dup_ngungchoi.png");
                this.lblX2.setString("");

            }else{

                this.lblX2.runAction(new ext.ActionNumber(0.5,2*parseInt(data["2"])));
                // this.lblX2.setString(cc.Global.NumberFormat1( 2*parseInt(data["2"])));
            }
            if(this._clickButHandlerTry ){
                this._clickButHandlerTry(this.moneyForTry+ this.moneyWin);
            }
        }else {
            this.lblHD.setSpriteFrame("lv_txt_bom.png");
            this.lblMoney.setString("0");
            this.lblX2.setString("0");
            if(this._clickButHandlerTry ){
                this._clickButHandlerTry(this.moneyForTry);
            }
        }

        if(data[3]){ //thang

            this.btnGive.setVisible(true);

            this.btnContinute.setVisible(true);
        }else {  // thua

            this.btnGive.setVisible(false);
            this.btnContinute.setVisible(false);
            this.btnclose.setVisible(true);
        }
        // open
    },

    setMoney:function (moneyWin) {
        var thiz = this;
        this.numberClick = 0;
        this.lblMoney.setString(cc.Global.NumberFormat1(parseInt(moneyWin)));
        this.lblX2.setString(cc.Global.NumberFormat1( 2*parseInt(moneyWin)));

        this.lblHD.setSpriteFrame("lv_x2_hd.png");
        this.moneyWin = parseInt(moneyWin);

        cc.log("tuyen " + this.moneyWin);

        this.btnGive.setVisible(true);
        this.btnContinute.setVisible(true);

        for(var i = 0; i < 4; i++){
            (function () {
                var iNew = i;
                var btnX = thiz.arrButtonBonus[iNew];
                btnX.setOpacity(255);
                btnX.isCanTouchZZ = true;
                btnX.loadTextureNormal("lv_windownClose.png",ccui.Widget.PLIST_TEXTURE);
            })();

        }
    },
    setCard:function (idCard) {
        var thiz = this;
        this.cardUp.setVisible(false);
        var dataCard = CardList.prototype.getCardWithId(idCard);
        var cardNew = new Card(dataCard.rank, dataCard.suit);
        cardNew.setSpriteFrame("gp_card_up2.png");
        cardNew.canTouch = false;
        cardNew.setPosition(this.cardUp.getPosition());
        cardNew.setTag(7);
        var orgScale = this.cardDefualt.getContentSize().height/cardNew.getContentSize().height + 0.1;

        cardNew.setScale(orgScale);
        this.bg.addChild(cardNew,1);
        var nameCard = dataCard.rank + s_card_suit[dataCard.suit] + ".png";
        var changeFrame = new cc.CallFunc(function () {
            cardNew.setSpriteFrame(nameCard);
        });
        var scale1 = new cc.ScaleTo(0.2,0,orgScale) ;
        var scale2 = new cc.ScaleTo(0.2,orgScale,orgScale) ;
        cardNew.runAction(new cc.Sequence(scale1,changeFrame,scale2));

        thiz.runAction(new cc.Sequence(new cc.DelayTime(1),
            new cc.CallFunc(function () {

                // if(thiz.trashCards.cardList.length>19){
                //     thiz.trashCards.removeCardFirst();
                // }
                // thiz.cardDefualt.setVisible(true);
                // thiz.trashCards.addCard(cardNew,false);

             })

        ));



    },
    handelBonusClick:function (i,btnX) {
        cc.log(i);



        if(!this.enableTouchZ || !btnX.isCanTouchZZ || this.numberClick > 3){
            return;
        }
        btnX.isCanTouchZZ = false;
        this.enableTouchZ = false;
        this.numberClick ++;
        if(this.isTry){
            var thangthua = 1+ Math.floor(cc.rand()%2);
            this.moneyWin = this.moneyWin*2;
            var isChoiTiep = true;
            if(thangthua == 1){
                isChoiTiep = false;
                this.moneyWin = 0;
            }



            if(this.numberClick>=3){
                isChoiTiep = false;
            }
            var dataTry = {3:isChoiTiep,4:i,2:this.moneyWin,1:thangthua};

            this.handelResuftTry(dataTry);

            // this.handelResuft(idCard,(this.moneyWin!=0)?1:3,this.moneyWin);
        }else {
            if(this._clickButHandler){
                this._clickButHandler(i);
            }
        }

    },
    setTry:function(isTry){
      this.isTry = isTry;
    },
    show:function () {
        this.enableTouchZ = true;
        this.setVisible(true);
        this.btnContinute.setVisible(false);
        this.btnclose.setVisible(false);
        this.numberClick = 0;

    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    }
});

var BonusLucky =  cc.Node.extend({
    ctor:function () {
        this._super();
        this.initView();
        this.enableTouchZ = true;
        this.isShow = false;
        this.timeRemaining = 10;
        this.isTry = false;
        this.arrResuft = [];
       // for(var i = 0; i < 100; i++){
       //      this.createRandom();
       //  }
    },
    setTry:function(isTry){
        this.isTry = isTry;
        if(isTry){

        }
    },
    initView:function () {

        var thiz = this;
        this.mTouch = cc.rect(2000/2 - (905/2),900/2 - (464/2) ,905,464);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),2000,900);
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
                    // thiz.setVisible(false);
                    // thiz.removeFromParent(true);
                }
                return true;
            },
        }, this);
        this.addChild(layerBlack);
        var bg = new cc.Sprite("#lc_bg_mobie.png");
        bg.setPosition(2000/2, 900/2);
        this.bg = bg;
        this.addChild(bg);



        var title = new cc.Sprite("#lv_tittl_bonus.png");
        title.setPosition(bg.width/2, 505);
        bg.addChild(title);

        var btnClose = new ccui.Button("lv_close_dup.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnClose.setPosition(812,491);
        btnClose.addClickEventListener(function () {
            thiz.setVisible(false);
            if(thiz._closeBonus){
                thiz._closeBonus();
            }

        });

        bg.addChild(btnClose);

        var group1 = new ccui.Widget();
        group1.setContentSize(cc.size(bg.width,bg.height));
        group1.setAnchorPoint(0,0);
        group1.setPosition(0,0);
        bg.addChild(group1);
        this.group1 = group1;

        var lblBenTRong = new cc.LabelTTF("    Bên trong biểu tượng có ngọc trai hoặc bom .\n Gặp ngọc trai sẽ được nhận thưởng và chơi tiếp .\n              Gặp bom thì phải dừng chơi .",cc.res.font.Roboto_Condensed,20);
        // lblBenTRong.setDimensions(600,0);
        lblBenTRong.setAnchorPoint(0.5,0.5);
        lblBenTRong.setPosition(bg.width/2,400);
        group1.addChild(lblBenTRong);

        var lblThu = new cc.LabelTTF("Bin đã thu được:",cc.res.font.Roboto_Condensed,25);
        lblThu.setAnchorPoint(1,0.5);
        lblThu.setPosition(427,348);
        group1.addChild(lblThu);

        var lblVang = new cc.LabelTTF("",cc.res.font.Roboto_Condensed,25);
        lblVang.setColor(cc.color("#e7de22"));
        lblVang.setAnchorPoint(0,0.5);
        lblVang.setPosition(437,348);
        group1.addChild(lblVang);
        this.lblVang = lblVang;

        var lblGiay = new cc.LabelTTF("Hệ thống sẽ tự động chơi sau 15s",cc.res.font.Roboto_Condensed,27);
        lblGiay.setPosition(bg.width/2,75);
        group1.addChild(lblGiay);

        this.arrButton = [];
        for(var i = 0; i < 12; i++){
            (function () {
                var iNew = i;


                var btnX = new ccui.Button("lv_bonus_item.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnX.isCanTouchZZ = true;
                if(i>=6){
                    btnX.setPosition( 148+ 113*(i-6) ,267);
                }else {
                    btnX.setPosition(148 + 113*i ,149);
                }

                btnX.addClickEventListener(function () {
                    thiz.handelBonusClick(iNew);
                });

                group1.addChild(btnX);
                thiz.arrButton.push(btnX);
            })();

        };
        group1.setVisible(false);
        var group2 = new ccui.Widget();
        group2.setContentSize(cc.size(bg.width,bg.height));
        group2.setAnchorPoint(0,0);
        group2.setPosition(0,0);
        bg.addChild(group2);
        this.group2 = group2;


        var lbl1 = new cc.LabelTTF("Lựa chọn hệ số nhân",cc.res.font.Roboto_Condensed,25);
        // lbl1.setAnchorPoint(1,0.5);
        lbl1.setPosition(bg.width/2,348);
        group2.addChild(lbl1);

        var lbl2 = new cc.LabelTTF("Chọn hệ số nhân với tổng phần thưởng của bạn",cc.res.font.Roboto_Condensed,25);
        // lbl1.setAnchorPoint(1,0.5);
        lbl2.setPosition(bg.width/2,322);
        group2.addChild(lbl2);

        var lbl1 = new cc.LabelTTF("Phần thưởng hiện tại :",cc.res.font.Roboto_CondensedBold,30);
        lbl1.setAnchorPoint(1,0.5);
        lbl1.setPosition(447,391);
        group2.addChild(lbl1);

        var lblBonus = new cc.LabelTTF("",cc.res.font.Roboto_Condensed,30);
        lblBonus.setColor(cc.color("#e7de22"));
        lblBonus.setAnchorPoint(0,0.5);
        lblBonus.setPosition(460,391);
        this.lblBonus = lblBonus;
        group2.addChild(lblBonus);

        this.arrBonus = [];
        for(var i = 0; i < 3; i++){
            (function () {
                var iNew = i;


                var btnX = new ccui.Button("lv_hopqua.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnX.setPosition( 195+ 228*i ,204);
                btnX.isCanTouchZZ = true;
                btnX.addClickEventListener(function () {
                    thiz.handelHopQuaClick(iNew,2);
                });

                group2.addChild(btnX);
                thiz.arrBonus.push(btnX);
            })();

        };



        this.numberDup = 1;


    },

    getArrButtRandom:function () {
        var arrBut = [];
        var indexRans = [];
        for(var i = 0; i < this.arrButton.length; i++){
            if(this.arrButton[i].isCanTouchZZ ){
                arrBut.push(this.arrButton[i] );
            }
        }
        for(var i = 0; i < this.arrResuft.length; i++){
            var randomIdenx = Math.floor(Math.random()*arrBut.length);
            indexRans.push(arrBut[randomIdenx]);
            arrBut.splice(0,1);
        }
        return indexRans;
    },

    onResuft:function (data ,numberDup) {
        this.moneyBonus = data["2"];
        this.arrResuft  = data["1"];
        this.numberDup = numberDup;
        this.lblBonus.setString(cc.Global.NumberFormat1(parseInt(this.moneyBonus)/numberDup));
    },

    openItem:function (id,money) {
        this.arrButton[id].setVisible(false);
        this.createItemWin(id,money,true);
    },

    handelBonusClick:function (i) {
        var thiz = this;
        if(this.arrResuft.length < 1 || !this.arrButton[i].isCanTouchZZ){
            return;
        }
        var temp = this.arrResuft[0];
        this.arrButton[i].isCanTouchZZ = false;
        if(temp["1"]>0){
            this.arrButton[i].loadTextureNormal("lv_bonus_item1.png", ccui.Widget.PLIST_TEXTURE);
            this.lblVang.setString(cc.Global.NumberFormat1(parseInt((temp["3"]))));
        }else {
            this.arrButton[i].loadTextureNormal("lv_bonus_item2.png", ccui.Widget.PLIST_TEXTURE);
            //show man hinh 2
            this.runAction(new cc.Sequence(new cc.DelayTime(0.7),new cc.CallFunc(function () {

                    thiz.showHopQua(0);


            })));

        }
        this.arrResuft.splice(0,1);

        // SoundPlayer.playSound("DoubleOrNothing");


    },
    showHopQua:function (delay) {
        var thiz = this;
        this.stopAllActions();
        this.group1.setVisible(false);
        this.group2.setVisible(true);
        this.runAction(new cc.Sequence(new cc.DelayTime(4), new cc.CallFunc(function () {
           var randomClic = Math.floor(Math.random()*3);
            thiz.handelHopQuaClick(randomClic,delay);
        })));
    },

    handelHopQuaClick:function (i,delay) {
        var thiz = this;
        if( !this.arrBonus[i].isCanTouchZZ){
            return;
        }
        this.arrBonus[i].loadTextureNormal("lb_bn_x"+  this.numberDup.toString() + ".png", ccui.Widget.PLIST_TEXTURE);
        this.arrBonus[i].y = this.arrBonus[i].y - 20;
        this.lblBonus.setString(cc.Global.NumberFormat1(parseInt(this.moneyBonus)));
        for(var k = 0; k < this.arrBonus.length; k++){
            this.arrBonus[k].isCanTouchZZ = false;
        }
        this.group2.runAction(new cc.Sequence(new cc.DelayTime(delay), new cc.CallFunc(function () {
            if(thiz._bonusFinish){
                thiz._bonusFinish();
            }



        })));

        if(this.isTry){
            if(this._onBonusVitual){
                this._onBonusVitual( this.moneyBonus);
            }

        }

    },

    show:function () {
        // this.scheduleUpdate();

        this.stopAllActions();
        var thiz =  this;
        this.numSelect = 0;
        this.group2.setVisible(false);
        this.group1.setVisible(true);
        this.timeRemaining = 10;
        this.lblVang.setString("");
        for(var i = 0; i <    this.arrButton.length;i++){
            this.arrButton[i].setVisible(true);
            this.arrButton[i].isCanTouchZZ = true;
            this.arrButton[i].loadTextureNormal("lv_bonus_item.png", ccui.Widget.PLIST_TEXTURE);

        }
        for(var k = 0; k < this.arrBonus.length; k++){
            this.arrBonus[k].isCanTouchZZ = true;
            this.arrBonus[k].loadTextureNormal("lv_hopqua.png", ccui.Widget.PLIST_TEXTURE);
        }
        thiz.group1.setVisible(true);
        thiz.group2.setVisible(false);

        this.setVisible(true);
        this.runAction(new cc.Sequence(new cc.DelayTime(13),new cc.CallFunc(function () {
            // auto Play remain
            var arrButRandom =  thiz.getArrButtRandom();
            for(var k = 0; k < thiz.arrResuft.length;k++){

                arrButRandom[k].isCanTouchZZ = false;
                if(thiz.arrResuft[k]["1"]>0){
                    arrButRandom[k].loadTextureNormal("lv_bonus_item1.png", ccui.Widget.PLIST_TEXTURE);
                    thiz.lblVang.setString(cc.Global.NumberFormat1(parseInt((thiz.arrResuft[k]["3"]))));
                }else {
                    arrButRandom[k].loadTextureNormal("lv_bonus_item2.png", ccui.Widget.PLIST_TEXTURE);
                }

            }
            thiz.arrResuft = [];
        }), new cc.DelayTime(2), new cc.CallFunc(function () {
            thiz.showHopQua(2);

        })));
    },
    update : function (dt) {

            if(this.timeRemaining >= 0){
                this.timeRemaining -= dt;
                //mod

            }

    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    }

});

var NumberSlot  = cc.Sprite.extend({// ccui.Button.extend({
    ctor:function (s) {
      //  this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this._super("#lv_bg_line1.png");

        var lblBel = new cc.LabelTTF(s, cc.res.font.Roboto_CondensedBold,16);
        // lblBel.setColor(cc.color(95,115,217));
        lblBel.setPosition(cc.p(this.getContentSize().width/2-2, this.getContentSize().height/2));
        this.addChild(lblBel);
        this.lblBel = lblBel;

    },
    visibleNew:function (isVisible) {
        //this.loadTextureNormal( (isVisible)?"slot_bg_number1.png":"slot_bg_number2.png",ccui.Widget.PLIST_TEXTURE) ;
        this.setSpriteFrame( (isVisible)?"lv_bg_line1.png":"lv_bg_line.png") ;
        this.lblBel.setPosition(cc.p(this.getContentSize().width/2-2, this.getContentSize().height/2));
        // this.lblBel.setColor((isVisible)?cc.color(255,222,0):cc.color(95,115,217));
    }
});

var CoinNode = cc.Node.extend({
    ctor : function () {
        this._scaleStart = 0.5;
        this._scaleDelta = 0.1;

        this._scaleEnd = 0.7;
        this._scaleEndDelta = 0.4;

        this._rotateStart = -15.0;
        this._rotateDelta = 30.0;

        this._forceStart = 900.0;
        this._forceDelta = 700.0;

        this._torqueStart = -8.0;
        this._torqueDelta = 16.0;

        this._timeStart = 2.0;
        this._timeDelta = 1.0;

        // this._startPosition = cc.p(2000/2, 900+100);
        // this._startPositionDelta = cc.p(2000-300, 80);

        this._startPosition = cc.p(2000/2, 900/2);
        this._startPositionDelta = cc.p(100, 10);

        this._super();
        this._initPhysics();
        this.addAllCoin();
    },
    _initPhysics:function() {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -2000);
        this.space.sleepTimeThreshold = 0.5;

        var floorShape = new cp.SegmentShape(this.space.staticBody, cp.v(0, 0), cp.v(2000*2, 0), 0);
        floorShape.setElasticity(1.2);
        floorShape.setFriction(1);
        floorShape.setLayers(~0);
        this.space.addStaticShape(floorShape);

        // debug
        // this._debugNode = new cc.PhysicsDebugNode(this.space);
        // this.addChild( this._debugNode, 1);

    },
    _addCoin : function () {

        var startScale = this._scaleStart + (Math.random() * this._scaleDelta);
        var endScale = this._scaleEnd + (Math.random() * this._scaleEndDelta);

        var force = this._forceStart + (Math.random() * this._forceDelta);
        var rotate = this._rotateStart + (Math.random() * this._rotateDelta);
        var torque = this._torqueStart + (Math.random() * this._torqueDelta);

        var dongshit =100- Math.random()*200;

        var forceVector = cc.pRotateByAngle(cc.p(dongshit, force), cc.p(0,0), cc.degreesToRadians(rotate));

        var time = this._timeStart + (Math.random() * this._timeDelta);
        var x = this._startPosition.x + (-this._startPositionDelta.x + Math.random() * this._startPositionDelta.x * 2);
        var y = this._startPosition.y + (-this._startPositionDelta.y + Math.random() * this._startPositionDelta.y * 2);

        var coin = new CoinSprite(this.space);
        coin.setPosition(x, y);
        coin.setScale(startScale);
        coin._force = cp.v(forceVector.x, forceVector.y);
        coin._torque = torque;

        coin.setScale(0.4+Math.random()*0.6);

        this.addChild(coin);
        coin.startWithDuration(time, endScale);


    },
    addAllCoin : function () {
        this.removeAllChildren();
        var n = 150 + Math.floor(Math.random()* 20);
        // var ran = Math.random()*1.5;
        var thiz = this;
        for(var i=0; i<n ;i++){
            // this.runAction(new cc.Sequence(new cc.DelayTime(ran),new cc.CallFunc(function () {
                thiz._addCoin();
            // })))

        }

        var thiz = this;
        var maxTime = this._timeStart + this._timeDelta + 5.0;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(maxTime),
            new cc.CallFunc(function () {
                thiz.removeFromParent(true);
            })
        ));
    },
    update : function (dt) {
        this.space.step(dt);
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit : function () {
        this._super();
        this.unscheduleUpdate();
    },
    show : function () {
        var runningScene = SceneNavigator.getRunningScene();
        runningScene.addChild(this, 1000);
    }
});

var LARVAR_LINE_SLOT = [[1,4,7,10,13], [2,5,8,11,14],[0,3,6,9,12],[0,4,8,10,12],[2,4,6,10,14],
    [1,5,8,11,13],[1,3,6,9,13],[2,5,7,9,12],[0,3,7,11,14],[1,3,7,11,13],
    [1,5,7,9,13],[2,4,7,10,14],[0,4,7,10,12],[2,4,8,10,14],[0,4,6,10,12],
    [1,4,8,10,13],[1,4,6,10,13],[2,5,6,11,14],[0,3,8,9,12],[2,3,6,9,14],
    [0,5,8,11,12],[1,5,6,11,13],[1,3,8,9,13],[2,3,8,9,14],[0,5,6,11,12]];

var ARR_BET_SLOT = [100,1000,10000];

var BtnQuayEx = ccui.Widget.extend({
    ctor:function (size) {
        this._super();
        this.setContentSize(size);
        var thiz = this;
        this.timePress = 1;
        this.isTouchEx = false;
        this.isActiveEx = true;
        // wgQuay.setAnchorPoint(cc.p(0.0, 0.0));
        this.setTouchEnabled(true);
        this.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
               cc.log("TOUCH_BEGAN");
                thiz.timePress = 1;
                this.isTouchEx = true;
                thiz.setMode(false);

            }else if(event == ccui.Widget.TOUCH_ENDED){
                cc.log("TOUCH_ENDED");

                if(this.timePress >= 0 )
                {
                    if(this._onClickRoate){
                        this._onClickRoate();
                    }
                }
                this.isTouchEx = false;

                //
            }
        });
        var btnQuay = new cc.Sprite("#lv_btn_rotate.png");
        btnQuay.setPosition(this.width/2, this.height/2);
        this.addChild(btnQuay);
        this.btnQuay = btnQuay;

        var spGiveAuto = new cc.Sprite("#lv_sp_auto.png");
        spGiveAuto.setPosition(btnQuay.width/2,40);
        btnQuay.addChild(spGiveAuto);

        var spAuto = new cc.Sprite("#lv_sp_auto2.png");
        spAuto.setPosition(btnQuay.width/2,40);
        btnQuay.addChild(spAuto);

        this.spGiveAuto = spGiveAuto;
        spAuto.setVisible(false);
        this.spAuto = spAuto;

        this.scheduleUpdate();
    },

    setMode:function (isAuto) {
        this.spGiveAuto.setVisible(!isAuto);
        this.spAuto.setVisible(isAuto);
    },

    setActiveBt : function(enabled){
        this.setTouchEnabled(enabled);
        this.btnQuay.setSpriteFrame(enabled?"lv_btn_rotate.png":"lv_btn_rotate_b.png");
        this.spGiveAuto.setSpriteFrame(enabled?"lv_sp_auto.png":"lv_sp_auto_b.png");
        this.spAuto.setSpriteFrame(enabled?"lv_sp_auto2.png":"lv_sp_auto2_b.png");
    },

   update:function (dt) {
       if(!this.isTouchEx){
           return;
       }
       if(this.timePress >= 0){
           this.timePress -= dt;

           if(this.timePress < 0){
               cc.log("auto quay");
               this.setMode(true);
               if(this._onLongPressRoate){
                   this._onLongPressRoate();
               }

               this.isTouchEx = false;
           }

       }
   }
});

var LarvaPopupFree = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);

        var lv_x2phanthuong = new cc.Sprite("#lv_ef_bigwin_light.png");
        lv_x2phanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(lv_x2phanthuong);
        lv_x2phanthuong.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));

        var goldMini = new  cc.ParticleSystem("res/Texture/Larva/lv_thanglon1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini);

        var goldMini2 = new  cc.ParticleSystem("res/Texture/Larva/lv_thanglon2.plist");
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
        lv_x2phanthuong.setPosition(cc.p(spritePhanthuong.width/2  ,-40));
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
        if(this._popupLarvaClose && !isVisible && this.isVisible()){
            this._popupLarvaClose();
        }
        this._super(isVisible);
        // if(this._popupLarvaClose && !isVisible){
        //     this._popupLarvaClose();
        // }

    },
    setContent:function (isx2) {
        this.lv_x2phanthuong.setVisible(isx2>1);
    }

});

var LarvaPopupFreeEnd = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);

        var lv_x2phanthuong = new cc.Sprite("#lv_ef_bigwin_light.png");
        lv_x2phanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(lv_x2phanthuong);
        lv_x2phanthuong.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));

        var goldMini = new  cc.ParticleSystem("res/Texture/Larva/lv_thanglon1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini);

        var goldMini2 = new  cc.ParticleSystem("res/Texture/Larva/lv_thanglon2.plist");
        goldMini2.setScale(2.5);
        goldMini2.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini2);


        var spritePhanthuong = new cc.Sprite("#lv_ef_end_free.png");
        spritePhanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(spritePhanthuong);


        spritePhanthuong.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));



        var lv_x2phanthuong = new cc.Sprite("#lv_ef_x2.png");
        lv_x2phanthuong.setPosition(cc.p(535  ,94));
        spritePhanthuong.addChild(lv_x2phanthuong);
        this.lv_x2phanthuong = lv_x2phanthuong;

        var lblMoney = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "1000000");
        lblMoney.setScale(1.5);
        lblMoney.setPosition(spritePhanthuong.width/2,42);
        spritePhanthuong.addChild(lblMoney);
        this.lblMoney = lblMoney;


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
        if(this._popupLarvaClose && !isVisible && this.isVisible()){
            this._popupLarvaClose();
        }
        this._super(isVisible);


    },
    setMoneyFree:function (money) {
        var action = new ext.ActionNumber(0.5,parseInt(money));
        this.lblMoney.runAction(action);

    },
    setDupX2:function (isx2) {
        this.lv_x2phanthuong.setVisible(isx2);
    }

});

var LarvaPopupJackPot= cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);



        var lv_x2phanthuong = new cc.Sprite("#lv_ef_bigwin_light.png");
        lv_x2phanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(lv_x2phanthuong);
        lv_x2phanthuong.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));



        var goldMini = new  cc.ParticleSystem("res/Texture/Larva/lv_nohu1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini);

        var goldMini2 = new  cc.ParticleSystem("res/Texture/Larva/lv_nohu2.plist");
        goldMini2.setScale(2.5);
        goldMini2.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini2);

        var spritePhanthuong = new cc.Sprite("#lv_ef_nohu_bg.png");
        spritePhanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(spritePhanthuong);





        var lblMoney = cc.Label.createWithBMFont("res/Texture/Larva/fnt_lv_nohu.fnt", "1000000");
        // lblMoney.setScale(1);
        lblMoney.setPosition(spritePhanthuong.width/2,0);
        spritePhanthuong.addChild(lblMoney);
        this.lblMoney = lblMoney;


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
        if(this._popupLarvaClose && !isVisible && this.isVisible()){
            this._popupLarvaClose();
        }
        this._super(isVisible);


    },
    setMoneyJackPot:function (money) {
        var action = new ext.ActionNumber(0.5,parseInt(money));
        this.lblMoney.runAction(action);
    },


});

var LarvaPopupBigWin = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);


        var lv_x2phanthuong = new cc.Sprite("#lv_ef_bigwin_light.png");
        lv_x2phanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(lv_x2phanthuong);
        lv_x2phanthuong.runAction( new cc.RepeatForever(new cc.RotateBy(2,360)));



        var goldMini = new  cc.ParticleSystem("res/Texture/Larva/lv_thanglon1.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini);

        var goldMini2 = new  cc.ParticleSystem("res/Texture/Larva/lv_thanglon2.plist");
        goldMini2.setScale(2.5);
        goldMini2.setPosition(cc.p(2000/2, 900/2));
        this.addChild(goldMini2);

        var spritePhanthuong = new cc.Sprite("#lv_ef_bigwin_bg.png");
        spritePhanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(spritePhanthuong);
        spritePhanthuong.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));




        var lblMoney = cc.Label.createWithBMFont("res/Texture/Larva/fnt_lv_nohu.fnt", "1000000");
        // lblMoney.setScale(1);
        lblMoney.setPosition(spritePhanthuong.width/2,20);
        spritePhanthuong.addChild(lblMoney);
        this.lblMoney = lblMoney;


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

    setMoneyBigWin:function (money) {
        var action = new ext.ActionNumber(0.5,parseInt(money));
        this.lblMoney.runAction(action);

    },

    setVisible:function (isVisible) {
        if(this._popupLarvaClose && !isVisible && this.isVisible()){
            this._popupLarvaClose();
        }
        this._super(isVisible);


    },
});

var LarvaPopupBonus = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        var blackBg = new cc.LayerColor(cc.color(0,0,0,100), 2000, 900);
        this.addChild(blackBg);




        var spritePhanthuong = new cc.Sprite("#lv_ef_bonus.png");
        // var larva_ligth_run =  new cc.Sprite("#larva_ligth_run.png");
        // larva_ligth_run.setPosition(200,spritePhanthuong.height/2);
        // spritePhanthuong.addChild(larva_ligth_run);
        // larva_ligth_run.runAction(new cc.RepeatForever(
        //     new cc.Sequence(
        //         new cc.MoveTo(1,cc.p(spritePhanthuong.width-350,394)),
        //         new cc.MoveTo(1,cc.p(350,394))
        //     )
        // ));

        spritePhanthuong.setPosition(cc.p(2000/2  , 900/2));
        this.addChild(spritePhanthuong);
        spritePhanthuong.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));
        var lv_x2phanthuong = new cc.Sprite("#lv_ef_text.png");
        lv_x2phanthuong.setPosition(cc.p(spritePhanthuong.width/2  ,spritePhanthuong.height/2-150));
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


        var lblMoney = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "1000000");
        lblMoney.setScale(1.5);
        lblMoney.setPosition(spritePhanthuong.width/2,spritePhanthuong.height/2-200);
        spritePhanthuong.addChild(lblMoney);
        this.lblMoney = lblMoney;

        this.addChild(dontTouchLayer);

    },
    setVisible:function (isVisible) {
        this._super(isVisible);
        if(this._popupLarvaClose && !isVisible){
            this._popupLarvaClose();
        }

    },
    setFist:function (isFirst) {
        this.lv_x2phanthuong.setVisible(!isFirst);
        this.lblMoney.setVisible(!isFirst);
    },
    setMoneyBonus:function (money) {

        var action = new ext.ActionNumber(0.5,parseInt(money));
        this.lblMoney.runAction(action);

    }
});

var LarvaScene = IScene.extend({
    ctor: function (indexBet,modePlay) {
        // for(var  i = 0; i < 100; i ++){
        //     var randomIndex = Math.floor(Math.random()*3);
        //     cc.log("lon" + randomIndex);
        // }
        this._super();
        var bg = new cc.Sprite("res/Texture/Larva/bg_choiMan.jpg");
        bg.setAnchorPoint(cc.p(0,1));
        this.addChild(bg,-1);
        this.bg = bg;

        this.sceneLayer.setContentSize(cc.size(2000, 900));

        SceneNavigator.addBackKeyEvent(this);
        this.indexBet = 0;

//        this.drawNode = cc.DrawNode.create();
  //      this.addChild(this.drawNode,100);
    //    this.drawNode.clear();
//        this.drawNode.drawSegment(cc.p(100,100),cc.p(300,300), 2,cc.color(255,255,255,128));
        // this.drawNode.drawRect(cc.p(100,100), cc.p(300,300),
        //     cc.color(255,255,255,128), 1 , cc.color(255,255,255,128) );
        // return;

        this.isHaveData = true;
        var thiz = this;
        this.isTry = false;
        this.isAutoRotate = false;
        this.arrWildAnchor = [];
        this.arrSpriteWild = [];
        this.isModeAuto = false;
        this.arrSmockAuTrung = [];

        var jacpotEvent = new JackpotMultiplyEvent.GameIcon(GameType.GAME_Larva,1);
        jacpotEvent.setPosition(800,cc.winSize.height);
        thiz.jacpotEvent = jacpotEvent;
        this.addChild(jacpotEvent,100);

        this.initBetting();
        this.initController();
        this.initView();
        this.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet]));
        this.setTextWin("0");

        this.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
      //  LoadingDialog.getInstance().show("Loading...");
        })));

        this.enableAutoRotate(false);
        this.isFreeSpin = 0;

        this.initPopupLarva();
        thiz.setModePlay(false);
        this.updateHuThuong();




        // for(var i = 0; i < 15; i++){
        //     if(i!=8){
        //       // continue;
        //     }
        //    var itemWidth = 809/5;
        //     var disHCell = 162;
        //
        //     var  itemwilffree = new cc.Sprite("#itemwilffree.png");
        //     itemwilffree.setPosition(itemWidth/2 + Math.floor(i%5) *itemWidth,disHCell/2 + Math.floor((i/5))*disHCell );
        //     thiz.slotfui.addChild(itemwilffree);
        //
        //
        //     var effectXu = new cc.Sprite("#itemwilffree1.png");
        //
        //     effectXu.setPosition(itemwilffree.width/2,itemwilffree.height/2);
        //     itemwilffree.addChild(effectXu);
        //
        //
        //
        //
        //     var frames = [];
        //     for(var k = 1; k < 5; k ++){
        //         frames.push(cc.spriteFrameCache.getSpriteFrame("itemwilffree"+k.toString() +".png"));
        //     }
        //     var animation = new cc.Animation(frames, 0.1, 1);
        //     var animateAction = new cc.Animate(animation);
        //     effectXu.runAction( new cc.RepeatForever(  animateAction ) );
        // }
    },

    onCanvasResize : function () {
        this._super();
        var scaleY = cc.winSize.height / this.bg.height;
        if(scaleY < 1.0){
            scaleY = 1.0;
        }
        this.bg.setScale(scaleY);
        this.bg.y = cc.winSize.height;
    },

    initBetting:function () {
        this.arrButBet = [];
        var thiz = this;
        for(var i = 0; i < 3; i++){
        (function () {

                var iNew = i;
                var btnTemp = new ccui.Button("lv_muc"+ i +".png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnTemp.setPosition(cc.p(490,508+ i*92));
                btnTemp.addClickEventListener(function () {
                    thiz.setlectButtonBet(iNew);
                })
                thiz.sceneLayer.addChild(btnTemp);
                thiz.arrButBet.push(btnTemp);

        })();
        }
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
    createWildAnchor:function () {
     this.arrSpriteWild = [];
        for(var i = 0; i < this.arrWildAnchor.length; i++){

            var itemWidth = 927/5;
            var disHCell = 164;

            var  itemwilffree = new cc.Sprite("#itemwilffree.png");
            itemwilffree.setPosition(itemWidth/2 + this.arrWildAnchor[i]["cloum"] *itemWidth,disHCell/2 + this.arrWildAnchor[i]["row"]*disHCell );
            this.slotfui.addChild(itemwilffree);


            // var effectXu = new cc.Sprite("#itemwilffree1.png");
            //
            // effectXu.setPosition(itemwilffree.width/2,itemwilffree.height/2);
            // itemwilffree.addChild(effectXu);
            //
            //
            // var frames = [];
            // for(var k = 1; k < 5; k ++){
            //     frames.push(cc.spriteFrameCache.getSpriteFrame("itemwilffree"+k.toString() +".png"));
            // }
            // var animation = new cc.Animation(frames, 0.1, 1);
            // var animateAction = new cc.Animate(animation);
            // effectXu.runAction( new cc.RepeatForever(  animateAction ) );
            this.arrSpriteWild.push(itemwilffree);
        }
    },
    initPopupLarva:function () {
        var thiz = this;
        var bonusLucky = new BonusLucky();
        bonusLucky._onBonusVitual = function (money) {
            thiz.setGoldVituarl(parseInt(money));

            // thiz.changeGoldEffect(money);
        },
            bonusLucky._bonusFinish = function () {
            if(thiz.isTry){
                thiz.updateInforTry();
            }else {
                thiz.updateInfor();
            }


                if(thiz.isModeAuto){
                   thiz.setModeRotateAuto();

                }
            },
            this.sceneLayer.addChild(bonusLucky,3);
        this.bonusLucky = bonusLucky;
        this.bonusLucky.setVisible(true);
        this.bonusLucky._closeBonus = function () {
            thiz.stopAllActions();
            if(thiz.isTry){
                thiz.setGoldVituarl(parseInt(thiz.bonusLucky.moneyBonus));

                thiz.updateInforTry();
            }

            thiz.pausePlaySoundBonus(true);
            thiz.poupBonusFirst.setVisible(true);
            thiz.poupBonusFirst.setFist(false);
            thiz.poupBonusFirst.setMoneyBonus(thiz.bonusLucky.moneyBonus);
            thiz.bonusLucky.moneyBonus = 0;
            setTimeout(function () {
                if(thiz.isModeAuto){

                    thiz.setModeRotateAuto();

                }
            }, 1000);


        },
        this.goldOld = 0;

        var poupBonusFirst =  new LarvaPopupBonus();
        this.sceneLayer.addChild(poupBonusFirst,3);
        thiz.poupBonusFirst = poupBonusFirst;


        var poupFreeEnd =  new LarvaPopupFreeEnd();
        this.sceneLayer.addChild(poupFreeEnd,3);
        this.poupFreeEnd = poupFreeEnd;
        poupFreeEnd._popupLarvaClose = function () {
            thiz.pausePlayFreeBonus(true);
        };

        var poupBigWin =  new LarvaPopupBigWin();
        this.sceneLayer.addChild(poupBigWin,2);
        this.poupBigWin = poupBigWin;

        var poupJackpot =  new LarvaPopupJackPot();
        this.sceneLayer.addChild(poupJackpot,3);
        this.poupJackpot = poupJackpot;
        poupJackpot._popupLarvaClose = function () {
            cc.log("vao day kjo");
            thiz.pausePlayJackpot(true);
        };


        this.poupBonusFirst.setVisible(false);
        this.poupFreeEnd.setVisible(false);
        this.bonusLucky.setVisible(false);
        this.poupBigWin.setVisible(false);
        this.poupJackpot.setVisible(false);
        // thiz.hiddenAllPopup();
    },
    hiddenAllPopup:function () {


        this.sceneLayer.removeChildByTag(5555);
        this.poupBonusFirst.setVisible(false);
        this.poupFreeEnd.setVisible(false);
        this.bonusLucky.setVisible(false);
        this.poupBigWin.setVisible(false);
        this.poupJackpot.setVisible(false);


    },
    updateHuThuong:function () {
        if(!this.isTry)
            this.setTextHuThuong(JackpotEvent.getJackPot(GameType.GAME_Larva,ARR_BET_SLOT[this.indexBet]));
            // this.lblHu.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_AOE,ARR_BET_SLOT[this.indexBet])));
        // for(var i = 0; i < this.arrHuThuongBT.length; i++){
        //     // this.arrHuThuongBT[i].setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_Larva ,ARR_BET_SLOT[i])));
        //     var action2 = new ext.ActionNumber(2,JackpotEvent.getJackPot(GameType.GAME_Larva ,ARR_BET_SLOT[i]));
        //     this.arrHuThuongBT[i].runAction(action2);
        // }
    },
    setTextHuThuong:function (value) {

        this.lblHu.stopAllActions();

        var zz =  parseInt(value);

        if(!this.isTry){
            var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));
            if(yy != zz)
            {
                var delta = Math.abs(value - yy);
                var time = delta / 7;
                if(time > 2){
                    time = 2;
                }
                var action = new ext.ActionNumber(time,zz);
                this.lblHu.runAction(action);
            }
        }else {
            var action = new ext.ActionNumber(0.25,zz);
            this.lblHu.runAction(action);
        }


    },
    initView:function () {
        this.isNoHu = false;
        var thiz = this;
        setTimeout(function () {
            SoundPlayer.playSound("lv_nhacnen_man chinh",true);
        }, 0.1);


        var nodeBottom = new cc.Node();
        nodeBottom.setScale(0.85);
        nodeBottom.setPosition(1000,273);

        nodeBottom.setContentSize(cc.size(1280,720));
        nodeBottom.setAnchorPoint(0.5,0);
        this.sceneLayer.addChild(nodeBottom);


        var bgkhung =  new cc.Sprite("res/Texture/Larva/larvar_bg_khung.png");
        bgkhung.setPosition(cc.p(640,360));
        thiz.bg_khung = bgkhung;
        nodeBottom.addChild(bgkhung);
        this.bgSlot = nodeBottom;

        var khung_bottom =  new cc.Sprite.create("res/Texture/Larva/lv_khung_bot.png");
        khung_bottom.setPosition(1030,80);
        this.sceneLayer.addChild(khung_bottom);

        var lv_bangthuong =  new cc.Sprite("res/Texture/Larva/lv_bangthuong.png");
        lv_bangthuong.setPosition(cc.p(237  ,543));
        this.sceneLayer.addChild(lv_bangthuong);

        // this.arrHuThuongBT = [];
        // for(var i = 0; i< 3; i++){
        //     var txtTemp = new cc.LabelTTF(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_Larva ,ARR_BET_SLOT[i])), cc.res.font.Roboto_Condensed,20);
        //     txtTemp.setPosition(370,381 + i*31);
        //     txtTemp.setColor(cc.color(255,234,4,255));
        //     lv_bangthuong.addChild(txtTemp);
        //     this.arrHuThuongBT.push(txtTemp);
        // }

        this.initVinhDanhLichSu(khung_bottom);



        var nodeTop = new cc.Node();
        nodeTop.setPosition(1000, 900);

        nodeTop.setContentSize(cc.size(2000,900));
        nodeTop.setAnchorPoint(0.5,1);






        this.nodeTop = nodeTop;
        this.initTopBar();

        this.sceneLayer.addChild(nodeTop);

        var menuTop = new TopBarTouchLayer(true);
        menuTop.backButtonHandler = function () {
            SceneNavigator.replaceScene(new HomeScene());
        };
        menuTop.setPositionY(40);
        thiz.menuTop = menuTop;
        this.sceneLayer.addChild(menuTop,1);
        menuTop.setVisible(true);
        menuTop.showGameTopBar(false);

        var slotfui = new SlotLarva(5);
        slotfui.setPosition(cc.p(180,128));
        this.bg_khung.addChild(slotfui);
        var thiz = this;
        slotfui._finishedHandler = function () {
            thiz.onFinishQuay();
        };
        slotfui._playsoundStopItem = function () {
            SoundPlayer.playSound("lv_stop");
        };
        this.slotfui = slotfui;




        var sp_buttom = new cc.Sprite("#bg_buttom_tc.png");
        sp_buttom.setScale(1.16);
        sp_buttom.setPosition(cc.p(640,53));
        this.bgSlot.addChild(sp_buttom);

        this.isSieuToc = false;
        var pirate_sieutoc = new ccui.Button("lv_sieutoc2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        pirate_sieutoc.addClickEventListener(function () {
            thiz.isSieuToc = !thiz.isSieuToc;
            pirate_sieutoc.loadTextureNormal(thiz.isSieuToc?"lv_sieutoc1.png":"lv_sieutoc2.png",ccui.Widget.PLIST_TEXTURE);
        });
        pirate_sieutoc.setPosition(527, 83);
        sp_buttom.addChild(pirate_sieutoc);


        // var btnQuay =  new BtnQuayEx(cc.size(186,120));
        // btnQuay.setPosition(cc.p(1181,64));
        // btnQuay._onLongPressRoate =  function () {
        //    cc.log("auto quay");
        //     thiz.clickAutoQuay();
        //     thiz.spAuto.setVisible(true);
        //
        // };
        // btnQuay._onClickRoate =  function () {
        //
        //     thiz.setModeRotateNomarl();
        //     thiz.spAuto.setVisible(false);
        //
        // };
        //
        // this.bgSlot.addChild(btnQuay);
        // this.btnQuay = btnQuay;

        var btnQuay = new ccui.Button("lv_btn_rotate.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnQuay.setPosition(cc.p(1280,64));
        this.bgSlot.addChild(btnQuay,1);
        this.btnQuay = btnQuay;
        btnQuay.addClickEventListener(function () {

            thiz.enableAutoRotate(false);
            thiz.rotateRequest();
        });


        var bg_choithu = new ccui.Button("lv_btnChoiThat.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bg_choithu.setPosition(cc.p(670, 867));
        this.sceneLayer.addChild(bg_choithu);
        bg_choithu.addClickEventListener(function () {
            thiz.isTry = !thiz.isTry;
           thiz.setModePlay(thiz.isTry);
            if(!thiz.isTry){
                bg_choithu.loadTextureNormal("lv_btnChoiThat.png",ccui.Widget.PLIST_TEXTURE);
            }else {
                bg_choithu.loadTextureNormal("lv_btnChoiThu.png",ccui.Widget.PLIST_TEXTURE);
            }
        });
        this.bg_choithu = bg_choithu;


        var btnGive = new ccui.Button("aoe_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnGive.setPosition(cc.p(925,80));
        this.bgSlot.addChild(btnGive);
        btnGive.setVisible(false);
        this.btnGive = btnGive;

        btnGive.addClickEventListener(function () {
            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }
            thiz.enableAutoRotate(false);
            thiz.btnX2.setVisible(false);
            btnGive.setVisible(false);
            if(thiz.isTry){
                thiz.setGoldVituarl(parseInt(thiz.dataSlot["3"]["4"]));
                thiz.changeGoldEffect(thiz.dataSlot["3"]["4"]);
                thiz.onNhanThuong();
            }else{
                thiz._controller.sendGiveGold(thiz.indexBet);
            }

        });

        var btnStop = new ccui.Button("lv_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnStop.setPosition(btnQuay.getPosition());
        this.bgSlot.addChild(btnStop,1);
        btnStop.setVisible(false);
        this.btnStop = btnStop;

        btnStop.addClickEventListener(function () {
            thiz.handelStopButton();
        });

        var spTuquay = new cc.Sprite("#lv_sp2_auto.png");
        spTuquay.setPosition(btnStop.width/2,40);
        btnStop.addChild(spTuquay);
        spTuquay.setVisible(false);
        this.spAuto = spTuquay;


        var btnAuto = new ccui.Button("lv_tuquay.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(cc.p(527,39));
        sp_buttom.addChild(btnAuto);

        this.btnAuto = btnAuto;
        this.isAutoRotate = false;
        btnAuto.addClickEventListener(function () {
            thiz.clickAutoQuay();
        });
        // var aaa = new BangThuong();
        // thiz.bgSlot.addChild(aaa,2);
        // aaa.setPosition(213,133);
        // aaa.setVisible(false);
        // thiz.bangThuong = aaa;

        // var bvd = new VinhDanh();
        // thiz.bgSlot.addChild(bvd,2);
        // bvd.setPosition(213,133);
        // bvd.setVisible(false);
        // thiz.vinhdanh = bvd;

        // var top_thuong = new ccui.Button("aoe_btn_topReward.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // top_thuong.setScale(cc.winSize.screenScale);
        // top_thuong.setPosition(cc.p(69*cc.winSize.screenScale,900/2 + 40 ));
        // this.sceneLayer.addChild(top_thuong);
        // top_thuong.addClickEventListener(function () {
        //
        // });


        var btn20Row = new ccui.Button("lv_btn_dong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn20Row.setPosition(cc.p(334,52));
        btn20Row.isCanTouchZZ = true;
        btn20Row.setVisible(false);
        this.bgSlot.addChild(btn20Row);



        var lblRowNumber = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung.fnt", "25");// cc.Label.createWithBMFont("res/Texture/Larva/UTMCooperBlack.fnt", "1000000");
        // lblRowNumber.setColor(cc.color(204,204,204));
        lblRowNumber.setPosition(336,79);
        sp_buttom.addChild(lblRowNumber);
        lblRowNumber.setScale(0.86);

        var btnNapVang = new ccui.Button("lv_napVang.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnNapVang.setPosition(cc.p(850,38));
        sp_buttom.addChild(btnNapVang,1);
        btnNapVang.addClickEventListener(function () {
            SceneNavigator.showPaymentDialog();
        });

        this.btn20Row = btn20Row;

        this.lblRowNumber = lblRowNumber;

        // var lblDong = new cc.LabelTTF("DÒNG", cc.res.font.Roboto_CondensedBold, 24);
        // lblDong.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2-15);
        // btn20Row.addChild(lblDong);
        btn20Row.setZoomScale(0);
        btn20Row.addClickEventListener(function () {

          return;
            if(thiz.isTry){
                MessageNode.getInstance().show("Không thể chọn dòng khi đang chơi thử");
                return;
            }
            if(!btn20Row.isCanTouchZZ)
                return;
            thiz.selectLine.setVisible(true);
            thiz.enableAutoRotate(false);

        });

        var lblBet = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung.fnt", "1000000");// new cc.LabelTTF("10.002", cc.res.font.Roboto_CondensedBold,24);
        // lblBet.setColor(cc.color(204,204,204));
        // lblBet.setAnchorPoint(cc.p(0,0.5));
        lblBet.setPosition(142,79);
        lblBet.setScale(0.86);
        sp_buttom.addChild(lblBet);
        this.lblBet = lblBet;

        var lblWin = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "1000000");// new cc.LabelTTF("0", cc.res.font.Roboto_CondensedBold,24);
        // lblWin.setColor(cc.color(204,204,204));
        // lblWin.setAnchorPoint(cc.p(1,0.5));
        lblWin.setPosition(680,79);
        lblWin.setScale(0.86);
        lblWin.setAnchorPoint(0,0.5);
        sp_buttom.addChild(lblWin);
        this.lblWin = lblWin;

        var lblSodu = cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "0");// new cc.LabelTTF("0", cc.res.font.Roboto_Medium,20);
        // lblSodu.setColor(cc.color(204,204,204));
        // lblSodu.setAnchorPoint(cc.p(1,0.5));
        lblSodu.setPosition(680,42);
        lblSodu.setScale(0.86);
        lblSodu.setAnchorPoint(0,0.5);
        sp_buttom.addChild(lblSodu);
        this.lblSodu = lblSodu;

        this.initLabel();

        var btnX2 = new ccui.Button("lv_btnx2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnX2.setPosition(cc.p(1195,319));
        this.bgSlot.addChild(btnX2);
        btnX2.setVisible(false);
        this.btnX2 = btnX2;

        var slot_btnx2_bg = new cc.Sprite("#lv_btnx2.png");
        slot_btnx2_bg.setPosition(cc.p(btnX2.getContentSize().width/2,btnX2.getContentSize().height/2));
        btnX2.addChild(slot_btnx2_bg);
        slot_btnx2_bg.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.5,30),
                new cc.FadeTo(0.5,255)
            )
        ));

        btnX2.addClickEventListener(function () {

            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }
            thiz.isModeAuto = thiz.isAutoRotate;
            thiz.dup.show(true);
            thiz.enableAutoRotate(false);
        });


        this.initTopBar();

        this.initLine();
        var dup = new DuplicateGold();
        thiz.sceneLayer.addChild(dup,3);
        this.dup = dup;

        dup._clickButHandlerTry =  function (money) {
            if(thiz.isTry){
                thiz.goldVitual = money;
                thiz.updateInforTry();
                if(parseInt(money)<=0){
                    thiz.btnX2.setVisible(false);
                }
                // thiz.changeGoldEffect(money);
                // thiz.onNhanThuong();
            }
        };

        dup._clickButHandler = function (i) {
            cc.log(i);
            thiz._controller.sendX2Request(thiz.indexBet,i);
        };

        dup._handeGiveClick = function (money) {
            thiz.btnX2.setVisible(false);
            if(thiz.isTry){
                if(money>0){
                    thiz.goldVitual = money;
                    thiz.updateInforTry();
                }
                thiz.btnX2.setVisible(false);
                thiz.activeButtonNewGame(true);
            }
            else {
                thiz._controller.sendGiveGold(thiz.indexBet);
                if(thiz.isModeAuto){
                    thiz.stopAllActions();
                    thiz.setModeRotateAuto();
                }

            }

        };
        dup._resuftDupVitual = function (idCard,type,moneyWin) {
            thiz.onBonus(idCard,type,moneyWin);
        };
        dup.setVisible(false);

        // var dialogBg = new ccui.Scale9Sprite("aoe_bg_den.png", cc.rect(10,5,4,4));
        // dialogBg.setPreferredSize(cc.size(838,517));
        // dialogBg.setAnchorPoint(cc.p(0,0));
        // dialogBg.setPosition(223,133);
        var selectLine = new SelectLineLavar();
        selectLine.setPosition(298,-100);
        this.sceneLayer.addChild(selectLine);
        selectLine._lineClickHandler = function () {
            if(thiz.isTry){
                MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
                selectLine.resetLine();
            }else {
                thiz.stopAllActions();
                thiz.clearAllLine();
                thiz.onSetTextBet();

                for(var i = 0; i < thiz.arrNum.length; i++){
                    thiz.arrNum[i].visibleNew(false);
                }
                var lines = selectLine.getLines();
                for(var i = 0; i < lines.length; i++){

                    thiz.arrNum[thiz.getLine(lines[i])].visibleNew(true);

                }

                thiz.enableAutoRotate(false);
            }


        };
        // selectLine._lineReconnect = function () {
        //     thiz.onSetTextBet();
        // },
        selectLine._clickOneLine = function (line,isShow) {
            thiz.arrNum[thiz.getLine(line+1)].visibleNew(isShow);
            thiz.onSetTextBet();
        };
        this.selectLine = selectLine;



        var wgFree = new cc.Sprite("#lv_free_conlai.png");
        wgFree.setPosition(cc.p(640, 150));
        this.wgFree = wgFree;
        this.bgSlot.addChild(wgFree);
        wgFree.setVisible(false);

        var lblFree =  cc.Label.createWithBMFont("res/Texture/Larva/money_longcung2.fnt", "0");
        lblFree.setPosition(wgFree.getContentSize().width - 50,wgFree.getContentSize().height/2+4);
        // lblFree.setColor(cc.color(243,202,114));
        wgFree.addChild(lblFree);
        this.lblFree = lblFree;

        var wgFreeVQ = new cc.Sprite("#bg_ve_free.png");
        wgFreeVQ.setPosition(cc.p(640, this.bgSlot.height-120));
        this.wgFreeVQ = wgFreeVQ;
        this.bgSlot.addChild(wgFreeVQ);
        wgFreeVQ.setVisible(false);

        var lblFreeVQ =  cc.Label.createWithBMFont("res/Texture/Larva/lv_fnt_vefree.fnt", "1");
        lblFreeVQ.setPosition(wgFreeVQ.getContentSize().width - 27,wgFreeVQ.getContentSize().height/2-2);
        // lblFree.setColor(cc.color(243,202,114));
        wgFreeVQ.addChild(lblFreeVQ);
        this.lblFreeVQ = lblFreeVQ;


        this.slotfui.initRandom();



    },

    setModeRotateNomarl:function () {
        this.isModeAuto = false;
        this.enableAutoRotate(false);
        this.rotateRequest();
    },
    setModeRotateAuto:function () {
        this.isModeAuto = true;
        this.enableAutoRotate(true);
        this.rotateRequest();
    },

    updateInfor:function () {
        if(this.isTry || !SocketClient.getInstance().isLoggin()){
            return;
        }

        this.lblSodu.stopAllActions();
        if( (this.goldOld - PlayerMe.gold) == ARR_BET_SLOT[this.indexBet]*this.selectLine.getLines().length ){

            this.lblSodu.setString(cc.Global.NumberFormat1(PlayerMe.gold));
        }else {
            this.goldOld = PlayerMe.gold;
            var zz =  cc.Global.NumberFormat1(parseInt(PlayerMe.gold));

            if(parseInt(PlayerMe.gold)==0){
                this.lblSodu.setString("0");
            }
            else{
                var action = new ext.ActionNumber(0.5, PlayerMe.gold);
                this.lblSodu.runAction(action);
                // this.lblSodu.setString(cc.Global.NumberFormat1(PlayerMe.gold));
            }
        }
        SocketClient.getInstance().postEvent("refreshAsset", {});
    },
    updateInforTry:function () {
        this.lblSodu.stopAllActions();
        if(this.goldVitual <= this.goldOld){
            this.lblSodu.setString(cc.Global.NumberFormat1(this.goldVitual));
        }else {
            this.goldOld = this.goldVitual;
            var zz =  cc.Global.NumberFormat1(parseInt(this.goldVitual));

            if(parseInt(this.goldVitual)==0){
                this.lblSodu.setString("0");
            }
            else{
                var action = new ext.ActionNumber(0.5, parseInt(this.goldVitual));
                this.lblSodu.runAction(action);
            }
        }
        cc.log("money====" + this.goldVitual);
    },

    getLine:function (index) {
      for(var i = 0; i < LINE_SLOT_NUM_LAVAR.length; i++){
          if(LINE_SLOT_NUM_LAVAR[i] == index){
              return i;
          }
      }
        return -1;
    },

    enableAutoRotate:function (isEnable) {
        // this.setActiveBt(this.btnAuto,!isEnable);
        //
        this.isAutoRotate = isEnable;

       // this.btnQuay.setMode(isEnable);
        // this.spAuto.setVisible(isEnable);
        this.btnAuto.loadTextureNormal(isEnable?"lv_tuquay2.png":"lv_tuquay.png",ccui.Widget.PLIST_TEXTURE);

    },

    rotateRequest:function () {


        if(SocketClient.getInstance().isLoggin() || this.isTry){

            this.hiddenAllPopup();

            if(this.nodeBigWin != undefined && this.nodeBigWin != null){
                this.nodeBigWin.removeFromParent(true);
                this.nodeBigWin = null;
            }
            if(!this.slotfui.getFreeSpining()){
                this.setTextWin("0");
            }

            this.activeButtonNewGame(false);
            this.btnX2.setVisible(false);
            this.clearLineDraw();
            this.stopAllActions();

            for(var i = 0; i < this.arrSmockAuTrung.length; i++){
                this.arrSmockAuTrung[i].removeFromParent();
            }
            this.arrSmockAuTrung = [];
            // if(PlayerMe.gold < this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet] && !this.isTry && !this.isAutoRotate ){
            //     MessageNode.getInstance().show("Bạn không đủ tiền để quay tiếp !");
            //   this.isHaveData = true;
            // this.activeButtonNewGame(true);
            // this.enableAutoRotate(false);
            //
            //     return;
            // }
            this.slotfui.rotate();
            this.isHaveData = false;
            if(this.isTry){
                var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));

                this.setTextHuThuong(yy +0.01*10000*this.selectLine.getLines().length);
                if(this.numberTry.length > 0 && this.isFreeSpin <=0){

                    var randomTry = Math.floor(cc.rand()%this.numberTry.length);
                    this._controller.sendRouteRequestTry(2,this.selectLine.getLines(), this.numberTry[randomTry],this.isFreeSpin);
                    // this._controller.sendRouteRequestTry(2,this.selectLine.getLines(), 2,this.isFreeSpin);
                    this.numberTry.splice(randomTry,1);
                }else {
                    this._controller.sendRouteRequestTry(2,this.selectLine.getLines(),-1,this.isFreeSpin);
                    this.isFreeSpin--;
                    if(this.isFreeSpin < 0){
                        this.isFreeSpin = 0;
                    }

                }
                if(this.isFreeSpin <=0){
                    this.setGoldVituarl(-10000*this.selectLine.getLines().length);
                    this.updateInforTry();
                }


            }
            else {
                this._controller.sendRouteRequest(this.indexBet,this.selectLine.getLines());

            }
            for(var m = 0; m < this.arrSpriteWild.length; m++){
                this.arrSpriteWild[m].removeFromParent();
            }

            this.createWildAnchor();

            //if( this._soundRotate != undefined &&  this._soundRotate != null){
              //  SoundPlayer.stopSoundLoop(this._soundRotate );
            // }
           // this._soundRotate =   SoundPlayer.playSoundLoop("lv_quay");
        }else {
            MessageNode.getInstance().show("Bạn chưa login");
            this.enableAutoRotate(false);
            this.menuTop.showGameTopBar(true);
        }




    },
    rotateRequestFree:function (cheat) {
        this.hiddenAllPopup();
        this.bonusLucky.setVisible(false);
        var thiz = this;
        if(this.nodeBigWin != undefined && this.nodeBigWin != null){
            this.nodeBigWin.removeFromParent(true);
            this.nodeBigWin = null;
        }

        this.setTextWin("0");
        this.activeButtonNewGame(false);
        this.btnX2.setVisible(false);
        this.clearLineDraw();
        this.stopAllActions();

        if(PlayerMe.gold < this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet] && !this.isTry && !this.isAutoRotate){
            MessageNode.getInstance().show("Bạn không đủ tiền để quay tiếp !");
            this.isHaveData = true;
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);

            return;
        }
        this.slotfui.rotate();
        this.isHaveData = false;
        if(this.isTry){
            var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));
            this.setGoldVituarl(-10000*this.selectLine.getLines().length);
            this.setTextHuThuong(yy +0.01*10000*this.selectLine.getLines().length);
            if(this.numberTry.length > 0){
                this.setActiveBt(this.btnTry,false);
                var randomTry = Math.floor(cc.rand()%this.numberTry.length);

                this._controller.sendRouteRequestTry(3,this.selectLine.getLines(), this.numberTry[randomTry]);
                this.numberTry.splice(randomTry,1);
            }else {
                this._controller.sendRouteRequestTry(3,this.selectLine.getLines(),-1);
            }


        }
        else {
            var request = {
                c: "game",
                g: "slot_25",
                p:{1:thiz.indexBet+1, 2:this.selectLine.getLines(),4:cheat}, // 111 bonuss 222 free 00000//no hu
                a:1551
            };
            SocketClient.getInstance().send(request);
        }
        if( this._soundRotate != undefined &&  this._soundRotate != null){
            SoundPlayer.stopSoundLoop(this._soundRotate );
        }
        // this._soundRotate =   SoundPlayer.playSoundLoop("quayrepeat");


    },
    initLine:function () {
        this.arrLine = [];
        var thiz = this;
        for(var i = 0; i< 25;i++){
            var line = new cc.Sprite("#lv_line_" + (i+1).toString()+ ".png");
            line.setPosition(cc.p(line.getContentSize().width/2,line.getContentSize().height/2));
            line.setVisible(false);
            this.bg_khung.addChild(line,3);
            this.arrLine.push(line);
        }
        this.arrNum = [];
        this.numberLineOld = -1;
        for(var i = 0; i < 25; i++){
            (function () {
                var mLine = thiz.arrLine[LINE_SLOT_NUM_LAVAR[i] - 1];

                var buttonNumer = new NumberSlot(LINE_SLOT_NUM_LAVAR[i].toString());
                buttonNumer.setMouseOverEnable();
                buttonNumer._onMouseOver = function (isOver) {
                    mLine.setVisible(isOver);
                };

                if((i%2 === 0)){
                    buttonNumer.setPosition(cc.p(157,613 - Math.floor(i/2)*40));
                }else {
                    buttonNumer.setPosition(cc.p(1130,612 - Math.floor(i/2)*44));
                }

                thiz.bg_khung.addChild(buttonNumer);
                thiz.arrNum.push(buttonNumer);
                buttonNumer.visibleNew(true);
            })();

        }
    },
    setTextBet:function (value) {
        // this.lblBet.setString("Tổng Cược: "+ value);
        // var posX =  225/2 - (this.lblBet.getContentSize().width/2 - this.txtBet.getContentSize().width);
        this.lblBet.setString(value);
        // this.txtBet.setPosition(posX,this.txtBet.getPositionY());
        // this.lblBet.setPosition(posX+2,this.txtBet.getPositionY());
    },
    setTextWin:function (value) {

       var zz =  cc.Global.NumberFormat1(parseInt(value));

     //  var posX =  220/2 - ((71 + zz.length*12)/2 - this.txtWin.getContentSize().width);
        this.lblWin.stopAllActions();
        if(parseInt(value)==0){
            this.lblWin.setString(value);
        }
        else{
            var action = new ext.ActionNumber(0.5, parseInt(value));
            this.lblWin.runAction(action);
        }

        // this.txtWin.setPosition(posX,this.txtWin.getPositionY());
        // this.lblWin.setPosition(posX+2,this.txtWin.getPositionY());
    },
    onNhanThuong:function () {
        this.setTextWin("0");
        // this.lblMoneyLine.setVisible(false);
        var thiz = this;
        // var from = this.lblWin.getParent().convertToWorldSpace(this.lblWin.getPosition());
        // var to = this.playerMe.avt.getParent().convertToWorldSpace(this.playerMe.avt.getPosition());
        // this.move4Chip(from, to);
        this.btnX2.setVisible(false);
        this.btnGive.setVisible(false);
        this.activeButtonNewGame(true);

        //var randeom = Math.floor(Math.random()*8);
        // if(randeom !=2){
        //     return;
        // }
        // for(var i = 0; i < 5; i++){
        //     (function () {
        //         var iNew = i;
        //         thiz.btnX2.runAction(new cc.Sequence(
        //             new cc.DelayTime(iNew*0.2),
        //             new cc.CallFunc(function () {
        //                 var coin =  new CoinNode();
        //                 coin.show();
        //             })
        //         ))
        //
        //     })();
        // }
    },
    initLabel:function () {
        //hu thuong
        var thiz = this;

        var bgHu = new  cc.Sprite("#lv_bg_huThuong.png") ;//ccui.Button("lv_bg_huThuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // bgHu.setScale(0.8);
        bgHu.setAnchorPoint(0.5,1);
        bgHu.setPosition(cc.p(1000,900));
        // bgHu.addTouchEventListener(function () {
        //     if(thiz.isTry){
        //         MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
        //     }else {
        //
        //     }
        // });
        this.nodeTop.addChild(bgHu,1);



        // var bgHu = new ccui.Button("slot_bg_hu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // bgHu.setScale9Enabled(true);
        // bgHu.setCapInsets(cc.rect(12, 0, 4, 46));
        // bgHu.setContentSize(cc.size(290, 46));
        // bgHu.setPosition(cc.p(504,560));
        // this.bgSlot.addChild(bgHu,100);
        // bgHu.addClickEventListener(function () {
        //    cc.log("Lich su no hu");
        //     if(thiz.isTry){
        //         MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
        //     }else {
        //         var his = new HistoryNoHuFruit();
        //         his.show();
        //     }
        //
        // });



        // var bgHu = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        // bgHu.setPreferredSize(cc.size(290, 46));
        // bgHu.setPosition(cc.p(504,560));
        // this.bgSlot.addChild(bgHu,100);

        // var txtHu = new cc.LabelTTF("Hũ thưởng", cc.res.font.Roboto_Condensed,24);
        // txtHu.setColor(cc.color(186,194,249,255));
        // txtHu.setAnchorPoint(cc.p(1,0.5));
        // txtHu.setPosition(142,23);
        // bgHu.addChild(txtHu);
        // uthis.txtH = txtHu;

        var lblHu = cc.Label.createWithBMFont("res/Texture/Larva/home_font_jackpot_0.fnt", "1000000");// new cc.LabelTTF("10.001", cc.res.font.Roboto_CondensedBold,24);
        // lblHu.setColor(cc.color(238,211,15,255));
        // lblHu.setAnchorPoint(cc.p(0,0.5));
        lblHu.setScale(1.15);
        lblHu.setPosition(bgHu.getContentSize().width/2,30);
        bgHu.addChild(lblHu);
        this.lblHu = lblHu;



        // muc cuoc


        // var txtBet = new cc.LabelTTF("Tổng Cược:", cc.res.font.Roboto_Condensed,24);
        // txtBet.setColor(cc.color(186,194,249,255));
        // txtBet.setAnchorPoint(cc.p(1,0.5));
        // txtBet.setPosition(108,23);
        // this.txtBet = txtBet;
        // bgBet.addChild(txtBet);



        // tien win
        // var bgWin = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        // bgWin.setPreferredSize(cc.size(220, 46));
        // bgWin.setPosition(cc.p(504+110,140));
        // this.bgSlot.addChild(bgWin);





        var lblID = new cc.LabelTTF("", cc.res.font.Roboto_CondensedBold,24);
        lblID.setColor(cc.color(225,177,255,255));
        lblID.setPosition(504,85);
        this.bgSlot.addChild(lblID);
        this.lblID = lblID;



    },


    setModePlay:function (isTry) {

        var thiz = this;
        this.resetGame();
        this.isTry = isTry;
        this.dup.setTry(this.isTry);
        this.bonusLucky.setTry(this.isTry);

        if(thiz.isTry)  {
            thiz.selectLine.resetState();
            thiz.goldVitual = 50000000;
            thiz.numberTry = [0,1,2,3,4,5,6,7];
            thiz.setTextWin(0);
            thiz.setTextHuThuong("50000000");
            thiz.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*10000));
            thiz.updateInforTry();
            thiz.clearAllLine();
            thiz.onSetTextBet();
            thiz.enableAutoRotate(false);
            for(var  i = 0;i < this.arrButBet.length; i++)
                this.setActiveBt(this.arrButBet[i],false);
        }
        else {

            this.updateInfor();
            this.setlectButtonBet(thiz.indexBet);
            this.updateHuThuong();
            //this.setTextHuThuong(JackpotEvent.getJackPot(GameType.GAME_AOE,thiz.indexBet+1).toString());
            thiz.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*ARR_BET_SLOT[thiz.indexBet]));
            //
            this.activeButtonNewGame(true);
            for(var  i = 0;i < this.arrButBet.length; i++)
                this.setActiveBt(this.arrButBet[i],true);
        }

    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },

    onSetTextBet:function () {
        this.setTextBet(cc.Global.NumberFormat1(this.selectLine.getLines().length*ARR_BET_SLOT[this.isTry?2:this.indexBet]));
        this.lblRowNumber.setString(this.selectLine.getLines().length.toString() );
    },

    setlectButtonBet:function (index) {
        this.resetGame();
        this.enableAutoRotate(false);
        this.indexBet = index;
        this._controller.sendJoinGame(this.indexBet+1);
        for(var i = 0; i< this.arrButBet.length;i++){
            var name = "lv_muc"+(i).toString()+"b.png";
            if(i==index){
                name = "lv_muc"+(i).toString()+".png";
            }
            this.arrButBet[i].loadTextureNormal( name,ccui.Widget.PLIST_TEXTURE) ;
        }
        this.onSetTextBet();
        this.updateHuThuong();
        this.jacpotEvent.setBetting(this.indexBet+1);
    },

    resetGame:function () {

        this.wgFree.setVisible(false);
        this.wgFreeVQ.setVisible(false);
        this.setTextWin(0);
        this.btnX2.setVisible(false);
    },

    initTopBar:function () {
        var thiz = this;

        var bg_top = new cc.Sprite("#bg_top.png");
        bg_top.setAnchorPoint(0.5,1);
        bg_top.setPosition(1000, 900);
        this.nodeTop.addChild(bg_top);


        var backBt = new ccui.Button("lv_back_new.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var disBut = 83;
        backBt.setPosition(550, 867);
        this.nodeTop.addChild(backBt);
        backBt.addClickEventListener(function () {
            // thiz.menuTop.showGameTopBar(true);
             thiz.backButtonClickHandler();
        });

        var settingBt = new ccui.Button("lv_setting.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setScale(0.8);
        settingBt.setPosition(1446  ,backBt.y);
        settingBt.addClickEventListener(function () {
            var settingDialog = new SettingDialog();
            settingDialog.showWithAnimationMove();
        });
        this.nodeTop.addChild(settingBt);

        // var hisBt = new ccui.Button("lv_btn_ls.png", "", "", ccui.Widget.PLIST_TEXTURE);
        //
        // hisBt.setPosition(942, 677);
        // hisBt.addClickEventListener(function () {
        //     if(thiz.isTry){
        //         MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
        //     }
        //     else {
        //         var lichsupop = new AllLichSuLayer(GameType.GAME_Larva);
        //         lichsupop.show();
        //     }
        //
        // });
        // this.bgSlot.addChild(hisBt);

        var tutorialBt = new ccui.Button("lv_btn_hd.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialBt.setPosition(1380, backBt.y);
        tutorialBt.setScale(0.9);
        tutorialBt.addClickEventListener(function () {
            var hdanlayer = new HDanChoiLarvaLayer();
            hdanlayer.show();

        });
        this.nodeTop.addChild(tutorialBt);


        // var bxhBt = new ccui.Button("lv_btn_vd.png", "", "", ccui.Widget.PLIST_TEXTURE);
        //
        // bxhBt.setPosition(859, 677);
        // bxhBt.addClickEventListener(function () {
        //     var bangvinhdanhpop = new AllBangVinhDanhLayer(GameType.GAME_Larva);
        //     bangvinhdanhpop.show();
        //     // thiz.vinhdanh.setVisible(true);
        //     // SoundPlayer.playSound("mini_clickButton");
        // });
        // this.bgSlot.addChild(bxhBt);
        // for(var i = 0; i < 10; i ++){
        //     this.addBangVinhDanh("13/07/2017 - 18:00:00", "nickname", "10.000","10.000", "10.000", "thang lon");
        //
        // }
        // for(var i = 0; i < 10; i ++){
        //     this.addLsuChoiXlot("123123123", "13/07/2017 - 18:00:00", "10.000", "10.000", "thang lon");
        //
        // }
    },

    initVinhDanhLichSu:function (parent) {
        var  thiz = this;

        var nodeNH =  new cc.Node();
        this.sceneLayer.addChild(nodeNH);
        thiz.nodeNH = nodeNH;

        var arr_tit = ["Thời gian", "Tài khoản", "Phòng", "Cược", "Thắng", "Mô tả"];

        var extend = 979;
        var arr_tit_pos = [13, 151, 258, 316, 375, 466];

        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, arr_tit[i]);
            m_lb.setScale(0.5);
            // m_lb.setColor(cc.color("#88725e"));
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(extend + arr_tit_pos[i], 206-4));
            nodeNH.addChild(m_lb);
        }



        var mListNH = new newui.TableView(cc.size(580, 160), 1);
        mListNH.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mListNH.setScrollBarEnabled(false);
        mListNH.setPadding(3);
        mListNH.setAnchorPoint(cc.p(0.0, 0));
        mListNH.setPosition(cc.p(extend+3, 30));
        nodeNH.addChild(mListNH);
        this.listNH = mListNH;


        // init vinh danh

        var nodeVD =  new cc.Node();
        this.sceneLayer.addChild(nodeVD);
        thiz.nodeVD = nodeVD;

        var arr_tit = ["Thời gian", "Tài khoản", "Phòng", "Cược", "Thắng", "Mô tả"];

        var extend = 979;
        var arr_tit_pos = [13, 151, 258, 316, 375, 466];

        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, arr_tit[i]);
            m_lb.setScale(0.5);
            // m_lb.setColor(cc.color("#88725e"));
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(extend + arr_tit_pos[i], 206-4));
            nodeVD.addChild(m_lb);
        }



        var mList = new newui.TableView(cc.size(580, 160), 1);
        mList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mList.setScrollBarEnabled(false);
        mList.setPadding(3);
        mList.setAnchorPoint(cc.p(0.0, 0));
        mList.setPosition(cc.p(extend+3, 30));
        nodeVD.addChild(mList);
        this.listVinhDanh = mList;

        // node lich su

        var nodeLS =  new cc.Node();
        this.sceneLayer.addChild(nodeLS);
        this.nodeLS = nodeLS;

        var  arr_titLS = ["Phiên", "Thời gian", "Cược", "Thắng", "Mô tả"];

        var arr_tit_posLs = [23, 136, 286, 360, 469];


        for(var i = 0; i < arr_tit.length; i++){
            var m_lb = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, arr_titLS[i]);
            m_lb.setScale(0.5);
            // m_lb.setColor(cc.color("#88725e"));
            m_lb.setAnchorPoint(cc.p(0.0, 0.5));
            m_lb.setPosition(cc.p(extend + arr_tit_posLs[i], 206-4));
            nodeLS.addChild(m_lb);
        }



        var mLs = new newui.TableView(cc.size(580, 160), 1);
        mLs.setDirection(ccui.ScrollView.DIR_VERTICAL);
        mLs.setScrollBarEnabled(false);
        mLs.setPadding(3);
        mLs.setAnchorPoint(cc.p(0.0, 0));
        mLs.setPosition(cc.p(extend+3, 30));
        nodeLS.addChild(mLs);
        this.listLichsu = mLs;


        this.index3Tab = 0;


        var btn_vd  = new ccui.Button("lv_tab_vd1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_vd.setPosition(cc.p(974,348));
        parent.addChild(btn_vd);
        this.btn_vd = btn_vd;
        btn_vd.addClickEventListener(function () {
            thiz.index3Tab = 1;
            thiz.setVisibeVD_LS();
            thiz._controller.getBXHVinhDanhGame(GameType.GAME_Larva);
        });

        var btn_ls  = new ccui.Button("lv_tab_ls1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn_ls.setPosition(cc.p(1158,348));
        parent.addChild(btn_ls);
        this.btn_ls = btn_ls;
        btn_ls.addClickEventListener(function () {
            thiz.index3Tab = 2;
            thiz.setVisibeVD_LS();
            thiz._controller.getLichSuGame(GameType.GAME_Larva);
        });

        var lv_tab_nh  = new ccui.Button("lv_tab_nh1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lv_tab_nh.setPosition(cc.p(790,348));
        parent.addChild(lv_tab_nh);
        this.lv_tab_nh = lv_tab_nh;
        lv_tab_nh.addClickEventListener(function () {
            thiz.index3Tab = 0;
            thiz.setVisibeVD_LS();
            thiz._controller.getNoHuList(GameType.GAME_Larva);
        });



        thiz._controller.getNoHuList(GameType.GAME_Larva);
         this._controller.getBXHVinhDanhGame(GameType.GAME_Larva);
        this._controller.getLichSuGame(GameType.GAME_Larva);
        thiz.setVisibeVD_LS();
    },

    setVisibeVD_LS:function () {
      if(this.index3Tab == 0)  {
          this.btn_vd.loadTextureNormal("lv_tab_vd2.png",ccui.Widget.PLIST_TEXTURE);
          this.btn_ls.loadTextureNormal("lv_tab_ls2.png",ccui.Widget.PLIST_TEXTURE);
          this.lv_tab_nh.loadTextureNormal("lv_tab_nh1.png",ccui.Widget.PLIST_TEXTURE);
          this.nodeVD.setVisible(false);
          this.nodeLS.setVisible(false);
          this.nodeNH.setVisible(true);

      }else  if(this.index3Tab == 1) {
          this.btn_vd.loadTextureNormal("lv_tab_vd1.png",ccui.Widget.PLIST_TEXTURE);
          this.btn_ls.loadTextureNormal("lv_tab_ls2.png",ccui.Widget.PLIST_TEXTURE);
          this.lv_tab_nh.loadTextureNormal("lv_tab_nh2.png",ccui.Widget.PLIST_TEXTURE);
          this.nodeVD.setVisible(true);
          this.nodeLS.setVisible(false);
          this.nodeNH.setVisible(false);
      }else  if(this.index3Tab == 2) {
          this.btn_vd.loadTextureNormal("lv_tab_vd2.png",ccui.Widget.PLIST_TEXTURE);
          this.btn_ls.loadTextureNormal("lv_tab_ls1.png",ccui.Widget.PLIST_TEXTURE);
          this.lv_tab_nh.loadTextureNormal("lv_tab_nh2.png",ccui.Widget.PLIST_TEXTURE);
          this.nodeVD.setVisible(false);
          this.nodeLS.setVisible(true);
          this.nodeNH.setVisible(false);
      }

    },

    addLsuChoiXlot : function (idphien, thoigian, cuoc, thang, mota) {
        var container = new ccui.Widget();
        var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
        bg_cell.setPreferredSize(cc.size(570, 30));
        var arr_tit_posLs = [23, 136, 286, 360, 469];
        container.setContentSize(bg_cell.getContentSize());
        bg_cell.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_cell);

        var lb_idphien = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, idphien);
        lb_idphien.setAnchorPoint(cc.p(0.0, 0.5));
        lb_idphien.setPosition(cc.p(arr_tit_posLs[0], container.height/2));
        container.addChild(lb_idphien);


        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, thoigian);
        lb_thoigian.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thoigian.setPosition(cc.p(arr_tit_posLs[1], container.height/2));
        container.addChild(lb_thoigian);

        var lb_cuoc = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, cuoc);
        lb_cuoc.setColor(cc.color("#fff996"));
        lb_cuoc.setAnchorPoint(cc.p(0.0, 0.5));
        lb_cuoc.setPosition(cc.p(arr_tit_posLs[2], container.height/2));
        container.addChild(lb_cuoc);

        var lb_thang = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, thang>0?("+" + cc.Global.NumberFormat1(thang)):thang.toString());
        lb_thang.setColor(cc.color("#fff996"));
        lb_thang.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thang.setPosition(cc.p(arr_tit_posLs[3], container.height/2));
        container.addChild(lb_thang);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, mota, cc.TEXT_ALIGNMENT_LEFT, 230);
        lb_mota.setAnchorPoint(cc.p(0.0, 0.5));
        lb_mota.setPosition(cc.p(arr_tit_posLs[4], container.height/2));
        container.addChild(lb_mota);

        lb_idphien.setScale(0.55);
        lb_thoigian.setScale(0.55);
        lb_cuoc.setScale(0.55);
        lb_thang.setScale(0.55);
        lb_mota.setScale(0.55);

        this.listLichsu.pushItem(container);
    },

    addBangVinhDanh : function (thoigian, nickname, room, cuoc, thang, mota) {
        var container = new ccui.Widget();
        var arr_tit_pos = [13, 151, 258, 316, 375, 466];

        var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
        bg_cell.setPreferredSize(cc.size(570, 30));
        container.setContentSize(bg_cell.getContentSize());
        bg_cell.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_cell);

        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, thoigian);

        lb_thoigian.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thoigian.setPosition(cc.p(arr_tit_pos[0], container.height/2));
        container.addChild(lb_thoigian);


        var lb_nickname = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, nickname);
        lb_nickname.setAnchorPoint(cc.p(0.0, 0.5));
        lb_nickname.setPosition(cc.p(arr_tit_pos[1], container.height/2));
        container.addChild(lb_nickname);

        var lb_phong = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, room);
        lb_phong.setAnchorPoint(cc.p(0.0, 0.5));
        lb_phong.setPosition(cc.p(arr_tit_pos[2], container.height/2));
        container.addChild(lb_phong);


        var lb_cuoc = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, cuoc);
        lb_cuoc.setColor(cc.color("#fff996"));
        lb_cuoc.setAnchorPoint(cc.p(0.0, 0.5));
        lb_cuoc.setPosition(cc.p(arr_tit_pos[3], container.height/2));
        container.addChild(lb_cuoc);

        var lb_thang = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, thang);
        lb_thang.setColor(cc.color("#fff996"));
        lb_thang.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thang.setPosition(cc.p(arr_tit_pos[4], container.height/2));
        container.addChild(lb_thang);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, mota, cc.TEXT_ALIGNMENT_LEFT, 230);
        lb_mota.setAnchorPoint(cc.p(0.0, 0.5));
        lb_mota.setPosition(cc.p(arr_tit_pos[5], container.height/2));
        container.addChild(lb_mota);

        lb_thoigian.setScale(0.55);
        lb_nickname.setScale(0.55);
        lb_phong.setScale(0.55);
        lb_cuoc.setScale(0.55);
        lb_thang.setScale(0.55);
        lb_mota.setScale(0.55);

        this.listVinhDanh.pushItem(container);
    },
    addBangNoHu : function (thoigian, nickname, room, cuoc, thang, mota) {
        var container = new ccui.Widget();
        var arr_tit_pos = [13, 151, 258, 316, 375, 466];

        var bg_cell = new ccui.Scale9Sprite("home_napvang_daily_bg_cell.png", cc.rect(15, 15, 4, 4));
        bg_cell.setPreferredSize(cc.size(570, 30));
        container.setContentSize(bg_cell.getContentSize());
        bg_cell.setPosition(cc.p(container.width/2, container.height/2));
        container.addChild(bg_cell);

        var lb_thoigian = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, thoigian);

        lb_thoigian.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thoigian.setPosition(cc.p(arr_tit_pos[0], container.height/2));
        container.addChild(lb_thoigian);


        var lb_nickname = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, nickname);
        lb_nickname.setAnchorPoint(cc.p(0.0, 0.5));
        lb_nickname.setPosition(cc.p(arr_tit_pos[1], container.height/2));
        container.addChild(lb_nickname);

        var lb_phong = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, room);
        lb_phong.setAnchorPoint(cc.p(0.0, 0.5));
        lb_phong.setPosition(cc.p(arr_tit_pos[2], container.height/2));
        container.addChild(lb_phong);


        var lb_cuoc = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, cuoc);
        lb_cuoc.setColor(cc.color("#fff996"));
        lb_cuoc.setAnchorPoint(cc.p(0.0, 0.5));
        lb_cuoc.setPosition(cc.p(arr_tit_pos[3], container.height/2));
        container.addChild(lb_cuoc);

        var lb_thang = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, thang);
        lb_thang.setColor(cc.color("#fff996"));
        lb_thang.setAnchorPoint(cc.p(0.0, 0.5));
        lb_thang.setPosition(cc.p(arr_tit_pos[4], container.height/2));
        container.addChild(lb_thang);

        var lb_mota = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, mota, cc.TEXT_ALIGNMENT_LEFT, 230);
        lb_mota.setAnchorPoint(cc.p(0.0, 0.5));
        lb_mota.setPosition(cc.p(arr_tit_pos[5], container.height/2));
        container.addChild(lb_mota);

        lb_thoigian.setScale(0.55);
        lb_nickname.setScale(0.55);
        lb_phong.setScale(0.55);
        lb_cuoc.setScale(0.55);
        lb_thang.setScale(0.55);
        lb_mota.setScale(0.55);

        this.listNH.pushItem(container);
    },
    exitToGame: function (message) {
        var homeScene = new HomeScene();
        SceneNavigator.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },

    handleResuftZ:function(isReconnect,param){
        this.arrIndexWild = [];
        if(!isReconnect){
            this.runAction(new cc.Sequence(new cc.DelayTime(0.05), new cc.CallFunc(function () {
               // SoundPlayer.stopSoundLoop(thiz._soundRotate);


            })));

        }
        this.dataSlot = param;
        var arrItem = param["2"];
        var moneyWin = param["3"]["7"];
        this.isHaveData = true;
        // this.dup.setMoney(moneyWin);
        if(moneyWin == null){
            this.moneyWin = "0";
        }

        var thiz =  this;

        if(arrItem.length > 0 ){
            this.btnStop.setVisible(true);
        }
        if(this.dataSlot["7"]){
            this.setFreeSpinVQ(this.dataSlot["7"]);
        }
        if(isReconnect){
            this.arrFreeSpin = [];
            this.isFreeSpin = 0;
            this.slotfui.showNotEffect(arrItem);
            thiz.onFinishQuay();
        }else {

            for(var k = 0; k < arrItem.length; k++){

                var arrColumWild = [];
              if(arrItem[k][0] == 0){ // line nay có wild
                  var randomIndex = Math.floor(Math.random()*3);
                  cc.log("randomIndex" + randomIndex);
                  var arrItemReplace = [8,9,10];

                  for(var m = 0; m < 3; m++){

                      if(m != randomIndex){
                          var randomReplace =  Math.floor(Math.random()*arrItemReplace.length);
                          arrColumWild.push(k*3 + m);

                          cc.log("wild "+ (k*3 + m) + "item new:" + arrItemReplace[randomReplace]);
                          arrItem[k][m] = arrItemReplace[randomReplace];
                          arrItemReplace.slice(randomReplace,1);

                      }

                  }

              }
                thiz.arrIndexWild.push(arrColumWild);
            }
            if( !this.isSieuToc ){
                this.slotfui.stopSlotWithResuft(arrItem);
            }else{
                this.slotfui.stopNow(this.dataSlot["2"]);
            }

            // this.slotfui.stopSlotWithResuft(arrItem);

        }

    },

    isHaveWild:function () {
      for(var i = 0; i < this.arrIndexWild.length; i++){
          if(this.arrIndexWild[i].length > 0){
              return true;
          }

        }
        return false;
    },

    handelStopButton:function () {
        this.enableAutoRotate(false);
        this.slotfui.stopNow(this.dataSlot["2"]);
    },
    setFreeSpin:function (number) {
        this.wgFree.setVisible(true);
        this.lblFree.setString(number.toString());
        this.btn20Row.isCanTouchZZ = (number<=0)?true:false;
        this.selectLine.isTouchLine = this.btn20Row.isCanTouchZZ;
    },
    setFreeSpinVQ:function (number) {
        if(number>0){
            this.wgFreeVQ.setVisible(true);
            this.lblFreeVQ.setString(number.toString());
        }else {
            this.wgFreeVQ.setVisible(false);
        }


    },
    onFinishQuay:function () {
        var  thiz =  this;
        delayAuto = 1.0;
        var special = false;
        SoundPlayer.stopSoundLoop(thiz._soundRotate);
        var moneyOldFree = 0;
        var moneyWin =   parseInt(this.dataSlot["3"]["2"]);
        this.dup.setMoney(this.dataSlot["3"]["7"]);


        if(this.dataSlot["6"] && this.dataSlot["6"] == 2){
            thiz.poupFreeEnd.setDupX2(true);
        }else {
            thiz.poupFreeEnd.setDupX2(false);
        }



        var timedelayWild = 0;
        var timedelaySmock = 0;
        var timeTextWin = 0;
        if(thiz.isHaveWild()){
            timedelaySmock = 0.1;
            timedelayWild = 0.8;
            timeTextWin = 1.7;

        }
        // setTimeout(function () {
            thiz.setTextWin(moneyWin);
            thiz.activeButtonNewGame(true);
        // },timeTextWin*1000);


        this.btnX2.setVisible(this.dataSlot["5"]);
        this.arrWildAnchor = [];
        thiz.slotfui.setIsFree(false);
        if(this.dataSlot["4"] > -1 ){

            thiz.setFreeSpin(this.dataSlot["4"]);
            this.wgFree.setVisible(this.dataSlot["4"]);
            if( this.dataSlot["4"] > 0){
                thiz.slotfui.setIsFree(true);
                thiz.pausePlayFreeBonus(true);
                thiz.getArrWildAnchor();

                    moneyOldFree = parseInt(this.lblWin.getString().replace(/[.,]/g, ''));


                // get item wild
            }else if(this.dataSlot["4"] == 0){

                this.poupFreeEnd.setVisible(true);
                this.poupFreeEnd.setMoneyFree(parseInt(this.dataSlot["3"]["7"]));
                var moneyWinEnd =   parseInt(this.dataSlot["3"]["7"]);
                this.dup.setMoney(moneyWinEnd);
                moneyOldFree = parseInt(this.lblWin.getString().replace(/[.,]/g, '')) - 250000;
                this.setTextWin(moneyWinEnd);
                moneyWin = moneyWinEnd;

                special = true;

            }

        }else {
            this.wgFree.setVisible(false);
        }
        if( this.dataSlot["3"]["5"] > 0){
            thiz.slotfui.setIsFree(true);
            thiz.pausePlayFreeBonus(false);
            this.runAction(new cc.Sequence(new cc.DelayTime(timedelaySmock+timedelayWild), new cc.CallFunc(function () {
                var popupFree = new LarvaPopupFree();
                popupFree.setTag(5555);
                popupFree.setContent(thiz.dataSlot["3"]["6"]);
                thiz.sceneLayer.addChild(popupFree);
                thiz.setFreeSpin(thiz.dataSlot["3"]["5"]);
            })));


        }
    //0 no , 1.bonus  2 free , tooo
        if(this.dataSlot["3"]["6"]){
            SoundPlayer.playSound("lv_bonus");
            delayAuto = 24;
            thiz.enableAutoRotate(false);
            var moneyWinBonus=   parseInt(this.dataSlot["3"]["7"]);
            this.dup.setMoney(moneyWinBonus);
            // this.setTextWin(moneyWinEnd);
            thiz.bonusLucky.onResuft(this.dataSlot["3"]["6"],this.dataSlot["3"]["3"]);
            thiz.bonusLucky.runAction(new cc.Sequence(new cc.DelayTime(timedelayWild+timedelaySmock), new cc.CallFunc(function () {
                thiz.poupBonusFirst.setVisible(true);
                thiz.poupBonusFirst.setFist(true);

            }),new cc.DelayTime(1), new cc.CallFunc(function () {
                thiz.pausePlaySoundBonus(false);
                thiz.bonusLucky.show();
                thiz.poupBonusFirst.setVisible(false);
            })));

        }

        var tienPlusNoHu = 0;
        if(this.isTry){
            if(this.dataSlot["3"]["4"]) {
                var yy = parseInt(this.lblHu.getString().replace(/[.,]/g, ''));
                this.setTextHuThuong(50000000);
                tienPlusNoHu = yy;
                this.moneyJackpot = yy;
                moneyWin =  moneyWin +   yy;

            }
            if(this.dataSlot["3"]["6"]){
                var moneyDao = parseInt(this.dataSlot["3"]["6"]["2"]);
                // thiz.setGoldVituarl(moneyDao);


            }
            if( this.dataSlot["3"]["5"] > 0){
                this.isFreeSpin += this.dataSlot["3"]["5"];
            }
            if(thiz.isFreeSpin>0){
                thiz.setFreeSpin(thiz.isFreeSpin);

            }
            this.dup.setMoneyTryOrinal(this.goldVitual- moneyOldFree+ tienPlusNoHu);
            cc.log("moneyOldFree" + moneyOldFree);

            this.setGoldVituarl(moneyWin - moneyOldFree );
            this.updateInforTry();


        }else{
            if(!this.dataSlot["3"]["6"])
            this.updateInfor();
        }
        if(this.dataSlot["3"]["4"]){
            this.updateHuThuong();
            this.runAction(new cc.Sequence(new cc.DelayTime(timedelaySmock+timedelayWild), new cc.CallFunc(function () {
                thiz.showJackpot();
                thiz.enableAutoRotate(false);
            })));

        }
        //
        if(parseInt(moneyWin) > 200*ARR_BET_SLOT[(thiz.isTry)?2:this.indexBet] && !this.dataSlot["3"]["4"] && !this.slotfui.getFreeSpining() )
        {
            this.runAction(new cc.Sequence(new cc.DelayTime(timedelaySmock+timedelayWild), new cc.CallFunc(function () {
                thiz.onBigwin(moneyWin);
            })));

        }else  if(moneyWin>0){
            SoundPlayer.playSound("lv_win");
        }



        // SoundPlayer.playSound("slot_win");

        this.btnStop.setVisible(false);



         this.runAction(new cc.Sequence(
             // new cc.DelayTime(timedelaySmock),
             new cc.CallFunc(function () {
                if(timedelaySmock>0){
                    thiz.showEffectSmock();

                }
             }),
             new cc.DelayTime(timedelayWild),
             new cc.CallFunc(function () {
                 thiz.slotfui.showWild(thiz.arrIndexWild);
             }),


             new cc.DelayTime(timedelayWild ),

             new cc.CallFunc(function () {
             var isSpectcal = false;
                 if(thiz.dataSlot["3"]["5"] >0 ||   thiz.dataSlot["3"]["3"] > 0) {
                     isSpectcal = true;
                 }
                thiz.showAllLineWin(isSpectcal);
            }),
            new cc.DelayTime(this.isAutoRotate?0.5:0.5),
            new cc.CallFunc(function () {
                    if(thiz.dataSlot["3"]["5"] == 0 &&  thiz.dataSlot["3"]["3"] == 0) {
                        thiz.clearAllLine();
                    }
                }),
            new cc.CallFunc(function () {
                    if(thiz.dataSlot["3"]["5"] == 0 &&  thiz.dataSlot["3"]["3"] == 0 ) {
                        if(!thiz.isAutoRotate)
                        thiz.showOneLine();
                    }
            })
              ));
        if(this.dataSlot["3"]["1"]){
            var obArrLine = this.dataSlot["3"]["1"];
            if(obArrLine.length>0){
                delayAuto = 1.7;
            }
        }


        var actionAutoRotate = new cc.Sequence(new cc.DelayTime(delayAuto+timedelaySmock+timedelayWild),new cc.CallFunc(function () {
            if(!thiz.isHaveData){
                return;
            }
            if(thiz.isAutoRotate && !thiz.isTry){

                thiz.setModeRotateAuto();
            }

        }));
        actionAutoRotate.setTag(TAG_AUTO_ROTATE);
        if(this.isAutoRotate){
            this.runAction(actionAutoRotate);

        }
        if(!this.isTry){
            this._controller.getBXHVinhDanhGame(GameType.GAME_Larva);
            this._controller.getLichSuGame(GameType.GAME_Larva);
        }
    },
    getArrWildAnchor:function () {
        for(var i=0; i < this.dataSlot["2"].length; i++){
            for(var j = 0 ; j < this.dataSlot["2"][i].length; j++){
                if(this.dataSlot["2"][i][j] == 12){
                    var obj ={
                        "cloum" : i,
                        "row":j
                    }
                    this.arrWildAnchor.push(obj);
                }
            }
        }
    },
    showEffectSmock:function () {
        cc.log("showEffectSmock");
        var thiz = this;
        SoundPlayer.playSound("lv_wild");
        thiz.arrSmockAuTrung = [];
        for(var m = 0; m < this.arrIndexWild.length; m++){

            (function () {
                var zzz = m;
                if(thiz.arrIndexWild[zzz].length>0) {

                    var  lv_autrung = new cc.Sprite("#lv_autrung1.png");
                    lv_autrung.setPosition(cc.p(180 + 91 + m * 185, lv_autrung.height/2+ 115));
                    thiz.bgSlot.addChild(lv_autrung);
                    lv_autrung.setVisible(false);
                    thiz.arrSmockAuTrung.push(lv_autrung);
                    thiz.runAction(new cc.Sequence(
                        new cc.DelayTime(0.3),
                        new cc.CallFunc(function () {
                            lv_autrung.setVisible(true);
                            var frames = [];
                            for(var k = 1; k < 3; k ++){
                                frames.push(cc.spriteFrameCache.getSpriteFrame("lv_autrung"+k.toString() +".png"));
                            }
                            var animation = new cc.Animation(frames, 0.2, 1);
                            var animateAction = new cc.Animate(animation);
                            lv_autrung.runAction( new cc.RepeatForever( animateAction  ));
                        }),
                        new cc.DelayTime(1.5),
                        new cc.CallFunc(function () {
                                lv_autrung.setVisible(false);
                            }
                        )
                    ));
                }
            })();

        }



    },
    showEffectTest:function () {
        cc.log("showEffectSmock");
        var thiz = this;
        SoundPlayer.playSound("lv_wild");
        thiz.arrSmockAuTrung = [];
        for(var m = 0; m < 5; m++){

            (function () {
                var zzz = m;


                    var  lv_autrung = new cc.Sprite("#lv_autrung1.png");
                    lv_autrung.setPosition(cc.p(180 + 91 + m * 185, lv_autrung.height/2+ 115));
                    thiz.bgSlot.addChild(lv_autrung);
                    lv_autrung.setVisible(false);
                    thiz.arrSmockAuTrung.push(lv_autrung);
                    thiz.runAction(new cc.Sequence(
                        new cc.DelayTime(0.3),
                        new cc.CallFunc(function () {
                            lv_autrung.setVisible(true);
                            var frames = [];
                            for(var k = 1; k < 3; k ++){
                                frames.push(cc.spriteFrameCache.getSpriteFrame("lv_autrung"+k.toString() +".png"));
                            }
                            var animation = new cc.Animation(frames, 0.2, 1);
                            var animateAction = new cc.Animate(animation);
                            lv_autrung.runAction( new cc.RepeatForever( animateAction  ));
                        }),
                        new cc.DelayTime(8),
                        new cc.CallFunc(function () {
                                lv_autrung.setVisible(false);
                            }
                        )
                    ));

            })();

        }



    },
    onDuplicate:function (data) {
       this.dup.handelResuft(data);
    },
    clearLineDraw:function () {
        for(var i = 0;i<25;i++){
            this.arrLine[i].setVisible(false);
            // this.arrNum[i].visibleNew(false);

        }
    },
    clearAllLine:function () {
        this.clearLineDraw();
        this.slotfui.clearAllItemInLine();
    },

    showNumLineReconnect:function (arrLine,index) {

        this.setModePlay();

        this.indexBet = index;
        this.setlectButtonBet(index);
        this.selectLine.setLineReconnect(arrLine);
        this.onSetTextBet();
        for(var i = 0; i < this.arrNum.length; i++){
            this.arrNum[i].visibleNew(false);
        }
        for(var i = 0; i < arrLine.length; i++){
            this.arrNum[arrLine[i]-1].visibleNew(true);
        }
    //
    //     for(var i = 0; i < arrLine.length; i++){
    //         this.arrNum[arrLine-1].visibleNew(true);
    //     }
    },
    setGoldVituarl:function (goldAdd) {
          var thiz = this;
          var moneyCurrent = thiz.goldVitual +  goldAdd;
            // thiz.playerMe.setGoldTry(thiz.goldVitual,moneyCurrent);
            thiz.goldVitual = moneyCurrent;
        },
    showAllLineWin:function(isSpectcal){
        var obArrLine = this.dataSlot["3"]["1"];

        for(var i = 0; i < obArrLine.length  ; i++){
            var line = obArrLine[i];
            if(line["5"] && isSpectcal){
                this.slotfui.showItemWin(line["5"]);

            }else if(!isSpectcal){
                var idLine =  line["1"]-1;
                if(idLine > -1){
                    this.arrLine[idLine].setVisible(true);
                    this.slotfui.showLineWin(idLine,line["3"]);
                }

            }

        }
        // this.lblMoneyLine.stopAllActions();
        // this.lblMoneyLine.setVisible(true);
        // this.lblMoneyLine.setString("0");
        // if(parseInt(this.dataSlot["4"])== 0){
        //     this.lblMoneyLine.setString("");
        // }
        // else{
        //     this.lblMoneyLine.runAction(new ext.ActionNumber(this.isAutoRotate?0.25:0.5, parseInt(this.dataSlot["4"])));
        // }

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
                if(!line["5"]){
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
                }

            })();

        }
        if(arrAction.length!=0){
            this.runAction(new cc.RepeatForever(new cc.Sequence(arrAction)));
        }


    },

    performChangeRewardFund:function (data) {
        if(!this.isTry){
            if(this.arrHuThuong && this.arrHuThuong.length>0){
                for(var i =0; i < this.arrHuThuong.length; i++){
                    this.arrHuThuong[i] = data[i][2];
                }
                this.setTextHuThuong(parseInt(this.arrHuThuong[this.indexBet]));
            }
        }


    },
    showArrButtonBet:function () {
        for (var  i = 0; i < this.arrButBet.length; i ++){
            this.arrButBet[i].setVisible(!this.isTry);
        }
    },
    clickAutoQuay:function () {
        if(this.isTry){
            this.enableAutoRotate(false);
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

        // this.setModeRotateAuto();

    },
    onBonus:function(idCard,type,moneyWin){
        this.dup.handelResuft(idCard,type,moneyWin);
        this.setTextWin(moneyWin);
        if(type == 3){
            this.btnX2.setVisible(false);
            this.btnGive.setVisible(false);

            this.activeButtonNewGame(true);
        }

    },

    updateGold: function ( gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }

        // this.playerMe.setGold(goldNumber);

    },
    changeGoldEffect: function ( deltaGold) {
      if(parseInt(deltaGold)>0){
          // this.playerMe.runChangeGoldEffect(deltaGold);
      }

    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        SoundPlayer.stopAllSound();
        if (this._controller) {
            this._controller.releaseController();
            this._controller = null;
        }
    },

    pausePlaySoundBonus:function (isPause) {
        SoundPlayer.stopAllSound();
        if(isPause)
        {
            SoundPlayer.playSound("lv_nhacnen_man chinh",true);
            SoundPlayer.stopSound("lv_nhacnen_bonus");
        }else {
            SoundPlayer.playSound("lv_nhacnen_bonus",true);
            SoundPlayer.stopSound("lv_nhacnen_man chinh");
        }

    },
    pausePlayFreeBonus:function (isPause) {
        SoundPlayer.stopAllSound();
        if(isPause)
        {
            SoundPlayer.playSound("lv_nhacnen_man chinh",true);
            SoundPlayer.stopSound("lv_nhacnen_freespin");
        }else {
            SoundPlayer.playSound("lv_nhacnen_freespin",true);
            SoundPlayer.stopSound("lv_nhacnen_man chinh");
        }

    },
    pausePlayJackpot:function (isPause) {
        SoundPlayer.stopAllSound();
        if(isPause)
        {
            SoundPlayer.playSound("lv_nhacnen_man chinh",true);
            SoundPlayer.stopSound("lv_nhacnen_nohu");
        }else {
            SoundPlayer.playSound("lv_nhacnen_nohu",true);
            SoundPlayer.stopSound("lv_nhacnen_man chinh");
        }

    },
    setModeChoiThu:function () {

    },

    onEnter : function () {
        this._super();
        var thiz = this;
        this.scheduleUpdate();
        SceneNavigator.addBackKeyEvent(this);
        // cc.eventManager.addListener({
        //     event: cc.EventListener.KEYBOARD,
        //     onKeyReleased: function (keyCode, event) {
        //         if(cc.sys.isNative){
        //             if (parseKeyCode(keyCode) === cc.KEY.back) {
        //                 thiz.backButtonClickHandler();
        //             }
        //         }
        //         else{
        //             if(keyCode === cc.KEY.escape){
        //                 thiz.backButtonClickHandler();
        //             }
        //         }
        //     }
        // }, this);

        // MiniGameNavigator.showAll();
        // FloatButton.getInstance().show(this.floatButtonLayer);
        // FloatButton.getInstance().setVisible(true);
    },
    backButtonClickHandler: function () {
        this.exitToGame();
    },
    move4Chip:function (from, to) {
        // var distance = cc.pDistance(from,to);
        // var timeRun = distance/380;
        SoundPlayer.playSound("mini_betchip");
        var thiz = this;
        for(var i = 0; i < 4; i++ ){
            (function () {
                var a = i;
                var chip = new cc.Sprite("#pk_xeng.png");
                chip.setPosition(from);
                chip.setVisible(true);
                chip.runAction(new cc.Sequence(
                    new cc.DelayTime(0.05*i),
                    new cc.EaseSineIn(new cc.MoveTo(0.7, to)),
                    new cc.CallFunc(function () {
                        chip.removeFromParent(true);
                    })
                ));
                thiz.sceneLayer.addChild(chip,10);
            })();

        }

    },
    saveDataJackpot:function (money) {
      this.moneyJackpot =   money;
    },
    showJackpot: function () {
        this._controller.isNohu = false;
        this.pausePlayJackpot(false);
        SoundPlayer.playSound("lv_nohu");
        this.poupJackpot.setVisible(true);
        this.poupJackpot.setMoneyJackPot(this.moneyJackpot);


    },
    activeButtonNewGame:function (isActive) {

        // this.setActiveBt(this.btnTry,isActive);
        this.btn20Row.isCanTouchZZ = isActive;
        this.selectLine.isTouchLine =    this.btn20Row.isCanTouchZZ;
        // this.btnQuay.setActiveBt(isActive);
        this.setActiveBt(this.btnQuay,isActive);
        if(!this.isTry){
            for(var  i = 0;i < this.arrButBet.length; i++)
                this.setActiveBt(this.arrButBet[i],isActive);
        }

    },
    onError:function(params){
        if( this._soundRotate != undefined &&  this._soundRotate != null){
            SoundPlayer.stopSoundLoop(this._soundRotate );
        }
        if(params["code"] == 102) {
            // this.menuTop.showGameTopBar(true);
            // MessageNode.getInstance().show("Show popup login");
        }

            this.slotfui.clearAll();
            this.dup.enableTouchZ = true;
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



    onBigwin:function (moneyWin) {

        //playSound

        this.poupBigWin.setVisible(true);
        this.poupBigWin.setMoneyBigWin(moneyWin);


      // var nodeBigWin = new cc.Node();
      //   //this.nodeBigWin = nodeBigWin;
      //   var spriHom = new cc.Sprite("#slot_hom_do.png");
      //   var cardBg = new cc.Sprite("#slot_bg_hom.png");
      //   cardBg.setPosition(spriHom.getContentSize().width/2+20, spriHom.getContentSize().height/2-20);
      //   spriHom.addChild(cardBg,-1);
      //
      //
      //
      //   cardBg.runAction(new cc.RepeatForever(new cc.RotateBy(2,360)));
      //
      //   var spWin = new cc.Sprite("#slot_winbig.png");
      //   spWin.setPosition(spriHom.getContentSize().width/2, spriHom.getContentSize().height/2-90);
      //   spriHom.runAction(new cc.RepeatForever(
      //       new cc.Sequence(
      //           new cc.ScaleTo(0.5,0.95),
      //           new cc.ScaleTo(0.5,1)
      //       )
      //   ));
      //   spWin.setScale(0.4);
      //   spriHom.addChild(spWin);
      //   // spriHom.setAnchorPoint(0.5,1);
      //   spriHom.setPosition(2000/2,900+100);
      //   spriHom.runAction(new cc.EaseBounceOut(new cc.MoveTo(1,cc.p(2000/2,900/2+50))));
      //   nodeBigWin.addChild(spriHom);
      //   spriHom.runAction(new cc.Sequence(new cc.DelayTime(0.4),new cc.CallFunc(function () {
      //       spWin.runAction(new cc.ScaleTo(0.5,1));
      //       var coin = new CoinNode();
      //       coin.show();
      //   })));
      //   var lblMoneyW = new cc.LabelTTF("0",cc.res.font.Roboto_CondensedBold,45);
      //   lblMoneyW.setPosition(spriHom.getContentSize().width/2+10, spriHom.getContentSize().height/2-160);
      //   lblMoneyW.setColor(cc.color(255,240,0,255));
      //   var action = new ext.ActionNumber(2, parseInt(moneyWin));
      //   lblMoneyW.runAction(action);
      //   spriHom.addChild(lblMoneyW);
      //
      //   this.addChild(nodeBigWin,2);
      //   nodeBigWin.setPosition(-40*cc.winSize.screenScale,0);
      //   nodeBigWin.runAction(new cc.Sequence(new cc.DelayTime(4),new cc.CallFunc(function () {
      //       cc.eventManager.addListener({
      //           event: cc.EventListener.TOUCH_ONE_BY_ONE,
      //           swallowTouches:true,
      //           onTouchBegan : function (touch, event) {
      //
      //               nodeBigWin.removeFromParent(true);
      //
      //               return true;
      //           },
      //       }, nodeBigWin);
      //   }),
      //       new cc.DelayTime(2),
      //       new cc.CallFunc(function () {
      //           nodeBigWin.removeFromParent(true);
      //       })
      //   ));




    },
    openAllLucky:function(arrBonus, arrRandom){
        this.bonusLucky.openAllItem(arrBonus, arrRandom);
    },
    openOneLucky:function(idItem, money){
        this.bonusLucky.openItem(idItem, money);
    },
    initController: function () {
        this._controller = new LarvaController(this);
    }
});


