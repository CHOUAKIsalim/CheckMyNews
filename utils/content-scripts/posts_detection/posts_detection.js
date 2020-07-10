
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

                let postData = processNewsPostOldInterface(allDomPosts[i]);
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

function processNewsPostOldInterface(frontAd) {

    var html_ad_id = frontAd.id;
    ADSA = frontAd
    let info = getAdvertiserId(frontAd);

    var advertiser_facebook_id = info ? info[0] : "";
    var advertiser_facebook_page = info ? info[1] : "";
    var advertiser_facebook_profile_pic = info ? info[2] : "";

    var raw_ad = frontAd.innerHTML;
    //var raw_ad = frontAd.outerHTML;
    var timestamp = (new Date).getTime();
    var pos = getPos(frontAd);
    var offsetX = pos.x;
    var offsetY = pos.y;
    var type = TYPES.newsPost;
    var [landing_pages, images] = getLandingPagesFrontAds(frontAd.getElementsByTagName(LINK_TAG), frontAd);
    var video = isVideo(frontAd)
    var video_id = ''
    if (video) {
        video_id = getVideoId(frontAd);
        images = getBackgroundUrlImages(frontAd);

    }

    var user_id = getUserId();

    //check position ad visible state of ad at time when ad collected
    try {
        var ad_elem = document.getElementById(html_ad_id);
        var domPos = getElementCoordinate(ad_elem)
        var relPos = toRelativeCoordinate(domPos)
        var isInView = (relPos == undefined) ? false : true;
        var visible_fraction = []
        if (relPos != undefined) {
            var visible_state = getVisibleHeight(ad_elem);
            visible_fraction = (visible_state[2] >= 0) ? (visible_state[0] / visible_state[1]) :
                (-visible_state[0] / visible_state[1]);
        }
    } catch (e) {
        console.log('Error while compute ad position');
        console.log(e);
    }

    // console.log('+++++++++++++')
    // console.log(getDomPosition(ad_elem))
    // console.log(getUserView())
    // console.log(isInView)
    //TODO:GET IMAGE URL
    //    var image_urls = getImageUrls(frontAd.getElementsByTagName('img'));

    //       fb_id =
    //    fb_advertiser_id =

    return { 'raw_ad': raw_ad, 'html_ad_id': html_ad_id, 'visible': isInView, 'visible_fraction': visible_fraction, 'visibleDuration': [], 'timestamp': timestamp, 'offsetX': offsetX, 'offsetY': offsetY, 'type': type, 'landing_pages': landing_pages, 'images': images, 'user_id': user_id, advertiser_facebook_id: advertiser_facebook_id, advertiser_facebook_page: advertiser_facebook_page, advertiser_facebook_profile_pic: advertiser_facebook_profile_pic, video: video, video_id: video_id }


}
