
var INTERFACE_VERSIONS = {unknown:"UNKNOWN",old:"OLD",new:"NEW"};
var new_interface_sent = false;


function initializeUsersNewInterfaceSent() {
    if (!localStorage.newInterfaceSent) {
        localStorage.newInterfaceSent = JSON.stringify([]);
    }
}

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
    if(version === 'NEW') {
        sendNewVersionDetected(userId);
    }
    localStorage.userInterfaceVersion = JSON.stringify(allVersions); 

}

function addUserToNewInterfaceSent(user_id) {
    initializeUsersNewInterfaceSent()
    let allUsersNewInterface = JSON.parse(localStorage.newInterfaceSent);
    if (allUsersNewInterface.indexOf(user_id) === -1 ){
        allUsersNewInterface.push(user_id);
        localStorage.newInterfaceSent = JSON.stringify(allUsersNewInterface);
    }
}


function sendNewVersionDetected(user_id) {

    initializeUsersNewInterfaceSent()

    let allUsersNewInterface = JSON.parse(localStorage.newInterfaceSent);

    if (allUsersNewInterface.indexOf(user_id) !== -1) {
        return
    }

    if(user_id !== -1) {

        var data = {
            user_id : user_id,
            status : 'New Interface',
            timestamp : (new Date()).getTime(),
        };

        $.ajax({
            type: REQUEST_TYPE,
            url: URLS_SERVER.newInterfaceDetected,
            dataType: "json",
            traditional: true,
            data: JSON.stringify(replaceUserIdEmail(data)),
            tryCount: 0,
            retryLimit: 3,
            success: function (a) {
                if (!a[STATUS] || (a[STATUS] == FAILURE)) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        console.log('Trying again...')
                        $.ajax(this);
                        return;
                    }
                    console.log('Stoping trying...');
                    return true
                }
                else {
                    addUserToNewInterfaceSent(user_id)
                }
                return true
            },

            error: function (xhr, textStatus, errorThrown) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
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