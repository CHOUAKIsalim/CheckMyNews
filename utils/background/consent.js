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



//TEMPLATE FUNCTIONS RELATED WITH THE CONSENT MECHANISMS




var consentRequestedTime = null;


/**
 * returns if current user has consent for a specific action
 * @param  {number}  consentMode consent level (based on consent id) required for specific action.
 *                               If mode is 0, any consent is suitable for the specific action.
 * @return {Boolean}      true if user has consent for specific mode else false
 */
function hasCurrentUserConsent(consentMode) {
    // there exist no current user
    if (isCurrentUser()!=true) {
        return false;
    }


    // consents object does not exist
    if ((!localStorage[CURRENT_USER_ID+'consents']) || ((!localStorage[CURRENT_USER_ID+'consents']).length===0) || (localStorage[CURRENT_USER_ID+'consents']==='undefined') ) {
        // TODO mark to ask for consent
        return false;
    }


    var consents = JSON.parse(localStorage[CURRENT_USER_ID+'consents']);

    // 0 is set on the server
    if (!consents[consentMode]) {
        return false;
    }

    return consents[consentMode];
}




/**
 * store consent object in the local storage after reply from the server
 * @param {object} consents object containing the consents that the user has given
 */
function setConsents(consents) {
    localStorage[CURRENT_USER_ID+'consents'] = JSON.stringify(consents);
}


/**
 * asks the server whether current user has consent
 * @param  {string} consentApiUrl     url to perform the call
 * @param  {number} consentMode     consent mode (0=any consent)
 * @param  {function} consentPositive function to be called when the user has given the required consent
 * @param  {function} consentNegative function to be called when the user has not given the required consent
 * @param  {function} consentError    function to be called when the request to the server encounters some error
 * @return {}
 */
function getConsentFromServer(consentApiUrl,consentMode,onConsentPositive,onConsentNegative,onConsentError) {
    if (isCurrentUser()!==true) {
        return;
    }

    if((consentRequestedTime !== null) && (new Date().getTime() - consentRequestedTime < 5 * 60 * 1000)) {
        return;
    }

    var dat = replaceUserIdEmail({user_id:CURRENT_USER_ID});
    $.ajax({
        url:consentApiUrl,
        type:REQUEST_TYPE,
        data:dat,
        dataType: "json",
        traditional:true,
        success: function(resp){
            consentRequestedTime = new Date().getTime();
            if (isCurrentUser()!==true) {
                return;
            }
            setConsents(resp.consents);
            if (resp.consents[consentMode]==true) {
                onConsentPositive(resp);
                return;
            }
            onConsentNegative(resp);
        },
        error: function() {
            onConsentError();
        }

    });
    return;
}



//REPLYING TO CONTENT SCRIPTS OR POPUP

/**
 * when consent is positive in the general case it should send a response back to the script
 * "this"  corresponds to the sendResponse function that will be bound
 * @return {}
 */
function replyOnConsentPositive() {
    this({"consent":true, 'currentUser' : sha512(String(CURRENT_USER_ID))});

}

/**
 * when consent is negative in the general case it should send a response back to the script accompanied with the minimum timestamp for the user
 * "this"  corresponds to the sendResponse function that will be bound
 * @return {}
 */
function replyOnConsentNegative(resp) {
//    this({"consent":false,"minTimestamp":resp.min_timestamp});
    this({"consent":false});
}

/**
 * when consent request failed in the general case it should send a response back to the script accompanied with a specification that it is error
 * "this"  corresponds to the sendResponse function that will be bound
 * @return {}
 */
function replyOnConsentError() {
    this({"consent":false,"err":true});
}


/**
 * function that is activated if user has not given consent. It changes the icon in the popup.js
 * @return {}
 */
function genericRequestNoConsent() {
    if(consent_page_opened) {
        chrome.tabs.create({'url':chrome.extension.getURL("ui/new_consent.html")});
        consent_page_opened = false;
    }
    window.setTimeout(function() {captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);},ONE_HOUR)
    return;
}



/**
 * returns consent status to other content or popup scripts if they ask for consent
 * @param  {[type]} sendResponse function to reply to the script that made the inquiry
 * @param  {number} consentMode  mode
 * @return {}
 */
function sendConsentStatusToComponents(consentApiUrl,sendResponse,consentMode=0){
    if (isCurrentUser()!==true) {
        sendResponse({"consent":false,notLoggedIn:true});
        return true;
    }
    if (hasCurrentUserConsent(consentMode)) {
        sendResponse({"consent":true, "currentUser" : sha512(String(CURRENT_USER_ID))});
        return true;
    }
    var onConsentPositiveSendResponse = replyOnConsentPositive.bind(sendResponse);
    var onConsentNegativeSendResponse = replyOnConsentNegative.bind(sendResponse);
    var onConsentErrorSendResponse = replyOnConsentError.bind(sendResponse);
    getConsentFromServer(consentApiUrl,consentMode,onConsentPositiveSendResponse,onConsentNegativeSendResponse,onConsentErrorSendResponse)
    return true;
}



