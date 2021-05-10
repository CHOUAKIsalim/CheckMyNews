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

var ONE_WEEK_EPOCH = 604800000;
var DAY_MILISECONDS =  8.64e+7;

var ONE_HALF_MINUTE = 90000;


var ONEMINUTE = 60000


/************+**********FUNCTIONS THAT HANDLE THE EXPLANATION THE SCHEDULING OF THE EXPLANATIONS******************
 /**
 * Get the timestamps of when explanations requests took place that are scheduled and stored at local storage
 * @return {object} explanation requests that took place and stored at local storage
 */
function getExplanationRequests() {
    if (!localStorage.explanationRequests) {
        localStorage.explanationRequests = JSON.stringify({})
    }

    return JSON.parse(localStorage.explanationRequests);
}


/**
 * Get the timestamps of when explanation for each ad was received from the local storage
 * @return {object} crawled explanations
 */
function getCrawledExplanations() {
    if (!localStorage.crawledExplanations) {
        localStorage.crawledExplanations = JSON.stringify({})
    }

    return JSON.parse(localStorage.crawledExplanations);

}

/**
 * Get the queue for the explanation requests that are scheduled to take place from the local storage
 * @return {object} explanations queu
 */
function getExplanationsQueue() {
    if (!localStorage.explanationsQueue) {
        localStorage.explanationsQueue = JSON.stringify({})
    }

    return JSON.parse(localStorage.explanationsQueue);

}


/**
 * initialize the the localStorage object of the last time a crawl
 * for a users' doc-id took place. If it is already initialized, nothing happens.
 *
 * @param  {String}  userId User id
 * @return {}
 */
function initializeUserDem(userId){
    if (!localStorage.lastDemCrawlTime) {

        localStorage.lastDemCrawlTime = JSON.stringify({});
    }

    let allTimes = JSON.parse(localStorage.lastDemCrawlTime);

    if (!allTimes.hasOwnProperty(userId)) {
        allTimes[userId] = 0;
        localStorage.lastDemCrawlTime = JSON.stringify(allTimes);

    }

}

/**
 * initialize the the localStorage object of the last time a crawl
 * for a users' doc-id took place. If it is already initialized, nothing happens.
 *
 * @param  {String}  userId User id
 * @return {}
 */
function initializeUserCrawlDocId(userId){
    if (!localStorage.lastDocIdCrawlTime) {

        localStorage.lastDocIdCrawlTime = JSON.stringify({});
    }

    allTimes = JSON.parse(localStorage.lastDocIdCrawlTime);

    if (!allTimes.hasOwnProperty(userId)) {
        allTimes[userId] = 0;
        localStorage.lastDocIdCrawlTime = JSON.stringify(allTimes);

    }

}

/**
 * Get the last time that the docId that has been extracted for a specific user user
 * @param  {String}  userId User id
 * @return {Integer}        epoch timestamp (milliseconds) with the last time crawl for doc id took place (0 if never)
 */
function getUserLastDemCrawlTime(userId) {
    initializeUserDem(userId);

    return JSON.parse(localStorage.lastDemCrawlTime)[userId];
}


/**
 * Get the last time that the docId that has been extracted for a specific user user
 * @param  {String}  userId User id
 * @return {Integer}        epoch timestamp (milliseconds) with the last time crawl for doc id took place (0 if never)
 */
function getUserLastDocIdCrawlTime(userId) {
    initializeUserCrawlDocId(userId);

    return JSON.parse(localStorage.lastDocIdCrawlTime)[userId];
}

/**
 * set the last time that the docId was crawled as the current time in epoch milliseconds
 * @param  {String}  userId User id
 */
function setUserDemTime(userId) {
    initializeUserDem(userId);

    const allTimes = JSON.parse(localStorage.lastDemCrawlTime);
    allTimes[userId] = (new Date()).getTime();
    localStorage.lastDemCrawlTime = JSON.stringify(allTimes);
}

/**
 * set the last time that the docId was crawled as the current time in epoch milliseconds
 * @param  {String}  userId User id
 */
