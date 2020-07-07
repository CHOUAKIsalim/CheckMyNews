var LANDING_DOMAIN_NEW_INTERFACE_CLASS = "oi732d6d ik7dh3pa d2edcug0 qv66sw1b c1et5uql a8c37x1j hop8lmos enqfppq2 e9vueds3 j5wam9gi knj5qynh m9osqain ni8dbmo4 stjgntxs ltmttdrg g0qnabr5";


/**
 * Grab News Posts from user view
 */
function grabNewsPostsNewInterface() {

    if (window.location.href.indexOf('ads/preferences') == -1) {

        var allAdsId = Object.keys(FRONTADQUEUE).map(key => FRONTADQUEUE[key]['html_ad_id']);

        var allDomPosts = $('div[class*="' + POSTS_CLASS + '"]');
        var allDomPosts = document.querySelectorAll('div.j83agx80.l9j0dhe7.k4urcfbm');
        for (let i = 0; i < allDomPosts.length; i++) {
            if (!allAdsId.includes(allDomPosts[i].id)) {

                let elmPosition = toRelativeCoordinate(getElementCoordinate(allDomPosts[i]));
                if (elmPosition === undefined || allDomPosts[i].className.indexOf(COLLECTED) != -1) {
                    continue;
                }

                let postData = processNewsPost(allDomPosts[i]);
                if (isEqual(postData, {}) == true || postData['landing_pages'].length == 0) {
                    console.log('processNewsPost does not work')
                    continue; }

                // console.log('===================Post=================');
                console.log(allDomPosts[i].textContent)
                console.log(postData);

                //      if (postData['visible']) {
                postData[MSG_TYPE] = FRONTADINFO;
                //Extract landing domain from post HTML
                let _news_domain = getLandingDomain(allDomPosts[i]);
                if (isNewsDomain(_news_domain)) {
                    COLLECTED_NEWS_DOMAINS.push(_news_domain)
                    //Store collected domains of news post in order to test
                    allDomPosts[i].className += " " + COLLECTED;
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
                            allDomPosts[i].className += " " + COLLECTED;
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
                    //   }
                }

            }
        }

    }
}


/**
 * Extract landing domain from post
 * @param {object} postObj post object collected from news feed
 * @return {string} landing domain
 */
function getLandingDomainNewIterface(postObj) {
    let tags = postObj.getElementsByClassName(LANDING_DOMAIN_NEW_INTERFACE_CLASS);
    if (tags.length == 0 || tags === undefined) { return ''; }

    return tags[0].innerText.toLocaleLowerCase();
}

