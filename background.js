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
 //   'registerPhone': HOST_SERVER +  'register_phone',
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
//    'amazonBuying' : HOST_SERVER + 'amazon_buying',
    'registerStillAlive' : HOST_SERVER + 'register_still_alive',
    'storeExtensionNameAndVersion': HOST_SERVER + 'store_extension_name_and_version',
    'registerDemographicsNewInterface' : HOST_SERVER + 'register_demographics_new_interface'
};


var WAIT_BETWEEN_REQUESTS = 180000; //waiting time between two explanation
//var WAIT_BETWEEN_REQUESTS = 360000; //waiting time between two explanation
var MSG_TYPE = 'message_type'; //needed for communcation with content scriptsß


var FRONTADINFO = 'front_ad_info';
var MOUSE_CLICK_DATA = 'mouse_click_data';
var MOUSE_MOVE_DATA = 'mouse_move_data';
var AD_VISIBILITY_DATA = 'ad_visibility_data';
var POST_VISIBILITY_DATA = 'post_visibility_data';
var SIDEADINFO = 'side_ad_info';
var GET_SPONSORED_TEXTS = 'get_sponsored_texts';
var UPDATE_NUMBER_OF_SURVEYS = "update_number_surveys";
//var AMAZON_BUYING_MESSAGE_TYPE = 'amazon_buying_message_type';
var Ad_Blocker_Detected = "adblock-detection";
var TYPE = 'type';
var TYPES = {"frontAd" : "frontAd", "sideAd" : "sideAd","interests":"interestsData","advertisers":"advertisersData","adactivity":"adActivityList","adactivitydata":"adActivityData",demographics:'demBehaviors','statusAdBlocker':'statusAdBlocker', 'demographicsNewInterface' : 'demographicsNewInterface'};

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

var ONE_HOUR = 3600000;

var LOGGED_IN = false;


var ADACTIVITY = {}; //clicked ads object (not active feature)
var EXPLANATION_REQUESTS = {}; //used to check the timestamps of requests to explanations and whether it is time for a new one

var SENT_ERRORS = []


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
var LANGUAGE_SETTINGS_WITH_TOKEN_TEMPLATE = 'https://www.facebook.com/settings?tab=language&cquick=jsc_c_e&cquick_token={0}&ctarget=https%3A%2F%2Fwww.facebook.com'
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

var idx_icon = 0;

//FACEBOOK LOGIN
var successURL = 'www.facebook.com/connect/login_success.html';


var not_logged_page_opened = false
var consent_page_opened = false;


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


/****************************************** FUNCTIONS ************************************/

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

function getCaptchaStatus(){
    if(!localStorage.captchaDetected){
        localStorage.captchaDetected = -1;
    }
    return parseInt(localStorage.captchaDetected);
}

function getLastTimeShowPopup(){
    if(!localStorage.lastTimeShowPopUp)
    {
        localStorage.lastTimeShowPopUp = -1
    }
    return parseInt(localStorage.lastTimeShowPopUp);
}

function getFlgNotifyPoupStatus(){
    if(!localStorage.notNotifyPopupAgain){
        localStorage.notNotifyPopupAgain = -1
    }
    return parseInt(localStorage.notNotifyPopupAgain);
}

function getAdActivityList(){
    if(!localStorage.adActivity){
        localStorage.adActivity = JSON.stringify({});
    }
    return JSON.parse(localStorage.adActivity);
}

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
        captureErrorBackground(openWindowToNewUsers,[],URLS_SERVER.registerError,undefined);
        LOGGED_IN=true;
        if ((userId!==CURRENT_USER_ID) || (CURRENT_EMAIL==='')) {
            CURRENT_USER_ID = userId;
            captureErrorBackground(setFacebookInterfaceVersionDoc,[CURRENT_USER_ID,resp],URLS_SERVER.registerError,undefined);
            executeAfterUserId();
        }
        CURRENT_USER_ID = userId;

    } else {
        LOGGED_IN=false;
        executeAfterUserIdNotFound();
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

    window.setTimeout(getCurrentUserId,ONE_HALF_MINUTE/6)

}

/**
 * parses the email from the html page of facebook about. If it has a phone number it doesn't parse anything
 *
 *
 * @param  {string} resp html response of the page
 * @return {string}      email of the user
 */
function parseCurrentEmail(resp) {
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
            }
        }
    }
    return email
}