//OPENING CONSENT FORM FOR NEW USERS

/**
 * shows message that user did not sign the consent for old users that were using the tool before the change,
 *  and open a new window with the consent form to sign it for all users that have not sign consent
 * @param  {object} resp response from the server
 * @return {}
 */
function openConsentWindow(resp) {
//    var isMessageShown = localStorage[CURRENT_USER_ID+'isMessageShown'];

    //Message has already been shown
//    if (isMessageShown===true) {
  //      return;
  //  }

//    var minTimestamp = resp.min_timestamp;
//    if (minTimestamp && (minTimestamp<MIN_TIMESTAMP_MESSAGE)) {
 //       alert("It seems that you have installed Social Media Monitor but you didn't sign the consent form. Why don't you click on the Social Media Monitor icon and sign the form?\n This message will not be shown again!");
 //       localStorage[CURRENT_USER_ID+'isMessageShown'] = true;
 //       return;
 //   }


//    chrome.tabs.create({'url':chrome.extension.getURL(POPUPHTML)});
 //   localStorage[CURRENT_USER_ID+'isMessageShown'] = true;

//    return ;


}


/**
 * Checks if user has given consent, and if not prompts them with a respective message to sign consent, or open the new popup window
 * @param  {string} consentApiUrl     url to perform the call
 * @param  {number} consentMode     consent mode (0=any consent)
 * @return {}
 */
function openWindowToNewUsers(consentApiUrl,consentMode=0) {

    //TODO: MODIFY FOR NEW CONSENT IF WE WANT TO INFORM OLD USERS
    if (isCurrentUser()!==true) {
        return;
    }


    if (hasCurrentUserConsent(consentMode)===true) {
        return;
    }

    getConsentFromServer(consentApiUrl,consentMode,genericRequestSuccess,openConsentWindow,genericRequestError)



}


/**
 * when the request sennt back a consent reply with the consent status of the user to the server
 * "this"  corresponds to the sendResponse function that will be bound
 * @return {}
 */
function replyOnSuccessInRegistration(consents,sendResponse) {
    alert("sending response");
    alert(JSON.stringify(consents));
    if (sendResponse) {
        sendResponse({"ok":true,"consents":consents, "currentUser" :  sha512(String(CURRENT_USER_ID))});
        consentRequestedTime = null;
    }
}


/**
 * call when the register consetn request had some error
 * "this"  corresponds to the sendResponse function that will be bound
 * @return {}
 */
function replyOnFailureInRegistration(errorMsg,sendResponse) {
    if (sendResponse) {
        sendResponse({"ok":false,"errorMsg":errorMsg});
    }
}





/**
 *  Registers consent
 * @param {function} sendResponse
 */
function registerConsent(registerConsentApiUrl,sendResponse=undefined,countEffort=3) {

    if (isCurrentUser()!==true) {
        return;
    }

    if (countEffort<=0) {
        return
    }

    $.ajax({
        url: registerConsentApiUrl,
        type: REQUEST_TYPE,
        data: replaceUserIdEmail({user_id: CURRENT_USER_ID,extension_version:getExtensionVersion()}),
        dataType: "json",
        traditional: true,
        success: function (resp) {
            alert(JSON.stringify(resp));
            // TODO: maybe send back the user_id for conf
            if (isCurrentUser()!==true) {
                replyOnFailureInRegistration("User currently not logged-in",sendResponse);
            }

            if (resp.consents) {
                setConsents(resp.consents);

            }

            replyOnSuccessInRegistration(resp.consents,sendResponse);

            return true;
        },
        error: function () {
            countEffort--;
            setTimeout(registerConsent,2000,registerConsentApiUrl,sendResponse,countEffort);
            if (countEffort==1) {
                replyOnFailureInRegistration("Request failed",sendResponse);
            }
        }
    });

    sendExtensionNameAndVersion();
      return true
}

function sendExtensionNameAndVersion(){
    let data ={
        "user_id": CURRENT_USER_ID,
        "name": getExtensionName(),
        "version": getExtensionVersion(),
        "timestamp" : (new Date()).getTime()
    };
    $.ajax({
        url: URLS_SERVER.storeExtensionNameAndVersion,
        type: REQUEST_TYPE,
        data: JSON.stringify(replaceUserIdEmail(data)),
        dataType: "json",
        traditional: true,
        success: function (resp) {
            return true;
        },
        error: function () {
            return true;
        }
    });
}