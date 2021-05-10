//The MIT License
//
//Copyright (c) 2018 Athanasios Andreou, <andreou@eurecom.fr>
//
//Permission is hereby granted, free of charge, 
//to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to 
//deal in the Software without restriction, including 
//without limitation the rights to use, copy, modify, 
//merge, publish, distribute, sublicense, and/or sell 
//copies of the Software, and to permit persons to whom 
//the Software is furnished to do so, 
//subject to the following conditions:
//
//The above copyright notice and this permission notice 
//shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
//IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
//ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.






var CURRENT_USER_ID = -1; //SAVING CURRENT USER ID OF USER THQT IS LOGGED IN
var CURRENT_EMAIL = ''; //SAVING CURRENT EMAIL OF USER THAT IS LOGGED IN
//var CURRENT_PHONE = ''; //SAVING CURRENT PHONE OF USER THAT IS LOGGED IN
const REQUEST_TYPE = 'POST'; //ALL REQUESTS TO SERVER ARE POST REQUESTS
const POPUPHTML = 'ui/popup.html?welcome=true'; //popup page to show once if a user has installed the tool but have not given consent
//const MIN_TIMESTAMP_MESSAGE=1523875976; //users before this timestamp that still have the tool installed but have not given consent are being prompted a message



/**
 * Checks if value is an email by creating an input that is supposed to be an email. 
 * For older browsers it includes a simple test with regex
 * 
 * @param  {string}  value value to check if is email
 * @return {Boolean}       true if it is email else false
 */
function isEmail(value) {
  var input = document.createElement('input');

  input.type = 'email';
  input.required = true;
  input.value = value;

  return typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);
}




/**
 * check if there is a user logged in
 * @return {Boolean} [true if user has logged in else false]
 */
function isCurrentUser() {
	if ((CURRENT_USER_ID===-1) || (CURRENT_USER_ID==="-1") || (CURRENT_USER_ID==="") || (!CURRENT_USER_ID)){
		return false;
	}
	return true;
}


/**
 * empty function that does nothing, apart from printing that a request was successful. Meant to be used for callbacks that we do not want anything to happen
 * @return {} 
 */
function genericRequestSuccess() {
	return;
}


/**
 * empty function that does nothing apart from printing that a request failed. Meant to be used for callbacks that we do not want anything to happen
 * @return {} 
 */
function genericRequestError() {
	console.log("Request failed");
	return;
}



/**
 * spoofs a  header value (like 'Refferer'). 
 * If the header does not exist it adds it, otherwise it modifies it.
 * @param  {object} details    object returned by the listener
 * @param  {string} headerName name of header to be modified (or added)
 * @param  {string} newVal     new  value of header
 * @return {object}            details object modified with the headers
 */
function setHeaderKey(details,headerName,newVal) {
    var gotIt = false;
    for (var n in details.requestHeaders){
        gotIt = details.requestHeaders[n].name.toLowerCase()==headerName.toLowerCase();

        if (gotIt) {
            details.requestHeaders[n].value = newVal;
            return details;
        }

    }

    details.requestHeaders.push({name:headerName,value:newVal});
    return details;


}



/**
 * detects whether the request is initiated by the user or by the extension
 * @param  {object} details details of the request from the listener
 * @return {boolean}        true if request is coming from user
 */
function isUserRequest(details) {

    var initiator = details.initiator;


    if (initiator) {
        return initiator.indexOf(FACEBOOK_URL)!=-1;
    }



    var tabId = details.tabId;

    if ((tabId!=undefined) && (tabId!=-1)) {
        return true;
    }

    return false;
}


/**
 * returns the index that contains a specific element in a list
 * @param  {string} txt element to be found
 * @param  {object} lst list to be searched
 * @return {number}     index of the element in the list
 */
function getIndexFromList(txt,lst) {
    var idx = -1;
    for (let i=0;i<lst.length;i++) {
        idx = txt.indexOf(lst[i]);
        if (idx>=0) {
            return idx;
        }
    }
    return -1
   
}