/**
 * parses the phone number from the html page of facebook about
 *
 *
 * @param  {string} resp html response of the page
 * @return {string}      email of the user
 function parseCurrentPhone(resp) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(resp,'text/html');
    var links = doc.getElementsByTagName('a');
    var link = '';
    var email = ''
    for (let i=0;i<links.length;i++) {
        if (links[i].getAttribute('href')==='/settings?tab=account&section=email') {
            link = links[i];
            email = link.getElementsByTagName('strong')[0].textContent;
        }
    }
    return email
}
 */


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
    //   I remove this because for now we don't need non hashed_emails
    //   dat.email = email;
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerEmail,
        dataType: "json",
        traditional:true,
        data: JSON.stringify(dat),
        success: function (a) {
            if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                    //   captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                }
                window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                return true
            };
            window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},DAY_MILISECONDS)



        },
    }).fail(function(a){
            window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

        }
    );

}


/**
 * updatePhoneServer makes an ajax request towards the server
 *
 * @return {undefined} nothing

 function updatePhoneServer() {
    var dat = {user_id:CURRENT_USER_ID,phone:CURRENT_PHONE};
    if ((isCurrentUser()!==true) || (CURRENT_PHONE == '')) {
        return
    }

    phone = dat.phone;
    dat = replaceUserIdEmail(dat);
    // I remove this because for now we don't need non hashed_phones
    // dat.phone = phone;
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerPhone,
        dataType: "json",
        traditional:true,
        data: JSON.stringify(dat),
        success: function (a) {
            if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                }
                console.log('Failure to register phone');
                window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                return true
            };
            window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},DAY_MILISECONDS)
            console.log('Success registering email');


        },
    }).fail(function(a){
            console.log('Failure to register email');
            window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

        }
    );

}
 */


function getCurrentUserEmailByVersion() {
    if (isCurrentUser()!==true) {
        window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }

    let interfaceVersion = getUserInterfaceVersion(CURRENT_USER_ID);

    if (interfaceVersion===INTERFACE_VERSIONS.unknown) {
        window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }

    if (interfaceVersion===INTERFACE_VERSIONS.old) {
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
                CURRENT_EMAIL = captureErrorBackground(parseCurrentEmail,[resp],URLS_SERVER.registerError,'');
                if(CURRENT_EMAIL !== "") {
                    captureErrorBackground(updateEmailServer,[],URLS_SERVER.registerError,{});
                }
                //       else {
                //           CURRENT_PHONE = captureErrorBackground(parseCurrentPhone, [resp], URLS_SERVER.registerError,{})
                //          captureErrorBackground(updatePhoneServer,[],URLS_SERVER.registerError,{});
                //     }
            } catch (e) {
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
                window.setTimeout(function() {captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

            }
        }
    })

}

