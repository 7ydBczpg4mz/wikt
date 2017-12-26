wikt.dispatchSectionHandling = function(sectionId, element) {
    var retval = {};
    if(sectionId == "Translingual") {
        // the stroke order picture if any
       if (element.tagName == "TABLE" && 
            element.rows[0].cells[0].textContent.trim() == "Stroke order") {
            retval["illustrations"] = wikt.extractStrokeOrderIllustration(element);
        } else wikt._debugLogElement(sectionId, element);  
    } else if(sectionId == "Han_character") {
        // the info containing cangjie, four corner, radical.. etc.. 
        if (element.tagName == "P"){
            retval["root"] = wikt.extractHanCharacterInfo(element)
        } else wikt._debugLogElement(sectionId, element);  
    } else if(sectionId == "Derived_characters") {
        if (element.tagName == "UL") {
            retval["derivedChars"] = wikt.extractDerivedCharacters(element); 
        } else wikt._debugLogElement(sectionId, element);  
    } else if(sectionId == "References") {
        if (element.tagName = "UL") {
            retval["kangxi"] = wikt.extractReferences(element);    
        } else wikt._debugLogElement(sectionId, element);  
    } else wikt._debugLogElement(sectionId, element);  
    
    return retval; 
};

wikt.extractReferences = function (element) {
    for (var a = 0; a < element.children.length ; a++) {
        var tmp = element.children[a]; 
        var cnt = "";
        if (tmp.tagName == "LI" && (cnt = tmp.textContent.trim()).indexOf("KangXi") == 0) {
            return wikt.extractTaggedNumber(cnt, "page") + " " + 
                   wikt.extractTaggedNumber(cnt, "character");
        }
    }
    return undefined;
}


wikt.extractDerivedCharacters = function (element) {
    var retval = ""; 
    for (var a = 0; a < element.children.length ; a++) {
        var tmp = element.children[a]; 
        var cnt = "";
        var chars;
        if (tmp.tagName == "LI" && (cnt = tmp.textContent.trim()).indexOf("Index") == -1)
            for (var i in (chars = cnt.split(", "))) 
                retval += (i==0?"":" ") + chars[i]; 
    }
    return retval; 
}

wikt._debugLogElement = function (sectionId, element) {
    console.log("NOT HANDLING ELEMENT " + element + "|" + element.class  + "| " 
        + " UNDER SECTION " + sectionId);
}

wikt.extractStrokeOrderIllustration = function (element) {
    var tmp = element.rows[1].cells[0].firstElementChild.firstElementChild; 
    var retval = element.ownerDocument.createElement("illustration");
    retval.setAttribute("type", "STROKE ORDER");
    retval.setAttribute("img-src", tmp.src);

    var srcset = wikt.handleSrcSet(tmp.srcset);
    for (var a in srcset)
        retval.setAttribute(a, srcset[a]);

    console.log(retval.outerHTML);
    return retval;
};

wikt.handleSrcSet = function(srcset) {
    var retval = new Object();
    var arr = srcset.trim().split(", ");
    for (var a in arr) {
        var itms = arr[a].trim().split(" ");
        retval [ "img-" + itms[1].replace(".", "-") + "-src" ] = 
            (itms[0].startsWith("http:")?"":"http:") + itms[0]; 
    }
    return retval;
};

wikt.extractHanCharacterInfo = function(element) {
    var tmp = element.textContent;
    // get to the info enclosed inside the round brachkets 
    var tmp1 = tmp.substr(tmp.indexOf("("));
    //var retval = {"character": tmp.substr(0,tmp.indexOf("(") - 1)};
    var retval = element.ownerDocument.createElement("character");
    retval.setAttribute("value", tmp.substr(0,tmp.indexOf("(") - 1));
    tmp = tmp1.substr(1,tmp1.length - 2).split(", ");

    for (var a in tmp) {
        if (tmp[a].trim().startsWith("radical ")) {
            tmp1 = tmp[a].substr("radical ".length); 
            // retval["radical-number"] = tmp1.substr(0, tmp1.indexOf(" "));
            retval.setAttribute("radical-number", tmp1.substr(0, tmp1.indexOf(" "))); 
            // retval["radical-character"] = tmp1.charAt(tmp1.indexOf(" ") + 1);
            retval.setAttribute("radical-character", tmp1.charAt(tmp1.indexOf(" ") + 1));
            // retval["additional-strokes"] = tmp1.substr(tmp1.indexOf("+") + 1); 
            retval.setAttribute("additional-strokes", tmp1.substr(tmp1.indexOf("+") + 1));
        } else if((tmp1 = tmp[a].trim()).endsWith(" strokes")) {
            // retval["total-strokes"] = tmp1.substr(0, tmp1.indexOf(" strokes"));
            retval.setAttribute ("total-strokes",tmp1.substr(0, tmp1.indexOf(" strokes")));
        } else if((tmp1 = tmp[a].trim()).startsWith("four-corner ")) {
            // retval["four-corner"] = tmp1.substr("four-corner ".length); 
            retval.setAttribute ("four-corner", tmp1.substr("four-corner ".length));
        } else if((tmp1 = tmp[a].trim()).startsWith("composition ")) {
            // retval["composition"] = tmp1.substr("composition ".length); 
            retval.setAttribute ("composition", tmp1.substr("composition ".length));
        } else if((tmp1 = tmp[a].trim()).startsWith("cangjie input ")) {
            tmp1 = tmp1.substr("cangjie input ".length).split(" or ");
            var tmp2;
            var value = new String();
            for (var index in tmp1) {
                tmp2 = tmp1[index]; 
                value += ((0 == index)?"":" ") + 
                    tmp2.substr(tmp2.indexOf("(") + 1, tmp2.indexOf(")") - tmp2.indexOf("(") - 1);
            }
            // console.log("----" + value);
            retval.setAttribute("cangjie-input", value);
        }
        //console.log("----" + tmp[a]);
    }

     console.log(retval.outerHTML);
    return retval; 

};
