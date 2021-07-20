// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module internationalisation */
'use strict'
/* !
    region header
    [Project page](https://torben.website/internationalisation)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import Tools, {BoundTools, $} from 'clientnode'
import {HTMLItem, Mapping, RecursivePartial, $DomNode} from 'clientnode/type'

import {Options, Replacement, $DomNodes} from './type'
// endregion
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a website for
 * internationalisation.
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 *
 * @property currentLanguage - Saves the current language.
 * @property knownTranslations - Saves a mapping of known language strings and
 * their corresponding translations, to boost language replacements or saves
 * redundant replacements in dom tree.
 *
 * @property _$domNodeToFade - Saves all $-extended dom nodes which should be
 * animated.
 * @property _options - Options extended by the options given to the
 * initializer method.
 * @property _options.domNodeSelectorPrefix - Selector prefix for all nodes to
 * take into account.
 * @property _options.default - Initial language to use.
 * @property _options.selection - List of all supported languages.
 * @property _options.initial - Initial set language (if omitted it will be
 * determined based on environment informations).
 * @property _options.templateDelimiter - Template delimiter to recognize
 * dynamic content.
 * @property _options.templateDelimiter.pre - Delimiter which introduces a
 * dynamic expression.
 * @property _options.templateDelimiter.post - Delimiter which finishes a
 * dynamic expression.
 * @property _options.fadeEffect - Indicates whether a fade effect should be
 * performed.
 * @property _options.textNodeParent - Saves informations how parent dom nodes
 * should be animated when containing text will be switched.
 * @property _options.textNodeParent.showAnimation - Fade in options when a new
 * text should appear.
 * @property _options.textNodeParent.hideAnimation - Fade out effect options
 * when a text node should be removed before switching them.
 * @property _options.preReplacementLanguagePattern - Pattern to introduce a
 * pre replacement language node.
 * @property _options.replacementLanguagePattern - Text pattern to introduce a
 * post replacement node.
 * @property _options.currentLanguagePattern - Saves a pattern to recognize
 * current language marker.
 * @property _options.replacementDomNodeName - Dom node tag name which should
 * be interpreted as a hidden alternate language node (contains text in another
 * language).
 * @property _options.replaceDomNodeNames - Tag names which indicates dom nodes
 * which should be replaced.
 * @property _options.toolsLockDescription - Lock description for the locking
 * mechanism provided by the extended tools class.
 * @property _options.languageHashPrefix - Hash prefix to determine current
 * active language by url.
 * @property _options.currentLanguageIndicatorClassName - Class name which
 * marks current language switcher button or link.
 * @property _options.sessionDescription - Name to use for saving preferred
 * language in local storage for current session.
 * @property _options.languageMapping - A mapping of alternate language
 * descriptions.
 * @property _options.onSwitched - Callback which will be triggered after a
 * language switch has been finished.
 * @property _options.onEnsured - Callback which will be triggered after a
 * language check has been performed. Needed if some nodes have another
 * language active then others. Useful if only some parts of the dom tree was
 * updated and a full language update isn't required.
 * @property _options.onSwitch - Callback which should be called before a
 * language switch should be performed.
 * @property _options.onEnsure - Callback which should be called before a
 * language switch should be ensured.
 * @property _options.domNodes - A mapping of needed internal dom node
 * descriptions to their corresponding selectors.
 * @property _replacements - Saves all text nodes which should be replaced.
 * @property _textNodesWithKnownTranslation - Saves a mapping of known text
 * snippets to their corresponding $-extended dom nodes.
 */
export class Internationalisation<
    TElement extends HTMLElement = HTMLElement, LockType = string|void
