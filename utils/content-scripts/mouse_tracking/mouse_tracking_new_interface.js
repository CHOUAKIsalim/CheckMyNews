

var likeButtonClassNewInterface = "rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 hpfvmrgz ph5uu5jm b3onmgus iuny7tx3 ipjc6fyt";
var normalLikeColorNewInterface = "rgb(101, 103, 107)";
var commentButtonClassNewInterface = "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv n05y2jgg hbms080z p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h vul9dhcy f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l f49446kz  _666h  _18vj _18vk"
var shareButtonClassNewInterface = "oajrlxb2 bp9cbjyn g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 j83agx80 rj1gh0hx btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l buofh1pr k7cz35w2 taijpn5t ms05siws flx89l3n ogy3fsii";
var advertiserLinkClassNewInterface = "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl oo9gr5id gpro0wi8 lrazzd5p";
var advertiserLogoClassNewInterface ="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 q9uorilb mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l oo9gr5id";
var menuDivClassNewInterface = "oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 pq6dq46d mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l dwo3fsh8 pzggbiyp pkj7ub1o bqnlxs5p kkg9azqs c24pa1uk ln9iyx3p fe6kdd0r ar1oviwq l10q8mi9 sq40qgkc s8quxz6p pdjglbur";
var menuElementDivClassNewInterface = "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 oi9244e8 oygrvhab h676nmdw cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn dwo3fsh8 btwxx1t3 pfnyh3mw du4w35lb"
var carouselNextClassNewInterface = "hu5pjgll m6k467ps sp_D-6eZQK8GT3 sx_dae08a";
var carouselPreviousClassNewInterface = "hu5pjgll m6k467ps sp_D-6eZQK8GT3 sx_126de3";
var minBodyImgSize = 200;


function onMessagingNewInterface() {

    var chatPage = document.getElementsByClassName("poy2od1o i09qtzwb n7fi1qx3")[0];

    if (chatPage === null || chatPage === undefined) {
        console.log('Error: ChatTabsPagelet not found');
        return;
    }
    chatPage.addEventListener('DOMSubtreeModified', function (event) {
        var chatTabs = $('div[data-pagelet="ChatTab"]');
        if (chatTabs.length == 0) {
            if (isOnMessaging) {
                lastTimestampOnMessaging = Date.now();
                isOnMessaging = false;
                checkAdVisibleDuration();
                checkPostVisibleDuration();
            }
        } else {
            if (!isOnMessaging) {
                lastTimestampOnMessaging = Date.now();
                isOnMessaging = true;
                interruptAdVisibility();
                interruptPostVisibility();
            }
        }
    });

}


