


function universalOnMessageFunction(msg,sender,sendResponse) {
        if (!sender.tab) {
        if (msg.type === 'getInterests'){
            data = {grabInterests:true}
            window.postMessage(data,"*")
        }

        if (msg.type === 'getAdvertisers'){
            data = {grabAdvertisers:true}
            window.postMessage(data,"*")
        }

        if (msg.type === 'getAdActivity'){
            data = {'grabAdActivity':true,'lastItem':msg.lastItem}
            window.postMessage(data,'*')
        }

        if (msg.type === 'getAdBlockerStatus'){
            var data = {'getAdBlockerStatus':true};
            window.postMessage(data,'*');
        }


        if (msg.type === 'getExplanation') {
            msg.userId = getUserId();
            window.postMessage(msg,'*');
        }

        if (msg.type === 'isValidTab') {
            sendResponse({"validTabResponse":'yes'})
        }

    }


}



function universalCommunicationWithInjections(event) {


    if (event.data.type && (event.data.type=='advertisersData')){
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();
        chrome.runtime.sendMessage(data);
        return;
        }
    
    
    if (event.data.type && (event.data.type=='demographicsNewInterface')){
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();
        chrome.runtime.sendMessage(data);   
        return;
    }


    if (event.data.type && (event.data.type=='interestsData')){
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();
        chrome.runtime.sendMessage(data);
        return;
    }


    if (event.data.type && (event.data.type == 'adActivityList')) {
        var data = event.data
        data['user_id'] = getUserId()
        data['timestamp'] = (new Date).getTime();

        chrome.runtime.sendMessage(data);


        // //Get ad activity from next page
        if (data['hasmore'] == true) {
            var lastItem = data['lastItem']
            data = { 'grabAdActivity': true, 'lastItem': lastItem };
            window.postMessage(data, '*');
        }

        return;
        
    }

    if (event.data.type && (event.data.type == 'adActivityData')) {
        var data = event.data;
        data['user_id'] = getUserId();
        data['timestamp'] = (new Date).getTime();

        chrome.runtime.sendMessage(data); 
        return;      
    }

    if (event.data.type && (event.data.type === 'statusAdBlocker')) {
        var data = event.data;
        chrome.runtime.sendMessage(data);
        return;
    }

    if (event.data.type && (event.data.type == 'explanationReply')) {
        var data = event.data;
        data['message_type']=data.type;
        delete data.type;

        chrome.runtime.sendMessage(data);   
        return ;    
    }

}







function injectUniversalScripts() {

    var s = document.createElement("script");
    s.src = chrome.extension.getURL("injections/errorHandling.js");
    (document.head||document.documentElement).appendChild(s);


    var s1 = document.createElement("script");
    s1.src = chrome.extension.getURL("injections/adBlockDetection.js");
    (document.head || document.documentElement).appendChild(s1);


    var s2 = document.createElement("script");
    s2.src = chrome.extension.getURL("injections/preferenceCrawl.js");
    (document.head||document.documentElement).appendChild(s2);


    var s3 = document.createElement("script");
    s3.src = chrome.extension.getURL("injections/adActivityCrawl.js");
    (document.head||document.documentElement).appendChild(s3);


    var s4 = document.createElement("script");
    s4.src = chrome.extension.getURL("injections/explanationCrawl.js");
    (document.head||document.documentElement).appendChild(s4);


    var s5 = document.createElement("script");
    s5.src = chrome.extension.getURL("injections/universal.js");
    (document.head||document.documentElement).appendChild(s5);


}
