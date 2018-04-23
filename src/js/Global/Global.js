/**
 * Created by ext on 7/6/2016.
 */

var MyTest = MyTest || {};

String.prototype.insertAt = function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
};

var cc = cc || {};
cc.Global = cc.Global || {};

var _map_swap_key_value = function (_map, func) {
    var newMap = {};
    for(var _key in _map){
        if(!_map.hasOwnProperty(_key)) continue;
        var newKey = _map[_key];
        if(func){
            newMap[_map[_key]] = func(_key);
        }
        else{
            newMap[_map[_key]] = _key;
        }
    }
    return newMap;
};

cc.Global.Tester = 1;

cc.Global.NumberFormat1 = function (number) {
    var pret = Math.abs(number).toString();
    if(pret.length > 3){
        for(var i=pret.length-3; i>0;i-=3){
            pret = pret.insertAt(i,",");
        }
    }
    if(number < 0){
        return "-"+pret;
    }
    return pret;
};

var Number_Format_Type = ["", "K", "M", "B"];
cc.Global.NumberFormat2 = function (number) {
    var i = 0;
    while(number >= 1000){
        number = Math.floor(number/1000);
        i++;
    }
    return (number.toString() + Number_Format_Type[i]);
};

cc.Global.NumberFromString = function (str) {
    var numberText = str.replace(/[.,]/g,'');
    if(numberText && cc.Global.IsNumber(numberText)){
        return parseInt(numberText);
    }
    return null;
};

cc.Global.NumberFormatWithPadding = function (number, size) {
    if(size == undefined){
        size = 2;
    }
    if(number < 0){
        return number.toString();
    }
    var str = number.toString();
    while(str.length < size){
        str = "0"+str;
    }
    return str;
};

cc.Global.DateToString = function (d, space) {
    if(space===undefined) {
        space = "\n";
    }

    var timeString = cc.Global.NumberFormatWithPadding(d.getDate()) + "/" +
        cc.Global.NumberFormatWithPadding(d.getMonth() + 1) + "/" +
        (1900 + d.getYear()).toString() + space +
        cc.Global.NumberFormatWithPadding(d.getHours()) + ":" +
        cc.Global.NumberFormatWithPadding(d.getMinutes()) + ":" +
        cc.Global.NumberFormatWithPadding(d.getSeconds());
    return timeString;
};

//cc.winSize.screenScale = cc.winSize.width / 1280.0;
cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
if(cc.sys.isNative){
    cc.res.font.Roboto_Medium = "res/fonts/Roboto-Medium.ttf";
    cc.res.font.Roboto_Condensed = "res/fonts/Roboto-Condensed.ttf";
    cc.res.font.Roboto_CondensedBold = "res/fonts/Roboto-BoldCondensed.ttf";
    cc.res.font.UTM_SeagullBold = "res/fonts/UTM_SeagullBold.ttf";
    cc.res.font.Roboto_Regular = "res/fonts/Roboto-Regular.ttf";
    cc.res.font.Roboto_Black = "res/fonts/Roboto-Black.ttf";
    cc.res.font.Tahoma = "res/fonts/tahoma.ttf";
}
else{
    cc.res.font.Roboto_Condensed = "Roboto-Condensed";
    cc.res.font.Roboto_CondensedBold = "Roboto-BoldCondensed";
    cc.res.font.Roboto_Medium = "Roboto-Medium";
    cc.res.font.UTM_SeagullBold = "UTM_SeagullBold";
    cc.res.font.Roboto_Regular = "Roboto-Regular";
    cc.res.font.Roboto_Black = "Roboto-Black.ttf";
    cc.res.font.Tahoma = "tahoma.ttf";
}

cc.res.font.Tahoma_Regular_24 = "res/fonts/Tahoma_Regular_24.fnt";

var GameType = GameType || {};
GameType.GAME_SLOT_FRUIT = 1;
GameType.GAME_AOE = 1111;
GameType.GAME_game_of_thrones = 2;
GameType.GAME_Larva = 3;
GameType.GAME_MauBinh = 4;
GameType.GAME_TienLenMN = 5;
GameType.GAME_Phom = 6;
GameType.GAME_Sam = 7;
GameType.GAME_BaCay = 8;
GameType.GAME_XocDia = 9;
GameType.GAME_TaiXiu = 10;
GameType.GAME_TLMN_Solo = 11;
GameType.GAME_Sam_Solo = 12;
GameType.GAME_Lieng = 13;
GameType.GAME_BaCayChuong = 14;
GameType.GAME_Poker = 15;

GameType.GAME_TET_AM = 17;

