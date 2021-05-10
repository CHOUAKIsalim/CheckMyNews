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
 * Check whether string is a number
 *
 * @param  {string}  value value which is being checked whether it is a number
 * @return {Boolean}       true if number, else false
 */
function isNumeric(value) {
    return /^\d+$/.test(value);
}




/**
 * replace all occurences of pattern to string
 *
 * @param  {stirng} search      string substring to be replaced
 * @param  {string} replacement string substring to be used as a replacement
 * @return {string}             new string
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};



/**
 * return an array with each element appearing only once
 *
 * @return {object} array that contains each element of the initial array only once
 */
Array.prototype.unique = function unique() {
    var self = this;
    return self.filter(function(a) {
        var that = this;
        return !that[a] ? that[a] = true : false;
    },{});}



function uniqueArray(list) {
    let result = [];
    list.forEach(function (element) {
        found = false;
        for(var i=0 ; i < result.length; i++) {
            if(element.isSameNode(result[i])) {
                found = true;
                break;
            }
        }
        if(!found) result.push(element);
    });
    return result;
}


/**
 * extend an array adding the elements of another array. (similar to python extend)
 *
 * @param  {object} other_array array whose elements will be added to the initial array
 * @return
 */
Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);
}


Object.defineProperty(String.prototype, 'hashCode', {
    value: function() {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }
});

