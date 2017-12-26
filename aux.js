var wikt = wikt?wikt:(new Object());

eval(fs.readFileSync('./wiktionary/hanCharToc.js').toString());
eval(fs.readFileSync('./wiktionary/sectionHandling.js').toString());

wikt._hanCharDoc;

wikt.test = 
function(url, rereadFlag = false) {
    if (rereadFlag) wikt._hanCharDoc = undefined; 
    if (!wikt._hanCharDoc)  
        JSDOM.fromURL(url, {}).
            then(dom => {wikt._hanCharDoc = wikt.start(dom);});
    else 
        wikt._hanCharDoc = wikt.start(wikt._hanCharDoc);
};

wikt.start = function(dom) {
    console.log("STARTING HANDLING");
    wikt.gatherContentSectionIds(dom);
    return dom;
};

wikt.pathMatch = function (path1, path2) {
    if (path1 == undefined || path2 == undefined ||
        path1.length == undefined || path2.length == undefined || 
        path1.length != path2.length) 
        return false; 

    for (var index = 0 ; index < path1.length ; index++ ) 
        if (path1[index] != path2[index])
            return false; 

    return true;
};

wikt.extractTaggedNumber = function(string, tag, separator) {
    if(!separator) separator = " "; 
    tag += separator; 
    string = string.substr(string.indexOf(tag) + tag.length); 
    var char; 
    var index = 0;
    var retval = ""; 
    while((char = string.charAt(index++)) >= '0' && char <= '9') 
        retval += char; 

    return retval;
};


