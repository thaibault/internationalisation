// Generated by CoffeeScript 1.6.3
/*!
    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This plugin provided client side internationalisation support for websites.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    /**
        @memberOf $
        @class
        @extends $.Tools
    */

    var Lang, _ref;
    Lang = (function(_super) {
      __extends(Lang, _super);

      function Lang() {
        _ref = Lang.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /**
          Holds the class name to provide inspection features.
      
          @property {String}
      */


      Lang.prototype.__name__ = 'Lang';

      /**
          @description Initializes the plugin. Current language is set and
                       later needed dom nodes are grabbed.
      
          @param {Object} options An options object.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype.initialize = function(options, currentLanguage, _$domNodeToFade, _numberOfFadedDomNodes, _replacements) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        this.currentLanguage = currentLanguage != null ? currentLanguage : '';
        this._$domNodeToFade = _$domNodeToFade != null ? _$domNodeToFade : null;
        this._numberOfFadedDomNodes = _numberOfFadedDomNodes != null ? _numberOfFadedDomNodes : 0;
        this._replacements = _replacements != null ? _replacements : [];
        /**
            Saves default options for manipulating the Gui's behaviour.
        
            @property {Object}
        */

        this._options = {
          domNodeSelectorPrefix: 'body',
          "default": 'enUS',
          domNodeClassPrefix: '',
          fadeEffect: true,
          textNodeParent: {
            fadeIn: {
              duration: 'normal'
            },
            fadeOut: {
              duration: 'normal'
            }
          },
          replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',
          currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$',
          replacementDomNodeName: '#comment',
          replaceDomNodeNames: ['#text', 'langreplace'],
          toolsLockDescription: '{1}Switch',
          languageHashPrefix: 'lang-',
          currentLanguageIndicatorClassName: 'current',
          cookieDescription: '{1}Last',
          languageMapping: {
            deDE: ['de', 'de-de'],
            enUS: ['en', 'en-us'],
            enEN: ['en-en'],
            frFR: ['fr', 'fr-fr']
          },
          onSwitched: $.noop()
        };
        Lang.__super__.initialize.call(this, options);
        this._options.toolsLockDescription = this.stringFormat(this._options.toolsLockDescription, this.__name__);
        this._options.cookieDescription = this.stringFormat(this._options.cookieDescription, this.__name__);
        this._options.textNodeParent.fadeIn.always = function() {
          _this._numberOfFadedDomNodes += 1;
          if (_this._numberOfFadedDomNodes === _this._$domNodeToFade.length) {
            _this._numberOfFadedDomNodes = 0;
            return _this.releaseLock(_this._options.toolsLockDescription);
          }
        };
        this.$domNodes = this.grabDomNode();
        this.$domNodes.switchLanguageButtons = $("a[href^=\"#" + this._options.languageHashPrefix + "\"]");
        this.currentLanguage = this._options["default"];
        this["switch"](this._determineUsefulLanguage());
        this.on(this.$domNodes.switchLanguageButtons, 'click', function(event) {
          event.preventDefault();
          return _this["switch"]($(event.target).attr('href').substr(_this._options.languageHashPrefix.length + 1));
        });
        return this;
      };

      /**
          @description Switches the current language to given language. This
                       method is mutual synchronized.
      
          @param {String} language New language.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype["switch"] = function(language) {
        var _this = this;
        this.acquireLock(this._options.toolsLockDescription, function() {
          var $currentLanguageDomNode, $currentTextNodeToTranslate, $lastLanguageDomNode, $lastTextNodeToTranslate, self;
          language = _this._normalizeLanguage(language);
          _this.debug('Switch to {1}', language);
          _this._$domNodeToFade = null;
          _this._replacements = [];
          $currentTextNodeToTranslate = null;
          $currentLanguageDomNode = null;
          $lastTextNodeToTranslate = null;
          $lastLanguageDomNode = null;
          self = _this;
          _this.$domNodes.parent.find(':not(iframe)').contents().each(function() {
            var $currentDomNode, $this, match;
            if ($.inArray(this.nodeName.toLowerCase(), self._options.replaceDomNodeNames) !== -1) {
              $this = $(this);
              if ($.trim($this.text()) && $this.parents(self._options.replaceDomNodeNames.join()).length === 0) {
                $lastLanguageDomNode = self._checkLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate, $lastLanguageDomNode);
                $currentTextNodeToTranslate = $this;
              }
            } else {
              $currentDomNode = $(this);
              if ($currentTextNodeToTranslate != null) {
                if (this.nodeName === self._options.replacementDomNodeName) {
                  match = this.textContent.match(new RegExp(self._options.replacementLanguagePattern));
                  if (match && match[1] === language) {
                    self._registerTextNodeToChange($currentTextNodeToTranslate, $currentDomNode, match, $currentLanguageDomNode);
                    $lastTextNodeToTranslate = $currentTextNodeToTranslate;
                    $lastLanguageDomNode = $currentLanguageDomNode;
                    $currentTextNodeToTranslate = null;
                    $currentLanguageDomNode = null;
                  } else {
                    match = this.textContent.match(new RegExp(self._options.currentLanguagePattern));
                    if (match) {
                      $currentLanguageDomNode = $currentDomNode;
                    }
                  }
                  return true;
                }
                $lastTextNodeToTranslate = $currentTextNodeToTranslate;
                $lastLanguageDomNode = $currentLanguageDomNode;
                $currentTextNodeToTranslate = null;
                $currentDomNode = null;
              }
            }
            return true;
          });
          _this._checkLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate, $lastLanguageDomNode);
          return _this._handleSwitchEffect(language);
        });
        return this;
      };

      /**
          @description Normalizes a given language string.
      
          @param {String} language New language.
      
          @returns {String} Returns the normalized version of given language.
      */


      Lang.prototype._normalizeLanguage = function(language) {
        var key, value, _ref1;
        _ref1 = this._options.languageMapping;
        for (key in _ref1) {
          value = _ref1[key];
          if ($.inArray(key.toLowerCase(), value) === -1) {
            value.push(key.toLowerCase());
          }
          if ($.inArray(language.toLowerCase(), value) !== -1) {
            return key.substring(0, 2) + key.substring(2);
          }
        }
        return this._options["default"];
      };

      /**
          @description Determines a useful initial language depending on
                       cookie and browser settings.
      
          @returns {String} Returns the determined language.
      */


      Lang.prototype._determineUsefulLanguage = function() {
        if ($.cookie(this._options.cookieDescription) != null) {
          this.debug('Determine "{1}", because of cookie information.', $.cookie(this._options.cookieDescription));
          return $.cookie(this._options.cookieDescription);
        }
        if (navigator.language != null) {
          $.cookie(this._options.cookieDescription, navigator.language);
          this.debug('Determine "{1}", because of browser settings.', $.cookie(this._options.cookieDescription));
          return navigator.language;
        }
        $.cookie(this._options.cookieDescription, this._options["default"]);
        this.debug('Determine "{1}", because of default option.', $.cookie(this._options.cookieDescription));
        return this._options["default"];
      };

      /**
          @description Depending an activated switching effect this method
                       initialized the effect of replace all text string
                       directly.
      
          @param {String} language New language.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype._handleSwitchEffect = function(language) {
        if (this._options.fadeEffect && (this._$domNodeToFade != null)) {
          this._options.textNodeParent.fadeOut.always = this.getMethod(this._handleLanguageSwitching, this, language);
          this._$domNodeToFade.fadeOut(this._options.textNodeParent.fadeOut);
        } else {
          this._handleLanguageSwitching(this._handleLanguageSwitching, this, language);
        }
        return this;
      };

      /**
          @description Registers a text node to change its content with given
                       replacement.
      
          @param {$} $currentTextNodeToTranslate Text node with content to
                                                 translate.
          @param {$} $currentDomNode A comment node with replacement content.
          @param {String[]} match A matching array of replacement's text
                                  content.
          @param {$|null} $currentLanguageDomNode A potential given text node
                                                  indicating the language of
                                                  given text node.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype._registerTextNodeToChange = function($currentTextNodeToTranslate, $currentDomNode, match, $currentLanguageDomNode) {
        var $parent;
        $parent = $currentTextNodeToTranslate.parent();
        if (this._$domNodeToFade === null) {
          this._$domNodeToFade = $parent;
        } else {
          this._$domNodeToFade = this._$domNodeToFade.add($parent);
        }
        this._replacements.push({
          $textNodeToTranslate: $currentTextNodeToTranslate,
          $commentNodeToReplace: $currentDomNode,
          textToReplace: match[2],
          $parent: $parent,
          $currentLanguageDomNode: $currentLanguageDomNode
        });
        return this;
      };

      /**
          @description Checks if last text has a language indication comment
                       node. This function is called after each parsed dom
                       text node.
      
          @param {$|null} $lastTextNodeToTranslate Last text to node to
                                                   check.
          @param {$|null} $lastLanguageDomNode A potential given language
                                               indication commend node.
      
          @returns {$} Returns the retrieved or newly created language
                       indicating comment node.
      */


      Lang.prototype._checkLastTextNodeHavingLanguageIndicator = function($lastTextNodeToTranslate, $lastLanguageDomNode) {
        if (($lastTextNodeToTranslate != null) && ($lastLanguageDomNode == null)) {
          $lastLanguageDomNode = $("<!--" + this.currentLanguage + "-->");
          $lastTextNodeToTranslate.after($lastLanguageDomNode);
        }
        return $lastLanguageDomNode;
      };

      /**
          @description Initialized the language switch an performs an effect
                       if specified.
      
          @param {Function} theFunction The function itself.
          @param {$.Lang} self The current instance.
          @param {String} language The new language to switch to.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype._handleLanguageSwitching = function(thisFunction, self, language) {
        this._numberOfFadedDomNodes += 1;
        if (this._options.fadeEffect && (this._$domNodeToFade != null)) {
          if (this._numberOfFadedDomNodes === this._$domNodeToFade.length) {
            this._switchLanguage(language);
            this._numberOfFadedDomNodes = 0;
            this._$domNodeToFade.fadeIn(this._options.textNodeParent.fadeIn);
          }
        } else {
          this._switchLanguage(language);
          this._numberOfFadedDomNodes = 0;
          this.releaseLock(this._options.toolsLockDescription);
        }
        return this;
      };

      /**
          @description Performs the low level text replacements for switching
                       to given language.
      
          @param {String} language The new language to switch to.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype._switchLanguage = function(language) {
        var currentDomNodeFound, currentText, replacement, _i, _len, _ref1;
        _ref1 = this._replacements;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          replacement = _ref1[_i];
          if (replacement.$currentLanguageDomNode == null) {
            currentDomNodeFound = false;
            replacement.$textNodeToTranslate.parent().contents().each(function() {
              if (currentDomNodeFound) {
                replacement.$currentLanguageDomNode = $(this);
                return false;
              }
              if (this === replacement.$textNodeToTranslate[0]) {
                currentDomNodeFound = true;
              }
              return true;
            });
          }
          currentText = replacement.$textNodeToTranslate.html();
          if (replacement.$textNodeToTranslate[0].nodeName === '#text') {
            currentText = replacement.$textNodeToTranslate[0].textContent;
          }
          replacement.$textNodeToTranslate.after($("<!--" + ("" + replacement.$currentLanguageDomNode[0].textContent + ":") + ("" + currentText + "-->"))).after($("<!--" + language + "-->"));
          if (replacement.$textNodeToTranslate[0].nodeName === '#text') {
            replacement.$textNodeToTranslate[0].textContent = replacement.textToReplace;
          } else {
            replacement.$textNodeToTranslate.html(replacement.textToReplace);
          }
          replacement.$currentLanguageDomNode.remove();
          replacement.$commentNodeToReplace.remove();
        }
        this._switchCurrentLanguageIndicator(language);
        $.cookie(this._options.cookieDescription, language);
        this.fireEvent('switched', true, this, this.currentLanguage, language);
        this.currentLanguage = language;
        return this;
      };

      /**
          @description Switches the current language indicator in language
                       triggered dom nodes.
      
          @param {String} language The new language to switch to.
      
          @returns {$.Lang} Returns the current instance.
      */


      Lang.prototype._switchCurrentLanguageIndicator = function(language) {
        $(("a[href=\"#" + this._options.languageHashPrefix) + ("" + this.currentLanguage + "\"].") + this._options.currentLanguageIndicatorClassName).removeClass(this._options.currentLanguageIndicatorClassName);
        $("a[href=\"#" + this._options.languageHashPrefix + language + "\"]").addClass(this._options.currentLanguageIndicatorClassName);
        return this;
      };

      return Lang;

    })($.Tools["class"]);
    /** @ignore*/

    $.Lang = function() {
      return $.Tools().controller(Lang, arguments);
    };
    /** @ignore*/

    return $.Lang["class"] = Lang;
  })(this.jQuery);

}).call(this);
