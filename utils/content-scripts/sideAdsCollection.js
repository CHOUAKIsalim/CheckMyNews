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



const MENU_LABEL = ["Report or learn more", "Signaler ou en savoir plus", "Reportar u obtener más información", "Melde dies oder erfahre mehr darüber", "Υποβάλετε αναφορά ή μάθετε περισσότερα", "Denuncie ou saiba mais", "Prijavi ili saznaj više", "Segnala od ottieni maggiori informazioni", "Raportează sau află mai multe"];

const DOM_AD = 'domAD'; //json key for storing the source code of a side adß


function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}




/**
 * extract ad id and the rest of the parameters required to build the explanation url
 * for the ad from the "ajaxify" attribute value (for sideads)
 *
 * @param  {string} resp string to search for the ajaxify parameter
 * @return {object}      parameters to build the explanation url and the ad id
 */
function grabParamsFromSideAdAjaxify(resp) {
    var text = resp.replaceAll('\\\\\\','\\').replaceAll('\\\\','\\').replaceAll('amp;','');
    var requestParams = text.match( /"\\\/waist_content\\\/dialog\S+?"/ )[0].replace('"\\\/waist_content\\\/dialog\\\/?','');
    // requestParams.slice(0,requestParams.length-2)
    requestParams = decodeURIComponent(unicodeToChar(requestParams.slice(0,requestParams.length-2)));
    var serialized = requestParams.match('serialized_nfx_action_info={(.*)}')[1];
    requestParams = requestParams.replaceAll(serialized,encodeURIComponent(serialized));
    var clientToken = requestParams.match(/client_token=(.*?)&/)[1];
    var adId = requestParams.match(/id=[0-9]+/)[0].match(/[0-9]+/)[0];
    return {requestParams:requestParams,adId:adId,clientToken:clientToken};

}





/**
 * return all menu button elements in a DOM element (they contains the "Why Am I Seeing this?"  BUtton).
 * (for a single side ad, it should be only one). Detected by the "Report or learn more" title
 *
 *
 * @param  {object} doc DOM element to be examined
 * @return {Array}      array containing all menu DOM elements that were detected
 */
function get_dropdown_ad_menus(doc){
    var links = doc.getElementsByTagName('a');
    var menus = [];
    for (var i=0;i<links.length;i++){
        var link = links[i];
        var menuLabel = link.getAttribute("aria-label");
        if ((menuLabel) && (MENU_LABEL.indexOf(menuLabel)>=0)) {
            menus.push(link)
        }
    }
    return menus

}






/**
 * return the side ads in the page.
 *
 * @return {object} object containing all the sideads in the page (their ad id is the key of each side ad)
 */
function getSideAds() {
    var ads = {};
    var menus = get_dropdown_ad_menus(document);
    for (var i=0;i<menus.length;i++) {
        var menu = menus[i]
//        putting quotes in numbers because of javascript mismanagement of bigints
        if (filterCollectedAds([menu.parentElement.parentElement.parentElement]).length==0) {
            continue
        }
        var adId = JSON.parse(menu.getAttribute('data-gt').replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3"))['data_to_log']['ad_id'].toString()
        var advertiserId = JSON.parse(menu.getAttribute('data-gt').replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3"))['data_to_log'] ['ad_account_id'].toString();
        var isCollected = false;



        ads[adId] ={};
        ads[adId][DOM_AD] =menu.parentElement.parentElement.parentElement;
        ads[adId]['ad_account_id'] = advertiserId;
    }

    return ads
}





/**
 * return landing pages and images from the side ads.
 * Currently landing pages are not updated, so we collect only a subset.
 *
 * @param  {array} links    array of link DOM elements that are included in the front ad
 * @param  {object} sideAd DOM element of the front ad
 * @return {array}          array (essentially tuple) that contains the landing page urls and the image urls
 */
function getLandingPagesSideAds(links,sideAd) {
    var landingPages = [];
    var images = []
    for (let i=0;i<links.length;i++) {
        let link = links[i];
        let onmousedown= link.getAttribute('onmousedown');
        if (!onmousedown) {
            continue
        }

        let imgs = link.getElementsByTagName('img');
        if (imgs.length>0) {
            for (let j=0;j<imgs.length;j++) {
                if (imgs[j].src) {
                    images.push(imgs[j].src)
                    continue
                }
            }
        }



        let urls = [link.href]
        if (!urls) {
            continue
        }


        landingPages.extend(urls);

    }

    var additionalImages = sideAd.getElementsByClassName('scaledImageFitWidth');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }

    var additionalImages = sideAd.getElementsByClassName('scaledImageFitHeight');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }


    var additionalImages = sideAd.getElementsByClassName('_kvn img');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }


    return [landingPages.unique(),images.unique()];

}






/**
 * processes side ad object adding in the object
 * all the data/meta data that we save in the server (except of explanation of the ad)
 *
 * @param  {object} frontAd DOM element of the side ad
 * @return {object}         object to be send to the server
 */
function processSideAd(sideAdObj,adId) {

    var sideAd = sideAdObj[DOM_AD];
    sideAd.className += " " + COLLECTED;

    var raw_ad = sideAd.innerHTML;
    var timestamp = (new Date()).getTime();
    var pos = getPos(sideAd);
    var offsetX = pos.x;
    var offsetY = pos.y;
    var type = TYPES.sideAd;
    var [landing_pages,images] = getLandingPagesSideAds(sideAd.getElementsByTagName('a'),sideAd);

    //TODO:GET IMAGE URL
//    var image_url = 
    var fb_id = adId;
    var fb_advertiser_id = sideAdObj['ad_account_id'];
    var user_id = getUserId();
    return {'raw_ad':raw_ad,'timestamp':timestamp,'offsetX':offsetX,'offsetY':offsetY,'type':type,'user_id':user_id,'fb_id':fb_id,'fb_advertiser_id':fb_advertiser_id,landing_pages:landing_pages,images:images}


}
