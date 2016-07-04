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
import type Lang from './index'
// endregion
// region declaration
declare var TARGET:string
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
const QUnit:Object = (TARGET === 'node') ? require('qunit-cli') : require(
    'qunitjs')
browserAPI((window:Window):void => {
    /*
        NOTE: We have to define window globally before jQuery is loaded to
        ensure that all jquery instances share the same window object.
    */
    if (typeof global !== 'undefined' && global !== window) {
        global.window = window
        for (const key in window)
            if (window.hasOwnProperty(key) && !global.hasOwnProperty(key))
                global[key] = window[key]
    }
    const $:JQueryFunction = require('jquery')
    $.context = window.document
    require('./index')
    if (TARGET === 'node')
        QUnit.load()
    else
        QUnit.start()
    // / region mock-up
    const $bodyDomNode:$DomNode = $('body')
    const lang:Lang = $.Lang()
    // / endregion
    // region tests
    // / region public methods
    // // region special
    QUnit.test('initialize', (assert:Object):void => assert.ok(lang))
    // // endregion
    QUnit.test('switch', (assert:Object):void => assert.strictEqual(
        lang.switch('en'), lang))
    QUnit.test('refresh', (assert:Object):void => assert.strictEqual(
        lang.refresh(), lang))
    // / endregion
    // / region protected methods
    QUnit.test('_normalizeLanguage', (assert:Object):void => {
        assert.strictEqual(lang._normalizeLanguage('de'), 'deDE')
        assert.strictEqual(lang._normalizeLanguage('de-de'), 'deDE')
        assert.strictEqual(lang._normalizeLanguage('en-us'), 'enUS')
        assert.strictEqual(lang._normalizeLanguage('fr'), 'frFR')
        assert.strictEqual(lang._normalizeLanguage(''), 'enUS')
    })
    QUnit.test('_determineUsefulLanguage', (assert:Object):void => {
        if (typeof window.localStorage !== 'undefined') {
            window.localStorage[lang._options.sessionDescription] = 'enUS'
            assert.strictEqual(lang._determineUsefulLanguage(), 'enUS')
            delete window.localStorage[lang._options.sessionDescription]
        }
        let referenceLanguage:string = lang._options.default
        if (typeof navigator.language !== 'undefined')
            referenceLanguage = navigator.language
        assert.strictEqual(
            lang._normalizeLanguage(lang._determineUsefulLanguage()),
            lang._normalizeLanguage(referenceLanguage))
    })
    QUnit.test('_handleSwitchEffect', (assert:Object):void =>
        assert.strictEqual(lang._handleSwitchEffect('deDE', false), lang))
    QUnit.test('_addTextNodeToFade', (assert:Object):void =>
        assert.strictEqual(lang._addTextNodeToFade($bodyDomNode), lang))
    QUnit.test('_registerTextNodeToChange', (assert:Object):void => {
        lang._registerTextNodeToChange($bodyDomNode, $bodyDomNode.children(),
        ['1', '2', '3'], $bodyDomNode.children())

        assert.strictEqual(lang._replacements.length, 1)
        lang._replacements.pop()
    })
    QUnit.test('_checkLastTextNodeHavingLanguageIndicator', (
        assert:Object
    ):void => assert.strictEqual(
        lang._checkLastTextNodeHavingLanguageIndicator(null, null, false),
        null))
    QUnit.test('_handleLanguageSwitching', (assert:Object):void => {
        const lang:Lang = $.Lang()
        assert.strictEqual(lang._handleLanguageSwitching('enUS', true), lang)
    })
    QUnit.test('_switchLanguage', (assert:Object):void => {
        const lang:Lang = $.Lang()
        assert.strictEqual(lang._switchLanguage('deDE'), lang)
        assert.strictEqual(lang.currentLanguage, 'deDE')
    })
    QUnit.test('_switchCurrentLanguageIndicator', (assert:Object):void =>
        assert.strictEqual(lang._switchCurrentLanguageIndicator('deDE'), lang))
    // / endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
