var MOUSE_CLICK_DATA = 'mouse_click_data';
var MOUSE_MOVE_DATA = 'mouse_move_data';
var AD_VISIBILITY_DATA = 'ad_visibility_data';
var POST_VISIBILITY_DATA = 'post_visibility_data';
var removeLikeEventType = "removeLike";
var likeEventType = "Like";
var LikeButtonAllReactionsEventType = "LikeButtonAllReactionsEventType";
var loveEventType = "Love";
var hahaEventType = "Haha";
var wowEventType = "Wow";
var careEventType = "Care";
var sadEventType = "Sad";
var angryEventType = "Angry";
var commentButtonClickEventType = "CommentButtonClick";
var commentWritingEventType = "CommentWriting";
var shareEventType = "Share";
var advertiserPageCheckType = "AdvertiserPageCheck";
var advertiserPageRightClickType = "RightClickOnAdvertiser";
var advertiserLogoRightClick = "RightClickOnAdvertiserLogo";
var advertiserCheck = "AdvertiserCheck";
var visitingLandingUrlEventType = "VisitingLandingURL";
var rightClickOnLandingUrlEventType = "RightClickOnLandingUrl";
var minDifferenceForAdvertiserCheck = 1000; // 1 second
var imageClickedEventType = "ImageClicked";
var rightClickOnImage = "RightClickOnImage";
var carouselNextEvent = "AdCarouselNext";
var carouselPreviousEvent = "AdCarouselPrevious";
var previousCarouselListenerAdded = 0;
var hahaText = "Haha";
var englishCareText = "Care";
var frenchCareText = "Solidaire";
var englishWowText = "Wow";
var frenchWowText = "Wouah";
var lastEventType = "";

var commentWritingDivClass = "notranslate _5rpu";
var likeColor = "rgb(28, 30, 33)";
var loveColor = "rgb(243, 62, 88)";
var hahaColor = "rgb(247, 177, 37)"; // Same for haha Wow and Sad
var angryColor = "rgb(233, 113, 15)";


var isOnMessaging = false;
var POST_QUEUE= {};

var Ad_Visible_INTERVAL = 500;
var Post_Visible_INTERVAL = 500;

var lastScrolledTs = 0;

var checkScrollSpeed = (function(){
    var lastPos, newPos, timer, delta;
    var delay =  500; // in "ms" (higher means lower fidelity )

    function clear() {
        lastPos = null;
        delta = 0;
    }

    clear();

    return function () {
        newPos = window.scrollY;
        if (lastPos != null) {
            delta = newPos - lastPos;
        }
        lastPos = newPos;
        clearTimeout(timer);
        timer = setTimeout(clear, delay);
        if ((Date.now() - lastScrolledTs) > 500) {
            lastScrolledTs = Date.now();
            return delta;
        }

        return 0;
    };
})();

chrome.storage.sync.set({"last_time": new Date().getTime()});


function storeAdClickEvent(ad, type, trial = 0, time = Date.now()) {

    lastEventType = type;
    let eventData = {
        'ts' : time,
        'dbId' : ad.dbId,
        'user_id': getUserId(),
        'type' : type
    };
    eventData[MSG_TYPE] = MOUSE_CLICK_DATA;

    if(eventData['dbId'] !== undefined)  {
        chrome.runtime.sendMessage(eventData);
    } else {
        if (trial < 3){
            console.log("dbId is undefined.. try again");
            setTimeout(function () {storeAdClickEvent(ad, type,trial+1, time)},3000);
        }
    }



}


function storeAdVisibilityEvent(ad, start_ts, end_ts, trial = 0){

    let eventData = {
        'dbId':ad.dbId,
        'user_id':getUserId(),
        'started_ts': start_ts,
        'end_ts': end_ts
    };
    eventData[MSG_TYPE] = AD_VISIBILITY_DATA;


    if (eventData['dbId'] !== undefined) {
        chrome.runtime.sendMessage(eventData);
    } else {
        if (trial < 3) {
            console.log("dbId is undefined.. try again");
            setTimeout( function () {storeAdVisibilityEvent(ad, start_ts, end_ts,trial + 1)},3000);
        }
    }
}

