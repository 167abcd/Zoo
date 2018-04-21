/**
 * Created by ext on 12/20/2016.
 */
//var s_ChanLeLayer = null;

var VQ_ROTATE_NOMARL = 0;
var VQ_ROTATE_BEFORE = 1;
var VQ_ROTATE_TOSTOP = 2;

var VongQuayView = cc.Node.extend({
    isRunning:false,
    ctor: function (name) {
        this._super();

        var vong_quay = new cc.Sprite(name);
        this.addChild(vong_quay);

        this.vongquay = vong_quay;
        this.isRunning = false;
        this.accelerate = 9000.0;
        this.spin = 1.0;


        // this.startWithSpeed(1000);
        // var delay = new cc.DelayTime(6);
        // var orderAgain = new cc.CallFunc(function () {
        //     thiz.stopAtRotate(70);
        // });
        // thiz.runAction(new cc.Sequence(delay, orderAgain));



    },


    onFinishedRotate:function () {
        this.isRunning = false;

        if(this._onFinishedRotate){
            this._onFinishedRotate();
        }

        },

    startWithSpeed:function (speed) {
        this.accelerate = 400.0;
        if (!this.isRunning){
            this.isRunning = true;
            this.rotateSpeed = Math.abs(speed);
            if(speed > 0){
                this.spin = 1.0;
            }
            else{
                this.spin = -1.0;
            }
            //this.spin = -1.0;
            this._status = VQ_ROTATE_NOMARL;
        }
    },
    stopForce:function (rotate) {
        this.vongquay.setRotation(rotate);
        this.onFinishedRotate();
    },
    stopAtRotate:function (rotate) {
        // if(!this.running){
        //
        // }
        if (this._status === VQ_ROTATE_NOMARL){
            var a = this.vongquay.getRotation();
            var ds = rotate - a;
            if(this.spin > 0){
                while (ds < 0){
                    ds += 360.0;
                }
            }
            else{
                while (ds > 0){
                    ds -= 360.0;
                }
            }
            ds = Math.abs(ds);

            this.rotateToStop = 0.5*this.rotateSpeed*this.rotateSpeed / this.accelerate;
            this.rotateBeforeStop = ds -  this.rotateToStop;
            while (this.rotateBeforeStop <= 0){
                this.rotateBeforeStop += 360.0;
            }
            this._status = VQ_ROTATE_BEFORE;
        }
    },
    update:function (dt) {
        if (this.isRunning){
            switch (this._status)
            {
                case VQ_ROTATE_NOMARL:
                    this.updateRotateNormal(dt);
                    break;
                case VQ_ROTATE_BEFORE:
                    this.updateRotateBeforeStop(dt);
                    break;
                case VQ_ROTATE_TOSTOP:
                    this.updateRotateToStop(dt);
                    break;
            }
        }
    },
    updateRotateToStop:function (time) {
        var dt = time;
        var dv = this.accelerate*dt;
        if (dv >= this.rotateSpeed){
            dt = this.rotateSpeed / this.accelerate;
            this.isRunning = false;
        }

        var ds = this.rotateSpeed* dt - dv*dt / 2;
        if (ds >= this.rotateToStop){
            ds = this.rotateToStop;
            this.isRunning = false;
        }

        this.rotateToStop -= ds;
        this.rotateSpeed -= dv;

        var rotate = this.vongquay.getRotation() + ds * this.spin;
        while(Math.floor(rotate) > 360){
            rotate -= 360 * this.spin;
        }
        // if (rotate > 360.0){
        //     rotate -= 360.0;
        // }
        this.vongquay.setRotation(rotate);

        if (!this.isRunning){
            this.onFinishedRotate();
        }
    },
    updateRotateBeforeStop:function (dt) {
        var ds = this.rotateSpeed*dt;
        if (ds >= this.rotateBeforeStop){
            ds = this.rotateBeforeStop;
            this._status = VQ_ROTATE_TOSTOP;
        }
        this.rotateBeforeStop -= ds;

        var rotate = this.vongquay.getRotation() + ds * this.spin;
        while(Math.floor(rotate) > 360){
            rotate -= 360 * this.spin;
        }
        // if (rotate > 360.0){
        //     rotate -= 360.0;
        // }
        this.vongquay.setRotation(rotate);
    },

    updateRotateNormal:function (dt) {
        var rotate = this.vongquay.getRotation() + this.rotateSpeed * dt * this.spin;
        while(Math.floor(rotate) > 360){
            rotate -= 360 * this.spin;
        }
        // if (rotate > 360.0){
        //     rotate -= 360.0;
        // }
        this.vongquay.setRotation(rotate);
    },
    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    }

});

