var PAYLOAD = "payload";

function mergeAdvertisers(advertisers_payload) {
  var keys = Object.keys(advertisers_payload);
  var advertisers = [];
  for (let i = 0; i < keys.length; i++) {
    advertisers = advertisers.concat(advertisers_payload[keys[i]]);
  }

  return advertisers;
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

  // Implement "ajaxSuccess" functionality
  XHR.send = function(postData) {
    this.addEventListener("load", function() {
      if (
          this._url.indexOf &&
          this._url.indexOf("ads/profile/interests/") > -1
      ) {
        var interest_data = JSON.parse(
            this.responseText.replace("for (;;);", "")
        );
        debugLog("interest_data");
        if (PAYLOAD in interest_data) {
          var data = {
            data: interest_data[PAYLOAD]["interests"],
            type: "interestsData"
          };
          window.postMessage(data, "*");
        }
      }

      if (
          this._url.indexOf &&
          this._url.indexOf("ads/profile/advertisers/") > -1
      ) {
        var advertisers_data = JSON.parse(
            this.responseText.replace("for (;;);", "")
        );
        debugLog("advertisers_data");
        if (PAYLOAD in advertisers_data) {
          var data = {
            data: mergeAdvertisers(advertisers_data[PAYLOAD]["advertisers"]),
            type: "advertisersData"
          };
          window.postMessage(data, "*");
        }
      }

      //            /* Method        */ this._method
      //            /* URL           */ this._url
      //            /* Response body */ this.responseText
      //            /* Request body  */ postData
    });
    return send.apply(this, arguments);
  };
})();




window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  //    console.log(event)
  if (event.source != window) return;

  handleUniversalCommunication(event);

});
