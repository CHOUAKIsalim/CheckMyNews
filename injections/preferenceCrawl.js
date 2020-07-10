

//*****FACEBOOK RELATED URLS********
var INTERESTSURL = "https://www.facebook.com/ads/profile/interests/";
var ADVERTISERSURL = "https://www.facebook.com/ads/profile/advertisers/";





function mergeInterestAdvertisers(interest_advertisers_payload) {
  var keys = Object.keys(interest_advertisers_payload);
  var interest_advertisers = [];
  for (let i = 0; i < keys.length; i++) {
    interest_advertisers = interest_advertisers.concat(interest_advertisers_payload[keys[i]]);
  }

  return interest_advertisers;
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
              data: mergeInterestAdvertisers(intAdvData[PAYLOAD][type]),
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