var VongTo = VongQuayView.extend({
    ctor: function (name) {
        this._super(name);
        var thiz = this;
        this.arrPiece = [];
        // for(var i = 0; i< 12;i++){
        //     var sp = new cc.Sprite("#vq_to"+i.toString()+".png");
        //     sp.setPosition(cc.p(sp.getContentSize().width/2,sp.getContentSize().height/2));
        //     thiz.arrPiece.push(sp);
        //     thiz.vongquay.addChild(sp);
        //     this.arrPiece[i].setVisible(false);
        // }

    },
    onFinishedRotate:function () {
        this._super();
        // for(var i = 0; i < this.arrPiece.length;i++){
        //         // this.arrPiece[i].setVisible((i== this.indexStop)?true:false);
        //     this.arrPiece[i].setVisible((i== this.indexStop)?true:false);
        // }
        // this.getParent().getParent().onFinishedRotate();
    },
    stopAtRotate:function (rotate) {
        this._super(rotate);
        this.indexStop = Math.floor(rotate/30);
    },
    resetVongQuay:function () {
        for(var i = 0; i < this.arrPiece.length;i++){
            this.arrPiece[i].setVisible(false);
        }
    }

});




var VongNho = VongQuayView.extend({
    ctor: function (name) {
        this._super(name);
        var thiz = this;
        this.piece = 7;
        this.arrPiece = [];
        this.touchRect = cc.rect(-this.vongquay.getContentSize().width/2,-this.vongquay.getContentSize().height/2,this.vongquay.getContentSize().width,this.vongquay.getContentSize().height);
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan: function (touch, event) {
        //         return thiz.onTouchBegan(touch, event);
        //     }
        //
        // }, thiz.vongquay);

        // for(var i = 0; i< 8;i++){
        //     var sp = new cc.Sprite("#vqnho_n"+i.toString()+".png");
        //     sp.setPosition(cc.p(sp.getContentSize().width/2,sp.getContentSize().height/2));
        //     thiz.arrPiece.push(sp);
        //     thiz.vongquay.addChild(sp);
        //     this.arrPiece[i].setVisible(false);
        // }
        // this.arrPiece[7].setVisible(true);
    },
    getIdPiece:function () {

            return  ID_VONG_NHO[this.piece];

    },
    onTouchBegan: function (touch, event) {

        var p = this.convertToNodeSpace(touch.getLocation());

        // var rect = this.getBoundingBox();
        if (cc.rectContainsPoint(this.touchRect, p)) {


           if(!this.isRunning){
               //cc.log("vao vong"+ cc.radiansToDegrees(cc.pAngleSigned(cc.p(1,0),p)));
               var p1 = this.vongquay.convertToNodeSpace(touch.getLocation());
               var p2 = cc.p(this.vongquay.getContentSize().width/2, this.vongquay.getContentSize().height/2);
               var p3 = cc.pSub(p1, p2);

               var gocTouch = cc.radiansToDegrees(cc.pAngleSigned(cc.p(1,0),p3) );
               if(gocTouch<0){
                   gocTouch += 360;
               }
               gocTouch += 45/2;
               var angle = Math.floor((gocTouch%360)/45) ;
               //var angle = Math.floor((-this.vongquay.getRotation()%360 )/45);
               // var total = 8;
               // if(angle> 0){
               //     total =  7;
               // }
               // var gocNew =  (total - angle) + gocTouch;
               // if(gocNew>7){
               //     gocNew = gocNew - 8;
               // }
               this.piece = angle;
               cc.log("gocNew: " + angle);
               for(var i = 0; i < this.arrPiece.length;i++){
                   this.arrPiece[i].setVisible((i== angle)?true:false);
               }
           }

            return true;
        }

        return false;
    },
    resetVongQuay:function () {
        // this.piece = -1;
        for(var i = 0; i < this.arrPiece.length;i++){
            this.arrPiece[i].setVisible(false);
        }
    }
});
//               them luot, 2 poker, 5 pokerm ,50 vip point, 20 vip,10 vip, 1 ve 25, 2 ve 25, 1 ve 20,  2 ve 20, truot, the cao
var ID_VONG_TO = [0   ,   1,2,3,4,5,6,7,8,9,10,11];
var NAME_VONG_TO = ["100 Bin"    ,"Thêm Lượt" ,"2 vé Minipoker 100"    ,"5 vé Minipoker 100" ,   "Thẻ Viettel 100K"    ,"1 vé KTT 100" ,
    "1 vé Long Cung 100"   , "Thẻ Viettel 500K"  , "1 Vip Point"     ,  "10 Vip Point"      ,  "Thẻ Viettel 200K" ,   "Thẻ Viettel 50K"    ];


//             1k,500,them, 100exp,100k,50k, 10k,5k,
var ID_VONG_NHO = [102      ,101,108    ,107  ,106 ,105      ,104      ,103  ];

//                  truot   100k  50k   20k     10k       5k    2k      1k
var ID_VONG_NHO2 = [2,1,0,7,6,5,4,3];
var Name_VONG_NHO = ["500 Bin","100 Bin","Trượt"  ,"500,000 Bin","200,000 Bin" ,"100,000 Bin"  ,"10,000 Bin"  ,"2000 Bin"  ];



var ID_VONG_NGOAI = [0  ,7,6,5,4,3,2,1];
var NAME_VONG_NGOAI = [ "68 Bin","Trượt"  ,"Thẻ Viettel 200K","5 VipPoint","868 Bin","668 Bin","468 Bin","268 Bin"];

var VongQuayLayer = MiniGamePopup.extend({
    ctor: function () {

        this._super();
        this.setScale(1);
        this.arrVongTo = [];
        this.arrVongNho = [];
        this.arrBuy = [];
        this.pieceIndex = -1;
        this.soLuot = 0;
        this.luotConlau = 0;

        var thiz = this;
        this.isQUay = false;
        var bg = new ccui.Widget();

        bg.setContentSize(952,516);
        bg.setPosition(cc.p(952/2,516/2));
        // bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize( 952 ,516);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this._boudingRect = cc.rect(0, 0, 952, 516);
        // var bg_right = new cc.Sprite("#vq_bg_right.png");
        // bg_right.setPosition(540,539);
        // bg.addChild(bg_right);
        thiz.indexVongTo = 0;
        thiz.indexVongNgoai = 0;
        thiz.indexVongNho = 0;

        var vongngoai =  new VongTo("#vongquay_to2.png");
        vongngoai.setPosition(227,516/2);
        bg.addChild(vongngoai);
        this.vongngoai = vongngoai;
        vongngoai._onFinishedRotate = function () {

            // thiz.showPopupResuft(thiz.indexVongTo,thiz.indexVongNho);
            // thiz.onUpdateLuot(thiz.luotConlau);
            // SocketClient.getInstance().postEvent("refreshAsset", {});
        };
        var sp_quay = new cc.Sprite("#vong_bt2.png");
        sp_quay.setPosition(227,516/2);
        bg.addChild(sp_quay);
        var vongto =  new VongTo("#vongquay_to.png");
        vongto.setPosition(694,516/2);
        bg.addChild(vongto);
        this.vongto = vongto;
        vongto._onFinishedRotate = function () {

            thiz.showPopupResuft(thiz.indexVongTo,thiz.indexVongNho,thiz.indexVongNgoai);
            thiz.onUpdateLuot(thiz.luotConlau);
            SocketClient.getInstance().postEvent("refreshAsset", {});
        };




        var vongnho =  new VongNho("#vongquay_nho.png");
        vongnho.setPosition(694,516/2);
        bg.addChild(vongnho);
        this.vongnho = vongnho;

        var kim =  new cc.Sprite("#vongquay_arrow.png");
        kim.setPosition(cc.p(694,516));
        bg.addChild(kim);


        var kim2 =  new cc.Sprite("#vongquay_arrow.png");
        kim2.setPosition(cc.p(227,479));
        bg.addChild(kim2);

        // var Ligth =  new cc.Sprite("#vq_den.png");
        // Ligth.setPosition(cc.p(bg.width/2,bg.height/2));
        // bg.addChild(Ligth);




        var rotateBt = new ccui.Button("vongquay_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rotateBt.setPosition(vongnho.getPosition());
        bg.addChild(rotateBt);
        rotateBt.addClickEventListener(function () {

            if(!thiz.isQUay){
                return;
            }

            if(thiz.luotConlau<1){
                MessageNode.getInstance().show("Bạn đã hết số lượt quay trong ngày");
            }else {
                var xacnhanvongquay = new XacNhanCapchaDialog();
                xacnhanvongquay.isClickXacNhan = function () {
                    thiz.setActiveBt(rotateBt,false);
                    thiz.vongto.resetVongQuay();
                    thiz.vongto.startWithSpeed(1000);
                    thiz.vongnho.startWithSpeed(-1000);
                    thiz.vongngoai.startWithSpeed(1000);
                    thiz.indexVongTo = -1;
                    thiz._controller.sendRotate(xacnhanvongquay.input_capcha.getText(), xacnhanvongquay.captchaView.captchaKey);
                    xacnhanvongquay.hide();

                },
                    xacnhanvongquay.show();
            }


        });
        // thiz.setActiveBt(rotateBt,true);

        this.rotateBt = rotateBt;

        // var den_leg = new cc.Sprite("#vd_den1.png");
        // den_leg.setPosition(bg.width/2,bg.height/2);
        // bg.addChild(den_leg);
        // den_leg.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(0.1), new cc.CallFunc(function () {
        //         den_leg.setSpriteFrame("vd_den1.png");
        // }),
        //     new cc.DelayTime(0.1),
        //         new cc.CallFunc(function () {
        //             den_leg.setSpriteFrame("vd_den2.png");
        //         }),
        //         new cc.DelayTime(0.1),
        //             new cc.CallFunc(function () {
        //                 den_leg.setSpriteFrame("vd_den3.png");
        //             })
        // )));

        var lblLuot = new cc.LabelTTF("0",cc.res.font.Roboto_Condensed,18);
        lblLuot.setColor(cc.color(0,0,0,255));
        lblLuot.setPosition( cc.p(rotateBt.getContentSize().width/2,rotateBt.getContentSize().height/2-33));
        rotateBt.addChild(lblLuot);
        this.lblLuot = lblLuot;


        // var btnRank = new ccui.Button("vq_rank.png","","",ccui.Widget.PLIST_TEXTURE);
        //
        // btnRank.setPosition(cc.p(156+50, 229));
        // btnRank.addClickEventListener(function () {
        //     var bangvinhdanhpop = new AllBangVinhDanhLayer(GameType.MiniGame_Vong_Quay_May_Man);
        //     bangvinhdanhpop.show();
        //
        // });
        // bg_right.addChild(btnRank);

        var btnClose = new ccui.Button("vq_close.png","","",ccui.Widget.PLIST_TEXTURE);

        btnClose.setPosition(cc.p(838, 505));
        btnClose.addClickEventListener(function () {
            thiz.closeButtonHandler();

        });
        bg.addChild(btnClose);


        var btnHis = new ccui.Button("vq_lichsu.png","","",ccui.Widget.PLIST_TEXTURE);

        btnHis.setPosition(cc.p(899, 462));
        btnHis.addClickEventListener(function () {
            if(thiz.isTry){
                MessageNode.getInstance().show("Chỉ hỗ trợ ở chế độ chơi thật");
            }
            else {
                var lichsupop = new AllLichSuLayer(GameType.MiniGame_Vong_Quay_May_Man);
                lichsupop.show();
            }

        });
        bg.addChild(btnHis);

        var vq_bgpopup = new cc.Sprite("#vq_bgpopup.png");
        vq_bgpopup.setPosition(bg.width/2,321);
        bg.addChild(vq_bgpopup);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if (vq_bgpopup.isVisible() ) {
                    vq_bgpopup.setVisible(false);
                    thiz.lblVongNho.setString("");
                    thiz.lblVongTo.setString("");
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {

            },
            onTouchMoved: function (touch, event) {


            }
        }, vq_bgpopup);
        this.vq_bgpopup = vq_bgpopup;
        vq_bgpopup.setVisible(false);

        var lblVongTo = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold ,30);
        lblVongTo.setColor(cc.color(255,222,0,255));
        lblVongTo.setPosition( cc.p(vq_bgpopup.getContentSize().width/2,147));
        vq_bgpopup.addChild(lblVongTo);
        this.lblVongTo = lblVongTo;



        var lblVongNgoai = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold ,30);
        lblVongNgoai.setColor(cc.color(255,222,0,255));
        lblVongNgoai.setPosition( cc.p(vq_bgpopup.getContentSize().width/2,58));
        vq_bgpopup.addChild(lblVongNgoai);
        this.lblVongNgoai = lblVongNgoai;

        var lblchucmung = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold ,35);
        // lblchucmung.setColor(cc.color(204,59,46,255));
        lblchucmung.setPosition( cc.p(vq_bgpopup.getContentSize().width/2,197));
        lblchucmung.setString("Chúc mừng bạn nhận được");
        vq_bgpopup.addChild(lblchucmung);



        var lblVongNho = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold,30);
        lblVongNho.setColor(cc.color(255,222,0,255));
        lblVongNho.setPosition( cc.p(vq_bgpopup.getContentSize().width/2,104));
        vq_bgpopup.addChild(lblVongNho);
        this.lblVongNho = lblVongNho;




    },

    showPopupResuft:function (indexVongto, indexVongNho,indexVongNgoai) {

        var thiz = this;
        setTimeout(function () {

            thiz.setActiveBt(thiz.rotateBt,true);
            if(indexVongto > -1){
                thiz.vq_bgpopup.setVisible(true);
                thiz.lblVongNho.setString("Vòng nhỏ: " + Name_VONG_NHO[indexVongNho]);
                thiz.lblVongTo.setString("Vòng to: " + NAME_VONG_TO[indexVongto]);
                thiz.lblVongNgoai.setString("Vòng ngoài: " + NAME_VONG_NGOAI[indexVongNgoai]);
            }

        }, 1500);

    },
    setActiveBt : function(btn,enabled){
        this.isQUay = enabled;
        // btn.setBright(enabled);
        btn.loadTextureNormal(enabled?"vongquay_bt.png":"vongquay_bt_2.png",ccui.Widget.PLIST_TEXTURE);
        // btn.setEnabled(enabled);
    },


    onFinishedRotate:function () {
      cc.log("onFinishedRotate");
    },
    onUpdateLuot:function (soLuot) {

        this.luotConlau = soLuot;
        this.lblLuot.setString(soLuot.toString());
        this.setActiveBt(this.rotateBt,soLuot>0?true:false);
        this.isQUay = true;

    },

    getIndexVongTo:function (index) {
        var aaa = ID_VONG_TO.length;
        for(var i= 0; i < ID_VONG_TO.length ;i++ ){
            if(ID_VONG_TO[i] == index)
            {
                return  i;
            }
        }
      return  -1;
    },
    getIndexVongNgoai:function (index) {
        var aaa = ID_VONG_NGOAI.length;
        for(var i= 0; i < ID_VONG_NGOAI.length ;i++ ){
            if(ID_VONG_NGOAI[i] == index)
            {
                return  i;
            }
        }
        return  -1;
    },


    getIndexVongNho:function (index) {
        for(var i=0; i < ID_VONG_NHO2.length ;i++ ){
            if(ID_VONG_NHO2[i] == index)
            {
                return  i;
            }
        }
        return  -1;
    },
    handelResuft:function (idVongNho,idVongTo,idVongNgoai, luotConlau) {
        var index =  this.getIndexVongTo(idVongTo);
        if(index==-1){
            return;
        }
        this.vongto.stopAtRotate(index*30 - 15);

        var index2 = this.getIndexVongNho(idVongNho);
        if(index2==-1){
            return;
        }
        this.vongnho.stopAtRotate(index2*45  - 22.5);

        var index3 =  this.getIndexVongNgoai(idVongNgoai);
        if(index3==-1){
            return;
        }
        cc.log("index vong quay "+ index3);
        this.vongngoai.stopAtRotate(index3*45 - 22.5);


        this.indexVongNho = index2;
        this.indexVongTo = index;
        this.indexVongNgoai = index3;
        this.luotConlau = luotConlau;
    },
    buyLuot:function (index) {

        if(this.arrBuy.length == 0){
            return;
        }
        var thiz = this;
        // var dialog = new MessageConfirmDialog();
        // dialog.setMessage("Bạn có muốn mua không ?");
        // dialog.showWithAnimationScale();
        // dialog.okButtonHandler = function () {
        //
        // };
        thiz._controller.sendBuyRotate(thiz.arrBuy[index]);
    },
    setBettingSelectEnable : function (enable) {
    },
    initChip: function (centerPosition) {

    },

    onError:function(params){
        var thiz = this;
        SoundPlayer.stopAllSound();
        if(this.vongnho.isRunning){
            this.vongto.stopForce(0);
            this.vongnho.stopForce(0);
            this.vongngoai.stopForce(0);
        }

        // }
    },
    onEnter: function () {
        this._super();
        // this.timer = 0;
        // this.scheduleUpdate();
        //s_ChanLeLayer = this;
        var thiz = this;
    },

    handelJoinGame:function (arrVongNho,arrVongTo,arrBet) {

        this.arrVongTo = [];
        this.arrVongNho = [];
        this.arrBuy = [];

        for(var i = 0; i < arrVongNho.length; i++){
            this.arrVongNho.push(arrVongNho[i][1]);
        }
        for(var i = 0; i < arrVongTo.length; i++){
            this.arrVongTo.push(arrVongTo[i][1]);
        }
        for(var i = 0; i < arrBet.length; i++){
            this.arrBuy.push(arrBet[i][1]);
        }
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_ChanLeLayer = null;
    },

    initController: function () {
        this._controller = new VongQuayController(this);
    },

});



