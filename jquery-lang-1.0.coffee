#!/usr/bin/env require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

# Copyright Torben Sickert 16.12.2012

# License
#    This library written by Torben Sickert stand under a creative commons
#    naming 3.0 unported license.
#    see http://creativecommons.org/licenses/by/3.0/deed.de

###!
    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This plugin provided client side internationalisation support for websites.
###

## standalone
## do ($=this.jQuery) ->
this.require([['jQuery.Tools', 'jquery-tools-1.0.coffee']], ($) ->
##

# endregion

# region plugins/classes
#
    ###*
        @memberOf $
        @class
        @extends $.Tools
    ###
    class Lang extends $.Tools.class

    # region properties

        currentLanguage: ''
        ###*
            Saves default options for manipulating the Gui's behaviour.

            @property {Object}
        ###
        _options:
            domNodeSelectorPrefix: 'body'
            default: 'enUS'
            domNodeClassPrefix: ''
            fadeEffect: true
            fadeOptions: 'normal'
            replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$'
            currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$'
            replacementDomNodeName: '#comment'
            replaceDomNodeName: '#text'
            toolsLockDescription: '{1}Switch'
            domNodes: {}
        _domNodes: {}
        _domNodesToFade: null
        _numberOfFadedDomNodes: 0
        _replacements: []
        __name__: 'Lang'

    # endregion

    # region public methods

        # region special

        ###*
            @description Initializes the plugin. Current language is set and
                         later needed dom nodes are graped.

            @param {Object} options An options object.

            @returns {$.Tools} Returns the current instance.
        ###
        initialize: (options={}) ->
            super options
            this._options.toolsLockDescription = this.stringFormat(
                this._options.toolsLockDescription, this.__name__)
            this.currentLanguage = this._options.default
            this._domNodes = this.grabDomNodes this._options.domNodes
            this

        # endregion

        ###*
            TODO
        ###
        switch: (language) ->
            this.acquireLock(this._options.toolsLockDescription, =>
                this._domNodesToFade = null
                this._replacements = []
                $currentTextNodeToTranslate = null
                $currentLanguageDomNode = null
                $lastTextNodeToTranslate = null
                $lastLanguageDomNode = null
                self = this
                $(this._options.domNodeSelectorPrefix).find(
                    ':not(iframe)'
                ).contents().each(->
                    if this.nodeName is self._options.replaceDomNodeName
                        # NOTE: We skip empty text nodes.
                        if $.trim $(this).text()
                            $lastLanguageDomNode = \
                            self._checkLastTextNodeHavingLanguageIndicator(
                                $lastTextNodeToTranslate, $lastLanguageDomNode)
                            $currentTextNodeToTranslate = $ this
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
                )
                this._checkLastTextNodeHavingLanguageIndicator(
                    $lastTextNodeToTranslate, $lastLanguageDomNode)
                this._handleSwitchEffect language
            )
            this

    # endregion

    # region protected methods

        ###*
            TODO
        ###
        _handleSwitchEffect: (language) ->
            if this._options.fadeEffect and this._domNodesToFade?
                this._domNodesToFade.fadeOut(
                    duration: this._options.fadeOptions
                    always: this.getMethod(
                        this._handleLanguageSwitching, this, language))
            else
                this._handleLanguageSwitching(
                    this._handleLanguageSwitching, this, language)
            this

        ###*
            TODO
        ###
        _registerTextNodeToChange: (
            $currentTextNodeToTranslate, $currentDomNode, match,
            $currentLanguageDomNode
        ) ->
            $parent = $currentTextNodeToTranslate.parent()
            if this._domNodesToFade is null
                this._domNodesToFade = $parent
            else
                this._domNodesToFade = this._domNodesToFade.add $parent
            this._replacements.push(
                $textNodeToTranslate: $currentTextNodeToTranslate
                $commentNodeToReplace: $currentDomNode
                textToReplace: match[2]
                $parent: $parent
                $currentLanguageDomNode: $currentLanguageDomNode)
            this

        ###*
            TODO
        ###
        _checkLastTextNodeHavingLanguageIndicator: (
            $lastTextNodeToTranslate, $lastLanguageDomNode
        ) ->
            if $lastTextNodeToTranslate? and not $lastLanguageDomNode?
                # Last text node doesn't have a current
                # language indicating dom node.
                $lastLanguageDomNode = $ "<!--#{this.currentLanguage}-->"
                $lastTextNodeToTranslate.after $lastLanguageDomNode
            $lastLanguageDomNode

        ###*
            TODO
        ###
        _handleLanguageSwitching: (thisFunction, self, language) ->
            this._numberOfFadedDomNodes += 1
            if this._domNodesToFade?
                if this._numberOfFadedDomNodes is this._domNodesToFade.length
                    this._switchLanguage language
                    this._numberOfFadedDomNodes = 0
                    this._domNodesToFade.fadeIn(
                        duration: this._options.fadeOptions
                        always: =>
                            this._numberOfFadedDomNodes += 1
                            if(this._numberOfFadedDomNodes is
                               this._domNodesToFade.length)
                                this._numberOfFadedDomNodes = 0
                                this.releaseLock(
                                    this._options.toolsLockDescription))
            else
                this._switchLanguage language
                this._numberOfFadedDomNodes = 0
                this.releaseLock this._options.toolsLockDescription
            this

        ###*
            TODO
        ###
        _switchLanguage: (language) ->
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
                replacement.$textNodeToTranslate.after($(
                    "<!--" +
                    "#{replacement.$currentLanguageDomNode[0].textContent}:" +
                    "#{replacement.$textNodeToTranslate[0].textContent}-->"
                )).after($("<!--#{language}-->"))
                replacement.$textNodeToTranslate[0].textContent = \
                    "#{replacement.textToReplace}"
                replacement.$currentLanguageDomNode.remove()
                replacement.$commentNodeToReplace.remove()
            this.currentLanguage = language
            this

    # endregion

    ###* @ignore ###
    $.Lang = ->
        self = new Lang
        self._controller.apply self, arguments

# endregion

## standalone
)
