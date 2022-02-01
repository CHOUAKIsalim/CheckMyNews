
//*********************GLOBAL VARIABLES*********************************************
//
//** Capture explanation popup based on properties of JSON response object**********
var CAPTCHA_EXPLANATION_MSG = ['captcha_dialog'];
var ERROR_EXPLANATION_MSG = ['errorDescription']
var CAPTCHA_DETECTED = -1;
var TIMESTAMP_SHOWN_POPUP = -1;
var NOT_SHOW_POPUP_AGAIN = -1;


var ABOUT_THIS_FACEBOOK_AD =['About This Facebook Ad','About this Facebook ad','propos de cette pub Facebook'];
var MANAGE_YOUR_AD_PREFERENCES =['Manage Your Ad Preferences','Manage Your ad preferences','G\u00e9rer vos pr\u00e9f\u00e9rences'];


var GRAPHQLURL ='https://www.facebook.com/api/graphql/'


/**
 * returns the index that contains a specific element in a list
 * @param  {string} txt element to be found
 * @param  {object} lst list to be searched
 * @return {number}     index of the element in the list
 */
function getIndexFromList(txt,lst) {
    var idx = -1;
    for (let i=0;i<lst.length;i++) {
        idx = txt.indexOf(lst[i]);
        if (idx>=0) {
            debugLog(idx);
            return idx;
        }
    }
    return -1
   
}





/**
 * checks if explanation is of the old type (plain text explanation) and it was received normally. (This works only for specific languages)
 * @param  {string}  response the response text from the explanation request
 * @return {Boolean}          true if it is old type of explanation
 */
function isOldExplanation(response) {
    var expStart = getIndexFromList(response,ABOUT_THIS_FACEBOOK_AD);
    var expEnd = getIndexFromList(response,MANAGE_YOUR_AD_PREFERENCES);
    return ((expStart!==-1) && (expEnd!==-1));
}


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


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function getResourcesFromExplanationNewInterface(sr_revision_id) {
    let jsResources = []
    let html_page = document.documentElement.innerHTML;

    let resourceMapPost = html_page.indexOf(sr_revision_id.toString()+'},"rsrcMap"');

    while (resourceMapPost !== - 1) {
        alert("inside loop");
        let resources = findNextJSONObject(html_page, resourceMapPost + html_page.substring(resourceMapPost).indexOf("rsrcMap"))
        for (let property in resources){
            if (resources[property]['type']!=='js') {
                continue;
            }
            jsResources.push(resources[property]['src']);
        }
        alert(jsResources.length);

        resourceMapPost = html_page.indexOf(sr_revision_id.toString()+'},"rsrcMap"', resourceMapPost + 1);

    }
    return jsResources.filter(onlyUnique)
}

/**
function getResourcesFromExplanationNewInterface(explanationDialogText) {
    const resourceMapPos = explanationDialogText.indexOf('rsrcMap');
    if (resourceMapPos===-1) {
        return [];
    }
    const resources = findNextJSONObject(explanationDialogText,resourceMapPos)
    const jsResources = [];
    for (let property in resources){
        if (resources[property]['type']!=='js') {
            continue;
        }

        jsResources.push(resources[property]['src']);
    }

    return jsResources;
}
 **/



function findNextJSONObject(text,position) {
    let leftBrackets=0;
    let firstPosition = -1;
    let started = false;
    for (let i=position;i<text.length;i++) {
        if (text[i]==='}') {
            if (leftBrackets===1) {
                if (firstPosition!==-1) {
                    return JSON.parse(text.slice(firstPosition,i+1));
                }
                return {}
            }
            leftBrackets-=1;
            continue
        }

        if (text[i]==='{') {
            if (started===false) {
                firstPosition=i;
                started=true;
            }
            leftBrackets+=1;
        }
    }

}

/**
 * Parsing the doc id from the resource js that contains it
 * @param  {string} jsResource a js file that conntains the functions that Facebook users in order to send the doc_id
 * @return {string}            the doc id in string form
 */