GameType.GAME_MauBinh_Free = 201;
GameType.GAME_TienLenMN_Free = 202;
GameType.GAME_Phom_Free = 203;
GameType.GAME_Sam_Free = 204;
GameType.GAME_BaCay_Free = 205;
GameType.GAME_XocDia_Free = 206;
GameType.GAME_TaiXiu_Free = 207;
GameType.GAME_TLMN_Solo_Free = 208;
GameType.GAME_Sam_Solo_Free = 209;
GameType.GAME_Lieng_Free = 210;
GameType.GAME_BaCayChuong_Free = 211;
GameType.GAME_Poker_Free = 212;
GameType.GAME_XocDia_Free = 213;
GameType.GAME_TaiXiu_Free = 214;

GameType.MiniGame_TaiXiu = 101;
GameType.MiniGame_CaoThap = 102;
GameType.MiniGame_Poker = 103;
GameType.MiniGame_Candy_Slot = 104;
GameType.MiniGame_Vong_Quay_May_Man = 105;
GameType.MiniGame_VideoPoker = 106;
GameType.MiniGame_CuopBien_Slot = 107;

GameType.Group_TLML = 1001;
GameType.Group_SAM = 1002;

GameType.GameNoChannel = [
    GameType.GAME_SLOT_FRUIT

];

var GameModuleName = GameModuleName || {};
GameModuleName[GameType.GAME_SLOT_FRUIT] = "GameSlotFruit";
GameModuleName[GameType.GAME_TET_AM] = "GameTetAm";
GameModuleName[GameType.GAME_AOE] = "GameAOE";
GameModuleName[GameType.GAME_Larva] = "GameLarva";
GameModuleName[GameType.MiniGame_TaiXiu] = "GameMiniTaiXiu";
GameModuleName[GameType.MiniGame_CaoThap] = "GameMiniCaoThap";
GameModuleName[GameType.MiniGame_Poker] = "GameMiniPoker";
GameModuleName[GameType.MiniGame_Candy_Slot] = "GameMiniSlot";
GameModuleName[GameType.MiniGame_CuopBien_Slot] = "GameMiniCuopBien";
GameModuleName[GameType.GAME_TienLenMN] = "GameTLMN";
GameModuleName[GameType.GAME_Sam] = "GameSam";
GameModuleName[GameType.GAME_Phom] = "GamePhom";
GameModuleName[GameType.GAME_MauBinh] = "GameMauBinh";
GameModuleName[GameType.GAME_Poker] = "GamePoker";
GameModuleName[GameType.GAME_TaiXiu] = "GameTaiXiu";
GameModuleName[GameType.GAME_XocDia] = "GameXocDia";
GameModuleName[GameType.GAME_BaCay] = "GameBaCay";
GameModuleName[GameType.MiniGame_Vong_Quay_May_Man] = "GameMiniVongQuay";
GameModuleName[GameType.GAME_TLMN_Solo] = GameModuleName[GameType.GAME_TienLenMN];
GameModuleName[GameType.GAME_Sam_Solo] = GameModuleName[GameType.GAME_Sam];

var s_GameId = s_GameId || {};
s_GameId["slot_20_0"] = GameType.GAME_AOE;
s_GameId["game_got"] = GameType.GAME_game_of_thrones;
s_GameId["slot_25"] = GameType.GAME_Larva;
s_GameId["slot_20_1"] = GameType.GAME_TET_AM;
s_GameId["mini_taixiu"] = GameType.MiniGame_TaiXiu;
s_GameId["mini_caothap"] = GameType.MiniGame_CaoThap;
s_GameId["mini_poker"] = GameType.MiniGame_Poker;
s_GameId["slot_3x3"] = GameType.MiniGame_Candy_Slot;
s_GameId["slot_27"] = GameType.MiniGame_CuopBien_Slot;
s_GameId["mini_luckywheel"] = GameType.MiniGame_Vong_Quay_May_Man;
s_GameId["ChinesePoker"] = GameType.GAME_MauBinh;
s_GameId["ThreeCards"] = GameType.GAME_BaCay;

var s_gameName = s_gameName || _map_swap_key_value(s_GameId);

var s_game_available = s_game_available || [
    GameType.GAME_SLOT_FRUIT,
    GameType.GAME_AOE,
    GameType.GAME_TET_AM,
  //  GameType.GAME_game_of_thrones,
    GameType.GAME_Larva,
    GameType.GAME_MauBinh,
    GameType.GAME_TienLenMN,
    GameType.GAME_Phom,
    GameType.GAME_Sam,
//    GameType.GAME_BaCay,
    GameType.GAME_XocDia,
//    GameType.GAME_TaiXiu,
    GameType.GAME_TLMN_Solo,
    GameType.GAME_Sam_Solo,
//    GameType.GAME_Lieng,
 //   GameType.GAME_BaCayChuong,
    GameType.GAME_Poker,
//    GameType.GAME_SLOT_FRUIT,

    GameType.MiniGame_TaiXiu,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_Poker,
    GameType.MiniGame_Candy_Slot,
    GameType.MiniGame_CuopBien_Slot,
//    GameType.MiniGame_Vong_Quay_May_Man,
//    GameType.MiniGame_VideoPoker,

    GameType.Group_TLML,
    GameType.Group_SAM
];

