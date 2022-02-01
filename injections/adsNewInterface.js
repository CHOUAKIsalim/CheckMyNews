

const TYPES = {"frontAd" : "frontAd", "sideAd" : "sideAd", "newsPost": "newsPost", "publicPost" : "publicPost"}; // possible types of ads ad analyst collects



function getReactKey(elem) {

	let keys = Object.keys(elem);

	for (let i=0;i<keys.length;i++) {
		if (keys[i].indexOf('reactFiber')!==-1) {
			return keys[i]
		}
	}
	return undefined
}


function stringifyReact(val, depth, replacer, space, onGetObjID) {
    depth = isNaN(+depth) ? 1 : depth;
    var recursMap = new WeakMap();
    function _build(val, depth, o, a, r) { 
        return !val || typeof val != 'object' ? val
            : (r = recursMap.has(val), recursMap.set(val,true), a = Array.isArray(val),
               r ? (o=onGetObjID&&onGetObjID(val)||null) : JSON.stringify(val, function(k,v){ if (a || depth > 0) { if (replacer) v=replacer(k,v); if (!k) return (a=Array.isArray(v),val=v); !o && (o=a?[]:{}); o[k] = _build(v, a?depth:depth-1); } }),
               o===void 0 ? (a?[]:{}) : o);
    }
    return JSON.stringify(_build(val, depth), null, space);
}


function getUniqueElems(lst) {
	return Array.from(new Set(lst));
}

