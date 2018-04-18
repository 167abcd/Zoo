
ccui.RichText.prototype._elementFromXML = function (domObject, attribute) {
    if(attribute){
        var newAtt = JSON.parse(JSON.stringify(attribute));
    }
    else{
        var newAtt = {};
    }

    if(domObject.nodeType === 1){ //element
        if(domObject.nodeName === "img"){ //image
            var src = domObject.getAttribute("src");
            var width = domObject.getAttribute("height") || "-1";
            var height = domObject.getAttribute("height") || "-1";
            var data = {
                type : "image",
                src : src,
                width : parseInt(width),
                height : parseInt(height)
            };
            return [data];
        }
        else if(domObject.nodeName === "br"){ //new line
            var data = {
                type : "newLine"
            };
            return [data];
        }
        else if(domObject.nodeName === "font"){
            if(!newAtt.hasOwnProperty("font")){
                newAtt["font"] = {};
            }

            if(domObject.hasAttribute("size")){
                newAtt["font"]["size"] = parseInt(domObject.getAttribute("size"));
            }

            if(domObject.hasAttribute("face")){
                newAtt["font"]["face"] = domObject.getAttribute("face");
            }

            if(domObject.hasAttribute("color")){
                newAtt["font"]["color"] = domObject.getAttribute("color");
            }
        }
        else if(domObject.nodeName === "b"){
            newAtt["textBold"] = true;
        }
        else if(domObject.nodeName === "i"){
            newAtt["textItalic"] = true;
        }
        else if(domObject.nodeName === "del"){
            newAtt["textLine"] = "textLineDel";
        }
        else if(domObject.nodeName === "u"){
            newAtt["textLine"] = "textLineUnder";
        }
        else if(domObject.nodeName === "small"){
            newAtt["fontSmall"] = true;
        }
        else if(domObject.nodeName === "big"){
            newAtt["fontBig"] = true;
        }
        else if(domObject.nodeName === "a"){
            newAtt["url"] = domObject.getAttribute("href");
        }
        else if(domObject.nodeName === "outline"){
            if(!newAtt.hasOwnProperty("outline")){
                newAtt["outline"] = {};
            }
            newAtt["outline"]["color"] = domObject.getAttribute("color");
            newAtt["outline"]["size"] = domObject.getAttribute("size");
        }
        else if(domObject.nodeName === "shadow"){
            if(!newAtt.hasOwnProperty("shadow")){
                newAtt["shadow"] = {};
            }
            newAtt["shadow"]["color"] = domObject.getAttribute("color");
            newAtt["shadow"]["offsetWidth"] = domObject.getAttribute("offsetWidth");
            newAtt["shadow"]["offsetHeight"] = domObject.getAttribute("offsetHeight");
            newAtt["shadow"]["blurRadius"] = domObject.getAttribute("blurRadius");
        }
        else if(domObject.nodeName === "glow"){
            if(!newAtt.hasOwnProperty("glow")){
                newAtt["glow"] = {};
            }
            newAtt["glow"]["color"] = domObject.getAttribute("color");
        }
    }
    else if(domObject.nodeType === 3){ //text
        var data = {
            type : "text",
            text : domObject.nodeValue,
            attribute : newAtt
        };
        return [data];
    }

    var ret = [];

    var child = domObject.childNodes;
    if(child){
        for(var i=0;i<child.length;i++){
            var newElement = this._elementFromXML(child[i], newAtt);
            ret = ret.concat(newElement);
        }
    }

    return ret;
};

ccui.RichText.prototype._pushTextElementFromData = function (tag, data) {
    var text = data["text"];
    var attribute = data["attribute"];
    var fontData = attribute["font"];

    var fontName = fontData["face"];
    var fontSize = fontData["size"];
    var fontColor = fontData["color"] || "#ffffff";

    var textElement = new ccui.RichElementText(tag, cc.color(fontColor), 255, text, fontName, fontSize);
    this.pushBackElement(textElement);
};

ccui.RichText.prototype._pushImageElementFromData = function (tag, data) {
    var filePath = data["src"];
    var imgElement = new ccui.RichElementImage(tag, cc.color(255,255,255,255), 255, filePath);
    this.pushBackElement(imgElement);
};

ccui.RichText.prototype.initWithXML = function (str, map, func ) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(str,"text/xml");

    var elementData = this._elementFromXML(xmlDoc, null);
    if(elementData){
        for(var i=0;i<elementData.length;i++){
            var type = elementData[i]["type"];
            if(type === "text"){
                this._pushTextElementFromData(i, elementData[i]);
            }
            else if(type === "image"){
                this._pushImageElementFromData(i, elementData[i]);
            }
            else if(type === "newLine"){
                this._addNewLine();
            }
        }
    }
};