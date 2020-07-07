var requestLock = undefined;
var INTERVAL =  10 * 60000;
// function getAdReource(){
//     requestLock = undefined;
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', 'https://scontent.xx.fbcdn.net/hads-ak-prn2/1487645_6012475414660_1439393861_n.png');


 
//     try{

//         xhr.onload = function(){
//             if(xhr.status !== 200){
//                 console.log('Error status:' + xhr.status + ' - ' + xhr.statusText);
//                 requestLock = false;
//             }
//             else{
//                 console.log('Get ad resource success');
//                 requestLock = false;
//             }
//             console.log('postMessage() from adRequests.js')
//             var data = {'type':'statusAdBlocker','value':requestLock}
//             console.log(data);
//             window.postMessage(data, '*');
//         };

//         xhr.onerror = function(event){
//             requestLock = true;
//             console.log('Error status:' + event.target.status);
//             console.log('postMessage() from adRequests.js')
//             var data = {'type':'statusAdBlocker','value':requestLock}
//             console.log(data);
//             window.postMessage(data, '*');
//         };
//         xhr.send();

//     }
//     catch{
//         requestLock = true;
//         console.log('postMessage() from adRequests.js')
//         var data = {'type':'statusAdBlocker','value':requestLock}
//         console.log(data);
//         window.postMessage(data, '*');
//     }

 
// }
// 
// 
function getAdResource(){
    var requestLock = undefined;



 
    try{
        var img = document.createElement("img");
        document.body.appendChild(img);


        img.onload = function(){
            requestLock = false;
            // console.log('postMessage() from adRequests.js')
            var data = {'type':'statusAdBlocker','value':requestLock}
            console.log(data);
            window.postMessage(data, '*');
            img.parentNode && img.parentNode.removeChild(img);


        };


        img.onerror = function(event){
            requestLock = true;
            // console.log('Error status:' + event.target.status);
            // console.log('postMessage() from adRequests.js')
            var data = {'type':'statusAdBlocker','value':requestLock};
            console.log(data);
            window.postMessage(data, '*');
            img.parentNode && img.parentNode.removeChild(img);

        };
        img.src ='https://scontent.xx.fbcdn.net/hads-ak-prn2/1487645_6012475414660_1439393861_n.png';

    }
    catch (err){
        requestLock = true;
        console.log(err)
        console.log('postMessage() from adRequests.js')
        var data = {'type':'statusAdBlocker','value':requestLock}
        console.log(data);
        window.postMessage(data, '*');
    }

 
}

getAdResource();
setInterval(getAdResource, INTERVAL);

window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    //    console.log(event)
    if (event.source != window)
        return;
 
    if (event.data.getAdBlockerStatus) {
        getAdResource();
        return true;
    }
});