function getAdId(frontAd) {
	let allChildren = frontAd.getElementsByTagName('*');
	let adIds = [];
	let clientTokens = [];
	for (let i=0;i<allChildren.length;i++) {
		reactKey = getReactKey(allChildren[i]);

		if (!reactKey) {
			continue
		}

		k = stringifyReact(allChildren[i][reactKey],9);

		if (k.indexOf('client_token')!==-1 && k.indexOf("sponsored_data")!==-1) {
			clientTokens.push(JSON.parse(k.match(/sponsored_data":{[^}]*}/)[0].replace('sponsored_data":',''))["client_token"])

		}

		if (k.indexOf('ad_id')!==-1) {
			let matchedToSponsoredElements = k.match(/sponsored_data":{[^}]*}/);
			if(matchedToSponsoredElements && matchedToSponsoredElements.length > 0) {
				adIds.push(JSON.parse(matchedToSponsoredElements[0].replace('sponsored_data":',''))["ad_id"])
			}
		}
	}

	adIds = getUniqueElems(adIds);
	clientTokens = getUniqueElems(clientTokens);

	if (adIds.length!==1 || clientTokens.length!==1) {
		//NOTIFY SERVER
		return [-1,-1]

	}

	return [adIds[0],clientTokens[0]]
}

function getAdvertiserImageAndLink(frontAd) {
	let links = frontAd.getElementsByTagName('a');
    let newLinks = [];
    for  (let i=0;i<links.length;i++) {
    	if (!!links[i].href && links[i].href.indexOf('/stories/')!==-1) {
    		continue
    	}
    	let images = links[i].getElementsByTagName('img');
//        if ((images.length === 1) && ((window.getComputedStyle(images[0]).width==="40px" && window.getComputedStyle(images[0]).height==="40px") || (window.getComputedStyle(images[0]).width==="32px" && window.getComputedStyle(images[0]).height==="32px"))) {
		if ((images.length === 1) && ((window.getComputedStyle(images[0]).width === "40px" || window.getComputedStyle(images[0]).width === "32px") && (window.getComputedStyle(images[0]).height === "40px" || window.getComputedStyle(images[0]).height === "32px"))) {
			newLinks.push(links[i])
            
        }
    }



     for  (let i=0;i<links.length;i++) {
    	let images = links[i].getElementsByTagName('image');
//        if ((images.length === 1) && ((window.getComputedStyle(images[0]).width==="40px" && window.getComputedStyle(images[0]).height==="40px") || (window.getComputedStyle(images[0]).width==="32px" && window.getComputedStyle(images[0]).height==="32px"))) {

		if ((images.length === 1) && ((window.getComputedStyle(images[0]).width === "40px" || window.getComputedStyle(images[0]).width === "32px") && (window.getComputedStyle(images[0]).height === "40px" || window.getComputedStyle(images[0]).height === "32px"))) {
				newLinks.push(links[i])
        }
    }


    
    if (newLinks.length==0) {
    	// TODO:SEND ERROR MESSAGE TO THE SaERVER
    	debugLog("No advertiser link in the ad");
    	return

    }

    if (newLinks.length>1) {
    	// TODO:SEND ERROR MESSAGE TO THE SERVER
    	debugLog("More than one links that can be the advertiser in the new interface handle");
    	debugLog(newLinks)
    }

   let link = newLinks[0];

    let facebookPage = link.href.substring(0, link.href.indexOf('?'));
    let advertiserImage = links[0].getElementsByTagName('img').length>0?links[0].getElementsByTagName('img')[0].src:link.getElementsByTagName('image')[0].getAttribute('xlink:href');

    return [link,facebookPage,advertiserImage]


}

/**
 * return advertiser id from the front ad
 *
 * 
 * @param  {object} frontAd DOM element of the front ad
 * @return {string}         advertiser id
 */
function getReactAdvertiserInfo(frontAd) {
//    let advertiserId = link.getAttribute(DATA_HOVERCARD).replace(ADVERTISER_FB_ID_PATTERN,"")

	try {
		let [link, facebookPage,advertiserImage] = getAdvertiserImageAndLink(frontAd);

		let reactKey = getReactKey(link);

		if (reactKey===undefined) {
			// TODO nnotify server
			debugLog("Cannot get the key")
			return ["-3",facebookPage,advertiserImage]
		}

		let advertiserId= "-4"
		try {
			advertiserId = link[reactKey]['memoizedProps']['children']['props']['children']['props']['entity']['id'];
		} catch (e) {
			// TODO notifyserver
		}

		return [advertiserId,facebookPage,advertiserImage]

	}
	catch (e) {
		debugLog(e)
	}
}



function findLeftSideBrackets(text,position) {
    let rightBrackets=0;
    for (let i=position;i>0;i--) {
        if (text[i]==='{') {
            if (rightBrackets===0) {
                return i;
            }
            rightBrackets-=1;
            continue
        }

        if (text[i]==='}') {
            rightBrackets+=1
        }
    }

}


function findRightSideBrackets(text,position) {
    let leftBrackets=0;
    for (let i=position;i<text.length;i++) {
        if (text[i]==='}') {
            if (leftBrackets===0) {
                return i;
            }
            leftBrackets-=1;
            continue
        }

        if (text[i]==='{') {
            leftBrackets+=1
        }
    }

}


function getVideoImage(frontAd) {
	let father = frontAd.getElementsByTagName('video')[0].parentElement;
	let allChildren = father.getElementsByTagName('*');
	for (let i=0;i<allChildren.length;i++) {
        reactKey = getReactKey(allChildren[i]);

        if (!reactKey) {
            continue
        }

	 k = stringifyReact(allChildren[i][reactKey],9);
	if (k.indexOf(".jpg")!==-1) {
		let img = k.match(/https:\/\/scontent.*?"/)
		if (img.length>0) {
			return img[0].slice(0,img[0].length-1);
		}

	}


}
}









function getParentImageUrl(element,frontAd) {

	if (element.isSameNode(frontAd)) {
		return undefined
	}

	siblings = getSiblings(element)
	if (siblings.length===1 && siblings[0].nodeName==='IMG') {
		return siblings[0].src
	}

	return getParentImageUrl(element.parentElement,frontAd) 


}


/**
 * return the image urls of background elements. Essentially grabs the preview snapshot of a video.
 * @param  {object} frontAd DOM element of front ad
 * @return {[array]}        array of background image urls
 */
function getBackgroundUrlImagesNewInterface(frontAd) {
    let images = [];
    

    var videos = frontAd.getElementsByTagName('video');
    for (let i=0;i<videos.length;i++) {
    	parentImage = getParentImageUrl(videos[i],frontAd);
    	images.push(parentImage)
    }
    if (images.length>1) {
    	// TODO notify server
    	debugLog("More than one images from getBackgroundUrlImagesNewInterface")
    }
    return images
     }




/**
 * get the image urls of the ad
 * @param  {array} links   the list of links in the ad
 * @param  {object} frontAd the ad DOM object
 * @return {array}         array of the links of all imageUrls
 */
function getImagesFrontAdsNewInterface(links,frontAd) {
    var imagesAll = []
    for (let i=0;i<links.length;i++) {
        if (links[i].getAttribute('role')!=='link' || (links[i].getAttribute('rel') !== 'nofollow noopener' && links[i].getAttribute('rel') !== 'theater' ) ){
        	continue
        }

        let images =links[i].getElementsByTagName('img');

        if (images.length===0) {
        	continue
        }
        

        if (images.length>1) {
        	// TODO: notify server
        	debugLog("Images more than one");
        	debugLog(images);
        }
        imageUrls = [];
        for (let j=0;j<images.length;j++) {
            if (images[j].width===16 && images[j].height===16) {
                continue
            }
        	imageUrls.push(images[j].src);
        }
        
        Array.prototype.push.apply(imagesAll,imageUrls);
    }
    
    

    

    return getUniqueElems(imagesAll);
}

function findExtraFRTPIdentifiers(frontAd) {
	let obj_ids = [];
	let serialized_frtp_identifiers = [];
	let debug_info = [];

	let allChildren = frontAd.getElementsByTagName('*');
	for (let i=0;i<allChildren.length;i++) {
        reactKey = getReactKey(allChildren[i]);

        if (!reactKey) {
            continue
        }

	 k = stringifyReact(allChildren[i][reactKey],9);
	if (k.indexOf("serialized_frtp_identifiers")!==-1) {
	firstChar = findLeftSideBrackets(k,k.indexOf("serialized_frtp_identifiers"));
	lastChar = findRightSideBrackets(k,k.indexOf("serialized_frtp_identifiers"));
	let obj = JSON.parse(k.slice(firstChar,lastChar+1));
	obj_ids.push(obj['id']);
	serialized_frtp_identifiers.push(obj['serialized_frtp_identifiers']);
	debug_info.push(obj['debug_info']);

	// objects.push([obj['id'],obj['serialized_frtp_identifiers'],obj['debug_info']])
	}
	    }

	 obj_ids = getUniqueElems(obj_ids);
 	 serialized_frtp_identifiers = getUniqueElems(serialized_frtp_identifiers);
  	 debug_info = getUniqueElems(debug_info);



	 if (obj_ids.length!==1 || serialized_frtp_identifiers.length!==1 || debug_info.length!==1 ) {
	 	// TODO: Notify server
	 	return [-1,-1,-1];
	 }

	 return [obj_ids[0],serialized_frtp_identifiers[0],debug_info[0]];


}



function getAdExtraData(customId, type) {
	try {
		let elements = document.querySelectorAll('[adan="'+customId+'"]');
		if (elements.length!=1) {
			// TODO: notifys
			debugLog("no elements")
			return undefined;
		}

		let frontAd = elements[0];
		let [advertiserId,facebookPage,advertiserImage] = getReactAdvertiserInfo(frontAd);
		let [adId,clientToken] = [-1, -1];

		[adId, clientToken] = getAdId(frontAd);

		let [objId,serialized_frtp_identifiers,story_debug_info]= findExtraFRTPIdentifiers(frontAd);
		let images = getImagesFrontAdsNewInterface(frontAd.getElementsByTagName('a'),frontAd);
		let video = frontAd.getElementsByTagName('video')>0;
		let video_id = ''
		if (video) {
			video_id = '';
			images = [getVideoImage(frontAd)];
		}


		return {advertiser_facebook_id:advertiserId,advertiser_facebook_page:facebookPage,advertiser_facebook_profile_pic:advertiserImage,
			clientToken: clientToken,adId:adId,objId:objId,serialized_frtp_identifiers:serialized_frtp_identifiers,story_debug_info:story_debug_info,
			images:images,video:video}
	}
	catch (e) {
		debugLog(e)
	}

}



function processAd(customId, type) {
	let data = getAdExtraData(customId, type);
	if(data) {
		data['newInterface']=true;
		data['customId'] = customId;
		data['graphQLAsyncParams'] = require("getAsyncParams")("POST");
		window.postMessage(data, "*");
	}
}