function addEventListenersNewInterface(ad) {
    // This vas will be used to advertiser check
    var dateForAdvertiserCheckWithHover;


    let frontAd = document.getElementById(ad.html_ad_id);

    // Listener for réactions : like, love, haha, wow, sad, angry
    //    let likeButton = frontAd.getElementsByClassName(likeButtonClassNewInterface)[0];

    let likeButton = frontAd.querySelectorAll('[aria-label="Like"]')[0];
    if(likeButton!== undefined){

        // IT was with the observer to detect the different colors (different reactions)
        // But facebook made it impossible
        // So i just detect the click now
        /**
        var observer = new MutationObserver(function (mutations) {
            if (likeButton != null) {
                newColor = getComputedStyle(likeButton).color;
                console.log(getComputedStyle(likeButton));
                let type = undefined;
                if (newColor === normalLikeColorNewInterface) {
                    if ( lastEventType !== normalLikeColor){
                        type = removeLikeEventType;
                    }
                } else if (newColor === likeColor) {
                    if (lastEventType !== likeEventType) {
                        type = likeEventType;
                    }
                } else if (newColor === loveColor) {
                    type = loveEventType;
                } else if (newColor === hahaColor) { //Haha wow and sad
                    if (likeButton.innerHTML.indexOf(hahaText) !== -1) {
                        type = hahaEventType;
                    } else if (likeButton.innerHTML.indexOf(englishWowText) !== -1 || likeButton.innerHTML.indexOf(frenchWowText) !== -1) {
                        type = wowEventType;
                    } else if (likeButton.innerHTML.indexOf(englishCareText) !== -1 || likeButton.innerHTML.indexOf(frenchCareText) !== -1) {
                        type = careEventType;
                    } else {
                        type = sadEventType
                    }

                } else if (newColor === angryColor) {
                    type = angryEventType;
                }

                if(type !== undefined) {
                    storeAdClickEvent(ad, type);
                }
            }
        });
        observer.observe(likeButton, {attributes: true, childList: true});
 **/

        likeButton.addEventListener('click', function (){
            storeAdClickEvent(ad, LikeButtonAllReactionsEventType);
        })
    }


    // Listener for clicking on comment button and writing comment

//    let commentButton = frontAd.getElementsByClassName(commentButtonClassNewInterface)[0];
    let commentButton = frontAd.querySelectorAll('[aria-label="Leave a comment"]')[0];
    if (commentButton !== undefined) {
        commentButton.addEventListener('click', function () {
            storeAdClickEvent(ad, commentButtonClickEventType)
        });
        commentButton.addEventListener('mouseleave', function () {
            let frontAdUpdated = document.getElementById(ad.html_ad_id);
            let commentWritingDiv = frontAdUpdated.getElementsByClassName(commentWritingDivClass)[0];
            if (commentWritingDiv !== undefined) {
                commentWritingDiv.addEventListener('DOMSubtreeModified', function () {
                    if (lastEventType !== commentWritingEventType) {
                        storeAdClickEvent(ad, commentWritingEventType);
                    }
                })
            }
        });
    }

    //Listener for share button

//    let shareButton = frontAd.getElementsByClassName(shareButtonClassNewInterface)[0];
    let shareButton = frontAd.querySelectorAll('[aria-label="Send this to friends or post it on your timeline."]')[0];
    if (shareButton !== undefined) {
        shareButton.addEventListener('click', function () {
            storeAdClickEvent(ad, shareEventType);
        });
    }

    // Listener for advertiser check from the link
    let advertiserLink = frontAd.getElementsByClassName(advertiserLinkClassNewInterface)[0];
    if (advertiserLink !== undefined) {
        advertiserLink.addEventListener('click', function () {
            storeAdClickEvent(ad, advertiserPageCheckType);
        });
        advertiserLink.addEventListener('contextmenu', function () {
            storeAdClickEvent(ad, advertiserPageRightClickType);
        });
        advertiserLink.addEventListener('mouseenter', function () {
            dateForAdvertiserCheckWithHover = Date.now()
        });

        advertiserLink.addEventListener('mouseleave', function () {
            difference = (Date.now() - dateForAdvertiserCheckWithHover);
            if (difference >= minDifferenceForAdvertiserCheck) {
                storeAdClickEvent(ad, advertiserCheck);
            }
        });
    }

    // Listener for advertiser check from the logo
    let advertiserLogo = frontAd.getElementsByClassName(advertiserLogoClassNewInterface)[0];
    if (advertiserLogo !== undefined) {
        advertiserLogo.addEventListener('click', function () {
            storeAdClickEvent(ad, advertiserPageCheckType);
        });

        advertiserLogo.addEventListener('contextmenu', function () {
            storeAdClickEvent(ad, advertiserLogoRightClick);
        });
        advertiserLogo.addEventListener('mouseenter', function () {
            dateForAdvertiserCheckWithHover = Date.now()
        });

        advertiserLogo.addEventListener('mouseleave', function () {
            difference = (Date.now() - dateForAdvertiserCheckWithHover);
            if (difference >= minDifferenceForAdvertiserCheck) {
                storeAdClickEvent(ad, advertiserCheck);
            }
        });

    }

    //Listeners for Hide, Report, Save add and why i'm seeing the ad
    let menu = frontAd.getElementsByClassName(menuDivClassNewInterface)[0];
    if (menu !== undefined) {
        menu.addEventListener('mouseleave', function () {
            removeMenuListenerNewInterface();
            addMenuListenersNewInterface(ad);
        })
    }

    //Landing url check
    let links = frontAd.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        if (links[i].href !== "#" && links[i].href.indexOf("https://www.facebook") === -1 && links[i].href.indexOf("http://www.facebook") === -1 && links[i].href.indexOf("https://facebook") === -1 && links[i].href.indexOf("http://facebook") === -1) {
            links[i].addEventListener('click', function () {
                storeAdClickEvent(ad, visitingLandingUrlEventType);
            });
            links[i].addEventListener('contextmenu', function () {
                storeAdClickEvent(ad, rightClickOnLandingUrlEventType);
            })
        }
    }

    // AdImage
    let adImgs = frontAd.getElementsByTagName("img");

    for(let i=0; i < adImgs.length; i++) {
        if(adImgs[i].height >= minBodyImgSize && adImgs[i].width >= minBodyImgSize) {
            adImgs[i].addEventListener('click', function () {
                storeAdClickEvent(ad, imageClickedEventType);
            });
            adImgs[i].addEventListener('contextmenu', function () {
                storeAdClickEvent(ad, rightClickOnImage);
            });
        }

    }


    // handle Carousel mouvement
    let nextButton = frontAd.getElementsByClassName(carouselNextClassNewInterface)[0];
    if(nextButton !== undefined) {
        nextButton.addEventListener('click', function () {
            storeAdClickEvent(ad, carouselNextEvent);
            if(previousCarouselListenerAdded === 0) {
                let previousButton = frontAd.getElementsByClassName(carouselPreviousClassNewInterface)[0];
                if(previousButton !== undefined) {
                    previousButton.addEventListener('click', function () {
                        storeAdClickEvent(ad, carouselPreviousEvent);
                    });
                    previousCarouselListenerAdded = 1;
                }
            }
        })
    }
 }

