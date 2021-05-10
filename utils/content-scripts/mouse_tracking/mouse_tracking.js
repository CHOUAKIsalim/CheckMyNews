var likeButtonClass = " _6a-y _3l2t  _18vj";
var normalLikeColor = "rgb(96, 103, 112)";
var commentButtonClass = " _666h  _18vj _18vk _42ft ";
var shareButtonClass = "_18vi";
var advertiserLinkClass = "fwn fcg";
var advertiserLogoClass = "_38vo";
var menuDivClass = "_4xev _p";
var menuElementDivClass = "_54nc";
var lastTimestampMessagingON = 0;
var lastTimestampMessagingOFF = 0;






function onMessaginOldInterface(){
    var chatPage = document.getElementById('ChatTabsPagelet');
    if (chatPage === null || chatPage === undefined){
        return;
    }
    chatPage.addEventListener('DOMSubtreeModified',function(event){
        var curTs = Date.now();
        var chatTabs = this.getElementsByClassName('fbNubFlyoutOuter');
        if(chatTabs.length == 0){
            if(isOnMessaging){
                lastTimestampOnMessaging = Date.now();
                isOnMessaging = false;
                checkAdVisibleDuration();
                checkPostVisibleDuration();
            }
        }
        else{
            if(!isOnMessaging){
                lastTimestampOnMessaging = Date.now();
                isOnMessaging = true;
                interruptAdVisibility();
                interruptPostVisibility();
            }
        }
    });

}


function addEventListenersOldInterface(ad) {
    //Init the array of events
    ad["events"] = [];

    // This vas will be used to advertiser check
    var dateForAdvertiserCheckWithHover;

    // Getting the html object of the ad
    let frontAd = document.getElementById(ad.html_ad_id);

    // Listener for réactions : like, love, haha, wow, sad, angry
    let likeButton = frontAd.getElementsByClassName(likeButtonClass)[0];
    if(likeButton !== undefined) {
        var observer = new MutationObserver(function (mutations) {
            if (likeButton != null)     {
                newColor = getComputedStyle(likeButton).color;
                let type = undefined;
                if (newColor === normalLikeColor) {
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
                    } else {
                        type = sadEventType;
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
    }

    // Listener for clicking on comment button and writing comment
    let commentButton = frontAd.getElementsByClassName(commentButtonClass)[0];
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
    let shareButton = frontAd.getElementsByClassName(shareButtonClass)[2];
    if (shareButton !== undefined) {
        shareButton.addEventListener('click', function () {
            storeAdClickEvent(ad, shareEventType);
        });
    }

    // Listener for advertiser check from the link
    let advertiserLink = frontAd.getElementsByClassName(advertiserLinkClass)[0];
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
    let advertiserLogo = frontAd.getElementsByClassName(advertiserLogoClass)[0];
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
    let menu = frontAd.getElementsByClassName(menuDivClass)[0];
    if (menu !== undefined) {
        menu.addEventListener('mouseleave', function () {
            removeMenuListener();
            addMenuListeners(ad);
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
    adBody = frontAd.getElementsByClassName("_3x-2")[0];
    if (adBody !== undefined) {
        adBodyLinks = adBody.getElementsByTagName('a');
        for (let k = 0; k < adBodyLinks.length; k++) {
            bodyLink = adBodyLinks[k];
            if (bodyLink.href === "#" || bodyLink.href.indexOf("https://www.facebook") !== -1 || bodyLink.href.indexOf("http://www.facebook") !== -1 || bodyLink.href.indexOf("https://facebook") !== -1 || bodyLink.href.indexOf("http://facebook") !== -1) {
                linkImg = bodyLink.getElementsByTagName('img');
                if (linkImg !== undefined && linkImg.length > 0) {
                    for (let l = 0; l < linkImg.length; l++) {
                        linkImg[l].addEventListener('click', function () {
                            storeAdClickEvent(ad, imageClickedEventType);
                        });
                        linkImg[l].addEventListener('contextmenu', function () {
                            storeAdClickEvent(ad, rightClickOnImage);
                        })
                    }
                }
            }
        }

    }

    // handle Carousel mouvement
    nextButton = frontAd.getElementsByClassName("_5flc _5flf")[0];
    if(nextButton !== undefined) {
        nextButton.addEventListener('click', function () {
            storeAdClickEvent(ad, carouselNextEvent);
            if(previousCarouselListenerAdded === 0) {
                previousButton = frontAd.getElementsByClassName("_5flc _5fle")[0];
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

function removeMenuListener() {
    let menuItems = document.getElementsByClassName(menuElementDivClass);
    if(menuItems !== undefined && menuItems[0] !== undefined) {
        for(let i=0 ; i<menuItems.length ; i++) {
            var new_element = menuItems[i].cloneNode(true);
            menuItems[i].parentNode.replaceChild(new_element, menuItems[i]);
        }
    }
}

function addMenuListeners(ad) {
    let menuItems = document.getElementsByClassName(menuElementDivClass);
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
function grabPostsOldInterface(){

    var nextNum = 0;
    if(Object.keys(POST_QUEUE).length>0){
        nextNum = Math.max.apply(null,Object.keys(POST_QUEUE).map(function (x) {return parseInt(x)})) +1 ;
    }
    if(window.location.href.indexOf('ads/preferences') == -1){
        console.log('Grabbing posts');
        var allPostsId = [];
        var allAdsId = Object.keys(FRONTADQUEUE).map(key => FRONTADQUEUE[key]['html_ad_id']);

        $('div[id*="'+ HTML_POST_ID +'"]').each(function(){
            var allPostId = Object.keys(POST_QUEUE).map(key => POST_QUEUE[key]['html_post_id']);
            if(!allPostId.includes(this.id)){
                var elmPosition = toRelativeCoordinate(getElementCoordinate($(this)));

                if(!allAdsId.includes(this.id) && elmPosition !== undefined) {
                    console.log(this);
                    POST_QUEUE[nextNum] = { 'html_post_id': this.id, 'timestamp': (new Date).getTime(), 'user_id': getUserId(),'visibleDuration':[] };
                    console.log(POST_QUEUE[nextNum]);
                    nextNum++;
                }
            }
        });

    }
}
