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




//***** INTERNAL ADANALYST VARIABLES (FLAGS/etc)

//


var URLS_SERVER = {
    'registerAd' : HOST_SERVER+'register_ad',
    'registerClickedAd' : HOST_SERVER + 'register_clickedad',
    'registerExplanation': HOST_SERVER + 'register_explanation',
    'registerDemBeh': HOST_SERVER+'register_dem_beh',
    'registerInterests':HOST_SERVER+'register_interests',
    'registerAdvertisers':HOST_SERVER+'register_advertisers',
    'registerConsent':HOST_SERVER+'register_consent',
    'getConsent':HOST_SERVER +  'get_consent',
    'registerEmail': HOST_SERVER +  'register_email',
    'registerError': HOST_SERVER+ 'register_error',
    'registerLanguage': HOST_SERVER + 'register_language',
    'getSupportedLanguage': HOST_SERVER + 'get_languages',
    'updateAdClickEvents': HOST_SERVER + 'update_ad_event',
    'updateMouseMoveEvents': HOST_SERVER + 'update_mousemove_event',
    'updateAdVisibilityEvents': HOST_SERVER + 'update_advisibility_event',
    'updatePosstVisibilityEvents': HOST_SERVER + 'update_postvisibility_event',
    'updateSurveysNumber' : HOST_SERVER + 'surveys_number',
    'registerArticle' : HOST_SERVER + 'register_article',
    'adBlockerStatus' : HOST_SERVER + 'adblocked_status',
    'newInterfaceDetected' : HOST_SERVER + 'new_interface_detected',
    'amazonBuying' : HOST_SERVER + 'amazon_buying',
    'registerStillAlive' : HOST_SERVER + 'register_still_alive'
};


var WAIT_BETWEEN_REQUESTS = 360000; //waiting time between two explanation
var MSG_TYPE = 'message_type'; //needed for communcation with content scriptsß


var FRONTADINFO = 'front_ad_info';
var MOUSE_CLICK_DATA = 'mouse_click_data';
var MOUSE_MOVE_DATA = 'mouse_move_data';
var AD_VISIBILITY_DATA = 'ad_visibility_data';
var POST_VISIBILITY_DATA = 'post_visibility_data';
var SIDEADINFO = 'side_ad_info';
var GET_SPONSORED_TEXTS = 'get_sponsored_texts';
var UPDATE_NUMBER_OF_SURVEYS = "update_number_surveys";
var AMAZON_BUYING_MESSAGE_TYPE = 'amazon_buying_message_type';
var Ad_Blocker_Detected = "adblock-detection";
var TYPE = 'type';
var TYPES = {"frontAd" : "frontAd", "sideAd" : "sideAd","interests":"interestsData","advertisers":"advertisersData","adactivity":"adActivityList","adactivitydata":"adActivityData",demographics:'demBehaviors','statusAdBlocker':'statusAdBlocker'};

var STATUS = 'status';
var FAILURE = 'failure';
var NO_USER_CONSENT = 'User has not given consent to save their data';
var REASON = 'reason';


var ADID = 'adId';
var FBID = 'fb_id';
var IMAGES = 'images';

var ADV_PROF_PIC = 'advertiser_facebook_profile_pic';

var MEDIA_CONTENT_FAILURE = 'MEDIA CONTENT NOT CAPTURED'

var MEDIA_CONTENT = 'media_content'


var DAY_MILISECONDS =  8.64e+7;

var ONE_HALF_MINUTE = 90000;


var ONEMINUTE = 60000

var FIFTEENMINUTES = ONE_HALF_MINUTE*15;

var WAIT_FOR_TWO_HOURS = false; //If set true AdAnalust explanation crawling will sleep for two hours (due to rate limiting)
var TWO_HOURS = FIFTEENMINUTES* 8;
var LOGGED_IN = false;


var ADACTIVITY = {}; //clicked ads object (not active feature)
var EXPLANATION_REQUESTS = {}; //used to check the timestamps of requests to explanations and whether it is time for a new one
var PROBLEMATIC_EXPLANATIONS = []; //record of explanations with some issue (to debug)

var MEDIA_REQUESTS = {}; //** used to chec requests that are neeed
var MEDIA_REQUEST_ID = 0;

var NUM_WINDOWS = 0 ; //counting windows and when windows close save the queues

var CRAWLED_EXPLANATIONS = {}; //INITIALIZED AFTER FUNCTIOSN DECLARED

var EXPLANATIONS_QUEUE ={}; //INITIALIZED AFTER FUNCTIOSN DECLARED

//*** FACEBOOK RELATED URLS

var PREFERENCES_URL = 'https://www.facebook.com/ads/preferences/' // ad preferences url
var BLOCKING_URL = "https://www.facebook.com/waist_content/dialog/?id=*"; // url pattern to block when scheduling explanations


//******FACEBOOK PARSING RELATED VARIABLES
var FACEBOOK_URL = 'www.facebook.com'; //Facebook page with out the http (used to check whether the user is looking on an explanation, or adanalust does)
var FACEBOOK_PAGE = 'https://www.facebook.com' //USED TO GET USER ID FROM THEs source code of this domain
var ACCOUNT_SETTINGS = 'https://www.facebook.com/settings' //used to get the email fof the user
var LANGUAGE_SETTINGS = 'https://www.facebook.com/settings?tab=language&edited=account'
var ACCOUNT_SETTINGS_WITH_TOKEN_TEMPLATE =  "https://www.facebook.com/settings?cquick=jsc_c_d&cquick_token={0}&ctarget=https%3A%2F%2Fwww.facebook.com"


var PREFERENCES_URL_WITH_TOKEN_TEMPLATE =  "https://www.facebook.com/ds/preferences/?cquick=jsc_c_d&cquick_token={0}&ctarget=https%3A%2F%2Fwww.facebook.com"


var HEAD_PATTERN = /<head>[\S\s]*<\/head>/


var LANGUAGE_HREF = "/settings?tab=language&section=account";
var LANGUAGE_SPAN_CLASS = "fbSettingsListItemContent";


//*************TEXT segments for detecting rate limits *******
//*** Based on TEXT should not work for all languages

var ABOUT_THIS_FACEBOOK_AD =['About This Facebook Ad','About this Facebook ad','propos de cette pub Facebook'];
var MANAGE_YOUR_AD_PREFERENCES =['Manage Your Ad Preferences','Manage Your ad preferences','G\u00e9rer vos pr\u00e9f\u00e9rences'];
var RATE_LIMIT_MSG = ['It looks like you were misusing this feature by going too fast','correctement en allant trop vite'];



//*****@deprecated EXPLANATION SUB URL TODO:RECHECK IF ALL OF THEM ARE DEPRECATED***********
var url_2 = "https://www.facebook.com/ajax/a.php?dpr=*";
var NEXT_ID = 0;
var BUTTONS = {};
var FLAG = {};
var COLLECT_PREFERENCES_TAG = false;



var timeToRemindSurveyAnswering = undefined;



//var REQUEST_TYPE = 'GET';








// localStorage.adActivity = JSON.stringify({});


//var INTERESTSCRAWL  = localhost.interestsCrawl?localhost.interestsCrawl:0;
//var ADVERTISERSCRAWL =localhost.advertisersCrawl?localhost.interestsCrawl:0;
//var DEMOGRAPHICSCRAWL =localhost.interestsCrawl?localhost.interestsCrawl:0;




function sendStillAliveRequest() {
    let date = new Date();
    let currentDate = date.getDate().toString() + "-" + (date.getMonth() + 1).toString();
    let dataToSend = {
        'user_id': CURRENT_USER_ID,
        'time': new Date().getTime(),
        'date': currentDate
    };
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerStillAlive,
        dataType: "json",
        traditional:true,
        data: JSON.stringify(replaceUserIdEmail(dataToSend)),
        tryCount : 0,
        retryLimit : 3,
        success: function (a) {
            chrome.storage.sync.set({"still_alive_time": currentDate});
            return true
        },

        error : function(xhr, textStatus, errorThrown ) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
            console.log('Stoping trying...');
            return
        }
    });
}





function checkStillAlive() {
    let date = new Date();
    let currentDate = date.getDate().toString() + "-" + (date.getMonth() + 1).toString();
    chrome.storage.sync.get("still_alive_time", function(still_alive_time){
        if(still_alive_time !== undefined && still_alive_time["still_alive_time"] !== undefined) {
            still_alive_time = still_alive_time["still_alive_time"];
            if( currentDate !== still_alive_time) {
                sendStillAliveRequest();
            }
        }
        else {
            sendStillAliveRequest();
        }
    })
}


chrome.storage.sync.set({"last_time": new Date().getTime()});

chrome.storage.sync.get("last_time", function(last_time){
    if(last_time !== undefined && last_time["last_time"] !== undefined) {
        last_time = last_time["last_time"];
        if((new Date().getTime() - last_time) / (1000 * 3600 * 24) >= 3 ) {
            alert("Oups! It seems that you have not used Facebook on Chrome for a while. \n" +
                "\n" +
                "You subscribed to participate in social media monitoring study, for this we need you to regularly access Facebook from Chrome. \n" +
                "\n" +
                "Thank you! ")
        }
    }
    else {
        chrome.storage.sync.set({"last_time": new Date().getTime()});
    }
});

function getCaptchaStatus(){
    if(!localStorage.captchaDetected){
        localStorage.captchaDetected = -1;
    }
    return parseInt(localStorage.captchaDetected);
}
CAPTCHA_DETECTED = captureErrorBackground(getCaptchaStatus, [], URLS_SERVER.registerError, {});

function getLastTimeShowPopup(){
    if(!localStorage.lastTimeShowPopUp)
    {
        localStorage.lastTimeShowPopUp = -1
    }
    return parseInt(localStorage.lastTimeShowPopUp);
}
TIMESTAMP_SHOWN_POPUP = captureErrorBackground(getLastTimeShowPopup, [], URLS_SERVER.registerError, {});


function getFlgNotifyPoupStatus(){
    if(!localStorage.notNotifyPopupAgain){
        localStorage.notNotifyPopupAgain = -1
    }
    return parseInt(localStorage.notNotifyPopupAgain);
}
NOT_SHOW_POPUP_AGAIN = captureErrorBackground(getFlgNotifyPoupStatus, [], URLS_SERVER.registerError, {});