function storePostVisibilityEvent(post_id,start_ts,end_ts,) {
    let eventData = {
        'html_post_id':post_id,
        'user_id': getUserId(),
        'started_ts': start_ts,
        'end_ts': end_ts
    };
    eventData[MSG_TYPE] = POST_VISIBILITY_DATA;


    chrome.runtime.sendMessage(eventData);

}

function storeAdMouseMove(ad, mouseData, trial = 0){
    let eventData = {
        'dbId': ad.dbId,
        'user_id': getUserId(),
        'timeElapsed': mouseData.timeElapsed,
        'frames':JSON.stringify(mouseData.frames),
        'window':JSON.stringify(mouseData.window),
        'lastAdPosition':JSON.stringify(mouseData.lastAdPosition),
        'imagePostion':JSON.stringify(mouseData.imagePosition)
    };

    eventData[MSG_TYPE] = MOUSE_MOVE_DATA  ;

    if (eventData['dbId'] !== undefined) {
        chrome.runtime.sendMessage(eventData);
    } else {
        if (trial < 3) {
            console.log("dbId is undefined.. try again");
            setTimeout(function () {storeAdMouseMove(ad, mouseData, trial + 1)},2000);
        }
    }
}


function MouseTrack(ad) {
    var ad_extract = document.getElementById(ad.html_ad_id);
    ad_extract.addEventListener('mouseenter', function () {
        mus.record();
    });

    ad_extract.addEventListener('mouseleave', function () {
        mus.stop();
        let mouseData = { ...mus.getData() };
        //compute relative coordinates of the ad
        let p = toRelativeCoordinate(getElementCoordinate(this));
        if (p != undefined) {
            mouseData['lastAdPosition'] = p;
        }
        //compute relative coordinates of image inside this ad

        // var ad_extract = document.getElementById(ad.html_ad_id);
        let mediaClassNames = ['uiScaledImageContainer', '_1ktf', '_5cq3', '_3chq', '_m54', '_kvn', 'scaledImageFitWidth img'];
        var ad_image_extract = undefined;
        for (let i in mediaClassNames) {
            ad_image_extract = this.getElementsByClassName(mediaClassNames[i]);
            if (ad_image_extract.length > 0) { break; }
        }

        if (ad_image_extract[0] != undefined) {
            //ad_image_extract.addEventListener("mouseenter", function () {
            //if(ad_image_extract[0] != undefined){
            let pImg = toRelativeCoordinate(getElementCoordinate(ad_image_extract[0]));
            if (pImg != undefined) {
                mouseData['imagePosition'] = pImg;
            }
            //}
        }

        storeAdMouseMove(ad,mouseData);
        mus.release(); //Clear all old data

    });

}

/**
 * convert static coordinates to relative coordinate
 * @param {Array} array of [top,lef, bottom,right] static coordinate
 * @return {Array} [top, left,bottom,right] relative coordinate
 */
function toRelativeCoordinate(coordinates) {
    if (coordinates == undefined) {
        return undefined;
    }

    let A = coordinates.slice();
    let elmHeight = A[2] - A[0];
    let screen = getUserView(); //[top,bottom]
    //Element is in user view
    if ((A[2] <= screen[1]) && (A[0] >= screen[0])) {
        A[0] -= screen[0];
        A[2] = A[0] + elmHeight
        return  A
    }
    //Invisible (bellow or abve)
    else if (A[0] > screen[1] || A[2] < screen[0]) {
        return undefined
    }
    //Partially visible
    else {
        if (A[0] >= screen[0]) { //upper part is visible
            A[0] -= screen[0];
            A[2] = screen[1] - screen[0];
            return  A
        }
        else if (A[2] <= screen[1]) { //lower part is visible
            A[0] = 0;
            A[2] = A[2] - screen[0];
            return  A
        }
        else {
            return undefined
        }
    }
}

