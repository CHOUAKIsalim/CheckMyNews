
var FB_LINKS = ['www.facebook.com', 'fbcdn.net'] // used to remove URLs that are not landingURL
var SWAPINGFUNCTION = /"[\s\S]*"/; // related to getting landing urls
var LINKSHIMASYNCLINK = 'LinkshimAsyncLink';
var ONMOUSEOVER = 'onmouseover'; // attributes whose values store actual links for landing pagesm, for some links and not facebook's ones for parsing landing pages in frontads
var ONMOUSEDOWN= 'onmousedown'; // attributes whose values storeactual landing pages of links, for some links for sideads
var LINK_TAG = 'a';

var IMG_CLASS_NEW_INTERFACE_CLASS = "i09qtzwb n7fi1qx3 datstx6m pmk7jnqg j9ispegn kr520xx4 k4urcfbm bixrwtb6";

var PUBLIC_LABELS = ['public', 'shared with public', 'partagé avec public', 'partagé avec público', 'mit öffentlich geteilt', 'это видят: доступно всем', 'compartilhado com público', 'conteúdo partilhado com: público', 'podijeljeno s publikom javno', 'contenuto condiviso con: tutti', 'distribuit pentru: public', 'プライバシー設定: 公開', 'grono odbiorców: publiczne']; //English, French, Spanish, Deutsch, Russian, Portuguese(Brazil), Croatian, Italian, Romanian, Japannese, Polski

var NON_PUBLIC_LABELS = ['members of', 'friends', 'custom', 'membres de', 'amis de', 'personnalisé']; //English, French



/**
 * processes post object adding in the object
 * all the data/meta data that we save in the server (except of explanation of the ad)
 *
 * @param  {objectet } post DOM element of the front ad
 * @return {object}         object to be send to the server
 */


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

    landingPages = cleanLandingPages(landingPages);
    return [landingPages.unique(), images.unique()];
}

function cleanLandingPages(landingPages) {
    var res = [];
    for(let i=0; i<landingPages.length; i++ ) {
        var domain = landingPages[i].replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
        if(domain !== 'w3.org') {
            res.push(landingPages[i]);
        }
    }
    return res;
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
        captureErrorContentScript(grabNewsPostsOldInterface,[],{});
    } else if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
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


function isNewsOrganisationFacebookPage(facebook_page_id) {


    if (facebook_page_id === '' || facebook_page_id === undefined)
        return false;

    let facebook_ids = getFacebookIdsArray();


    if(facebook_ids === undefined){
        throw "FACEBOOK_PAGE_IDS not defined !"
    }

    for (let i = 0; i < facebook_ids.length; i++) {
        if (facebook_ids[i].toString() === facebook_page_id) {
            return true;
        }
    }
    return false;

}


/**
 * Checking whehter a domain belong to news or not
 */
function isNewsDomain(landing_domain) {
    if (landing_domain === '' || landing_domain === undefined)
        return false;

    let domains = getNewsDomainsArray();

    if(domains === undefined) {
        throw "NEWS DOMAINS AND SHORT DOMAINS ARE UNDEFINED !";
    }

    for (let i = 0; i < domains.length; i++) {
        if (domains[i] === landing_domain) {
            return true;
        }
    }
    return false;
}


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

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}