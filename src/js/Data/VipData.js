//(function () {
    var VipData = [
        {
            "exp": 0,
            "content": "0",
            "vippoint": "0",
            "viprax": "0",
            "avatar1": false,
            "avatar2": false,
            "avatar3": false,
            "upload": false
        },
        {
            "exp": 16000000,
            "vippoint": "400",
            "content": "10000",
            "viprax": "20",
            "avatar1": true,
            "avatar2": false,
            "avatar3": false,
            "upload": false
        },
        {
            "exp": 76000000,
            "vippoint": "1500",
            "content": "20000",
            "viprax": "22",
            "avatar1": true,
            "avatar2": true,
            "avatar3": false,
            "upload": false
        },
        {
            "exp": 176000000,
            "vippoint": "2500",
            "content": "50000",
            "viprax": "24",
            "avatar1": true,
            "avatar2": true,
            "avatar3": true,
            "upload": false
        },
        {
            "exp": 376000000,
            "vippoint": "5000",
            "content": "100000",
            "viprax": "27",
            "avatar1": true,
            "avatar2": true,
            "avatar3": true,
            "upload": true
        },
        {
            "exp": 976000000,
            "vippoint": "15000",
            "content": "200000",
            "viprax": "30",
            "avatar1": true,
            "avatar2": true,
            "avatar3": true,
            "upload": true
        },
        {
            "exp": 2576000000,
            "vippoint": "40000",
            "content": "500000",
            "viprax": "35",
            "avatar1": true,
            "avatar2": true,
            "avatar3": true,
            "upload": true
        },
        {
            "exp": 7376000000,
            "vippoint": "120000",
            "content": "1000000",
            "viprax": "40",
            "avatar1": true,
            "avatar2": true,
            "avatar3": true,
            "upload": true
        },
        {
            "exp": 19376000000,
            "vippoint": "300000",
            "content": "2000000",
            "viprax": "50",
            "avatar1": true,
            "avatar2": true,
            "avatar3": true,
            "upload": true
        }
    ];
    
    cc.Global.GetVip = function (exp) {
        var preLevel = VipData[0];
        for(var i=1;i<VipData.length;i++){
            var obj = VipData[i];
            if(exp >= preLevel.exp && exp < obj.exp){
                //var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
                return {
                    level : i - 1,
                    //expPer : expPer,
                    currentExp : exp,
                    targetExp : obj.exp,
                    startExp : preLevel.exp,
                    content : preLevel.content
                };
            }
            preLevel = obj;
        }
        return {
            level : VipData.length-1,
            currentExp : exp,
            targetExp : VipData[VipData.length-1].exp,
            startExp : VipData[VipData.length-1].exp,
            // expPer : 100.0,
            content : preLevel.content
        };
    };

    cc.Global.GetVipMe = function () {
        return cc.Global.GetVip(PlayerMe.vipExp);
    };
//})();