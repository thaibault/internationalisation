#!/usr/bin/env require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

###
    This plugin provided client side internationalisation support for websites.

    Copyright
    ---------

    Torben Sickert 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    see http://creativecommons.org/licenses/by/3.0/deed.de

    Extending this module
    ---------------------

    For conventions see require on https://github.com/thaibault/require

    Author
    ------

    t.sickert@gmail.com (Torben Sickert)

    Version
    -------

    1.0 stable
###

## standalone
## do ($=this.jQuery) ->
this.require.scopeIndicator = 'jQuery.Lang'
this.require([
    'jquery-tools-1.0.coffee', ['jQuery.cookie', 'jquery-cookie-1.4.0.js']
], ($) ->
##

# endregion

# region plugins/classes

    class Lang extends $.Tools.class
        ###
            This plugin holds all needed methods to extend a website for
            internationalisation.
        ###

    # region properties

        ###
            **__name__ {String}**
            Holds the class name to provide inspection features.
        ###
        __name__: 'Lang'

    # endregion

    # region public methods

        # region special

        initialize: (
            options={}, @currentLanguage='', @_$domNodeToFade=null,
            @_numberOfFadedDomNodes=0, @_replacements=[]
        ) ->
            ###
                Initializes the plugin. Current language is set and later
                needed dom nodes are grabbed.

                **options {Object}** - An options object.

                **returns {$.Lang}** - Returns the current instance.
            ###
            ###
                **_options {Object}**
                Saves default options for manipulating the Gui's behaviour.
            ###
            this._options =
                domNodeSelectorPrefix: 'body'
                default: 'enUS'
                domNodeClassPrefix: ''
                fadeEffect: true
                textNodeParent:
                    fadeIn: duration: 'normal'
                    fadeOut: duration: 'normal'
                replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$'
                currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$'
                replacementDomNodeName: '#comment'
                replaceDomNodeNames: ['#text', 'langreplace']
                toolsLockDescription: '{1}Switch'
                languageHashPrefix: 'lang-'
                currentLanguageIndicatorClassName: 'current'
                cookieDescription: '{1}Last'
                languageMapping:
                    deDE: ['de', 'de-de']
                    enUS: ['en', 'en-us']
                    enEN: ['en-en']
                    frFR: ['fr', 'fr-fr']
                onSwitched: $.noop()
            super options
            this._options.toolsLockDescription = this.stringFormat(
                this._options.toolsLockDescription, this.__name__)
            this._options.cookieDescription = this.stringFormat(
                this._options.cookieDescription, this.__name__)
            this._options.textNodeParent.fadeIn.always = =>
                this._numberOfFadedDomNodes += 1
                if this._numberOfFadedDomNodes is this._$domNodeToFade.length
                    this._numberOfFadedDomNodes = 0
                    this.releaseLock this._options.toolsLockDescription
            this.$domNodes = this.grabDomNode()
            this.$domNodes.switchLanguageButtons = $(
                "a[href^=\"##{this._options.languageHashPrefix}\"]")
            this.currentLanguage = this._options.default
            this.switch this._determineUsefulLanguage()
            this.on this.$domNodes.switchLanguageButtons, 'click', (event) =>
                event.preventDefault()
                this.switch $(event.target).attr('href').substr(
                    this._options.languageHashPrefix.length + 1)
            this

        # endregion

        switch: (language) ->
            ###
                Switches the current language to given language. This method is
                mutual synchronized.

                **language {String}** - New language.

                **returns {$.Lang}**  - Returns the current instance.
            ###
            this.acquireLock(this._options.toolsLockDescription, =>
                language = this._normalizeLanguage language
                this.debug 'Switch to {1}', language
                this._$domNodeToFade = null
                this._replacements = []
                $currentTextNodeToTranslate = null
                $currentLanguageDomNode = null
                $lastTextNodeToTranslate = null
                $lastLanguageDomNode = null
                self = this
                this.$domNodes.parent.find(':not(iframe)').contents().each ->
                    if $.inArray(
                        this.nodeName.toLowerCase(),
                        self._options.replaceDomNodeNames
                    ) isnt -1
                        $this = $ this
                        # NOTE: We skip empty and nested text nodes
                        if $.trim($this.text()) and $this.parents(
                            self._options.replaceDomNodeNames.join()
                        ).length is 0
                            $lastLanguageDomNode = \
                            self._checkLastTextNodeHavingLanguageIndicator(
                                $lastTextNodeToTranslate, $lastLanguageDomNode)
                            $currentTextNodeToTranslate = $this
                    else
                        $currentDomNode = $ this
                        if $currentTextNodeToTranslate?
                            if(this.nodeName is
                               self._options.replacementDomNodeName)
                                match = this.textContent.match(new RegExp(
                                    self._options.replacementLanguagePattern))
                                if match and match[1] is language
                                    self._registerTextNodeToChange(
                                        $currentTextNodeToTranslate,
                                        $currentDomNode, match,
                                        $currentLanguageDomNode)
                                    $lastTextNodeToTranslate = \
                                        $currentTextNodeToTranslate
                                    $lastLanguageDomNode = \
                                        $currentLanguageDomNode
                                    $currentTextNodeToTranslate = null
                                    $currentLanguageDomNode = null
                                else
                                    match = this.textContent.match(new RegExp(
                                        self._options.currentLanguagePattern))
                                    if match
                                        $currentLanguageDomNode = \
                                            $currentDomNode
                                return true
                            $lastTextNodeToTranslate = \
                                $currentTextNodeToTranslate
                            $lastLanguageDomNode = $currentLanguageDomNode
                            $currentTextNodeToTranslate = null
                            $currentDomNode = null
                    return true
                this._checkLastTextNodeHavingLanguageIndicator(
                    $lastTextNodeToTranslate, $lastLanguageDomNode)
                this._handleSwitchEffect language
            )
            this

    # endregion

    # region protected methods

        _normalizeLanguage: (language) ->
            ###
                Normalizes a given language string.

                **language {String}** - New language.

                *returns {String}**   - Returns the normalized version of given
                                        language.
            ###
            for key, value of this._options.languageMapping
                if $.inArray(key.toLowerCase(), value) is -1
                    value.push key.toLowerCase()
                if $.inArray(language.toLowerCase(), value) isnt -1
                    return key.substring(0, 2) + key.substring 2
            return this._options.default
        _determineUsefulLanguage: ->
            ###
                Determines a useful initial language depending on cookie and
                browser settings.

                **returns {String}** - Returns the determined language.
            ###
            if $.cookie(this._options.cookieDescription)?
                this.debug(
                    'Determine "{1}", because of cookie information.',
                    $.cookie this._options.cookieDescription)
                return $.cookie this._options.cookieDescription
            if navigator.language?
                $.cookie this._options.cookieDescription, navigator.language
                this.debug(
                    'Determine "{1}", because of browser settings.',
                    $.cookie this._options.cookieDescription)
                return navigator.language
            $.cookie this._options.cookieDescription, this._options.default
            this.debug(
                'Determine "{1}", because of default option.',
                $.cookie this._options.cookieDescription)
            this._options.default
        _handleSwitchEffect: (language) ->
            ###
                Depending an activated switching effect this method initialized
                the effect of replace all text string directly.

                **language {String}** - New language.

                **returns {$.Lang}**  - Returns the current instance.
            ###
            if this._options.fadeEffect and this._$domNodeToFade?
                this._options.textNodeParent.fadeOut.always = this.getMethod(
                    this._handleLanguageSwitching, this, language)
                this._$domNodeToFade.fadeOut(
                    this._options.textNodeParent.fadeOut)
            else
                this._handleLanguageSwitching(
                    this._handleLanguageSwitching, this, language)
            this
        _registerTextNodeToChange: (
            $currentTextNodeToTranslate, $currentDomNode, match,
            $currentLanguageDomNode
        ) ->
            ###
                Registers a text node to change its content with given
                replacement.

                **$currentTextNodeToTranslate {$}**  - Text node with content
                                                       to translate.
                **$currentDomNode {$}**              - A comment node with
                                                       replacement content.
                **match {String[]}**                 - A matching array of
                                                       replacement's text
                                                       content.
                **$currentLanguageDomNode {$|null}** - A potential given text
                                                       node indicating the
                                                       language of given text
                                                       node.

                **returns {$.Lang}**                 - Returns the current
                                                       instance.
            ###
            $parent = $currentTextNodeToTranslate.parent()
            if this._$domNodeToFade is null
                this._$domNodeToFade = $parent
            else
                this._$domNodeToFade = this._$domNodeToFade.add $parent
            this._replacements.push(
                $textNodeToTranslate: $currentTextNodeToTranslate
                $commentNodeToReplace: $currentDomNode
                textToReplace: match[2]
                $parent: $parent
                $currentLanguageDomNode: $currentLanguageDomNode)
            this
        _checkLastTextNodeHavingLanguageIndicator: (
            $lastTextNodeToTranslate, $lastLanguageDomNode
        ) ->
            ###
                Checks if last text has a language indication comment node.
                This function is called after each parsed dom text node.

                **$lastTextNodeToTranslate {$|null}** - Last text to node to
                                                        check.
                **$lastLanguageDomNode {$|null}**     - A potential given
                                                        language indication
                                                        commend node.

                **returns {$}**                       - Returns the retrieved
                                                        or newly created
                                                        language indicating
                                                        comment node.
            ###
            if $lastTextNodeToTranslate? and not $lastLanguageDomNode?
                # Last text node doesn't have a current language indicating
                # dom node.
                $lastLanguageDomNode = $ "<!--#{this.currentLanguage}-->"
                $lastTextNodeToTranslate.after $lastLanguageDomNode
            $lastLanguageDomNode
        _handleLanguageSwitching: (thisFunction, self, language) ->
            ###
                Initialized the language switch an performs an effect if
                specified.

                **thisFunction {Function}** - The function itself.
                **self {$.Lang}**           - The current instance.
                **language {String}**       - The new language to switch to.

                **returns {$.Lang}**        - Returns the current instance.
            ###
            this._numberOfFadedDomNodes += 1
            if this._options.fadeEffect and this._$domNodeToFade?
                if this._numberOfFadedDomNodes is this._$domNodeToFade.length
                    this._switchLanguage language
                    this._numberOfFadedDomNodes = 0
                    this._$domNodeToFade.fadeIn(
                        this._options.textNodeParent.fadeIn)
            else
                this._switchLanguage language
                this._numberOfFadedDomNodes = 0
                this.releaseLock this._options.toolsLockDescription
            this
        _switchLanguage: (language) ->
            ###
                Performs the low level text replacements for switching to given
                language.

                **language {String}** - The new language to switch to.

                **returns {$.Lang}**  - Returns the current instance.
            ###
            for replacement in this._replacements
                if not replacement.$currentLanguageDomNode?
                    # Language note wasn't present initially. So we have to
                    # determine it now.
                    currentDomNodeFound = false
                    replacement.$textNodeToTranslate.parent().contents(
                    ).each(->
                        if currentDomNodeFound
                            replacement.$currentLanguageDomNode = $ this
                            return false
                        if this is replacement.$textNodeToTranslate[0]
                            currentDomNodeFound = true
                        true
                    )
                currentText = replacement.$textNodeToTranslate.html()
                if replacement.$textNodeToTranslate[0].nodeName is '#text'
                    currentText =
                        replacement.$textNodeToTranslate[0].textContent
                replacement.$textNodeToTranslate.after($(
                    "<!--" +
                    "#{replacement.$currentLanguageDomNode[0].textContent}:" +
                    "#{currentText}-->"
                )).after($("<!--#{language}-->"))
                if replacement.$textNodeToTranslate[0].nodeName is '#text'
                    replacement.$textNodeToTranslate[0].textContent =
                        replacement.textToReplace
                else
                    replacement.$textNodeToTranslate.html(
                        replacement.textToReplace)
                replacement.$currentLanguageDomNode.remove()
                replacement.$commentNodeToReplace.remove()
            this._switchCurrentLanguageIndicator language
            $.cookie this._options.cookieDescription, language
            this.fireEvent(
                'switched', true, this, this.currentLanguage, language)
            this.currentLanguage = language
            this
        _switchCurrentLanguageIndicator: (language) ->
            ###
                Switches the current language indicator in language triggered
                dom nodes.

                **language {String}** - The new language to switch to.

                **returns {$.Lang}**  - Returns the current instance.
            ###
            $(
                "a[href=\"##{this._options.languageHashPrefix}" +
                "#{this.currentLanguage}\"]." +
                this._options.currentLanguageIndicatorClassName
            ).removeClass this._options.currentLanguageIndicatorClassName
            $(
                "a[href=\"##{this._options.languageHashPrefix}#{language}\"]"
            ).addClass this._options.currentLanguageIndicatorClassName
            this

    # endregion

    # region handle $ extending

    $.Lang = -> $.Tools().controller Lang, arguments
    $.Lang.class = Lang

    # endregion

# endregion

## standalone
)
