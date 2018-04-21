/**
 * Created by ext on 12/20/2016.
 */

var SlotItem = ccui.Widget.extend({

    ctor: function () {

        this._super();
        this.moveSpeed =  2000.0;
        this.isStop = false;
        this.YStop = -100000.0;
        this.isRunning = false;
        this.idItem = -1;
        this.isStopNow = false;
        this.biendo = 30;


    },
    createItem:function (i,j,lastY) {
        var padding = 0;//18.5;
        this.distance2Item = this.disHCell;
        var xItem = (i+0.5)*this.itemWidth;
        this.maxY = 3*this.disHCell + this.disHCell/2+ padding;
        this.minY = -this.disHCell/2;
        if(lastY!=0){
            this.minY = j*this.disHCell + this.disHCell/2 + padding;
        }
        var   yItem = j*this.disHCell+lastY + this.disHCell/2 + padding;
        if(lastY!=0){
            yItem = j*this.disHCell+lastY   + padding;
        }
        this.setPosition(cc.p(xItem,yItem));


        this.isRunning = true;
    },

    stop:function (distance) {
        this.moveSpeed = 2000;
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

    update:function (dt) {

        if(!this.isRunning){
            return;
        }
        // // chuyen dong deu
        // var y = this.getPositionY() - this.moveSpeed*dt;
        //
        // if(y <= this.minY){
        //         if (this.isStop) {
        //             //remov
        //             this.isRunning = false;
        //             var delta =  y - this.minY;
        //             y = y - delta;
        //         }
        //         else
        //         {
        //             var delta =  y - this.minY;
        //             y = this.maxY + delta;
        //         }
        // }
        // this.setPositionY(y);
        // if( y <= this.YStop)
        // {
        //     this.isRunning = false;
        // }
        // chuyen dong deu


        // chuyen dong giam dan deu
        if (this.isStop) {
            var thiz = this;
            this.timeElapsed += dt;
            if(this.timeElapsed >= this.maxTime){
                this.timeElapsed = this.maxTime;
                this.isRunning = false;
                if(this.idItem == this.soCot*3){
                    cc.log("finish");
                    // cc.director.getCurrentScene()
                    if(this._finishedHandler){
                        this._finishedHandler();
                    }
                }
                if(((this.idItem - 1) % 3) == 0){
                    cc.log("finish" + this.idItem);
                    if(this._playsoundStopItem){
                        this._playsoundStopItem();
                    }
                }
                // if(this.idItem%3 == 0 && !this.isStopNow ){
                //     if(this._playsoundStopItem){
                //         this._playsoundStopItem();
                //     }
                //
                //     // SoundPlayer.playSound("slot_stop");
                // }else  if(this.idItem == 15) {
                //     if(this._playsoundStopItem){
                //         this._playsoundStopItem();
                //     }
                //    // SoundPlayer.playSound("slot_stop");
                // }

            }
            var yyyy = this.y2  + this.moveSpeed*this.timeElapsed + (this.acceleration*this.timeElapsed*this.timeElapsed)/2;
            var yNew = this.y1 + this.y2 -yyyy;
            if(yNew < this.y3 - this.y2){
                yNew = 2*(this.y3 - this.y2)  -yNew;
                if(this.idItem == 15){
                    cc.log("aaaa");
                }

            }
            this.setPosition(this.x,yNew);
        }else {
            var y = this.getPositionY() - this.moveSpeed*dt;
            if(y <= this.minY ){
                var delta =  y - this.minY;
                y = this.maxY + delta;
            }
            this.setPositionY(y);
            if( y <= this.YStop)
            {
                this.isRunning = false;
            }
        }
    },
    startRunning:function () {
        this.isRunning = true;
    },
    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

});



var SlotLayer = cc.Node.extend({
    ctor: function (soCot) {
        this._super();
        var nodeSlot = new ccui.Layout();
        nodeSlot.setAnchorPoint(cc.p(0,0));
        nodeSlot.setClippingEnabled(true);

        this.addChild(nodeSlot);
        this.nodeSlot = nodeSlot;
        this.clolumnCurrent = 0;
        this.soCot = soCot;
    },

    newItem:function (idItem) {
        return new SlotItem(idItem);
    },

    rotate:function () {

        this.clearAll();
        for (var i = 0; i < this.soCot; i++) { // cot

            var subItem = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = Math.floor(Math.random()*6);
                var item = this.newItem(randomItem);
                item.createItem(i,j,0);
                this.nodeSlot.addChild(item);

                subItem.push(item);

            }
            this.arrItems.push(subItem);
        }
    },
    showNotEffect:function (ketqua) {
        this.arrResuft = [];
        this.clearAll();
        for (var i = 0; i < this.soCot; i++) { // cot

            // var subItem = [];
            for (var j = 0 ; j < 3; j++) { // hang
                var item = this.newItem(ketqua[i][j]);
                item.createItem(i,j,0);
                item.isRunning = false;
                this.nodeSlot.addChild(item);
                this.arrResuft.push(item);
                // subItem.push(item);

            }
            // this.arrItems.push(subItem);
        }

    },

    clearAll:function () {
        this.arrResuft = [];
        this.stopAllActions();
        this.nodeSlot.removeAllChildren(true);
        this.arrItems = [];
        this.clolumnCurrent = -1;
    },
    stopSlotWithResuft:function (ketqua) {
        var thiz = this;
        for (var i = 0; i< this.arrItems.length; i++) {
            (function () {
                var inew = i;
                var subItems = thiz.arrItems[inew];

                thiz.runAction(new cc.Sequence(new cc.DelayTime(inew*0.3),new  cc.CallFunc(function () {

                    // SoundPlayer.playSound("quay_cham_dan");
                    var  itemTemp = thiz.arrItems[inew][0];//phan tu dau tien cua cot
                     var distance = itemTemp.distance2Item + thiz.getMaxYOfColumn(inew,4) ;
                    var kqColumn = [];

                    for(var j = 0 ;j < subItems.length; j++)
                    {
                        var items = subItems[j];
                        items.stop(distance);
                    }
                    thiz.initItemsColumn(3,inew,ketqua[inew],distance,false);
                })));
            })();


        }
    },
    stopNow:function (ketqua) {
        this.stopAllActions();
        var thiz = this;
        for (var i = this.clolumnCurrent+1; i< this.arrItems.length; i++) {
            (function () {
                var inew = i;
                var subItems = thiz.arrItems[inew];


                var  itemTemp = thiz.arrItems[inew][0];//phan tu dau tien cua cot
                var distance = itemTemp.distance2Item + thiz.getMaxYOfColumn(inew,4) ;

                    for(var j = 0 ;j < subItems.length; j++)
                    {
                        var items = subItems[j];
                        items.stop(distance);
                    }
                    thiz.initItemsColumn(3,inew,ketqua[inew],distance,true);

            })();


        }
    },
    getMaxYOfColumn:function (i,numberHorizontal) {
        var  item0 = this.arrItems[i][0];
        var y = item0.getPositionY();
        for(var m = 0; m<numberHorizontal;m++)
        {
            var temp = this.arrItems[i][m];
            if(temp.getPositionY() > y){
                y = temp.getPositionY();
            }
        }
        return y;
    },
    initItemsColumn:function (numberHorizontal, i , ketqua,distance,stopNow) {
        var thiz = this;
        this.clolumnCurrent = i;
        var subItem = [];
        for (var j = 0 ; j < numberHorizontal; j++) {
            var item = this.newItem(ketqua[j]);
            item.isStopNow = stopNow;
            subItem.push(item);
            item.idItem = this.arrResuft.length+1;
            this.arrResuft.push(item);
            item._finishedHandler = function () {
                if(thiz._finishedHandler){
                    thiz._finishedHandler();
                }
            };
            item._playsoundStopItem = function () {
                if(thiz._playsoundStopItem){
                    thiz._playsoundStopItem();
                }
            };
        }


        var  item0 = this.arrItems[i][0];//phan tu dau tien cua cot
        var y = this.getMaxYOfColumn(i,4);

        var lastY = item0.distance2Item + y;


        for (var j = 0 ; j < numberHorizontal; j++) {
            var item = subItem[j];
            item.createItem(i,j,lastY);
            this.nodeSlot.addChild(item);
            item.stop(distance);

            if(i==4 && j==2)
            {
                var delay = lastY/400.0;
                cc.log("finish");
            }

        }
    },
});