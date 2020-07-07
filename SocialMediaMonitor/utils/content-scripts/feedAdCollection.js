//The MIT License
//
//Copyright (c) 2018 Athanasios Andreou, <andreou@eurecom.fr>
//
//Permission is hereby granted, free of charge, 
//to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to 
//deal in the Software without restriction, including 
//without limitation the rights to use, copy, modify, 
//merge, publish, distribute, sublicense, and/or sell 
//copies of the Software, and to permit persons to whom 
//the Software is furnished to do so, 
//subject to the following conditions:
//
//The above copyright notice and this permission notice 
//shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
//IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
//ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




const NOT_FRONT_AD = 'adsCategoryTitleLink'; //Tag that if exists then frame is not front ad
const POLITICAL_AD= "entry_type=political_ad_subtitle" //allows us to detect political ads
var MORE_LINK_FRONT_LABEL = ['Story options', 'Options des actualités', "Options de l’actualité", 'Opciones de la historia', 'Meldungsoptionen', 'Story-Optionen', 'Επιλογές ανακοινώσεων', 'Επιλογές ανακoίνωσης', 'Opções da história', 'Opções do story', 'Opcije priče', 'Opzioni per la notizia', 'Opţiuni pentru articol', '动态选项', 'خيارات القصص', 'कहानी विकल्प', 'Опције приче', 'Параметры новостей', '記事オプション', '記事のオプション', 'ตัวเลือกเรื่องราว', 'Opcje zdarzeń'];
var EXPLANATION_TEXT = ["Why am I seeing this?", "Why am I seeing this ad", "Pourquoi est-ce que je vois ça ?", "Pourquoi je vois cette pub ?", "Pourquoi est-ce que je vois cette publicité?", "¿Por qué veo esto?", "¿Por qué veo este anuncio ?", "Warum wird mir das angezeigt?", "Warum sehe ich diese Werbeanzeige?", "Γιατί το βλέπω αυτό;", "Γιατί βλέπω αυτή τη διαφήμιση;", "Por que estou vendo isso?", "Por que estou vendo esse anúncio?", "Zašto mi se ovo prikazuje?", "Zašto mi se prikazuje ovaj oglas?", "Perché visualizzo questa inserzione?", "De ce văd asta?", "De ce văd această reclamă?", "为什么我会看到这条广告？", "لماذا أرى هذا الإعلان؟", "मुझे यह विज्ञापन क्यों दिखाई दे रहा है?", "Зашто ми се приказује ова реклама?", "Почему я вижу эту рекламу?", "この広告が表示されている理由", "ทำไมฉันจึงเห็นโฆษณานี้", "Dlaczego widzę tę reklamę?"];


/**
 * check if DOM element is hidden
 *
 * 
 * @param  {object}  el DOM element to be examined
 * @return {Boolean}    true if DOM element is hidden, else false
 */
function isHidden(el) {
    return (el.offsetParent === null)
}




/**
 * check if DOM element is scrolled into the view of the user
 *
 * 
 * @param  {object}  elem DOM element to be examined
 * @return {Boolean}      true if DOM element is scrolled into the view of the user else, false
 */
function isScrolledIntoView(elem)
{
    if (isHidden(elem)){
        return false
    }
//    return true
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

}







/**
 * check if DOM element is/was scrolled into the view of the user
 *
 * 
 * @param  {object}  elem DOM element to be examined
 * @return {Boolean}      true if DOM element is scrolled into the view of the user else, false
 */
function isWasScrolledIntoView(elem)
{

    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (elemBottom <= docViewBottom);
}






/**
 * filter out links that do not correspond to front ad links (sponsored) that are not hidden from array.
 * can detect ads that are tagged with the political tag, but for the rest, 
 * it currently cannot capture them for some users 
 * (TODO: check if it is for more users these days) due to 
 * changes in the way Facebook shows sponsored ad, 
 * so it should be used in combination with other functions that can detect front ads
 * 
 * @param  {Array} lst  array that contains links marked with the <a> tag
 * @return {Array}      array that contains only links are front Ad links (and not hidden)
 */
