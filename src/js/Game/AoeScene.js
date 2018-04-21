/**
 * Created by ext on 12/20/2016.
 */
//var s_ChanLeLayer = null;
// s_sfs_error_msg[1001] = "Bạn không đủ điều kiện chơi bonus";
// s_sfs_error_msg[900] = "Chưa hết thời gian chọn bonus!";
_arrPosVinhDanh = [20, 206, 351, 495, 634, 749];
var ItemFruit = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        var withMay = 947;
        this.itemWidth = withMay/5;
        this.disHCell = 180;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#slot_aoe_"+ (idItem).toString()+".png";
        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        this.spriteHoaQua = spriteHoaQua;


        var slot_bg_win = new cc.Sprite("#aoe_bg_effect_item.png");
        slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        slot_bg_win.setVisible(false);
        this.addChild(slot_bg_win,-1);
        this.slot_bg_win = slot_bg_win;

        slot_bg_win.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.3,100),
                new cc.FadeTo(0.3,255)
            )
        ));


        var bg = new cc.Sprite("#aoe_bg_item_win.png");
        bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        bg.setVisible(false);
        this.bg = bg;
        this.addChild(bg,-2);
    },
    setWin:function (isWin,isLigth) {
        this.slot_bg_win.setVisible(isLigth);
        this.bg.setVisible(isWin);
    }
});
var SlotFruit = SlotLayer.extend({
    ctor: function (soCot) {
        this._super(soCot);
        this.nodeSlot.setContentSize(cc.size(947,541));
        this.arrResuft = [];
    },
    newItem:function (idItem) {
        var temp = new ItemFruit(idItem);
        temp.soCot = this.soCot;
        return temp;
    },
    showLineWin:function (line,mask) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
            for(var j = 0; j < LINE_SLOT[line].length; j++){
                if(i == LINE_SLOT[line][j]){
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
        for (var i = 0; i < 5; i++) { // cot

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

var TAG_POPUP_HOM = 900;
var TAG_POPUP_FREE = 1001;
var TAG_POPUP_DAO_HAM = 1002;
var TAG_POPUP_JACKPOT = 1003;
var TAG_POPUP_BigWIN = 1004;

var LINE_SLOT_NUM = [6,16,2,12,8,19,5,14,1,13,4,17,10,18,7,15,3,11,9,20];

var SelectLine =  cc.Node.extend({
    ctor:function () {
        this._super();
        var thiz = this;

        var dialogBg  = new cc.Sprite("res/Texture/Aoe/aoe_bg_chondong.png"); //new ccui.Scale9Sprite("aoe_bg_den.png", cc.rect(10,5,4,4));
        // dialogBg.setPreferredSize(cc.size(858,520));
        // dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition(2000/2 , 900/2);
        // dialogBg.setScale(cc.winSize.screenScale);

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
                        thiz.setLineSend();
                        thiz.setVisible(false);
                        return true;
                    }
                    return false;
                }
                else{
                    return false;
                }

            }
        }, dialogBg);

        var closeButton = new ccui.Button("aoe_btnCloses.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(cc.p(986,580));
        closeButton.addClickEventListener(function () {
            thiz.setLineSend();
            thiz.setVisible(false);
        });
        // var lbl = new cc.Sprite("#aoe_tile_chondong.png");
        // lbl.setPosition(dialogBg.getContentSize().width/2,486);
        //
        // dialogBg.addChild(lbl);

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
                var xP =  190+ 158*(i%5) ;
                var yP =  183+ 104*Math.floor(i/5);

                // var bg = new cc.Sprite("#slot_sl_bg.png");
                var lol = (3-Math.floor(i/5))*5;
                var num = lol + i%5;
                var bg = new ccui.Button("aoe_line"+(num+1).toString() +".png", "", "", ccui.Widget.PLIST_TEXTURE);
                bg.setZoomScale(0);


                // var line = new cc.Sprite("#aoe_line"+(num+1).toString() +".png");
                //
                // line.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
                // bg.addChild(line);
                thiz.arrNumLine.push(num+1);
                // var lbl = new cc.LabelTTF((num+1).toString(), cc.res.font.Roboto_Medium,16);
                // lbl.setColor(cc.color("#ebd592"));
                // lbl.setAnchorPoint(1,0.5);
                // lbl.setPosition( -5, bg.getContentSize().height/2);
                // bg.addChild(lbl);
                // lbl.setTag(1);
                dialogBg.addChild(bg);
                bg.setPosition(cc.p(xP,yP));
                bg.addClickEventListener(function () {
                    thiz.handleClickLine(num);
                });
                thiz.arrLine.push({"line":bg,"isActive":true,"id":num});
            })();



        }
        var okChan = new ccui.Button("aoe_line_btnChan.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogBg.addChild(okChan);
        okChan.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?false:true);
            }
            thiz.setLineSendNotHiden();
        });
        okChan.setPosition(141,61);

        var okLe =new ccui.Button("aoe_line_btnLe.png","","", ccui.Widget.PLIST_TEXTURE);
        okLe.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?true:false);
            }
            thiz.setLineSendNotHiden();
        });
        dialogBg.addChild(okLe);
        okLe.setPosition(141+ 240,61);

        var okAll =new ccui.Button("aoe_line_btnAll.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogBg.addChild(okAll);
        okAll.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],true);
            }
            thiz.setLineSendNotHiden();
        });
        okAll.setPosition(141+ 2*240,61);


        var okDone = new ccui.Button("aoe_line_btnBo.png","","", ccui.Widget.PLIST_TEXTURE);
        dialogBg.addChild(okDone);
        okDone.addClickEventListener(function () {
            thiz.setLineSend();
        });
        okDone.setPosition(141+ 3*240,61);
        // this.initView();
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
            var line = this.getLineWithID(arrIdLine[i]-1);
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
        this.mTouch = cc.rect(0, 0 ,2000,900);
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
        btnClick["line"].setOpacity(enabled?255:80);
        // btnClick["line"].setEnabled(enabled);
        // btnClick["line"].getChildByTag(1).setOpacity(enabled?255:80);
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

var BangThuong =  cc.Node.extend({
    ctor:function () {
        this._super();
        var thiz = this;

        var bt = new cc.Sprite("res/Texture/Aoe/aoe_bang_thuong.png");
        bt.setPosition(2000/2,900/2);
        // bt.setScale(cc.winSize.screenScale);
        this.addChild(bt);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(thiz.preTouchPointBg != null){
                    return false;
                }
                if(thiz.isVisible()){
                    var p = bt.convertToNodeSpace(touch.getLocation());
                    // var p2 = thiz.convertToNodeSpace(bg_sc.getPosition());
                    // var rect = this.getBoundingBox();
                    if (!cc.rectContainsPoint( cc.rect(0, 0, bt.getContentSize().width, bt.getContentSize().height), p)) {
                        thiz.setVisible(false);
                        return true;
                    }
                    return false;
                }
                else{
                    return false;
                }

            }
        }, bt);



        // thiz.setContentSize(cc.size(858,517));
        // var dialogBg = new ccui.Scale9Sprite("aoe_bg_den.png", cc.rect(10,5,4,4));
        // dialogBg.setPreferredSize(cc.size(858,520));
        // // dialogBg.setAnchorPoint(cc.p(0,0));
        // dialogBg.setPosition(858/2 , 517/2-1);

        // var closeButton = new ccui.Button("aoe_btnBack.png","","", ccui.Widget.PLIST_TEXTURE);
        // closeButton.setPosition(cc.p(16,492));
        // closeButton.addClickEventListener(function () {
        //     thiz.setVisible(false);
        // });
        // var lbl = new cc.Sprite("#aoe_title_bangthuong.png");
        // lbl.setPosition(dialogBg.getContentSize().width/2,486);
        //
        // dialogBg.addChild(lbl);




        // this.addChild(closeButton);

        // var thiz = this;
        // this.mTouch = cc.rect(0, 0 ,838,517);
        // // var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),838,517);
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches:true,
        //     onTouchBegan : function (touch, event) {
        //         if(!thiz.isVisible())
        //         {
        //             return false;
        //         }
        //         var p = thiz.convertToNodeSpace(touch.getLocation());
        //         if(!cc.rectContainsPoint(thiz.mTouch, p)){
        //
        //             thiz.setVisible(false);
        //             // thiz.removeFromParent(true);
        //             return true;
        //         }
        //         else {
        //             return false;
        //         }
        //
        //     },
        // }, bt);
        // this.addChild(bt,-1);

    }


});

