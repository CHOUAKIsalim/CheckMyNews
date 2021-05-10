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
//
//
//


/**
 * notify the first open Facebook Tab to perform some task
 * @param  {list}   tabs     list of all the browser tabs
 * @param  {Function} callback function to be called towards the first open tab (needs to accept tab.id as parameter)
 * @return {}
 */


if (!localStorage.collectPrefs) {
    localStorage.collectPrefs = true;
}

var PREFERENCES_URL = 'https://www.facebook.com/ds/preferences/' // ad preferences url

//var PREFERENCES_URL_NEW_INTERFACE = 'https://www.facebook.com/adpreferences/ad' // ad preferences url

var PREFERENCES_URL_NEW_INTERFACE = 'https://www.facebook.com/adpreferences/ad_settings' // ad preferences url


var PREFERENCES_URL_WITH_TOKEN_TEMPLATE = "https://www.facebook.com/ds/preferences/?cquick=jsc_c_d&cquick_token={0}&ctarget=https%3A%2F%2Fwww.facebook.com"


function notifyFirstFacebookTab(tabs, callback) {


    if (tabs.length === 0) {
        return
    }

    var tab = tabs[0];

    chrome.tabs.sendMessage(tab.id, {type: "isValidTab"}, function (response) {

        if (response === undefined) {

            notifyFirstFacebookTab(tabs.slice(1, tabs.length), callback)
            return
        }

        if (response.validTabResponse !== 'yes') {
            notifyFirstFacebookTab(tabs.slice(1, tabs.length), callback)
            return
        }


        callback(tab.id);

    });


}


function getUserPreferenceCrawlAttempts(userId, type) {


    initializeUserPreferenceCrawlAttempts(userId, type);

    return JSON.parse(localStorage.preferenceCrawlAttempts)[userId + type];
}


function getLastUserPreferenceCrawlSuccessfullAttempt(userId, type) {


    initializeUserPreferenceCrawlAttempts(userId, type);

    return JSON.parse(localStorage.lastSuccessfulPreferenceCrawl)[userId + type];
}


function setUserPreferenceCrawlAttempt(userId, type) {


    initializeUserPreferenceCrawlAttempts(userId, type);

    const allPreferenceCrawlAttempts = JSON.parse(localStorage.preferenceCrawlAttempts);
    allPreferenceCrawlAttempts[userId + type].push((new Date()).getTime());
    allPreferenceCrawlAttempts[userId + type].sort()
    localStorage.preferenceCrawlAttempts = JSON.stringify(allPreferenceCrawlAttempts);
}


function setLastUserPreferenceCrawlSuccessfullAttempt(userId, type) {


    initializeUserPreferenceCrawlAttempts(userId, type);

    const lastSuccessfulPreferenceCrawl = JSON.parse(localStorage.lastSuccessfulPreferenceCrawl);
    lastSuccessfulPreferenceCrawl[userId + type] = (new Date()).getTime();
    localStorage.lastSuccessfulPreferenceCrawl = JSON.stringify(lastSuccessfulPreferenceCrawl);

}


function canUserPreferenceCrawl(userId, type) {


    const lastSuccessfulAttempt = getLastUserPreferenceCrawlSuccessfullAttempt(userId, type);
    const now = (new Date()).getTime();

    // user has crawled preference the last halfday so no need to crawl more
    if ((Math.abs(now - lastSuccessfulAttempt) < DAY_MILISECONDS / 2)) {
        return false;
    }


    const attemptsTheLastHalfDay = getUserPreferenceCrawlAttempts(userId, type);

    if (attemptsTheLastHalfDay.length === 0) {
        return true;
    }


    // user has not crawled and has  attempted the last halfday three or more times
    if (attemptsTheLastHalfDay.length >= 3) {
        return false;
    }


    // user has not crawled and has  attempted the last halfday less than three times
    // true if last attempt was more than an hour ago
    return Math.abs(now - attemptsTheLastHalfDay[attemptsTheLastHalfDay.length - 1]) >= DAY_MILISECONDS / 24;


}

/**
 * Delete attempts for user with type that were done more that 12h ago
 * @param userId
 * @param type
 */
function filterOldAPreferenceCrawlAttempts(userId, type) {


    const now = (new Date()).getTime();

    var allPreferenceCrawlAttempts = JSON.parse(localStorage.preferenceCrawlAttempts)

    var newAttemptsTypeUser = allPreferenceCrawlAttempts[userId + type].filter(function (time) {
        return Math.abs(now - time) < DAY_MILISECONDS / 2
    });

    allPreferenceCrawlAttempts[userId + type] = newAttemptsTypeUser;


    localStorage.preferenceCrawlAttempts = JSON.stringify(allPreferenceCrawlAttempts);

    return

}