function getCurrentLanguageByVersion() {
    if (isCurrentUser()!==true) {
        window.setTimeout(function() {captureErrorBackground(getCurrentLanguageByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }





    let interfaceVersion = getUserInterfaceVersion(CURRENT_USER_ID);


    if (interfaceVersion===INTERFACE_VERSIONS.unknown) {
        window.setTimeout(function() {captureErrorBackground(getCurrentLanguageByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
        return;
    }

    if (interfaceVersion===INTERFACE_VERSIONS.old) {
        captureErrorBackground(getCurrentLanguage,[LANGUAGE_SETTINGS],URLS_SERVER.registerError,undefined);
        return
    }

    if (interfaceVersion===INTERFACE_VERSIONS.new) {
        captureErrorBackground(getCurrentLanguageNewInterface,[],URLS_SERVER.registerError,undefined);
        window.setTimeout(getCurrentLanguageByVersion,ONE_HALF_MINUTE*3)
        return;
    }


}

function getCurrentLanguageNewInterface() {

    $.get({
        url:LANGUAGE_SETTINGS,
        success: function(resp) {
            try {

                let quickTokenMatch = resp.match(/compat_iframe_token":"[^"]+"|(\+)/);
                if (!quickTokenMatch || quickTokenMatch.length<1) {
                    window.setTimeout(function() {captureErrorBackground(getCurrentLanguageByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE*3)
                    return;
                }

                let quickToken = quickTokenMatch[0].replace('compat_iframe_token":"','');
                quickToken = quickToken.slice(0,quickToken.length-1);

                captureErrorBackground(getCurrentLanguage,[LANGUAGE_SETTINGS_WITH_TOKEN_TEMPLATE.replace('{0}',quickToken)],URLS_SERVER.registerError,{});


            } catch (e) {
                window.setTimeout(function() {captureErrorBackground(getCurrentLanguageByVersion,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE*3)


            }
        }
    })



}


/**
 *  get the language and the user id, save it to local storage,
 *  and update to the server if needed.
 *  by performing a get request to the language settings page
 *
 * @return {}
 */
function getCurrentLanguage(url) {
    $.get({
        url:url,
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

    if (languageElem === '') return

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

                if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                    //         captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                }


                // window.setTimeout(function() {captureErrorBackground(getCurrentUserEmail,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)
                return true};



        },
    }).fail(function(a){
            // window.setTimeout(function() {captureErrorBackground(getCurrentUserEmail,[],URLS_SERVER.registerError,undefined)},ONE_HALF_MINUTE)

        }
    );

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
            //    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
        }
        sendResponse({"saved":false});
        return true
    }

    let resp = {saved:true,dbId:a[ADID]}

    let isCrawled = captureErrorBackground(isCrawledOrQueue,[a[FBID],CURRENT_USER_ID],URLS_SERVER.registerError,false);
    if ((a[FBID] !== -1) && !isCrawled )  {
        if(request["type"] === TYPES.frontAd || request["type"] === TYPES.sideAd) {
            captureErrorBackground(addToQueueExplanations,[CURRENT_USER_ID,request.fb_id,request.explanationUrl,a[ADID],request.graphQLAsyncParams,request.clientToken,!!request.newInterface,request.adType,request.objId,request.serialized_frtp_identifiers,request.story_debug_info],URLS_SERVER.registerError,undefined);
        }
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


    if (count<=0) {
        MEDIA_REQUESTS[req_id][url] = MEDIA_CONTENT_FAILURE;
        sendResponse({"saved":false});
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
            MEDIA_REQUESTS[req_id][url] = dataURL
            if (mediaRequestsDone(req_id)){
                request[MEDIA_CONTENT] = MEDIA_REQUESTS[req_id];
                delete MEDIA_REQUESTS[req_id];

                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerAd,
                    contentType: "application/json",
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    success: function (a) {
                        captureErrorBackground(registerAdSuccess,[a,request,sendResponse],URLS_SERVER.registerError,undefined);
                    },
                }).fail(function(a){
                    sendResponse({"saved":false});
                    return true;
                });
            }
        };
        img.src = url;
    }
    catch (e) {
        captureErrorBackground(getBase64FromImageUrl,[url,req_id,request,sendResponse,count-1],URLS_SERVER.registerError,false);
    }
    return true

}


function getBase64FromImageUrlClickedAd(url, req_id, request, count = 3) {
    var curr_ts = (new Date()).getTime();
    if ((localStorage.lastClickedAdSaved) && (curr_ts - localStorage.lastClickedAdSaved) < ONEMINUTE){
        getBase64FromImageUrlClickedAd(url,req_id, request,count = 3);
        return;
    }


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
            if (mediaRequestsDone(req_id)) {
                request[MEDIA_CONTENT] = MEDIA_REQUESTS[req_id];
                delete MEDIA_REQUESTS[req_id];
                localStorage.lastClickedAdSaved = (new Date()).getTime();
                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerClickedAd,
                    contentType: "application/json",
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                //  captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }


                            return true
                        };

                    },
                }).fail(function (a) {
                });
            }

        };

        img.src = url;

        //FLAG FINSHED
    } catch (e) {
        getBase64FromImageUrlClickedAd(url, req_id, request, count - 1);
    }

    return true;
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
 * Get languages supports(list of support languages, sponsored_text,
 * question_text and story_text) for the adgrabber.js
 */