function getAdActivityList(){
    if(!localStorage.adActivity){
        localStorage.adActivity = JSON.stringify({});
    }
    return JSON.parse(localStorage.adActivity);
}
ADACTIVITY = captureErrorBackground(getAdActivityList,[],URLS_SERVER.registerError,{});



EXPLANATION_REQUESTS= captureErrorBackground(getExplanationRequests,[],URLS_SERVER.registerError,{});


/**
 * [getUserIdAjax  proceesses the ajax request to parse the user_id.
 * If there is a user id then  it opens new window to users if they haven't given consent
 * (called once). Also, if email has not been crawled, it also calls the function again
 *
 *
 * @param  {[object]} resp visit the facebook page with ajax
 * @return {[type]}      [description]
 */
function getUserIdAjax(resp) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(resp,"text/html");
    var userId = captureErrorBackground(getUserId,[htmlDoc],URLS_SERVER.registerError,undefined);

    if ((userId)&& (userId!=-1)) {
        console.log("Inside IF");
        captureErrorBackground(openWindowToNewUsers,[],URLS_SERVER.registerError,undefined);
        LOGGED_IN=true;
        console.log("Before second IF")
        if ((userId!=CURRENT_USER_ID) || (CURRENT_EMAIL==='')) {
            console.log("Inside Second IF")
            CURRENT_USER_ID = userId;
            captureErrorBackground(setFacebookInterfaceVersionDoc,[CURRENT_USER_ID,resp],URLS_SERVER.registerError,undefined);

            captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined);
        }
        CURRENT_USER_ID = userId;

    } else {
        LOGGED_IN=false;
    }

}
function getCurrentUserId() {
    $.get({
        headers: {
        	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        },  
        url:FACEBOOK_PAGE,
        success: function(resp) {
            captureErrorBackground(getUserIdAjax,[resp],URLS_SERVER.registerError,undefined);
            captureErrorBackground(checkStillAlive,[],undefined);
        }
    });

    window.setTimeout(getCurrentUserId,ONE_HALF_MINUTE/3)

}


                                                                                                        
/**
 * parses the email from the html page of facebook about. If it has a phone number it doesn't parse anything
 *
 *
 * @param  {string} resp html response of the page
 * @return {string}      email of the user
 */
function parseCurrentEmail(resp) {
    console.log("ParseCurrentEmail");
    var parser = new DOMParser();
    var doc = parser.parseFromString(resp,'text/html');
    var links = doc.getElementsByTagName('a');
    var link = '';
    var email = ''
    for (let i=0;i<links.length;i++) {
        if (links[i].getAttribute('href')==='/settings?tab=account&section=email') {
            link = links[i];
            var em = link.getElementsByTagName('strong')[0].textContent;
            if (captureErrorBackground(isEmail,[em],URLS_SERVER.registerError,false)) {
                email = em;
                // console.log("email email: "+ email)
            }
        }
    }
    console.log("End -  ParseCurrentEmail");
    return email
}

/**
 * updateEmailServer makes an ajax request towards the server
 *
 * @return {undefined} nothing
 */
function updateEmailServer() {
    var dat = {user_id:CURRENT_USER_ID,email:CURRENT_EMAIL};
    if ((isCurrentUser()!==true) || (CURRENT_EMAIL == '')) {
        return
    }

    email = dat.email;
    dat = replaceUserIdEmail(dat);
    dat.email = email;
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerEmail,
        dataType: "json",
        traditional:true,
        data: JSON.stringify(dat),
        success: function (a) {
            if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                }

                console.log('Failure to register email');
                console.log(a)
                window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                return true};
            window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},DAY_MILISECONDS)

            console.log('Success registering email');


        },
    }).fail(function(a){
            console.log('Failure to register email');
            window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

        }
    );

}


function getCurrentUserEmailByVersion() {
    console.log("getCurrentUserEmailByVersion");
    if (isCurrentUser()!==true) {
        window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }

    let interfaceVersion = getUserInterfaceVersion(CURRENT_USER_ID);
    console.log(interfaceVersion)

    if (interfaceVersion===INTERFACE_VERSIONS.unknown) {
        window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }

    if (interfaceVersion===INTERFACE_VERSIONS.old) {
        console.log("if interfaceversion = old ");
        captureErrorBackground(getCurrentUserEmail,[ACCOUNT_SETTINGS],URLS_SERVER.registerError,undefined);
        return
    }

    if (interfaceVersion===INTERFACE_VERSIONS.new) {
        captureErrorBackground(getCurrentUserEmailNewInterface,[],URLS_SERVER.registerError,undefined);
        return;
    }


}



/**
 * visits facebook page, parses the email, hashes it and sends it to server
 *
 *
 *
 * @return {undefined}
 */
function getCurrentUserEmail(targetUrl) {
    $.get({
        url:targetUrl,
        success: function(resp) {
            try {
                console.log("try");
                CURRENT_EMAIL = captureErrorBackground(parseCurrentEmail,[resp],URLS_SERVER.registerError,'');

                captureErrorBackground(updateEmailServer,[],URLS_SERVER.registerError,{});


            } catch (e) {
                console.log('Exception in getting email');
                console.log(e);
                window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)


            }
        }
    })
}

function getCurrentUserEmailNewInterface() {
    $.get({
        url:ACCOUNT_SETTINGS,
        success: function(resp) {
            try {

                let quickTokenMatch = resp.match(/compat_iframe_token":"[^"]+"|(\+)/);
                if (!quickTokenMatch || quickTokenMatch.length<1) {
                    window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                    return;
                }

                let quickToken = quickTokenMatch[0].replace('compat_iframe_token":"','');
                quickToken = quickToken.slice(0,quickToken.length-1);

                captureErrorBackground(getCurrentUserEmail,[ACCOUNT_SETTINGS_WITH_TOKEN_TEMPLATE.replace('{0}',quickToken)],URLS_SERVER.registerError,{});


            } catch (e) {
                console.log('Exception in getting email')
                console.log(e)
                window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

            }
        }
    })

}




/**
 * Parse the language set by user from the language page in Facebook
 *
 * @param  {object} doc DOM object of the
 * @return {string}     language that the user has set Facebook
 */
function parseLanguageFromLanguagePage(doc) {

    var links = doc.getElementsByTagName('a');
    var languageElem = '';
    for (let i=0;i<links.length;i++) {

        if ((links[i].href== null) || (links[i].href.indexOf(LANGUAGE_HREF)==-1)){
            continue
        }

        languageElem = links[i];
        break;

    }

    var strongElems = languageElem.getElementsByTagName('strong');

    if (strongElems.length!=1) {
        throw "More than one strong elements in the language link"
    }

    return strongElems[0].textContent;

}

/**
 * return the language and the user id from the source code
 *
 * @param  {string} resp the response from the Language settings page
 * @return {object}      object containing the language and the user id
 */
function getLanguageUserIdFromHtml(resp) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(resp,"text/html");
    var user_id = captureErrorBackground(getUserIdStr,[htmlDoc.head.innerHTML],URLS_SERVER.registerError,undefined);
    var language = captureErrorBackground(parseLanguageFromLanguagePage,[htmlDoc],URLS_SERVER.registerError,undefined);
    return {'language':language,'user_id':user_id};

}

/**
 * register the language of a user to the server
 *
 * @param  {[type]} server_message [description]
 * @return {[type]}                [description]
 */
function updateLanguageServer(server_message) {
    var dat = {user_id:CURRENT_USER_ID,
        language:localStorage[CURRENT_USER_ID+'language'],
        timestamp:(new Date).getTime(),
        message:server_message
    };
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerLanguage,
        dataType: "json",
        traditional:true,
        data: JSON.stringify(replaceUserIdEmail(dat)),
        success: function (a) {
            if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                console.log('Failure to register language');

                if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                }


                // window.setTimeout(function() {captureErrorBackground(getCurrentUserEmail,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                return true};

            console.log('Success registering language');


        },
    }).fail(function(a){
            console.log('Failure to register language');
            // window.setTimeout(function() {captureErrorBackground(getCurrentUserEmail,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

        }
    );

}




/**
 *  get the language and the user id, save it to local storage,
 *  and update to the server if needed.
 *  by performing a get request to the language settings page
 *
 * @return {}
 */
function getLanguageUserIdFromLanguagePageAjax() {
    $.get({
        url:LANGUAGE_SETTINGS,
        success: function(resp) {
            var lanuid =  captureErrorBackground(getLanguageUserIdFromHtml,[resp],URLS_SERVER.registerError,undefined);


            if ((lanuid.language!=undefined) && (lanuid.user_id!=undefined)) {


                if (lanuid.user_id!=CURRENT_USER_ID) {
                    CURRENT_USER_ID=lanuid.user_id;
                }

                var lastLanguageCrawl = localStorage[CURRENT_USER_ID+'lastLanguageCrawl']?localStorage[CURRENT_USER_ID+'lastLanguageCrawl']:0;
                var timeNow = (new Date).getTime();
                var server_message = "";
                //if one day has passed send it just for update
                if (timeNow-lastLanguageCrawl>= DAY_MILISECONDS) {
                    localStorage[CURRENT_USER_ID+'lastLanguageCrawl']=timeNow;
                    server_message = "Daily language check";
                    if (lanuid.language!=localStorage[CURRENT_USER_ID+'language']) {
                        server_message= " detected change from "+
                            localStorage[CURRENT_USER_ID+'language'] +
                            " to " + lanuid.language;
                        localStorage[CURRENT_USER_ID+'language']=lanuid.language;

                    }

                    updateLanguageServer(server_message);
                    return;


                }


                if (lanuid.language!=localStorage[CURRENT_USER_ID+'language']) {
                    server_message = "Polling detected change from "+
                        localStorage[CURRENT_USER_ID+'language'] +
                        " to " + lanuid.language;
                    localStorage[CURRENT_USER_ID+'language']=lanuid.language;
                    updateLanguageServer(server_message)

                }

            }
        }
    })
}



function getLanguageUserIdFromLanguagePage() {

    captureErrorBackground(getLanguageUserIdFromLanguagePageAjax,[],URLS_SERVER.registerError,undefined);

    window.setTimeout(getLanguageUserIdFromLanguagePage,ONE_HALF_MINUTE*3)


}

//captureErrorBackground(getCurrentUserEmail,[],URLS_SERVER.registerError,undefined)

var CRAWLED_EXPLANATIONS = captureErrorBackground(getCrawledExplanations,[],URLS_SERVER.registerError,undefined);
var EXPLANATIONS_QUEUE = captureErrorBackground(getExplanationsQueue,[],URLS_SERVER.registerError,undefined);


