// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module storelocator */
'use strict'
/* !
    region header
    [Project page](https://torben.website/storelocator)

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
    $DomNode, Options as BaseOptions, Scope as BaseScope
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
    $textNodeToTranslate:$DomNode;
    $nodeToReplace:$DomNode;
    textToReplace:string;
    $currentLanguageDomNode:?$DomNode;
}
export type Options = BaseOptions & {
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
