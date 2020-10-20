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




const TYPES = {"frontAd" : "frontAd", "sideAd" : "sideAd", "newsPost": "newsPost", "publicPost" : "publicPost"}; // possible types of ads ad analyst collects
const GRAB_ME = 'grab_me' //if added as a class this ad will be captured by adanalyst
const COLLECTED = 'ad_collected'; //inserted to an ad to signify it was collected
var SPONSORED = ['Sponsored', 'Sponsorisé', 'Commandité', 'Publicidad', 'Gesponsert', 'Χορηγούμενη', 'Patrocinado', 'Plaćeni oglas', 'Sponsorizzata ', 'Sponsorizzato', 'Sponsorizat', '赞助内容', 'مُموَّل', 'प्रायोजित', 'Спонзорисано', 'Реклама', '広告', 'ได้รับการสนับสนุน', 'Sponsorowane']; //English French Spanish German Greek Portuguese(Brazil) Croatian Italian c Romanian Chinse Hindi Serbian Rusian Japannese Thai Polish
var PAID_PARTNERSHIP  = ['paid partnership'];


/**
 * check whether two objects are contain the same elements
 *
 * @param  {object}  value first object
 * @param  {object}  other second object
 * @return {Boolean}       true if both objects contain the same elements, else false 
 */
function isEqual(value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function (item1, item2) {
        // Code will go here...
    };

    // Compare properties
    var match;
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            compare(value[i], other[i]);
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                compare(value[key], other[key]);
            }
        }
    }

    // If nothing failed, return true
    return true;

};


/**
 * return x,y coordinates of a DOM element
 * @param  {object} el DOM element
 * @return {object}    x,y coordinates of el
 */
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}



/**
 * get class name from the sponsored tag by searching at an array of CSS sheets
 * 
 * @param  {array} filteredSheets array of css sheets
 * @return {string}               class name of sponsored tag
 */
function getSponsoredFromClasses(filteredSheets) {
        for (let i=0;i<filteredSheets.length;i++) {
        try {    
        sponsoredClass = findSponsoredClass(filteredSheets[i])
        if (sponsoredClass) {
            return sponsoredClass.slice(1,sponsoredClass.length)
        }
        }
        catch(err) {
            console.log("Exception in getSponsoredFromClasses, " + i);
            console.log(err);
        }
        
    }
    return
    
}







/**
 * create a json object that is derived from URL Get parameters and their values
 * @param  {string} params URL get parameters
 * @return {object}        desired object
 */
var createObjFromURI = function(params) {
    var uri = decodeURI(params);
    var chunks = uri.split('&');
    var params = Object();

    for (var i=0; i < chunks.length ; i++) {
        var chunk = chunks[i].split('=');
        if(chunk[0].search("\\[\\]") !== -1) {
            if( typeof params[chunk[0]] === 'undefined' ) {
                params[chunk[0]] = decodeURIComponent([chunk[1]]);

            } else {
                params[chunk[0]].push(decodeURIComponent(chunk[1]));
            }


        } else {
            params[chunk[0]] = decodeURIComponent(chunk[1]);
        }
    }

    return params;
}

