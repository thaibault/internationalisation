// -*- coding: utf-8 -*-
/** @module type */
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
import {
    HTMLItem, Mapping, Options as BaseOptions, UnknownFunction
} from 'clientnode'
// endregion
// region exports
export interface Replacement {
    textNodeToTranslate: HTMLItem
    nodeToReplace: HTMLItem
    textToReplace: string
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
    name: string
    preReplacementLanguagePattern: string
    replaceDomNodeNames: Array<string>
    replacementDomNodeName: Array<string>
    replacementLanguagePattern: string
    selection: Array<string>
    selectors: {
        knownTranslation: string
    }
    sessionDescription: string
    templateDelimiter: (
        null |
        {
            pre: string
            post: string
        }
    )
    textNodeParent: {
        hideAnimation: [Mapping<number|string>, Mapping<number|string>]
        showAnimation: [Mapping<number|string>, Mapping<number|string>]
    }
}
export type Options = DefaultOptions
// endregion