function initializeUserPreferenceCrawlAttempts(userId, type) {


    if (!localStorage.preferenceCrawlAttempts) {

        localStorage.preferenceCrawlAttempts = JSON.stringify({});
    }

    var allPreferenceCrawlAttempts = JSON.parse(localStorage.preferenceCrawlAttempts);

    if (!allPreferenceCrawlAttempts.hasOwnProperty(userId + type)) {
        allPreferenceCrawlAttempts[userId + type] = [];
        localStorage.preferenceCrawlAttempts = JSON.stringify(allPreferenceCrawlAttempts);


    }


    filterOldAPreferenceCrawlAttempts(userId, type)


    if (!localStorage.lastSuccessfulPreferenceCrawl) {

        localStorage.lastSuccessfulPreferenceCrawl = JSON.stringify({});
    }


    var lastSuccessfulPreferenceCrawl = JSON.parse(localStorage.lastSuccessfulPreferenceCrawl);

    if (!lastSuccessfulPreferenceCrawl.hasOwnProperty(userId + type)) {
        lastSuccessfulPreferenceCrawl[userId + type] = 0;
        localStorage.lastSuccessfulPreferenceCrawl = JSON.stringify(lastSuccessfulPreferenceCrawl);

    }

}

function getInterests(tabId) {


    chrome.tabs.query({}, function (tabs) {

        notifyFirstFacebookTab(tabs, function (tabId) {
            chrome.tabs.sendMessage(tabId, {type: "getInterests"});
            setUserPreferenceCrawlAttempt(CURRENT_USER_ID, 'interests');
        })


    })


}

function getAdvertisers(tabId) {


    chrome.tabs.query({}, function (tabs) {

        notifyFirstFacebookTab(tabs, function (tabId) {
            chrome.tabs.sendMessage(tabId, {type: "getAdvertisers"});
            setUserPreferenceCrawlAttempt(CURRENT_USER_ID, 'advertisers');
        })


    })


}


String.prototype.nthIndexOf = function (pattern, n) {


    var i = -1;

    while (n-- && i++ < this.length) {
        i = this.indexOf(pattern, i);
        if (i < 0) break;
    }

    return i;
}

function getScriptWithData(doc, txt) {


    var scripts = doc.getElementsByTagName('script')
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerHTML.indexOf(txt) != -1) {
            return scripts[i];
        }
    }
    return -1
}


function getAllScripstWithData(doc, txt) {
    var scripts = doc.getElementsByTagName('script')
    var all_scripts = [];
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerHTML.indexOf(txt) != -1) {
            all_scripts.push(scripts[i]);
        }
    }
    return all_scripts
}


function parseList(txt, pos = 1) {


    if (pos > txt.length) {
        return -1
    }
    try {
        return JSON.parse(txt.slice(0, pos))
    } catch (e) {
        return parseList(txt, pos + 1)
    }
}


function isPreferencePageBlocked(doc) {


    var helpcenters = ["https://www.facebook.com/help/365194763546571", "https://www.facebook.com/help/177066345680802"]
    var links = doc.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        if (getIndexFromList(links[i].href, helpcenters) !== -1) {
            return true;
        }
    }

    return false;
}

function getDem(doc) {
    var txt = 'demographicStatus":'
    var script = getScriptWithData(doc, txt);
    if (script == -1) {
        return -1
    }
    var pos = script.innerHTML.indexOf(txt);
    return parseList(script.innerHTML.slice(pos + txt.length))

}


function getBeh(doc) {


    var txt_0 = 'behaviors":'
    var txt_1 = 'behaviors":[{"fbid'
    var txt_2 = 'demographicStatus":'
    var script = getScriptWithData(doc, txt_2);
    if (script == -1) {
        return -1
    }
    var pos = script.innerHTML.nthIndexOf(txt_1, 1);
    return parseList(script.innerHTML.slice(pos + txt_0.length))

}


function getDemographicsAndBehaviors(prefUrl, count) {
    $.get(prefUrl, function (resp) {
        try {

            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(resp, "text/html");

            if (count < 0) {
                var data = {user_id: CURRENT_USER_ID, demographics: -1, behaviors: -1};
                data['type'] = 'demBehaviors';
                data['timestamp'] = (new Date).getTime();
                data['raw'] = resp;
                return
            }


            var demographics = getDem(htmlDoc);
            var behaviors = getBeh(htmlDoc);
            if ((demographics == -1) && (behaviors == -1) && (count > 0)) {
                count--;
                if (isPreferencePageBlocked(htmlDoc)) {
                    localStorage.lastErrorBehaviorDemographics = (new Date).getTime();
                    return;
                }
                getDemographicsAndBehaviors(prefUrl, count)
                return
            }

            if ((demographics != -1) || (behaviors != -1)) {
                var data = {user_id: CURRENT_USER_ID, demographics: demographics, behaviors: behaviors};
                data['type'] = 'demBehaviors';
                data['timestamp'] = (new Date).getTime();
                data['raw'] = resp;
                if (hasCurrentUserConsent(0) !== true) {
                    return
                }
                registerDemBehToServer(data);
            }
        } catch (e) {
            console.log(e)
            count--;
            getDemographicsAndBehaviors(prefUrl, count)
            return
        }


    })
}