chrome.windows.getAll( null, function( windows ){
    NUM_WINDOWS = windows.length;
    console.log('Window Created + '+ NUM_WINDOWS)
});
chrome.windows.onCreated.addListener(function(windows){
    NUM_WINDOWS++;
    console.log("Window created event caught. Open windows #: " + NUM_WINDOWS);
});
chrome.windows.onRemoved.addListener(function(windows){

    NUM_WINDOWS--;

    console.log("Window removed event caught. Open windows #: " + NUM_WINDOWS);
    if( NUM_WINDOWS <= 0 ) {
        localStorage.crawledExplanations = JSON.stringify(CRAWLED_EXPLANATIONS);
        localStorage.explanationsQueue = JSON.stringify(EXPLANATIONS_QUEUE);
        localStorage.explanationRequests = JSON.stringify(EXPLANATION_REQUESTS);


    }

});



function addToCrawledExplanations(fbId,adId) {

    if (!CRAWLED_EXPLANATIONS[fbId]) {
        CRAWLED_EXPLANATIONS[fbId]={};
    }

    if (!EXPLANATIONS_QUEUE[fbId]) {
        EXPLANATIONS_QUEUE[fbId] = {}
    }


    let crawledIds = Object.keys(CRAWLED_EXPLANATIONS[fbId]);

    let ts = (new Date()).getTime();

    for (let i =0;i<crawledIds.length;i++) {
        if (ts - CRAWLED_EXPLANATIONS[fbId][crawledIds[i]] > (DAY_MILISECONDS * 3)) {
            try {
                delete CRAWLED_EXPLANATIONS[fbId][crawledIds[i]];
            } catch (e) {
                console.log("EXCEPTION IN addToCrawledExplanations");
                console.log(e)
            }
        }
    }

    CRAWLED_EXPLANATIONS[fbId][adId] = ts;
    return true;
}





/**
 * checks if it is time to get new explanation, and fetches the next explanation if it is due to be crawled
 *
 * @return {undefined}
 */
function exploreQueue() {
    console.log('Check for explanations');
    if ((EXPLANATIONS_QUEUE) && (CURRENT_USER_ID in EXPLANATIONS_QUEUE)) {
        captureErrorBackground(cleanRequestLog,[CURRENT_USER_ID],URLS_SERVER.registerError,undefined);

        var ts =  (new Date()).getTime()
        var maxTs = Math.max.apply(null, EXPLANATION_REQUESTS[CURRENT_USER_ID])

        if (!LOGGED_IN) {
            console.log('Not logged in! Will check again in ' + (ONE_HALF_MINUTE/(2*60000))+ ' minutes');
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);

            },ONE_HALF_MINUTE/2);
            return
        }

        if ((WAIT_FOR_TWO_HOURS) &&(ts-maxTs < TWO_HOURS)) {
            console.log('Cannot make request (rate limited). Need to wait for ' + (WAIT_BETWEEN_REQUESTS - (ts-maxTs))/60000 + ' minutes');
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);

            },WAIT_BETWEEN_REQUESTS);
            return
        }

        if ((WAIT_FOR_TWO_HOURS) &&(ts-maxTs >= TWO_HOURS)) {
            WAIT_FOR_TWO_HOURS=false;
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);

            },WAIT_BETWEEN_REQUESTS/6);

            return
        }

        if (ts-maxTs < WAIT_BETWEEN_REQUESTS) {
            console.log('Cannot make request. Need to wait for ' + (WAIT_BETWEEN_REQUESTS - (ts-maxTs))/60000 + ' minutes');
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);

            },WAIT_BETWEEN_REQUESTS  - (ts-maxTs));
            return
        }

        let params = captureErrorBackground(getNextExplanation,[CURRENT_USER_ID],URLS_SERVER.registerError,-1);

        if (params!=-1) {
            console.log('Getting explanations for '+ params[0]);

            captureErrorBackground(getExplanationsManually,[params[0],params[1],params[2],params[3],params[4],params[5]],URLS_SERVER.registerError,undefined);

        }


    }


    window.setTimeout(
        function() {
            captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);

        },WAIT_BETWEEN_REQUESTS/6);
}



/**
 * if request to regestier ad reaches adanalyst server, it investigates the message. If the ad was not saved, it notifies the content script. If the ad was saved,
 *    it puts the explanation url in the crawling file
 * then
 * @param  {object} a       response from server
 * @param  {object} request request that was sent to the adanalyst server
 * @return {undefined}         [description]
 */
function registerAdSuccess(a,request,sendResponse){

    if (!a[STATUS] || (a[STATUS]==FAILURE)) {
        if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
            captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        }

        console.log('Failure');
        console.log(a)
        sendResponse({"saved":false});
        return true};




    console.log('Success');
    let resp = {saved:true,dbId:a[ADID]}
//                  console.log(a[MSG_TYPE])
//                  console.log(a[FBID])
    let isCrawled = captureErrorBackground(isCrawledOrQueue,[a[FBID],CURRENT_USER_ID],URLS_SERVER.registerError,false);

    console.log(isCrawled);
    console.log(a[FBID])
//                  if ((a[TYPE] === TYPES.sideAd) && ((a[FBID] != -1)) && !isCrawledOrQueue(a[FBID],CURRENT_USER_ID) )  {
    if ((a[FBID] != -1) && !isCrawled )  {
        console.log('Adding to explanations queue...')
        captureErrorBackground(addToQueueExplanations,[CURRENT_USER_ID,request.fb_id,request.explanationUrl,a[ADID],request.graphQLAsyncParams,request.clientToken],URLS_SERVER.registerError,undefined);

    }

    sendResponse(resp);
    return true;
}

/**
 * get base 64 encoding of the image url, by creating a canvas object and grab the dataURL. If it is the last media object to be crawled, then send the register the ad to the adanalyst server
 * @param  {string} url          url to be crawled
 * @param  {number} req_id       request id from the current instance
 * @param  {object} request      request to send to the adanalyst server
 * @param  {function} sendResponse response function for the content script
 * @param  {number} count        count that specifies whether to stop trying to make the request
 * @return {boolean}              boolean on whether the base53 finished properly
 */
function getBase64FromImageUrl(url,req_id,request,sendResponse,count=3) {

    console.log('For ',request.fb_id,' ', count);

    if (count<=0) {
//        FLAG FINISHED
        MEDIA_REQUESTS[req_id][url] = MEDIA_CONTENT_FAILURE;
        return true
    }


    try {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
//        console.log(dataURL)
//        console.log(MEDIA_REQUESTS)
            MEDIA_REQUESTS[req_id][url] = dataURL
            console.log('For ',request.fb_id,' ', mediaRequestsDone(req_id));
            if (mediaRequestsDone(req_id)){
                request[MEDIA_CONTENT] = MEDIA_REQUESTS[req_id];
                delete MEDIA_REQUESTS[req_id];
                console.log('Sending request for frontAd');
                console.log(Object.keys(request))




                console.log('ALL ready to send ');
                console.log(request)
//        console.log(JSON.stringify(request))

                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerAd,
//              dataType: "json",
//             traditional:true,
                    contentType: "application/json",
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    success: function (a) {
                        captureErrorBackground(registerAdSuccess,[a,request,sendResponse],URLS_SERVER.registerError,undefined);

                    },
                }).fail(function(a){
                    console.log('Failure');
                    console.log(a)
                    sendResponse({"saved":false});
                    return true;});
            }


//        alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };

        img.src = url;


//FLAG FINSHED
    }
    catch (e) {
        console.log("Couldn't grab "+ url);
        console.log(e);
        console.log("Trying again...");
        captureErrorBackground(getBase64FromImageUrl,[url,req_id,request,sendResponse,count-1],URLS_SERVER.registerError,false);




    }
    return true

}


function getBase64FromImageUrlClickedAd(url, req_id, request, count = 3) {
    var curr_ts = (new Date()).getTime();
    if ((localStorage.lastClickedAdSaved) && (curr_ts - localStorage.lastClickedAdSaved) < ONEMINUTE){
        getBase64FromImageUrlClickedAd(url,req_id, request,count = 3);
        console.log("Wait for 1 minute until the next save")
        return;
    }

    console.log('For ', request.fb_id, ' ', count);

    if (count <= 0) {
        //        FLAG FINISHED
        MEDIA_REQUESTS[req_id][url] = MEDIA_CONTENT_FAILURE;
        return true
    }


    try {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            MEDIA_REQUESTS[req_id][url] = dataURL
            //console.log('For ', req_id, ' ', mediaRequestsDone(req_id));
            if (mediaRequestsDone(req_id)) {
                request[MEDIA_CONTENT] = MEDIA_REQUESTS[req_id];
                //console.log(request[MEDIA_CONTENT]);
                delete MEDIA_REQUESTS[req_id];
                console.log('Sending request for ClickedAd');
                //console.log(Object.keys(request));
                console.log(request)
                localStorage.lastClickedAdSaved = (new Date()).getTime();
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerClickedAd,
                    contentType: "application/json",
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            console.log('Failure');
                            console.log(a)

                            return true
                        };

                        console.log('Success');

                    },
                }).fail(function (a) {
                    console.log('Failure');
                    console.log(a)
                });
            }

        };

        img.src = url;

        //FLAG FINSHED
    } catch (e) {
        console.log("Couldn't grab " + url);
        console.log(e);
        console.log("Trying again...");
        getBase64FromImageUrlClickedAd(url, req_id, request, count - 1);
    }

    return true;
}



/**
 * sends the explanation that was captured in the database
 * @param  {string} adId   adid from facebook
 * @param  {Number} dbRecordId  record of the id in the database
 * @param  {string} explanation explanation string
 * @param  {Number} count       counter on how many times to try
 * @return {boolean}             success or not
 */
function sendExplanationDB(adId,dbRecordId,explanation,count=10) {
    if (count==0) {
        console.log("Explanation not saved");
        return false;
    }

    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerExplanation,
        data: {dbRecordId:dbRecordId,explanation:explanation},
        success: function (a) {
            if (!a[STATUS] || (a[STATUS]==FAILURE)) {

                captureErrorBackground(sendExplanationDB,[adId,dbRecordId,explanation,count-1],URLS_SERVER.registerError,false);

                return true
            };



            console.log((new Date));
            console.log('Success saving explanation');
            captureErrorBackground(addToCrawledExplanations,[CURRENT_USER_ID,adId],URLS_SERVER.registerError,false);

            return true

        },
    }).fail(function(a){
        console.log('Failure in saving explanation');
        console.log(a)
        captureErrorBackground(sendExplanationDB,[adId,dbRecordId,explanation,count-1],URLS_SERVER.registerError,false);

        return true


    });}