/**
 * get the limit of user view
 *
 *
 * @param  {object}  elem DOM element to be examined
 * @return {Array}   return [top,bottom] of user view
 */
function  getUserView ( )  {

    //    return true
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    return [docViewTop, docViewBottom]

}


function getElementCoordinate(elem) {
    if (elem == undefined || isHidden(elem)) {
        return undefined
    }

    var elemTop = $(elem).offset().top;
    var elemLeft = $(elem).offset().left;
    var  elemBottom  =  elemTop  +  $ ( elem ).height ( ) ;
    var elemRight = elemLeft + $(elem).width();

    return [elemTop, elemLeft, elemBottom, elemRight]
}


/**
 * Checking for visible ads:
 * - set start_visible_timestamp
 * - setTimeout to checkAdInvisible(ads)
 */
function checkAdVisibleDuration() {
    let currTs = (new Date()).getTime();

    for (let i in FRONTADQUEUE) {

        if (isNaN(i) || i === "NaN" || !("visibleDuration" in FRONTADQUEUE[i])) {
            continue
        }
        if (FRONTADQUEUE[i] === {} || Object.keys(FRONTADQUEUE[i]).length === 0) {  //Problem in queue
            continue;
        }

        let ad = document.getElementById(FRONTADQUEUE[i]['html_ad_id']);
        if (ad === undefined) {
            FRONTADQUEUE[i] = {};
            continue;
        }

        var visible_state = getVisibleHeight(ad);

        let l = FRONTADQUEUE[i]['visibleDuration'].length;
        if (visible_state === undefined) {  //update ts_end when ad become invisible
            if (l > 0 && FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] === -1) {
                FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] = currTs;
                storeAdVisibilityEvent(FRONTADQUEUE[i], FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_start'], currTs);
            }
        }
        else { //set ts_start when ad visilbe
            let visible_fraction = (visible_state[0] / visible_state[1]);
            if (visible_fraction < 0.3 && visible_state[0] < 350) { //The ad has small part visible (under threshold), treated as invisible
                if (l > 0 && FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] === -1) {
                    FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] = currTs;
                    storeAdVisibilityEvent(FRONTADQUEUE[i], FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_start'], currTs);
                }
            }
            else if ((l === 0) || (l > 0 && FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] !== -1)) {
                FRONTADQUEUE[i]['visibleDuration'].push({ 'ts_start': currTs, 'ts_end': -1 })
            }
        }

    }
    setTimeout(checkAdVisibleDuration, Ad_Visible_INTERVAL);
}


/**
 *
 * @param {Array} ralative_coordinates of element
 * @return {Array} [visible height , invisible height, visible_state] of elm
 *                   visible_state: -1 : upper part visible, 1 - lower part visible, 0: visible all
 */
function getVisibleHeight(elm) {
    var  domPos  =  getElementCoordinate ( elm ) ;
    var  relPos  =  toRelativeCoordinate ( domPos ) ;
    if (relPos == undefined) //in case elm is not in screen
        return undefined
    var  state  =  0 ;
    if (relPos[2] - relPos[0] == domPos[2] - domPos[0]) {
        state = 0
    }
    else if (relPos[0] == 0) {
        state = -1
    }
    else {
        state = 1
    }
    return [relPos[2] - relPos[0], domPos[2] - domPos[0], state]
}


function onFbMessaging() {
    let facebookInterfaceVersion = getFacebookInterfaceVersionFromParsedDoc(document);
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.old) {
        onMessaginOldInterface()
    } else if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
        onMessagingNewInterface()
    }
}

function addEventListeners(ad) {
    let facebookInterfaceVersion = getFacebookInterfaceVersionFromParsedDoc(document);
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.old) {
        addEventListenersOldInterface(ad)
    } else if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
        addEventListenersNewInterface(ad)
    }
}

/**
 * Change ad to invisible when of action interrupt news feed i.e. Messaging, Notification popup...
 */