function filterFeedAds(lst) {
    var newLst = [];
    for (var i=0;i<lst.length;i++) {
        let ajaxify = lst[i].getAttribute('ajaxify');
        
        if ((ajaxify!=null) && (ajaxify.indexOf(POLITICAL_AD)>-1)   && (isScrolledIntoView(lst[i])) && (lst[i].getAttribute('class').indexOf(NOT_FRONT_AD)===-1)){
             newLst.push(lst[i]);
            continue
        }

        if ((SPONSORED.indexOf(lst[i].text)>=0 ) && (lst[i].getAttribute('class')) &&  (lst[i].getAttribute('class').indexOf(NOT_FRONT_AD)===-1) && (isScrolledIntoView(lst[i]))) {
            newLst.push(lst[i])

        }
        
                    if ((SPONSORED.indexOf(lst[i].text)>=0 ) && (lst[i].getAttribute('class')) &&  (lst[i].getAttribute('class').indexOf(NOT_FRONT_AD)===-1) && (!isScrolledIntoView(lst[i]))){
                console.log(lst[i])
                            console.log('*****************HIDDEN*************');

            }
    }
    
    return newLst
}



/**
 * filter out links that are not ads and are hidden, from the links 
 * that are signified as sponsored content through their class 
 * 
 * @param  {Array} lst  array that contains links marked with the <a> tag
 * @return {Array}      array that contains only links are front Ad links (and not hidden)
 */
function filteredClassedAds(lst) {
    var newLst = [];
    for (var i=0;i<lst.length;i++) {
        if ( (isScrolledIntoView(lst[i]))) {
            newLst.push(lst[i])

        }
        
                    if ((SPONSORED.indexOf(lst[i].text)>=0 ) && (lst[i].getAttribute('class')) &&  (lst[i].getAttribute('class').indexOf(NOT_FRONT_AD)===-1) && (!isScrolledIntoView(lst[i]))){
                console.log(lst[i])
                            console.log('*****************HIDDEN classed ads*************');

            }
    }
    
    return newLst
}






/**
 * return the ad div that corresponds to the whole ad object
 *
 * @param  {object} elem DOM element that is a child the ad DOM element
 * @return {object}      DOM element of the whole ad
 */
function getParentAdDiv(elem) {
    if (!elem){
        return undefined
    }

    if ((elem.id.length>0) && (elem.id.indexOf('hyperfeed_story_id')!==-1)){
        return elem;
    }
    return getParentAdDiv(elem.parentElement);
}



/**
 * filter out ads that have already been marked as collected
 *
 * @param  {array} ads array containing all the ads
 * @return {array}     array containing all the ads that have not been marked as collected
 */
function filterCollectedAds(ads) {
    var filteredAds = [];
    for (let i=0;i<ads.length;i++) {
        let ad = ads[i];
        if (ad.className.indexOf(COLLECTED)!=-1) {
            continue
        }
        filteredAds.push(ad);
    }
    return filteredAds;
}


/**
 * filter out css sheets that for sure do not contain the class of the sponsored tag
 * (to be used in older method that detects ads)
 * 
 * @param  {array} sheets array containing all the CSS sheets of the page
 * @return {array}        array containing sheets that for sure do not contain the class of the sponsored tag
 */
function filterSheets(sheets) {
    var filteredSheets = [];
    for (let i=0;i<sheets.length;i++){
        if (sheets[i].href && ((sheets[i].href.indexOf("https://www.facebook.com/rsrc.php")>-1) ||(sheets[i].href.indexOf("data:text/css; charset=utf-8,._")>-1)) )  {
            continue
        }
        filteredSheets.push(sheets[i])
    }
    return filteredSheets
}


/**
 * find the class name of the sponsored tag, if it is included in the page 
 * (old method that do not work any more)
 *
 * @param  {object} sheet css sheet
 * @return {string}       class name of string with the sponsored class
 */
function findSponsoredClass(sheet) {
    
    if ((!sheet.hasOwnProperty('rules')) || (!sheet.hasOwnProperty('cssRules'))) {
        return
    }
    
    let rules = sheet.hasOwnProperty('rules')?sheet.rules:sheet.cssRules
    if (!rules) {
         console.log(rules)
        return 
    }
    
    for (var i=0;i<rules.length;i++) {
        if (!rules[i].cssText) {
            continue
        }
        
        var text = rules[i].cssText;
        for (let k=0;k<SPONSORED.length;k++) {
            if (text.indexOf('::after { content: "'+SPONSORED[k]+'"; }')>-1) {
            return text.replace('::after { content: "'+SPONSORED[k]+'"; }','')
        }
            
        }
        
        
    }
    return 
}