var VinhDanh =  cc.Node.extend({
    ctor:function () {
        this._super();
        var thiz = this;
        thiz.setContentSize(cc.size(858,517));
        var dialogBg = new ccui.Scale9Sprite("aoe_bg_den.png", cc.rect(10,5,4,4));
        dialogBg.setPreferredSize(cc.size(858,520));
        // dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition(858/2 , 517/2-1);

        var closeButton = new ccui.Button("aoe_btnBack.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(cc.p(16,492));
        closeButton.addClickEventListener(function () {
            thiz.setVisible(false);
        });
        var lbl = new cc.Sprite("#aoe_titleVinhDanh.png");
        lbl.setPosition(dialogBg.getContentSize().width/2,486);

        dialogBg.addChild(lbl);



        this.addChild(dialogBg);
        dialogBg.addChild(closeButton);

        var thiz = this;
        var mSize = cc.size(858,404);
        var dx = 0.0;
        this.arrHis = [];


        var arrTitle = ["#aoe_vd_time.png","#aoe_vd_tk.png","#aoe_vd_phongchoi.png","#aoe_vd_totabet.png","#aoe_vd_win.png", "#aoe_vd_decript.png"];
        var arrPosLine = [0,184,343,485,626,757];
        for(var i =0; i < arrTitle.length; i++){
            var lblTitle = new cc.Sprite(arrTitle[i]);
            // lblTitle.setColor(cc.color(87, 110, 176,255));
            lblTitle.setPosition(_arrPosVinhDanh[i]+60,422);
            // lblTitle.setAnchorPoint(cc.p(0,0.5));
            this.addChild(lblTitle);
            if(i>0 && i < 6){
                var lblTitle = new cc.Sprite("#aoe_line_vertical.png");
                lblTitle.setPosition(arrPosLine[i],0);
                lblTitle.setAnchorPoint(0.5,0);
                this.addChild(lblTitle,1);
            }
        }

        this.mTouch = cc.rect(0, 0 ,838,517);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),838,517);
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


        var listVd = new newui.ListViewWithAdaptor(mSize);
        listVd.setPosition(dx , 0);
        this.addChild(listVd);
        var lolNham = false;
        listVd.setCreateItemCallback(function () {
            lolNham = !lolNham;
            return thiz._createCell(lolNham);
        });
        listVd.setSizeCallback(function () {
            return thiz.arrHis.length;
        });
        listVd.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrHis[idx]);
        });
        this.listVd = listVd;
        for(var i = 0; i < 20; i ++){
            var obj = {

                time :  "08/09/2019 09:33:28",//cc.Global.DateToString(new Date(time)),
                acc : "nguyencong",
                room : "900k",
                bet : "10.000k",
                win:"10.000k",
                mota:"Thang lon"
            };
            this.arrHis.push(obj);
        }



    // this.listVd.refreshView();

    },


    _setData : function (view, data) {

        view.timeLabel.setString(data["time"]);
        view.accLabel.setString(data["acc"]);

        view.roomLabel.setString(data["room"]);



        view.betLabel.setString(data["bet"]);
        view.WinLabel.setString(data["win"]);
        view.dercpLabel.setString(data["mota"]);

    },
    _createCell : function (lolNham) {

        // var _arrPos = [61, 211, 362, 477, 605, 733, 857];
        var _arrPos = _arrPosVinhDanh ;
        var container = new ccui.Widget();
        container.setContentSize(cc.size(800, 67));
        if(lolNham){
            var bg = new ccui.Scale9Sprite("aoe_tranfer.png", cc.rect(4, 4, 4, 4));
            bg.setColor(cc.color(0,0,0));
            bg.setOpacity(200);
            bg.setPreferredSize(cc.size(900, 60));
            bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
            container.addChild(bg);
        }

        var extend = 30;
        var phienLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "time", cc.TEXT_ALIGNMENT_CENTER, 200);
        // phienLabel.setAnchorPoint(cc.p(0,0.5));
        phienLabel.setPosition(_arrPos[1]+extend, 33);
        phienLabel.setColor(cc.color(209,183,141));
        container.addChild(phienLabel);


        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "time", cc.TEXT_ALIGNMENT_CENTER, 120);
        timeLabel.setPosition(_arrPos[0]+30, 33);
        timeLabel.setColor(cc.color(209,183,141));
        container.addChild(timeLabel);
        // timeLabel.setAnchorPoint(cc.p(0,0.5));

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "time");
        bettingLabel.setPosition(_arrPos[2]+extend, timeLabel.y);
        bettingLabel.setColor(cc.color(209,183,141));
        container.addChild(bettingLabel);
        // bettingLabel.setAnchorPoint(cc.p(0,0.5));

        var lineLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "time");
        lineLabel.setPosition(_arrPos[3]+extend, timeLabel.y);
        lineLabel.setColor(cc.color(209,183,141));
        container.addChild(lineLabel);
        // lineLabel.setAnchorPoint(cc.p(0,0.5));

        var lineWinLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "time");
        lineWinLabel.setPosition(_arrPos[4]+extend, timeLabel.y);
        lineWinLabel.setColor(cc.color(209,183,141));
        container.addChild(lineWinLabel);
        // lineWinLabel.setAnchorPoint(cc.p(0,0.5));


        var receiewLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_20, "time");
        receiewLabel.setPosition(_arrPos[5]+extend, timeLabel.y);
        receiewLabel.setColor(cc.color(209,183,141));
        container.addChild(receiewLabel);
        // receiewLabel.setAnchorPoint(cc.p(0,0.5));


        container.timeLabel = timeLabel;
        container.accLabel = phienLabel;
        container.roomLabel = bettingLabel;
        container.betLabel = lineLabel;
        container.WinLabel = lineWinLabel;
        container.dercpLabel = receiewLabel;

        return container;
    },

});

var ItemHam = ccui.Widget.extend({
    ctor:function (data) {
        // 0 key , 1 vang, 2 ,3, 4
        this._super();
        this.setContentSize(122,98);
        this.setTouchEnabled(true);

        var hom = new cc.Sprite("#aoe_ham_item1.png");
        hom.setPosition(122/2,98/2);
        this.addChild(hom);
        hom.setVisible(true);
        this.hom = hom;
        var item = new cc.Sprite("#aoe_ham_item1.png");
        item.setPosition(122/2,98/2);
        item.setVisible(false);
        this.item = item;
        this.addChild(item);
        this.isCLick = true;
    },
    openHom:function (idItem, gold,numkey) {
        this.isCLick = false;
        this.hom.setVisible(false);
        this.item.setVisible(true);
        if(idItem == 0){
            this.item.setSpriteFrame("aoe_ham_item"+ (2 +numkey) + ".png");
        } else if(idItem == 1){
            this.item.setSpriteFrame("aoe_ham_item2.png");
            var lblMney =   cc.Label.createWithBMFont(cc.res.font.Font_money_26, cc.Global.NumberFormat1(parseInt(gold)));
            lblMney.setScale(0.8);
            // lblMney.setColor(cc.color(255,191,0));
            lblMney.setPosition(60,56);
            this.item.addChild(lblMney);
        } else {
            this.item.setSpriteFrame("aoe_ham_item3.png");
            var lblMney =   cc.Label.createWithBMFont(cc.res.font.Font_money_26, cc.Global.NumberFormat1(parseInt(gold)));
            lblMney.setScale(0.8);
            lblMney.setPosition(60,56);
            this.item.addChild(lblMney);
        }
    }
});