function removeMenuListenerNewInterface() {
    let menuItems = document.getElementsByClassName(menuElementDivClassNewInterface);
    if(menuItems !== undefined && menuItems[0] !== undefined) {
        for(let i=0 ; i<menuItems.length ; i++) {
            var new_element = menuItems[i].cloneNode(true);
            menuItems[i].parentNode.replaceChild(new_element, menuItems[i]);
        }
    }
}

function addMenuListenersNewInterface(ad) {
    let menuItems = document.getElementsByClassName(menuElementDivClassNewInterface);
    if(menuItems !== undefined && menuItems[0] !== undefined) {
        for(let i=0; i<menuItems.length ; i++) {
            menuItems[i].addEventListener('click', function () {
                storeAdClickEvent(ad, menuItems[i].innerText.split('\n')[0]);
            });
        }
    }
}


/**
 * Grab all post visible in user view
 */
function grabPostsNewInterface(){
    var nextNum = 0;
    if(Object.keys(POST_QUEUE).length>0){
        nextNum = Math.max.apply(null,Object.keys(POST_QUEUE).map(function (x) {return parseInt(x)})) +1 ;
    }
    if(window.location.href.indexOf('ads/preferences') == -1){
        var allAdsId = Object.keys(FRONTADQUEUE).map(key => FRONTADQUEUE[key]['html_ad_id']);
        var allDomPosts = document.getElementsByClassName(POST_CLASS_NEW_INTERFACE);
        for (let i = 0; i < allDomPosts.length; i++) {
            var allPostId = Object.keys(POST_QUEUE).map(key => POST_QUEUE[key]['html_post_id']);

            if(!allPostId.includes(allDomPosts[i].id)){
                var elmPosition = toRelativeCoordinate(getElementCoordinate($(allDomPosts[i])));
                if(!allAdsId.includes(allDomPosts[i].id) && elmPosition !== undefined) {
                    markAd(allDomPosts[i]);
                    POST_QUEUE[nextNum] = { 'html_post_id': allDomPosts[i].id, 'timestamp': (new Date).getTime(), 'user_id': getUserId(),'visibleDuration':[] };
                    nextNum++;
                }
            }
        }
    }
}