/**
 * Return the resources of the explanation dialogue (waist_id)--
 * one of those contains the doc_id that is used to fetch explannations
 * @param  {string} explanationDialogText response from the ad_waist link
 * @return {array}                         a list of strings cotnaining all of the js resources that are being loaded
 */
function getResourcesFromExplanation(explanationDialogText) {

    const explanationDialogObject = JSON.parse(explanationDialogText.replace("for (;;);",""));
    const resources = explanationDialogObject['resource_map'];
    const jsResources = [];
    for (let property in resources){
        if (resources[property]['type']!=='js') {
            continue;
        }

        jsResources.push(resources[property]['src']);
    }

    return jsResources;

}

var correctResources = {};



function getGraphqlExplanation(adId,dbRecordId,timestamp,clientToken,asyncParams,docId) {
    const variables = {
        'adId':adId,
        'clientToken':clientToken
    }

    const paramsNew = {'variables':variables,'doc_id':docId,
        'fb_api_caller_class':RelayModern,
        'fb_api_req_friendly_name':AdsPrefWAISTDialogQuery,'av':asyncParams['__user']
    };

    const paramsMerged = {...paramsNew,...asyncParams};

    console.log(paramsMerged);


}

/**
 * Parsing the doc id from the resource js that contains it
 * @param  {string} jsResource a js file that conntains the functions that Facebook users in order to send the doc_id
 * @return {string}            the doc id in string form
 */
function getDocId(jsResource) {
    const resourceLines = jsResource.match(/[^\r\n]+/g);
    for (let i=0;i<resourceLines.length;i++) {
        if (resourceLines[i].indexOf('AdsPrefWAISTDialogQuery.graphql",[]')!==-1) {
            return resourceLines[i].match('name:"AdsPrefWAISTDialogQuery",id:"([0-9]*)"')[1]
        }
    }
    throw "Doc id was not found:"+ jsResource;
}

function getWaistResource(jsResources,callback) {
    if (jsResources.length===0) {
        throw "Waist resource not found"
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",jsResources[0], true);
    xmlhttp.onload = function (e) {
        // EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            // console.log(xmlhttp.responseText);
            if (xmlhttp.responseText.indexOf('AdsPrefWAISTDialogQuery.graphql')!==-1) {
                docId = captureErrorBackground(getDocId,[xmlhttp.responseText],URLS_SERVER.registerError,undefined);

                console.log("Found docId: "+ docId);
                return;
                // TODO: send message if doc id has changed

            }

            getWaistResource(jsResources.slice(1,jsResources.length),callback);
            return;

            // console.log(typeof xmlhttp.responseText);
        }
        // TODO: SEND IF ERROR
        // console.log("Error");
    }

    // xmlhttp.setRequestHeader('Origin', 'https://www.facebook.com/');
    // xmlhttp.setRequestHeader('Referer', 'https://www.facebook.com/');
    xmlhttp.send(null);

}


// /**
//  * The starting point in grabbing explanations manually by first retrieving the docid
//  *
//  * @param  {[type]} adId           [description]
//  * @param  {[type]} explanationUrl [description]
//  * @param  {[type]} dbRecordId     [description]
//  * @param  {[type]} timestamp      [description]
//  * @return {[type]}                [description]
//  */
// function getExplanationsManuallyByGrabbingDocId(adId,explanationUrl,dbRecordId,timestamp) {
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.open("GET",explanationUrl, true);
//      xmlhttp.onload = function (e) {
//         EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())

//         if (xmlhttp.readyState === 4 && xmlhttp.status === 200){

//             var response = xmlhttp.responseText;
//             var expStart = getIndexFromList(response,ABOUT_THIS_FACEBOOK_AD);
//             var expEnd = getIndexFromList(response,MANAGE_YOUR_AD_PREFERENCES);
//             LALA = [response,adId,explanationUrl];
//             //Save all explanation even with error or corrupt response
//             sendExplanationDB(adId,dbRecordId,response);


//             //Keep loging if something weird happened
//             if (getIndexFromList(response,CAPTCHA_EXPLANATION_MSG)!=-1) {
//                 //This line will got the error "url undefined"
//                 //console.log('Problem with parsing ' + url);
//                 console.log('CAPTCHA');
//                 console.log((new Date));
//                 WAIT_FOR_TWO_HOURS=true;
//                 console.log(response);
//                 var errorInfo = {};
//                 errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
//                 errorInfo[ERROR_MESSAGE] = "Captcha problem: {adId : " + adId + ", response : " + response + "} - " +getExtensionVersion();
//                 sendErrorMessage(errorInfo, URLS_SERVER.registerError);

//                 EXPLANATIONS_QUEUE[CURRENT_USER_ID][adId] =
//                     {adId:adId,explanationUrl:explanationUrl,dbRecordId:dbRecordId,timestamp:timestamp}

//                 //Testing show Popup
//                 CAPTCHA_DETECTED = 1;
//                 localStorage.captchaDetected = CAPTCHA_DETECTED;
//                 if (NOT_SHOW_POPUP_AGAIN == 1)
//                     return
//                 //Send msg to content script -> Show the message to user
//                 var tsNow = (new Date()).getTime()
//                 if (TIMESTAMP_SHOWN_POPUP == -1 || TIMESTAMP_SHOWN_POPUP <= (tsNow - ONE_WEEK_EPOCH)) {
//                     //TIMESTAMP_SHOWN_POPUP = tsNow;
//                     //localStorage.lastTimeShowPopUp = TIMESTAMP_SHOWN_POPUP;
//                     chrome.tabs.query({}, function (tabs) {
//                         for (let i = 0; i < tabs.length; i++) {
//                             try {
//                                 chrome.tabs.sendMessage(tabs[i].id, {
//                                     type: "showInfoPopup"
//                                 }, function (response) {});
//                             } catch (err) {
//                                 console.log(err)
//                             }
//                         }
//                     });
//                 }


//                 return
//             }


//             if (getIndexFromList(response,ERROR_EXPLANATION_MSG)!=-1) {
//                 console.log('RATE LIMITED');

//                 console.log((new Date));
//                 WAIT_FOR_TWO_HOURS=true;
//                 console.log(response);
//                 EXPLANATIONS_QUEUE[CURRENT_USER_ID][adId] =
//                     {adId:adId,explanationUrl:explanationUrl,dbRecordId:dbRecordId,timestamp:timestamp}

//                 var errorInfo = {};
//                 errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
//                 errorInfo[ERROR_MESSAGE] = "Explanation error: {adId : " + adId + ", response : " + response + "} - "+ getExtensionVersion();
//                 sendErrorMessage(errorInfo, URLS_SERVER.registerError);
//                 return
//             }

//             //Recive valid explanation -> Then, reset captcha status
//             CAPTCHA_DETECTED = 0;
//             localStorage.captchaDetected = CAPTCHA_DETECTED;

//             var explanation = response.slice(expStart,expEnd);
//             console.log(expStart);
//             console.log(expEnd);
//             if ((expStart===-1) || (expEnd===-1)) {
//                 console.log('Something else is wrong with this explanation! Check it out!')
//                 console.log(response)
//                 PROBLEMATIC_EXPLANATIONS.push(response);

//                 var errorInfo = {};
//                 errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
//                 errorInfo[ERROR_MESSAGE] = "Problematic explanation: {adId : " + adId + "} - " + getExtensionVersion();
//                 sendErrorMessage(errorInfo, URLS_SERVER.registerError);
//                 return
//             }

//         }
//         else{
//             //Capture explanation request error
//             var errorInfo = {};
//             errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
//             errorInfo[ERROR_MESSAGE] = "Explantion response error: {adId: " +adId+ ", readyState:" + xmlhttp.readyState + ", status:" + xmlhttp.status + ", response: " + xmlhttp.responseText + "} - " + getExtensionVersion();
//             sendErrorMessage(errorInfo, URLS_SERVER.registerError);
//         }

//     }

//     xmlhttp.send(null);


// }



// AdsPrefWAISTDialogQuery.graphql

// LALA ="";



/**
 * cleans the request log of timestamps of ecplanations that are crawled that are older than one day, and ads a new
 * @param  {string} userId user-id
 * @return {undefined}
 */
function cleanRequestLog(userId) {
    if (!(CURRENT_USER_ID in EXPLANATION_REQUESTS)) {
        EXPLANATION_REQUESTS[userId] = [];
    }
    var ts = (new Date()).getTime()
    var filteredLst = []
    for (let i=0;i<EXPLANATION_REQUESTS[userId].length;i++) {
        if (ts - EXPLANATION_REQUESTS[userId][i] <= DAY_MILISECONDS)  {
            filteredLst.push(EXPLANATION_REQUESTS[userId][i])
        }
    }

    EXPLANATION_REQUESTS[userId] = filteredLst;
    return
}


//https://www.facebook.com/feed/options_menu/?button_id=u_ps_0_0_c&feed_context=%7B%22disable_tracking%22%3Atrue%2C%22fbfeed_context%2



//https://www.facebook.com/ads/preferences/dialog/?ad_id=6066215713784&optout…mnBCwNoy9Dx6WK&__af=iw&__req=d&__be=-1&__pc=PHASED%3ADEFAULT&__rev=2872472
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        if (details.url.indexOf('waist_content/dialog/?id')==-1) {
            console.log(details.url)
            console.log('not an explanation request...');
            return {cancel:false}
        }

        console.log(details);


        if (isUserRequest(details)) {
            console.log("User explanation request! Will be allowed");
            EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())

            return   {cancel: false};


        }

        cleanRequestLog(CURRENT_USER_ID)
        var ts =  (new Date()).getTime()
        var maxTs = Math.max.apply(null, EXPLANATION_REQUESTS[CURRENT_USER_ID])

        if ((WAIT_FOR_TWO_HOURS) && (ts-maxTs < TWO_HOURS)) {
            console.log('Cannot make request. Need to wait for ' + (TWO_HOURS - (ts-maxTs))/60000 + 'minutes (rate limited)');
            return   {cancel: true};
        }

        if ((WAIT_FOR_TWO_HOURS) && (ts-maxTs >= TWO_HOURS)) {
            console.log('time to break the limit');
            WAIT_FOR_TWO_HOURS = false;
        }

        if (ts-maxTs < WAIT_BETWEEN_REQUESTS) {
            console.log('Cannot make request. Need to wait for ' + (WAIT_BETWEEN_REQUESTS - (ts-maxTs))/60000 + 'minutes');
            return   {cancel: true};
        }

        EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())
        return   {cancel: false};





