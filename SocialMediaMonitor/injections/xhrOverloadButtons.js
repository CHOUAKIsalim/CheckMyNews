//************ PATTERNS TO DETECT ELEMENTS REQUIRED FOR EXPLANATION URL
var QID_PATT = /qid.[0-9]+/;
var NUMBER_TAG = /[0-9]+/;

// var AJAXIFYPATTERN = /ajaxify":"\\\/ads\\\/preferences\\\/dialog\S+?"/ OLD PATTERN (DEPRECATED)
var AJAXIFYPATTERN = /ajaxify":"\\\/waist_content\\\/dialog\S+?"/;
var AJAXIFYPATTERN_POST = /ajaxify":"\\\/ajax\\\/feed\\\/filter_action\\\/dialog_direct_action\S+?"/;
var ADIDPATTERN = /id=[0-9]+/;
var CLIENTTOKEN_PATTERN = /client_token=(.*?)&/
var BUTTON_ID_PATT = /button_id=\S+?&/;

//** FACEBOOK DICTIONARIES KEYS*******
var PAYLOAD = "payload";
var HISTORYCLICKED = "click_history";
var HISTORYROW = "history_rows";
var HASMORE = "has_more_items";
var LASTITEMSERVED = "last_item_served_hash";

//*****FACEBOOK RELATED URLS********
var INTERESTSURL = "ads/profile/interests/";
var ADVERTISERSURL = "ads/profile/advertisers/";
var ADACTIVITYURL =
  "business_integrity/purchase_history/purchase_history_row_data/";
var ADCONTENTURL =
  "click_activity/preview_contents/?ad_id={0}&image_height=78&image_width=150";

//********deceprated TODO:CHECK AGAIN TO MAKE SURE

//var CONTENTS = 'contents';

//button_id=u_ps_0_0_c&

function getQid(url) {
  try {
    return url.match(QID_PATT)[0].match(NUMBER_TAG)[0];
  } catch (exp) {
    console.log("Exception in getQid:");
    console.log(exp);
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
    console.log("Exception in getButtonId:");
    console.log(exp);
  }
  return NaN;
}

function getAdIdParams(response) {
  try {
    patt = response.match(AJAXIFYPATTERN)[0].replace();
  } catch (exp) {
    console.log("Exception in getAdIdParams:");
    console.log(exp);
  }
  return NaN;
}
//lala = 0;
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

        console.log(qId, buttonId);
        //                var button_data = JSON.parse(this.responseText.replace("for (;;);", ''));
        //                LALALA = this.responseText;
        // var requestParams = this.responseText.match(AJAXIFYPATTERN)[0].replace('ajaxify":"\\\/ads\\\/preferences\\\/dialog\\\/?',''); (DEPRECATED)
        var requestParams = '';
        var clientToken = '';
        var adId = '';
        try{
          requestParams = this.responseText
          .match(AJAXIFYPATTERN)[0]
          .replace('ajaxify":"\\/waist_content\\/dialog\\/?', "");

          requestParams = requestParams.slice(0, requestParams.length - 1);
          //decoding parameters
          requestParams = decodeURIComponent(unicodeToChar(requestParams));
          console.log(requestParams);
          clientToken = requestParams.match(CLIENTTOKEN_PATTERN)[1];
          adId = requestParams.match(ADIDPATTERN)[0].match(NUMBER_TAG)[0];
        }
        catch{
          requestParams = this.responseText
            .match(AJAXIFYPATTERN_POST)[0]
            .replace('ajaxify":"\\/ajax\\/feed\\/filter_action\\/dialog_direct_action\\/?', "");
          requestParams = requestParams.slice(0, requestParams.length - 1);
          //decoding parameters
          requestParams = decodeURIComponent(unicodeToChar(requestParams));
          console.log('>>>>>')
          console.log(requestParams);
        }


        var asyncParams = require("getAsyncParams")("GET");
        var graphQLAsyncParams = require("getAsyncParams")("POST");


        // var docId = require('AdsPrefWAISTDialogQuery.graphql').params.id;


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
        //                console.log(data);

        window.postMessage(data, "*");
        return;
      }

      //            /* Method        */ this._method
      //            /* URL           */ this._url
      //            /* Response body */ this.responseText
      //            /* Request body  */ postData
    });
    return send.apply(this, arguments);
  };
})();

