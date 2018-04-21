/**
 * Created by anhvt on 12/1/2016.
 */

var SamSolo = Sam.extend({
    ctor : function () {
        this._super();
        this._controller.isSolo = true;
    },
    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(417, 58);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(1000, 678);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0,1.0));
        this.playerView = [playerMe, player1];

        // var progressTimerBaoSam = new cc.ProgressTimer(new cc.Sprite("#player-progress-3.png"));
        // progressTimerBaoSam.setType(cc.ProgressTimer.TYPE_BAR);
        // progressTimerBaoSam.setMidpoint(cc.p(0.0, 0.5));
        // progressTimerBaoSam.setBarChangeRate(cc.p(1.0, 0.0));
        // progressTimerBaoSam.setPercentage(0);
        // progressTimerBaoSam.setPosition(cc.p(cc.winSize.width / 2, 220.0));
        // this.progressTimerBaoSam = progressTimerBaoSam;
        // this.sceneLayer.addChild(progressTimerBaoSam, 2);

        var cardRemaining1 = new CardRemaining();
        cardRemaining1.setPosition(99, 5);
        player1.infoLayer.addChild(cardRemaining1);
        player1.cardRemaining = cardRemaining1;

        for (var i = 1; i < this.playerView.length; i++) {
            var oneCardNotify = new cc.LabelBMFont("Báo 1", cc.res.font.Roboto_CondensedBold_30);
            oneCardNotify.setColor(cc.color("#ff0000"));
            oneCardNotify.setPosition(90, 110);
            this.playerView[i].infoLayer.addChild(oneCardNotify);
            oneCardNotify.setVisible(false);
            this.playerView[i].oneCardNotify = oneCardNotify;

            var oneNotifyBaoSam = new cc.LabelBMFont("Báo Sâm", cc.res.font.Roboto_CondensedBold_30);
            oneNotifyBaoSam.setColor(cc.color("#ff0000"));
            oneNotifyBaoSam.setPosition(80, 110);
            this.playerView[i].infoLayer.addChild(oneNotifyBaoSam);
            oneNotifyBaoSam.setVisible(false);
            this.playerView[i].oneNotifyBaoSam = oneNotifyBaoSam;
        }
    }
});