//            return   {cancel: true};
    },
    { urls: [BLOCKING_URL]},["blocking"]
);

//chrome.webRequest.onBeforeRequest.addListener(
//        function (details) {
//            console.log(details.url);
//            return   {cancel: true};
//        },
//        { urls: [url_2]},["blocking"]
//    );

var ADSPACE = 'adSpace';

var PREFERENCESCRAWLED = {advertisers:false,interests:false,demBeh:false,adactivity:false}
var PREFERENCESTAB = -1
var CRAWLINGPREFERENCES = false


function getPreferences() {
    alert ('It is time for the daily crawl in preferences! A new tab will open, and when the crawling finishes, it will close automaticaly. Thank you very much!');
    CRAWLINGPREFERENCES=true;
    chrome.tabs.create({ url: PREFERENCES_URL },function(a){
        console.log('new tab');
        PREFERENCESTAB = a['id']

    });

}


String.prototype.nthIndexOf = function(pattern, n) {
    var i = -1;

    while (n-- && i++ < this.length) {
        i = this.indexOf(pattern, i);
        if (i < 0) break;
    }

    return i;
}


function getScriptWithData(doc,txt) {
    var scripts = doc.getElementsByTagName('script')
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerHTML.indexOf(txt)!=-1) {
            return scripts[i];
        }
    }
    return -1
}

function getAllScripstWithData(doc,txt) {
    var scripts = doc.getElementsByTagName('script')
    var all_scripts = [];
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerHTML.indexOf(txt)!=-1) {
            all_scripts.push(scripts[i]) ;
        }
    }
    return all_scripts
}


function parseList(txt,pos=1) {
    if (pos>txt.length) {
        return -1
    }
    try {
        return JSON.parse(txt.slice(0,pos))
    } catch (e) {
        return parseList(txt,pos+1)
    }
}


function isBlocked(doc) {

    var helpcenters = ["https://www.facebook.com/help/365194763546571","https://www.facebook.com/help/177066345680802"]
    var links = doc.getElementsByTagName('a');
    for (let i=0;i<links.length;i++) {
        if (getIndexFromList(links[i].href,helpcenters)!==-1) {
            return true;
        }
    }

    return false;
}

function getDem(doc) {
    var txt = 'demographicStatus":'
    var script = getScriptWithData(doc,txt);
    if (script ==-1 )
    {return -1}
    var pos = script.innerHTML.indexOf(txt);
    console.log(pos)
    return parseList(script.innerHTML.slice(pos+txt.length))

}


function getBeh(doc) {
    var txt_0 ='behaviors":'
    var txt_1 = 'behaviors":[{"fbid'
    var txt_2 = 'demographicStatus":'
    var script = getScriptWithData(doc,txt_2);
    if (script ==-1 )
    {return -1}
    var pos = script.innerHTML.nthIndexOf(txt_1,1);
    console.log(pos)
    return parseList(script.innerHTML.slice(pos+txt_0.length))

}


//var count = 200
function getDemographicsAndBehaviors(count){


    $.get(PREFERENCES_URL,function(resp) {
        try {


            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(resp,"text/html");
            console.log(htmlDoc);

            if (count<0) {
                var data = {user_id:CURRENT_USER_ID,demographics:-1,behaviors:-1};
                data['type'] = 'demBehaviors';
                data['timestamp'] = (new Date).getTime();
                data['raw'] = resp;
                console.log(data)

//        chrome.runtime.sendMessage(data)
                return
            }

            console.log('getting demographics')

            var demographics = getDem(htmlDoc);
            var behaviors = getBeh(htmlDoc);




            if ((demographics==-1) && (behaviors==-1) && (count>0)) {
                count--;

                if (isBlocked(htmlDoc)) {
                    console.log("Behaviors and demographics blocked");
                    localStorage.lastErrorBehaviorDemographics = (new Date).getTime();
                    return;
                }

                getDemographicsAndBehaviors(count)
//        window.setTimeout(getDemographicsAndBehaviors,1000)
                return
            }

            if ((demographics!=-1) || (behaviors!=-1) ){
                var data = {user_id:CURRENT_USER_ID,demographics:demographics,behaviors:behaviors};
                data['type'] = 'demBehaviors';
                data['timestamp'] = (new Date).getTime();
                data['raw'] = document.head.innerHTML+document.body.innerHTML;
                console.log(data)
                if (hasCurrentUserConsent(0)!==true) {
                    return
                }

                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerDemBeh,
                    dataType: "json",
                    traditional:true,
                    data: JSON.stringify(replaceUserIdEmail(data)),
                    tryCount : 0,
                    retryLimit : 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                console.log('Trying again...')

                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');

                            return true};
                        localStorage.lastBehaviorCrawl = (new Date()).getTime();

//          sendFrontAd(request,sendResponse);
                        return true
                    },
                    error : function(xhr, textStatus, errorThrown ) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }

                });



//        chrome.runtime.sendMessage(data);

            }
//    ALL_CRAWLED.categories=true;
        } catch (e) {
            console.log(e)

            count--;
            getDemographicsAndBehaviors(count)
            return

//        window.setTimeout(getDemographicsAndBehaviors,1000)
        }




    })





}