/**
 * find front ads that can be detected throught their css class 
 * (old method that doesn't work any more)
 * 
 * @return {array} array of front ad objects
 */
function getFeedAdsByClass() {
    
    var sheets = document.styleSheets;
    var filteredSheets = filterSheets(sheets);
    var sponsoredClass = getSponsoredFromClasses(filteredSheets) 
    
    if (!sponsoredClass) {
        return []
    }
    
    return filteredClassedAds(document.getElementsByClassName(sponsoredClass));

    
}



/**
 * Get text of children of DOM element that is visible
 * 
 * @param  {array} children array that contains children of DOM element
 * @return {string}         non hidden text that is included in the DOM elements of children array
 */
function getNonHiddenTextByChildren(children){
        var txt = ''
    
    for (let i=0;i<children.length;i++) {
        
        if ((getComputedStyle(children[i])['font-size'] === "0px") || (getComputedStyle(children[i])['opacity'] === "0")  ){
            continue;
        }
        txt += children[i].innerText;
    }
    
    return txt
}


// 
/**
 * checks if link contains hidden sponsored letters. 
 * Facebook currently adds in the "sponsored" tag hidden letters with font-size:0px or opacity of 0, 
 * so this is required to find sponsored tags
 *
 * @param  {object}  elem DOM element(link) to be examined
 * @return {Boolean}      true if it contains the masked "Sponsored" tag, else false
 */
function isLinkSponsoredHiddenLetters(elem) {
    if (elem.children.length!==1) {
        return false;
    }
    
    if (elem.children[0].children.length===0) {
        return false;
    }
    
    var children = elem.children[0].children;
    
    var tag = getNonHiddenTextByChildren(children);

    for (let i=0;i<SPONSORED.length;i++) {
        if (tag===SPONSORED[i]) {
            return true;
        }
    }
    
    return false
}


/**
 * Get text of children of DOM element that is visible (revision August 2019)
 * 
 * @param  {array} children array that contains children of DOM element
 * @return {string}         non hidden text that is included in the DOM elements of children array
 */
function getNonHiddenTextInAttributeByChildren(children){
    var txt = '';
    // console.log(children)
    //some weird timestamp thing that appears some times
    if (children.length==1){
        return txt
    }
    for (let i=0;i<children.length;i++) {

        var node = children[i];

        if (!node.hasAttribute('data-content')) {

            var child = children[i].childNodes;
        // console.log(child)
            if ((child==null) || (child.length!=1)) {
                continue

            }

            node = child[0]

        }

        // console.log(typeof(child),getComputedStyle(child))

        
        if ((getComputedStyle(node)['display'] != "inline")  ){
            continue;
        }
        txt += node.getAttribute('data-content')
    }
    
    return txt
}


/**
 * checks if link contains hidden sponsored letters (revision August 2019). 
 * Facebook  adds in the "sponsored" tag hidden letters that have a "display" of none
 * and their values are stored as attribute values of the data-content attribute
 * so this is required to find sponsored tags
 * In this method we capture the parent of the sponsored tag
 *
 * @param  {object}  elem DOM element(subtitle tag) to be examined
 * @return {Boolean}      true if it contains the masked "Sponsored" tag, else false
 */
function isSpanSponsoredTagHiddenLettersAttributeValues(elem){

    var children = elem.childNodes;

    if ((children==null) || (children.length==0)) {
        return false;
    }

    var firstChild = children[0];

    var linkChild = firstChild.getElementsByTagName('a');

    if ((linkChild==null) || (linkChild.length!=1)) {
        //TODO:SEND MESSAGE IF LENGTH  IS NOT 1
        //
        return false;
    }

    linkChild = linkChild[0];

    linkChildChild = linkChild.childNodes;

    if ((linkChildChild==null) || (linkChildChild.length!=1)) {
        //TODO:SEND MESSAGE IF LENGTH  IS NOT 1
        //
        return false;
    }

    linkChildChild = linkChildChild[0];

    sponsoredChildren = linkChildChild.childNodes;

    if ((sponsoredChildren==null) || (sponsoredChildren.length==0)) {
        return false;
    }


    var tag = getNonHiddenTextInAttributeByChildren(sponsoredChildren);

    for (let i=0;i<SPONSORED.length;i++) {
        if (tag===SPONSORED[i]) {
            return true;
        }
    }
    
    return false



}









