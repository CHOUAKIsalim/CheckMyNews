
var LANDING_DOMAIN_CLASS = '_6lz _6mb _1t62 ellipsis';
var HTML_POST_ID ="hyperfeed_story_id";
var POST_TEXT_CLASS_OLD_INTERFACE = "_5pbx userContent _3576";
var POST_COMMENTS_CLASS = "_7791";
var TYPE_OF_POST_CLASS = "uiStreamPrivacy inlineBlock fbStreamPrivacy fbPrivacyAudienceIndicator _5pcq";
var POST_USER_NAME = "fwb fcg";
var GROUP_NAME ="_wpv";
var LIKES_CLASS = "_81hb";

/**
 * Grab News Posts from user view
 */
function grabNewsPostsOldInterface() {

 var allAdsId = Object.keys(FRONTADQUEUE).map(key => FRONTADQUEUE[key]['html_ad_id']);
    var allDomPosts = $('div[id*="' + HTML_POST_ID + '"]');
    for (let i = 0; i < allDomPosts.length; i++) {
        if (!allAdsId.includes(allDomPosts[i].id)) {
            if (allDomPosts[i].className.indexOf(POST_COLLECTED) !== -1) {
                continue;
            }

            let postData = processNewsPostOldInterface(allDomPosts[i]);
            if (isEqual(postData, {}) == true || postData['landing_pages'].length == 0) {
                console.log('processNewsPost does not work')
                continue; }

            let collected = false;
            postData[MSG_TYPE] = FRONTADINFO;
            //Extract landing domain from post HTML
            let _news_domain = getLandingDomain(allDomPosts[i]);
            if (isNewsDomain(_news_domain)) {
                allDomPosts[i].className += " " + POST_COLLECTED;
                // console.log(allDomPosts[i].textContent)
                // console.log(postData);
                console.log('News post collected')
                postData['landing_pages'].push(_news_domain)
                collected = true;
                collectPost(allDomPosts[i], postData);
            }
            else {
                //Check if this post have landing URL link to a news website or not
                for (let j = 0; j < postData['landing_pages'].length; j++) {
                    landing_domain = url_domain(postData['landing_pages'][j]);
                    shortcut_domain = getShortcutNewsDomain(landing_domain);
                    if (landing_domain == '' || landing_domain === undefined)
                        continue;
                    if (isNewsDomain(landing_domain) || shortcut_domain !== '') {
                        allDomPosts[i].className += " " + POST_COLLECTED;
                        console.log('News post collected')
                        if (shortcut_domain !== '')
                            postData['landing_pages'].push(shortcut_domain);
                        else
                            postData['landing_pages'].push(landing_domain);
                        collectPost(allDomPosts[i], postData);
                        collected = true;
                        break;
                    }
                }
            }
            if(collected === false) {
                if(isPublicPost(postData['raw_ad'])) {
                    postData["type"] = TYPES.publicPost;
                    collectPost(allDomPosts[i], postData);
                }
            }

        }
    }
}

function collectPost(domPost, postData) {
    addEventListeners(postData);
    MouseTrack(postData);
    captureErrorContentScript(getExplanationUrlFrontAds, [domPost, postData], undefined);
}

function removeCommentsFromPost(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let comments = element.getElementsByClassName(POST_COMMENTS_CLASS);
    for(let i=0; i < comments.length; i++) {
        comments[i].parentNode.removeChild(comments[i]);
    }
    return element.innerHTML;
}

function removeTextFromPost(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(POST_TEXT_CLASS_OLD_INTERFACE);
    for(let i=0; i < texts.length; i++) {
        texts[i].parentNode.removeChild(texts[i]);
    }
    return element.innerHTML;
}

function removeAdvertiserName(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(POST_USER_NAME);
    for(let i=0; i < texts.length; i++) {
        texts[i].innerText = texts[i].innerText.hashCode()
    }
    return element.innerHTML;
}

function removeGroupName(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(GROUP_NAME);
    for(let i=0; i < texts.length; i++) {
        texts[i].innerText = texts[i].innerText.hashCode()
    }
    return element.innerHTML;
}

function removeLikes(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(LIKES_CLASS);
    for(let i=0; i < texts.length; i++) {
        texts[i].innerText = texts[i].innerText.hashCode()
    }
    return element.innerHTML;
}


function isPublicPost(raw_ad) {
    let element = document.createElement('div');
    element.innerHTML = raw_ad;
    let typeLink = element.getElementsByClassName(TYPE_OF_POST_CLASS);

    if(typeLink.length > 0 ) {
        typeLink = typeLink[0];
        if(typeLink.getAttribute("aria-label")) {
            if(PUBLIC_LABELS.includes(typeLink.getAttribute("aria-label").toLowerCase())) {
                return true;
            }
        }
    }

    return false
}


/**
 * This function    anonymises a collected post by removing comments and private text
 * @param raw_ad
 * @param advertiser_facebook_page
 * @constructor
 * @return {string}
 */

function anonymizePostOldInterface(raw_ad, advertiser_facebook_page) {
    raw_ad = removeCommentsFromPost(raw_ad);
    raw_ad = removeLikes(raw_ad);
    if(!isNewsOrganisationFacebookPage(advertiser_facebook_page) && !isPublicPost(raw_ad)){
        raw_ad = removeTextFromPost(raw_ad);
        raw_ad = removeAdvertiserName(raw_ad);
        raw_ad = removeGroupName(raw_ad);
    }
    return raw_ad;
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

    raw_ad = anonymizePostOldInterface(raw_ad, advertiser_facebook_id);

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
