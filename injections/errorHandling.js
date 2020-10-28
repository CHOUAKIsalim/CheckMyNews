

const DEBUGADANALYST = true;

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


function debugLog(msg) {
    if (DEBUGADANALYST===true) {
        console.log(msg);
    }
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

    // var msg = "Function " + targetFunction.name + ": " + JSON.stringify(errorObject,errorReplacer) + " - " + getExtensionVersion();
    var msg = "Function " + targetFunction.name + ": " + JSON.stringify(errorObject,errorReplacer) ;

    debugLog(msg);
    return msg;

}


// TODO: implement the functionality for error reporting
function captureErrorOverload(targetFunction,arguments,returnError) {
    try {
        return targetFunction.apply(NaN,arguments)
    } catch(error) {
        var errorInfo = {};
        errorInfo['type'] = 'overloadError';
        errorInfo['error_message'] = constructErrorMsg(targetFunction,error);
        // chrome.runtime.sendMessage(errorInfo, function(response) {
        window.postMessage(errorInfo, "*");
        return returnError;
    }
}
