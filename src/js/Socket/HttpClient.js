/**
 * Created by ext on 7/4/2017.
 */

var HttpClient = cc.Class.extend({
    ctor : function () {
        this.requestTimeout = 5000;
    },

    sendGetRequest : function (url, params, tag) {
        if(params){
            var cmd = params["command"];
        }

        if(!cmd) {
            cc.log("http request params no command");
            cmd = url;
        }

        var thiz = this;
        this.sendGetRequestWithCallback(url, params, function (status, responseText) {
            thiz._httpOnFinished(status, responseText, cmd, tag);
        }, tag);
    },

    sendPostRequest : function (url, params, tag) {
        if(params){
            var cmd = params["command"];
        }

        if(!cmd) {
            cc.log("http request params no command");
            cmd = url;
        }

        var thiz = this;
        this.sendPostRequestWithCallback(url, params, function (status, responseText) {
            thiz._httpOnFinished(status, responseText, cmd, tag);
        }, tag);
    },

    _createParamsString : function (params) {
        var str = "";
        var firstParam = true;
        for (var key in params) {
            if(firstParam){
                firstParam = false;
            }
            else{
                str += "&";
            }
            if(!params.hasOwnProperty(key) || params[key] === null || params[key] === undefined) continue;
            str += encodeURIComponent(key) + "=" + encodeURIComponent(params[key].toString());
        }
        cc.log(str);
        return str;
    },

    sendGetRequestWithCallback: function (url, params, cb) {
        var fullUrl = url;
        if(params){
            if(!fullUrl.endsWith("?")){
                fullUrl += "?";
            }
            fullUrl += this._createParamsString(params);
        }
        this._sendHttpRequest("GET", fullUrl, null, cb);
    },

    sendPostRequestWithCallback: function (url, params, cb) {
        if(params){
            var paramsStr = JSON.stringify(params);
        }
        this._sendHttpRequest("POST", url, paramsStr, cb);
    },

    _httpOnFinished: function (status, responseText, cmd, tag) {
        if(status >= 200 && status <= 207) {
            try{
                var obj = JSON.parse(responseText);
            }
            catch (err){
                console.log("err: ", err);
                var reponse = {
                    status : 100001,
                    requestTag : tag
                };
                this.onEvent(cmd, reponse);
                return;
            }
            if(tag !== undefined){
                obj["requestTag"] = tag;
            }
            this.onEvent(cmd, obj);
        }
        else{
            var reponse = {
                status : 100000,
                requestTag : tag
            };
            this.onEvent(cmd, reponse);
        }
    },

    _sendHttpRequest : function (protocol, url, param, cb) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = this.requestTimeout;
        var thiz = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4){
                cb(xhr.status, xhr.responseText);
            }
        };

        xhr.open(protocol, url, true);
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        if(protocol === "POST"){
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            //   xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
            //    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            //    xhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin, text/plain;charset=UTF-8");
            //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers,Authorization, X-Requested-With');
        }

        if(param){
            xhr.send(param);
        }
        else{
            xhr.send();
        }
    },

    onEvent : function (command, data) {
        cc.log("command: " + command);
        cc.log(data);
    }
});