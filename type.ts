// -*- coding: utf-8 -*-
/** @module type */
'use strict'
/* !
    region header
    [Project page](https://torben.website/web-internationalization)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {HTMLItem, Mapping} from 'clientnode'
// endregion
// region exports
export interface Replacement {
    textNodeToTranslate: HTMLItem
    nodeToReplaceWith: HTMLItem
    textToReplaceWith: string
    currentLanguageDomNode: HTMLItem | null
}

export interface DefaultOptions {
    currentLanguageIndicatorClassName: string
    currentLanguagePattern: string
    default: string
    useEffect: boolean
    initial: null|string
    languageHashPrefix: string
    languageMapping: Mapping<Array<string>>
    lockDescription: string
    preReplacementLanguagePattern: string
    replaceDomNodeNames: Array<string>
    replacementDomNodeNames: Array<string>
    replacementLanguagePattern: string
    selection: Array<string>
    selectors: {knownTranslation: string}
    sessionDescription: string
    templateDelimiter: (
        null |
        {
            pre: string
            post: string
        }
    )
}
export type Options = DefaultOptions
// endregion