function setUserDocIdTime(userId) {
    initializeUserCrawlDocId(userId);

    const allTimes = JSON.parse(localStorage.lastDocIdCrawlTime);
    allTimes[userId] = (new Date()).getTime();
    localStorage.lastDocIdCrawlTime = JSON.stringify(allTimes);
}

/**
 * checks if it is time for a docId crawl for a specific user (once per day)
 * @param  {String}  userId User id
 * @return {Boolean}        true if it is time for a docId crawl for the user
 */
function needsUserDocIdCrawling(userId) {
    const lastCrawl = getUserLastDocIdCrawlTime(userId);

    if ((new Date()).getTime() - lastCrawl > ONE_HOUR) {
        return true;
    }
    return false;
}


/**
 * checks if i can get the behaviors
 * @param  {String}  userId User id
 * @return {Boolean}        true if it is time for a docId crawl for the user
 */
function shouldGetDemographics(userId) {
    const lastDemQuery = getUserLastDemCrawlTime(userId)

    if ((new Date()).getTime() - lastDemQuery > DAY_MILISECONDS * 10 ) {
        return true;
    }
    return false;
}


/**
 * initialize in localhost a doc id for the user if it does not exist
 * @param  {String}  userId User id
 * @return {}
 */
function initializeSavedUserDocId(userId){
    if (!localStorage.savedDocId) {

        localStorage.savedDocId = JSON.stringify({});
    }

    allDocIds= JSON.parse(localStorage.savedDocId);

    if (!allDocIds.hasOwnProperty(userId)) {
        allDocIds[userId] = "";
        localStorage.savedDocId = JSON.stringify(allDocIds);

    }

}
/**
 * get the docId for the specific user
 * @param  {String}  userId User id
 * @return {String}         docId
 */
function getSavedDocId(userId) {
    initializeSavedUserDocId(userId);
    return JSON.parse(localStorage.savedDocId)[userId];
}


/**
 * set the docId for the specific user
 * @param  {String}  userId User id
 * @param  {String}  docId docId
 * @return {}
 */
function setSavedDocId(userId,docId) {
    initializeSavedUserDocId(userId);
    const allDocIds = JSON.parse(localStorage.savedDocId);
    allDocIds[userId] = docId;
    localStorage.savedDocId = JSON.stringify(allDocIds);
    setUserDocIdTime(userId);
}


/**
 * Returns true if an explanation is already in the queue or has been crawled. Also if user does not exist in the global parameters, it initiates it.
 *  (requires the GLOBAL objects of CRAWLED_EXPLANATIONS and EXPLANATIONS_QUEUE)
 * @param  {String}  adId   Facebook ad id
 * @param  {String}  userId User id
 * @return {Boolean}        true if explanation for ad with ad id already in the queue or has been crawled
 */
function isCrawledOrQueue(adId,userId) {
    if (!CRAWLED_EXPLANATIONS[userId]) {
        CRAWLED_EXPLANATIONS[userId]={};
    }

    if (!EXPLANATIONS_QUEUE[userId]) {
        EXPLANATIONS_QUEUE[userId] = {}
    }
    return ((adId in CRAWLED_EXPLANATIONS[userId]) || (adId in EXPLANATIONS_QUEUE[userId]))
}



function getNextExplanation(fbId) {
    let queuedIds = Object.keys(EXPLANATIONS_QUEUE[fbId]);
    let ts = (new Date()).getTime();
    let oldestId = {adId:-1,'timestamp':9999999999999}; // A value that is higher than all others

    for (let i =0;i<queuedIds.length;i++) {
        if (ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] > 30 * DAY_MILISECONDS) {
            try {
                delete EXPLANATIONS_QUEUE[fbId][queuedIds[i]];
                continue;
            } catch (e) {
                console.log("EXCEPTION IN getExplanation");
                console.log(e)
            }
        }

        if (EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['last_time_treated'] && ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['last_time_treated'] <= ONEMINUTE * 5) {
            continue;
        }

        if (EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['nb_errors'] && EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['nb_errors'] >= 3) {
            continue;
        }

        if ((ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] <= 30 * DAY_MILISECONDS) && (EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] <= oldestId['timestamp'])){
            oldestId.adId = queuedIds[i];
            oldestId.timestamp = EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'];
        }
    }

    try {
        let obj = EXPLANATIONS_QUEUE[fbId][oldestId.adId];
        if (oldestId.adId===-1) {
            return -1
        }

        EXPLANATIONS_QUEUE[fbId][oldestId.adId]["last_time_treated"] = (new Date()).getTime()
        return [oldestId.adId,obj.explanationUrl,obj.dbRecordId,obj.timestamp,obj.graphQLAsyncParams,obj.clientToken,!!obj.newInterface,obj.adType,obj.objId,obj.serialized_frtp_identifiers,obj.story_debug_info];
    } catch(e) {
        console.log("EXCEPTION IN getNextExplanation returning");
        console.log(e)
        return -1;
    }

}