function param(object) {
  var encodedString = "";
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (encodedString.length > 0) {
        encodedString += "&";
      }
      encodedString += encodeURI(prop + "=" + object[prop]);
    }
  }
  return encodedString;
}

getFormData = object =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());

function mergeAdvertisers(advertisers_payload) {
  var keys = Object.keys(advertisers_payload);
  var advertisers = [];
  for (let i = 0; i < keys.length; i++) {
    advertisers = advertisers.concat(advertisers_payload[keys[i]]);
  }

  return advertisers;
}

function getInterestsAdvs(url, type) {
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  //    content-type:
  request.setRequestHeader("content-type", "application/x-www-form-urlencoded");

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var intAdvData = JSON.parse(
        request.responseText.replace("for (;;);", "")
      );
      var data =
        type !== "advertisers"
          ? { data: intAdvData[PAYLOAD][type], type: type + "Data" }
          : {
              data: mergeAdvertisers(intAdvData[PAYLOAD][type]),
              type: type + "Data"
            };
      window.postMessage(data, "*");
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send(param(require("getAsyncParams")("POST")));
}

function getAdActivityList(url, lastAd) {
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  //    content-type:
  request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  //Error:Refused to set unsafe header "referer"
  //request.setRequestHeader('referer', 'https://www.facebook.com/ads/activity');

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var respData = JSON.parse(request.responseText.replace("for (;;);", ""));
      var adClickedData = respData[PAYLOAD][HISTORYCLICKED][HISTORYROW];
      var hasMoreItems = respData[PAYLOAD][HISTORYCLICKED][HASMORE];
      var lastItem = respData[PAYLOAD][HISTORYCLICKED][LASTITEMSERVED];

      console.log("List of Ad Activity...");
      // console.log(adClickedData);
      var data = {
        adClickedData: adClickedData,
        type: "adActivityList",
        hasmore: hasMoreItems,
        lastItem: lastItem
      };
      window.postMessage(data, "*");

      setTimeout(function() {
        var adIds = Object.keys(adClickedData);
        for (adId of adIds) {
          getAdActivityData(ADCONTENTURL.replace("{0}", adId));
        }
        return;
      }, 1000);
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sortsee_more_type=adClicks&last_item_served_hash=
  };

  var lastItemParam =
    lastAd != "-1"
      ? "see_more_type=adClicks&last_item_served_hash=" + lastAd + "&"
      : "";
  request.send(lastItemParam + param(require("getAsyncParams")("POST")));
}

function getAdActivityData(url) {
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  //    content-type:
  request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  //Error:Refused to set unsafe header "referer"
  //request.setRequestHeader('referer', 'https://www.facebook.com/ads/activity');

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var respData = JSON.parse(request.responseText.replace("for (;;);", ""));
      var adContents = respData[PAYLOAD];

      console.log("Ad Activity Data...");
      console.log(adContents);
      var data = { data: adContents, type: "adActivityData" };
      window.postMessage(data, "*");
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send(param(require("getAsyncParams")("POST")));
}

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  //    console.log(event)
  if (event.source != window) return;
  //
  //    if (!event.data.asyncParams)
  //        return;

  if (event.data.asyncParams) {
    data = {
      asyncParamsReady: true,
      paramsPost: require("getAsyncParams")("POST"),
      paramsGet: require("getAsyncParams")("GET"),
      paramsPostSecond: require("getAsyncParams")("POST")
    };
    console.log("Asynch Params required");
    console.log(data);
    window.postMessage(data, "*");
    return true;
  }

  if (event.data.grabInterests) {
    getInterestsAdvs(INTERESTSURL, "interests");
    return true;
  }

  if (event.data.grabAdvertisers) {
    getInterestsAdvs(ADVERTISERSURL, "advertisers");
    return true;
  }

  if (event.data.grabAdActivity) {
    getAdActivityList(ADACTIVITYURL, event.data.lastItem);
    return true;
  }

  if (event.data.grabNewInterface) {
    console.log(event.data)
    processAdOverload(event.data.customId);
    return true;
  }
});
