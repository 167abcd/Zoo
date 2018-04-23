var STATUS_SOCKET =  STATUS_SOCKET || {
    ERROR : 0,
    SUCCESS : 1,
    SHOW_CAPTCHA : 2
};
var kCMD = kCMD || {
    PING : 0,
    LOGIN : 1,
    LOGIN_TOKEN : 2,
    LOGIN_FB : 3,
    // LOGIN_GOOGLE: 4,
    REGISTER : 4,
    UPDATE_DISPLAYNAME : 5,
    CAPTCHA: 19,
    CAPTCHA_SOCKET: 18 //
};
var kEvent = kEvent|| {
    LOGIN_RESPONSE: "LOGIN_RESPONSE",
    CAPTCHA_LOGIN: "CAPTCHA_LOGIN",
    INBOX_UNREAD: "inboxUnReadCount",
    LOGOUT: "logout",
    UPDATE_DISPLAYNAME: "update_displayname",
    UPDATE_MONEY: "refreshAsset",
    UPDATE_ASSET: "ua",
    CHANGE_LINES_SLOT     		: "CHANGE_LINES_SLOT",
};
var CMD_OBSERVER = CMD_OBSERVER || {
    OBSERVER_TAI_XIU: 1005,
    OBSERVER_POKER  :1101,//
    OBSERVER_SLOT  :1300,// SLOT la 3 game mini poker, trung , tam gioi, PHAN BIET = SLOT_GAME_MINI when send
    OBSERVER_SLOT_REMOVE  :1301,
    OBSERVER_SLOT_CHAT  :1308,
    OBSERVER_SLOT_RECONNECT: "OBSERVER_SLOT_RECONNECT"

};
var kParams = kParams || {
    STATUS : "s",
    MGS : "m"
};

var kConfig = kConfig || {
    LOAD_SERVER_CONFIG : "LOAD_SERVER_CONFIG"
};