/**
 * check if sponsored link is hidden based on its computed style.
 * 
 * @param  {object}  el DOM object that corresponds to the sponsored link
 * @return {Boolean}    true if its computed style is None 
 * which means that it does not appear. 
 */
function isSponsoredLinkHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}


/**
 * return Front ads that contain links with the masked "Sponsored" tag
 * 
 * @return {array} array of links that contain the sponsored tag
 */
function findFeedAdsWithHiddenLetters() {
    var elems = document.getElementsByTagName('a');
    var links = [];
    for (let i=0;i<elems.length;i++) {
        if ((isLinkSponsoredHiddenLetters(elems[i])) && (isScrolledIntoView(elems[i]))) {
            links.push(elems[i]);
        }
    }
    
    return links;
    
}






/**
 * add links that are marked with the class name of GRAB_ME (for test reasons)
 * 
 * @param  {array} links links that have the sponsored tag
 * @return {array}       links that have the sponsored tag + links that hae the class name GRAB_ME
 */
function getGrabbed(links){
    var elems=document.getElementsByClassName(GRAB_ME)
    for (let i=0;i<elems.length;i++) {
        links.push(elems[i])
        elems[i].classList.remove(GRAB_ME)
    }
    return links
}







/**
 * get all children of a DOM element (skip specific element)
 *
 * @param  {object} n      DOM element to be examined
 * @param  {object} skipMe DOM element to be excluded from the list
 * @return {array}         array of DOM elements that are children of n
 */
function getChildren(n, skipMe){
    var r = [];
    for ( ; n; n = n.nextSibling ) 
       if ( n.nodeType == 1 && n != skipMe)
          r.push( n );        
    return r;
};


/**
 * get siblings of DOM element n
 * 
 * @param  {object} n DOM element n
 * @return {array}    array containing all DOM siblings of n
 */
function getSiblings(n) {
    return getChildren(n.parentNode.firstChild, n);
}



/**
 * return siblings of element that have sponsored tag 
 * (different way of masking sponsored tag where the link 
 * is a sibling of the elements that contain the masked "Sponsored tag")
 * 
 * @param  {object} n DOM element n
 * @return {array}    array containing all DOM siblings of n
 */
function areSiblingsSponsored(elem){

    var siblings = getSiblings(elem);

    for (let i=0;i<siblings.length;i++) {
        if (isLinkSponsoredHiddenLetters(siblings[i])) {
            return true;
        }
    }

    return false;

}


/** 
 * find all links whose siblings contain the "Sponsored" tag
 *
 * @return {array} array containing all the sponsored links
 */
function findFeedAdsWithHiddenLettersSiblings(){
    var linksPrivacy = document.getElementsByClassName('uiStreamPrivacy')

    var links = [];

    for (let i=0;i<linksPrivacy.length;i++) {
        if (areSiblingsSponsored(linksPrivacy[i])) {
            links.push(linksPrivacy[i])        
        }
    }

    return links;

}



/** 
 * find all elements that contain the "Sponsored" tag when we have hidden letters 
 * and letters are stored as attribute values
 *
 * @return {array} array containing all the sponsored links
 */
function findFeedAdsWithHiddenLettersAttributeValues() {
    var linksSubtitles= $("[data-testid=fb-testid_feed-subtilte]")

    var links = [];
    for (let i=0;i<linksSubtitles.length;i++) {
        // if ((isSpanSponsoredTagHiddenLettersAttributeValues(linksSubtitles[i])) && (!isSponsoredLinkHidden(linksSubtitles[i]))) {
        if ((isSpanSponsoredTagHiddenLettersAttributeValues(linksSubtitles[i])) && (isScrolledIntoView(linksSubtitles[i]))) {

            links.push(linksSubtitles[i]);
        }
    }
    
    return links;
}