var DaoHam =  cc.Node.extend({
    ctor:function (data) {
        // 0 key , 1 vang, 2 ,3, 4
        this._super();
        this.initView(data);
        this.timeRemaining = 15;
        this.arrData = data;

        this.isTry = false;
        SceneNavigator.resizeEvent(this);
    },
    onCanvasResize : function () {
        // this.sceneLayer.y = cc.winSize.height - this.sceneLayer.height;
        // this._super();
        var scaleY = cc.winSize.height / this.bg.height;
        if(scaleY < 1.0){
            scaleY = 1.0;
        }
        this.bg.setScale(scaleY);
        this.bg.y = cc.winSize.height;
    },
    setTry:function(isTry){
        this.isTry = isTry;
        if(isTry){

        }
    },
    initView:function () {
        var thiz = this;
        this.arrItem = [];
        thiz.numberKey = 1;
        thiz.numberOpen = 10;

        var bg = new cc.Sprite("res/Texture/Aoe/aoe_bg.jpg");
        bg.setAnchorPoint(cc.p(0,1));

        // bg.setPosition(2000/2, 900/2);
        this.bg = bg;
        this.addChild(bg);
        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(2000, 900));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            // thiz.removeFromParent(true);
        });
        this.addChild(toucWidget);


        var khung = new cc.Sprite("res/Texture/Aoe/aoe_daovang_khung.png");
        khung.setPosition(2000/2, 900/2);
        // khung.setScale(cc.winSize.screenScale);
        this.addChild(khung);

        var lblLanChoi =  cc.Label.createWithBMFont(cc.res.font.Font_money_26,thiz.numberOpen.toString());// new cc.LabelTTF(thiz.numberOpen.toString(),cc.res.font.Font_money_26,28);
        lblLanChoi.setPosition(209,523);
        khung.addChild(lblLanChoi);
        thiz.lblLanChoi = lblLanChoi;

        var lblHeSo = cc.Label.createWithBMFont(cc.res.font.Font_money_26,"1");// new cc.LabelTTF("1",cc.res.font.Font_money_26,28);
        lblHeSo.setPosition(795,523);
        khung.addChild(lblHeSo);
        this.lblHeSo = lblHeSo;

        var butTim = new ccui.Button("aoe_ham_btnTim.png", "", "", ccui.Widget.PLIST_TEXTURE);
        butTim.setPosition(cc.p(764,58));




        khung.addChild(butTim);

        // var title = new cc.Sprite("#aoe_ham_title.png");
        // title.setPosition(2000/2, 900 - 40);
        // title.setScale(cc.winSize.screenScale);
        // this.addChild(title);

        this.arr24 = [];
        for(var i = 0; i < 24; i++){
            (function () {

                var inew = i;
                thiz.arr24.push(i);
                var itemHam = new ItemHam();
                itemHam.setPosition(162 + (i%6)*119,136+ Math.floor(i/6)*106);
                // sp.setScale(cc.winSize.screenScale);
                khung.addChild(itemHam);
                itemHam.addClickEventListener(function () {
                    thiz.openItem(inew);
                });
                thiz.arrItem.push(itemHam);
            })();
        }


        var isHaveClik = false;
        butTim.addTouchEventListener(function () {
            if(isHaveClik){return;};
            isHaveClik  = true;
            thiz.openHomRemain();
        });
        this.scheduleUpdate();
    },
    openHomRemain:function () {
        var thiz = this;
        var arrRan = [];
        for(var i = 0; i < thiz.arr24.length;i++){
            var  indexRan =  Math.floor(Math.random()*thiz.arr24.length);
            arrRan.push(thiz.arr24[indexRan]);
            thiz.arr24.splice(indexRan,1);
        }

        for(var i = 0; i <  arrRan.length;i++){
            thiz.openItem(arrRan[i]);
        }
        thiz.unscheduleUpdate();
        this.runAction(new cc.Sequence(new cc.DelayTime(2) , new cc.CallFunc(function () {
            thiz.removeFromParent();
        })));
    },
    createItemWin:function(idItem,money, isOpen){
        if(parseInt(money)!=0){
            var spritebg =  new cc.Sprite(isOpen?"#slot_bonus_item2.png":"#slot_bonus_hom1.png");
            spritebg.setTag(idItem);
            spritebg.setPosition( (idItem%6)*144 + 96 - 12, Math.floor(idItem/6)*144+ 86+7);
            var lbl = new cc.LabelTTF( cc.Global.NumberFormat1(parseInt(money)),cc.res.font.Roboto_CondensedBold,24);
            lbl.setPosition(70,-20);
            lbl.setColor(isOpen?cc.color(255,222,0,255):cc.color(127,127,127,255));
            spritebg.addChild(lbl);
            this.arrItemWin.push(spritebg);
            this.group1.addChild(spritebg);
        }
        else {
            var lbl = new cc.LabelTTF("Không có gì",cc.res.font.Roboto_CondensedBold,24);
            lbl.setPosition((idItem%6)*144 + 96 , Math.floor(idItem/6)*144+ 86+7-70);
            lbl.setColor(isOpen?cc.color(255,222,0,255):cc.color(127,127,127,255));
            this.arrItemWin.push(lbl);
            this.group1.addChild(lbl);
        }

    },
    createRandom:function () {
        var arrValuew = ["0","0","0","500000","500000","500000","500000","1000000","1000000","1000000","2000000","5000000"];
        this.arrValueTry = [];
        this.arr12 = [0,1,2,3,4,5,6,7,8,9,10,11];
        for(var i = 0; i < 12; i++){
            var index = Math.floor(cc.rand()%arrValuew.length);
            this.arrValueTry.push(arrValuew[index]);
            arrValuew.splice(index,1);
        }
        // cc.log("mang la" + arrNew.toString());
    },
    openAllItem:function (arrBonus, arrRandom) {

        var thiz = this;
        thiz.numSelect = 4;
        var totalMoney = 0;
        var totalTry = 0;
        for(var i = 0; i < arrBonus.length; i++){
            var isOpen = false;
            var isCreate = false;
            if(this.group1.getChildByTag(i) == null){
                isCreate =  true;
            }
            for(var j = 0; j < arrRandom.length; j++){
                if(arrRandom[j] == i){
                    totalMoney+= parseInt(arrBonus[i]);
                    if(isCreate  && thiz.isTry){
                        totalTry+= parseInt(arrBonus[i]);
                    }

                    isOpen = true;
                    break;
                }
            }
            if(isCreate)
            {
                this.createItemWin(i,arrBonus[i],isOpen);
            }


        }
        if(thiz.isTry){
            if(this._onBonusVitual){
                this._onBonusVitual(totalTry);
            }
        }
        for(var i = 0; i <    this.arrButton.length;i++){
            this.arrButton[i].setVisible(false);
        }
        this.lblTotal.setString(cc.Global.NumberFormat1(totalMoney));
        this.runAction(new cc.Sequence(new cc.DelayTime(2),new cc.CallFunc(function () {

            thiz.group2.setVisible(true);
        })));

    },

    openItem:function (id) {
        if( !this.arrItem[id].isCLick){
            return;
        }
        var thiz = this;
        thiz.numberOpen --;
        if(thiz.numberOpen==0){
            this.runAction(new cc.Sequence(new cc.DelayTime(2) , new cc.CallFunc(function () {
                thiz.removeFromParent();
            })));
        }
        if(thiz.numberOpen<0){
            return;
        }
        this.arr24.slice(id,1);
        thiz.lblLanChoi.setString(thiz.numberOpen.toString());
        var itemData= this.arrData[thiz.numberOpen];
        if(itemData["1"]==0){
            thiz.numberKey++;
            this.lblHeSo.setString(thiz.numberKey.toString());
            this.lblHeSo.setString(thiz.numberKey.toString());
        }

        this.arrItem[id].openHom(itemData[1],itemData[2],thiz.numberKey);

    },


    update : function (dt) {

        if(this.timeRemaining >= 0){
            this.timeRemaining -= dt;
            if(this.timeRemaining <=2 && this.numberOpen>0){
                this.openHomRemain();
            }
        }else {

            this.removeFromParent();
        }

    },

    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    }

});

