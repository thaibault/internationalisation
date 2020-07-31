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
    $DomNode,
    $DomNodes as $BaseDomNodes,
    DomNodes as BaseDomNodes,
    HTMLItem,
    Mapping,
    Options as BaseOptions,
    RecursivePartial,
    Scope as BaseScope
} from 'clientnode/type'
// endregion
// region exports
export type InternationalisationFunction<TElement = HTMLElement> =
    (...parameter:Array<any>) => $DomNode<TElement>
export interface Scope<TElement = HTMLElement> extends BaseScope<TElement> {
    Internationalisation:InternationalisationFunction<TElement>;
}
declare global {
    interface JQuery<TElement = HTMLElement> extends Scope<TElement> {}
}
export type Replacement = {
    $textNodeToTranslate:$DomNode<HTMLItem>;
    $nodeToReplace:$DomNode<HTMLItem>;
    textToReplace:string;
    $currentLanguageDomNode:null|$DomNode<HTMLItem>;
}
export type DomNodes<Type = string> = RecursivePartial<BaseDomNodes> & {
    knownTranslation:Type;
}
export type $DomNodes =
    RecursivePartial<$BaseDomNodes> &
    DomNodes<$DomNode> &
    {switchLanguageButtons:$DomNode<HTMLLinkElement>}
export type Options = RecursivePartial<BaseOptions> & {
    currentLanguageIndicatorClassName:string;
    currentLanguagePattern:string;
    default:string;
    domNodes:DomNodes;
    fadeEffect:boolean;
    initial:null|string;
    languageHashPrefix:string;
    languageMapping:Mapping<Array<string>>;
    onSwitched:Function;
    onEnsured:Function;
    onSwitch:Function;
    onEnsure:Function;
    preReplacementLanguagePattern:string;
    replaceDomNodeNames:Array<string>;
    replacementDomNodeName:Array<string>;
    replacementLanguagePattern:string;
    selection:Array<string>;
    sessionDescription:string;
    templateDelimiter:{
        pre:string;
        post:string;
    };
    textNodeParent:{
        hideAnimation:[Mapping<number|string>, Mapping<number|string>];
        showAnimation:[Mapping<number|string>, Mapping<number|string>];
    };
    toolsLockDescription:string;
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