function addToQueueExplanations(fbId,adId,explanationUrl,dbRecordId,graphQLAsyncParams,clientToken,newInterface,adType,objId,serialized_frtp_identifiers,story_debug_info) {
    if (!CRAWLED_EXPLANATIONS[fbId]) {
        CRAWLED_EXPLANATIONS[fbId]={};
    }

    if (!EXPLANATIONS_QUEUE[fbId]) {
        EXPLANATIONS_QUEUE[fbId] = {}
    }

    let queuedIds = Object.keys(EXPLANATIONS_QUEUE[fbId]);
    let ts = (new Date()).getTime();

    for (let i =0;i<queuedIds.length;i++) {
        if (ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] > 30 * DAY_MILISECONDS ) {
            try {
                delete EXPLANATIONS_QUEUE[fbId][queuedIds[i]];
            } catch (e) {
                console.log("EXCEPTION IN addToQueueExplanations");
                console.log(e)
            }
        }
    }

    queuedIds = Object.keys(EXPLANATIONS_QUEUE[fbId]);
    let crawledIds = Object.keys(CRAWLED_EXPLANATIONS[fbId]);


    if ((adId in queuedIds) || (adId in crawledIds)) {
        return false
    }
    EXPLANATIONS_QUEUE[fbId][adId] = {timestamp:ts,explanationUrl:explanationUrl,dbRecordId:dbRecordId,graphQLAsyncParams:graphQLAsyncParams,clientToken:clientToken,newInterface:newInterface,adType:adType,objId:objId,serialized_frtp_identifiers:serialized_frtp_identifiers,story_debug_info:story_debug_info}
    return true

}






//************+**********FUNCTIONS RELATED TO THE RETRIEVING OF THE EXPLANATIONS******************

/**
 * Trigger popup to the Facebook page of user in order to ask them to solve a captcha for the explanations.
 * This should be triggered only once to a user
 * @return {}
 */
function triggerCaptchaPopup(){
    CAPTCHA_DETECTED = 1;
    localStorage.captchaDetected = CAPTCHA_DETECTED;
    if (NOT_SHOW_POPUP_AGAIN == 1)
    {
        return;
    }

    //Send msg to content script -> Show the message to user
    var tsNow = (new Date()).getTime()
    if (TIMESTAMP_SHOWN_POPUP == -1 || TIMESTAMP_SHOWN_POPUP <= (tsNow - ONE_WEEK_EPOCH)) {
        chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                try {
                    chrome.tabs.sendMessage(tabs[i].id, {
                        type: "showInfoPopup"
                    }, function (response) {});
                } catch (err) {
                    console.log(err)
                }
            }
        });
    }
}

/**
 * send error message in the server with the specification that there is a captcha message
 * @param  {[type]} adId           [description]
 * @param  {[type]} explanationUrl [description]
 * @param  {[type]} dbRecordId     [description]
 * @param  {[type]} timestamp      [description]
 * @param  {[type]} response       [description]
 * @return {[type]}                [description]
 */
