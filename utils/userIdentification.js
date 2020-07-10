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





/**
 * get the user id of the logged in user
 * 
 * @return {string} user id of user that is logged in
 */
function getUserIdNewInterface(doc) {
	let scripts = doc.getElementsByTagName('script');
	for (let i=0;i<scripts.length;i++) {
		if (scripts[i].innerText && scripts[i].innerText.indexOf('"CurrentUserInitialData",[],')!==-1) {
			let idTag = scripts[i].innerText.match(/"USER_ID":"[0-9][0-9]+"/);
			if (!idTag) { 
        		return null
    		}
    		return idTag[0].match(/[0-9]+/)[0]
		}
	}

    return null
}



/**
 * detect Facebook user id in the source code of the user
 *
 * @param  {string} elem source code of the Facebook page
 * @return {string}      user id of user that is logged in
 */
function getUserIdStr(elem) {
    var idTag = elem.match(/"USER_ID":"[0-9][0-9]+"/);
    if (!idTag) { 
        return null
    }
    return idTag[0].match(/[0-9]+/)[0]
}






/**
 * get the user id of the logged in user
 * 
 * @return {string} user id of user that is logged in
 */
function getUserId(doc) {
    doc=!!doc?doc:document;
    facebookInterfaceVersion = getFacebookInterfaceVersionFromParsedDoc(doc);
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.old) {
        return getUserIdStr(doc.head.innerHTML)
    }   
    if (facebookInterfaceVersion=== INTERFACE_VERSIONS.new) {
        return getUserIdNewInterface(doc);
    }

}

