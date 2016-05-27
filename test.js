// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import browserAPI from 'webOptimizer/browserAPI'
import type {Window} from 'webOptimizer/type'
import type {$DomNode} from 'jQuery-tools'
/* eslint-disable no-duplicate-imports */
import type Lang from './index'
/* eslint-enable no-duplicate-imports */
// endregion
// region declaration
declare var TARGET:string
/* eslint-disable no-unused-vars */
declare var window:Window
/* eslint-enable no-unused-vars */
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
const qunit:Object = (TARGET === 'node') ? require('qunit-cli') : require(
    'qunitjs')
browserAPI((window:Window):void => {
    /*
        NOTE: We have to define window globally before jQuery is loaded to
        ensure that all jquery instances share the same window object.
    */
    if (typeof global !== 'undefined') {
        global.window = window
        for (const key in window)
            if (window.hasOwnProperty(key) && !global.hasOwnProperty(key))
                global[key] = window[key]
    }
    const $:JQueryFunction = require('jquery')
    $.context = window.document
    require('./index')
    if (TARGET === 'node')
        qunit.load()
    else
        qunit.start()
    // / region mock-up
    const $bodyDomNode:$DomNode = $('body')
    const lang:Lang = $.Lang()
    // / endregion
    // region tests
    // / region public methods
    // // region special
    qunit.test('initialize', ():void => qunit.ok(lang))
    // // endregion
    qunit.test('switch', ():void => qunit.strictEqual(lang.switch('en'), lang))
    qunit.test('refresh', ():void => qunit.strictEqual(lang.refresh(), lang))
    // / endregion
    // / region protected methods
    qunit.test('_normalizeLanguage', ():void => {
        qunit.strictEqual(lang._normalizeLanguage('de'), 'deDE')
        qunit.strictEqual(lang._normalizeLanguage('de-de'), 'deDE')
        qunit.strictEqual(lang._normalizeLanguage('en-us'), 'enUS')
        qunit.strictEqual(lang._normalizeLanguage('fr'), 'frFR')
        qunit.strictEqual(lang._normalizeLanguage(''), 'enUS')
    })
    qunit.test('_determineUsefulLanguage', ():void => {
        if (typeof window.localStorage !== 'undefined') {
            window.localStorage[lang._options.sessionDescription] = 'enUS'
            qunit.strictEqual(lang._determineUsefulLanguage(), 'enUS')
            delete window.localStorage[lang._options.sessionDescription]
        }
        let referenceLanguage:string = lang._options.default
        if (typeof navigator.language !== 'undefined')
            referenceLanguage = navigator.language
        qunit.strictEqual(
            lang._normalizeLanguage(lang._determineUsefulLanguage()),
            lang._normalizeLanguage(referenceLanguage))
    })
    qunit.test('_handleSwitchEffect', ():void => qunit.strictEqual(
        lang._handleSwitchEffect('deDE'), lang))
    qunit.test('_addTextNodeToFade', ():void => qunit.strictEqual(
        lang._addTextNodeToFade($bodyDomNode), lang))
    qunit.test('_registerTextNodeToChange', ():void => {
        lang._registerTextNodeToChange($bodyDomNode, 1, [1, 2, 3], 1)

        qunit.strictEqual(lang._replacements.length, 1)
        lang._replacements.pop()
    })
    qunit.test('_checkLastTextNodeHavingLanguageIndicator', () =>
        qunit.strictEqual(
            lang._checkLastTextNodeHavingLanguageIndicator(null, 1), 1))
    qunit.test('_handleLanguageSwitching', ():void => {
        lang = $.Lang()
        qunit.strictEqual lang._handleLanguageSwitching(), lang
    })
    qunit.test('_switchLanguage', ():void => {
        lang = $.Lang()
        qunit.strictEqual(lang._switchLanguage('deDE'), lang)
        qunit.strictEqual(lang.currentLanguage, 'deDE')
    })
    qunit.test('_switchCurrentLanguageIndicator', ():void => qunit.strictEqual(
        lang._switchCurrentLanguageIndicator('deDE'), lang))
    // / endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