function sendCaptchaMessage(adId,explanationUrl,dbRecordId,timestamp,response,graphQLAsyncParams,clientToken,newInterface,adType,objId,serialized_frtp_identifiers,story_debug_info) {
    //FLAG TO NOT COLLECT EXPLANATIONS FOR TWO HOURS IF CAPTCHA MESSAGE APPEARS
    WAIT_FOR_TWO_HOURS=true;
    var errorInfo = {};
    errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
    console.log("Captcha issue: {adId : " + adId + ", response : " + response + ", dbId: " + dbRecordId + "} - "+ getExtensionVersion())
    errorInfo[ERROR_MESSAGE] = "Captcha issue: {adId : " + adId + ", response : " + response + ", dbId: " + dbRecordId + "} - "+ getExtensionVersion();
    sendErrorMessage(errorInfo, URLS_SERVER.registerError);

    // RESCHEDULE THE EXPLANATION
    EXPLANATIONS_QUEUE[CURRENT_USER_ID][adId] =	 {timestamp:ts,explanationUrl:explanationUrl,dbRecordId:dbRecordId,graphQLAsyncParams:graphQLAsyncParams,clientToken:clientToken,newInterface:newInterface,adType:adType,objId:objId,serialized_frtp_identifiers:serialized_frtp_identifiers,story_debug_info:story_debug_info};

    triggerCaptchaPopup();
}

/**
 * send generic error in the server
 * @param  {[type]} adId           [description]
 * @param  {[type]} explanationUrl [description]
 * @param  {[type]} dbRecordId     [description]
 * @param  {[type]} timestamp      [description]
 * @param  {[type]} response       [description]
 * @return {[type]}                [description]
 */
function sendGenericErrorMessage(adId,explanationUrl,dbRecordId,timestamp,response,graphQLAsyncParams,clientToken,newInterface,adType,objId,serialized_frtp_identifiers,story_debug_info) {
    WAIT_FOR_TWO_HOURS=true;
    EXPLANATIONS_QUEUE[CURRENT_USER_ID][adId] =
        {timestamp:ts,explanationUrl:explanationUrl,dbRecordId:dbRecordId,graphQLAsyncParams:graphQLAsyncParams,clientToken:clientToken,newInterface:newInterface,adType:adType,objId:objId,serialized_frtp_identifiers:serialized_frtp_identifiers,story_debug_info:story_debug_info};

    var errorInfo = {};
    errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
    errorInfo[ERROR_MESSAGE] = "Explanation error: {adId : " + adId + ", response : " + response + ", dbId: " + dbRecordId + "} - "+ getExtensionVersion();
    sendErrorMessage(errorInfo, URLS_SERVER.registerError);
}

/**
 * send error message to the server when explanation request fails
 * @return {}
 */
function sendRequestErrorMessage(adId,dbRecordId,xmlhttp,isGraphQl=false) {
    var errorInfo = {};
    errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
    errorInfo[ERROR_MESSAGE] = "Explanation response error "+ (isGraphQl?"graphql":"") +": {adId: " +adId+ + ", dbId: " + dbRecordId + ", readyState:" + xmlhttp.readyState + ", status:" + xmlhttp.status + ", response: " + xmlhttp.responseText + "} - " + getExtensionVersion();
    sendErrorMessage(errorInfo, URLS_SERVER.registerError);
}



/**
 * send error message to the server when explanation request (graphql) contains an empty targeting data field
 * @return {}
 */
function sendNoTargetingDataErrorMessage(adId,dbRecordId,response) {
    var errorInfo = {};
    errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
    errorInfo[ERROR_MESSAGE] = "Explanation error graphql waist_targeting_data exists but is empty: {adId : " + adId + ", response : " + response + ", dbId: " + dbRecordId + "} - "+ getExtensionVersion();
    sendErrorMessage(errorInfo, URLS_SERVER.registerError);
}



/**
 * send error message to the server when explanation request (graphql) contains an empty targeting data field
 * @return {}
 */
function sendDifferentTargetingDataErrorMessage(adId,dbRecordId,response) {
    var errorInfo = {};
    errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_PROBLEM;
    errorInfo[ERROR_MESSAGE] = "Explanation error graphql waist_targeting_data response does not have the required format: {adId : " + adId + ", response : " + response + ", dbId: " + dbRecordId + "} - "+ getExtensionVersion();
    sendErrorMessage(errorInfo, URLS_SERVER.registerError);
}



