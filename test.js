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
import type {Location, Window} from 'webOptimizer/type'
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
browserAPI((window:Window, location:Location) => {
    // NOTE: We have to define window globally before jQuery is loaded to
    // ensure that all jquery instances share the same window object.
    if (typeof global !== 'undefined')
        global.window = window
    const $:JQueryFunction = require('jquery')
    $.context = window.document
    require('index')
    if (TARGET === 'node')
        qunit.load()
    else
        qunit.start()
    // region tests
    // / region mock-up
    const lang = $.Lang()
    // / endregion
    // / region public methods
    // // region special
    qunit.test('initialize', () => qunit.ok(lang))
    // // endregion
    qunit.test('switch', () => qunit.strictEqual(lang.switch('en'), lang))
    qunit.test('refresh', () => qunit.strictEqual(lang.refresh(), lang))
    // / endregion
    // / region protected methods
    qunit.test('_normalizeLanguage', () => {
        qunit.strictEqual(lang._normalizeLanguage('de'), 'deDE')
        qunit.strictEqual(lang._normalizeLanguage('de-de'), 'deDE')
        qunit.strictEqual(lang._normalizeLanguage('en-us'), 'enUS')
        qunit.strictEqual(lang._normalizeLanguage('fr'), 'frFR')
        qunit.strictEqual(lang._normalizeLanguage(''), 'enUS')
    })
    qunit.test('_determineUsefulLanguage', () => {
        if (typeof window.localStorage !== 'undefined') {
            window.localStorage[lang._options.sessionDescription] = 'enUS'
            qunit.strictEqual(lang._determineUsefulLanguage(), 'enUS')
            delete window.localStorage[lang._options.sessionDescription]
        }
        const referenceLanguage = lang._options.default
        if (typeof navigator.language !== 'undefined')
            referenceLanguage = navigator.language
        qunit.strictEqual(
            lang._normalizeLanguage(lang._determineUsefulLanguage()),
            lang._normalizeLanguage(referenceLanguage))
    })
    // TODO stand
    test '_handleSwitchEffect', ->
        strictEqual lang._handleSwitchEffect('deDE'), lang
    test '_addTextNodeToFade', ->
        strictEqual lang._addTextNodeToFade($('body')), lang
    test '_registerTextNodeToChange', ->
        lang._registerTextNodeToChange $('body'), 1, [1, 2, 3], 1

        strictEqual lang._replacements.length, 1
        lang._replacements.pop()
    test '_checkLastTextNodeHavingLanguageIndicator', ->
        strictEqual lang._checkLastTextNodeHavingLanguageIndicator(null, 1), 1
    test '_handleLanguageSwitching', ->
        lang = $.Lang()
        strictEqual lang._handleLanguageSwitching(), lang
    test '_switchLanguage', ->
        lang = $.Lang()
        strictEqual lang._switchLanguage('deDE'), lang
        strictEqual lang.currentLanguage, 'deDE'
    test '_switchCurrentLanguageIndicator', ->
        strictEqual lang._switchCurrentLanguageIndicator('deDE'), lang
    ## endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
