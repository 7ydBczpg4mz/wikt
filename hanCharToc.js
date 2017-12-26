wikt.parsingContext = {
    // ids are usually on elements inside big headers (h2,h3..) 
    // containing the section title
    "releventIdsSet":
    [ ["Translingual"],
        ["Translingual", "Han_character"],  
        ["Translingual", "Han_character", "Derived_characters"], 
        ["Translingual", "Han_character", "References"], 
        ["Chinese", "Glyph_origin"]
    ], 
    "tokId":"toc"
};

wikt.isPathRelevent = function(path) {
    for (var index = 0 ; index < wikt.parsingContext["releventIdsSet"].length; 
        index ++) 
        if (wikt.pathMatch(path, wikt.parsingContext["releventIdsSet"][index]))
            return true ;
        
    return false;  
}; 

wikt.gatherContentSectionIds = function(dom) {
    // assuming the element is the root of the TOC branch
    var tocElement = dom.window.document.getElementById(wikt.parsingContext.tokId);
    var retval = wikt._gatherContentSectionIds(tocElement, {"list_length": 0, "list": {}}, []);

    for (sectionId in retval["list"]) {
        var releventFlag = retval["list"][sectionId];
        var tmp; 
        if (releventFlag) {
            tmp = dom.window.document.getElementById(sectionId);
            tmp = tmp.parentElement.nextElementSibling; 
            console.log("<-------- " + sectionId);
            while(tmp && !tmp.tagName.match("^H[1-6]$")) {
                console.log(tmp);
                wikt.dispatchSectionHandling(sectionId, tmp);
                tmp = tmp.nextElementSibling; 
            }
        }
    }

    return retval;
}

wikt._gatherContentSectionIds = function(element, list, path) {
    if(element.tagName == "LI") {
        // remove the hash sign from the ref
        var hashId = element.firstElementChild.hash.substr(1);
        path.push(hashId);
        var releventFlag = wikt.isPathRelevent(path); 
            // (wikt.parsingContext["releventIdsSet"].indexOf(hashId) > -1)?true:false;
        list["list"][hashId] = releventFlag; 
        list["list_length"]++;
        /* if(releventFlag)
            console.log("<------ " + path); */
    }
    if ( //(element.tagName == "LI" || element.tagName == "UL") && 
        element.children.length > 0)
        for(var a  = 0; a < element.children.length; a++)
        wikt._gatherContentSectionIds(element.children[a],  list, path);

    if(element.tagName == "LI") 
        path.pop();

    return list; 
}