function registerDemBehToServer(data) {


    $.ajax({
        type: REQUEST_TYPE,
        url: URLS_SERVER.registerDemBeh,
        dataType: "json",
        traditional: true,
        data: JSON.stringify(replaceUserIdEmail(data)),
        tryCount: 0,
        retryLimit: 3,
        success: function (a) {
            if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
            //        captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                }

                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    console.log('Trying again...')

                    $.ajax(this);
                    return;
                }
                console.log('Stoping trying...');

                return true
            }
            ;

            setLastUserPreferenceCrawlSuccessfullAttempt(CURRENT_USER_ID, 'behdem');

            // localStorage.lastBehaviorCrawl = (new Date()).getTime();

//          sendFrontAd(request,sendResponse);
            return true
        },
        error: function (xhr, textStatus, errorThrown) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
            console.log('Stoping trying...');
            return
        }

    });
}


/**
 * checks if it is time (and app allows it) to retrieve the behaviors/profile data of current user
 * @return {}
 */
function checkForBehaviorsDemographics() {

    if (hasCurrentUserConsent(0) !== true) {
//        captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
        window.setTimeout(checkForBehaviorsDemographics, ONEMINUTE);
        return;

    }

    if ((localStorage.collectPrefs !== 'true')) {
        console.log("CollectPrefs set to no");
        window.setTimeout(checkForBehaviorsDemographics, ONEMINUTE);
        return
    }

    if (!canUserPreferenceCrawl(CURRENT_USER_ID, 'behdem')) {
        window.setTimeout(checkForBehaviorsDemographics, ONEMINUTE);
        return
    }


    let interfaceVersion = getUserInterfaceVersion(CURRENT_USER_ID);

    setUserPreferenceCrawlAttempt(CURRENT_USER_ID, 'behdem');


    if (interfaceVersion === INTERFACE_VERSIONS.unknown) {
        window.setTimeout(function () {
            captureErrorBackground(checkForBehaviorsDemographics, [], URLS_SERVER.registerError, undefined)
        }, ONE_HALF_MINUTE)
        return;
    }

    if (interfaceVersion === INTERFACE_VERSIONS.old) {

        captureErrorBackground(getDemographicsAndBehaviors, [PREFERENCES_URL, 3], URLS_SERVER.registerError, undefined);

        window.setTimeout(function () {
            captureErrorBackground(checkForBehaviorsDemographics, [], URLS_SERVER.registerError, undefined)
        }, ONE_HALF_MINUTE)

        return
    }


    if (interfaceVersion === INTERFACE_VERSIONS.new) {

        window.setTimeout(function () {
            captureErrorBackground(checkForBehaviorsDemographics, [], URLS_SERVER.registerError, undefined)
        }, ONE_HALF_MINUTE)

        return
    }


    window.setTimeout(function () {
        captureErrorBackground(checkForBehaviorsDemographics, [], URLS_SERVER.registerError, undefined)
    }, ONE_HALF_MINUTE)


}


/**
 * checks if it is time (and app allows it) to retrieve the interests of current user
 * @return {}
 */
function checkForInterests() {


    if (hasCurrentUserConsent(0) !== true) {
      //  captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
        window.setTimeout(checkForInterests, ONEMINUTE);
        return

    }

    if ((localStorage.collectPrefs !== 'true')) {
        console.log("CollectPrefs set to no");
        window.setTimeout(checkForInterests, ONEMINUTE);

        return
    }


    if (canUserPreferenceCrawl(CURRENT_USER_ID, 'interests')) {
        getInterests();
    }


    window.setTimeout(checkForInterests, ONEMINUTE)

}


/**
 * checks if it is time (and app allows it) to retrieve the advertisers (preference page) of current user
 * @return {}
 */
function checkForAdvertisers() {

    if (hasCurrentUserConsent(0) !== true) {
        window.setTimeout(checkForAdvertisers, ONEMINUTE);
        return;

    }

    if ((localStorage.collectPrefs !== 'true')) {
        console.log("CollectPrefs set to no");

        window.setTimeout(checkForAdvertisers, ONEMINUTE);
        return
    }

    if (canUserPreferenceCrawl(CURRENT_USER_ID, 'advertisers')) {
        getAdvertisers();
    }


    window.setTimeout(checkForAdvertisers, ONEMINUTE)

}
  