function getDocIdFromWaistResource(jsResource, module) {
    const resourceLines = jsResource.match(/[^\r\n]+/g);
    for (let i=0;i<resourceLines.length;i++) {
        if (resourceLines[i].indexOf(module+'",[')!==-1) {
            let matchs = resourceLines[i].match('id:"([0-9]*)"')
            if (matchs.length >= 2) {
                return matchs[1]
            }
        }
    }
    throw "Doc id was not found:"+ jsResource;
}



/**
 * get the docId by crawling the waist resources in the first file needed for expalantions
 * @param  {list}   jsResources resources from explanations
 * @param  {Function} callback    function to be called after the docId is successfully retrieved
 * @return {}               
 */
function getDocIdFromWaistResources(jsResources,callback, module) {
    if (jsResources.length===0) {
        throw "Waist resource not found"
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",jsResources[0], true);
    xmlhttp.onload = function (e) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            if (xmlhttp.responseText.indexOf(module)!==-1) {
                docId = captureErrorOverload(getDocIdFromWaistResource,[xmlhttp.responseText, module],undefined);
                alert("fouuund");
                if ((docId)) {
                    callback(docId);
                    return;
                }

            }

            getDocIdFromWaistResources(jsResources.slice(1,jsResources.length),callback, module);
            return;

        }
        else{

        }
    }

    console.log("HOUNAAAAAAAAAAAA");
    xmlhttp.onerror = function (e) {
        console.log("on Error")
        console.log(e)
        getDocIdFromWaistResources(jsResources.slice(1,jsResources.length),callback, module);
    }

    // xmlhttp.setRequestHeader('Origin', 'https://www.facebook.com/');
    // xmlhttp.setRequestHeader('Referer', 'https://www.facebook.com/');
    try{
        xmlhttp.send(null);
    }
    catch (e) {
        console.log('error')
        console.log(e)
    }

}


function get_sr_revision_id(explanationDialogText) {

    let sr_revision_matches = explanationDialogText.match(/"rev":([0-9]*)/g)
    if (sr_revision_matches !== null && sr_revision_matches.length > 0) {
        let sr_revision_object = JSON.parse('{' + sr_revision_matches[0] + '}');
        return sr_revision_object["rev"];
    }
    return -1;

}

function getDocIdFromMenuResourcesNewInterface(objId,serialized_frtp_identifiers,story_debug_info,should_get_demographics, callback) {
    let params = require('getAsyncParams')('POST');
    params.doc_id = require("CometFeedStoryMenuQuery$Parameters").params.id;
    params.av = params.__user;
    params.fb_api_caller_class="RelayModern";
    params.fb_api_req_friendly_name = "CometFeedStoryMenuQuery.graphql";
    params.variables = JSON.stringify({feed_location:"NEWSFEED",id:objId,serialized_frtp_identifiers:serialized_frtp_identifiers,scale:2,story_debug_info:story_debug_info});

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST",GRAPHQLURL, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function(e) {

        let sr_revision_id = get_sr_revision_id(xmlhttp.responseText);
        let jsResources= getResourcesFromExplanationNewInterface(sr_revision_id);

        //let module = "AdsPrefWAISTDialogQuery.graphql"


        let module = "CometAdPrefsWAISTDialogRootQuery.graphql"

        captureErrorOverload(getDocIdFromWaistResources,[jsResources,callback, module],undefined);

        if(should_get_demographics) {
            captureErrorOverload(getDemographicsAndBehaviorsNewInterface,[jsResources],undefined);
        }
    }

    xmlhttp.send(param(params));

}