> extends BoundTools<TElement, LockType> {
    static readonly _name:'Internationalisation' = 'Internationalisation'

    $domNodes:$DomNodes = null as unknown as $DomNodes
    currentLanguage:string = 'enUS'
    knownTranslations:Mapping = {}
    readonly self:typeof Internationalisation = Internationalisation

    _$domNodeToFade:null|$DomNode = null
    _options:Options = {
        currentLanguageIndicatorClassName: 'current',
        currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$',
        default: 'enUS',
        domNodes: {knownTranslation: 'div.toc'},
        fadeEffect: true,
        initial: null,
        languageHashPrefix: 'language-',
        languageMapping: {
            deDE: ['de', 'de_de', 'de-de', 'german', 'deutsch'],
            enUS: ['en', 'en_us', 'en-us'],
            enEN: ['en_en', 'en-en', 'english'],
            frFR: ['fr', 'fr_fr', 'fr-fr', 'french']
        },
        onSwitched: Tools.noop,
        onEnsured: Tools.noop,
        onSwitch: Tools.noop,
        onEnsure: Tools.noop,
        preReplacementLanguagePattern: '^\\|({1})$',
        replaceDomNodeNames: ['#text', 'langreplace'],
        replacementDomNodeName: ['#comment', 'langreplacement'],
        replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',
        selection: [],
        sessionDescription: '{1}',
        templateDelimiter: {pre: '{{', post: '}}'},
        textNodeParent: {
            hideAnimation: [{opacity: 0}, {duration: 'fast'}],
            showAnimation: [{opacity: 1}, {duration: 'fast'}]
        },
        toolsLockDescription: '{1}Switch'
    }
    _replacements:Array<Replacement> = []
    _textNodesWithKnownTranslation:Mapping<$DomNode<HTMLItem>> = {}
    // region public methods
    // / region special
    /**
     * Initializes the plugin. Current language is set and later needed dom
     * nodes are grabbed.
     * @param options - An options object.
     * @returns Returns the current instance wrapped in a promise.
     */
    initialize(
        options:RecursivePartial<Options> = {}
    ):Promise<$DomNode<TElement>> {
        super.initialize(options)
        this._options.preReplacementLanguagePattern = Tools.stringFormat(
            this._options.preReplacementLanguagePattern,
            this._options.replacementLanguagePattern.substr(
                1, this._options.replacementLanguagePattern.length - 2
            )
        )
        this._options.toolsLockDescription = Tools.stringFormat(
            this._options.toolsLockDescription, this.self._name
        )
        this._options.sessionDescription = Tools.stringFormat(
            this._options.sessionDescription, this.self._name
        )
        this.$domNodes = this.grabDomNode(
            this._options.domNodes as Mapping<string>, this.$domNode
        ) as unknown as $DomNodes
        this.$domNodes.switchLanguageButtons = $(
            `a[href^="#${this._options.languageHashPrefix}"]`
        )
        this._movePreReplacementNodes()
        this.currentLanguage = this._normalizeLanguage(this._options.default)
        /*
            NOTE: Only switch current language indicator if we haven't an
            initial language switch which will perform the indicator switch.
        */
        const newLanguage:string = this._determineUsefulLanguage()
        this.on(
            this.$domNodes.switchLanguageButtons,
            'click',
            (event:Event):Promise<$DomNode<TElement>> => {
                event.preventDefault()
                return this.switch(
                    $(event.target)
                        .attr('href')
                        .substr(this._options.languageHashPrefix.length + 1)
                )
            }
        )
        if (this.currentLanguage === newLanguage) {
            this._switchCurrentLanguageIndicator(newLanguage)
            return Promise.resolve(this.$domNode)
        }
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
    async switch(
        language:string|true, ensure:boolean = false
    ):Promise<$DomNode<TElement>> {
        if (
            language !== true &&
            this._options.selection.length &&
            !this._options.selection.includes(language)
        ) {
            this.debug('"{1}" isn\'t one of the allowed languages.', language)
            return this.$domNode
        }
        await this.acquireLock(this._options.toolsLockDescription)
        if (language === true) {
            ensure = true
            language = this.currentLanguage
        } else
            language = this._normalizeLanguage(language)
        if (
            ensure &&
            language !== this._options.default ||
            this.currentLanguage !== language
        ) {
            let actionDescription:string = 'Switch to'
            if (ensure)
                actionDescription = 'Ensure'
            this.debug('{1} "{2}".', actionDescription, language)
            this._switchCurrentLanguageIndicator(language)
            await this.fireEvent(
                (ensure ? 'ensure' : 'switch'),
                true,
                this,
                this.currentLanguage,
                language
            )
            this._$domNodeToFade = null
            this._replacements = []
            const [$lastTextNodeToTranslate, $lastLanguageDomNode] =
                this._collectTextNodesToReplace(language, ensure)
            this._ensureLastTextNodeHavingLanguageIndicator(
                $lastTextNodeToTranslate, $lastLanguageDomNode, ensure
            )
            await this._handleSwitchEffect(language, ensure)
            return this.$domNode
        }
        this.debug('"{1}" is already current selected language.', language)
        this.releaseLock(this._options.toolsLockDescription)
        return this.$domNode
    }
    /**
     * Ensures current selected language.
     * @returns Returns the current instance wrapped in a promise.
     */
    refresh():Promise<$DomNode<TElement>> {
        this._movePreReplacementNodes()
        return this.switch(true)
    }
    // / endregion
    // region protected methods
    /**
     * Depending an activated switching effect this method initialized the
     * effect of replace all text string directly.
     * @param language - New language to use.
     * @param ensure - Indicates if current language should be ensured again
     * every text node content.
     * @returns Returns the current instance wrapped in a promise.
     */
    async _handleSwitchEffect(language:string, ensure:boolean):Promise<void> {
        const oldLanguage:string = this.currentLanguage
        if (!ensure && this._options.fadeEffect && this._$domNodeToFade) {
            await this._$domNodeToFade
                .animate(...this._options.textNodeParent.hideAnimation)
                .promise()
            this._switchLanguage(language)
            if (this._$domNodeToFade) {
                await this._$domNodeToFade
                    .animate(...this._options.textNodeParent.showAnimation)
                    .promise()
                await this.fireEvent(
                    (ensure ? 'ensured' : 'switched'),
                    true,
                    this,
                    oldLanguage,
                    language
                )
                this.releaseLock(this._options.toolsLockDescription)
            }
            return
        }
        this._switchLanguage(language)
        await this.fireEvent(
            (ensure ? 'ensured' : 'switched'),
            true,
            this,
            oldLanguage,
            language
        )
        this.releaseLock(this._options.toolsLockDescription)
    }
    /**
     * Moves pre replacement dom nodes into next dom node behind translation
     * text to use the same translation algorithm for both.
     * @returns Returns the current instance.
     */
    _movePreReplacementNodes():void {
        const self:Internationalisation<TElement, LockType> = this
        this.$domNode.find(':not(iframe)').contents().each(function():void {
            const $this:$DomNode<HTMLItem> = $(this)
            const nodeName:string = $this.prop('nodeName').toLowerCase()
            if (self._options.replacementDomNodeName.includes(nodeName)) {
                if (!['#comment', '#text'].includes(nodeName))
                    // NOTE: Hide replacement dom nodes.
                    $this.hide()
                const regularExpression:RegExp = new RegExp(
                    self._options.preReplacementLanguagePattern
                )
                const match:Array<string>|null = $this
                    .prop('textContent')
                    .match(regularExpression)
                if (match && match[0]) {
                    $this
                        .prop('textContent', $this.prop('textContent')
                        .replace(regularExpression, match[1]))
                    let selfFound:boolean = false
                    $this.parent().contents().each(function():false|void {
                        if (selfFound && $(this).Tools('text').trim()) {
                            $this.appendTo(this as Element)
                            return false
                        }
                        if ($this[0] === this)
                            selfFound = true
                    })
                }
            }
        })
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
    ):Array<null|$DomNode> {
        let $currentTextNodeToTranslate:null|$DomNode<HTMLItem> = null
        let $currentLanguageDomNode:null|$DomNode = null
        let $lastTextNodeToTranslate:null|$DomNode<HTMLItem> = null
        let $lastLanguageDomNode:null|$DomNode = null
        this.knownTranslations = {}
        const self:Internationalisation<TElement, LockType> = this
        this.$domNode.find(':not(iframe)').contents().each(function():void {
            const $currentDomNode:$DomNode<HTMLItem> = $(this)
            const nodeName:string =
                $currentDomNode.prop('nodeName').toLowerCase()
            if (self._options.replaceDomNodeNames.includes(
                nodeName.toLowerCase()
            )) {
                // NOTE: We skip empty and nested text nodes.
                if (
                    $currentDomNode.Tools('text').trim() &&
                    $currentDomNode.parents(
                        self._options.replaceDomNodeNames.join()
                    ).length === 0
                ) {
                    $lastLanguageDomNode =
                        self._ensureLastTextNodeHavingLanguageIndicator(
                            $lastTextNodeToTranslate,
                            $lastLanguageDomNode,
                            ensure
                        )
                    $currentTextNodeToTranslate = $currentDomNode
                }
            } else if ($currentTextNodeToTranslate) {
                if (self._options.replacementDomNodeName.includes(nodeName)) {
                    let content:string = $currentDomNode.prop('textContent')
                    if (nodeName !== '#comment')
                        content = $currentDomNode.html()
                    const match:Array<string>|null = content.match(new RegExp(
                        self._options.replacementLanguagePattern
                    ))
                    if (Array.isArray(match) && match[1] === language) {
                        // Save known text translations.
                        self.knownTranslations[
                            $currentTextNodeToTranslate
                                .Tools('text')
                                .trim()
                        ] = match[2].trim()
                        self._registerTextNodeToChange(
                            $currentTextNodeToTranslate,
                            $currentDomNode,
                            match,
                            $currentLanguageDomNode
                        )
                        $lastTextNodeToTranslate = $currentTextNodeToTranslate
                        $lastLanguageDomNode = $currentLanguageDomNode
                        $currentTextNodeToTranslate = null
                        $currentLanguageDomNode = null
                    } else if (
                        $currentDomNode
                            .prop('textContent')
                            .match(new RegExp(
                                self._options.currentLanguagePattern
                            ))
                    )
                        $currentLanguageDomNode = $currentDomNode as $DomNode
                    return
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
    _registerKnownTextNodes():void {
        this._textNodesWithKnownTranslation = {}
        const self:Internationalisation<TElement, LockType> = this
        this.$domNodes
            .knownTranslation
            .find(':not(iframe)')
            .contents()
            .each(function():void {
                const $currentDomNode:$DomNode<HTMLItem> = $(this)
                // NOTE: We skip empty and nested text nodes.
                if (
                    !self._options.replaceDomNodeNames.includes(
                        $currentDomNode.prop('nodeName').toLowerCase()
                    ) &&
                    $currentDomNode.Tools('text').trim() &&
                    $currentDomNode.parents(
                        self._options.replaceDomNodeNames.join()
                    ).length === 0 &&
                    self.knownTranslations.hasOwnProperty(
                        $currentDomNode.Tools('text').trim()
                    )
                ) {
                    self._addTextNodeToFade($currentDomNode)
                    if (self._textNodesWithKnownTranslation.hasOwnProperty(
                        self.knownTranslations[$currentDomNode.prop(
                            'textContent'
                        ).trim()]
                    ))
                        self._textNodesWithKnownTranslation[
                            self.knownTranslations[
                                $currentDomNode.prop('textContent').trim()
                            ]
                        ] =
                            self._textNodesWithKnownTranslation[
                                self.knownTranslations[$currentDomNode.prop(
                                    'textContent'
                                ).trim()]
                            ].add(this)
                    else
                        self._textNodesWithKnownTranslation[
                            self.knownTranslations[
                                $currentDomNode.prop('textContent').trim()
                            ]
                        ] = $currentDomNode
                }
            })
    }
    /**
     * Normalizes a given language string.
     * @param language - New language to use.
     * @returns Returns the normalized version of given language.
     */
    _normalizeLanguage(language:string):string {
        for (const otherLanguage in this._options.languageMapping)
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
        let result:string|undefined
        if (this._options.initial)
            result = this._options.initial
        else if ($.global.window) {
            if ($.global.window.localStorage?.getItem(
                this._options.sessionDescription
            )) {
                result = $.global.window.localStorage.getItem(
                    this._options.sessionDescription
                ) as string
                this.debug(
                    `Determine "${result}", because of local storage ` +
                    'information.'
                )
            } else if ($.global.window.navigator?.language) {
                result = $.global.window.navigator.language
                this.debug(
                    `Determine "${result}", because of browser settings.`
                )
            }
        }
        if (!result) {
            result = this._options.default
            this.debug(`Determine "${result}", because of default option.`)
        }
        result = this._normalizeLanguage(result)
        if (
            this._options.selection.length &&
            !this._options.selection.includes(result)
        ) {
            this.debug(
                `"${result}" isn\'t one of the allowed languages. Set ` +
                `language to "${this._options.selection[0]}".`
            )
            result = this._options.selection[0]
        }
        if ($.global.window?.localStorage)
            $.global.window.localStorage.setItem(
                this._options.sessionDescription, result
            )
        return result
    }
    /**
     * Registers a text node to change its content with given replacement.
     * @param $textNode - Text node with content to translate.
     * @returns Returns the current instance.
     */
    _addTextNodeToFade($textNode:$DomNode<HTMLItem>):void {
        const $parent:$DomNode = $textNode.parent() as $DomNode
        if (this._$domNodeToFade)
            this._$domNodeToFade = this._$domNodeToFade.add($parent)
        else
            this._$domNodeToFade = $parent
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
        $currentTextNodeToTranslate:$DomNode<HTMLItem>,
        $currentDomNode:$DomNode<HTMLItem>,
        match:Array<string>,
        $currentLanguageDomNode:null|$DomNode
    ):void {
        this._addTextNodeToFade($currentTextNodeToTranslate)
        if ($currentDomNode)
            this._replacements.push({
                $textNodeToTranslate: $currentTextNodeToTranslate,
                $nodeToReplace: $currentDomNode,
                textToReplace: match[2],
                $currentLanguageDomNode: $currentLanguageDomNode
            })
    }
    /**
     * Checks if last text node has a language indication comment node. This
     * function is called after each parsed dom text node.
     * @param $lastTextNodeToTranslate - Last text node to check.
     * @param $lastLanguageDomNode - A potential given language indication
     * commend node.
     * @param ensure - Indicates if current language should be ensured again
     * every text node content.
     * @returns Returns the retrieved or newly created language indicating
     * comment node.
     */
    _ensureLastTextNodeHavingLanguageIndicator(
        $lastTextNodeToTranslate:null|$DomNode<HTMLItem>,
        $lastLanguageDomNode:null|$DomNode,
        ensure:boolean
    ):null|$DomNode {
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
    _switchLanguage(language:string):void {
        for (const replacement of this._replacements) {
            let currentText:string = replacement.$textNodeToTranslate.html()
            if (replacement.$textNodeToTranslate.prop('nodeName') === '#text')
                currentText =
                    replacement.$textNodeToTranslate.prop('textContent')
            const trimmedText:string = currentText.trim()
            if (
                !this._options.templateDelimiter ||
                !trimmedText.endsWith(this._options.templateDelimiter.post) &&
                this._options.templateDelimiter.post
            ) {
                let $currentLanguageDomNode:null|$DomNode<HTMLItem> =
                    replacement.$currentLanguageDomNode
                if (!$currentLanguageDomNode) {
                    /*
                        Language dom node wasn't present initially. So we have
                        to determine it now.
                    */
                    $currentLanguageDomNode = $('body')
                    let currentDomNodeFound:boolean = false
                    replacement
                        .$textNodeToTranslate
                        .parent()
                        .contents().each(function():false|void {
                            if (currentDomNodeFound) {
                                replacement.$currentLanguageDomNode =
                                    $currentLanguageDomNode =
                                    $(this)
                                return false
                            }
                            if (this === replacement.$textNodeToTranslate[0])
                                currentDomNodeFound = true
                        })
                }
                const currentLanguage:string =
                    ($currentLanguageDomNode as $DomNode).prop('textContent')
                if (language === currentLanguage)
                    this.warn(
                        `Text node "${replacement.textToReplace}" is marked ` +
                        `as "${currentLanguage}" and has same translation ` +
                        'language as it already is.'
                    )
                const nodeName:string = replacement.$nodeToReplace.prop(
                    'nodeName'
                ).toLowerCase()
                if (nodeName === '#comment')
                    replacement.$textNodeToTranslate.after($(
                        `<!--${currentLanguage}:${currentText}-->`
                    ))
                else
                    replacement.$textNodeToTranslate.after($(
                        `<${nodeName}>${currentLanguage}:${currentText}</` +
                        `${nodeName}>`
                    ).hide())
                replacement.$textNodeToTranslate.after($(`<!--${language}-->`))
                if (
                    replacement.$textNodeToTranslate.prop('nodeName') ===
                        '#text'
                )
                    replacement.$textNodeToTranslate.prop(
                        'textContent', replacement.textToReplace
                    )
                else
                    replacement.$textNodeToTranslate.html(
                        replacement.textToReplace
                    )
                $currentLanguageDomNode.remove()
                replacement.$nodeToReplace.remove()
            }
        }
        // Translate registered known text nodes.
        for (const content in this._textNodesWithKnownTranslation)
            if (this._textNodesWithKnownTranslation.hasOwnProperty(content))
                this._textNodesWithKnownTranslation[content].prop(
                    'textContent', content
                )
        if ('localStorage' in $.global)
            $.global.localStorage.setItem(
                this._options.sessionDescription, language
            )
        this.currentLanguage = language
    }
    /**
     * Switches the current language indicator in language switch triggered dom
     * nodes.
     * @param language - The new language to switch to.
     * @returns Returns the current instance.
     */
    _switchCurrentLanguageIndicator(language:string):void {
        $(
            `a[href="#${this._options.languageHashPrefix}` +
            `${this.currentLanguage}"].` +
            this._options.currentLanguageIndicatorClassName
        ).removeClass(this._options.currentLanguageIndicatorClassName)
        $(
            `a[href="#${this._options.languageHashPrefix}${language}"]`
        ).addClass(this._options.currentLanguageIndicatorClassName)
    }
    // endregion
}
export default Internationalisation
// endregion
// region handle $ extending
if ($.fn)
    $.fn.Internationalisation = function<TElement = HTMLElement>(
        ...parameter:Array<any>
    ):$DomNode<TElement> {
        return $.Tools().controller(
            Internationalisation,
            parameter,
            this as unknown as $DomNode<TElement>
        )
    }
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
