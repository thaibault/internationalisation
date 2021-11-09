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
    DomNodes as BaseDomNodes,
    HTMLItem,
    Mapping,
    Options as BaseOptions,
    $DomNodes as $BaseDomNodes,
    $T
} from 'clientnode/type'
// endregion
// region exports
export type InternationalisationFunction<TElement = HTMLElement> =
    (..._parameters:Array<unknown>) => $T<TElement>

declare global {
    interface JQuery<TElement = HTMLElement> {
        Internationalisation:InternationalisationFunction<TElement>
    }
}

export interface Replacement {
    $textNodeToTranslate:$T<HTMLItem>
    $nodeToReplace:$T<HTMLItem>
    textToReplace:string
    $currentLanguageDomNode:null|$T<HTMLItem>
}

export type DomNodes<Type = string> =
    BaseDomNodes &
    {knownTranslation:Type}
export type $DomNodes =
    $BaseDomNodes &
    {switchLanguageButtons:$T<HTMLLinkElement>}

export interface DefaultOptions {
    currentLanguageIndicatorClassName:string
    currentLanguagePattern:string
    default:string
    domNodes:DomNodes
    fadeEffect:boolean
    initial:null|string
    languageHashPrefix:string
    languageMapping:Mapping<Array<string>>
    name:string
    onSwitched:Function
    onEnsured:Function
    onSwitch:Function
    onEnsure:Function
    preReplacementLanguagePattern:string
    replaceDomNodeNames:Array<string>
    replacementDomNodeName:Array<string>
    replacementLanguagePattern:string
    selection:Array<string>
    sessionDescription:string
    templateDelimiter:{
        pre:string
        post:string
    }
    textNodeParent:{
        hideAnimation:[Mapping<number|string>, Mapping<number|string>]
        showAnimation:[Mapping<number|string>, Mapping<number|string>]
    }
    toolsLockDescription:string
}
export type Options = BaseOptions & DefaultOptions
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