function getExplanationsManuallyNewInterface(userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,docId,getNewDocId,adType,objId,serialized_frtp_identifiers,story_debug_info, should_get_demographics) {
         if (getNewDocId===true){

             /** I COMMENT THIS BECAUSE ITS USELESS, IT ALWAYS FAILS
            let adsPrefWAISTDialogQuery = require("AdsPrefWAISTDialogQuery.graphql");
            if (!!adsPrefWAISTDialogQuery===true) {
                captureErrorOverload(getGraphQLExplanations,[userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,adsPrefWAISTDialogQuery.params.id,getNewDocId],undefined);
                return;
            }
              **/

            captureErrorOverload(getDocIdFromMenuResourcesNewInterface,[objId,serialized_frtp_identifiers,story_debug_info,should_get_demographics,function(newDocId) {
                captureErrorOverload(getGraphQLExplanations,[userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,newDocId,getNewDocId],undefined);
                debugLog(adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken);
            }],undefined);
       
            return
        }


        captureErrorOverload(getGraphQLExplanations,[userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,docId,getNewDocId],undefined);
        return


}

/**
 *  
 * @param  {[type]} adId           [description]
 * @param  {[type]} explanationUrl [description]
 * @param  {[type]} dbRecordId     [description]
 * @param  {[type]} timestamp      [description]
 * @return {[type]}                [description]
 */
function getExplanationsManually(userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,docId,getNewDocId,newInterface,adType,objId,serialized_frtp_identifiers,story_debug_info, should_get_demographics) {
    if (newInterface===true) {
        captureErrorOverload(getExplanationsManuallyNewInterface,[userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,docId,getNewDocId,adType,objId,serialized_frtp_identifiers,story_debug_info, should_get_demographics],undefined);
        return
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",explanationUrl, true);
    xmlhttp.onload = function (e) {
        // EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){

            var response = xmlhttp.responseText;

            //if explanation is of the old type 
            if (isOldExplanation(response)) {
                // TODO:SEND TO BACKGROUND THE EXPLANATION
                window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"response":response,"explanationType":"oldExplanation"},"*");
	            
	            CAPTCHA_DETECTED = 0;
	            localStorage.captchaDetected = CAPTCHA_DETECTED;
                return;
            }

            // TODO: NOT SURE IF IT IS IMPORTANT TO SEND THE MESSAGES ANY MORE
            // TRY IF WE CAN GET EXPLANATIONS WITHOUT RATE LIMIT NOW
            //Keep loging if something weird happened
            if (getIndexFromList(response,CAPTCHA_EXPLANATION_MSG)!=-1) {
                // TODO: SEND TO BACKGROUND MESSAGE TO SEND CAPTCHA
                window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"response":response,"explanationType":"captchaMessage",
                                "explanationUrl":explanationUrl,"dbRecordId":dbRecordId,"timestamp":timestamp,
                                "graphQLAsyncParams":graphQLAsyncParams,"clientToken":clientToken},"*");

            	return;
            }

            if (getIndexFromList(response,ERROR_EXPLANATION_MSG)!=-1) {
                CAPTCHA_DETECTED = 0;

                // TODO: SEND TO BACKGROUND MESSAGE TO SEND GENERIC ERROR
                window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"response":response,"explanationType":"genericError",
                                "explanationUrl":explanationUrl,"dbRecordId":dbRecordId,"timestamp":timestamp,
                                "graphQLAsyncParams":graphQLAsyncParams,"clientToken":clientToken},"*");

                // 
                return;
            }            


            //GET THE NEW TYPE OF EXPLANATIONS WITH GRAPHQURL

            CAPTCHA_DETECTED = 0;
        	localStorage.captchaDetected = CAPTCHA_DETECTED;
        	debugLog('GraphQL EXPLANATION');
            // TODO: REDO THE NEED USER ID DOC CRAWLING TO ASK THE SERVER
            if (getNewDocId===true){
                debugLog("Need to retrieve docId for user");
                debugLog(adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken);
                jsResources = captureErrorOverload(getResourcesFromExplanation,[response],undefined);
                debugLog(jsResources);
                captureErrorOverload(getDocIdFromWaistResources,[jsResources,function(newDocId) {
                    captureErrorOverload(getGraphQLExplanations,[userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,newDocId,getNewDocId],undefined);
                    debugLog(adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken);
                }],undefined);
                
                return;

            }
            captureErrorOverload(getGraphQLExplanations,[userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,docId,getNewDocId],undefined);

        	return;

            
        }

        else {
            // TODO MODIFY SEND ERROR MESSAGE TO SEND ERROR TO BACKGROUND SCRIPT
            window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"xmlhttp":JSON.stringify(xmlhttp),"explanationType":"requestError"},"*");
        }

    }
     
    xmlhttp.send(null);
            
    
}


