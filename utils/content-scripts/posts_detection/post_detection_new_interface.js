var LANDING_DOMAIN_NEW_INTERFACE_CLASS = "oi732d6d ik7dh3pa d2edcug0 qv66sw1b c1et5uql a8c37x1j hop8lmos enqfppq2 e9vueds3 j5wam9gi knj5qynh m9osqain ni8dbmo4 stjgntxs ltmttdrg g0qnabr5";
var POST_CLASS_NEW_INTERFACE = "du4w35lb k4urcfbm l9j0dhe7 sjgh65i0";
var POST_COLLECTED = "post_collected";
var COMMENTS_CLASS_NEW_INTERFACE = "l9j0dhe7 ecm0bbzt hv4rvrfc qt6c0cv9 dati1w0a j83agx80 btwxx1t3 lzcic4wl";
var POST_TEXT_CLASS_NEW_INTERFACE = "ecm0bbzt hv4rvrfc ihqw7lf3 dati1w0a";
var LIKES_CLASS_NEW_INTERFACE = "gpro0wi8 cwj9ozl2 bzsjyuwj ja2t1vim";
var TYPE_OF_POST_CLASS_NEW_INTERFACE = "hu5pjgll m6k467ps sp_EMEH57Vy40m sx_6af3a2";
var POST_USER_NAME_NEW_INTERFACE = "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl oo9gr5id gpro0wi8 lrazzd5p";

function removeCommentsFromPostNewInterface(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let comments = element.getElementsByClassName(COMMENTS_CLASS_NEW_INTERFACE);
    while (comments.length > 0 ) {
        let list = comments[0].closest("ul");
        list.parentNode.removeChild(list);
        comments = element.getElementsByClassName(COMMENTS_CLASS_NEW_INTERFACE);
    }
    return element.innerHTML;
}


function removeTextFromPostNewInterface(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(POST_TEXT_CLASS_NEW_INTERFACE);
    for(let i=0; i < texts.length; i++) {
        texts[i].parentNode.removeChild(texts[i]);
    }
    return element.innerHTML;
}

function removeAdvertiserNameNewInterface(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(POST_USER_NAME_NEW_INTERFACE);
    for(let i=0; i < texts.length; i++) {
        texts[i].innerText = texts[i].innerText.hashCode()
    }
    return element.innerHTML;
}


function removeLikesNewInterface(raw_ad) {
    let element = document.createElement( 'div' );
    element.innerHTML = raw_ad;
    let texts = element.getElementsByClassName(LIKES_CLASS_NEW_INTERFACE);
    for(let i=0; i < texts.length; i++) {
        texts[i].innerText = texts[i].innerText.hashCode()
    }
    return element.innerHTML;
}

function isPublicPostNewInterface(raw_ad) {
    let result = false;
    let element = document.createElement('div');
    element.innerHTML = raw_ad;
    let typeLink = element.getElementsByClassName(TYPE_OF_POST_CLASS_NEW_INTERFACE);

    if(typeLink.length > 0 ) {
        typeLink = typeLink[0];
        if(typeLink.getAttribute("aria-label")) {
            if(PUBLIC_LABELS.includes(typeLink.getAttribute("aria-label").toLowerCase())) {
                result = true;
            }
        }
    }
    else{
        let allIcons = element.getElementsByTagName("i");
        for(let i = 0; i < allIcons.length; i++) {
            if(allIcons[i].getAttribute("aria-label")) {
                if(PUBLIC_LABELS.includes(allIcons[i].getAttribute("aria-label").toLowerCase())) {
                      result = true;
                      break;
                }
            }
        }
    }

    if(result === true)  {
        var allIcons = element.getElementsByTagName("i");
        for(let i=0; i<allIcons.length; i++) {
            if(allIcons[i].getAttribute("aria-label")) {
                if(containsNotPublicLabel(allIcons[i].getAttribute("aria-label").toLowerCase())) {
                    result = false;
                }
            }
        }
    }
    return result;
}


/**
 * Check if text contains a string which indicates that the post is not public
 * @param text
 */
function containsNotPublicLabel(text) {
    for(let i=0; i<NON_PUBLIC_LABELS.length; i++) {
        if(text.indexOf(NON_PUBLIC_LABELS[i]) !== -1) {
            return true;
        }
    }
    return false;
}

/**
 * This function anonymises a collected post by removing comments and private text
 * @param raw_ad
 * @param advertiser_facebook_page
 * @constructor
 * @return {string}
 */

