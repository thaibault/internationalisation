'use strict';
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clientnode"));
	else if(typeof define === 'function' && define.amd)
		define("internationalisation", ["clientnode"], factory);
	else if(typeof exports === 'object')
		exports["internationalisation"] = factory(require("clientnode"));
	else
		root['internationalisation'] = factory(root["clientnode"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {exports.__esModule=!0,exports.$=void 0;var _clientnode=__webpack_require__(3);function _asyncToGenerator(a){return function(){var b=a.apply(this,arguments);return new Promise(function(a,c){function d(e,f){try{var g=b[e](f),h=g.value}catch(a){return void c(a)}return g.done?void a(h):Promise.resolve(h).then(function(a){d('next',a)},function(a){d('throw',a)})}return d('next')})}}try{module.require('source-map-support/register')}catch(a){}const $=exports.$=_clientnode.$;class Language extends $.Tools.class{initialize(a={},b='',c={},d=null,e=[],f={}){var g=this;this.currentLanguage=b,this.knownTranslation=c,this._$domNodeToFade=d,this._replacements=e,this._textNodesWithKnownTranslation=f,this._options={domNodeSelectorPrefix:'body',default:'enUS',selection:[],initial:null,templateDelimiter:{pre:'{{',post:'}}'},fadeEffect:!0,textNodeParent:{showAnimation:[{opacity:1},{duration:'fast'}],hideAnimation:[{opacity:0},{duration:'fast'}]},preReplacementLanguagePattern:'^\\|({1})$',replacementLanguagePattern:'^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',currentLanguagePattern:'^[a-z]{2}[A-Z]{2}$',replacementDomNodeName:['#comment','langreplacement'],replaceDomNodeNames:['#text','langreplace'],toolsLockDescription:'{1}Switch',languageHashPrefix:'language-',currentLanguageIndicatorClassName:'current',sessionDescription:'{1}',languageMapping:{deDE:['de','de_de','de-de','german','deutsch'],enUS:['en','en_us','en-us'],enEN:['en_en','en-en','english'],frFR:['fr','fr_fr','fr-fr','french']},onSwitched:this.constructor.noop,onEnsured:this.constructor.noop,onSwitch:this.constructor.noop,onEnsure:this.constructor.noop,domNode:{knownTranslation:'div.toc'}},super.initialize(a),this._options.preReplacementLanguagePattern=this.constructor.stringFormat(this._options.preReplacementLanguagePattern,this._options.replacementLanguagePattern.substr(1,this._options.replacementLanguagePattern.length-2)),this._options.toolsLockDescription=this.constructor.stringFormat(this._options.toolsLockDescription,this.constructor.name),this._options.sessionDescription=this.constructor.stringFormat(this._options.sessionDescription,this.constructor.name),this.$domNodes=this.grabDomNode(this._options.domNode),this.$domNodes.switchLanguageButtons=$(`a[href^="#${this._options.languageHashPrefix}"]`),this._movePreReplacementNodes(),this.currentLanguage=this._normalizeLanguage(this._options.default);const h=this._determineUsefulLanguage();return this.on(this.$domNodes.switchLanguageButtons,'click',function(a){return a.preventDefault(),g.switch($(a.target).attr('href').substr(g._options.languageHashPrefix.length+1))}),this.currentLanguage===h?$.when(this._switchCurrentLanguageIndicator(h)):this.switch(h,!0)}switch(a,b=!1){var c=this;return!0!==a&&this._options.selection.length&&!this._options.selection.includes(a)?(this.debug('"{1}" isn\'t one of the allowed languages.',a),$.when(this)):this.acquireLock(this._options.toolsLockDescription,function(){if(!0===a?(b=!0,a=c.currentLanguage):a=c._normalizeLanguage(a),b&&a!==c._options.default||c.currentLanguage!==a){let d='Switch to';b&&(d='Ensure'),c.debug('{1} "{2}".',d,a),c._switchCurrentLanguageIndicator(a),c.fireEvent(b?'ensure':'switch',!0,c,c.currentLanguage,a),c._$domNodeToFade=null,c._replacements=[];const[e,f]=c._collectTextNodesToReplace(a,b);return c._ensureLastTextNodeHavingLanguageIndicator(e,f,b),c._handleSwitchEffect(a,b)}return c.debug('"{1}" is already current selected language.',a),c.releaseLock(c._options.toolsLockDescription),$.when(c)})}refresh(){return this._movePreReplacementNodes().switch(!0)}_handleSwitchEffect(a,b){var c=this;return _asyncToGenerator(function*(){const d=c.currentLanguage;return!b&&c._options.fadeEffect&&c._$domNodeToFade?(yield c._$domNodeToFade.animate(...c._options.textNodeParent.hideAnimation).promise(),c._switchLanguage(a),c._$domNodeToFade&&(yield c._$domNodeToFade.animate(...c._options.textNodeParent.showAnimation).promise(),yield c.fireEvent(b?'ensured':'switched',!0,c,d,a),c.releaseLock(c._options.toolsLockDescription)),c):(c._switchLanguage(a),yield c.fireEvent(b?'ensured':'switched',!0,c,d,a),c.releaseLock(c._options.toolsLockDescription),c)})()}_movePreReplacementNodes(){const a=this;return this.$domNodes.parent.find(':not(iframe)').contents().each(function(){const b=$(this),c=b.prop('nodeName').toLowerCase();if(a._options.replacementDomNodeName.includes(c)){['#comment','#text'].includes(c)||b.hide();const d=new RegExp(a._options.preReplacementLanguagePattern),e=b.prop('textContent').match(d);if(e&&e[0]){b.prop('textContent',b.prop('textContent').replace(d,e[1]));let a=!1;b.parent().contents().each(function(){return a&&$(this).Tools('text').trim()?(b.appendTo(this),!1):void(b[0]===this&&(a=!0))})}}}),this}_collectTextNodesToReplace(a,b){let c=null,d=null,e=null,f=null;this.knownTranslation={};const g=this;return this.$domNodes.parent.find(':not(iframe)').contents().each(function(){const h=$(this),i=h.prop('nodeName').toLowerCase();if(g._options.replaceDomNodeNames.includes(i.toLowerCase()))h.Tools('text').trim()&&0===h.parents(g._options.replaceDomNodeNames.join()).length&&(f=g._ensureLastTextNodeHavingLanguageIndicator(e,f,b),c=h);else if(c){if(g._options.replacementDomNodeName.includes(i)){let b=h.prop('textContent');'#comment'!==i&&(b=h.html());const j=b.match(new RegExp(g._options.replacementLanguagePattern));return Array.isArray(j)&&j[1]===a?(g.knownTranslation[c.Tools('text').trim()]=j[2].trim(),g._registerTextNodeToChange(c,h,j,d),e=c,f=d,c=null,d=null):h.prop('textContent').match(new RegExp(g._options.currentLanguagePattern))&&(d=h),!0}e=null,f=null,c=null,d=null}}),this._registerKnownTextNodes(),[e,f]}_registerKnownTextNodes(){this._textNodesWithKnownTranslation={};const a=this;return this.$domNodes.knownTranslation.find(':not(iframe)').contents().each(function(){const b=$(this);!a._options.replaceDomNodeNames.includes(b.prop('nodeName').toLowerCase())&&b.Tools('text').trim()&&0===b.parents(a._options.replaceDomNodeNames.join()).length&&a.knownTranslation.hasOwnProperty(b.Tools('text').trim())&&(a._addTextNodeToFade(b),a._textNodesWithKnownTranslation[a.knownTranslation[b.prop('textContent').trim()]]=a._textNodesWithKnownTranslation.hasOwnProperty(a.knownTranslation[b.prop('textContent').trim()])?a._textNodesWithKnownTranslation[a.knownTranslation[b.prop('textContent').trim()]].add(b):b)}),this}_normalizeLanguage(a){for(const b in this._options.languageMapping)if(this._options.languageMapping.hasOwnProperty(b)&&(this._options.languageMapping[b].includes(b.toLowerCase())||this._options.languageMapping[b].push(b.toLowerCase()),this._options.languageMapping[b].includes(a.toLowerCase())))return b;return this._options.default}_determineUsefulLanguage(){let a;return this._options.initial?a=this._options.initial:'localStorage'in $.global&&$.global.localStorage.getItem(this._options.sessionDescription)?(a=$.global.localStorage.getItem(this._options.sessionDescription),this.debug('Determine "{1}", because of local storage information.',a)):'navigator'in $.global&&$.global.navigator.language?(a=$.global.navigator.language,this.debug('Determine "{1}", because of browser settings.',a)):(a=this._options.default,this.debug('Determine "{1}", because of default option.',a)),a=this._normalizeLanguage(a),this._options.selection.length&&!this._options.selection.includes(a)&&(this.debug('"{1}" isn\'t one of the allowed languages. Set language to "{2}".',a,this._options.selection[0]),a=this._options.selection[0]),'localStorage'in $.global&&$.global.localStorage.setItem(this._options.sessionDescription,a),a}_addTextNodeToFade(a){const b=a.parent();return this._$domNodeToFade=this._$domNodeToFade?this._$domNodeToFade.add(b):b,this}_registerTextNodeToChange(a,b,c,d){return this._addTextNodeToFade(a),b&&this._replacements.push({$textNodeToTranslate:a,$nodeToReplace:b,textToReplace:c[2],$currentLanguageDomNode:d}),this}_ensureLastTextNodeHavingLanguageIndicator(a,b,c){if(a&&!b){let d=this.currentLanguage;c&&(d=this._options.default),b=$(`<!--${d}-->`),a.after(b)}return b}_switchLanguage(a){for(const b of this._replacements){let c=b.$textNodeToTranslate.html();'#text'===b.$textNodeToTranslate.prop('nodeName')&&(c=b.$textNodeToTranslate.prop('textContent'));const d=c.trim();if(!this._options.templateDelimiter||!d.endsWith(this._options.templateDelimiter.post)&&this._options.templateDelimiter.post){let d=b.$currentLanguageDomNode;if(!b.$currentLanguageDomNode){d=$('body');let a=!1;b.$textNodeToTranslate.parent().contents().each(function(){return a?(b.$currentLanguageDomNode=d=$(this),!1):void(this===b.$textNodeToTranslate[0]&&(a=!0))})}const e=d.prop('textContent');a===e&&this.warn(`Text node "${b.textToReplace}" is marked `+`as "${e}" and has same translation `+'language as it already is.');const f=b.$nodeToReplace.prop('nodeName').toLowerCase();'#comment'===f?b.$textNodeToTranslate.after($(`<!--${e}:${c}-->`)):b.$textNodeToTranslate.after($(`<${f}>${e}:${c}</`+`${f}>`).hide()),b.$textNodeToTranslate.after($(`<!--${a}-->`)),'#text'===b.$textNodeToTranslate.prop('nodeName')?b.$textNodeToTranslate.prop('textContent',b.textToReplace):b.$textNodeToTranslate.html(b.textToReplace),d.remove(),b.$nodeToReplace.remove()}}for(const b in this._textNodesWithKnownTranslation)this._textNodesWithKnownTranslation.hasOwnProperty(b)&&this._textNodesWithKnownTranslation[b].prop('textContent',b);return'localStorage'in $.global&&$.global.localStorage.setItem(this._options.sessionDescription,a),this.currentLanguage=a,this}_switchCurrentLanguageIndicator(a){return $(`a[href="#${this._options.languageHashPrefix}`+`${this.currentLanguage}"].`+this._options.currentLanguageIndicatorClassName).removeClass(this._options.currentLanguageIndicatorClassName),$(`a[href="#${this._options.languageHashPrefix}${a}"]`).addClass(this._options.currentLanguageIndicatorClassName),this}}exports.default=Language,Language._name='Language',$.Language=function(...a){return $.Tools().controller(Language,a)},$.Language.class=Language;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});