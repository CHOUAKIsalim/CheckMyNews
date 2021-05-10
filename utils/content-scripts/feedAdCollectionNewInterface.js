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






/**
 * return the ad div that corresponds to the whole ad object
 *
 * @param  {object} elem DOM element that is a child the ad DOM element
 * @return {object}      DOM element of the whole ad
 */
function getParentAdDivNewInterface(elem) {
    if(elem === null) {
        return
    }
    if (elem.getAttribute('data-pagelet') && (elem.getAttribute('data-pagelet').indexOf("FeedUnit_")!==-1)){
        return elem;
    }
    return getParentAdDivNewInterface(elem.parentElement);
}



/**
 * generate a unique string id with 'AdAn' as prefix. users performance.now() function
 *  which counts number of microseconds since page load as well as randomnumber making it exteremely hard
 *  to have collisions
 * @return {strint} unique string id
 */
function generateUniqueId(){
    let randomNum = Math.random().toString(36);
    let timeSincePageLoad = performance.now().toString(36);
    let time = new Date().getTime().toString(36);
    return 'AdAn'+randomNum+timeSincePageLoad+time;
}


function markAd(frontAd){
    if (frontAd.getAttribute('adan')) {
        return frontAd.getAttribute('adan');
    }

    let mark  = document.createAttribute('adan');
    mark.value = generateUniqueId();
    frontAd.setAttributeNode(mark);

    /********************** For mouse tracking *************/
    let addedId = document.createAttribute('id');
    addedId.value = mark.value;
    frontAd.setAttributeNode(addedId);


    return mark.value;
}
/**
 * processes front ad object adding in the object 
 * all the data/meta data that we save in the server (except of explanation of the ad)
 * 
 * @param  {object} frontAd DOM element of the front ad
 * @return {object}         object to be send to the server
 */
function processFeedAdNewInterface(frontAd) {

 //   frontAd.className += " " + COLLECTED;
    var user_id = getUserId();
    var adanalystAdId = markAd(frontAd);
    var html_ad_id = adanalystAdId;
    var raw_ad = frontAd.innerHTML;
    var timestamp = (new Date).getTime();
    var pos = getPos(frontAd);
    var offsetX = pos.x;
    var offsetY = pos.y;
    var type = TYPES.frontAd;


    //check position ad visible state of ad at time when ad collected
    try{
        var ad_elem = document.getElementById(html_ad_id);
        var  domPos  =  getElementCoordinate ( ad_elem );
        var  relPos  =  toRelativeCoordinate ( domPos );
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


    return {adanalyst_ad_id:adanalystAdId,raw_ad:raw_ad,timestamp:timestamp,'offsetX':offsetX,'offsetY':offsetY,'type':type,'landing_pages':[],user_id:user_id, 'html_ad_id': html_ad_id, 'visible': isInView, 'visible_fraction': visible_fraction, 'visibleDuration': []}
    
 


}

