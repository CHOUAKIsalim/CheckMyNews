
var COLLECTED_NEWS_DOMAINS = [];
var FB_LINKS = ['www.facebook.com', 'fbcdn.net'] // used to remove URLs that are not landingURL
var SWAPINGFUNCTION = /"[\s\S]*"/; // related to getting landing urls
var LINKSHIMASYNCLINK = 'LinkshimAsyncLink';
var ONMOUSEOVER = 'onmouseover'; // attributes whose values store actual links for landing pagesm, for some links and not facebook's ones for parsing landing pages in frontads
var ONMOUSEDOWN= 'onmousedown'; // attributes whose values storeactual landing pages of links, for some links for sideads
var LINK_TAG = 'a';

var IMG_CLASS_NEW_INTERFACE_CLASS = "i09qtzwb n7fi1qx3 datstx6m pmk7jnqg j9ispegn kr520xx4 k4urcfbm bixrwtb6";


/**
 * processes post object adding in the object
 * all the data/meta data that we save in the server (except of explanation of the ad)
 *
 * @param  {objectet } post DOM element of the front ad
 * @return {object}         object to be send to the server
 */
function processNewsPost(frontAd) {

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

    var user_id = getUsertiId();

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


/**
 * return landing pages and images from the front ads.
 * Currently landing pages are not updated, so we collect only a subset.
 *
 * @param  {array} links    array of link DOM elements that are included in the front ad
 * @param  {object} frontAd DOM element of the front ad
 * @return {array}          array (essentially tuple) that contains the landing page urls and the image urls
 */
function getLandingPagesFrontAds(links, frontAd) {
    var landingPages = getURLsFromString(frontAd.outerHTML);
    //console.log(landingPages)
    var images = []
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let onmouseover = link.getAttribute(ONMOUSEOVER);
        if (!onmouseover) {
            continue
        }

        let imgs = link.getElementsByTagName('img');
        if (imgs.length > 0) {
            for (let j = 0; j < imgs.length; j++) {
                if (imgs[j].src) {
                    images.push(imgs[j].src)
                    continue
                }
                console.log(imgs[j])
            }
        }
        if ((onmouseover.indexOf(LINKSHIMASYNCLINK) === -1)) {
            continue
        }


        let urls = onmouseover.match(SWAPINGFUNCTION);
        if (!urls) {
            continue
        }


        landingPages.extend(urls);

    }


    var additionalImages = frontAd.getElementsByClassName('scaledImageFitWidth');
    //    console.log(additionalImages)
    for (let i = 0; i < additionalImages.length; i++) {
        images.push(additionalImages[i].src);

    }

    var additionalImages = frontAd.getElementsByClassName('scaledImageFitHeight');
    //    console.log(additionalImages)
    for (let i = 0; i < additionalImages.length; i++) {
        images.push(additionalImages[i].src);

    }


    var additionalImages = frontAd.getElementsByClassName('_kvn img');
    //    console.log(additionalImages)
    for (let i = 0; i < additionalImages.length; i++) {
        images.push(additionalImages[i].src);

    }

    var additionalImages = frontAd.getElementsByClassName(IMG_CLASS_NEW_INTERFACE_CLASS);
    //    console.log(additionalImages)
    for (let i = 0; i < additionalImages.length; i++) {
        images.push(additionalImages[i].src);

    }

    //percent-decoding landing URLs
    for (let ix = 0; ix < landingPages.length; ix++) {
        if (landingPages[ix].indexOf('l.php?u=https%3A') != -1 || landingPages[ix].indexOf('l.php?u=http%3A') != -1) {
            let begIdx = nthIndex(landingPages[ix], 'http', 2);
            if (begIdx !== -1) {
                landingPages[ix] = percentDecodeURL(landingPages[ix].substring(begIdx))
            }
        }
    }

    return [landingPages.unique(), images.unique()];
}


/**
 * Extract landing URLs from html string
 * @param {string} html_string string is used to extract URLs
 * @return {array} array of extracted URLs
 */
function getURLsFromString(html) {
    let regex = /(https?:\/\/[^ ]*)/gm;
    let URLs = [];
    while ((m = regex.exec(html)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            match = match.replace(`"`, ``).replace(`'`, ``);
            if (!isFacebookURL(match)) {
                URLs.push(match);
            }
        });
    }
    return URLs.unique();
}

function isFacebookURL(url) {
    for (let i = 0; i < FB_LINKS.length; i++) {
        if (url.indexOf(FB_LINKS[i]) !== -1) {
            return true;
        }
    }
    return false;
}

/**Perform percent decoding URL
 * @param {string} url to decode
 * @return {string} decode_url
 */
function percentDecodeURL(url) {
    let C = ['!', '#', '$', '&', `'`, '(', ')', '*', '+', ',', '/', ':', ';', '=', '?', '@', '[', ']'];
    let R = ['%21', '%23', '%24', '%26', '%27', '%28', '%29', '%2A', '%2B', '%2C', '%2F', '%3A', '%3B', '%3D', '%3F', '%40', '%5B', '%5D'];
    for (let i = 0; i < R.length; i++) {
        url = url.replaceAll(R[i], C[i])
    }
    return url
}

/** Get n-th indexOf sub-string
 *
 * @param {string} str string to process
 * @param {string} pat sub-string searching for
 * @param {number} n n-th occurence of pat
 * @return {number} the nth index of pat | -1 if not found
 */
function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

/**
 * Check whether a given domain is a shortcut of news domain
 */
function getShortcutNewsDomain(landing_domain) {
    if (landing_domain === '' || landing_domain === undefined) {
        return '';
    }
    if (Object.keys(DOMAIN_SHORTCUT).includes(landing_domain)) {
        return DOMAIN_SHORTCUT[landing_domain]
    }
    return '';
}



/**
 * Get facebook page's name from url
 * @param {string} fbpage_url  
 * @return {string} facebook page name
 */
function getFbPageName(fbpage_url) {
    if (fbpage_url === '' || fbpage_url === undefined)
        return undefined

    let l = fbpage_url.length;
    if (fbpage_url[l - 1] == '/')
        fbpage_url = fbpage_url.substring(0, l - 1)

    let k = fbpage_url.lastIndexOf('/');

    if (k == -1)
        return undefined

    let name = fbpage_url.substring(k + 1).toLocaleLowerCase();
    if (name == 'www.facebook.com')
        return undefined

    return name
}

/**
 * Extract landing domain from post
 * @param {object} postObj post object collected from news feed
 * @return {string} landing domain
 */
function getLandingDomain(postObj) {
    let facebookInterfaceVersion = getFacebookInterfaceVersionFromParsedDoc(document);
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.old) {
        return  getLandingDomainOldInterface(postObj)
    } else if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
        getLandingDomainNewIterface(postObj)
    }

}

function grabNewsPosts() {
    let facebookInterfaceVersion = getFacebookInterfaceVersionFromParsedDoc(document);
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.old) {
        console.log('Grabbing news posts - old Fb interface')
        captureErrorContentScript(grabNewsPostsOldInterface,[],{});
    } else if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
        console.log('Grabbing news posts - new Fb interface')
        captureErrorContentScript(grabNewsPostsNewInterface,[],{});
    }
    setTimeout(grabNewsPosts, INTERVAL);
}


function grabPosts() {
    let facebookInterfaceVersion = getFacebookInterfaceVersionFromParsedDoc(document);
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.old) {
        captureErrorContentScript(grabPostsOldInterface,[],{});
    } else if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
        captureErrorContentScript(grabPostsNewInterface,[],{});
    }
    setTimeout(grabPosts, INTERVAL);
}