/**
 * checks if explanation response (using the GRAPHQL) cotnains targeting  data
 * @param  {string}  response the responsne text from the graphql explaantion request
 * @return {boolean}          true if explanation response contains targeting data
 */
function containsTargetingDataGraphQL(response) {
    debugLog(response);
    var responseObject = JSON.parse(response);
    return responseObject['data']['waist_targeting_data'].length >0;
}





/**
 * get explanations from GraphQL
 * @param  {[type]} userId               [description]
 * @param  {[type]} adId               [description]
 * @param  {[type]} explanationUrl     [description]
 * @param  {[type]} dbRecordId         [description]
 * @param  {[type]} timestamp          [description]
 * @param  {[type]} graphQLAsyncParams [description]
 * @param  {[type]} clientToken        [description]
 * @return {[type]}                    [description]
 */
function getGraphQLExplanations(userId,adId,explanationUrl,dbRecordId,timestamp,graphQLAsyncParams,clientToken,docId,getNewDocId,newInterface,adType,objId,serialized_frtp_identifiers,story_debug_info) {
    debugLog("getGraphQLExplanations");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST",GRAPHQLURL, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function(e) {
        debugLog("On load");
            // Do whatever with response
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            var containsTargetingData = captureErrorOverload(containsTargetingDataGraphQL,[xmlhttp.response],undefined);
            debugLog("Object contains targeting data:");
            debugLog(containsTargetingData);
            if (containsTargetingData===undefined) {
                window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"response":xmlhttp.response,"explanationType":"graphQLDifferentTargetingDataError","docId":docId,"getNewDocId":getNewDocId,adType:adType,
                    objId:objId,
                    serialized_frtp_identifiers:serialized_frtp_identifiers,
                    story_debug_info:story_debug_info},"*");

                return;
            }

            if (containsTargetingData===true) {
                window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"response":xmlhttp.response,"explanationType":"graphQLExplanation","docId":docId, "getNewDocId" : getNewDocId},"*");



                return;
            }

            window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"response":xmlhttp.response,"explanationType":"graphQLOtherError","docId":docId,"getNewDocId":getNewDocId, adType:adType,
                    objId:objId,
                    serialized_frtp_identifiers:serialized_frtp_identifiers,
                    story_debug_info:story_debug_info},"*");


            //SENDING RESPONSE TO EXAMINE
            // sendExplanationDB(adId,dbRecordId,xmlhttp.response);

            return;

         }
         // TODO://REDO THIS
        // sendRequestErrorMessage(adId,dbRecordId,xmlhttp);
        window.postMessage({"type":"explanationReply","adId":adId,"dbRecordId":dbRecordId,"xmlhttp":JSON.stringify(xmlhttp),"explanationType":"graphQLRequestError","docId":docId,"getNewDocId":getNewDocId},"*");


        }

    var allParams = getGraphQLPostParameters(adId,clientToken,graphQLAsyncParams,docId);

    // TODO: PUT THE PARAMETERS IN SPECIFIC ORDER
    xmlhttp.send(param(allParams));

}


/**
 * get the parameters required for a graphql ad request
 * @param  {[type]} adId        [description]
 * @param  {[type]} clientToken [description]
 * @param  {[type]} asyncParams [description]
 * @param  {[type]} docId [description]
 * @return {[type]}             [description]
 */
function getGraphQLPostParameters(adId,clientToken,asyncParams,docId) {
    var params_extra = {'av':asyncParams.__user,'fb_api_caller_class':'RelayModern','fb_api_req_friendly_name':'AdsPrefWAISTDialogQuery',
                    'variables':JSON.stringify({'adId':adId,'clientToken':clientToken}),'doc_id':docId};

    return {...params_extra,...asyncParams};

}