var s_game_no_login = s_game_no_login || [
    GameType.GAME_SLOT_FRUIT,
    GameType.GAME_AOE,
    GameType.GAME_game_of_thrones,
    GameType.GAME_Larva,
    GameType.GAME_TET_AM,
    GameType.MiniGame_TaiXiu,
    GameType.MiniGame_CaoThap,
    GameType.MiniGame_Poker,
    GameType.MiniGame_Candy_Slot,
    GameType.MiniGame_CuopBien_Slot,
    GameType.MiniGame_Vong_Quay_May_Man,
    GameType.MiniGame_VideoPoker,
    GameType.GAME_XocDia,
    GameType.GAME_TaiXiu
];



var GameConfig = GameConfig || {};
GameConfig.email = "hotro.binclub@gmail.com";
GameConfig.hotline = "";
GameConfig.fanpage = "https://www.messenger.com/t/BinClub.Fanpage";
GameConfig.broadcastMessage = "";
GameConfig.DeviceIDKey = "";
GameConfig.telegram = "https://t.me/hotrobinclub";

var GameInfo = GameInfo || {};
GameInfo.Jackpot = {};



cc.Global.GetSetting = function (setting, defaultValue) {
    var value = cc.sys.localStorage.getItem(setting);
    if(value){
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return defaultValue;
};
cc.Global.SetSetting = function (setting, value) {
    cc.sys.localStorage.setItem(setting, value);
};

var ApplicationConfig = ApplicationConfig || {};
ApplicationConfig.DISPLAY_TYPE = "room"; //room - betting
(function () {
    if(cc.sys.isNative){
        if(cc.sys.os === cc.sys.OS_IOS){
            ApplicationConfig.PLATFORM = 1;
        }
        else if(cc.sys.os === cc.sys.OS_ANDROID){
            ApplicationConfig.PLATFORM = 2;
        }
        else if(cc.sys.os === cc.sys.OS_WINRT){
            ApplicationConfig.PLATFORM = 3;
        }
        else if(cc.sys.os === cc.sys.OS_WINDOWS){
            ApplicationConfig.PLATFORM = 3;
        }
        else{
            ApplicationConfig.PLATFORM = 2;
        }
    }
    else{
        ApplicationConfig.PLATFORM = 4;
    }
})();
cc.Global.NodeIsVisible = function (node) {
    while(node){
        if(!node.visible){
            return false;
        }
        node = node.getParent();
    }
    return true;
};

cc.Global.getSaveUsername = function () {
    return cc.Global.GetSetting("username", "");
};

cc.Global.setSaveUsername = function (userName) {
    cc.Global.SetSetting("username", userName);
};

cc.Global.getSavePassword = function () {
    return cc.Global.GetSetting("password", "");
};

cc.Global.setSavePassword = function (passwords) {
    cc.Global.SetSetting("password", passwords);
};

cc.Global.IsNumber = function (str) {
    if(typeof str === 'number'){
        return true;
    }
    var numberText = str.replace(/[.,]/g,'');
    var re = new RegExp("^[0-9]+$");
    return re.test(numberText);
};
cc.Global.isUndefined = function (obj) {
    return typeof obj === 'undefined';
};

if(cc.sys.isNative){
    ccui.Slider.prototype._ctor = function (barTextureName, normalBallTextureName, resType) {
        this.init();
        if(barTextureName){
            this.loadBarTexture(barTextureName, resType);
        }
        if(normalBallTextureName){
            this.loadSlidBallTextureNormal(normalBallTextureName, resType);
        }
    };
}

cc.Global.openURL = function (url) {
    if(cc.sys.isNative){
        cc.Application.getInstance().openURL(url);
    }
    else{
        var win = window.open(url, '_blank');
        win.focus();
    }
};

(function () {
    ModuleManager.getInstance().getReadyModule = function () {
        var moduleReady = [
            //this.getModule("GameAOE"),
            //this.getModule("GameTLMN"),
            //this.getModule("GameSam"),
            //this.getModule("GamePhom")
        ];

        return moduleReady;
    };

    var uiButtonClickedHandler = ccui.Button.prototype.addClickEventListener;
    ccui.Button.prototype.addClickEventListener = function (func) {
        var newFunc = function () {
            func(arguments);
            // cc.log("on clikedButton");
            //SoundPlayer.playSound("button_click");
        };
        uiButtonClickedHandler.apply(this, [newFunc]);
    };

})();

