//The MIT License
//
//Copyright (c) 2019 Oana Goga, <oana.goga@univ-grenoble-alpes.fr>
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


var MSG_TYPE = 'message_type';

var ERROR_TYPES = {
    CONTENT_SCRIPT_ERROR: 'Content script error',
    BACKGROUND_ERROR: 'Background script error',
    TEST_ERROR_CONTENT_SCRIPT: 'Testing content script error',
    TEST_ERROR_BACKGROUND_SCRIPT: 'Testing background script error',
    INJECTION_ERROR: 'Injection script error', //not yet implemented
    TEST_ERROR_INJECTION_ERROR: 'Testing injection script error', //not yet implemented,
    BACKGROUND_PROBLEM: 'Background script problem'
};

var ERROR_MESSAGE = 'error_message';


function getSentErrors() {
    if (!localStorage.sentErrors) {
        localStorage.sentErrors = JSON.stringify({})
    }

    return JSON.parse(localStorage.sentErrors);

}



/**
 * Check if string is a message type of the ERROR_TYPES object
 *
 *
 * @param  {string}  msg msg to check
 * @return {Boolean}     true if the msg exists as avalue in the ERROR_TYPES object
 */
function isMessageTypeError(msg) {


    for (var key in ERROR_TYPES){
        if (ERROR_TYPES[key] === msg) {
            return true;
        }
    }

    return false;

}


/*
* Get the extension version from manifest file
*/
function getExtensionVersion(){
    var manifestData = chrome.runtime.getManifest();
    if (manifestData.version !== undefined)
        return "Extension version: " + manifestData.version;
    return "Extension version: unknown "
}


/*
* Get the extension name from manifest file
*/
function getExtensionName(){
    var manifestData = chrome.runtime.getManifest();
    if (manifestData.name !== undefined)
        return manifestData.name;
    return "Extension name: unknown "
}

/**
 * To be used as a replacer for the JSON.stringify function for errors.
 * The problem lies in the fact that if you call JSON.stringify on an error object, you get an empty message.
 * This replacer creates a new object which has the exact keys, values that the error message has and strigifies this instead.
 *
 *
 * @param  {string} key Key for spefici JS object field
 * @param  {object} value Value of specific JS object field
 * @return {object} object to be sent to the. JSON.stringify function
 */
function errorReplacer(key, value) {
    if (value instanceof Error) {
        var error = {};

        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });

        return error;
    }

    return value;
}




/**
 * Constructs error message to be sent to the server
 *
 *
 * @param  {function} targetFunction Function that if called wrong triggers the error message
 * @param  {object} errorObject error object o be assigned to a message
 * @return {string} Error message to be sent to the server
 */
function constructErrorMsg(targetFunction, errorObject) {

    var msg = "Function " + targetFunction.name + ": " + JSON.stringify(errorObject,errorReplacer) + " - " + getExtensionVersion();
    return msg;

}



/**
 * Replace the email or user id of a JS object with their hashed version
 *
 * @param  {object} obj A JS object which may contain the user_id or email property
 * @return {object} The same object but with the user_id and email hashed
 */
function replaceUserIdEmail(obj) {
    if (obj.user_id!==undefined) {
        if ((obj.user_id!==-1) && (obj.user_id!=='-1')) {
            obj.user_id = sha512(String(obj.user_id));
        }
    }

    if (obj.email!==undefined) {
        if (obj.email!=='') {
            obj.email = sha512(String(obj.email));
        }
    }

    if (obj.phone!==undefined) {
        if (obj.phone!=='') {
            obj.phone = sha512(String(obj.phone));
        }
    }

    obj.is_hashed=true;



    return obj;
}


function alreadySent(errorInfo) {
    for(let i =0 ; i<SENT_ERRORS.length; i++ ) {
        var currentElem = SENT_ERRORS[i];
        if(currentElem['user_id']===errorInfo['user_id'] && currentElem['error_message']===errorInfo['error_message'] && currentElem['message_type'] === errorInfo['message_type']) {
            return true
        }
    }
    return false
}

function cleanErrorMessages() {
    let res = []
    let currTime = (new Date()).getTime();

    for(let i =0 ; i<SENT_ERRORS.length; i++ ) {
        let  currentElem = SENT_ERRORS[i];
        if (currTime - currentElem["time"] <= 15 * DAY_MILISECONDS) {
            res.push(currentElem)
        }
    }
    return res;
}


/**
 * Sennd error to the server
 *
 * @param  {object} errorInfo The error object that will be sent to the server
 * @param  {string} errorURL The url to send the error message to
 * @return {}
 */
