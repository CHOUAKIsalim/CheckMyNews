

//*****FACEBOOK RELATED URLS********
var INTERESTSURL = "https://www.facebook.com/ads/profile/interests/";
var ADVERTISERSURL = "https://www.facebook.com/ads/profile/advertisers/";
ADVERTISERSURLNEWINTERFACE = "https://www.facebook.com/adpreferences/advertisers";




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


function getDemographicsObject(docId, module) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST",GRAPHQLURL, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function(e) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            window.postMessage({"type":"demographicsNewInterface","response":xmlhttp.responseText,"docId":docId, "module" : module},"*");
            return;
        }
    }

    let params = require("getAsyncParams")("POST");
    params.doc_id = docId;
    xmlhttp.send(param(params));
}





function getDemographicsAndBehaviorsNewInterface(jsResources) {
    let modules = ["AdPreferencesProfileRelationshipStatusRowQuery.graphql", "AdPreferencesSavedFormResponsesPageQuery.graphql", "AdPreferencesAudienceTargetingLandingPageQuery.graphql","AdPreferencesDemographicCategoriesPageQuery"]

    for (let i =0; i<modules.length; i++) {
        let module = modules[i];
        captureErrorOverload(getDocIdFromWaistResources,[jsResources, function (docId) {
            captureErrorOverload(getDemographicsObject,[docId, module]);
        }, module],undefined);
    }
}