var NumberSlotAoe  = cc.Sprite.extend({// ccui.Button.extend({
    ctor:function (s) {
        //  this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this._super("#aoe_bg_number2.png");
        var lblBel =  cc.Label.createWithBMFont(cc.res.font.Font_money_26,s);
        // lblBel.setColor(cc.color(95,115,217));
        lblBel.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2+3));
        this.addChild(lblBel);
        this.lblBel = lblBel;

    },
    visibleNew:function (isVisible) {
        //this.loadTextureNormal( (isVisible)?"slot_bg_number1.png":"slot_bg_number2.png",ccui.Widget.PLIST_TEXTURE) ;
        this.setSpriteFrame( (isVisible)?"aoe_bg_number2.png":"aoe_bg_number2.png") ;
        this.setOpacity( (isVisible)?255:80) ;
        this.lblBel.setOpacity( (isVisible)?255:80) ;
        // this.lblBel.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        // this.lblBel.setColor((isVisible)?cc.color(255,222,0):cc.color(95,115,217));
    },
});

var LINE_SLOT = [[1,4,7,10,13], [2,5,8,11,14],[0,3,6,9,12],[1,4,8,10,13],[1,4,6,10,13],
    [2,5,7,11,14],[0,3,7,9,12],[2,3,8,9,14],[0,5,6,11,12],[1,5,6,11,13],
    [0,4,8,10,12],[2,4,6,10,14],[1,3,7,11,13],[1,5,7,9,13],[0,4,7,10,12],
    [2,4,7,10,14],[1,3,6,9,13],[1,5,8,11,13],[0,3,7,11,14],[2,5,7,9,12]];

var ARR_BET_SLOT = [100,1000,10000];

