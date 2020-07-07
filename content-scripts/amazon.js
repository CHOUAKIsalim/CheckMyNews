

MSG_TYPE = 'message_type';
AMAZON_BUYING_MESSAGE_TYPE = 'amazon_buying_message_type';
cartButtonId = "add-to-cart-button";
buyButtonId = "buy-now-button";
productTitleId = "productTitle";
wishListId = "add-to-wishlist-button-submit";
activateNowId = "rcx-subscribe-submit-button-announce";

var cartButton = document.getElementById(cartButtonId);
if(cartButton !== undefined && cartButton !== null) cartButton.addEventListener("click", function() {
    buyingArticleEvent('add-to-cart');
});

var buyNowButton = document.getElementById(buyButtonId);
if(buyNowButton !== undefined && buyNowButton !== null)  buyNowButton.addEventListener("click", function() {
    buyingArticleEvent('buy-now');
});

var wishListButton = document.getElementById(wishListId);
if(wishListButton !== undefined && wishListButton !== null)  wishListButton.addEventListener("click", function() {
    buyingArticleEvent('add-to-wish-list');
});

var activateNowButton = document.getElementById(activateNowId);
if(activateNowButton !== undefined && activateNowButton !== null)  activateNowButton .addEventListener("click", function() {
    buyingArticleEvent('activate-notification');
});


function buyingArticleEvent(action) {

    var article = "";
    var articleElement = document.getElementById(productTitleId);
    if(articleElement !== undefined && articleElement !== null) {
        article = articleElement.textContent.trim();
    }
    var data = {
        'timestamp' : (new Date()).getTime(),
        'url' : window.location.href,
        'article' : article,
        'action' : action
    };

    data[MSG_TYPE] = AMAZON_BUYING_MESSAGE_TYPE;
    chrome.runtime.sendMessage(data);

}