function getDemographicsAndBehaviorsNewInterface(count) {
    $.get({
        url:PREFERENCES_URL,
        success: function(resp) {
            try {

                let quickTokenMatch = resp.match(/compat_iframe_token":"[^"]+"|(\+)/);
                if (!quickTokenMatch || quickTokenMatch.length<1) {
                    window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                    return;
                }

                let quickToken = quickTokenMatch[0].replace('compat_iframe_token":"','');
                quickToken = quickToken.slice(0,quickToken.length-1);

                captureErrorBackground(getDemographicsAndBehaviors,[PREFERENCES_URL_WITH_TOKEN_TEMPLATE.replace('{0}',quickToken),3],URLS_SERVER.registerError,{});


            } catch (e) {
                console.log(e)


            }
        }
    })



}


function filterOldAPreferenceCrawlAttempts(userId,type) {
    const now = (new Date()).getTime();

    var allPreferenceCrawlAttempts = JSON.parse(localStorage.preferenceCrawlAttempts)

    var newAttemptsTypeUser = allPreferenceCrawlAttempts[userId+type].filter(function(time) {
        return Math.abs(now-time)<DAY_MILISECONDS/2
    });

    allPreferenceCrawlAttempts[userId+type]= newAttemptsTypeUser;


    localStorage.preferenceCrawlAttempts = JSON.stringify(allPreferenceCrawlAttempts);

    return

}

function initializeUserPreferenceCrawlAttempts(userId,type){
    if (!localStorage.preferenceCrawlAttempts) {
        localStorage.preferenceCrawlAttempts = JSON.stringify({});
    }

    var allPreferenceCrawlAttempts= JSON.parse(localStorage.preferenceCrawlAttempts);

    if (!allPreferenceCrawlAttempts.hasOwnProperty(userId+type)) {
        allPreferenceCrawlAttempts[userId+type] =[];
        localStorage.preferenceCrawlAttempts = JSON.stringify(allPreferenceCrawlAttempts);

    }



    filterOldAPreferenceCrawlAttempts(userId,type)


    if (!localStorage.lastSuccessfulPreferenceCrawl) {

        localStorage.lastSuccessfulPreferenceCrawl = JSON.stringify({});
    }


    var lastSuccessfulPreferenceCrawl =  JSON.parse(localStorage.lastSuccessfulPreferenceCrawl);

    if (!lastSuccessfulPreferenceCrawl.hasOwnProperty(userId+type)) {
        lastSuccessfulPreferenceCrawl[userId+type] =0;
        localStorage.lastSuccessfulPreferenceCrawl = JSON.stringify(lastSuccessfulPreferenceCrawl);

    }

}


function getLastUserPreferenceCrawlSuccessfullAttempt(userId,type) {
    initializeUserPreferenceCrawlAttempts(userId,type);

    return JSON.parse(localStorage.lastSuccessfulPreferenceCrawl)[userId+type];
}

function getUserPreferenceCrawlAttempts(userId,type) {
    initializeUserPreferenceCrawlAttempts(userId,type);

    return JSON.parse(localStorage.preferenceCrawlAttempts)[userId+type];
}

function canUserPreferenceCrawl(userId,type) {
    const lastSuccessfulAttempt = getLastUserPreferenceCrawlSuccessfullAttempt(userId,type);
    const now = (new Date()).getTime();

    // user has crawled preference the last halfday so no need to crawl more
    if ((Math.abs(now-lastSuccessfulAttempt)< DAY_MILISECONDS/2)) {
        console.log(type + " collected the last halfday")
        return false;
    }


    const attemptsTheLastHalfDay = getUserPreferenceCrawlAttempts(userId,type);

    // user has not crawled and has not attempted the last halfday
    if (attemptsTheLastHalfDay.length==0) {
        console.log("user has not crawled"+ type + " and has not attempted the last halfday")

        return true;
    }


    // user has not crawled and has  attempted the last halfday three or more times
    if (attemptsTheLastHalfDay.length>=3) {
        console.log("user has not crawled"+type+" and the last halfday three or more times")

        return false;
    }

    // user has not crawled and has  attempted the last halfday less than three times
    // true if last attempt was more than an hour ago
    return Math.abs(now-attemptsTheLastHalfDay[attemptsTheLastHalfDay.length-1])>=DAY_MILISECONDS/24;

}

function setUserPreferenceCrawlAttempt(userId,type) {
    initializeUserPreferenceCrawlAttempts(userId,type);

    const allPreferenceCrawlAttempts = JSON.parse(localStorage.preferenceCrawlAttempts);
    allPreferenceCrawlAttempts[userId+type].push((new Date()).getTime());
    allPreferenceCrawlAttempts[userId+type].sort()
    localStorage.preferenceCrawlAttempts = JSON.stringify(allPreferenceCrawlAttempts);
}

/**
 * checks if it is time (and app allows it) to retrieve the behaviors/profile data of current user
 * @return {}
 */
function checkForBehaviorsDemographics(){
    if (hasCurrentUserConsent(0)!==true) {
        captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        window.setTimeout(checkForBehaviorsDemographics,ONEMINUTE);
        return;

    }

    if ((localStorage.collectPrefs!=='true') ) {
        console.log("CollectPrefs set to no");
        window.setTimeout(checkForBehaviorsDemographics,ONEMINUTE);
        return
    }

    if (!canUserPreferenceCrawl(CURRENT_USER_ID,'behdem')) {
        window.setTimeout(checkForBehaviorsDemographics,ONEMINUTE);
        return
    }



    let interfaceVersion = getUserInterfaceVersion(CURRENT_USER_ID);
    console.log(interfaceVersion)

    setUserPreferenceCrawlAttempt(CURRENT_USER_ID,'behdem');


    if (interfaceVersion===INTERFACE_VERSIONS.unknown) {
        window.setTimeout(function() {captureErrorBackground(checkForBehaviorsDemographics,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }

    if (interfaceVersion===INTERFACE_VERSIONS.old) {
        captureErrorBackground(getDemographicsAndBehaviors,[PREFERENCES_URL, 3],URLS_SERVER.registerError,undefined);

        window.setTimeout(function() {captureErrorBackground(checkForBehaviorsDemographics,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

        return
    }

    if (interfaceVersion===INTERFACE_VERSIONS.new) {
        captureErrorBackground(getDemographicsAndBehaviorsNewInterface,[3],URLS_SERVER.registerError,undefined);
        return;
    }


    window.setTimeout(function() {captureErrorBackground(checkForBehaviorsDemographics,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)



}



/**
 * checks if it is time (and app allows it) to retrieve the behaviors/profile data of current user
 * @return {}
 */
function checkForBehaviors(){
    if (hasCurrentUserConsent(0)!==true) {
        captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        window.setTimeout(checkForBehaviors,ONEMINUTE);
        return;

    }
    var lastTs = localStorage.lastBehaviorCrawl? localStorage.lastBehaviorCrawl:0

    var lastErrorTs = localStorage.lastErrorBehaviorDemographics ? localStorage.lastErrorBehaviorDemographics :0
    if (!lastTs) {
        lastTs = 0;
    }

    if (!lastErrorTs) {
        lastErrorTs = 0;
    }

    ts = (new Date()).getTime()
    if ((ts-lastTs > DAY_MILISECONDS/2) && (ts-lastErrorTs > DAY_MILISECONDS)) {
        getDemographicsAndBehaviors(3)
    }

    if (ts-lastErrorTs <= DAY_MILISECONDS) {
        console.log("Behavior and demographic crawl Is blocked for a day");
    }
    window.setTimeout(checkForBehaviors,ONEMINUTE)

}

function getInterests() {

    chrome.tabs.query({}, function(tabs){

        for (let i=0;i<tabs.length;i++) {
            try{
                chrome.tabs.sendMessage(tabs[i].id, {type: "getInterests"}, function(response) {});

            } catch (err) {
                  console.log(err)
            }
//            if (tabs[i].url.indexOf('facebook.com') !== -1) {
//                    ret.urn
//            }
        }
    });


}

function getAdvertisers() {

    chrome.tabs.query({}, function(tabs){

        for (let i=0;i<tabs.length;i++) {
            try{
//            if (tabs[i].url.indexOf('facebook.com') !== -1) {
                chrome.tabs.sendMessage(tabs[i].id, {type: "getAdvertisers"}, function(response) {});
//                    return
//            }
            } catch (err) {
                console.log(err)
            }

        }
    });

}

function getAdActivity(lastItem) {

    chrome.tabs.query({}, function(tabs){

        for (let i=0;i<tabs.length;i++) {
            try{
//            if (tabs[i].url.indexOf('facebook.com') !== -1) {
                chrome.tabs.sendMessage(tabs[i].id, {"type": "getAdActivity", "lastItem":lastItem}, function(response) {});
//                    return
//            }
            } catch (err) {
                console.log(err)
            }

        }
    });


}

/**
 * checks if it is time (and app allows it) to retrieve the interests of current user
 * @return {}
 */

/**
 * checks if it is time (and app allows it) to retrieve the interests of current user
 * @return {}
 */
function checkForInterests(){

    if (hasCurrentUserConsent(0)!==true) {
        captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        window.setTimeout(checkForInterests,ONEMINUTE);
        return

    }

    if ((localStorage.collectPrefs!=='true') ) {
        console.log("CollectPrefs set to no");
        window.setTimeout(checkForBehaviorsDemographics,ONEMINUTE);

        return
    }


    if (canUserPreferenceCrawl(CURRENT_USER_ID,'interests')) {
        console.log("User can crawl for interests");
        getInterests();
    }



    window.setTimeout(checkForInterests,ONEMINUTE)

}



/**
 * checks if it is time (and app allows it) to retrieve the advertisers (preference page) of current user
 * @return {}
 */
function checkForAdvertisers(){


    if (hasCurrentUserConsent(0)!==true) {
        captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        window.setTimeout(checkForAdvertisers,ONEMINUTE);
        return;

    }

    if ((localStorage.collectPrefs!=='true') ) {
        console.log("CollectPrefs set to no");

        window.setTimeout(checkForBehaviorsDemographics,ONEMINUTE);
        return
    }

    if (canUserPreferenceCrawl(CURRENT_USER_ID,'advertisers')) {
        console.log("User can crawl for advertisers");

        getAdvertisers();
    }




    window.setTimeout(checkForAdvertisers,ONEMINUTE)

}
/**
 * Get languages supports(list of support languages, sponsored_text,
 * question_text and story_text) for the adgrabber.js
 */
function getSupportedLangs(){
    //console.log('Get languages stubs....');
    $.ajax({
        url:URLS_SERVER.getSupportedLanguage,
        type:REQUEST_TYPE,
        dataType: "json",
        traditional:true,
        success: function(resp){
            console.log(resp)
            if (resp[STATUS] != FAILURE) {
                localStorage['SupportLanguages'] = resp['languages'];
                localStorage['SponsoredTexts'] = resp['sponsored_texts'];
                localStorage['QuestionTexts'] = resp['question_texts'];
                localStorage['StoryTexts'] = resp['story_texts'];
                return true
            }
            return true
        },
        error:function() {
            console.log('request failed');
        }
    });
}



captureErrorBackground(getSupportedLangs,[],URLS_SERVER.registerError,undefined)

/**
 * checks if it is time (and app allows it) to retrieve the clicked ads of the user.
 * (Note: this is allowed only for users that have signed the new privacy policy --with id==3)
 * @return {}
 */
function checkForAdActivity() {
    // can collect only from people who signed the new consent
    if (hasCurrentUserConsent(3)!==true) {
        captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,3,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        window.setTimeout(checkForAdvertisers,ONEMINUTE);
        return;

    }


    var lastTs = localStorage.lastAdActivityCrawl ? localStorage.lastAdActivityCrawl : 0
    if (!lastTs) {
        lastTs = 0;
    }

    ts = (new Date()).getTime()
    if (ts - lastTs > DAY_MILISECONDS / 2) {
        console.log('Getting ad activity')
        getAdActivity("-1");
    }


    window.setTimeout(checkForAdActivity, ONEMINUTE)

}


function mediaRequestsDone(reqId) {
    let allDone = true;
    for (let key in MEDIA_REQUESTS[reqId]) {
        if (MEDIA_REQUESTS[reqId][key].length<=0){
            console.log(MEDIA_REQUESTS[reqId][key].length)
            allDone= false;
            break
        }
    }
    return allDone
}



function sendFrontAd(request,sendResponse) {

    console.log('Front ad...');
//        ADQUEUE.push(request)
//        resp = {queued:true,hover:true}
//        sendResponse(resp);
    console.log(request)


    delete request[MSG_TYPE];
    var reqId = MEDIA_REQUEST_ID++;
    var imgsToCrawl = request[IMAGES];
    if ((request[ADV_PROF_PIC]) && (request[ADV_PROF_PIC].length>0)) {
        imgsToCrawl.push(request[ADV_PROF_PIC])
    }
    MEDIA_REQUESTS[reqId] = {};
    for (let i =0 ; i<imgsToCrawl.length; i++) {
        MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';
//              console.log(MEDIA_REQUESTS[reqId])
        getBase64FromImageUrl(imgsToCrawl[i],reqId,request,sendResponse)
    }



    console.log(request)


    return true
}

function sendClickedAd(clickedAds) {
    var adClickedData = clickedAds.adClickedData;

    for(key in adClickedData){
        var request = adClickedData[key];
        request['user_id'] = clickedAds.user_id;
        console.log('Clicked ad...');

        var reqId = MEDIA_REQUEST_ID++;
        var imgsToCrawl = request.contents['fullImageURLs']; //imageURLs,fullImageURLs,facebookPageProfilePicURL
        if(request.contents['imageURLs'] && request.contents['imageURLs'].length > 0)
            imgsToCrawl.push(request.contents['imageURLs']);

        if (request.contents['facebookPageProfilePicURL'] & request.contents['facebookPageProfilePicURL'].length > 0)
            imgsToCrawl.push(request.contents['facebookPageProfilePicURL']);


        MEDIA_REQUESTS[reqId] = {};
        for (let i = 0; i < imgsToCrawl.length; i++) {
            MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';
            getBase64FromImageUrlClickedAd(imgsToCrawl[i], reqId, request);
        }

        console.log(request)

    }

    return true
}

function appendObject(l1, l2){
    if(l1 == undefined || l1.adClickedData == undefined)
        return l2;

    l1.lastItem = l2.lastItem;
    l1.hasmore = l2.hasmore;
    var _newItemKeys = Object.keys(l2.adClickedData);
    for(key of _newItemKeys){
        l1.adClickedData[key] = l2.adClickedData[key];
    }
    return l1;
}

var idx_icon = 0;
function changeIcon(){
    if (hasCurrentUserConsent(0)===true) {
        chrome.browserAction.setIcon({ path: "media/enabled.png" });
        setTimeout(changeIcon,1000);

        return
    }

    idx_icon = (idx_icon + 1) % 2;
    chrome.browserAction.setIcon({ path: "media/alert"+idx_icon+".png" });
    setTimeout(changeIcon,1000);
}

changeIcon();

function sendSideAd(request,sendResponse) {
    console.log('SENDING Side ad...');
    console.log(request);
    delete request[MSG_TYPE];
    var reqId = MEDIA_REQUEST_ID++;
    var imgsToCrawl = request[IMAGES];

    MEDIA_REQUESTS[reqId] = {};
    for (let i =0 ; i<imgsToCrawl.length; i++) {
        MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';
//              console.log(MEDIA_REQUESTS[reqId])

        getBase64FromImageUrl(imgsToCrawl[i],reqId,request,sendResponse)
    }



}









chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
//      if (request[MSG_TYPE] === SIDEADINFO) {
//          var adId = request.adId;
//
//      if (!(sender.tab.id in FLAG)) {
//          FLAG[sender.tab.id] = {};
//      }
//
//      FLAG[sender.tab.id][adId] = true;
//      sendResponse({"ad_status":OK});
//      return
//
//      }

        if ((!sender.tab) || (sender.tab && (sender.url) && (typeof sender.url === "string") && (sender.url.indexOf('new_consent.html')>-1)) ){
            if (request.setConsent) {
                if (isCurrentUser()!==true) {
                    sendResponse({"ok":false});
                    return true

                }
                captureErrorBackground(registerConsent, [URLS_SERVER.registerConsent,sendResponse], URLS_SERVER.registerError, {});
                return true
            }

            if (request.getConsent) {
                captureErrorBackground(sendConsentStatusToComponents, [URLS_SERVER.getConsent,sendResponse,request.consentMode], URLS_SERVER.registerError, {});
                return true;
            }

        }

        if ((!sender.tab) || (sender.tab && (sender.url) && (typeof sender.url === "string") && (sender.url.indexOf('popup.html')>-1)) ){
            if (request.setConsent) {

                if (CURRENT_USER_ID==-1) {
                    sendResponse({"ok":false});
                    return true

                }
                captureErrorBackground(registerConsent, [URLS_SERVER.registerConsent,sendResponse], URLS_SERVER.registerError, {});

                return true
            }

            if (request.getConsent) {
                captureErrorBackground(sendConsentStatusToComponents, [URLS_SERVER.getConsent,sendResponse], URLS_SERVER.registerError, {});
                return true;
            }

            if (request.getAdBlockerStatus){
                chrome.tabs.query({}, function (tabs) {
                    for (let i = 0; i < tabs.length; i++) {
                        try {
                            chrome.tabs.sendMessage(tabs[i].id, {type: "getAdBlockerStatus"}, function (response) {});
                        } catch (err) {
                            console.log(err)
                        }
                    }
                });
            }
        }

        if (sender.tab) {

            if (request[MSG_TYPE] == 'consent') {
                captureErrorBackground(sendConsentStatusToComponents, [URLS_SERVER.getConsent,sendResponse], URLS_SERVER.registerError, {});
                return true;
            }


            if(request[MSG_TYPE] == GET_SPONSORED_TEXTS){
                if (localStorage.SupportLanguages != undefined && localStorage.SupportLanguages != ''){
                    let resp_data = {
                        'Status': 'OK',
                        'SupportLanguages': localStorage['SupportLanguages']   ,
                        'SponsoredTexts':  localStorage['SponsoredTexts'] ,
                        'QuestionTexts': localStorage['QuestionTexts'] ,
                        'StoryTexts': localStorage['StoryTexts']
                    }
                    sendResponse(resp_data);
                }
                else{
                    captureErrorBackground(getSupportedLangs,[],URLS_SERVER.registerError,undefined)
                    sendResponse({'Status':'Error'});
                }
                return true;

            }


            if (request[MSG_TYPE] == 'hide_popup') {
                if (request['chk_option'] == 1){
                    NOT_SHOW_POPUP_AGAIN = 1;
                    localStorage.notNotifyPopupAgain = NOT_SHOW_POPUP_AGAIN;
                }
                var tsNow = (new Date()).getTime();
                TIMESTAMP_SHOWN_POPUP = tsNow;
                localStorage.lastTimeShowPopUp = TIMESTAMP_SHOWN_POPUP;
                //Keep server log
                var errorInfo = {};
                errorInfo[MSG_TYPE] = ERROR_TYPES.TEST_ERROR_BACKGROUND_SCRIPT;
                errorInfo[ERROR_MESSAGE] = "POPUP INFO: {user_id : " + CURRENT_USER_ID + ", option : " + request['chk_option']+ "} - " + getExtensionVersion();
                sendErrorMessage(errorInfo, URLS_SERVER.registerError);

            }

            if (request[MSG_TYPE] == SIDEADINFO) {
                CURRENT_USER_ID = request['user_id'];
                console.log('SideAd');
                console.log(request);
                sendSideAd(request,sendResponse)
//          console.log(request);
                return true;

            }
            if (request[MSG_TYPE] == FRONTADINFO) {
                CURRENT_USER_ID = request['user_id'];
                console.log(CURRENT_USER_ID);
                sendFrontAd(request,sendResponse);
                return true;
            }
            if (request[MSG_TYPE] == MOUSE_CLICK_DATA){
                let dataToSend = request;
                delete dataToSend.MSG_TYPE;
                console.log('######' + MOUSE_CLICK_DATA
                );
                console.log(dataToSend)
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.updateAdClickEvents,
                    dataType: "json",
                    traditional:true,
                    data: JSON.stringify(replaceUserIdEmail(dataToSend)),
                    tryCount : 0,
                    retryLimit : 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };
                        return true
                    },

                    error : function(xhr, textStatus, errorThrown ) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true

            }

            if (request[MSG_TYPE] ==AD_VISIBILITY_DATA){

                delete request.MSG_TYPE;
                console.log('######' + AD_VISIBILITY_DATA);
                console.log(request)
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.updateAdVisibilityEvents,
                    dataType: "json",
                    traditional: true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };
                        return true
                    },

                    error: function (xhr, textStatus, errorThrown) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true
            }

            if (request[MSG_TYPE] == POST_VISIBILITY_DATA) {

                delete request[MSG_TYPE];
                console.log('######' + POST_VISIBILITY_DATA);
                console.log(request)
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.updatePosstVisibilityEvents,
                    dataType: "json",
                    traditional: true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };
                        return true
                    },

                    error: function (xhr, textStatus, errorThrown) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true
            }

            if (request[MSG_TYPE] == MOUSE_MOVE_DATA) {

                delete request[MSG_TYPE];
                console.log('######' + MOUSE_MOVE_DATA);
                console.log(request)
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.updateMouseMoveEvents,
                    dataType: "json",
                    traditional: true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };
                        return true
                    },

                    error: function (xhr, textStatus, errorThrown) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true
            }

            if (request[MSG_TYPE] == Ad_Blocker_Detected) {
                delete request[MSG_TYPE];
                USER_ID = request['user_id'];
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.adBlockerStatus,
                    dataType: "json",
                    traditional: true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };
                        return true
                    },

                    error: function (xhr, textStatus, errorThrown) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true
            }

            if (request[MSG_TYPE] == AMAZON_BUYING_MESSAGE_TYPE) {
                delete request[MSG_TYPE];
                request['user_id'] = CURRENT_USER_ID;
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.amazonBuying,
                    dataType: "json",
                    traditional: true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };
                        return true
                    },

                    error: function (xhr, textStatus, errorThrown) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true
            }
            //if message is an error message sregister in the database
            if (isMessageTypeError(request[MSG_TYPE])) {
                console.log("Sending error to server")
                sendErrorMessage(request, URLS_SERVER.registerError);
                return true;
            }

            if (request[TYPE] == TYPES.advertisers) {
                CURRENT_USER_ID = request['user_id'];
                console.log('advertisers...')
                console.log(request)
                console.log( URLS_SERVER.registerAdvertisers);
                if (CRAWLINGPREFERENCES) {
                    PREFERENCESCRAWLED.advertisers=true;
                }
                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(0)!=true)) {
                    return
                }
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerAdvertisers,
                    dataType: "json",
                    traditional:true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount : 0,
                    retryLimit : 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                console.log('Trying again...')

                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');

                            return true};


                        localStorage.lastAdvertiserCrawl = (new Date()).getTime()