/**
 * checks if sponsored tag is hidden by bold elements (generally in the new interface"
 *
 * Facebook devide the sponsored tag letters into many bold fields, and seperate the letters with -
 *
 * @param  {object}  elem DOM element(link) to be examined
 * @return {Boolean}      true if it contains the masked "Sponsored" tag, else false
 */

function isLinkSponsoredHiddenInBoldElement(elem) {
    let linkText = elem.textContent;
    linkText = linkText.split("-").join("")
    for (let i=0; i<SPONSORED.length; i++) {
        if(linkText === SPONSORED[i]) {
            return true;
        }
    }

    return false;
}



/**
 * return Front ads that contain links with the "Sponsored" tag devided into b elements
 *
 * @return {array} array of links that contain the sponsored tag
 */

function findFeedAdsWithLettersInBoldElements() {
    var elems = document.getElementsByTagName('a');
    var links = [];
    for(let i=0; i<elems.length; i++){
        if ((isLinkSponsoredHiddenInBoldElement(elems[i])) && (isScrolledIntoView(elems[i]))) {
            links.push(elems[i]);
        }
    }

    return links;
}


/**
 * return Front ads that contain links with the "Sponsored" tag devided into b elements and not contained in a element
 *
 * @return {array} array of links that contain the sponsored tag
 */

function findFeedAdsWithLettersInBoldElementsNotContainedInLinks() {
    var elems = $("img[width=12]");
    var max_depth = 5;
    var links = [];
    for(let i=0; i<elems.length; i++){
        var currentElement = elems[i];
        var found = false;
        var j=0;
        while (found ===false && j<max_depth) {
            currentElement = currentElement.parentElement;
            if(currentElement === null || currentElement === undefined) {
                j = max_depth;
            }
            else if (currentElement.getElementsByTagName('b').length > 0 ){
                currentElement = currentElement.getElementsByTagName('b')[0];
                found = true;
            }
            j++;
        }
        if(found) {
            if(isLinkSponsoredHiddenInBoldElement(currentElement) && isScrolledIntoView(elems[i])) {
                links.push(currentElement)
            }
        }

    }



    return links;

}

/**
 * get all front ad DOM elements. Since several methods have been employed over the years,
 * and Facebook is known to return to old methods from time to time, we use all methods in conjuction
 * 
 * 
 * @return {array} array containing all front ads
 */
function getFeedAdFrames(funParent=getParentAdDiv) {
    console.log("begin Get Feed Ad frames");
    var links = document.getElementsByTagName('a');
    

    links = filterFeedAds(links);

    Array.prototype.push.apply(links,getFeedAdsByClass());

    
    
    Array.prototype.push.apply(links,findFeedAdsWithHiddenLetters());

    Array.prototype.push.apply(links,findFeedAdsWithHiddenLettersSiblings());
    Array.prototype.push.apply(links,findFeedAdsWithHiddenLettersAttributeValues());

    Array.prototype.push.apply(links, findFeedAdsWithLettersInBoldElements());
    console.log("11111111111111111111");
    Array.prototype.push.apply(links, findFeedAdsWithLettersInBoldElementsNotContainedInLinks());
    console.log("2222222222222222222");
    console.log(links);

    links = links.unique();

    
    links = getGrabbed(links);

    var already_in_list = new Set([]);
    console.log(links)
    var frontAds = [];
    for (var i=0;i<links.length;i++) {
        var link = links[i];
        var frame = funParent(link);


        if (frame===undefined || already_in_list.has(frame.id)) {
            continue
        }

        frontAds.push(frame);  
        already_in_list.add(frame.id)  
    }
    console.log("end Get Feed Ad frames");
    console.log(frontAds);
    return filterCollectedAds(frontAds);
    
    
}







/**
 * return landing pages and images from the front ads. 
 * Currently landing pages are not updated, so we collect only a subset.
 *
 * @param  {array} links    array of link DOM elements that are included in the front ad
 * @param  {object} frontAd DOM element of the front ad
 * @return {array}          array (essentially tuple) that contains the landing page urls and the image urls
 */