function sendErrorMessage(errorInfo, errorURL) {

    SENT_ERRORS = cleanErrorMessages()

    errorInfo['user_id'] = CURRENT_USER_ID
    errorInfo =replaceUserIdEmail(errorInfo)

    if(alreadySent(errorInfo)) {
        return true
    }
    else{
        SENT_ERRORS.push({
            'user_id' : errorInfo['user_id'],
            'error_message' : errorInfo['error_message'],
            'message_type' : errorInfo['message_type'],
            'time' : (new Date()).getTime()
        })
    }

    try {

        $.ajax({
            type: REQUEST_TYPE,
            url: errorURL,
            dataType: "json",
            traditional:true,
            data: JSON.stringify(errorInfo),
            success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                    console.log('Failure to register error while it reached');
                    console.log(JSON.stringify(errorInfo));

                    return true};
                console.log(errorInfo);
                console.log('Success registering error');

            },
        }).fail(function(a){
                console.log('Failure to register error');
                console.log(JSON.stringify(errorInfo));
            }
        )}


    catch (error) {
        console.log("error message failed  " + JSON.stringify(error,errorReplacer));
        console.log(JSON.stringify(errorInfo));
    }
}





/**
 * Decorator that sends an error message if some untriggered exception
 * happens when the function is called. Can work only from the background script, since it
 * communicates with the server
 *
 * @param  {function} targetFunction The function that needs to be decorated
 * @param  {object} arguments A list of arguments that need to be called by the targetFunction
 * @param  {string} errorUrl  The url to send the error message to
 * @param  {object} returnError what to return in case of an exception
 * @return {}
 */
function captureErrorBackground(targetFunction,arguments,errorUrl,returnError){

    try {
        return targetFunction.apply(NaN,arguments)
    } catch(error) {
        var errorInfo = {};
        errorInfo[MSG_TYPE] = ERROR_TYPES.BACKGROUND_ERROR;
        errorInfo[ERROR_MESSAGE] = constructErrorMsg(targetFunction,error);
        sendErrorMessage(errorInfo,errorUrl);
        return returnError;
    }


}





/**
 * Decorator that sends the background script an error message  to send to the server
 * if some untriggered exception happens when the function is called.
 * Supposed to work from the content scripts and let the background script to know to send a message
 *
 * @param  {function} targetFunction The function that needs to be decorated
 * @param  {object} arguments A list of arguments that need to be called by the targetFunction
 * @param  {object} returnError what to return in case of an exception
 * @return {}
 */
function captureErrorContentScript(targetFunction,arguments,returnError) {
    try {
        return targetFunction.apply(NaN,arguments)
    } catch(error) {
        var errorInfo = {};
        errorInfo[MSG_TYPE] = ERROR_TYPES.CONTENT_SCRIPT_ERROR;
        errorInfo[ERROR_MESSAGE] = constructErrorMsg(targetFunction,error);
        chrome.runtime.sendMessage(errorInfo, function(response) {

            console.log("captureErrorContentScript: " + JSON.stringify(response));

        })

        return returnError;

    }

}





/**
 * Checks whether errors from content scripts are registered to the database
 *
 *
 * @return {undefined}
 */
function captureErrorContentScriptTest() {
    try {
        console.log("Throwing exception as test for content script");
        throw "Register error of content script testing Exception";
    } catch(error) {
        var errorInfo = {};
        errorInfo[MSG_TYPE] = ERROR_TYPES.TEST_ERROR_CONTENT_SCRIPT;
        errorInfo[ERROR_MESSAGE] = constructErrorMsg(captureErrorContentScript,error);
        chrome.runtime.sendMessage(errorInfo, function(response) {

            console.log("captureErrorContentScript: test " + JSON.stringify(response));

        })

        return undefined;

    }

}




/**
 * Checks whether errors from background scrip are registered to the database
 *
 *
 * @return {undefined}
 */
function captureErrorBackgroundTest(errorUrl){

    try {
        console.log("Throwing exception as test for background script");
        throw "Register error of background script testing Exception";
    } catch(error) {
        var errorInfo = {};
        errorInfo[MSG_TYPE] = ERROR_TYPES.TEST_ERROR_BACKGROUND_SCRIPT;
        errorInfo[ERROR_MESSAGE] = constructErrorMsg(captureErrorBackgroundTest,error);
        sendErrorMessage(errorInfo,errorUrl);
        return undefined;
    }


}




