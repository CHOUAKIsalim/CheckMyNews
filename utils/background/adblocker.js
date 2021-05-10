


function setAdBlockerTimeChecked(userId, value){


    initializeAdBlockerTimeChecked(userId);

    let allTimes = JSON.parse(localStorage.lastAdBlockCheckTime);

    allTimes[userId] = value;


    localStorage.lastAdBlockCheckTime = JSON.stringify(allTimes);

}


function initializeAdBlockerTimeChecked(userId){

    if (!localStorage.lastAdBlockCheckTime) {
        localStorage.lastAdBlockCheckTime = JSON.stringify({});
    }

    let allTimes = JSON.parse(localStorage.lastAdBlockCheckTime);

    if (!allTimes.hasOwnProperty(userId)) {
        allTimes[userId] = 0;
        localStorage.lastAdBlockCheckTime = JSON.stringify(allTimes);
    }

}
function checkForAdBlocker() {


    initializeAdBlockerTimeChecked(CURRENT_USER_ID)

    let last_time_user = JSON.parse(localStorage.lastAdBlockCheckTime)[CURRENT_USER_ID]

    let current_time = (new Date()).getTime()

    if (current_time - last_time_user < TWO_HOURS ) {
        window.setTimeout(function() {
            captureErrorBackground(checkForAdBlocker,[],URLS_SERVER.registerError,undefined);
        },ONEMINUTE * 10);
        return
    }

    sendAdBlockerRequestToContentScript()

    if (!localStorage.lastAdBlockCheckTime) {
        window.setTimeout(
            function() {
                captureErrorBackground(checkForAdBlocker,[],URLS_SERVER.registerError,undefined);
            },ONEMINUTE);
    }
    else {
        window.setTimeout(
            function() {
                captureErrorBackground(checkForAdBlocker,[],URLS_SERVER.registerError,undefined);
            },ONEMINUTE * 10);
    }
    return
}

function sendAdBlockerRequestToContentScript() {

    chrome.tabs.query({}, function(tabs){
        processTabsForAdBlocker(tabs)
    });


}


function processTabsForAdBlocker(tabs) {
    if (tabs.length===0) {
        return
    }

    var tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {type:"isValidTab"},function(response) {

        if (response===undefined) {
            processTabsForAdBlocker(tabs.slice(1,tabs.length))
            return
        }

        if (response.validTabResponse!=='yes') {
            processTabsForAdBlocker(tabs.slice(1,tabs.length))
            return
        }

        chrome.tabs.sendMessage(tab.id, {type: "getAdBlockerStatus"}, function (response) {});

    });



}
