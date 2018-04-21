/**
 * Created by ext on 12/20/2016.
 */



var AoeGiftCode  = AoeScene.extend({
    ctor: function (indexBet,modePlay) {

        this._super(indexBet,modePlay);
        var bg_huCover = new cc.Sprite("#aoe_bg_ht_cover.png");
        bg_huCover.setPosition(cc.p(this.bgBottom.width/2,this.bgBottom.height/2));
        this.bgBottom.addChild(bg_huCover);


        var thiz = this;
        var thuathieu = 144;
        // this.bgSlot.setScale(cc.winSize.screenScale*0.8);
        var bg_tableCell = new cc.Sprite("#aoe_g_bg.png");
        bg_tableCell.setPosition(1111,355);
        this.bgSlot.addChild(bg_tableCell);



        thiz.bg_khung.setScale(0.9);
        thiz.bg_khung.setPosition(cc.p(479,337));


        var g_btn_hopqua = new ccui.Button("aoe_g_btn_hopqua.png", "", "", ccui.Widget.PLIST_TEXTURE);
        g_btn_hopqua.setPosition(cc.p(1017,683));
        g_btn_hopqua.addClickEventListener(function () {
            var hopquapop = new HopQuaGiftCode();
            hopquapop.show();
        });
        this.nodeTop.addChild(g_btn_hopqua);

        var g_btn_bxh = new ccui.Button("aoe_g_btn_bxh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        g_btn_bxh.setPosition(cc.p(1185,683));
        g_btn_bxh.addClickEventListener(function () {
            var bxhpop = new BXHGiftCode();
            bxhpop.show();
        });
        this.nodeTop.addChild(g_btn_bxh);

        // this.aoe_bg_win.setSpriteFrame("aoe_g_diem.png");

        this.hisBt.setVisible(false);

        this.bxhBt.setVisible(false);

        // this.btnQuay.setPosition(cc.p(1162,0));

        // this.btn20Row.loadTextureNormal("aoe_g_btn_luot.png",ccui.Widget.PLIST_TEXTURE);
        this.btn20Row.addClickEventListener(function () {

        });
        // this.aoe_btn_bet.setSpriteFrame("aoe_g_btn_xepHang.png");
        // this.btnAuto.setVisible(false);
        this.setActiveBt(this.btnAuto,false);
        this.setActiveBt(this.btnNapVang,false);


        var mSize = cc.size(321,410);
        this.arrHis = [];
        var listVd = new newui.ListViewWithAdaptor(mSize);
        listVd.setPosition(2 , 18);
        bg_tableCell.addChild(listVd);
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
        this.isGiftCode = 1;
        this.setTextHuThuong(500000);
        this.setTextBet(0);

        var lbl_time =   cc.Label.createWithBMFont(cc.res.font.Roboto_UTMAvoBold_24,"0");
        lbl_time.setPosition(183,491);
        lbl_time.setAnchorPoint(cc.p(0,0.5));
        bg_tableCell.addChild(lbl_time);
        this.lbl_time = lbl_time;
        this.timer = 0;

        // for(var i = 0; i < 20; i ++){
        //     var obj = {
        //
        //         top :  "100",//cc.Global.DateToString(new Date(time)),
        //         acc : "nickname16kituww",
        //         score : "1000000",
        //
        //     };
        //     this.arrHis.push(obj);
        // }

        this._isViewGiftcode = true;
        setTimeout(function () {
            SoundPlayer.playSound("aoe_nhacnen",true);
        },10);
    },

    pushData:function () {
        this.arrHis = [];
        for(var i = 0; i < 5; i ++){
            var obj = {

                top :  "100",//cc.Global.DateToString(new Date(time)),
                acc : "nickname16kitu",
                score : "1000",

            };
            this.arrHis.push(obj);
        }
        this.listVd.refreshView();
    },

    setTimeRemainGift:function (timeRemain) {
        this.timer = timeRemain;
        this.scheduleUpdate();
    },
    update:function (dt) {
        this.timer -= dt;
        if(this.timer>0){
            this.lbl_time.setVisible(true);
            var number = Math.floor(this.timer);
            var house = Math.floor(number/3600);
            var minute = Math.floor((number -  house*3600)/60);

            var second =  number - house*3600 - minute*60;
            var stringSecon = (second > 9)?second:"0"+second;
            var stringmin = (minute > 9)?minute:"0"+minute;
            var stringhou = (house > 9)?house:"0"+house;
            var stringTime = stringhou+  ":" + stringmin + ":" + stringSecon;
            this.lbl_time.setString(stringTime);
        }
        else {
            this.lbl_time.setVisible(false);
            this.unscheduleUpdate();
        }
    },
    updateTimeRemain:function (timeRemain, numberLuot) {
        this.lblRowNumber.setString(numberLuot);
        this.setTimeRemainGift(timeRemain);
    },
    resetLuot:function () {
        this.lblRowNumber.setString("0");
        this.arrHis = [];
        this.listVd.refreshView();
    },
    _setData : function (view, data) {

        view.topLabel.setString(data["top"]);
        var res = data["acc"];

        view.accLabel.setString(res);
        view.scoreLabel.setString(cc.Global.NumberFormat1(parseInt(data["score"])));


    },
    _createCell : function (lolNham) {

        // var _arrPos = [61, 211, 362, 477, 605, 733, 857];

        var container = new ccui.Widget();
        container.setContentSize(cc.size(321, 32));
        // if(lolNham){
        var bg = new cc.Sprite("#aoe_tranfer.png"); //new ccui.Scale9Sprite("aoe_tranfer.png", cc.rect(4, 4, 4, 4));
        // bg.setColor(cc.color(0,0,0));
        // bg.setOpacity(200);
        // bg.setPreferredSize(cc.size(260, 32));
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        container.addChild(bg);
        // }

        var extend = 30;
        var phienLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "10", cc.TEXT_ALIGNMENT_CENTER, 200);
        // phienLabel.setAnchorPoint(cc.p(0,0.5));
        phienLabel.setPosition(13+20, 16);
        // phienLabel.setColor(cc.color(209,183,141));
        container.addChild(phienLabel);


        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "nguyencong", cc.TEXT_ALIGNMENT_CENTER, 200);
        timeLabel.setPosition(134+20, 16);
        // timeLabel.setColor(cc.color(209,183,141));
        container.addChild(timeLabel);
        // timeLabel.setAnchorPoint(cc.p(0,0.5));

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "1111");
        bettingLabel.setAnchorPoint(1,0.5);
        bettingLabel.setPosition(282+20, timeLabel.y);
        // bettingLabel.setColor(cc.color(209,183,141));
        container.addChild(bettingLabel);
        // bettingLabel.setAnchorPoint(cc.p(0,0.5));




        container.topLabel = phienLabel;
        container.accLabel = timeLabel;
        container.scoreLabel = bettingLabel;


        return container;
    },
    setFreeSpin:function (number) {
        this.lblRowNumber.setString(number.toString());
    },

    onRefreshTop:function (arrPlayer) {
        this.arrHis = [];
        // this.listVd.removeAllChildren();
        for(var i = 0; i < arrPlayer.length; i ++){
            var obj = {

                top :  i+1,//cc.Global.DateToString(new Date(time)),
                acc : arrPlayer[i]["1"],
                score : arrPlayer[i]["2"],

            };
            this.arrHis.push(obj);
        }
        this.listVd.refreshView();
    },
    onFinishQuay:function () {
        this._super();
        cc.log("qqqqqqqqqqq");
        this.lblRowNumber.setString(this.dataSlot["6"]);
        var action = new ext.ActionNumber(0.5,parseInt(this.dataSlot["7"]));
        this.lblSodu.runAction(action);

        this.setTextBet(this.dataSlot["8"]);
        if(parseInt(this.dataSlot["3"]["2"])> 200*ARR_BET_SLOT[0] && !this.dataSlot["3"]["4"])
        {
            this.onBigwin(parseInt(this.dataSlot["3"]["2"]));


        }

    },
    updateInfor:function () {
        // if(this.isTry || !SocketClient.getInstance().isLoggin()){
        //     return;
        // }
        //
        // this.lblSodu.stopAllActions();
        // if(PlayerMe.gold <= this.goldOld){
        //     this.lblSodu.setString(cc.Global.NumberFormat1(PlayerMe.gold));
        // }else {
        //     this.goldOld = PlayerMe.gold;
        //     var zz =  cc.Global.NumberFormat1(parseInt(PlayerMe.gold));
        //
        //     if(parseInt(PlayerMe.gold)==0){
        //         this.lblSodu.setString("0");
        //     }
        //     else{
        //         var action = new ext.ActionNumber(0.5, PlayerMe.gold);
        //         this.lblSodu.runAction(action);
        //         // this.lblSodu.setString(cc.Global.NumberFormat1(PlayerMe.gold));
        //     }
        // }

    },

    rotateRequest:function () {


        if(SocketClient.getInstance().isLoggin() || this.isTry){
            this.sceneLayer.removeChildByTag(7777);
            this.sceneLayer.removeChildByTag(6666);
            this.sceneLayer.removeChildByTag(5555);
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
            this.menuTop.showGameTopBar(true);
        }




    },
    updateRankMe:function (number) {
        this.setTextBet(number);
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
    updateHuThuong:function () {
        this.setTextHuThuong(500000);
    },
    setFreeSpinVongQuay:function (number) {
        this.bg_vecuoc.setVisible(false);
    },
    onSetTextBet:function () {

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
                g: "gift_hunting",
                p:{1:thiz.indexBet+1, 2:this.selectLine.getLines(),4:cheat}, // 111 bonuss 222 free 00000//no hu
                a:1601
            };
            SocketClient.getInstance().send(request);
        }
        if( this._soundRotate != undefined &&  this._soundRotate != null){
            SoundPlayer.stopSoundLoop(this._soundRotate );
        }
        this._soundRotate =   SoundPlayer.playSoundLoop("aoe_quay");


    },
    initController: function () {
        this._controller = new GiftCodeController(this);
    }
});