function anonymizePostNewInterface(raw_ad, advertiser_facebook_page) {
    raw_ad = removeCommentsFromPostNewInterface(raw_ad);
    raw_ad = removeLikesNewInterface(raw_ad);
    if(!isNewsOrganisationFacebookPage(advertiser_facebook_page) && !isPublicPostNewInterface(raw_ad)){
        raw_ad = removeTextFromPostNewInterface(raw_ad);
        raw_ad = removeAdvertiserNameNewInterface(raw_ad);
        // No need to remove group cuz it's same as advertiser Name
    }
    return raw_ad;

}

/**
 * Grab News Posts from user view
 */
function filterCollectedPosts(posts) {
    var filteredPosts = [];
    for (let i=0;i<posts.length;i++) {
        let post = posts[i];
        if (post.className.indexOf(COLLECTED) !== -1) {
            continue
        }
        if (post.className.indexOf(POST_COLLECTED) !== -1) {
            continue
        }

        if (post.getAttribute('adan')) {
            continue
        }

        filteredPosts.push(post);
    }
    return filteredPosts;

}
/**
 * Grab News Posts from user view
 */
function grabNewsPostsNewInterface() {

    var allDomPosts = document.getElementsByClassName(POST_CLASS_NEW_INTERFACE);

    allDomPosts = filterCollectedPosts(allDomPosts)
    for (let i = 0; i < allDomPosts.length; i++) {

        let postData = processNewsPostNewInterface(allDomPosts[i]);
        if (isEqual(postData, {}) === true) {
            console.log('processNewsPost does not work');
            continue;
        }


        let collected = false;
        postData[MSG_TYPE] = FRONTADINFO;

        if (postData["landing_domain"]) {
            allDomPosts[i].className += " " + POST_COLLECTED;
            postData['landing_pages'].push(postData["landing_domain"]);
            collected = true;
            collectPostNewInterface(postData);
            break;
        }
        else {
            for (let j = 0; j < postData['landing_pages'].length; j++) {
                landing_domain = url_domain(postData['landing_pages'][j]);
                shortcut_domain = getShortcutNewsDomain(landing_domain);
                if (landing_domain === '' || landing_domain === undefined)
                    continue;
                if (isNewsDomain(landing_domain) || shortcut_domain !== '') {
                    allDomPosts[i].className += " " + POST_COLLECTED;
                    if (shortcut_domain !== '')
                        postData['landing_pages'].push(shortcut_domain);
                    else
                        postData['landing_pages'].push(landing_domain);
                    collectPostNewInterface(postData);
                    collected = true;
                    break;
                }
            }
        }
        if(collected === false) {
            if(isPublicPostNewInterface(postData['raw_ad'])) {
                postData["type"] = TYPES.publicPost;
                allDomPosts[i].className += " " + POST_COLLECTED;
                collectPostNewInterface(postData);
            }
        }
    }
}


function collectPostNewInterface(postData) {
    addEventListeners(postData);
    MouseTrack(postData);
    captureErrorContentScript(notifyOverloadForMoreAdInfo,  [postData], undefined);
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



function getDisplayedDomains(html) {

    let domains = getNewsDomainsArray();
    if(domains === undefined){
        throw "NEWS_DOMAINS AND SHORT_NEWS_DOMAINS ARE UNDEFINED";
    }

    for(let i=0; i<domains.length; i++) {
        if(html.includes(domains[i].toLowerCase()) && !FACEBOOK_DOMAINS.includes(domains[i])) {
            return domains[i];
        }
    }
    return ''
}


function processNewsPostNewInterface(frontAd) {
    var html_ad_id = undefined;
    if(frontAd.id) {
        html_ad_id = frontAd.id;
    }
    else {
        html_ad_id = markAd(frontAd);
    }

    var user_id = getUserId();

    var raw_ad = frontAd.innerHTML;


    var timestamp = (new Date).getTime();
    var pos = getPos(frontAd);
    var offsetX = pos.x;
    var offsetY = pos.y;
    var type = TYPES.newsPost;

    var [landing_pages, images] = getLandingPagesFrontAds(frontAd.getElementsByTagName(LINK_TAG), frontAd);
    landing_pages = landing_pages.unique();
    var landing_domain = getDisplayedDomains(frontAd.outerHTML.toLowerCase());

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
    return { 'raw_ad': raw_ad, 'adanalyst_ad_id':html_ad_id , 'html_ad_id': html_ad_id, 'visible': isInView, 'visible_fraction': visible_fraction, 'visibleDuration': [], 'timestamp': timestamp, 'offsetX': offsetX, 'offsetY': offsetY, 'type': type, 'landing_pages': landing_pages, 'landing_domain': landing_domain,'images': images, 'user_id': user_id}


}
