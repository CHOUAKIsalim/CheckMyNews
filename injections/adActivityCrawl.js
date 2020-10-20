
//** FACEBOOK DICTIONARIES KEYS*******
var PAYLOAD = "payload";
var HISTORYCLICKED = "click_history";
var HISTORYROW = "history_rows";
var HASMORE = "has_more_items";
var LASTITEMSERVED = "last_item_served_hash";



var ADACTIVITYURL =
  "business_integrity/purchase_history/purchase_history_row_data/";
var ADCONTENTURL =
  "click_activity/preview_contents/?ad_id={0}&image_height=78&image_width=150";


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
