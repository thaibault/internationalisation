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
import type {BrowserAPI} from 'webOptimizer/type'
import type {$DomNode, $Deferred} from 'jQuery-tools'
import type Lang from './index'
// endregion
// region declaration
declare var DEBUG:boolean
declare var TARGET_TECHNOLOGY:string
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
let QUnit:Object
if (typeof TARGET_TECHNOLOGY === 'undefined' || TARGET_TECHNOLOGY === 'node')
    QUnit = require('qunit-cli')
else
    QUnit = DEBUG ? require('qunitjs') : (
        require('script!qunitjs') && window.QUnit)
browserAPI((browserAPI:BrowserAPI):void => {
    const $:JQueryFunction = require('jquery')
    $.context = browserAPI.window.document
    require('./index')
    // region configuration
    QUnit.config = $.extend(QUnit.config || {}, {
        /*
        notrycatch: true,
        noglobals: true,
        */
        altertitle: true,
        autostart: true,
        fixture: '',
        hidepassed: false,
        maxDepth: 3,
        reorder: false,
        requireExpects: false,
        testTimeout: 30 * 1000,
        scrolltop: false
    })
    const $bodyDomNode:$DomNode = $('body')
    if ('localStorage' in browserAPI.window)
        browserAPI.window.localStorage.removeItem('Lang')
    const langDeferred:$Deferred<Lang> = $.Lang({
        allowedLanguages: ['enUS', 'deDE', 'frFR'],
        domNodeSelectorPrefix: 'body #qunit-fixture',
        initial: 'enUS'
    })
    // endregion
    langDeferred.always((lang:Lang):void => {
        // region tests
        // / region public methods
        // // region special
        QUnit.test('initialize', (assert:Object):$Deferred<Lang> =>
            lang.initialize().then((subLang:Lang):void => assert.strictEqual(
                subLang, lang
            )).then(assert.async()))
        // // endregion
        QUnit.test('switch', (assert:Object):$Deferred<Lang> => lang.switch(
            'en'
        ).then((subLang:Lang):void => assert.strictEqual(subLang, lang)).then((
        ):$Deferred<Lang> => {
            $('#qunit-fixture').html(
                '<div>english<!--deDE:german--></div>')
            return lang.switch('deDE').always(():void => assert.ok(
                $.Tools.class.isEquivalentDom($('#qunit-fixture').html(
                ).replace(/(?: |\n)+/g, ' '), (
                    '<div style="opacity: 1">' +
                        'german<!--deDE--><!--enUS:english-->' +
                    '</div>'))))
        }).then(():$Deferred<Lang> => lang.switch('deDE').always(
            ():void => assert.ok($.Tools.class.isEquivalentDom(
                $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
                '<div style="opacity: 1">' +
                    'german<!--deDE--><!--enUS:english-->' +
                '</div>'))
        )).then(():$Deferred<Lang> => lang.switch('en').always(():void =>
            assert.ok($.Tools.class.isEquivalentDom(
                $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
                '<div style="opacity: 1">' +
                    'english<!--enUS--><!--deDE:german-->' +
                '</div>'))
        )).then(():$Deferred<Lang> => {
            $('#qunit-fixture').html(`
                <div class="toc">
                    <ul><li><a href="#">english</a></li></ul>
                </div>
                <div>english<!--deDE:german--></div>
            `)
            return lang.initialize().then((
                subLang:Lang
            ):$Deferred<Lang> => subLang.switch('de').always(():void =>
                assert.ok(
                    $.Tools.class.isEquivalentDom($('#qunit-fixture').html(
                    ).replace(/(?: |\n)+/g, ' '),
                    ' <div class="toc"> ' +
                        '<ul>' +
                            '<li style="opacity: 1">' +
                                '<a href="#">' +
                                    'german' +
                                '</a>' +
                            '</li>' +
                        '</ul>' +
                    ' </div>' +
                    ' <div style="opacity: 1">' +
                        'german<!--deDE--><!--enUS:english-->' +
                    '</div> '))
            ))
        }).then(assert.async()))
        QUnit.test('refresh', (assert:Object):$Deferred<Lang> =>
            lang.refresh().then((subLang:Lang):void =>
                assert.strictEqual(subLang, lang)
            ).then(assert.async()))
        // / endregion
        // / region protected methods
        QUnit.test('_normalizeLanguage', (assert:Object):void => {
            for (const test:Array<string> of [
                ['de', 'deDE'],
                ['de-de', 'deDE'],
                ['en-us', 'enUS'],
                ['fr', 'frFR'],
                ['', 'enUS']
            ])
                assert.strictEqual(lang._normalizeLanguage(test[0]), test[1])
        })
        QUnit.test('_determineUsefulLanguage', (assert:Object):void => {
            if (typeof browserAPI.window.localStorage !== 'undefined') {
                browserAPI.window.localStorage[
                    lang._options.sessionDescription
                ] = 'enUS'
                assert.strictEqual(lang._determineUsefulLanguage(), 'enUS')
                delete browserAPI.window.localStorage[
                    lang._options.sessionDescription]
            }
            let referenceLanguage:string = lang._options.default
            if (typeof navigator.language !== 'undefined')
                referenceLanguage = navigator.language
            assert.strictEqual(
                lang._normalizeLanguage(lang._determineUsefulLanguage()),
                lang._normalizeLanguage(referenceLanguage))
        })
        QUnit.test('_handleSwitchEffect', (assert:Object):$Deferred<Lang> =>
            lang._handleSwitchEffect('deDE', false).then((
                subLang:Lang
            ):void => assert.strictEqual(subLang, lang)).then(assert.async()))
        QUnit.test('_addTextNodeToFade', (assert:Object):void =>
            assert.strictEqual(lang._addTextNodeToFade($bodyDomNode), lang))
        QUnit.test('_registerTextNodeToChange', (assert:Object):void => {
            lang._registerTextNodeToChange(
                $bodyDomNode, $bodyDomNode.children(), ['1', '2', '3'],
                $bodyDomNode.children())

            assert.strictEqual(lang._replacements.length, 1)
            lang._replacements = []
        })
        QUnit.test('_ensureLastTextNodeHavingLanguageIndicator', (
            assert:Object
        ):void => assert.strictEqual(
            lang._ensureLastTextNodeHavingLanguageIndicator(null, null, false),
            null))
        QUnit.test('_switchLanguage', (assert:Object):$Deferred<Lang> =>
            $.Lang().then((lang:Lang):void => {
                assert.strictEqual(lang._switchLanguage('deDE'), lang)
                assert.strictEqual(lang.currentLanguage, 'deDE')
            }).then(assert.async()))
        QUnit.test('_switchCurrentLanguageIndicator', (assert:Object):void =>
            assert.strictEqual(
                lang._switchCurrentLanguageIndicator('deDE'), lang))
        // / endregion
        // endregion
        if (
            typeof TARGET_TECHNOLOGY === 'undefined' ||
            TARGET_TECHNOLOGY === 'node'
        )
            QUnit.load()
    })
    // region hot module replacement
    /*
        NOTE: hot module replacement doesn't work with async tests yet since
        qunit is not resetable yet:

        if (typeof module === 'object' && 'hot' in module && module.hot) {
            module.hot.accept()
            // IgnoreTypeCheck
            module.hot.dispose(():void => {
                QUnit.reset()
                console.clear()
            }
        }
    */
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
