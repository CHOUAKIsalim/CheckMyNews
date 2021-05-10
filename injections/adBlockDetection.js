var requestLock = undefined;
var ADBLOCKERDETECTIONINTERVAL =  10 * 60000;


function getAdBlockerStatus(){
    var requestLock = undefined;
    try{
        var img = document.createElement("img");
        document.body.appendChild(img);


        img.onload = function(){
            requestLock = false;
            var data = {'type':'statusAdBlocker','value':requestLock}
            debugLog(data);
            window.postMessage(data, '*');
            img.parentNode && img.parentNode.removeChild(img);


        };


        img.onerror = function(event){
            requestLock = true;
            var data = {'type':'statusAdBlocker','value':requestLock};
            debugLog(data);
            window.postMessage(data, '*');
            img.parentNode && img.parentNode.removeChild(img);

        };
        img.src ='https://scontent.xx.fbcdn.net/hads-ak-prn2/1487645_6012475414660_1439393861_n.png';

    }
    catch (err){
        requestLock = true;
        debugLog(err)
        debugLog('postMessage() from adRequests.js')
        var data = {'type':'statusAdBlocker','value':requestLock}
        debugLog(data);
        window.postMessage(data, '*');
    }

 
}