var AoeScene = IScene.extend({
    ctor: function (indexBet,modePlay) {
        this.indexBet = indexBet;
        this._super();

        this.isHaveData = true;
        var thiz = this;
        this.isTry = false;
        this.isAutoRotate = false;
        var bg = new cc.Sprite("res/Texture/Aoe/aoe_bg.jpg");
        bg.setAnchorPoint(cc.p(0,1));
        this.addChild(bg,-1);
        this.bg = bg;
        this.sceneLayer.setContentSize(cc.size(2000, 900));
        this.arrButBet = [];
        this.initView();


        this.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*ARR_BET_SLOT[indexBet]));
        this.setTextWin("0");
        this.initController();
        this.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
      //  LoadingDialog.getInstance().show("Loading...");
        })));
        if(!modePlay){
            this._controller.sendJoinGame(indexBet+1);
        }

        this.enableAutoRotate(false);
        this.isFreeSpin = 0;


        this.goldOld = 0;

        thiz.setModePlay(modePlay);
        this.updateHuThuong();

        var jacpotEvent = new JackpotMultiplyEvent.GameIcon(GameType.GAME_AOE,indexBet+1);
        jacpotEvent.setPosition(800,cc.winSize.height);
        this.addChild(jacpotEvent,100);

        // var daoHam = new  DaoHam();
        // this.addChild(daoHam,3);


        // for(var i = 0; i < 200; i++){
        //   var aaa =    Math.floor(cc.rand()%12);
        //     cc.log(aaa);
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
    // onCanvasResize : function () {
    //     this._super();
    //     var scaleY = 900 / this.bg.height;
    //     this.bg.setScale(scaleY < 1 ? 1 : scaleY);
    //     this.bg.setPosition(0, 900);
    // },

    updateHuThuong:function () {
        if(!this.isTry)
            this.setTextHuThuong(JackpotEvent.getJackPot(GameType.GAME_AOE,ARR_BET_SLOT[this.indexBet]));
        // this.lblHu.setString(cc.Global.NumberFormat1(JackpotEvent.getJackPot(GameType.GAME_AOE,ARR_BET_SLOT[this.indexBet])));
    },
    addSpriteNodel:function () {
        var chum1 =  new cc.Sprite("#nodel_chum1.png");
        chum1.setPosition(cc.p(80,606));
        this.nodeTop.addChild(chum1);

        var chum2 =  new cc.Sprite("#nodel_chum1.png");
        chum2.setPosition(cc.p(1204,606));
        chum2.setScaleX(-1);
        this.bgSlot.addChild(chum2);

        var snowman =  new cc.Sprite("#noel_img1.png");
        snowman.setPosition(cc.p(1238,158));
        this.bgSlot.addChild(snowman,-1);

        var pine =  new cc.Sprite("#noel_img2.png");
        pine.setPosition(cc.p(38,171));
        this.bgSlot.addChild(pine,-2);
    },
    initView:function () {

        SoundPlayer.playSound("aoe_nhacnen",true);

        this.isNoHu = false;
        var thiz = this;

        var nodeBottom = new cc.Node();
        nodeBottom.setPosition(2000/2,133);

        // nodeBottom.setScale(cc.winSize.screenScale);
        nodeBottom.setContentSize(cc.size(1280,720));
        nodeBottom.setAnchorPoint(0.5,0);
        this.sceneLayer.addChild(nodeBottom);



        var bgBottom = new cc.Sprite("#aoe_bg_buttom.png");
        bgBottom.setPosition(bgBottom.getContentSize().width/2+2,131/2);
        this.bgBottom = bgBottom;
        nodeBottom.addChild(bgBottom);

        var bgkhung =  new cc.Sprite("res/Texture/Aoe/aoe_bg_khung.png");
        bgkhung.setPosition(cc.p(644,360));
        thiz.bg_khung = bgkhung;
        nodeBottom.addChild(bgkhung,-1);
        this.bgSlot = nodeBottom;


        var nodeTop = new cc.Node();
        nodeTop.setPosition(2000/2, 900);

        // nodeTop.setScale(cc.winSize.screenScale);
        nodeTop.setContentSize(cc.size(1280,720));
        nodeTop.setAnchorPoint(0.5,1);





        this.nodeTop = nodeTop;
        this.initTopBar();

        this.sceneLayer.addChild(nodeTop);

        var menuTop = new TopBarTouchLayer(true);
        menuTop.showGameTopBar(false);
        menuTop.setPositionY(40);
        thiz.menuTop = menuTop;
        this.sceneLayer.addChild(menuTop);
        menuTop.topBar.btn_back.addClickEventListener(function () {
            thiz.backButtonClickHandler();
        });

        menuTop.loginLayer.btn_back.addClickEventListener(function () {
            thiz.backButtonClickHandler();
        });


        var slotfui = new SlotFruit(5);
        slotfui.setPosition(cc.p(60,15));
        this.bg_khung.addChild(slotfui);
        var thiz = this;
        slotfui._finishedHandler = function () {
            thiz.onFinishQuay();
        };
        slotfui._playsoundStopItem = function () {
            SoundPlayer.playSound("aoe_stop");
        };
        this.slotfui = slotfui;
        var btnQuay = new ccui.Button("aoe_btn_rotate.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnQuay.setPosition(cc.p(1162,70));
        this.bgSlot.addChild(btnQuay,1);
        this.btnQuay = btnQuay;

        btnQuay.addClickEventListener(function () {
            thiz.enableAutoRotate(false);
            thiz.rotateRequest();
        });


        // var free_spin = new cc.Scale9Sprite("slot_bg_freeSpin.png",cc.rect(8, 8, 2, 2));
        // free_spin.setAnchorPoint(cc.p(0,0));
        // free_spin.setPosition(cc.p(-48, -2));
        // free_spin.setPreferredSize(cc.size(790 , 420));
        // slotfui.addChild(free_spin,-1);
        // free_spin.setVisible(false);
        // this.bg_free_spin = free_spin;

        var bg_choithu = new cc.Sprite("#aoe_bn_choithu.png");
        bg_choithu.setPosition(cc.p(30, 600));
        nodeBottom.addChild(bg_choithu);
        bg_choithu.setVisible(false);
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
                thiz._controller.sendGiveGold();
            }

        });

        var btnStop = new ccui.Button("aoe_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnStop.setPosition(btnQuay.getPosition());
        this.bgSlot.addChild(btnStop,1);
        btnStop.setVisible(false);
        this.btnStop = btnStop;

        btnStop.addClickEventListener(function () {
            thiz.handelStopButton();
        });


        var btnAuto = new ccui.Button("aoe_btn_autoRotate2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(cc.p(969,43));
        this.bgSlot.addChild(btnAuto);
        this.btnAuto = btnAuto;
        this.isAutoRotate = false;
        btnAuto.addClickEventListener(function () {
            thiz.clickAutoQuay();
        });
        var aaa = new BangThuong();

        thiz.sceneLayer.addChild(aaa,2);
        // aaa.setPosition(213,133);
        aaa.setVisible(false);
        thiz.bangThuong = aaa;

        // var bvd = new VinhDanh();
        // thiz.bgSlot.addChild(bvd,2);
        // bvd.setPosition(213,133);
        // bvd.setVisible(false);
        // thiz.vinhdanh = bvd;




        var btnTableReward = new ccui.Button("aoe_btn_bangthuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnTableReward.setPosition(cc.p(53,43));
        this.bgSlot.addChild(btnTableReward);
        btnTableReward.addClickEventListener(function () {
            aaa.setVisible(true);
        });

        // var top_thuong = new ccui.Button("aoe_btn_topReward.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // top_thuong.setScale(cc.winSize.screenScale);
        // top_thuong.setPosition(cc.p(69*cc.winSize.screenScale,900/2 + 40 ));
        // this.sceneLayer.addChild(top_thuong);
        // top_thuong.addClickEventListener(function () {
        //
        // });


        var btn20Row = new ccui.Button("aoe_btn_chonLine.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn20Row.setPosition(cc.p(158,56 ));
        this.bgSlot.addChild(btn20Row);

        // var bg_20_row = new cc.Sprite("#aoe_bg_btn_bet.png");
        // bg_20_row.setPosition(btn20Row.getContentSize().width/2,-18)
        // btn20Row.addChild(bg_20_row,-1);

        var lblRowNumber =  cc.Label.createWithBMFont(cc.res.font.Font_money_26,"20"); //new cc.LabelTTF("20", cc.res.font.Roboto_CondensedBold, 24);
        // lblRowNumber.setScale(1.2);
        // lblRowNumber.setColor(cc.color(204,204,204));
        lblRowNumber.setPosition(btn20Row.getContentSize().width/2,17+10);
        btn20Row.addChild(lblRowNumber);


        var btnNapVang = new ccui.Button("aoe_nap.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnNapVang.setPosition(cc.p(863,20));
        this.bgSlot.addChild(btnNapVang,1);
        this.btnNapVang = btnNapVang;
        btnNapVang.addClickEventListener(function () {
            SceneNavigator.showPaymentDialog();
            // var napvangpop = new NapVangLayer();
            // napvangpop.show();
        });

        this.btn20Row = btn20Row;

        this.lblRowNumber = lblRowNumber;

        // var lblDong = new cc.LabelTTF("DÒNG", cc.res.font.Roboto_CondensedBold, 24);
        // lblDong.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2-15);
        // btn20Row.addChild(lblDong);

        btn20Row.addClickEventListener(function () {
            if(thiz.isTry){
                MessageNode.getInstance().show("Không thể chọn dòng khi đang chơi thử");
                return;
            }
            thiz.selectLine.setVisible(true);
            thiz.enableAutoRotate(false);

        });


        // var aoe_bg_win = new cc.Sprite("#aoe_bg_win.png");
        // aoe_bg_win.setPosition(640,68);
        // this.bgSlot.addChild(aoe_bg_win);
        // this.aoe_bg_win = aoe_bg_win;


        this.initLabel();

        var btnX2 = new ccui.Button("aoe_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnX2.setPosition(cc.p(1060,150));
        this.bgSlot.addChild(btnX2);
        btnX2.setVisible(false);
        this.btnX2 = btnX2;

        var slot_btnx2_bg = new cc.Sprite("#aoe_btn_stop.png");
        slot_btnx2_bg.setPosition(cc.p(btnX2.getContentSize().width/2,btnX2.getContentSize().height/2));
        btnX2.addChild(slot_btnx2_bg);
        slot_btnx2_bg.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.5,30),
                new cc.FadeTo(0.5,255)
            )
        ));

        btnX2.addClickEventListener(function () {
            // SoundPlayer.playSound("DoubleOrNothing");
            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }

            thiz.enableAutoRotate(false);
        });



        this.initLine();



        // var dialogBg = new ccui.Scale9Sprite("aoe_bg_den.png", cc.rect(10,5,4,4));
        // dialogBg.setPreferredSize(cc.size(838,517));
        // dialogBg.setAnchorPoint(cc.p(0,0));
        // dialogBg.setPosition(223,133);
        var selectLine = new SelectLine();
        // selectLine.setPosition(213,133);
        this.sceneLayer.addChild(selectLine,3);
        selectLine._lineClickHandler = function () {
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

        };
        // selectLine._lineReconnect = function () {
        //     thiz.onSetTextBet();
        // },
        selectLine._clickOneLine = function (line,isShow) {
            thiz.arrNum[thiz.getLine(line+1)].visibleNew(isShow);
        };
        selectLine.setVisible(false);
        this.selectLine = selectLine;



        var wgFree = new ccui.Scale9Sprite("aoe_bg_remain_free.png", cc.rect(15, 15, 4, 4));
        wgFree.setPreferredSize(cc.size(500, 43));
        wgFree.setPosition(cc.p(640, 137));
        this.wgFree = wgFree;
        this.bgSlot.addChild(wgFree);
        wgFree.setVisible(false);

        var lblFree =  new cc.LabelTTF("0", cc.res.font.Roboto_Medium,30);
        lblFree.setPosition(wgFree.getContentSize().width/2,wgFree.getContentSize().height/2);
        lblFree.setColor(cc.color(243,202,114));
        wgFree.addChild(lblFree);
        this.lblFree = lblFree;

        this.slotfui.initRandom();

        var bg_vecuoc = new cc.Sprite("#aoe_bg_vecuoc.png");
        bg_vecuoc.setPosition(cc.p(this.bg_khung.width/2,this.bg_khung.height-70));
        this.bg_khung.addChild(bg_vecuoc,2);
        bg_vecuoc.setVisible(false);
        this.bg_vecuoc = bg_vecuoc;

        var lblFreeVongQuay =  new cc.LabelTTF("0", cc.res.font.Roboto_Medium,30);
        lblFreeVongQuay.setPosition(470,bg_vecuoc.getContentSize().height/2);
        lblFreeVongQuay.setColor(cc.color(243,202,114));
        bg_vecuoc.addChild(lblFreeVongQuay);
        this.lblFreeVongQuay = lblFreeVongQuay;







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

    },

    getLine:function (index) {
      for(var i = 0; i < LINE_SLOT_NUM.length; i++){
          if(LINE_SLOT_NUM[i] == index){
              return i;
          }
      }
        return 0;
    },

    enableAutoRotate:function (isEnable) {
        // this.setActiveBt(this.btnAuto,!isEnable);
        this.isAutoRotate = isEnable;
        this.btnAuto.loadTextureNormal(isEnable?"aoe_btn_autoRotate.png":"aoe_btn_autoRotate2.png",ccui.Widget.PLIST_TEXTURE);

    },

    rotateRequest:function () {


        if(SocketClient.getInstance().isLoggin() || this.isTry){
            this.sceneLayer.removeChildByTag(TAG_POPUP_JACKPOT);
            this.sceneLayer.removeChildByTag(TAG_POPUP_DAO_HAM);
            this.sceneLayer.removeChildByTag(TAG_POPUP_FREE);
            this.sceneLayer.removeChildByTag(TAG_POPUP_HOM);
            this.sceneLayer.removeChildByTag(TAG_POPUP_BigWIN);

            if(this.nodeBigWin != undefined && this.nodeBigWin != null){
                this.nodeBigWin.removeFromParent(true);
                this.nodeBigWin = null;
            }

            this.setTextWin("0");
            this.activeButtonNewGame(false);
            this.btnX2.setVisible(false);
            this.clearLineDraw();
            this.stopAllActions();

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

                    this._controller.sendRouteRequestTry(2,this.selectLine.getLines(), this.numberTry[randomTry]);
                    this.numberTry.splice(randomTry,1);
                }else {

                    this.isFreeSpin--;
                    if(this.isFreeSpin < 0){
                        this.isFreeSpin = 0;
                    }
                    this._controller.sendRouteRequestTry(2,this.selectLine.getLines(),-1);
                }
                if(this.isFreeSpin <=0){
                    this.setGoldVituarl(-10000*this.selectLine.getLines().length);
                    this.updateInforTry();
                }


            }
            else {
                this._controller.sendRouteRequest(this.indexBet,this.selectLine.getLines());
            }
            if( this._soundRotate != undefined &&  this._soundRotate != null){
                SoundPlayer.stopSoundLoop(this._soundRotate );
            }
            this._soundRotate =   SoundPlayer.playSoundLoop("aoe_quay");
        }else {
            MessageNode.getInstance().show("Bạn cần đăng nhập để sử dụng chức năng này!");
            this.enableAutoRotate(false);
            this.menuTop.showGameTopBar(true);
        }




    },
    rotateRequestFree:function (cheat) {
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
                g: "slot_20_0",
                p:{1:thiz.indexBet+1, 2:this.selectLine.getLines(),4:cheat}, // 111 bonuss 222 free 00000//no hu
                a:1501
            };
            SocketClient.getInstance().send(request);
        }
        if( this._soundRotate != undefined &&  this._soundRotate != null){
            SoundPlayer.stopSoundLoop(this._soundRotate );
        }
        this._soundRotate =   SoundPlayer.playSoundLoop("aoe_quay");


    },
    initLine:function () {
        this.arrLine = [];
        var thiz = this;
        for(var i = 0; i< 20;i++){
            var line = new cc.Sprite("#aoe_n_line" + (i+1).toString()+ ".png");
            line.setPosition(cc.p(line.getContentSize().width/2,line.getContentSize().height/2));
            line.setVisible(false);
            this.bg_khung.addChild(line,3);
            this.arrLine.push(line);
        }
        this.arrNum = [];
        for(var i = 0; i < 20; i++){
            (function () {
                var mLine = thiz.arrLine[LINE_SLOT_NUM[i] - 1];
                var buttonNumer = new NumberSlotAoe(LINE_SLOT_NUM[i].toString());
                buttonNumer.setMouseOverEnable();
                buttonNumer._onMouseOver = function (isOver) {
                    mLine.setVisible(isOver);
                };
                buttonNumer.setPosition(cc.p((i%2==0)?39:1027,518 - Math.floor(i/2)*50));
                thiz.bg_khung.addChild(buttonNumer);
                thiz.arrNum.push(buttonNumer);
                buttonNumer.visibleNew(true);
            })();
        }
    },
    setTextHuThuong:function (value) {

        this.lblHu.stopAllActions();
        var zz =  parseInt(value);
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

        var bgHu = new ccui.Button("aoe_bg_huthuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgHu.setPosition(cc.p(640,653));
        bgHu.setZoomScale(0);
        this.nodeTop.addChild(bgHu);



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

        var lblHu =   cc.Label.createWithBMFont(cc.res.font.Font_money_26,"0");
        // lblHu.setColor(cc.color(255,222,0,255));
        // lblHu.setAnchorPoint(cc.p(0,0.5));
        lblHu.setPosition(bgHu.getContentSize().width/2,89+5);
        lblHu.setScale(1.2);
        bgHu.addChild(lblHu);
        this.lblHu = lblHu;

        // var bgBet = new cc.Sprite("#aoe_bg_btn_bet.png");
        // bgBet.setPosition(cc.p(866,47));
        // this.bgSlot.addChild(bgBet);

        // var aoe_btn_bet = new cc.Sprite("#aoe_btn_bet.png");
        // aoe_btn_bet.setPosition(cc.p(866,86));
        // this.bgSlot.addChild(aoe_btn_bet);
        // this.aoe_btn_bet = aoe_btn_bet;

        // muc cuoc


        // var txtBet = new cc.LabelTTF("Tổng Cược:", cc.res.font.Roboto_Condensed,24);
        // txtBet.setColor(cc.color(186,194,249,255));
        // txtBet.setAnchorPoint(cc.p(1,0.5));
        // txtBet.setPosition(108,23);
        // this.txtBet = txtBet;
        // bgBet.addChild(txtBet);

        var lblBet = cc.Label.createWithBMFont(cc.res.font.Font_money_26,"0");
        // lblBet.setColor(cc.color(204,204,204));
        // lblBet.setAnchorPoint(cc.p(0,0.5));
        lblBet.setPosition(322,63);
        this.bgSlot.addChild(lblBet);
        this.lblBet = lblBet;

        // tien win
        // var bgWin = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        // bgWin.setPreferredSize(cc.size(220, 46));
        // bgWin.setPosition(cc.p(504+110,140));
        // this.bgSlot.addChild(bgWin);



        var lblWin =  cc.Label.createWithBMFont(cc.res.font.Font_money_26,"0");
        // lblWin.setColor(cc.color(204,204,204));
        // lblWin.setAnchorPoint(cc.p(1,0.5));
        lblWin.setPosition(535,34);
        this.bgSlot.addChild(lblWin);
        this.lblWin = lblWin;

        var lblID = new cc.LabelTTF("", cc.res.font.Roboto_CondensedBold,24);
        lblID.setColor(cc.color(225,177,255,255));
        lblID.setPosition(504,80);
        this.bgSlot.addChild(lblID);
        this.lblID = lblID;

        var lblSodu = cc.Label.createWithBMFont(cc.res.font.Font_money_26,"0");
        // lblSodu.setColor(cc.color(204,204,204));
        // lblSodu.setAnchorPoint(cc.p(1,0.5));
        lblSodu.setPosition(753,34);
        this.bgSlot.addChild(lblSodu);
        this.lblSodu = lblSodu;

        this._isViewGiftcode = false;

    },


    setModePlay:function (isTry) {
        var thiz = this;
        this.isTry = isTry;


        this.bg_choithu.setVisible(this.isTry);

        if(thiz.isTry)  {
            thiz.goldVitual = 50000000;
            thiz.numberTry = [0,1,2,3,4];

            thiz.setTextHuThuong("50000000");
            thiz.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*10000));
            thiz.updateInforTry();
            thiz.updateInforTry();
        }
        else {

            this.updateInfor();
            //this.setTextHuThuong(JackpotEvent.getJackPot(GameType.GAME_AOE,thiz.indexBet+1).toString());
            // thiz.setTextBet(cc.Global.NumberFormat1(thiz.selectLine.getLines().length*ARR_BET_SLOT[thiz.indexBet]));
            // thiz.setlectButtonBet(thiz.indexBet);
            // thiz.activeButtonNewGame(true);
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
        this.enableAutoRotate(false);
        this.indexBet = index;
        for(var i = 0; i< this.arrButBet.length;i++){
            var name = ((i==index)?"slot_bet_a":"slot_bet_d")+(i+1).toString()+".png";
            this.arrButBet[i].loadTextureNormal( name,ccui.Widget.PLIST_TEXTURE) ;
        }
        this.onSetTextBet();
        if(this.arrHuThuong.length > 2){
            this.setTextHuThuong(parseInt(this.arrHuThuong[index]));
        }
    },
    initTopBar:function () {
        var thiz = this;
        var backBt = new ccui.Button("aeo_btnclose.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var disBut = 83;
        backBt.setPosition(126, 683);
        this.nodeTop.addChild(backBt,1);
        backBt.addClickEventListener(function () {
            // thiz.menuTop.showGameTopBar(true);
            thiz.backButtonClickHandler();
        });

        // var settingBt = new ccui.Button("aoe_btn_setting.png", "", "", ccui.Widget.PLIST_TEXTURE);
        //
        // settingBt.setPosition(1220  ,backBt.y);
        // settingBt.addClickEventListener(function () {
        //     var settingDialog = new SettingDialog();
        //     settingDialog.showWithAnimationMove();
        // });
        // thiz.settingBt = settingBt;
        // this.nodeTop.addChild(settingBt);

        var hisBt = new ccui.Button("aoe_btnLS.png", "", "", ccui.Widget.PLIST_TEXTURE);

        hisBt.setPosition(1009, backBt.y);
        hisBt.addClickEventListener(function () {
            if(thiz.isTry){
                MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
            }
            else {
                var lichsupop = new AllLichSuLayer(GameType.GAME_AOE);
                lichsupop.show();
            }

        });
        this.nodeTop.addChild(hisBt,1);
        this.hisBt = hisBt;
        // var tutorialBt = new ccui.Button("aoe_btn_infor.png", "", "", ccui.Widget.PLIST_TEXTURE);
        //
        // tutorialBt.setPosition(1220 - 2*disBut, backBt.y);
        // tutorialBt.addClickEventListener(function () {
        //
        //
        // });
        // this.nodeTop.addChild(tutorialBt);
        // this.tutorialBt = tutorialBt;

        var bxhBt = new ccui.Button("aoe_btnRank.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bxhBt.setPosition(1168 , backBt.y);
        bxhBt.addClickEventListener(function () {

            // thiz.vinhdanh.setVisible(true);
            var bangvinhdanhpop = new AllBangVinhDanhLayer(GameType.GAME_AOE);
            bangvinhdanhpop.show();


            // SoundPlayer.playSound("mini_clickButton");
        });
        this.nodeTop.addChild(bxhBt,1);
        thiz.bxhBt = bxhBt;

        SceneNavigator.addBackKeyEvent(this);

    },
    exitToGame: function (message) {
        if(this._isViewGiftcode)
        {
            var homeScene = new HomeScene();
            homeScene._showGiftcode = true;
            SceneNavigator.replaceScene(homeScene);

        }
        else {
            var homeScene = new DeCheScene();
            SceneNavigator.replaceScene(homeScene);
            if (message) {
                MessageNode.getInstance().show(message, null, homeScene);
            }
            return homeScene;
        }


    },

    handleResuftZ:function(isReconnect,param){
        if(!isReconnect){
            this.runAction(new cc.Sequence(new cc.DelayTime(0.05), new cc.CallFunc(function () {
               //


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
        if(this.dataSlot["7"]){
            this.setFreeSpinVongQuay(this.dataSlot["7"]);
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
    handelStopButton:function () {
        this.enableAutoRotate(false);
        this.slotfui.stopNow(this.dataSlot["2"]);
    },
        setFreeSpin:function (number) {
        this.wgFree.setVisible(true);
        this.lblFree.setString("Lượt quay miễn phí còn : " + number.toString() + " lượt" );

        this.setActiveBt(this.btn20Row,number<=0);
    },
    setFreeSpinVongQuay:function (number) {
        if(number>0){
            this.bg_vecuoc.setVisible(true);
            this.lblFreeVongQuay.setString( number.toString() );
        }else {
            this.bg_vecuoc.setVisible(false);
        }



    },
    onFinishQuay:function () {
        var  thiz =  this;
        SoundPlayer.stopSoundLoop(thiz._soundRotate);

        var moneyWin =   parseInt(this.dataSlot["3"]["2"]);
        this.setTextWin(moneyWin);


        this.activeButtonNewGame(true);
        if(this.dataSlot["4"] > -1 ){
            thiz.setFreeSpin(this.dataSlot["4"]);
            this.wgFree.setVisible(this.dataSlot["4"]);

        }else {
            this.wgFree.setVisible(false);
        }
        if( this.dataSlot["3"]["5"] > 0){

            SoundPlayer.playSound("aoe_freespin");
            var popupFree = new AoePopupFree();
            popupFree.setTag(TAG_POPUP_FREE);
            popupFree.setContent(this.dataSlot["3"]["5"]);
            thiz.sceneLayer.addChild(popupFree);
            thiz.setFreeSpin(this.dataSlot["3"]["5"]);

        }


        var timeDaoHam = 0;
        if(this.dataSlot["3"]["6"]){
             var daoHam = new  DaoHam(this.dataSlot["3"]["6"]["1"]);
            daoHam.setTag(TAG_POPUP_DAO_HAM);

            SoundPlayer.playSound("aoe_Bonus");


            var popupHom= new AoePopupHom();
            popupHom.setTag(TAG_POPUP_HOM);
            var moneyDao = parseInt(this.dataSlot["3"]["6"]["2"]);

            popupHom.setContent( cc.Global.NumberFormat1(moneyDao));
            thiz.sceneLayer.addChild(popupHom,5);
            this.addChild(daoHam,5);
            timeDaoHam = 15;

        }
        if(this.isTry){
            if(this.dataSlot["3"]["4"]) {
                var yy = parseInt(this.lblHu.getString().replace(/[.,]/g, ''));
                this.setTextHuThuong(50000000);
                this.moneyJackpot = yy;
                moneyWin =   moneyWin +   yy;
            }
            if(this.dataSlot["3"]["6"]){
                var moneyDao = parseInt(this.dataSlot["3"]["6"]["2"]);
                thiz.setGoldVituarl(moneyDao);

            }
            if( this.dataSlot["3"]["5"] > 0){
                this.isFreeSpin += this.dataSlot["3"]["5"];
            }
            if(thiz.isFreeSpin>0){
                thiz.setFreeSpin(thiz.isFreeSpin);
            }

            this.setGoldVituarl(moneyWin);
            this.updateInforTry();
        }else{
            this.updateInfor();
        }
        if(this.dataSlot["3"]["4"]){
            this.updateHuThuong();
            this.showJackpot();
            this.enableAutoRotate(false);
        }
        //
        if(moneyWin> 200*ARR_BET_SLOT[(thiz.isTry)?2:this.indexBet] && !this.dataSlot["3"]["4"] )
        {
            this.onBigwin(moneyWin);


        }else  if(moneyWin>0){
            SoundPlayer.playSound("aoe_win");
        }


        this.btnStop.setVisible(false);


         this.runAction(new cc.Sequence(new cc.CallFunc(function () {
                thiz.showAllLineWin();
            }),
            new cc.DelayTime(this.isAutoRotate?1:1),
            new cc.CallFunc(function () {
               thiz.clearAllLine();
                }),
            new cc.CallFunc(function () {
                if(!thiz.isAutoRotate)
               thiz.showOneLine();
            })
              ));

        if(this.isAutoRotate){
            this.runAction(new cc.Sequence(new cc.DelayTime((this.dataSlot["3"]["1"].length>0?1.5:0.5) + timeDaoHam),new cc.CallFunc(function () {
                if(!thiz.isHaveData){
                    return;
                }
                if(thiz.isAutoRotate){

                    thiz.btnGive.setVisible(false);
                    thiz.rotateRequest();
                }

            })));

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
    showAllLineWin:function(){
        var obArrLine = this.dataSlot["3"]["1"];

        for(var i = 0; i < obArrLine.length  ; i++){
            var line = obArrLine[i];
            var idLine =  line["1"]-1;
            this.arrLine[idLine].setVisible(true);
            this.slotfui.showLineWin(idLine,line["3"]);
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
                        SoundPlayer.playSound("aoe_line");
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
            this.arrButBet[i].setVisible(true);
        }
    },
    clickAutoQuay:function () {
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
    },
    onBonus:function(idCard,type,moneyWin){

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

    _onKeyBackHandler : function () {

        this.backButtonClickHandler();
        return true;
    },

    setModeChoiThu:function () {

    },

    onEnter : function () {
        this._super();
        var thiz = this;
        this.scheduleUpdate();
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

        if(this.selectLine.isVisible() === true)
        {
            this.selectLine.setVisible(false);
            return true;
        }
        if(this.bangThuong.isVisible() === true)
        {
            this.bangThuong.setVisible(false);
            return true;
        }


        this.exitToGame();
        return true;

    },
    move4Chip:function (from, to) {
        // var distance = cc.pDistance(from,to);
        // var timeRun = distance/380;
        // SoundPlayer.playSound("mini_betchip");
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

        SoundPlayer.playSound("aoe_nohu1");
        SoundPlayer.playSound("aoe_nohu2");


        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(TAG_POPUP_JACKPOT);
        nodeJackpot.isCanRemove = false;
        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(2000, 900));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                nodeJackpot.removeFromParent();
        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        })));
        nodeJackpot.addChild(toucWidget);


        var jackpotSprite = new cc.Sprite("res/Texture/Aoe/aoe_bg_nohu.png");
        jackpotSprite.setPosition(2000/2, 900/2+100);
        nodeJackpot.addChild(jackpotSprite,1);
        var scale1 = new cc.ScaleTo(0.2,1,1) ;
        var scale2 = new cc.ScaleTo(0.2,0,1) ;

        jackpotSprite.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));
        // var effectXu = new cc.Sprite("#s1.png");
        // effectXu.setScale(1);
        // effectXu.setPosition(2000/2, 900/2);
        // nodeJackpot.addChild(effectXu);
        //
        //
        //
        //
        // var frames = [];
        // for(var i = 1; i < 20; i ++){
        //     frames.push(cc.spriteFrameCache.getSpriteFrame("s"+i.toString() +".png"));
        // }
        // var animation = new cc.Animation(frames, 0.04, 1);
        // var animateAction = new cc.Animate(animation);
        // var shakeAction = new cc.ScaleTo(0.25,1);
        // var thiz = this;
        // effectXu.runAction( new cc.RepeatForever(  animateAction ) );

        var goldMini = new  cc.ParticleSystem("res/Texture/hu_xubay.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        nodeJackpot.addChild(goldMini);

        this.sceneLayer.addChild(nodeJackpot,3);

        var lblHuno =  cc.Label.createWithBMFont("res/Texture/Aoe/fnt_aoe_win.fnt","0" );
        var action = new ext.ActionNumber(0.5, parseInt(this.moneyJackpot));
        lblHuno.runAction(action);

        lblHuno.setPosition(jackpotSprite.width/2, 380);
        lblHuno.setColor(cc.color(255,222,0,255));
        jackpotSprite.addChild(lblHuno);

    },
    activeButtonNewGame:function (isActive) {

        // this.setActiveBt(this.btnTry,isActive);
        this.setActiveBt(this.btn20Row,isActive);
        this.setActiveBt(this.btnQuay,isActive);
        if(!this.isTry){
            for(var  i = 0;i < this.arrButBet.length; i++)
                this.setActiveBt(this.arrButBet[i],isActive);
        }

    },
    onError:function(params){
        // SoundPlayer.stopAllSound();
        if( this._soundRotate != undefined &&  this._soundRotate != null){
            SoundPlayer.stopSoundLoop(this._soundRotate );
        }
        if(params["code"] == 102) {
            this.menuTop.showGameTopBar(true);
            // MessageNode.getInstance().show("Show popup login");
        }

            this.slotfui.clearAll();
            this.isHaveData = true;
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);
          this.btnAuto.loadTextureNormal("aoe_btn_autoRotate2.png",ccui.Widget.PLIST_TEXTURE);
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

        SoundPlayer.playSound("aoe_thanglon");
        var nodeJackpot = new cc.Node();
        nodeJackpot.setTag(TAG_POPUP_BigWIN);
        nodeJackpot.isCanRemove = false;
        var toucWidget = new ccui.Widget();
        toucWidget.setContentSize(cc.size(2000, 900));
        toucWidget.setAnchorPoint(cc.p(0.0, 0.0));
        toucWidget.setTouchEnabled(true);
        toucWidget.addClickEventListener(function () {
            if(nodeJackpot.isCanRemove)
                nodeJackpot.removeFromParent();
        });
        toucWidget.runAction(new cc.Sequence( new cc.DelayTime(2), new cc.CallFunc(function () {
            nodeJackpot.isCanRemove = true;
        })));
        nodeJackpot.addChild(toucWidget);


        var jackpotSprite = new cc.Sprite("res/Texture/Aoe/aoe_bg_bigwin.png");
        jackpotSprite.setPosition(2000/2, 900/2 + 80);
        nodeJackpot.addChild(jackpotSprite,1);
        // jackpotSprite.setScale(0.9);

        var scale1 = new cc.ScaleTo(0.2,1,1) ;
        var scale2 = new cc.ScaleTo(0.2,0,1) ;

        jackpotSprite.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1.05)
            )
        ));

        // var effectXu = new cc.Sprite("#s1.png");
        // effectXu.setScale(1);
        // effectXu.setPosition(2000/2, 900/2);
        // nodeJackpot.addChild(effectXu);
        //
        //
        //
        //
        // var frames = [];
        // for(var i = 1; i < 20; i ++){
        //     frames.push(cc.spriteFrameCache.getSpriteFrame("s"+i.toString() +".png"));
        // }
        // var animation = new cc.Animation(frames, 0.04, 1);
        // var animateAction = new cc.Animate(animation);
        // var shakeAction = new cc.ScaleTo(0.25,1);
        // var thiz = this;
        // effectXu.runAction( new cc.RepeatForever(  animateAction ) );

        var goldMini = new  cc.ParticleSystem("res/Texture/hu_xubay.plist");
        goldMini.setScale(2.5);
        goldMini.setPosition(cc.p(2000/2, 900/2));
        nodeJackpot.addChild(goldMini);

        this.sceneLayer.addChild(nodeJackpot,3);

        var lblHuno =  cc.Label.createWithBMFont("res/Texture/Aoe/fnt_aoe_win.fnt","0");// cc.Label.createWithBMFont(cc.res.font.Roboto_Medium_30, cc.Global.NumberFormat1(parseInt(this.moneyJackpot)));
        lblHuno.setPosition(jackpotSprite.width/2,100);
        lblHuno.setColor(cc.color(255,222,0,255));
        jackpotSprite.addChild(lblHuno);
        var action = new ext.ActionNumber(0.5, parseInt(moneyWin));
        lblHuno.runAction(action);




    },
    openAllLucky:function(arrBonus, arrRandom){
    //    this.bonusLucky.openAllItem(arrBonus, arrRandom);
    },
    openOneLucky:function(idItem, money){
      //  this.bonusLucky.openItem(idItem, money);
    },
    initController: function () {
        this._controller = new AoeController(this);
    }
});

