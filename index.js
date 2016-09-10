// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module internationalisation */
'use strict'
/* !
    region header
    [Project page](http://torben.website/language)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {$ as binding} from 'clientnode'
/* eslint-disable no-duplicate-imports */
import type {$Deferred, $DomNode} from 'clientnode'
/* eslint-enable no-duplicate-imports */
export const $:any = binding
// endregion
// region types
export type Replacement = {
    $textNodeToTranslate:$DomNode;
    $nodeToReplace:$DomNode;
    textToReplace:string;
    $currentLanguageDomNode:?$DomNode;
}
// endregion
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a website for
 * internationalisation.
 * @extends tools:Tools
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 * @property _options - Options extended by the options given to the
 * initializer method.
 * @property _options.domNodeSelectorPrefix {string} - Selector prefix for all
 * nodes to take into account.
 * @property _options.default {string} - Initial language to use.
 * @property _options.selection {Array.<string>} - List of all supported
 * languages.
 * @property _options.initial {string} - Initial set language (if omitted it
 * will be guest.
 * @property _options.templateDelimiter {Object.<string, string>} - Template
 * delimiter to recognize dynamic content.
 * @property _options.templateDelimiter.pre {string} - Delimiter which
 * introduces a dynamic expression.
 * @property _options.templateDelimiter.post {string} - Delimiter which
 * finishes a dynamic expression.
 * @property _options.fadeEffect {boolean} - Indicates whether a fade effect
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
 */
export default class Language extends $.Tools.class {
    // region static properties
    static _name:string = 'Language'
    // endregion
    // region dynamic properties
    currentLanguage:string
    knownTranslations:{[key:string]:string}
    _$domNodeToFade:?$DomNode
    _replacements:Array<Replacement>
    _textNodesWithKnownTranslation:{[key:string]:$DomNode};
    // endregion
    // region public methods
    // / region special
    /* eslint-disable jsdoc/require-description-complete-sentence */
    /**
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
     */
    initialize(
        options:Object = {}, currentLanguage:string = '',
        knownTranslation:{[key:string]:string} = {},
        $domNodeToFade:?$DomNode = null, replacements:Array<Replacement> = [],
        textNodesWithKnownTranslation:{[key:string]:$DomNode} = {}
    ):$Deferred<Language> {
    /* eslint-enable jsdoc/require-description-complete-sentence */
        this.currentLanguage = currentLanguage
        this.knownTranslation = knownTranslation
        this._$domNodeToFade = $domNodeToFade
        this._replacements = replacements
        this._textNodesWithKnownTranslation = textNodesWithKnownTranslation
        this._options = {
            domNodeSelectorPrefix: 'body',
            default: 'enUS',
            selection: [],
            initial: null,
            templateDelimiter: {pre: '{{', post: '}}'},
            fadeEffect: true,
            textNodeParent: {
                showAnimation: [{opacity: 1}, {duration: 'fast'}],
                hideAnimation: [{opacity: 0}, {duration: 'fast'}]
            },
            preReplacementLanguagePattern: '^\\|({1})$',
            replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',
            currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$',
            replacementDomNodeName: ['#comment', 'langreplacement'],
            replaceDomNodeNames: ['#text', 'langreplace'],
            toolsLockDescription: '{1}Switch',
            languageHashPrefix: 'language-',
            currentLanguageIndicatorClassName: 'current',
            sessionDescription: '{1}',
            languageMapping: {
                deDE: ['de', 'de_de', 'de-de', 'german', 'deutsch'],
                enUS: ['en', 'en_us', 'en-us'],
                enEN: ['en_en', 'en-en', 'english'],
                frFR: ['fr', 'fr_fr', 'fr-fr', 'french']
            },
            onSwitched: this.constructor.noop,
            onEnsured: this.constructor.noop,
            onSwitch: this.constructor.noop,
            onEnsure: this.constructor.noop,
            domNode: {knownTranslation: 'div.toc'}
        }
        super.initialize(options)
        this._options.preReplacementLanguagePattern =
            this.constructor.stringFormat(
                this._options.preReplacementLanguagePattern,
                this._options.replacementLanguagePattern.substr(
                    1, this._options.replacementLanguagePattern.length - 2))
        this._options.toolsLockDescription = this.constructor.stringFormat(
            this._options.toolsLockDescription, this.constructor._name)
        this._options.sessionDescription = this.constructor.stringFormat(
            this._options.sessionDescription, this.constructor._name)
        this.$domNodes = this.grabDomNode(this._options.domNode)
        this.$domNodes.switchLanguageButtons = $(
            `a[href^="#${this._options.languageHashPrefix}"]`)
        this._movePreReplacementNodes()
        this.currentLanguage = this._normalizeLanguage(this._options.default)
        /*
            NOTE: Only switch current language indicator if we haven't an
            initial language switch which will perform the indicator switch.
        */
        const newLanguage:string = this._determineUsefulLanguage()
        this.on(this.$domNodes.switchLanguageButtons, 'click', (
            event:Object
        ):$Deferred<Language> => {
            event.preventDefault()
            return this.switch($(event.target).attr('href').substr(
                this._options.languageHashPrefix.length + 1))
        })
        if (this.currentLanguage === newLanguage)
            return $.when(this._switchCurrentLanguageIndicator(newLanguage))
        return this.switch(newLanguage, true)
    }
    // / endregion
    /**
     * Switches the current language to given language. This method is mutual
     * synchronized.
     * @param language - New language as string or "true". If set to "true" it
     * indicates that the dom tree should be checked again current language to
     * ensure every text node has right content.
     * @param ensure - Indicates if a switch effect should be avoided.
     * @returns Returns the current instance wrapped in a promise.
     */
    switch(language:string|true, ensure:boolean = false):$Deferred<Language> {
        if (
            language !== true && this._options.selection.length &&
            !this._options.selection.includes(language)
        ) {
            this.debug('"{1}" isn\'t one of the allowed languages.', language)
            return $.when(this)
        }
        const deferred:$Deferred<Language> = $.Deferred()
        this.acquireLock(this._options.toolsLockDescription, ():void => {
            if (language === true) {
                ensure = true
                language = this.currentLanguage
            } else
                language = this._normalizeLanguage(language)
            if (
                ensure && language !== this._options.default ||
                this.currentLanguage !== language
            ) {
                let actionDescription:string = 'Switch to'
                if (ensure)
                    actionDescription = 'Ensure'
                this.debug('{1} "{2}".', actionDescription, language)
                this._switchCurrentLanguageIndicator(language)
                this.fireEvent(
                    (ensure ? 'ensure' : 'switch'), true, this,
                    this.currentLanguage, language)
                this._$domNodeToFade = null
                this._replacements = []
                const [
                    $lastTextNodeToTranslate:$DomNode,
                    $lastLanguageDomNode:$DomNode
                ] = this._collectTextNodesToReplace(language, ensure)
                this._ensureLastTextNodeHavingLanguageIndicator(
                    $lastTextNodeToTranslate, $lastLanguageDomNode, ensure)
                this._handleSwitchEffect(language, ensure).then((
                ):$Deferred<Language> => deferred.resolve(this))
            } else {
                this.debug(
                    '"{1}" is already current selected language.', language)
                this.releaseLock(this._options.toolsLockDescription)
                deferred.resolve(this)
            }
        })
        return deferred
    }
    /**
     * Ensures current selected language.
     * @returns Returns the current instance wrapped in a promise.
     */
    refresh():$Deferred<Language> {
        return this._movePreReplacementNodes().switch(true)
    }
    // / endregion
    // region protected methods
    /**
     * Moves pre replacement dom nodes into next dom node behind translation
     * text to use the same translation algorithm for both.
     * @returns Returns the current instance.
     */
    _movePreReplacementNodes():Language {
        const self:Language = this
        this.$domNodes.parent.find(':not(iframe)').contents(
        ).each(function():void {
            const $this:$DomNode = $(this)
            const nodeName:string = $this.prop('nodeName').toLowerCase()
            if (self._options.replacementDomNodeName.includes(nodeName)) {
                if (!['#comment', '#text'].includes(nodeName))
                    // NOTE: Hide replacement dom nodes.
                    $this.hide()
                const regularExpression:RegExp = new RegExp(
                    self._options.preReplacementLanguagePattern)
                const match:?Array<string> = $this.prop('textContent').match(
                    regularExpression)
                if (match && match[0]) {
                    $this.prop('textContent', $this.prop(
                        'textContent'
                    ).replace(regularExpression, match[1]))
                    let selfFound:boolean = false
                    $this.parent().contents().each(function():?false {
                        if (selfFound && $(this).Tools('getText').trim()) {
                            $this.appendTo(this)
                            return false
                        }
                        if ($this[0] === this)
                            selfFound = true
                    })
                }
            }
        })
        return this
    }
    /**
     * Collects all text nodes which should be replaced later.
     * @param language - New language to use.
     * @param ensure - Indicates if the whole dom should be checked again
     * current language to ensure every text node has right content.
     * @returns Return a tuple of last text and language dom node to translate.
     */
    _collectTextNodesToReplace(
        language:string, ensure:boolean
    ):Array<?$DomNode> {
        let $currentTextNodeToTranslate:?$DomNode = null
        let $currentLanguageDomNode:?$DomNode = null
        let $lastTextNodeToTranslate:?$DomNode = null
        let $lastLanguageDomNode:?$DomNode = null
        this.knownTranslation = {}
        const self:Language = this
        this.$domNodes.parent.find(':not(iframe)').contents().each(function(
        ):?true {
            const $currentDomNode:$DomNode = $(this)
            const nodeName:string = $currentDomNode.prop(
                'nodeName'
            ).toLowerCase()
            if (self._options.replaceDomNodeNames.includes(
                nodeName.toLowerCase()
            )) {
                // NOTE: We skip empty and nested text nodes
                if ($currentDomNode.Tools(
                    'getText'
                ).trim() && $currentDomNode.parents(
                    self._options.replaceDomNodeNames.join()
                ).length === 0) {
                    $lastLanguageDomNode =
                        self._ensureLastTextNodeHavingLanguageIndicator(
                            $lastTextNodeToTranslate, $lastLanguageDomNode,
                            ensure)
                    $currentTextNodeToTranslate = $currentDomNode
                }
            } else if ($currentTextNodeToTranslate) {
                if (self._options.replacementDomNodeName.includes(nodeName)) {
                    let content:string = $currentDomNode.prop('textContent')
                    if (nodeName !== '#comment')
                        content = $currentDomNode.html()
                    const match:?Array<string> = content.match(new RegExp(
                        self._options.replacementLanguagePattern))
                    if (Array.isArray(match) && match[1] === language) {
                        // Save known text translations.
                        self.knownTranslation[
                            $currentTextNodeToTranslate.Tools('getText').trim()
                        ] = match[2].trim()
                        self._registerTextNodeToChange(
                            $currentTextNodeToTranslate, $currentDomNode,
                            match, $currentLanguageDomNode)
                        $lastTextNodeToTranslate = $currentTextNodeToTranslate
                        $lastLanguageDomNode = $currentLanguageDomNode
                        $currentTextNodeToTranslate = null
                        $currentLanguageDomNode = null
                    } else if ($currentDomNode.prop('textContent').match(
                        new RegExp(self._options.currentLanguagePattern)
                    ))
                        $currentLanguageDomNode = $currentDomNode
                    return true
                }
                $lastTextNodeToTranslate = null
                $lastLanguageDomNode = null
                $currentTextNodeToTranslate = null
                $currentLanguageDomNode = null
            }
        })
        this._registerKnownTextNodes()
        return [$lastTextNodeToTranslate, $lastLanguageDomNode]
    }
    /**
     * Iterates all text nodes in language known area with known translations.
     * @returns Returns the current instance.
     */
    _registerKnownTextNodes():Language {
        this._textNodesWithKnownTranslation = {}
        const self:Language = this
        this.$domNodes.knownTranslation.find(':not(iframe)').contents(
        ).each(function():void {
            const $currentDomNode:$DomNode = $(this)
            // NOTE: We skip empty and nested text nodes.
            if (!self._options.replaceDomNodeNames.includes(
                $currentDomNode.prop('nodeName').toLowerCase()
            ) && $currentDomNode.Tools('getText').trim() &&
            $currentDomNode.parents(
                self._options.replaceDomNodeNames.join()
            ).length === 0 && self.knownTranslation.hasOwnProperty(
                $currentDomNode.Tools('getText').trim()
            )) {
                self._addTextNodeToFade($currentDomNode)
                if (self._textNodesWithKnownTranslation.hasOwnProperty(
                    self.knownTranslation[$currentDomNode.prop(
                        'textContent'
                    ).trim()]
                ))
                    self._textNodesWithKnownTranslation[self.knownTranslation[
                        $currentDomNode.prop('textContent').trim()
                    ]] = self._textNodesWithKnownTranslation[
                        self.knownTranslation[$currentDomNode.prop(
                            'textContent'
                        ).trim()]
                    ].add($currentDomNode)
                else
                    self._textNodesWithKnownTranslation[self.knownTranslation[
                        $currentDomNode.prop('textContent').trim()
                    ]] = $currentDomNode
            }
        })
        return this
    }
    /**
     * Normalizes a given language string.
     * @param language - New language to use.
     * @returns Returns the normalized version of given language.
     */
    _normalizeLanguage(language:string):string {
        for (const otherLanguage:string in this._options.languageMapping)
            if (this._options.languageMapping.hasOwnProperty(otherLanguage)) {
                if (!this._options.languageMapping[otherLanguage].includes(
                    otherLanguage.toLowerCase()
                ))
                    this._options.languageMapping[otherLanguage].push(
                        otherLanguage.toLowerCase())
                if (this._options.languageMapping[otherLanguage].includes(
                    language.toLowerCase()
                ))
                    return otherLanguage
            }
        return this._options.default
    }
    /**
     * Determines a useful initial language depending on session and browser
     * settings.
     * @returns Returns the determined language.
     */
    _determineUsefulLanguage():string {
        let result:string
        if (this._options.initial)
            result = this._options.initial
        else if ('localStorage' in $.global && $.global.localStorage.getItem(
            this._options.sessionDescription
        )) {
            result = $.global.localStorage.getItem(
                this._options.sessionDescription)
            this.debug(
                'Determine "{1}", because of local storage information.',
                result)
        } else if ('navigator' in $.global && $.global.navigator.language) {
            result = $.global.navigator.language
            this.debug(
                'Determine "{1}", because of browser settings.', result)
        } else {
            result = this._options.default
            this.debug('Determine "{1}", because of default option.', result)
        }
        result = this._normalizeLanguage(result)
        if (
            this._options.selection.length &&
            !this._options.selection.includes(result)
        ) {
            this.debug(
                '"{1}" isn\'t one of the allowed languages. Set language' +
                ' to "{2}".', result, this._options.selection[0])
            result = this._options.selection[0]
        }
        if ('localStorage' in $.global)
            $.global.localStorage.setItem(
                this._options.sessionDescription, result)
        return result
    }
    /**
     * Depending an activated switching effect this method initialized the
     * effect of replace all text string directly.
     * @param language - New language to use.
     * @param ensure - Indicates if current language should be ensured again
     * every text node content.
     * @returns Returns the current instance wrapped in a promise.
     */
    _handleSwitchEffect(language:string, ensure:boolean):$Deferred<Language> {
        const oldLanguage:string = this.currentLanguage
        if (!ensure && this._options.fadeEffect && this._$domNodeToFade)
            return this._$domNodeToFade.animate.apply(
                this._$domNodeToFade,
                this._options.textNodeParent.hideAnimation
            ).promise().then(():$Deferred<Language> => {
                this._switchLanguage(language)
                if (this._$domNodeToFade)
                    return this._$domNodeToFade.animate.apply(
                        this._$domNodeToFade,
                        this._options.textNodeParent.showAnimation
                    ).promise().then(():$Deferred<Language> => {
                        this.fireEvent(
                            (ensure ? 'ensured' : 'switched'), true, this,
                            oldLanguage, language)
                        this.releaseLock(this._options.toolsLockDescription)
                        return $.when(this)
                    })
                return $.when(this)
            })
        this._switchLanguage(language)
        this.fireEvent(
            (ensure ? 'ensured' : 'switched'), true, this, oldLanguage,
            language)
        this.releaseLock(this._options.toolsLockDescription)
        return $.when(this)
    }
    /**
     * Registers a text node to change its content with given replacement.
     * @param $textNode - Text node with content to translate.
     * @returns Returns the current instance.
     */
    _addTextNodeToFade($textNode:$DomNode):Language {
        const $parent:$DomNode = $textNode.parent()
        if (this._$domNodeToFade)
            this._$domNodeToFade = this._$domNodeToFade.add($parent)
        else
            this._$domNodeToFade = $parent
        return this
    }
    /**
     * Registers a text node to change its content with given replacement.
     * @param $currentTextNodeToTranslate - Text node with content to
     * translate.
     * @param $currentDomNode - A comment node with replacement content.
     * @param match - A matching array of replacement's text content.
     * @param $currentLanguageDomNode - A potential given text node indicating
     * the language of given text node.
     * @returns Returns the current instance.
     */
    _registerTextNodeToChange(
        $currentTextNodeToTranslate:$DomNode, $currentDomNode:?$DomNode,
        match:Array<string>, $currentLanguageDomNode:?$DomNode
    ):Language {
        this._addTextNodeToFade($currentTextNodeToTranslate)
        if ($currentDomNode)
            this._replacements.push({
                $textNodeToTranslate: $currentTextNodeToTranslate,
                $nodeToReplace: $currentDomNode,
                textToReplace: match[2],
                $currentLanguageDomNode: $currentLanguageDomNode})
        return this
    }
    /**
     * Checks if last text has a language indication comment node. This
     * function is called after each parsed dom text node.
     * @param $lastTextNodeToTranslate - Last text to node to check.
     * @param $lastLanguageDomNode - A potential given language indication
     * commend node.
     * @param ensure - Indicates if current language should be ensured again
     * every text node content.
     * @returns Returns the retrieved or newly created language indicating
     * comment node.
     */
    _ensureLastTextNodeHavingLanguageIndicator(
        $lastTextNodeToTranslate:?$DomNode, $lastLanguageDomNode:?$DomNode,
        ensure:boolean
    ):?$DomNode {
        if ($lastTextNodeToTranslate && !$lastLanguageDomNode) {
            /*
                Last text node doesn't have a current language indicating dom
                node.
            */
            let currentLocalLanguage:string = this.currentLanguage
            if (ensure)
                currentLocalLanguage = this._options.default
            $lastLanguageDomNode = $(`<!--${currentLocalLanguage}-->`)
            $lastTextNodeToTranslate.after($lastLanguageDomNode)
        }
        return $lastLanguageDomNode
    }
    /**
     * Performs the low level text replacements for switching to given
     * language.
     * @param language - The new language to switch to.
     * @returns Returns the current instance.
     */
    _switchLanguage(language:string):Language {
        for (const replacement:Replacement of this._replacements) {
            let currentText:string = replacement.$textNodeToTranslate.html()
            if (replacement.$textNodeToTranslate.prop('nodeName') === '#text')
                currentText = replacement.$textNodeToTranslate.prop(
                    'textContent')
            const trimmedText:string = currentText.trim()
            if (
                !this._options.templateDelimiter ||
                !trimmedText.endsWith(this._options.templateDelimiter.post) &&
                this._options.templateDelimiter.post
            ) {
                // IgnoreTypeCheck
                let $currentLanguageDomNode:$DomNode =
                    replacement.$currentLanguageDomNode
                if (!replacement.$currentLanguageDomNode) {
                    /*
                        Language note wasn't present initially. So we have to
                        determine it now.
                    */
                    $currentLanguageDomNode = $('body')
                    let currentDomNodeFound:boolean = false
                    replacement.$textNodeToTranslate.parent().contents(
                    ).each(function():?false {
                        if (currentDomNodeFound) {
                            replacement.$currentLanguageDomNode =
                                $currentLanguageDomNode= $(this)
                            return false
                        }
                        if (this === replacement.$textNodeToTranslate[0])
                            currentDomNodeFound = true
                    })
                }
                const currentLanguage:string = $currentLanguageDomNode.prop(
                    'textContent')
                if (language === currentLanguage)
                    this.warn(
                        `Text node "${replacement.textToReplace}" is marked ` +
                        `as "${currentLanguage}" and has same translation ` +
                        'language as it already is.')
                const nodeName:string = replacement.$nodeToReplace.prop(
                    'nodeName'
                ).toLowerCase()
                if (nodeName === '#comment')
                    replacement.$textNodeToTranslate.after($(
                        `<!--${currentLanguage}:${currentText}-->`))
                else
                    replacement.$textNodeToTranslate.after($(
                        `<${nodeName}>${currentLanguage}:${currentText}</` +
                        `${nodeName}>`
                    ).hide())
                replacement.$textNodeToTranslate.after($(`<!--${language}-->`))
                if (replacement.$textNodeToTranslate.prop(
                    'nodeName'
                ) === '#text')
                    replacement.$textNodeToTranslate.prop(
                        'textContent', replacement.textToReplace)
                else
                    replacement.$textNodeToTranslate.html(
                        replacement.textToReplace)
                $currentLanguageDomNode.remove()
                replacement.$nodeToReplace.remove()
            }
        }
        // Translate registered known text nodes.
        for (const content:string in this._textNodesWithKnownTranslation)
            if (this._textNodesWithKnownTranslation.hasOwnProperty(content))
                this._textNodesWithKnownTranslation[content].prop(
                    'textContent', content)
        if ('localStorage' in $.global)
            $.global.localStorage.setItem(
                this._options.sessionDescription, language)
        this.currentLanguage = language
        return this
    }
    /**
     * Switches the current language indicator in language switch triggered dom
     * nodes.
     * @param language - The new language to switch to.
     * @returns Returns the current instance.
     */
    _switchCurrentLanguageIndicator(language:string):Language {
        $(
            `a[href="#${this._options.languageHashPrefix}` +
            `${this.currentLanguage}"].` +
            this._options.currentLanguageIndicatorClassName
        ).removeClass(this._options.currentLanguageIndicatorClassName)
        $(
            `a[href="#${this._options.languageHashPrefix}${language}"]`
        ).addClass(this._options.currentLanguageIndicatorClassName)
        return this
    }
    // endregion
}
// endregion
$.Language = function():any {
    return $.Tools().controller(Language, arguments)
}
$.Language.class = Language
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