//          sendFrontAd(request,sendResponse);
                        return true
                    },
                    error : function(xhr, textStatus, errorThrown ) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }

                });
                return true
            }

            if (request[TYPE] == TYPES.adactivity) {

                CURRENT_USER_ID = request['user_id'];
                console.log('ad activity...')
                console.log(request)
                if (CRAWLINGPREFERENCES) {
                    PREFERENCESCRAWLED.adactivity = true;
                }
                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(3)!=true)) {
                    return
                }

                localStorage.lastAdActivityCrawl = (new Date()).getTime()

                ADACTIVITY = getAdActivityList();
                ADACTIVITY = appendObject(ADACTIVITY,request);
                console.log(ADACTIVITY);
                localStorage.adActivity = JSON.stringify(ADACTIVITY);

                //waiting for adActivityData comming
                //Launch a next grab if there is more ad activities listed

                return true
            }

            if (request[TYPE] == TYPES.adactivitydata){
                ADACTIVITY = getAdActivityList();
                CURRENT_USER_ID = request['user_id'];
                console.log('ad activity data...')
                console.log(request)
                if (CRAWLINGPREFERENCES) {
                    PREFERENCESCRAWLED.adactivity = true;
                }
                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(3)!=true)) {
                    return
                }
                var adDetail = request.data;

                if(ADACTIVITY == undefined || ADACTIVITY.adClickedData == undefined)
                    return;

                var adKeys = Object.keys(ADACTIVITY.adClickedData);
                if(adKeys.includes(adDetail.id) && request.user_id == ADACTIVITY.user_id){
                    ADACTIVITY.adClickedData[adDetail.id]['contents'] = adDetail.contents;
                    localStorage.adActivity = JSON.stringify(ADACTIVITY);
                }
                var isCrawling = false;
                for(id of adKeys)
                {
                    if(ADACTIVITY.adClickedData[id]['contents'] == undefined)
                    {
                        isCrawling = true;
                        break;
                    }
                }
                if( !isCrawling && ADACTIVITY.hasmore == false){
                    //Crawling ad activity done --> Send request to server
                    //Send to server
                    console.log('Crawling ad activity finished...');
                    console.log(ADACTIVITY);
                    //localStorage.adActivity = JSON.stringify(ADACTIVITY);
                    //localStorage.setItem('crawling_adactivity','true');
                    //Send to server
                    sendClickedAd(ADACTIVITY);
                    localStorage.adActivity = JSON.stringify({});

                }

                return true
            }

            if (request[TYPE] == TYPES.interests) {
                  CURRENT_USER_ID = request['user_id'];
                console.log('interests...')
                console.log(request)
                if (CRAWLINGPREFERENCES) {
                    PREFERENCESCRAWLED.interests=true;
                }

                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerInterests,
                    dataType: "json",
                    traditional:true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount : 0,
                    retryLimit : 3,
                    success: function (a) {
                        console.log(a)
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                console.log('Trying again...')

                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return
                            console.log('failure')
                            return true};

                        console.log('saving last interest scroll')

                        localStorage.lastInterestCrawl = (new Date()).getTime()

//          sendFrontAd(request,sendResponse);
                        return true
                    },
                    error : function(xhr, textStatus, errorThrown ) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }

                });
                return true
            }

            if (request[TYPE] == TYPES.demographics) {
                CURRENT_USER_ID = request['user_id'];
                console.log('demographics...')
                console.log(request)
                if (CRAWLINGPREFERENCES) {
                    PREFERENCESCRAWLED.demBeh=true;
                }
                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(0)!=true)) {
                    return
                }
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerDemBeh,
                    dataType: "json",
                    traditional:true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount : 0,
                    retryLimit : 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                console.log('Trying again...')

                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return

                            return true};
                        localStorage.lastBehaviorCrawl = (new Date()).getTime();

