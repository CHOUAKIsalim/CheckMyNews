//The MIT License
//
//Copyright (c) 2018 Athanasios Andreou, <andreou@eurecom.fr>
//
//Permission is hereby granted, free of charge,
//to any person obtaining a copy of this software and
//associated documentation files (the "Software"), to
//deal in the Software without restriction, including
//without limitation the rights to use, copy, modify,
//merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom
//the Software is furnished to do so,
//subject to the following conditions:
//
//The above copyright notice and this permission notice
//shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
//ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var MSG_TYPE = 'message_type';

$("#notLoggedInView").hide();

// $.get(chrome.extension.getURL("/teste.html"), function(data) {
//   $(data).appendTo("body");
//   // Or if you're using jQuery 1.8+:
//   // $($.parseHTML(data)).appendTo('body');
// });

var FIVE_SECONDS = 5000;
var THIRTY_SECONDS = 6 * FIVE_SECONDS;

var ANONYMIZATION_DATE = 1524175200;

var VIEWS = [
  'home', 
  'view_all_posts',
  "survey_all",
  "contact_us",
  "rewards"
];

// var consent= false;
//if (!localStorage.collectPrefs) {
 // localStorage.collectPrefs = true;
//}

function __(i18n_key) {
  if (chrome) {
    return chrome.i18n.getMessage(i18n_key);
  }
  return browser.i18n.getMessage(i18n_key);
}
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/** Removing CollectPrefs Checkbox
function getCollectPrefs() {
  if (localStorage.collectPrefs == "true") {
   // document.getElementById("collectPrefs").checked = true;
    return;
  }
  document.getElementById("collectPrefs").checked = false;
}
 **/
function askAdBlockerStatus() {
  var data = { getAdBlockerStatus: true };
  chrome.runtime.sendMessage(data);
}

function checkAdBlockerStatus() {
  if (localStorage.statusAdBlocker == "true") {
    $("#warning").show();
  } else {
    $("#warning").hide();
  }
}

function getConsent() {
  chrome.runtime.sendMessage({ getConsent: true }, function(response) {
    console.log("Getting consent");
    console.log(response);
    if (response.consent) {
      $("#consentForm").hide();
      $("#notLoggedInView").hide();

      //            $('#consentButton').remove()
      $("#normalView").show();
      setTimeout(getConsent, FIVE_SECONDS);

      return;
    }

    if (response.notLoggedIn) {
      $("#notLoggedInView").show();
      $("#normalView").hide();
      $("#consentForm").hide();

      setTimeout(getConsent, FIVE_SECONDS);

      return;
      //        $('#consentButton').hide()
    }
    if (response.err) {
      $("#consentForm").hide();

      setTimeout(getConsent, FIVE_SECONDS);

      return;
    }
    if (response.minTimestamp && response.minTimestamp < ANONYMIZATION_DATE) {
      $("#consentData").html(
        'The risk to you, as a participant, is minimal.  We are going to collect your Facebok id, the ads you receive, the explanations that Facebook provides to you, and periodically, your ad preferences page (<a href="https://www.facebook.com/ads/preferences">https://www.facebook.com/ads/preferences</a>). Moreover, we might target you with some ads, and consequently, collect their explanations.'
      );
    }
    $("#notLoggedInView").hide();
    $("#consentForm").show();
    setTimeout(getConsent, FIVE_SECONDS);
  });
  //    if (localStorage.consent=='true') {
  //            $('#consentForm').hide()
  //            $('#consentButton').remove()ß
  //            $('#normalView').show()
  //    }
}

function setHostName() {
  for (var i = 0; i < VIEWS.length; i++) {
    var elem = $("#" + VIEWS[i]);
    if (VIEWS[i] === 'home')
      elem.attr("href", HOST_SERVER);
    else
      elem.attr("href", HOST_SERVER + VIEWS[i]);
  }
}

function sendConsent() {
  chrome.runtime.sendMessage({ consent: true, setConsent: true }, function(
    response
  ) {
    console.log("Send consent here...");
    console.log(response);
    if (response.ok) {
      if (response.consents[0]!==true) {

        return;
      }
      console.log("Consent received");
      $("#notLoggedInView").hide();

      $("#consentForm").hide();
      $("#consentButton").remove();
      $("#normalView").show();
      consent = true;
      return;
    }

    console.log("Consent failed");
    let errorMessage =
      '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>';

    $("#consentForm").append(errorMessage);
  });
  return;
}

var CONSENTPAGE = 'new_consent.html'; //popup page to show once if a user has installed the tool but have not given consent

function openPrivacyPolicy() {
            chrome.tabs.create({'url':chrome.extension.getURL(CONSENTPAGE)});


}




