
var LANDING_DOMAIN_CLASS = '_6lz _6mb _1t62 ellipsis';
var HTML_POST_ID ="hyperfeed_story_id";

/**
 * Checking whehter a domain belong to news or not
 */
function isNewsDomain(landing_domain) {
    if (landing_domain === '' || landing_domain === undefined)
        return false;
    for (let i = 0; i < NEWS_DOMAINS.length; i++) {
        //if (NEWS_DOMAINS[i].indexOf(landing_domain) != -1) {
        if (NEWS_DOMAINS[i] === landing_domain) {
            console.log(NEWS_DOMAINS[i] + " " + landing_domain);
            return true;
        }
    }
    return false;
}

/**
 * Grab News Posts from user view
 */
function grabNewsPostsOldInterface() {

    if (window.location.href.indexOf('ads/preferences') == -1) {

        var allAdsId = Object.keys(FRONTADQUEUE).map(key => FRONTADQUEUE[key]['html_ad_id']);

        var allDomPosts = $('div[id*="' + HTML_POST_ID + '"]');
        for (let i = 0; i < allDomPosts.length; i++) {
            if (!allAdsId.includes(allDomPosts[i].id)) {
                let elmPosition = toRelativeCoordinate(getElementCoordinate(allDomPosts[i]));
                if (elmPosition === undefined || allDomPosts[i].className.indexOf(POST_COLLECTED) != -1) {
                    continue;
                }

                let postData = processNewsPost(allDomPosts[i]);
                if (isEqual(postData, {}) == true || postData['landing_pages'].length == 0) {
                    console.log('processNewsPost does not work')
                    continue; }

                // console.log('===================Post=================');
                console.log(allDomPosts[i].textContent)
                console.log(postData);

                //if (postData['visible']) {
                    postData[MSG_TYPE] = FRONTADINFO;
                    //Extract landing domain from post HTML
                    let _news_domain = getLandingDomain(allDomPosts[i]);
                    alert(_news_domain);
                    if (isNewsDomain(_news_domain)) {
                        COLLECTED_NEWS_DOMAINS.push(_news_domain)
                        //Store collected domains of news post in order to test
                        allDomPosts[i].className += " " + POST_COLLECTED;
                        // console.log(allDomPosts[i].textContent)
                        // console.log(postData);
                        console.log('News post collected')
                        postData['landing_pages'].push(_news_domain)
                        captureErrorContentScript(getExplanationUrlFrontAds, [allDomPosts[i], postData], undefined);

                    }
                    else {
                        //Check if this post have landing URL link to a news website or not
                        for (let j = 0; j < postData['landing_pages'].length; j++) {
                            landing_domain = url_domain(postData['landing_pages'][j]);
                            shortcut_domain = getShortcutNewsDomain(landing_domain);
                            if (landing_domain == '' || landing_domain === undefined)
                                continue;
                            if (isNewsDomain(landing_domain) || shortcut_domain !== '') {
                                //Store collected domains of news post in order to test
                                COLLECTED_NEWS_DOMAINS.push(landing_domain)
                                allDomPosts[i].className += " " + POST_COLLECTED;
                                // console.log(allDomPosts[i].textContent)
                                // console.log(postData);
                                console.log('News post collected')
                                if (shortcut_domain !== '')
                                    postData['landing_pages'].push(shortcut_domain);
                                else
                                    postData['landing_pages'].push(landing_domain);
                                captureErrorContentScript(getExplanationUrlFrontAds, [allDomPosts[i], postData], undefined);
                                break;
                            }
                        }
                    }
                //}

            }
        }

    }
}


/**
 * Extract landing domain from post
 * @param {object} postObj post object collected from news feed
 * @return {string} landing domain
 */
function getLandingDomainOldInterface(postObj) {
    let tags = postObj.getElementsByClassName(LANDING_DOMAIN_CLASS);
    if (tags.length == 0 || tags === undefined) { return ''; }

    return tags[0].innerText.toLocaleLowerCase();
}

