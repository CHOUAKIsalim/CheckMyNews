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
var CURRENT_USER_ID = "";

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
  "survey_all",
  "rewards",
  "study_details",
  "contact_us",
  "general_statistics"
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

function checkAdBlockerStatus() {
  if (localStorage.statusAdBlocker === "true") {
    $("#warning").show();
  } else {
    $("#warning").hide();
  }
  setInterval(checkAdBlockerStatus, 5000);
}

function getConsent() {
  chrome.runtime.sendMessage({ getConsent: true }, function(response) {
    if (response.consent) {
      $("#consentForm").hide();
      $("#notLoggedInView").hide();
      $("#normalView").show();
      setHostName(response.currentUser);
      setBadge(true, response.currentUser);
      return;
    }

    if (response.notLoggedIn) {
      $("#notLoggedInView").show();
      $("#normalView").hide();
      $("#consentForm").hide();
      setTimeout(getConsent, FIVE_SECONDS);
      return;
    }
    if (response.err) {
      $("#consentForm").hide();
      setTimeout(getConsent, FIVE_SECONDS);
      return;
    }
    /**
    if (response.minTimestamp && response.minTimestamp < ANONYMIZATION_DATE) {
      $("#consentData").html(
        'The risk to you, as a participant, is minimal.  We are going to collect your Facebok id, the ads you receive, the explanations that Facebook provides to you, and periodically, your ad preferences page (<a href="https://www.facebook.com/ads/preferences">https://www.facebook.com/ads/preferences</a>). Moreover, we might target you with some ads, and consequently, collect their explanations.'
      );
    }
     **/
    $("#notLoggedInView").hide();
    $("#consentForm").show();
    setTimeout(getConsent, FIVE_SECONDS);
  });
}

function setHostName(currentUserId) {
  for (var i = 0; i < VIEWS.length; i++) {
    var elem = $("#" + VIEWS[i]);
    if (VIEWS[i] === 'home')
      elem.attr("href", HOST_SERVER);
    else
      elem.attr("href", HOST_SERVER + VIEWS[i]+"?user="+currentUserId);
  }
}

function sendConsent() {
  chrome.runtime.sendMessage({ consent: true, setConsent: true }, function(
    response
  ) {

    if (response.ok) {
      if (response.consents[0]!==true) {
        return;
      }
      chrome.tabs.create({url: HOST_SERVER + VIEWS[0] + "?user=" + response.currentUser});
/**
      $("#notLoggedInView").hide();
      $("#consentForm").hide();
      $("#consentButton").remove();
      $("#normalView").show();
      consent = true;
      setHostName(response.currentUser);
      setBadge(true, response.currentUser);
 **/
      return;
    }

    console.log("Consent failed");
    let errorMessage =
      '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>';

    $("#consentForm").append(errorMessage);

  });
  return;
}

var CONSENTPAGE = 'ui/new_consent.html'; //popup page to show once if a user has installed the tool but have not given consent

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
  var welcomePopup = getParameterByName("welcome");
  if (welcomePopup) {
    $("#consentAlert").show();
    $("#consentInfo").css("height", 550);
  }

  $("#normalView").hide();
  $("#warning").hide();

  getConsent();

  $("#consentButton").click(function() {
    sendConsent();

  });

  $("#noConsentButton").click(function() {
    data = {};
    data[MSG_TYPE] = "remind_me_consent";
    chrome.runtime.sendMessage(data);
    chrome.tabs.create({url: "chrome://extensions/"});
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

  checkAdBlockerStatus();

  document.getElementById("privacyPolicy").addEventListener("click", openPrivacyPolicy);

});


function setBadge(open = false, currentUserId) {

  if(localStorage.getItem('survey_number') > 0 ) {
    let badge = document.createElement('span');
    badge.className = 'badge badge-pill badge-danger';
    badge.innerHTML = localStorage.getItem('survey_number').toString();
    document.getElementById("survey_all").appendChild(badge);
    document.getElementById("survey_red_text").innerHTML = "Hi, you are participating in our social media monitor study, please click on start survey to fill out the survey:<br>Thank you !"
/**
    if (open) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].url.indexOf("survey") === -1) {
          window.setTimeout(function () {chrome.tabs.create({url: HOST_SERVER + VIEWS[0] + "?user=" + currentUserId})}, 1000);
        }
      });
    }
 **/
  }
  else {
    document.getElementById("formForReminder").style.visibility = "hidden";
    document.getElementById("formForReminder").style.display = "none";
    document.getElementById("survey_red_text").innerHTML = "";
  }
}

