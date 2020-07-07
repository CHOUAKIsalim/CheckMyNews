    var consent = false;

	function sendConsent() {
 		 chrome.runtime.sendMessage({ consent: true, setConsent: true }, function(response) {
		    console.log("Send consent here...");
		    console.log(response);
		    if (response.ok) {
    	     	if (response.consents[3]!==true) {
    	     		$("#noConsentButton").hide();
    	     		$("#consentButton").hide();


       		 	return;
      		}
		      console.log("Consent received");
		      $("#consentButton").hide();

		      consent = true;
		      return;
		    }

		    console.log("Consent failed");
		    let errorMessage =
		      '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>';

		    $("#consentInfo").append(errorMessage);
  		});
  		return;
	}

	function getConsent() {
  		chrome.runtime.sendMessage({ getConsent: true ,consentMode:3}, function(response) {
		    console.log("Getting consent");
		    console.log(response);
		    if (response.consent) {
		 		$("#noConsentButton").hide();
		 		$("#consentButton").hide();

		      return;
		    }

    	setTimeout(getConsent, FIVE_SECONDS);
  		});
  	}


	$(document).ready(function() {
	  document.getElementById("consentInfo").addEventListener("click", sendConsent);

	  getConsent();

	});