function processExplanationReply(msg) {

    if (msg["explanationType"] === "oldExplanation" || msg["explanationType"] === "graphQLExplanation") {
        delete EXPLANATIONS_QUEUE[CURRENT_USER_ID][msg["adId"]]

        if ((msg.docId!==undefined) && (msg.docId!=="") && (msg.getNewDocId===true)) {
            setSavedDocId(CURRENT_USER_ID,msg.docId);
        }
    }

    if (msg["explanationType"] === "oldExplanation") {
        sendExplanationDB(msg.adId,msg.dbRecordId,msg.response);
        return;
    }

    if (msg["explanationType"] === "captchaMessage") {
        sendCaptchaMessage(msg.adId,msg.explanationUrl,msg.dbRecordId,msg.timestamp,msg.response,msg.graphQLAsyncParams,msg.clientToken,msg.newInterface,msg.adType,msg.objId,msg.serialized_frtp_identifiers,msg.story_debug_info);
        return;
    }

    if (msg["explanationType"] === "genericError") {
        sendGenericErrorMessage(msg.adId,msg.explanationUrl,msg.dbRecordId,msg.timestamp,msg.response,msg.graphQLAsyncParams,msg.clientToken,msg.newInterface,msg.adType,msg.objId,msg.serialized_frtp_identifiers,msg.story_debug_info);
        return;
    }

    if (msg["explanationType"] === "requestError") {
        sendRequestErrorMessage(msg.adId,msg.dbRecordId,msg.xmlhttp);
        return;
    }
    // TODO: put them back in errors
    if (msg["explanationType"] === "graphQLDifferentTargetingDataError") {
        sendDifferentTargetingDataErrorMessage(msg.adId,msg.dbRecordId,msg.response);
        if (!EXPLANATIONS_QUEUE[CURRENT_USER_ID][msg.adId]['nb_errors']) {
            EXPLANATIONS_QUEUE[CURRENT_USER_ID][msg.adId]['nb_errors'] = 0
        }
        EXPLANATIONS_QUEUE[CURRENT_USER_ID][msg.adId]['nb_errors'] += 1
        if ((msg.docId!=="") && (msg.docId!==undefined) && (msg.getNewDocId===true)) {
            setSavedDocId(CURRENT_USER_ID,msg.docId);
        }
        return;
    }

    if (msg["explanationType"] === "graphQLExplanation") {
        sendExplanationDB(msg.adId,msg.dbRecordId,msg.response);

        return;
    }


    if (msg["explanationType"] === "graphQLOtherError") {
        sendNoTargetingDataErrorMessage(msg.adId,msg.dbRecordId,msg.response);
        if ((msg.docId!=="") && (msg.docId!==undefined) && (msg.getNewDocId===true)) {
            setSavedDocId(CURRENT_USER_ID,msg.docId);
        }
        return;
    }


    if (msg["explanationType"] === "graphQLRequestError") {
        sendRequestErrorMessage(msg.adId,msg.dbRecordId,msg.xmlhttp);
        if ((msg.docId!=="") && (msg.docId!==undefined) && (msg.getNewDocId===true)) {
            setSavedDocId(CURRENT_USER_ID,msg.docId);
        }
        return;
    }





}



// function sendExplanationToContentScripts() {
// // function sendExplanationToContentScripts() {


//     chrome.tabs.query({}, function(tabs){
//         var facebookTabOpen = false;

//         for (let i=0;i<tabs.length;i++) {
//              console.log("Looking for open facebook.com tabs")

//             if ((tabs[i].url!==undefined ) && (tabs[i].url.indexOf('facebook.com')>0 ) && (tabs[i].url.indexOf('adsmanager')<0)){

//                 var params = captureErrorBackground(getNextExplanation,[CURRENT_USER_ID],URLS_SERVER.registerError,-1);

//                 if (params===-1) {
//                     return;
//                 }

//                 var [adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken] = params;


//                 console.log(tabs[i].url)
//                 chrome.tabs.sendMessage(tabs[i].id, {
//                     type: "getExplanation",
//                     adId:adId,
//                     explanationUrl:explanationUrl,
//                     dbRecordId:dbRecordId,
//                     timestamp:timestamp,
//                     graphQLAsyncParams:graphQLAsyncParams,
//                     clientToken:clientToken,
//                     docId:getSavedDocId(CURRENT_USER_ID),
//                     getNewDocId:needsUserDocIdCrawling(CURRENT_USER_ID)
//                     });
//                 facebookTabOpen = true;
//                 break;
//                 }
//          }

