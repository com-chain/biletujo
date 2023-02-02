 'use strict';
  var en = require('./en');
  var fr = require('./fr');
var marked = require('../customMarked');

 var translate = function($translateProvider) {
  
  $translateProvider.translations(en.code, translate.marked(en.data));
  $translateProvider.translations(fr.code, translate.marked(fr.data));
  
  $translateProvider.preferredLanguage('fr');
  $translateProvider.useSanitizeValueStrategy(null);
 }

translate.marked = function(data) {
  var tData = data;
	for (var key in tData) if (tData.hasOwnProperty(key)) tData[key] = marked.marked(tData[key]);
    return tData;
}
module.exports = translate;
