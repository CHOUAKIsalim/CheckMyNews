

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


var consoleHolder = console;
function debug(bool){
    if(!bool){
        consoleHolder = console;
        console = {};
        Object.keys(consoleHolder).forEach(function(key){
            console[key] = function(){};
        })
    }else{
        console = consoleHolder;
    }
}


function handleUniversalCommunication(event) {

	if (event.data.asyncParams) {
	    data = {
	      asyncParamsReady: true,
	      paramsPost: require("getAsyncParams")("POST"),
	      paramsGet: require("getAsyncParams")("GET"),
	      paramsPostSecond: require("getAsyncParams")("POST")
	    };
	    window.postMessage(data, "*");
    	return true;
  	}


  	if (event.data.grabInterests) {
        captureErrorOverload(getInterestsAdvs, [INTERESTSURL, "interests"], undefined);
    	return true;
  	}

  	if (event.data.grabAdvertisers) {
        captureErrorOverload(getInterestsAdvs, [ADVERTISERSURL, "advertisers"], undefined);
  	    return true;
  	}


  	if (event.data.grabAdActivity) {
        captureErrorOverload(getAdActivityList, [ADACTIVITYURL, event.data.lastItem], undefined);
    	return true;
  	}

  	if (event.data.getAdBlockerStatus) {
        captureErrorOverload(getAdBlockerStatus, [], undefined);
        return true;
    }


    if (event.data.type && event.data.type === 'getExplanation') {
        captureErrorOverload(getExplanationsManually, [event.data.userId, event.data.adId, event.data.explanationUrl, event.data.dbRecordId, event.data.timestamp, event.data.graphQLAsyncParams, event.data.clientToken, event.data.docId, event.data.getNewDocId, event.data.newInterface, event.data.adType, event.data.objId,event.data.serialized_frtp_identifiers,event.data.story_debug_info, event.data.getDemographics], undefined);

    }


}