//          sendFrontAd(request,sendResponse);
                        return true
                    },
                    error : function(xhr, textStatus, errorThrown ) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }

                });
            }

            if(request[TYPE] === TYPES.statusAdBlocker){
                localStorage.statusAdBlocker = request['value'];
                if(localStorage.statusAdBlocker == "true"){
                    chrome.browserAction.setIcon({ path: "media/enabled_alert.png" });
                }
                else{
                    chrome.browserAction.setIcon({ path: "media/enabled.png" });
                }
            }

            if(request[MSG_TYPE] == UPDATE_NUMBER_OF_SURVEYS) {
                let dataToSend = request;
                delete dataToSend[TYPE];
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.updateSurveysNumber,
                    dataType: "json",
                    traditional: true,
                    data: JSON.stringify(replaceUserIdEmail(dataToSend)),
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (a) {
                        if (a[STATUS] && (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                            }
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                console.log('Trying again...')
                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        }
                        else {
                            localStorage.setItem('survey_number', a.survey_number);
                            if(a.survey_number > 0) {
                                chrome.browserAction.setBadgeText({text: a.survey_number.toString()});
                                if( timeToRemindSurveyAnswering === undefined || (new Date()).getTime() >= timeToRemindSurveyAnswering ) {
                                    window.open("ui/popup.html", "extension_popup", "width=400,height=500s,status=no,scrollbars=yes,resizable=no");
                                }
                            }
                            else {
                                chrome.browserAction.setBadgeText({text: ''});
                                console.log("We have 0 survey to answer ! ");
                            }
                        }
                        return true
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            console.log('Trying again...')

                            $.ajax(this);
                            return;
                        }
                        console.log('Stoping trying...');
                        return
                    }
                });
                return true
            }

            if(request[MSG_TYPE] == "remind_me") {
                timeToRemindSurveyAnswering = request["time"]
            }
        }

    });

//FACEBOOK LOGIN

var successURL = 'www.facebook.com/connect/login_success.html';

function onFacebookLogin(){
    if (!localStorage.getItem('accessToken')) {
        chrome.tabs.query({}, function(tabs) { // get all tabs from every window
            for (var i = 0; i < tabs.length; i++) {
                if (!tabs[i].url) {continue}
                if (tabs[i].url.indexOf(successURL) !== -1) {
                    // below you get string like this: access_token=...&expires_in=...
                    var params = tabs[i].url.split('#')[1];

                    // in my extension I have used mootools method: parseQueryString. The following code is just an example ;)
                    var accessToken = params.split('&')[0];
                    accessToken = accessToken.split('=')[1];


                    localStorage.setItem('accessToken', accessToken);
//          chrome.tabs.remove(tabs[i].id);
                }
            }
        });
    }
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);



captureErrorBackground(getCurrentUserId,[],URLS_SERVER.registerError,undefined)

captureErrorBackground(getLanguageUserIdFromLanguagePage,[],URLS_SERVER.registerError,undefined)

captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);



/******************************************************************* News organisaton sites ****************************************/

var NEWS_ARTICLES = {};


function sendTabArticle(request){
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerArticle,
        dataType: "json",
        traditional: true,
        data: JSON.stringify(replaceUserIdEmail(request)),
        tryCount: 0,
        retryLimit: 3,
        success: function (a) {
            console.log(a)
            if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                    captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                }

                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    console.log('Trying again...')

                    $.ajax(this);
                    return;
                }
                console.log('Stoping trying...');
                console.log('failure')
                return true
            };

            return true
        },
        error: function (xhr, textStatus, errorThrown) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
            console.log('Stoping trying...');
            return
        }

    });
    return true;
}


/**
 * Set tab with ID as active, other tabs inactive - Update time-elapsed for these tab
 * @param {number} activeTabID to be set as active
 *
 */
function setActiveTab(activeTabID){
    let tsNow = (new Date()).getTime();
    //NEWS_ARTICLES[activeTabID].time_elapsed.push({'start':tsNow, 'end':-1})
    for(let key in NEWS_ARTICLES){
        if(NEWS_ARTICLES[key].id !== activeTabID){
            let l = NEWS_ARTICLES[key].time_elapsed.length;
            if (l > 0 && NEWS_ARTICLES[key].time_elapsed[l - 1]['end_ts'] === -1){
                NEWS_ARTICLES[key].time_elapsed[l-1]['end_ts'] = tsNow;
            }

            NEWS_ARTICLES[key].active = false;
        }
    }
}

function addToNewsQueue(tabData){
    if (Object.keys(NEWS_ARTICLES).includes(tabData.id.toString())){
        let key = tabData.id;
        if(NEWS_ARTICLES[key].url !== tabData.url){//Changed url
            let l = NEWS_ARTICLES[key].length;
            tsNow = (new Date()).getTime();
            if (l > 0 && NEWS_ARTICLES[key].time_elapsed[l-1]['end_ts'] === -1){
                NEWS_ARTICLES[key].time_elapsed[l - 1]['end_ts'] = tsNow;
            }
            NEWS_ARTICLES[key]['end_ts'] = tsNow;
            NEWS_ARTICLES[key]['status'] = 'closed';
            sendTabArticle({...NEWS_ARTICLES[key]});
            delete NEWS_ARTICLES[key];

            NEWS_ARTICLES[key] = tabData;
            if (tabData.active) {
                setActiveTab(tabData.id)
            }
        }
    }
    else{
        NEWS_ARTICLES[tabData.id] = tabData;
        if (tabData.active) {
            setActiveTab(tabData.id)
        }
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo['status'] === 'complete'){
        var _domain = url_domain(tab.url);
        if (isNewsDomain(_domain)){
            let tsNow = (new Date()).getTime();
            var time_elapsed = [];
            if (tab.active) {
                time_elapsed.push({ 'start_ts': tsNow, 'end_ts': -1 });
            }
            let tabData = {
                'id': tabId,
                'start_ts': (new Date()).getTime(),
                'end_ts': -1,
                'url':tab.url,
                'user_id': CURRENT_USER_ID,
                'time_elapsed': time_elapsed,
                'active': tab.active
            };
            addToNewsQueue(tabData);
        }
        else {
            if(Object.keys(NEWS_ARTICLES).includes(tabId.toString())) {
                let l = NEWS_ARTICLES[tabId].time_elapsed.length;
                tsNow = (new Date()).getTime();
                if(l > 0 && NEWS_ARTICLES[tabId].time_elapsed[l-1]['end_ts'] === -1){
                    NEWS_ARTICLES[tabId].time_elapsed[l - 1]['end_ts'] = tsNow;
                }
                NEWS_ARTICLES[tabId]['end_ts'] = tsNow;
                NEWS_ARTICLES[tabId]['status'] = 'closed';

                sendTabArticle({...NEWS_ARTICLES[tabId]})
                console.log("Just below");
                console.log(NEWS_ARTICLES[tabId]);
                delete NEWS_ARTICLES[tabId];
            }
        }
    }
});

chrome.tabs.onActivated.addListener(function (info){
    setActiveTab(info.tabId);
    if(Object.keys(NEWS_ARTICLES).includes(info.tabId.toString())){
        let tsNow = (new Date()).getTime();
        NEWS_ARTICLES[info.tabId].time_elapsed.push({ 'start_ts': tsNow, 'end_ts': -1 });
        NEWS_ARTICLES[info.tabId].active = true;
    }

});

chrome.tabs.onRemoved.addListener(function(tabId, changeInfo){
    let tsNow = (new Date()).getTime();
    if(Object.keys(NEWS_ARTICLES).includes(tabId.toString())){
        let l = NEWS_ARTICLES[tabId].time_elapsed.length;
        if(l > 0 && NEWS_ARTICLES[tabId].time_elapsed[l-1]['end_ts'] === -1){
            NEWS_ARTICLES[tabId].time_elapsed[l - 1]['end_ts'] = tsNow;
        }
        NEWS_ARTICLES[tabId]['end_ts'] = tsNow;
        NEWS_ARTICLES[tabId]['status'] = 'closed';

        sendTabArticle({...NEWS_ARTICLES[tabId]})
        console.log("Just below");
        console.log(NEWS_ARTICLES[tabId]);
        delete NEWS_ARTICLES[tabId];
    }
});





/**********************DEPRECATED******************************************/

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g,  " "));
}
/***************************************************************************/

/***********************TEST FUNCTIONS*********************

 /**  TESTS background script register error
 */
// captureErrorBackgroundTest(URLS_SERVER.registerError);



/** Get domain form URL
 *
 * @param {string} URL to process
 * @return {string} domain
 */
function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.hostname.replace('www.', '');
}

/**
 * Checking whehter a domain belong to news or not
 */
function isNewsDomain(landing_domain) {
    if (landing_domain === '' || landing_domain === undefined)
        return false;
    for (let i = 0; i < NEWS_DOMAINS.length; i++) {
        //if (NEWS_DOMAINS[i].indexOf(landing_domain) != -1) {
        if (NEWS_DOMAINS[i] === landing_domain) {
            return true;
        }
    }
    return false;
}

/*****************************************************/
