(function() {
  'use strict';
  /******************************************************************
    Array
    *******************************************************************/
  Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
      if (this[i][name] == value) {
        return i;
      }
    }
    return -1;
  };

  Array.prototype.removeAt = function(index) {
    var b = this.splice(index, 1);
    return b;
  };
  /******************************************************************
    String
    *******************************************************************/
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function(m, n) {
      if (m == '{{') {
        return '{';
      }
      if (m == '}}') {
        return '}';
      }
      return args[n];
    });
  };

  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };

  String.prototype.getQueryString = function(name) {
    var a = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\?&]' + a + '=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(this);
    if (results === null) return '';
    else return decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  /******************************************************************
    Number
    *******************************************************************/
})();
