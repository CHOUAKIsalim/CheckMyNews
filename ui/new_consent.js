    var consent = false;
	//HOST_SERVER = 'https://smm.mpi-sws.org/';
	HOST_SERVER = 'https://adanalystplus.imag.fr/';
	function sendConsent() {
		 console.log("sending consent");
 		 chrome.runtime.sendMessage({ consent: true, setConsent: true }, function(response) {
 		 	console.log("this is the response");
 		 	console.log(response);
		    if (response.ok) {
    	     	if (response.consents[3]!==true) {
    	     		$("#noConsentButton").hide();
    	     		$("#consentButton").hide();
					return;
      		}
		      $("#consentButton").hide();
			  window.location.href = HOST_SERVER + 'survey_all?user=' + response.currentUser;
		      consent = true;
		      return;
		    }

		    console.log("Consent failed");
		    let errorMessage =
		      '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" or="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>';
		    $("#consentInfo").append(errorMessage);
  		});
  		return;
	}

	function getConsent() {
  		chrome.runtime.sendMessage({ getConsent: true ,consentMode:3}, function(response) {
		    if (response && response.consent) {
		 		$("#noConsentButton").hide();
		 		$("#consentButton").hide();
		      return;
		    }
    	setTimeout(getConsent, 5000);
  		});
  	}


	$(document).ready(function() {
	  document.getElementById("consentInfo").addEventListener("click", sendConsent);

	  getConsent();

	});