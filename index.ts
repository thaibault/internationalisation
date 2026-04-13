// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module internationalization */
'use strict'
/* !
    region header
    [Project page](https://torben.website/internationalization)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {
    camelCaseToDelimited,
    extend,
    fadeIn,
    fadeOut,
    getAll,
    getParents,
    getText,
    globalContext,
    HTMLItem,
    Lock,
    Logger,
    Mapping,
    NOOP,
    format
} from 'clientnode'
import {func, object} from 'clientnode/property-types'
import {property} from 'web-component-wrapper/decorator'
import {WebComponentAPI} from 'web-component-wrapper/type'
import {Web} from 'web-component-wrapper/Web'

import {DefaultOptions, Options, Replacement} from './type'
// endregion
export const log = new Logger({name: 'internationalization'})
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a website for
 * internationalization.
 * @property _defaultOptions - Options extended by the options given to the
 * initializer method.
 * @property _defaultOptions.currentLanguageIndicatorClassName - Class name
 * which marks current language switcher button or link.
 * @property _defaultOptions.currentLanguagePattern - Saves a pattern to
 * recognize current language marker.
 * @property _defaultOptions.default - Initial language to use.
 * @property _defaultOptions.useEffect - Indicates whether a fade effect
 * should be performed.
 * @property _defaultOptions.initial - Initial set language (if omitted it will
 * be determined based on environment information).
 * @property _defaultOptions.languageHashPrefix - Hash prefix to determine
 * current active language by url.
 * @property _defaultOptions.languageMapping - A mapping of alternate language
 * descriptions.
 * @property _defaultOptions.lockDescription - Lock description.
 * @property _defaultOptions.preReplacementLanguagePattern - Pattern to
 * introduce a pre replacement language node.
 * @property _defaultOptions.replaceDomNodeNames - Tag names which indicates
 * dom nodes which should be replaced.
 * @property _defaultOptions.replacementDomNodeNames - Dom node tag name which
 * should be interpreted as a hidden alternate language node (contains text in
 * another language).
 * @property _defaultOptions.replacementLanguagePattern - Text pattern to
 * introduce a post replacement node.
 * @property _defaultOptions.selection - List of all supported languages.
 * @property _defaultOptions.selectors - Mapping of needed dom node selectors.
 * @property _defaultOptions.selectors.knownTranslation - Selector to find
 * known translation sections.
 * @property _defaultOptions.sessionDescription - Description to save current
 * language in session storage.
 * @property _defaultOptions.templateDelimiter - Template delimiter to
 * recognize dynamic content.
 * @property _defaultOptions.templateDelimiter.pre - Delimiter which introduces
 * a dynamic expression.
 * @property _defaultOptions.templateDelimiter.post - Delimiter which finishes
 * a dynamic expression.
 * @property options - Finally configured given options.
 * @property currentLanguage - Saves the current language.
 * @property knownTranslations - Saves a mapping of known language strings and
 * their corresponding translations, to boost language replacements or saves
 * redundant replacements in dom tree.
 * @property lock - Lock instance when updating dom noes.
 * @property _domNodesToFade - Saves all dom nodes which should be animated.
 * @property _replacements - Saves all text nodes which should be replaced.
 * @property _textNodesWithKnownTranslation - Saves a mapping of known text
 * snippets to their corresponding $-extended dom nodes.
 */
export class Internationalization<
    TElement = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>
> extends Web<
    TElement, ExternalProperties, InternalProperties