function getLandingPagesFeedAds(links,frontAd) {
    var landingPages = getURLsFromString(frontAd.outerHTML);
    var images = []
    for (let i=0;i<links.length;i++) {
        let link = links[i];
        let onmouseover= link.getAttribute('onmouseover');
        if (!onmouseover) {
            continue
        }
        
        let imgs = link.getElementsByTagName('img');
        if (imgs.length>0) {
            for (let j=0;j<imgs.length;j++) {
                if (imgs[j].src) {
                    images.push(imgs[j].src)   
                    continue
                }
                    console.log(imgs[j])
            }
        }
        if ( (onmouseover.indexOf('LinkshimAsyncLink')===-1)) {
            continue
        }
        
        
        let urls = onmouseover.match(/"[\s\S]*"/);
        if (!urls) {
            continue
        }
        
        
        landingPages.extend(urls);
        
    }
    
    
        var additionalImages = frontAd.getElementsByClassName('scaledImageFitWidth');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
        var additionalImages = frontAd.getElementsByClassName('scaledImageFitHeight');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
    
      var additionalImages = frontAd.getElementsByClassName('_kvn img');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    

    return [landingPages.unique(),images.unique()];
}







/**
 * return advertiser id from the front ad
 *
 * 
 * @param  {object} frontAd DOM element of the front ad
 * @return {string}         advertiser id
 */
function getAdvertiserId(frontAd) {
    let links = frontAd.getElementsByTagName('a');
    let link = null
    for  (let i=0;i<links.length;i++) {
        if (links[i].hasAttribute('data-hovercard') && (links[i].getElementsByTagName('img').length>0)) {
            link = links[i];
            break
        }
    }
    
    if (!link) {
        links = frontAd.getElementsByClassName("oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 q9uorilb mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l oo9gr5id");
        for(let i=0; i < links.length; i++) {
            if((links[i].tagName === 'A') && (links[i].getElementsByTagName('img').length > 0 || links[i].getElementsByTagName('image').length > 0)) {
                link = links[i];
                var advertiserId = '-1';
                let facebookPage = link.href.substring(0, link.href.indexOf('?'));
                let advertiserImage = link.getElementsByTagName('img')[0].src;
                return [advertiserId,facebookPage,advertiserImage];
            }
        }
        if(!link) {
            return
        }

    }
    
    var advertiserId = '-1';
    try {
         let hovercard = link.getAttribute('data-hovercard')
//    var urlad = new URL(hovercard);
         advertiserId = hovercard.match(/id=?[0-9]+/)[0].match(/[0-9]+/)[0]
//     advertiserId= urlad.searchParams.get("id");
    if (!isNumeric(advertiserId)) {
        advertiserId ='-1';
    }
        
    } catch (e) {
        console.log(e)
    }
   
    let facebookPage = link.href.substring(0, link.href.indexOf('?'));
    let advertiserImage = link.getElementsByTagName('img')[0].src
    return [advertiserId,facebookPage,advertiserImage]
    
}





/**
 * check if front ad contains a video
 * 
 * @param  {object}  frontAd DOM element of front ad
 * @return {Boolean}         true if front ad has a video, else false
 */
function isVideo(frontAd) {
    return frontAd.getElementsByTagName('video').length>0
}


/**
 * get video id of front ad video
 * 
 * @param  {object} frontAd DOM element of front ad
 * @return {string(TODO: check if number)}         video id of front ad
 */
function getVideoId(frontAd) {
    let videoId=null;
    inputs = frontAd.getElementsByTagName('input');
    for (let i=0;i<inputs.length;i++) {
        if (inputs[i].getAttribute('name') === 'ft_ent_identifier') {
            videoId = inputs[i].getAttribute('value');
        }
    }
    return videoId
}





/**
 * return the image urls of background elements. Essentially grabs the preview snapshot of a video.
 * @param  {object} frontAd DOM element of front ad
 * @return {[array]}        array of background image urls
 */
function getBackgroundUrlImages(frontAd) {
    let images = [];
    

    var additionalImages = frontAd.getElementsByTagName('img');
    for (let i=0;i<additionalImages.length;i++) {
        if (additionalImages[i].outerHTML.indexOf("background-image: url")>-1) {
            let backgroundImage = additionalImages[i].style.backgroundImage.replace('url("','')
            backgroundImage = backgroundImage.slice(0,backgroundImage.length-2)
            images.push(backgroundImage);
        }
    }
        

    return images;
    
}