function getSupportedLangs(){
    $.ajax({
        url:URLS_SERVER.getSupportedLanguage,
        type:REQUEST_TYPE,
        dataType: "json",
        traditional:true,
        success: function(resp){
            if (resp[STATUS] !== FAILURE) {
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

function mediaRequestsDone(reqId) {
    let allDone = true;
    for (let key in MEDIA_REQUESTS[reqId]) {
        if (MEDIA_REQUESTS[reqId][key].length<=0){
            allDone= false;
            break
        }
    }
    return allDone
}



function sendFrontAd(request,sendResponse) {

    delete request[MSG_TYPE];
    var reqId = MEDIA_REQUEST_ID++;
    var imgsToCrawl = request[IMAGES];
    if ((request[ADV_PROF_PIC]) && (request[ADV_PROF_PIC].length>0)) {
        imgsToCrawl.push(request[ADV_PROF_PIC])
    }
    MEDIA_REQUESTS[reqId] = {};
    for (let i =0 ; i<imgsToCrawl.length; i++) {
        MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';
        getBase64FromImageUrl(imgsToCrawl[i],reqId,request,sendResponse)
    }
    // IF NO IMG was detected for this Ad/Post
    if(imgsToCrawl.length === 0) {
        $.ajax({
            type: REQUEST_TYPE,
            url: URLS_SERVER.registerAd,
            contentType: "application/json",
            data: JSON.stringify(replaceUserIdEmail(request)),
            success: function (a) {
                captureErrorBackground(registerAdSuccess,[a,request,sendResponse],URLS_SERVER.registerError,undefined);
            },
        }).fail(function(a){
            sendResponse({"saved":false});
            return true;
        });
    }

    return true
}

function sendClickedAd(clickedAds) {
    var adClickedData = clickedAds.adClickedData;

    for(key in adClickedData){
        var request = adClickedData[key];
        request['user_id'] = clickedAds.user_id;

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

function sendSideAd(request,sendResponse) {
    delete request[MSG_TYPE];
    var reqId = MEDIA_REQUEST_ID++;
    var imgsToCrawl = request[IMAGES];

    MEDIA_REQUESTS[reqId] = {};
    for (let i =0 ; i<imgsToCrawl.length; i++) {
        MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';


        getBase64FromImageUrl(imgsToCrawl[i],reqId,request,sendResponse)
    }



}


function openConsent() {
    chrome.tabs.create({'url':chrome.extension.getURL('ui/new_consent.html')});
}


function getNumberOfSurveys(showPopup = false) {
    if(!isCurrentUser()) {
        window.setTimeout(getNumberOfSurveys,FIFTEENMINUTES);
        return;
    }
    let dataToSend = {
        'user_id' : CURRENT_USER_ID
    };
    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.updateSurveysNumber,
        dataType: "json",
        traditional: true,
        data: JSON.stringify(replaceUserIdEmail(dataToSend)),
        tryCount: 0,
        retryLimit: 3,
        showPopup : showPopup,
        success: function (a) {
            if (a[STATUS] && (a[STATUS] == FAILURE)) {
                if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                    //   captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                }
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    console.log('Trying again...')
                    $.ajax(this);
                    return;
                }
                console.log('Stoping trying...');
                window.setTimeout(getNumberOfSurveys,ONE_HOUR);
                return true
            }
            else {
                localStorage.setItem('survey_number', a.survey_number);
                if(a.survey_number > 0) {
                    chrome.browserAction.setBadgeText({text: a.survey_number.toString()});
                    if( timeToRemindSurveyAnswering === undefined || (new Date()).getTime() >= timeToRemindSurveyAnswering ) {
                        if(showPopup)
                            window.open("ui/popup.html", "extension_popup", "width=400,height=500s,status=no,scrollbars=yes,resizable=no");
                    }
                }
                else {
                    chrome.browserAction.setBadgeText({text: ''});
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
            window.setTimeout(getNumberOfSurveys,ONE_HOUR);
            console.log('Stoping trying...');
            return
        }
    });
}

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



function executeAfterUserIdNotFound() {
    if(not_logged_page_opened) {
        chrome.tabs.create({'url':chrome.extension.getURL("ui/not_logged.html")});
        not_logged_page_opened = false;
    }

}


function executeAfterUserId() {
    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
    window.setTimeout(executeAfterConsent, 8000);
}




function executeAfterConsent() {
    changeIcon();
    captureErrorBackground(getSupportedLangs,[],URLS_SERVER.registerError,undefined)
    captureErrorBackground(getNumberOfSurveys, [], URLS_SERVER.registerError, undefined);
    captureErrorBackground(getCurrentUserEmailByVersion,[],URLS_SERVER.registerError,undefined);
    captureErrorBackground(getCurrentLanguageByVersion,[],URLS_SERVER.registerError,undefined)
    captureErrorBackground(checkForAdBlocker,[],URLS_SERVER.registerError,undefined);
    // captureErrorBackground(checkForBehaviorsDemographics,[],URLS_SERVER.registerError,undefined);
    captureErrorBackground(checkForAdvertisers,[],URLS_SERVER.registerError,undefined);
    captureErrorBackground(checkForInterests,[],URLS_SERVER.registerError,undefined);
    captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);
}

/*********************************** FUCTIONS FIRST CALLS - RETRIVING DATA FROM LOCAL STORAGE **********************/


CAPTCHA_DETECTED = captureErrorBackground(getCaptchaStatus, [], URLS_SERVER.registerError, {});

TIMESTAMP_SHOWN_POPUP = captureErrorBackground(getLastTimeShowPopup, [], URLS_SERVER.registerError, {});

NOT_SHOW_POPUP_AGAIN = captureErrorBackground(getFlgNotifyPoupStatus, [], URLS_SERVER.registerError, {});

ADACTIVITY = captureErrorBackground(getAdActivityList,[],URLS_SERVER.registerError,{});

EXPLANATION_REQUESTS= captureErrorBackground(getExplanationRequests,[],URLS_SERVER.registerError,{});

SENT_ERRORS = captureErrorBackground(getSentErrors, [], URLS_SERVER.registerError, {});

var CRAWLED_EXPLANATIONS = captureErrorBackground(getCrawledExplanations,[],URLS_SERVER.registerError,undefined);

var EXPLANATIONS_QUEUE = captureErrorBackground(getExplanationsQueue,[],URLS_SERVER.registerError,undefined);


/*************************** CHROME WINDOWS LISTENERS ***********************************/

chrome.windows.getAll( null, function( windows ){
    NUM_WINDOWS = windows.length;
});

chrome.windows.onCreated.addListener(function(windows){
    NUM_WINDOWS++;
});


chrome.windows.onRemoved.addListener(function(windows){

    NUM_WINDOWS--;
    if( NUM_WINDOWS <= 0 ) {
        localStorage.crawledExplanations = JSON.stringify(CRAWLED_EXPLANATIONS);
        localStorage.explanationsQueue = JSON.stringify(EXPLANATIONS_QUEUE);
        localStorage.explanationRequests = JSON.stringify(EXPLANATION_REQUESTS);
        localStorage.sentErrors = JSON.stringify(SENT_ERRORS);

    }

});



/*************************** CHROME REQUEST LISTENER ***********************************/

//https://www.facebook.com/ads/preferences/dialog/?ad_id=6066215713784&optout…mnBCwNoy9Dx6WK&__af=iw&__req=d&__be=-1&__pc=PHASED%3ADEFAULT&__rev=2872472
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        if (details.url.indexOf('waist_content/dialog/?id')==-1) {
            return {cancel:false}
        }



        if (isUserRequest(details)) {
            EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())

            return   {cancel: false};


        }

        cleanRequestLog(CURRENT_USER_ID)
        var ts =  (new Date()).getTime()
        var maxTs = Math.max.apply(null, EXPLANATION_REQUESTS[CURRENT_USER_ID])

        if ((WAIT_FOR_TWO_HOURS) && (ts-maxTs < TWO_HOURS)) {
            return   {cancel: true};
        }

        if ((WAIT_FOR_TWO_HOURS) && (ts-maxTs >= TWO_HOURS)) {
            WAIT_FOR_TWO_HOURS = false;
        }

        if (ts-maxTs < WAIT_BETWEEN_REQUESTS) {
            return   {cancel: true};
        }

        EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())
        return   {cancel: false};





//            return   {cancel: true};
    },
    { urls: [BLOCKING_URL]},["blocking"]
);


/*************************** CHROME MESSAGE LISTENER ***********************************/


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

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

                if (CURRENT_USER_ID===-1) {
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

            if(request[MSG_TYPE] === "remind_me_consent") {
                window.setTimeout(openConsent, 3600000);
            }

            if(request[MSG_TYPE] === UPDATE_NUMBER_OF_SURVEYS) {
                getNumberOfSurveys(true);
                return true
            }

        }

        if (sender.tab) {

            if (!request) return true;

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
                sendSideAd(request,sendResponse)
                return true;

            }
            if (request[MSG_TYPE] === FRONTADINFO) {
                CURRENT_USER_ID = request['user_id'];
                sendFrontAd(request,sendResponse);
                return true;
            }

            if (request[MSG_TYPE] == MOUSE_CLICK_DATA){
                let dataToSend = request;
                delete dataToSend.MSG_TYPE;
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
                                //    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
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
                                //     captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
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
                                //       captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
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
                                //    captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
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

            /**
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
             **/

            if (request[MSG_TYPE] === "explanationReply") {
                processExplanationReply(request);
                return true;
            }

            if (isMessageTypeError(request[MSG_TYPE])) {
                sendErrorMessage(request, URLS_SERVER.registerError);
                return true;
            }

            if (request[TYPE] == TYPES.advertisers) {
                CURRENT_USER_ID = request['user_id'];
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
                                //     captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
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
                        setLastUserPreferenceCrawlSuccessfullAttempt(CURRENT_USER_ID,'advertisers')
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

                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(3)!=true)) {
                    return
                }

                localStorage.lastAdActivityCrawl = (new Date()).getTime()

                ADACTIVITY = getAdActivityList();
                ADACTIVITY = appendObject(ADACTIVITY,request);
                localStorage.adActivity = JSON.stringify(ADACTIVITY);

                //waiting for adActivityData comming
                //Launch a next grab if there is more ad activities listed

                return true
            }

            if (request[TYPE] == TYPES.adactivitydata){
                ADACTIVITY = getAdActivityList();
                CURRENT_USER_ID = request['user_id'];
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
                    sendClickedAd(ADACTIVITY);
                    localStorage.adActivity = JSON.stringify({});

                }

                return true
            }

            if (request[TYPE] == TYPES.demographicsNewInterface) {

                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(0)!=true)) {
                    return
                }

                $.ajax({
                    type: REQUEST_TYPE,
                    url: URLS_SERVER.registerDemographicsNewInterface,
                    dataType: "json",
                    traditional:true,
                    data: JSON.stringify(replaceUserIdEmail(request)),
                    tryCount : 0,
                    retryLimit : 3,
                    success: function (a) {
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                //    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
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

            if (request[TYPE] == TYPES.interests) {
                CURRENT_USER_ID = request['user_id'];
                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(0)!=true)) {
                    return
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
                        if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                            if (a[STATUS] && (a[REASON]=NO_USER_CONSENT)) {
                                //    captureErrorBackground(getConsentFromServer,[URLS_SERVER.getConsent,0,genericRequestSuccess,genericRequestNoConsent,genericRequestError],URLS_SERVER.registerError,undefined);
                            }

                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                console.log('Trying again...')

                                $.ajax(this);
                                return;
                            }
                            console.log('Stoping trying...');
                            return true
                        };

                        setLastUserPreferenceCrawlSuccessfullAttempt(CURRENT_USER_ID,'interests')
                        // localStorage.lastInterestCrawl = (new Date()).getTime()

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

                if ((localStorage.collectPrefs!=='true') || (hasCurrentUserConsent(0)!=true)) {
                    return
                }
                registerDemBehToServer(request);

            }

            if(request[TYPE] === TYPES.statusAdBlocker){

                let currentTime = (new Date()).getTime()
                setAdBlockerTimeChecked(CURRENT_USER_ID, currentTime)

                if(!localStorage.statusAdBlocker || localStorage.statusAdBlocker !== request["value"]) {
                    let state = ''
                    if (request['value'] === "true") {
                        state = "usingAdBlocker";
                    }
                    else {
                        state = "notUsingAdBlocker"
                    }


                    let data = {
                        user_id: CURRENT_USER_ID,
                        timestamp: currentTime,
                        event: state
                    }

                    $.ajax({
                        type: REQUEST_TYPE,
                        url: URLS_SERVER.adBlockerStatus,
                        dataType: "json",
                        traditional: true,
                        data: JSON.stringify(replaceUserIdEmail(data)),
                        tryCount: 0,
                        retryLimit: 3,
                        success: function (a) {
                            if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                                if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                                    //    captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
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

                localStorage.statusAdBlocker = request['value'];
                if(localStorage.statusAdBlocker === "true"){
                    chrome.browserAction.setIcon({ path: "media/enabled_alert.png" });
                }
                else{
                    chrome.browserAction.setIcon({ path: "media/enabled.png" });
                }


            }

            if(request[MSG_TYPE] === UPDATE_NUMBER_OF_SURVEYS) {
                getNumberOfSurveys(true);
                return true
            }

            if(request[MSG_TYPE] == "remind_me") {
                timeToRemindSurveyAnswering = request["time"]
            }
        }

    });


/*************************** CHROME TABS LISTENER ***********************************/

chrome.tabs.onUpdated.addListener(onFacebookLogin);


/*************************** On INSTALLED LISTENER ***********************************/


chrome.runtime.onInstalled.addListener(function(details){
    consent_page_opened = true;
    not_logged_page_opened = true;
});






captureErrorBackground(getCurrentUserId,[],URLS_SERVER.registerError,undefined)