> {
    static _name = 'WebInternationalization'

    static _defaultOptions: DefaultOptions = {
        currentLanguageIndicatorClassName: 'current',
        currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$',
        default: 'enUS',
        useEffect: true,
        initial: null,
        languageHashPrefix: 'lang-',
        languageMapping: {
            deDE: ['de', 'de_de', 'de-de', 'german', 'deutsch'],
            enUS: ['en', 'en_us', 'en-us'],
            enEN: ['en_en', 'en-en', 'english'],
            frFR: ['fr', 'fr_fr', 'fr-fr', 'french']
        },
        lockDescription: '{1}Switch',
        preReplacementLanguagePattern: '^\\|({1})$',
        replaceDomNodeNames: ['#text', 'lang-replace'],
        replacementDomNodeNames: ['#comment', 'lang-replacement'],
        replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',
        selection: [],
        selectors: {knownTranslation: 'div.toc'},
        sessionDescription: '{1}',
        templateDelimiter: {pre: '{{', post: '}}'}
    }

    readonly self = Internationalization

    switchLanguageButtonDomNodes: NodeListOf<HTMLAnchorElement> | null = null

    currentLanguage = 'enUS'
    knownTranslations: Mapping = {}

    lock = new Lock()

    @property({type: object})
        options = {} as Options

    @property({type: func})
        onEnsure: (language: string) => Promise<void> = NOOP
    @property({type: func})
        onSwitch: (oldLanguage: string, newLanguage: string) => Promise<void> =
            NOOP
    @property({type: func})
        onEnsured: (language: string) => void = NOOP
    @property({type: func})
        onSwitched: (oldLanguage: string, newLanguage: string) => void = NOOP

    _domNodesToFade: Array<HTMLElement> = []
    _replacements: Array<Replacement> = []
    _textNodesWithKnownTranslation: Mapping<Array<HTMLItem>> = {}
    // region public methods
    /// region live-cycle
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     */
    onUpdateAttribute(name: string, newValue: string) {
        super.onUpdateAttribute(name, newValue)

        if (name === 'options')
            this.options = extend<Options>(
                true,
                {} as Options,
                this.self._defaultOptions,
                this.options
            )
    }
    /**
     * Initializes the component. Current language is set and later needed dom
     * nodes are grabbed.
     */
    connectedCallback(): void {
        if (Object.keys(this.options).length === 0)
            this.onUpdateAttribute('options', '{}')

        this.options.preReplacementLanguagePattern = format(
            this.options.preReplacementLanguagePattern,
            this.options.replacementLanguagePattern.substring(
                1, this.options.replacementLanguagePattern.length - 1
            )
        )
        this.options.lockDescription =
            format(this.options.lockDescription, this.self._name)
        this.options.sessionDescription =
            format(this.options.sessionDescription, this.self._name)

        this.switchLanguageButtonDomNodes = this.root.querySelectorAll(
            `a[href^="#${this.options.languageHashPrefix}"]`
        )

        this._movePreReplacementNodes()

        this.currentLanguage = this._normalizeLanguage(this.options.default)
        /*
            NOTE: Only switch current language indicator if we haven't an
            initial language switch which will perform the indicator switch.
        */
        const newLanguage: string = this._determineUsefulLanguage()

        const determineSelection = this.options.selection.length === 0

        for (const domNode of this.switchLanguageButtonDomNodes) {
            if (determineSelection)
                this.options.selection.push(
                    (domNode.getAttribute('href') as string)
                        .substring(
                            `#${this.options.languageHashPrefix}`.length
                        )
                )

            const handler = (event: Event) => {
                event.preventDefault()

                const url = (
                    event.target as Element | null
                )?.getAttribute('href')
                if (url)
                    void this.switch(url.substring(
                        this.options.languageHashPrefix.length + 1
                    ))
            }
            this.addSecureEventListener(domNode, 'click', handler)
        }

        if (this.currentLanguage === newLanguage) {
            this._switchCurrentLanguageIndicator(newLanguage)

            return
        }

        void this.switch(newLanguage, true)
    }
    /// endregion
    /**
     * Switches the current language to given language. This method is mutual
     * synchronized.
     * @param language - New language as string or "true". If set to "true" it
     * indicates that the dom tree should be checked again current language to
     * ensure every text node has right content.
     * @param ensure - Indicates if a switch effect should be avoided.
     * @returns Returns the current instance wrapped in a promise.
     */
    async switch(language: string | true, ensure = false): Promise<void> {
        if (
            language !== true &&
            this.options.selection.length &&
            !this.options.selection.includes(language)
        ) {
            log.debug(`"${language}" isn't one of the allowed languages.`)

            return
        }

        await this.lock.acquire(this.options.lockDescription)

        if (language === true) {
            ensure = true

            language = this.currentLanguage
        } else
            language = this._normalizeLanguage(language)

        if (
            ensure && language !== this.options.default ||
            this.currentLanguage !== language
        ) {
            let actionDescription = 'Switch to'
            if (ensure)
                actionDescription = 'Ensure'

            log.debug(`${actionDescription} "${language}".`)

            this._switchCurrentLanguageIndicator(language)

            if (ensure)
                await this.onEnsure(this.currentLanguage)
            else
                await this.onSwitch(this.currentLanguage, language)

            this._domNodesToFade = []
            this._replacements = []
            this._collectTextNodesToReplace(language, ensure)

            await this._handleSwitchEffect(language, ensure)

            return
        }

        log.debug(`"${language}" is already current selected language.`)

        void this.lock.release(this.options.lockDescription)
    }
    /**
     * Ensures current selected language.
     * @returns Promise resolving to nothing when switching as finished.
     */
    refresh(): Promise<void> {
        this._movePreReplacementNodes()

        return this.switch(true)
    }
    /// endregion
    // region protected methods
    /**
     * Depending on activated switching effect this method initialized the
     * effect of replace all text string directly.
     * @param language - New language to use.
     * @param ensure - Indicates if current language should be ensured again
     * every text node content.
     * @returns Returns the current instance wrapped in a promise.
     */
    async _handleSwitchEffect(
        language: string, ensure: boolean
    ): Promise<void> {
        const oldLanguage: string = this.currentLanguage
        if (
            !ensure &&
            this.options.useEffect &&
            this._domNodesToFade.length > 0
        ) {
            await Promise.all(
                this._domNodesToFade.map((domNode) => fadeOut(domNode))
            )

            this._switchLanguage(language)

            await Promise.all(
                this._domNodesToFade.map((domNode) => fadeIn(domNode))
            )

            this.onSwitched(oldLanguage, language)

            void this.lock.release(this.options.lockDescription)

            return
        }

        this._switchLanguage(language)

        if (ensure)
            this.onEnsured(language)
        else
            this.onSwitched(oldLanguage, language)

        void this.lock.release(this.options.lockDescription)
    }
    /**
     * Moves pre replacement dom nodes into next dom node behind translation
     * text to use the same translation algorithm for both.
     */
    _movePreReplacementNodes(): void {
        const self: Internationalization<TElement> = this

        for (const domNode of getAll(this.root)) {
            const nodeName: string = domNode.nodeName.toLowerCase()

            if (self.options.replacementDomNodeNames.includes(nodeName)) {
                if (!['#comment', '#text'].includes(nodeName))
                    // NOTE: Hide replacement dom nodes.
                    (domNode as HTMLElement).style.visibility = 'hidden'

                const regularExpression =
                    new RegExp(self.options.preReplacementLanguagePattern)
                const match: RegExpMatchArray | null | undefined =
                    domNode.textContent?.match(regularExpression)
                if (domNode.textContent && match && match[0]) {
                    domNode.textContent = domNode.textContent.replace(
                        regularExpression, match[1]
                    )

                    if (domNode.parentElement) {
                        let selfFound = false
                        for (const subDomNode of getAll(
                            domNode.parentElement
                        )) {
                            if (selfFound && getText(subDomNode).length > 0) {
                                subDomNode.appendChild(domNode)

                                break
                            }

                            if (domNode === subDomNode)
                                selfFound = true
                        }
                    }
                }
            }
        }
    }
    /**
     * Collects all text nodes which should be replaced later.
     * @param language - New language to use.
     * @param ensure - Indicates if the whole dom should be checked again
     * current language to ensure every text node has right content.
     */
    _collectTextNodesToReplace(language: string, ensure: boolean): void {
        let currentTextNodeToTranslate: HTMLItem | null = null
        let currentLanguageDomNode: HTMLItem | null = null

        this.knownTranslations = {}

        for (const domNode of getAll(this.root)) {
            const nodeName: string = domNode.nodeName.toLowerCase()
            const nodeTextContent = getText(domNode)

            // NOTE: We skip empty and nested nodes.
            if (
                nodeTextContent.length === 0 &&
                (
                    domNode.nodeType !== Node.COMMENT_NODE ||
                    ((domNode as Comment).nodeValue || '').trim() === ''
                ) ||
                currentTextNodeToTranslate?.contains(domNode) ||
                getParents(domNode).some((domNode) =>
                    this.options.replaceDomNodeNames
                        .concat(this.options.replacementDomNodeNames)
                        .includes(domNode.nodeName.toLowerCase())
                )
            )
                continue

            if (this.options.replaceDomNodeNames.includes(nodeName))
                currentTextNodeToTranslate = domNode as HTMLItem
            else if (currentTextNodeToTranslate) {
                if (this.options.replacementDomNodeNames.includes(nodeName)) {
                    const content = nodeName === '#comment' ?
                        domNode.textContent :
                        (domNode as HTMLElement).innerHTML

                    const match: Array<string> | null | undefined =
                        content?.match(new RegExp(
                            this.options.replacementLanguagePattern
                        ))
                    if (Array.isArray(match) && match[1] === language) {
                        // Save known text translations.
                        this.knownTranslations[
                            getText(currentTextNodeToTranslate).join(' ')
                        ] = match[2].trim()

                        currentLanguageDomNode =
                            this._ensureLastTextNodeHavingLanguageIndicator(
                                currentTextNodeToTranslate,
                                currentLanguageDomNode,
                                ensure
                            )

                        this._registerTextNodeToChange(
                            currentTextNodeToTranslate,
                            domNode as HTMLItem,
                            match,
                            currentLanguageDomNode
                        )

                        currentTextNodeToTranslate = null
                        currentLanguageDomNode = null
                    } else if (domNode.textContent?.match(
                        new RegExp(this.options.currentLanguagePattern)
                    ))
                        currentLanguageDomNode = domNode as HTMLElement

                    continue
                }

                currentTextNodeToTranslate = null
                currentLanguageDomNode = null
            }
        }

        this._registerKnownTextNodes()
    }
    /**
     * Iterates all text nodes in language known area with known translations.
     */
    _registerKnownTextNodes(): void {
        this._textNodesWithKnownTranslation = {}

        const self: Internationalization<TElement> = this

        for (const domNode of this.root.querySelectorAll(
            this.options.selectors.knownTranslation
        ))
            for (const node of getAll(domNode)) {
                const content = getText(node).join(' ')
                // NOTE: We skip empty and nested text nodes.
                if (
                    content &&
                    !self.options.replaceDomNodeNames.includes(
                        node.nodeName.toLowerCase()
                    ) &&
                    !getParents(node).some((domNode) =>
                        this.options.replaceDomNodeNames
                            .includes(domNode.nodeName.toLowerCase())
                    ) &&
                    Object.prototype.hasOwnProperty.call(
                        self.knownTranslations, content
                    )
                ) {
                    this._domNodesToFade.push(
                        node.parentElement as HTMLElement
                    )

                    if (
                        Object.prototype.hasOwnProperty.call(
                            self._textNodesWithKnownTranslation,
                            self.knownTranslations[content]
                        )
                    )
                        self._textNodesWithKnownTranslation[
                            self.knownTranslations[content]
                        ].push(node as HTMLItem)
                    else
                        self._textNodesWithKnownTranslation[
                            self.knownTranslations[content]
                        ] = [node as HTMLItem]
                }
            }
    }
    /**
     * Normalizes a given language string.
     * @param language - New language to use.
     * @returns Returns the normalized version of given language.
     */
    _normalizeLanguage(language: string): string {
        for (const [otherLanguage, aliases] of Object.entries(
            this.options.languageMapping
        )) {
            if (!aliases.includes(otherLanguage.toLowerCase()))
                aliases.push(otherLanguage.toLowerCase())

            if (aliases.includes(language.toLowerCase()))
                return otherLanguage
        }

        return this.options.default
    }
    /**
     * Determines a useful initial language depending on session and browser
     * settings.
     * @returns Returns the determined language.
     */
    _determineUsefulLanguage(): string {
        let result: string | undefined
        if (this.options.initial)
            result = this.options.initial
        else if (Object.prototype.hasOwnProperty.call(globalContext, 'window'))
            if (globalContext.window?.localStorage.getItem(
                this.options.sessionDescription
            )) {
                result = globalContext.window.localStorage.getItem(
                    this.options.sessionDescription
                ) as string

                log.debug(
                    `Determine "${result}", because of local storage`,
                    'information.'
                )
            } else if (globalContext.window?.navigator.language) {
                result = globalContext.window.navigator.language

                log.debug(
                    `Determine "${result}", because of browser settings.`
                )
            }

        if (!result) {
            result = this.options.default

            log.debug(`Determine "${result}", because of default option.`)
        }
        result = this._normalizeLanguage(result)
        if (
            this.options.selection.length &&
            !this.options.selection.includes(result)
        ) {
            log.debug(
                `"${result}" isn't one of the allowed languages. Set`,
                `language to "${this.options.selection[0]}".`
            )

            result = this.options.selection[0]
        }

        if (globalContext.window?.localStorage)
            globalContext.window.localStorage.setItem(
                this.options.sessionDescription, result
            )

        return result
    }
    /**
     * Registers a text node to change its content with given replacement.
     * @param currentTextNodeToTranslate - Text node with content to
     * translate.
     * @param currentDomNode - A comment node with replacement content.
     * @param match - A matching array of replacement's text content.
     * @param currentLanguageDomNode - A potential given text node indicating
     * the language of given text node.
     */
    _registerTextNodeToChange(
        currentTextNodeToTranslate: HTMLItem,
        currentDomNode: HTMLItem | null,
        match: Array<string>,
        currentLanguageDomNode: HTMLItem | null
    ) {
        this._domNodesToFade.push(
            currentTextNodeToTranslate.parentElement as HTMLElement
        )

        if (currentDomNode)
            this._replacements.push({
                textNodeToTranslate: currentTextNodeToTranslate,
                nodeToReplaceWith: currentDomNode,
                textToReplaceWith: match[2],
                currentLanguageDomNode
            })
    }
    /**
     * Checks if last text node has a language indication comment node. This
     * function is called after each parsed dom text node.
     * @param lastTextNodeToTranslate - Last text node to check.
     * @param lastLanguageDomNode - A potential given language indication
     * commend node.
     * @param ensure - Indicates if current language should be ensured again
     * every text node content.
     * @returns Returns the retrieved or newly created language indicating
     * comment node.
     */
    _ensureLastTextNodeHavingLanguageIndicator(
        lastTextNodeToTranslate: HTMLItem | null,
        lastLanguageDomNode: HTMLItem | null,
        ensure: boolean
    ): HTMLItem | null {
        if (lastTextNodeToTranslate && !lastLanguageDomNode) {
            /*
                Last text node doesn't have a current language indicating dom
                node.
            */
            let currentLocalLanguage: string = this.currentLanguage
            if (ensure)
                currentLocalLanguage =
                    this.options.default || this.currentLanguage

            lastLanguageDomNode =
                globalContext.document?.createComment(currentLocalLanguage) ||
                null
            if (lastLanguageDomNode)
                lastTextNodeToTranslate.after(lastLanguageDomNode)
        }

        return lastLanguageDomNode
    }
    /**
     * Performs the low level text replacements for switching to given
     * language.
     * @param language - The new language to switch to.
     */
    _switchLanguage(language: string): void {
        for (const replacement of this._replacements) {
            const currentText: string =
                Object.prototype.hasOwnProperty.call(
                    replacement.textNodeToTranslate, 'innerHTML'
                ) ?
                    (replacement.textNodeToTranslate as HTMLElement)
                        .innerHTML :
                    replacement.textNodeToTranslate.textContent

            const trimmedText: string = currentText.trim()
            if (
                !this.options.templateDelimiter ||
                !trimmedText.endsWith(this.options.templateDelimiter.post) &&
                this.options.templateDelimiter.post
            ) {
                let currentLanguageDomNode: HTMLItem | null =
                    replacement.currentLanguageDomNode
                if (!currentLanguageDomNode) {
                    /*
                        Language dom node wasn't present initially. So we have
                        to determine it now.
                    */
                    currentLanguageDomNode = document.body
                    let currentDomNodeFound = false
                    for (const domNode of getAll(
                        replacement.textNodeToTranslate.parentElement as
                            HTMLElement
                    )) {
                        if (currentDomNodeFound) {
                            replacement.currentLanguageDomNode =
                                currentLanguageDomNode =
                                domNode as HTMLItem

                            break
                        }

                        if (domNode === replacement.textNodeToTranslate)
                            currentDomNodeFound = true
                    }
                }

                const currentLanguage: null | string =
                    currentLanguageDomNode.textContent
                if (currentLanguage && language === currentLanguage)
                    log.warn(
                        `Text node "${replacement.textToReplaceWith}" is`,
                        `marked as "${currentLanguage}" and has same`,
                        'translation language as it already is.'
                    )

                const nodeName: string =
                    replacement.nodeToReplaceWith.nodeName.toLowerCase()
                if (nodeName === '#comment')
                    replacement.textNodeToTranslate.after(
                        (globalContext.document as Document).createComment(
                            `${currentLanguage}:${currentText}`
                        )
                    )
                else {
                    const newNode =
                        (globalContext.document as Document).createElement(
                            nodeName
                        )
                    newNode.textContent = `${currentLanguage}:${currentText}`
                    newNode.style.visibility = 'hidden'
                    replacement.textNodeToTranslate.after(newNode)
                }

                replacement.textNodeToTranslate.after(
                    (globalContext.document as Document)
                        .createComment(language)
                )

                if ('innerHTML' in replacement.textNodeToTranslate)
                    replacement.textNodeToTranslate.innerHTML =
                        replacement.textToReplaceWith
                else
                    replacement.textNodeToTranslate.textContent =
                        replacement.textToReplaceWith

                currentLanguageDomNode.remove()
                replacement.nodeToReplaceWith.remove()
            }
        }

        // Translate registered known text nodes.
        for (const [content, domNodes] of Object.entries(
            this._textNodesWithKnownTranslation
        ))
            for (const domNode of domNodes)
                domNode.textContent = content

        if (globalContext.localStorage)
            globalContext.localStorage.setItem(
                this.options.sessionDescription, language
            )

        this.currentLanguage = language
    }
    /**
     * Switches the current language indicator in language switch triggered dom
     * nodes.
     * @param language - The new language to switch to.
     */
    _switchCurrentLanguageIndicator(language: string) {
        for (const domNode of this.root.querySelectorAll(
            `a[href="#${this.options.languageHashPrefix}` +
            `${this.currentLanguage}"].` +
            this.options.currentLanguageIndicatorClassName
        ))
            domNode.classList.remove(
                this.options.currentLanguageIndicatorClassName
            )

        for (const domNode of this.root.querySelectorAll(
            `a[href="#${this.options.languageHashPrefix}${language}"]`
        ))
            domNode.classList.add(
                this.options.currentLanguageIndicatorClassName
            )
    }
    // endregion
}

export const api: WebComponentAPI<
    HTMLElement, Mapping<unknown>, Mapping<unknown>, typeof Web
> = {
    component: Internationalization,
    register: (
        tagName: string = camelCaseToDelimited(Internationalization._name)
    ) => {
        customElements.define(tagName, Internationalization)
    }
}
export default Internationalization
// endregion
