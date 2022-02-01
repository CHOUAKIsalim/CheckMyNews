//************ PATTERNS TO DETECT ELEMENTS REQUIRED FOR EXPLANATION URL
var QID_PATT = /qid.[0-9]+/;
var NUMBER_TAG = /[0-9]+/;

// var AJAXIFYPATTERN = /ajaxify":"\\\/ads\\\/preferences\\\/dialog\S+?"/ OLD PATTERN (DEPRECATED)
var AJAXIFYPATTERN = /ajaxify":"\\\/waist_content\\\/dialog\S+?"/;
var AJAXIFYPATTERN_POST = /ajaxify":"\\\/ajax\\\/feed\\\/filter_action\\\/dialog_direct_action\S+?"/;
var ADIDPATTERN = /id=[0-9]+/;
var CLIENTTOKEN_PATTERN = /client_token=(.*?)&/
var BUTTON_ID_PATT = /button_id=\S+?&/;

//********deceprated TODO:CHECK AGAIN TO MAKE SURE

//var CONTENTS = 'contents';

//button_id=u_ps_0_0_c&

function getQid(url) {
  try {
    return url.match(QID_PATT)[0].match(NUMBER_TAG)[0];
  } catch (exp) {
    debugLog("Exception in getQid:");
    debugLog(exp);
  }
  return NaN;
}

function getButtonId(url) {
  try {
    return url
        .match(BUTTON_ID_PATT)[0]
        .replace("button_id=", "")
        .replace("&", "");
  } catch (exp) {
    debugLog("Exception in getButtonId:");
    debugLog(exp);
  }
  return NaN;
}

function getAdIdParams(response) {
  try {
    patt = response.match(AJAXIFYPATTERN)[0].replace();
  } catch (exp) {
    debugLog("Exception in getAdIdParams:");
    debugLog(exp);
  }
  return NaN;
}

(function() {
  var XHR = XMLHttpRequest.prototype;
  // Remember references to original methods
  var open = XHR.open;
  var send = XHR.send;

  // Overwrite native methods
  // Collect data:
  XHR.open = function(method, url) {
    this._method = method;
    this._url = url;
    return open.apply(this, arguments);
  };

  function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
  }

  // Implement "ajaxSuccess" functionality
  XHR.send = function(postData) {
    this.addEventListener("load", function() {
      if (
          this._url &&
          this._url.indexOf &&
          this._url.indexOf("options_menu/?button_id=") > -1
      ) {
        //                lala = this;

        var qId = getQid(this._url);
        var buttonId = getButtonId(this._url);

        if (!qId || !buttonId) {
          //                    not relevant
          return true;
        }

        debugLog(qId, buttonId);

        var requestParams = '';
        var clientToken = '';
        var adId = '';
        try{
          requestParams = this.responseText
              .match(AJAXIFYPATTERN)[0]
              .replace('ajaxify":"\\/waist_content\\/dialog\\/?', "");

          requestParams = requestParams.slice(0, requestParams.length - 1);
          requestParams = decodeURIComponent(unicodeToChar(requestParams));
          debugLog(requestParams);
          clientToken = requestParams.match(CLIENTTOKEN_PATTERN)[1];
          adId = requestParams.match(ADIDPATTERN)[0].match(NUMBER_TAG)[0];
        }
        catch{
          requestParams = this.responseText
              .match(AJAXIFYPATTERN_POST)[0]
              .replace('ajaxify":"\\/ajax\\/feed\\/filter_action\\/dialog_direct_action\\/?', "");
          requestParams = requestParams.slice(0, requestParams.length - 1);
          requestParams = decodeURIComponent(unicodeToChar(requestParams));
        }



        var asyncParams = require("getAsyncParams")("GET");
        var graphQLAsyncParams = require("getAsyncParams")("POST");




        data = {
          qId: qId,
          buttonId: buttonId,
          requestParams: requestParams,
          adId: adId,
          adButton: true,
          asyncParams: asyncParams,
          clientToken: clientToken,
          graphQLAsyncParams: graphQLAsyncParams

        };

        window.postMessage(data, "*");
        return;
      }

    });

    try {
     return send.apply(this, arguments);
    }catch (e){
      console.log("error in sending request from xhrOverloadButtons")
      console.log(e)
    }
  };
})();



window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window) return;






  if (event.data.grabNewInterface) {
    processAd(event.data.customId, event.data.type);
    return true;
  }
   handleUniversalCommunication(event);
});