/**
 * processes feed ad object adding in the object 
 * all the data/meta data that we save in the server (except of explanation of the ad)
 * 
 * @param  {object} feedAd DOM element of the front ad
 * @return {object}         object to be send to the server
 */
function processFeedAd(frontAd) {
    //frontAd.className += " " + COLLECTED;
    var html_ad_id = frontAd.id;
    ADSA  =  frontAd;
    let  info  =  getAdvertiserId ( frontAd ) ;
    var advertiser_facebook_id = info ? info[0] : "";
    var advertiser_facebook_page = info ? info[1] : "";
    var advertiser_facebook_profile_pic = info ? info[2] : "";
    var raw_ad = frontAd.innerHTML;
    // var raw_ad = frontAd.outerHTML;
    var  timestamp  =  ( new  Date ) . getTime ( ) ;
    var  pos  =  getPos ( frontAd ) ;
    var  offsetX  =  pos.x ;
    var  offsetY  =  pos.y;
    var type = TYPES.frontAd;
    var [landing_pages, images] = getLandingPagesFeedAds(frontAd.getElementsByTagName('a'), frontAd);
    var  video  =  isVideo ( frontAd )
    var  video_id  =  ''
    if (video) {
        video_id = getVideoId(frontAd);
        images = getBackgroundUrlImages(frontAd);
    }

    var  user_id  =  getUsertiId ( ) ;

    //check position ad visible state of ad at time when ad collected
    try{
        var ad_elem = document.getElementById(html_ad_id);
        var  domPos  =  getElementCoordinate ( ad_elem )
        var  relPos  =  toRelativeCoordinate ( domPos )
        var isInView = (relPos == undefined) ? false : true;
        var visible_fraction = []
        if (relPos != undefined) {
            var visible_state = getVisibleHeight(ad_elem);
            visible_fraction = (visible_state[2] >= 0) ? (visible_state[0] / visible_state[1]) :
                (-visible_state[0] / visible_state[1]);
        }
    }catch(e){
        console.log('Error while compute ad position');
        console.log(e);
    }
    return { 'raw_ad': raw_ad, 'html_ad_id': html_ad_id, 'visible': isInView, 'visible_fraction': visible_fraction, 'visibleDuration': [], 'timestamp': timestamp, 'offsetX': offsetX, 'offsetY': offsetY, 'type': type, 'landing_pages': landing_pages, 'images': images, 'user_id': user_id, advertiser_facebook_id: advertiser_facebook_id, advertiser_facebook_page: advertiser_facebook_page, advertiser_facebook_profile_pic: advertiser_facebook_profile_pic, video: video, video_id: video_id }
}






/**
 * get the DOM element that cprresponds to the more button of the (TODO: make sure it is only front) ad
 *
 * 
 * @param  {object} adFrame DOM element of the ad
 * @return {object}         more button DOM element
 */
function getMoreButtonFrontAd(adFrame) {
    var links = adFrame.getElementsByTagName('a');
    for (var i=0;i<links.length;i++) {
        if (MORE_LINK_FRONT_LABEL.indexOf(links[i].getAttribute("aria-label"))>=0) {
            return links[i]
        }
    }
    
    
    
}



/**
 * return the id of the "More" button to be used to match it with the more button in the overloaded script
 * @param  {object} adFrame DOM element of the front ad
 * @return {string}         id of the "More" button
 */
function getButtonId(adFrame) {
    var moreButton = getMoreButtonFrontAd(adFrame);
    return moreButton.parentElement.id;
}

/**
 * hover over the front ad's "More" button. This triggers the an ajax request to Facebook
 * which retrieves the more button contents, including the parameters 
 * embeded in the "Why Am I Seiing This?" button.
 * 
 * @param  {object} adFrame DOM element of the front ad
 * @return 
 */
function hoverOverButton(adFrame) {
    
    var moreButton = getMoreButtonFrontAd(adFrame);
    moreButton.dispatchEvent(new MouseEvent('mouseover'));
}



