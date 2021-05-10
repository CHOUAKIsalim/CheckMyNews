
/******************************************************************* News organisaton sites ****************************************/

var NEWS_ARTICLES = {};


function sendTabArticle(request){
    if (hasCurrentUserConsent(0) !== true) {
        return true;
    }

    $.ajax({
    type: REQUEST_TYPE,
    url: URLS_SERVER.registerArticle,
    dataType: "json",
    traditional: true,
    data: JSON.stringify(replaceUserIdEmail(request)),
    tryCount: 0,
    retryLimit: 3,
    success: function (a) {
        if (!a[STATUS] || (a[STATUS] == FAILURE)) {
            if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
           //     captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
            }

            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
            console.log('Stoping trying...');
            console.log('failure')
            return true
        };

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
    return true;
}




/**
 * Set tab with ID as active, other tabs inactive - Update time-elapsed for these tab
 * @param {number} activeTabID to be set as active
 *
 */
function setActiveTab(activeTabID){
    let tsNow = (new Date()).getTime();
    //NEWS_ARTICLES[activeTabID].time_elapsed.push({'start':tsNow, 'end':-1})
    for(let key in NEWS_ARTICLES){
        if(NEWS_ARTICLES[key].id !== activeTabID){
            let l = NEWS_ARTICLES[key].time_elapsed.length;
            if (l > 0 && NEWS_ARTICLES[key].time_elapsed[l - 1]['end_ts'] === -1){
                NEWS_ARTICLES[key].time_elapsed[l-1]['end_ts'] = tsNow;
            }

            NEWS_ARTICLES[key].active = false;
        }
    }
}

function addToNewsQueue(tabData){
    if (Object.keys(NEWS_ARTICLES).includes(tabData.id.toString())){
        let key = tabData.id;
        if(NEWS_ARTICLES[key].url !== tabData.url){//Changed url
            let l = NEWS_ARTICLES[key].time_elapsed.length;
            tsNow = (new Date()).getTime();
            if (l > 0 && NEWS_ARTICLES[key].time_elapsed[l-1]['end_ts'] === -1){
                NEWS_ARTICLES[key].time_elapsed[l - 1]['end_ts'] = tsNow;
            }
            NEWS_ARTICLES[key]['end_ts'] = tsNow;
            NEWS_ARTICLES[key]['status'] = 'closed';
            sendTabArticle({...NEWS_ARTICLES[key]});
            delete NEWS_ARTICLES[key];

            NEWS_ARTICLES[key] = tabData;
            if (tabData.active) {
                setActiveTab(tabData.id)
            }
        }
    }
    else{
        NEWS_ARTICLES[tabData.id] = tabData;
        if (tabData.active) {
            setActiveTab(tabData.id)
        }
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo['status'] === 'complete'){
        var _domain = url_domain(tab.url);
        if (isNewsDomain(_domain)){
            let tsNow = (new Date()).getTime();
            var time_elapsed = [];
            if (tab.active) {
                time_elapsed.push({ 'start_ts': tsNow, 'end_ts': -1 });
            }
            let tabData = {
                'id': tabId,
                'start_ts': (new Date()).getTime(),
                'end_ts': -1,
                'url':tab.url,
                'user_id': CURRENT_USER_ID,
                'time_elapsed': time_elapsed,
                'active': tab.active
            };
            addToNewsQueue(tabData);
        }
        else {
            if(Object.keys(NEWS_ARTICLES).includes(tabId.toString())) {
                let l = NEWS_ARTICLES[tabId].time_elapsed.length;
                tsNow = (new Date()).getTime();
                if(l > 0 && NEWS_ARTICLES[tabId].time_elapsed[l-1]['end_ts'] === -1){
                    NEWS_ARTICLES[tabId].time_elapsed[l - 1]['end_ts'] = tsNow;
                }
                NEWS_ARTICLES[tabId]['end_ts'] = tsNow;
                NEWS_ARTICLES[tabId]['status'] = 'closed';

                sendTabArticle({...NEWS_ARTICLES[tabId]})
                delete NEWS_ARTICLES[tabId];
            }
        }
    }
});

chrome.tabs.onActivated.addListener(function (info){
    setActiveTab(info.tabId);
    if(Object.keys(NEWS_ARTICLES).includes(info.tabId.toString())){
        let tsNow = (new Date()).getTime();
        NEWS_ARTICLES[info.tabId].time_elapsed.push({ 'start_ts': tsNow, 'end_ts': -1 });
        NEWS_ARTICLES[info.tabId].active = true;
    }

});


window.setInterval(checkBrowserFocus, 1000);
var changedFocus = false;

function checkBrowserFocus(){

    chrome.windows.getCurrent(function(browser){

        if(browser.focused === false && changedFocus === false) {
            setActiveTab(-1);
            changedFocus =true;
        }
        else if (browser.focused === true && changedFocus === true){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var currTab = tabs[0];
                if (currTab) {
                    setActiveTab(currTab.id);
                    if(Object.keys(NEWS_ARTICLES).includes(currTab.id.toString())){
                        let tsNow = (new Date()).getTime();
                        NEWS_ARTICLES[currTab.id].time_elapsed.push({ 'start_ts': tsNow, 'end_ts': -1 });
                        NEWS_ARTICLES[currTab.id].active = true;
                    }
                    changedFocus = false;
                }
            });
        }

    })

}



chrome.tabs.onRemoved.addListener(function(tabId, changeInfo){
    let tsNow = (new Date()).getTime();
    if(Object.keys(NEWS_ARTICLES).includes(tabId.toString())){
        let l = NEWS_ARTICLES[tabId].time_elapsed.length;
        if(l > 0 && NEWS_ARTICLES[tabId].time_elapsed[l-1]['end_ts'] === -1){
            NEWS_ARTICLES[tabId].time_elapsed[l - 1]['end_ts'] = tsNow;
        }
        NEWS_ARTICLES[tabId]['end_ts'] = tsNow;
        NEWS_ARTICLES[tabId]['status'] = 'closed';

        sendTabArticle({...NEWS_ARTICLES[tabId]})
        delete NEWS_ARTICLES[tabId];
    }
});



/** Get domain form URL
 *
 * @param {string} URL to process
 * @return {string} domain
 */
function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.hostname.replace('www.', '');
}

/**
 * Checking whehter a domain belong to news or not
 */
function isNewsDomain(landing_domain) {
    if (landing_domain === '' || landing_domain === undefined)
        return false;
    for (let i = 0; i < NEWS_DOMAINS.length; i++) {
        if (NEWS_DOMAINS[i] === landing_domain) {
            return true;
        }
    }
    return false;
}

/*****************************************************/
