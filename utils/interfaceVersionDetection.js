
var INTERFACE_VERSIONS = {unknown:"UNKNOWN",old:"OLD",new:"NEW"};
var new_interface_sent = false;


function initializeUserInterfaceVersion(userId){
   if (!localStorage.userInterfaceVersion) {

        localStorage.userInterfaceVersion = JSON.stringify({});
    }

    let allVersions = JSON.parse(localStorage.userInterfaceVersion);

    if (!allVersions.hasOwnProperty(userId)) {
        allVersions[userId] = INTERFACE_VERSIONS.unknown;
        localStorage.userInterfaceVersion = JSON.stringify(allVersions);

    }

}


function setUserInterfaceVersion(userId,version) {
	
	initializeUserInterfaceVersion(userId);
    let allVersions = JSON.parse(localStorage.userInterfaceVersion);
    allVersions[userId] = version;
    if(version === 'NEW' && new_interface_sent===false) {
        sendNewVersionDetected();
    }
    localStorage.userInterfaceVersion = JSON.stringify(allVersions); 

}


function sendNewVersionDetected() {


    if(CURRENT_USER_ID !== -1) {

        new_interface_sent = true;
        var data = {
            user_id : USER_ID,
            status : 'New Interface',
            timestamp : (new Date()).getTime(),
        };

        $.ajax({
            type: REQUEST_TYPE,
            url: URLS_SERVER.newInterfaceDetected,
            dataType: "json",
            traditional: true,
            data: JSON.stringify(replaceUserIdEmail(data)   ),
            tryCount: 0,
            retryLimit: 3,
            success: function (a) {
                if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                    if (a[STATUS] && (a[REASON] = NO_USER_CONSENT)) {
                        captureErrorBackground(getConsentFromServer, [URLS_SERVER.getConsent, 0, genericRequestSuccess, genericRequestNoConsent, genericRequestError], URLS_SERVER.registerError, undefined);
                    }
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        console.log('Trying again...')
                        $.ajax(this);
                        return;
                    }
                    console.log('Stoping trying...');
                    return true
                };
                return true
            },

            error: function (xhr, textStatus, errorThrown) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    console.log('Trying again...')

                    $.ajax(this);
                    return;
                }
                console.log('Stoping trying...');
                return
            }
        });

    }




}

function getUserInterfaceVersion(userId) {

	initializeUserInterfaceVersion(userId);

	return JSON.parse(localStorage.userInterfaceVersion)[userId];
}

function getFacebookInterfaceVersionDoc(resp) {
    let title = resp.match('id="facebook"');
    if (title===null) {
            return INTERFACE_VERSIONS.unknown;
    }

    if (title.length <1) {
            return INTERFACE_VERSIONS.unknown;
    }

	let hasIds = resp.match('userNavigationLabel');

    if (hasIds===null) {
            return INTERFACE_VERSIONS.new;
    }

    if (hasIds.length <1) {
            return INTERFACE_VERSIONS.new;
    }


    return INTERFACE_VERSIONS.old;
}


function setFacebookInterfaceVersionDoc(userId,resp) {
	setUserInterfaceVersion(userId,getFacebookInterfaceVersionDoc(resp));
}



function getFacebookInterfaceVersionFromParsedDoc(doc) {
    let hasTitle = !!doc.getElementById('facebook');
    if (hasTitle===false) {
        return INTERFACE_VERSIONS.unknown;

    }
    return !!doc.getElementById('userNavigationLabel')?INTERFACE_VERSIONS.old:INTERFACE_VERSIONS.new;}