function i18nUpdates() {
  $("#contact_us").html(__("menuContact"));
  $("#view_search_ads").html(__("menuSearch"));
  $("#view_all_ads").html(__("menuAds"));
  $("#view_advertisers").html(__("menuAdvertiser"));
  $("#view_data_about_me").html(__("menuData"));

  $("#warning").html(__("warningAdBlocker"));
  $("#collect_preferences").html(__("collectPreferences"));
  $("#not_logged_yet").html(__("notLoggedYet"));

  $("#consentButton").html(__("consentButton"));
  $("#consentAlert").html(__("consentAlert"));
}
$(document).ready(function() {
  i18nUpdates();
  setHostName();
  var welcomePopup = getParameterByName("welcome");

  if (welcomePopup) {
    $("#consentAlert").show();
    $("#consentInfo").css("height", 550);
  }

  //TODO: ASK IF THE USER HAS CONSENT
  console.log("clicked");
  $("#normalView").hide();
  $("#warning").hide();

  getConsent();
// Removing CollectPrefs Checkbox
// getCollectPrefs();
  $("#consentButton").click(function() {
    console.log("clicked");

    sendConsent();

    //        if (localStorage.consent=='true'){
    //            $('#consentForm').hide()
    //            $('#consentButton').remove()
    //            $('#normalView').show()
    ////            TODO: SHOW THE OTHER FORM
    //        }
  });

  $("#noConsentButton").click(function() {
    window.close()
  });

  $("#remindMeTomorrow").click(function() {
    data = {
        time : (new Date()).getTime() + (24 * 3600 * 1000)
    };
    data[MSG_TYPE] = "remind_me";
    chrome.runtime.sendMessage(data);
    window.close()
  });

  $("#remindMeInTwelve").click(function() {
    data = {
      'time' : (new Date()).getTime() + (12 * 3600 * 1000)
    };
    data[MSG_TYPE] = "remind_me";

    chrome.runtime.sendMessage(data);
    window.close()
  });


  //Removing collect preferences checkbox

//  $("#collectPrefs").click(function() {
//    localStorage.collectPrefs = document.getElementById("collectPrefs").checked;
//  });

  checkAdBlockerStatus();
  askAdBlockerStatus();
  setInterval(checkAdBlockerStatus, 1000);
  document.getElementById("privacyPolicy").addEventListener("click", openPrivacyPolicy);


  // Add Badge

  if(localStorage.getItem('survey_number') > 0 ) {
    let badge = document.createElement('span');
    badge.className = 'badge badge-pill badge-danger';
    badge.innerHTML = localStorage.getItem('survey_number').toString();
    document.getElementById("survey_all").appendChild(badge);
    document.getElementById("survey_red_text").innerHTML = "Hi, you are participating in our social media monitor study, please click on start survey to fill out the survey:<br>Filling each survey will give you an access token you can use to claim a reward on Prolific<br> Thank you !"
  }
  else {
    document.getElementById("formForReminder").style.visibility = "hidden";
    document.getElementById("formForReminder").style.display = "none";
    document.getElementById("survey_red_text").innerHTML = "";
  }
});

// window.fbAsyncInit = function() {
//    FB.init({
//      appId      : '769242713247780',
//      cookie     : true,
//      xfbml      : true,
//      version    : 'v2.8'
//    });
////    FB.AppEvents.logPageView();
//     $(document).trigger('fbload');
//  };
//
////  (function(d, s, id){
////     var js, fjs = d.getElementsByTagName(s)[0];
////     if (d.getElementById(id)) {return;}
////     js = d.createElement(s); js.id = id;
////     js.src = "//connect.facebook.net/en_US/sdk.js";
////     fjs.parentNode.insertBefore(js, fjs);
////   }(document, 'script', 'facebook-jssdk'));
//
////document.addEventListener('DOMContentLoaded', function() {
////    FB.getLoginStatus(function(response) {
////    statusChangeCallback(response);
////    console.log(response)
////});
////
////    function checkLoginState() {
////  FB.getLoginStatus(function(response) {
////    statusChangeCallback(response);
////  });
////
////}
////
////})
//
//
//
//$(document).on(
//    'fbload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
//    function(){
//        //some code that requires the FB object
//        //such as...
//        FB.getLoginStatus(function(res){
//            console.log(res)
//            if( res.status == "connected" ){
//                FB.api('/me', function(fbUser) {
//                    console.log("Open the pod bay doors, " + fbUser.name + ".");
//                });
//            }
//        });
//
//
//            function checkLoginState() {
//  FB.getLoginStatus(function(response) {
//    statusChangeCallback(response);
//  });
//    }
//    }
//);
