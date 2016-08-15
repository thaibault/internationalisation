'use strict';
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require('jQuery-tools'), require('jquery'));
	else if(typeof define === 'function' && define.amd)
		define("jQuery-lang", ['jQuery-tools', 'jquery'], factory);
	else if(typeof exports === 'object')
		exports["jQuery-lang"] = factory(require('jQuery-tools'), require('jquery'));
	else
		root['jQueryLang'] = factory(root["$.Tools"], root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {// #!/usr/bin/env node
	// -*- coding: utf-8 -*-
	/** @module jQuery-lang */'use strict'; /* !
	    region header
	    [Project page](http://torben.website/jQuery-lang)

	    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

	    License
	    -------

	    This library written by Torben Sickert stand under a creative commons
	    naming 3.0 unported license.
	    See http://creativecommons.org/licenses/by/3.0/deed.de
	    endregion
	*/ // region imports
	exports.__esModule=true;var _jquery=__webpack_require__(4);var _jquery2=_interopRequireDefault(_jquery);__webpack_require__(3);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;} // endregion
	/* eslint-disable no-duplicate-imports */ /* eslint-enable no-duplicate-imports */ // endregion
	// region types
	var context=function(){if(typeof window==='undefined'){if(typeof global==='undefined')return  false?{}:module;return global;}return window;}();if(!('document' in context)&&'context' in _jquery2.default)context.document=_jquery2.default.context; // region plugins/classes
	/**
	 * This plugin holds all needed methods to extend a website for
	 * internationalisation.
	 * @extends jQuery-tools:Tools
	 * @property static:_name - Defines this class name to allow retrieving them
	 * after name mangling.
	 * @property _options - Options extended by the options given to the
	 * initializer method.
	 * @property _options.domNodeSelectorPrefix {string} - Selector prefix for all
	 * nodes to take into account.
	 * @property _options.default {string} - Initial language to use.
	 * @property _options.allowedLanguages {Array.<string>} - List of all supported
	 * languages.
	 * @property _options.initial {string} - Initial set language (if omitted it
	 * will be guest.
	 * @property _options.templateDelimiter {Object.<string, string>} - Template
	 * delimiter to recognize dynamic content.
	 * @property _options.templateDelimiter.pre {string} - Delimiter which
	 * introduces a dynamic expression.
	 * @property _options.templateDelimiter.post {string} - Delimiter which
	 * finishes a dynamic expression.
	 * @property _options.fadeEffect {boolean} - Indicates weather a fade effect
	 * should be performed.
	 * @property _options.textNodeParent {Object.<string, Object>} - Saves
	 * informations how parent dom nodes should be animated when containing text
	 * will be switched.
	 * @property _options.textNodeParent.showAnimation {Object} - Fade in options
	 * when a new text should appear.
	 * @property _options.textNodeParent.hideAnimation {Object} - Fade out effect
	 * options when a text node should be removed before switching them.
	 * @property _options.preReplacementLanguagePattern {string} - Pattern to
	 * introduce a pre replacement language node.
	 * @property _options.replacementLanguagePattern {string} - Text pattern to
	 * introduce a post replacement node.
	 * @property _options.currentLanguagePattern {string} - Saves a pattern to
	 * recognize current language marker.
	 * @property _options.replacementDomNodeName {Array.<string>} - Dom node tag
	 * name which should be interpreted as a hidden alternate language node
	 * (contains text in another language).
	 * @property _options.replaceDomNodeNames {Array.<string>} - Tag names which
	 * indicates dom nodes which should be replaced.
	 * @property _options.toolsLockDescription {string} - Lock description for the
	 * locking mechanism provided by the extended tools class.
	 * @property _options.languageHashPrefix {string} - Hash prefix to determine
	 * current active language by url.
	 * @property _options.currentLanguageIndicatorClassName {string} - Class name
	 * which marks current language switcher button or link.
	 * @property _options.sessionDescription {string} - Name to use for saving
	 * preferred language in local storage for current session.
	 * @property _options.languageMapping {Object.<string, Array.<string>>} - A
	 * mapping of alternate language descriptions.
	 * @property _options.onSwitched {Function} - Callback which will be triggered
	 * after a language switch has been finished.
	 * @property _options.onEnsured {Function} - Callback which will be triggered
	 * after a language check has been performed. Needed if some nodes have another
	 * language active then others. Useful if only some parts of the dom tree was
	 * updated and a full language update isn't required.
	 * @property _options.onSwitch {Function} - Callback which should be called
	 * before a language switch should be performed.
	 * @property _options.onEnsure {Function} - Callback which should be called
	 * before a language switch should be ensured.
	 * @property _options.domNode {Object.<string, string>} - A mapping of needed
	 * internal dom node descriptions to their corresponding selectors.
	 * @property currentLanguage - Saves the current language.
	 * @property knowntranslations - Saves a mapping of known language strings and
	 * their corresponding translations, to boost language replacements or saves
	 * redundant replacements in dom tree.
	 * @property _$domNodeToFade - Saves all $-extended dom nodes which should be
	 * animated.
	 * @property _replacements - Saves all text nodes which should be replaced.
	 * @property _textNodesWithKnownTranslation - Saves a mapping of known text
	 * snippets to their corresponding $-extended dom nodes.
	 */var Lang=function(_$$Tools$class){_inherits(Lang,_$$Tools$class);function Lang(){_classCallCheck(this,Lang);return _possibleConstructorReturn(this,_$$Tools$class.apply(this,arguments));} // endregion
	// region public methods
	// / region special
	/* eslint-disable jsdoc/require-description-complete-sentence */ /**
	     * Initializes the plugin. Current language is set and later needed dom
	     * nodes are grabbed.
	     * @param options - An options object.
	     * @param currentLanguage - Initial language to use.
	     * @param knownTranslation - Initial mapping of known language strings and
	     * their corresponding translations, to boost language replacements or
	     * saves redundant replacements in dom tree.
	     * @param $domNodeToFade - Initial dom node to fade.
	     * @param replacements - Initial nodes to replace.
	     * @param textNodesWithKnownTranslation - Saves a mapping of known text
	     * snippets to their corresponding $-extended dom nodes.
	     * @returns Returns the current instance wrapped in a promise.
	     */ // region static properties
	Lang.prototype.initialize=function initialize(){var options=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];var currentLanguage=arguments.length<=1||arguments[1]===undefined?'':arguments[1];var knownTranslation=arguments.length<=2||arguments[2]===undefined?{}:arguments[2];var $domNodeToFade=arguments.length<=3||arguments[3]===undefined?null:arguments[3];var _this2=this;var replacements=arguments.length<=4||arguments[4]===undefined?[]:arguments[4];var textNodesWithKnownTranslation=arguments.length<=5||arguments[5]===undefined?{}:arguments[5]; /* eslint-enable jsdoc/require-description-complete-sentence */this.currentLanguage=currentLanguage;this.knownTranslation=knownTranslation;this._$domNodeToFade=$domNodeToFade;this._replacements=replacements;this._textNodesWithKnownTranslation=textNodesWithKnownTranslation;this._options={domNodeSelectorPrefix:'body',default:'enUS',allowedLanguages:[],initial:null,templateDelimiter:{pre:'{{',post:'}}'},fadeEffect:true,textNodeParent:{showAnimation:[{opacity:1},{duration:'fast'}],hideAnimation:[{opacity:0},{duration:'fast'}]},preReplacementLanguagePattern:'^\\|({1})$',replacementLanguagePattern:'^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',currentLanguagePattern:'^[a-z]{2}[A-Z]{2}$',replacementDomNodeName:['#comment','langreplacement'],replaceDomNodeNames:['#text','langreplace'],toolsLockDescription:'{1}Switch',languageHashPrefix:'lang-',currentLanguageIndicatorClassName:'current',sessionDescription:'{1}',languageMapping:{deDE:['de','de_de','de-de','german','deutsch'],enUS:['en','en_us','en-us'],enEN:['en_en','en-en','english'],frFR:['fr','fr_fr','fr-fr','french']},onSwitched:_jquery2.default.noop(),onEnsured:_jquery2.default.noop(),onSwitch:_jquery2.default.noop(),onEnsure:_jquery2.default.noop(),domNode:{knownTranslation:'div.toc'}};_$$Tools$class.prototype.initialize.call(this,options);this._options.preReplacementLanguagePattern=this.constructor.stringFormat(this._options.preReplacementLanguagePattern,this._options.replacementLanguagePattern.substr(1,this._options.replacementLanguagePattern.length-2));this._options.toolsLockDescription=this.constructor.stringFormat(this._options.toolsLockDescription,this.constructor._name);this._options.sessionDescription=this.constructor.stringFormat(this._options.sessionDescription,this.constructor._name);this.$domNodes=this.grabDomNode(this._options.domNode);this.$domNodes.switchLanguageButtons=(0,_jquery2.default)('a[href^="#'+this._options.languageHashPrefix+'"]');this._movePreReplacementNodes();this.currentLanguage=this._normalizeLanguage(this._options.default); /*
	            NOTE: Only switch current language indicator if we haven't an
	            initial language switch which will perform the indicator switch.
	        */var newLanguage=this._determineUsefulLanguage();this.on(this.$domNodes.switchLanguageButtons,'click',function(event){event.preventDefault();return _this2.switch((0,_jquery2.default)(event.target).attr('href').substr(_this2._options.languageHashPrefix.length+1));});if(this.currentLanguage===newLanguage)return _jquery2.default.when(this._switchCurrentLanguageIndicator(newLanguage));return this.switch(newLanguage,true);}; // / endregion
	/**
	     * Switches the current language to given language. This method is mutual
	     * synchronized.
	     * @param language - New language as string or "true". If set to "true" it
	     * indicates that the dom tree should be checked again current language to
	     * ensure every text node has right content.
	     * @param ensure - Indicates if a switch effect should be avoided.
	     * @returns Returns the current instance wrapped in a promise.
	     */ // endregion
	// region dynamic properties
	Lang.prototype.switch=function _switch(language){var _this3=this;var ensure=arguments.length<=1||arguments[1]===undefined?false:arguments[1];if(language!==true&&this._options.allowedLanguages.length&&!this._options.allowedLanguages.includes(language)){this.debug('"{1}" isn\'t one of the allowed languages.',language);return _jquery2.default.when(this);}var deferred=_jquery2.default.Deferred();this.acquireLock(this._options.toolsLockDescription,function(){if(language===true){ensure=true;language=_this3.currentLanguage;}else language=_this3._normalizeLanguage(language);if(ensure&&language!==_this3._options.default||_this3.currentLanguage!==language){var actionDescription='Switch to';if(ensure)actionDescription='Ensure';_this3.debug('{1} "{2}".',actionDescription,language);_this3._switchCurrentLanguageIndicator(language);_this3.fireEvent(ensure?'ensure':'switch',true,_this3,_this3.currentLanguage,language);_this3._$domNodeToFade=null;_this3._replacements=[];var _collectTextNodesToRe=_this3._collectTextNodesToReplace(language,ensure);var $lastTextNodeToTranslate=_collectTextNodesToRe[0];var $lastLanguageDomNode=_collectTextNodesToRe[1];_this3._ensureLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate,$lastLanguageDomNode,ensure);_this3._handleSwitchEffect(language,ensure).then(function(){return deferred.resolve(_this3);});}else {_this3.debug('"{1}" is already current selected language.',language);_this3.releaseLock(_this3._options.toolsLockDescription);deferred.resolve(_this3);}});return deferred;}; /**
	     * Ensures current selected language.
	     * @returns Returns the current instance wrapped in a promise.
	     */Lang.prototype.refresh=function refresh(){return this._movePreReplacementNodes().switch(true);}; // / endregion
	// region protected methods
	/**
	     * Moves pre replacement dom nodes into next dom node behind translation
	     * text to use the same translation algorithm for both.
	     * @returns Returns the current instance.
	     */Lang.prototype._movePreReplacementNodes=function _movePreReplacementNodes(){var self=this;this.$domNodes.parent.find(':not(iframe)').contents().each(function(){var $this=(0,_jquery2.default)(this);var nodeName=$this.prop('nodeName').toLowerCase();if(self._options.replacementDomNodeName.includes(nodeName)){if(!['#comment','#text'].includes(nodeName)) // NOTE: Hide replacement dom nodes.
	$this.hide();var regularExpression=new RegExp(self._options.preReplacementLanguagePattern);var match=$this.prop('textContent').match(regularExpression);if(match&&match[0]){(function(){$this.prop('textContent',$this.prop('textContent').replace(regularExpression,match[1]));var selfFound=false;$this.parent().contents().each(function(){if(selfFound&&(0,_jquery2.default)(this).Tools('getText').trim()){$this.appendTo(this);return false;}if($this[0]===this)selfFound=true;});})();}}});return this;}; /**
	     * Collects all text nodes which should be replaced later.
	     * @param language - New language to use.
	     * @param ensure - Indicates if the whole dom should be checked again
	     * current language to ensure every text node has right content.
	     * @returns Return a tuple of last text and language dom node to translate.
	     */Lang.prototype._collectTextNodesToReplace=function _collectTextNodesToReplace(language,ensure){var $currentTextNodeToTranslate=null;var $currentLanguageDomNode=null;var $lastTextNodeToTranslate=null;var $lastLanguageDomNode=null;this.knownTranslation={};var self=this;this.$domNodes.parent.find(':not(iframe)').contents().each(function(){var $currentDomNode=(0,_jquery2.default)(this);var nodeName=$currentDomNode.prop('nodeName').toLowerCase();if(self._options.replaceDomNodeNames.includes(nodeName.toLowerCase())){ // NOTE: We skip empty and nested text nodes
	if($currentDomNode.Tools('getText').trim()&&$currentDomNode.parents(self._options.replaceDomNodeNames.join()).length===0){$lastLanguageDomNode=self._ensureLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate,$lastLanguageDomNode,ensure);$currentTextNodeToTranslate=$currentDomNode;}}else if($currentTextNodeToTranslate){if(self._options.replacementDomNodeName.includes(nodeName)){var content=$currentDomNode.prop('textContent');if(nodeName!=='#comment')content=$currentDomNode.html();var match=content.match(new RegExp(self._options.replacementLanguagePattern));if(Array.isArray(match)&&match[1]===language){ // Save known text translations.
	self.knownTranslation[$currentTextNodeToTranslate.Tools('getText').trim()]=match[2].trim();self._registerTextNodeToChange($currentTextNodeToTranslate,$currentDomNode,match,$currentLanguageDomNode);$lastTextNodeToTranslate=$currentTextNodeToTranslate;$lastLanguageDomNode=$currentLanguageDomNode;$currentTextNodeToTranslate=null;$currentLanguageDomNode=null;}else if($currentDomNode.prop('textContent').match(new RegExp(self._options.currentLanguagePattern)))$currentLanguageDomNode=$currentDomNode;return true;}$lastTextNodeToTranslate=null;$lastLanguageDomNode=null;$currentTextNodeToTranslate=null;$currentLanguageDomNode=null;}});this._registerKnownTextNodes();return [$lastTextNodeToTranslate,$lastLanguageDomNode];}; /**
	     * Iterates all text nodes in language known area with known translations.
	     * @returns Returns the current instance.
	     */Lang.prototype._registerKnownTextNodes=function _registerKnownTextNodes(){this._textNodesWithKnownTranslation={};var self=this;this.$domNodes.knownTranslation.find(':not(iframe)').contents().each(function(){var $currentDomNode=(0,_jquery2.default)(this); // NOTE: We skip empty and nested text nodes.
	if(!self._options.replaceDomNodeNames.includes($currentDomNode.prop('nodeName').toLowerCase())&&$currentDomNode.Tools('getText').trim()&&$currentDomNode.parents(self._options.replaceDomNodeNames.join()).length===0&&self.knownTranslation.hasOwnProperty($currentDomNode.Tools('getText').trim())){self._addTextNodeToFade($currentDomNode);if(self._textNodesWithKnownTranslation.hasOwnProperty(self.knownTranslation[$currentDomNode.prop('textContent').trim()]))self._textNodesWithKnownTranslation[self.knownTranslation[$currentDomNode.prop('textContent').trim()]]=self._textNodesWithKnownTranslation[self.knownTranslation[$currentDomNode.prop('textContent').trim()]].add($currentDomNode);else self._textNodesWithKnownTranslation[self.knownTranslation[$currentDomNode.prop('textContent').trim()]]=$currentDomNode;}});return this;}; /**
	     * Normalizes a given language string.
	     * @param language - New language to use.
	     * @returns Returns the normalized version of given language.
	     */Lang.prototype._normalizeLanguage=function _normalizeLanguage(language){for(var otherLanguage in this._options.languageMapping){if(this._options.languageMapping.hasOwnProperty(otherLanguage)){if(!this._options.languageMapping[otherLanguage].includes(otherLanguage.toLowerCase()))this._options.languageMapping[otherLanguage].push(otherLanguage.toLowerCase());if(this._options.languageMapping[otherLanguage].includes(language.toLowerCase()))return otherLanguage;}}return this._options.default;}; /**
	     * Determines a useful initial language depending on session and browser
	     * settings.
	     * @returns Returns the determined language.
	     */Lang.prototype._determineUsefulLanguage=function _determineUsefulLanguage(){var result=void 0;if(this._options.initial)result=this._options.initial;else if('localStorage' in context&&context.localStorage.getItem(this._options.sessionDescription)){result=context.localStorage.getItem(this._options.sessionDescription);this.debug('Determine "{1}", because of local storage information.',result);}else if('navigator' in context&&navigator.language){result=navigator.language;this.debug('Determine "{1}", because of browser settings.',result);}else {result=this._options.default;this.debug('Determine "{1}", because of default option.',result);}result=this._normalizeLanguage(result);if(this._options.allowedLanguages.length&&!this._options.allowedLanguages.includes(result)){this.debug('"{1}" isn\'t one of the allowed languages. Set language'+' to "{2}".',result,this._options.allowedLanguages[0]);result=this._options.allowedLanguages[0];}if('localStorage' in context)context.localStorage.setItem(this._options.sessionDescription,result);return result;}; /**
	     * Depending an activated switching effect this method initialized the
	     * effect of replace all text string directly.
	     * @param language - New language to use.
	     * @param ensure - Indicates if current language should be ensured again
	     * every text node content.
	     * @returns Returns the current instance wrapped in a promise.
	     */Lang.prototype._handleSwitchEffect=function _handleSwitchEffect(language,ensure){var _this4=this;var oldLanguage=this.currentLanguage;if(!ensure&&this._options.fadeEffect&&this._$domNodeToFade)return this._$domNodeToFade.animate.apply(this._$domNodeToFade,this._options.textNodeParent.hideAnimation).promise().then(function(){_this4._switchLanguage(language);if(_this4._$domNodeToFade)return _this4._$domNodeToFade.animate.apply(_this4._$domNodeToFade,_this4._options.textNodeParent.showAnimation).promise().then(function(){_this4.fireEvent(ensure?'ensured':'switched',true,_this4,oldLanguage,language);_this4.releaseLock(_this4._options.toolsLockDescription);return _jquery2.default.when(_this4);});return _jquery2.default.when(_this4);});this._switchLanguage(language);this.fireEvent(ensure?'ensured':'switched',true,this,oldLanguage,language);this.releaseLock(this._options.toolsLockDescription);return _jquery2.default.when(this);}; /**
	     * Registers a text node to change its content with given replacement.
	     * @param $textNode - Text node with content to translate.
	     * @returns Returns the current instance.
	     */Lang.prototype._addTextNodeToFade=function _addTextNodeToFade($textNode){var $parent=$textNode.parent();if(this._$domNodeToFade)this._$domNodeToFade=this._$domNodeToFade.add($parent);else this._$domNodeToFade=$parent;return this;}; /**
	     * Registers a text node to change its content with given replacement.
	     * @param $currentTextNodeToTranslate - Text node with content to
	     * translate.
	     * @param $currentDomNode - A comment node with replacement content.
	     * @param match - A matching array of replacement's text content.
	     * @param $currentLanguageDomNode - A potential given text node indicating
	     * the language of given text node.
	     * @returns Returns the current instance.
	     */Lang.prototype._registerTextNodeToChange=function _registerTextNodeToChange($currentTextNodeToTranslate,$currentDomNode,match,$currentLanguageDomNode){this._addTextNodeToFade($currentTextNodeToTranslate);if($currentDomNode)this._replacements.push({$textNodeToTranslate:$currentTextNodeToTranslate,$nodeToReplace:$currentDomNode,textToReplace:match[2],$currentLanguageDomNode:$currentLanguageDomNode});return this;}; /**
	     * Checks if last text has a language indication comment node. This
	     * function is called after each parsed dom text node.
	     * @param $lastTextNodeToTranslate - Last text to node to check.
	     * @param $lastLanguageDomNode - A potential given language indication
	     * commend node.
	     * @param ensure - Indicates if current language should be ensured again
	     * every text node content.
	     * @returns Returns the retrieved or newly created language indicating
	     * comment node.
	     */Lang.prototype._ensureLastTextNodeHavingLanguageIndicator=function _ensureLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate,$lastLanguageDomNode,ensure){if($lastTextNodeToTranslate&&!$lastLanguageDomNode){ /*
	                Last text node doesn't have a current language indicating dom
	                node.
	            */var currentLocalLanguage=this.currentLanguage;if(ensure)currentLocalLanguage=this._options.default;$lastLanguageDomNode=(0,_jquery2.default)('<!--'+currentLocalLanguage+'-->');$lastTextNodeToTranslate.after($lastLanguageDomNode);}return $lastLanguageDomNode;}; /**
	     * Performs the low level text replacements for switching to given
	     * language.
	     * @param language - The new language to switch to.
	     * @returns Returns the current instance.
	     */Lang.prototype._switchLanguage=function _switchLanguage(language){var _this5=this;var _loop=function _loop(){if(_isArray){if(_i>=_iterator.length)return 'break';_ref=_iterator[_i++];}else {_i=_iterator.next();if(_i.done)return 'break';_ref=_i.value;}var replacement=_ref;var currentText=replacement.$textNodeToTranslate.html();if(replacement.$textNodeToTranslate.prop('nodeName')==='#text')currentText=replacement.$textNodeToTranslate.prop('textContent');var trimmedText=currentText.trim();if(!_this5._options.templateDelimiter||!trimmedText.endsWith(_this5._options.templateDelimiter.post)&&_this5._options.templateDelimiter.post){ // IgnoreTypeCheck
	var _$currentLanguageDomNode=replacement.$currentLanguageDomNode;if(!replacement.$currentLanguageDomNode){(function(){ /*
	                        Language note wasn't present initially. So we have to
	                        determine it now.
	                    */_$currentLanguageDomNode=(0,_jquery2.default)('body');var currentDomNodeFound=false;replacement.$textNodeToTranslate.parent().contents().each(function(){if(currentDomNodeFound){replacement.$currentLanguageDomNode=_$currentLanguageDomNode=(0,_jquery2.default)(this);return false;}if(this===replacement.$textNodeToTranslate[0])currentDomNodeFound=true;});})();}var currentLanguage=_$currentLanguageDomNode.prop('textContent');if(language===currentLanguage)_this5.warn('Text node "'+replacement.textToReplace+'" is marked '+('as "'+currentLanguage+'" and has same translation ')+'language as it already is.');var nodeName=replacement.$nodeToReplace.prop('nodeName').toLowerCase();if(nodeName==='#comment')replacement.$textNodeToTranslate.after((0,_jquery2.default)('<!--'+currentLanguage+':'+currentText+'-->'));else replacement.$textNodeToTranslate.after((0,_jquery2.default)('<'+nodeName+'>'+currentLanguage+':'+currentText+'</'+(nodeName+'>')).hide());replacement.$textNodeToTranslate.after((0,_jquery2.default)('<!--'+language+'-->'));if(replacement.$textNodeToTranslate.prop('nodeName')==='#text')replacement.$textNodeToTranslate.prop('textContent',replacement.textToReplace);else replacement.$textNodeToTranslate.html(replacement.textToReplace);_$currentLanguageDomNode.remove();replacement.$nodeToReplace.remove();}};for(var _iterator=this._replacements,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;){var _ref;var _ret2=_loop();if(_ret2==='break')break;} // Translate registered known text nodes.
	_jquery2.default.each(this._textNodesWithKnownTranslation,function(content,$domNode){return $domNode.prop('textContent',content);});if('localStorage' in context)context.localStorage.setItem(this._options.sessionDescription,language);this.currentLanguage=language;return this;}; /**
	     * Switches the current language indicator in language switch triggered dom
	     * nodes.
	     * @param language - The new language to switch to.
	     * @returns Returns the current instance.
	     */Lang.prototype._switchCurrentLanguageIndicator=function _switchCurrentLanguageIndicator(language){(0,_jquery2.default)('a[href="#'+this._options.languageHashPrefix+(this.currentLanguage+'"].')+this._options.currentLanguageIndicatorClassName).removeClass(this._options.currentLanguageIndicatorClassName);(0,_jquery2.default)('a[href="#'+this._options.languageHashPrefix+language+'"]').addClass(this._options.currentLanguageIndicatorClassName);return this;}; // endregion
	return Lang;}(_jquery2.default.Tools.class); // endregion
	Lang._name='Lang';_jquery2.default.Lang=function(){return _jquery2.default.Tools().controller(Lang,arguments);};_jquery2.default.Lang.class=Lang; /** jQuery extended with jQuery-lang plugin. */exports.default=_jquery2.default; // region vim modline
	// vim: set tabstop=4 shiftwidth=4 expandtab:
	// vim: foldmethod=marker foldmarker=region,endregion:
	// endregion
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});
;