function interruptAdVisibility(){
    let currTs = (new Date()).getTime();
    for (let i in FRONTADQUEUE) {
        if (FRONTADQUEUE[i] == {}) {  continue; }
        let ad = document.getElementById(FRONTADQUEUE[i]['html_ad_id']);
        if (ad == undefined) { FRONTADQUEUE[i] = {};  continue; } //If ad was not found

        var visible_state = getVisibleHeight(ad);
        let l = FRONTADQUEUE[i]['visibleDuration'].length;

        if(visible_state != undefined) {  //Ad is still visible
            visible_fraction = (visible_state[0] / visible_state[1]);
            if (visible_fraction >= 0.3) { //The ad is still visible but interrupted by some event
                if (l > 0 && FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] == -1) {
                    FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] = currTs;
                    storeAdVisibilityEvent(FRONTADQUEUE[i], FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_start'], currTs);
                }
            }
        }
        else{
            //Check if some invisible ads but not upddate
            if (l > 0 && FRONTADQUEUE[i]['visibleDuration'][l - 1]['ts_end'] == -1){
            }
        }
    }
}



function checkPostVisibleDuration() {

    let currTs = (new Date()).getTime();
    for (let i in POST_QUEUE) {

        let post=document.getElementById(POST_QUEUE[i]['html_post_id']);

        //let post = document.getElementById(POST_QUEUE[i]['div[id*="'+ HTML_POST_ID +'"]']);
        // let post = document.querySelector('div[id*="'+ HTML_POST_ID +'"]');

        if (post == undefined) { POST_QUEUE[i] = {}; continue; } //If ad was not found

        var visible_state = getVisibleHeight(post);
        let l = POST_QUEUE[i]['visibleDuration'].length;
        if (visible_state == undefined) {  //update ts_end when ad become invisible
            if (l > 0 && POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] == -1) {
                POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] = currTs;
                storePostVisibilityEvent(POST_QUEUE[i].html_post_id, POST_QUEUE[i]['visibleDuration'][l - 1]['ts_start'], currTs);
            }
        }
        else { //set ts_start when ad visilbe
            visible_fraction = (visible_state[0] / visible_state[1]);
            if (visible_fraction < 0.3 && visible_state[0] < 350) { //The ad has small part visible (under threshold), treated as invisible
                if (l > 0 && POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] == -1) {
                    POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] = currTs;
                    storePostVisibilityEvent(POST_QUEUE[i].html_post_id, POST_QUEUE[i]['visibleDuration'][l - 1]['ts_start'], currTs);
                }
            }
            else if ((l == 0) || (l > 0 && POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] != -1)) {
                POST_QUEUE[i]['visibleDuration'].push({ 'ts_start': currTs, 'ts_end': -1 })
            }
            //setTimeout(checkAdInVisibleDuration(i),500);
        }
    }
    setTimeout(checkPostVisibleDuration, Post_Visible_INTERVAL);
}


function interruptPostVisibility() {
    let currTs = (new Date()).getTime();
    for (let i in POST_QUEUE) {
        if (POST_QUEUE[i] == {}) { continue; }
        let ad = document.getElementById(POST_QUEUE[i]['html_post_id']);
        if (ad == undefined) { POST_QUEUE[i] = {}; continue; } //If ad was not found

        var visible_state = getVisibleHeight(ad);
        let l = POST_QUEUE[i]['visibleDuration'].length;

        if (visible_state != undefined) {  //Ad is still visible
            visible_fraction = (visible_state[0] / visible_state[1]);
            if (visible_fraction >= 0.3 || visible_state[0] > 350) { //The ad is still visible but interrupted by some event
                if (l > 0 && POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] == -1) {
                    POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] = currTs;
                    interruptPostVisibility(POST_QUEUE[i], POST_QUEUE[i]['visibleDuration'][l - 1]['ts_start'], currTs);
                }
            }
        }
        else {
            //Check if some invisible ads but not upddate
            if (l > 0 && POST_QUEUE[i]['visibleDuration'][l - 1]['ts_end'] == -1) {
            }
        }
    }
}