//          if (facebookTabOpen===false) {
//             console.log("There was not any open facebook.com tabs. Will try later");
//             return;
//          }
//     });


// }



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
            captureErrorBackground(addToCrawledExplanations,[CURRENT_USER_ID,adId],URLS_SERVER.registerError,false);

            return true

        },
    }).fail(function(a){
        captureErrorBackground(sendExplanationDB,[adId,dbRecordId,explanation,count-1],URLS_SERVER.registerError,false);

        return true


    });}

/**
 * cleans the request log of timestamps of ecplanations that are crawled that are older than one day, and ads a new
 * @param  {string} userId user-id
 * @return {undefined}
 */
function cleanRequestLog(userId) {
    if (!(userId in EXPLANATION_REQUESTS)) {
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


/**
 * checks if it is time to get new explanation, and fetches the next explanation if it is due to be crawled
 *
 * @return {undefined}
 */
function exploreQueue() {

    if ((EXPLANATIONS_QUEUE) && (CURRENT_USER_ID in EXPLANATIONS_QUEUE)) {
        captureErrorBackground(cleanRequestLog,[CURRENT_USER_ID],URLS_SERVER.registerError,undefined);

        var ts =  (new Date()).getTime()
        var maxTs = Math.max.apply(null, EXPLANATION_REQUESTS[CURRENT_USER_ID])

        if (!LOGGED_IN) {
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);
            },ONE_HALF_MINUTE/2);
            return
        }

        if ((WAIT_FOR_TWO_HOURS) &&(ts-maxTs < TWO_HOURS)) {
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);
            },WAIT_BETWEEN_REQUESTS);
            return
        }

        if ((WAIT_FOR_TWO_HOURS) &&(ts-maxTs >= TWO_HOURS)) {
            WAIT_FOR_TWO_HOURS=false;
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);
            },WAIT_BETWEEN_REQUESTS/12);

            return
        }

        if (ts-maxTs < WAIT_BETWEEN_REQUESTS) {
            window.setTimeout(function() {
                captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);

            },WAIT_BETWEEN_REQUESTS  - (ts-maxTs));
            return
        }

        captureErrorBackground(sendExplanationToContentScripts,[],URLS_SERVER.registerError,undefined);

    }


    window.setTimeout(
        function() {
            captureErrorBackground(exploreQueue,[],URLS_SERVER.registerError,undefined);
        },WAIT_BETWEEN_REQUESTS/12);
}



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


function processTabsForExplanations(tabs) {
    if (tabs.length===0) {
        return
    }

    var tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {type:"isValidTab"},function(response) {

        if (response===undefined) {
            processTabsForExplanations(tabs.slice(1,tabs.length))
            return
        }

        if (response.validTabResponse!=='yes') {
            processTabsForExplanations(tabs.slice(1,tabs.length))
            return
        }


        var params = captureErrorBackground(getNextExplanation,[CURRENT_USER_ID],URLS_SERVER.registerError,-1);

        if (params===-1) {
            return;
        }

        let should_get_demographics = false;
        if (shouldGetDemographics(CURRENT_USER_ID) === true) {
            setUserDemTime(CURRENT_USER_ID);
            should_get_demographics = true;
        }

        var [adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,newInterface,adType,objId,serialized_frtp_identifiers,story_debug_info] = params;
        chrome.tabs.sendMessage(tab.id, {
            type: "getExplanation",
            adId:adId,
            explanationUrl:explanationUrl,
            dbRecordId:dbRecordId,
            timestamp:timestamp,
            graphQLAsyncParams:graphQLAsyncParams,
            clientToken:clientToken,
            docId:getSavedDocId(CURRENT_USER_ID),
            newInterface:newInterface,
            getNewDocId:needsUserDocIdCrawling(CURRENT_USER_ID),
            adType:adType,
            objId:objId,
            serialized_frtp_identifiers:serialized_frtp_identifiers,
            story_debug_info:story_debug_info,
            getDemographics:should_get_demographics

        });

    });



}

function sendExplanationToContentScripts() {

    chrome.tabs.query({}, function(tabs){
        processTabsForExplanations(tabs)
    });


}

