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
import type {$DomNode, $Deferred} from 'jQuery-tools'
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
browserAPI((window:Window, alreadyLoaded:boolean):void => {
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
    else if (!alreadyLoaded)
        QUnit.start()
    // / region mock-up
    const $bodyDomNode:$DomNode = $('body')
    if ('localStorage' in window)
        window.localStorage.removeItem('Lang')
    const lang:$Deferred<Lang> = $.Lang({
        allowedLanguages: ['enUS', 'deDE', 'frFR'],
        domNodeSelectorPrefix: 'body #qunit-fixture',
        initial: 'enUS'
    })
    // / endregion
    lang.always((lang:Lang):void => {
        // region tests
        // / region public methods
        // // region special
        QUnit.test('initialize', (assert:Object):$Deferred<Lang> =>
            lang.initialize().always((subLang:Lang):void => assert.strictEqual(
                subLang, lang)))
        // // endregion
        QUnit.test('switch', (assert:Object):void => {
            lang.switch('en').always((subLang:Lang):void => assert.strictEqual(
                subLang, lang))
            $('#qunit-fixture').html(`
                <div>
                    english
                    <!--deDE:german-->
                </div>
            `)
            const done:Function = assert.async()
            lang.switch('deDE').always(():void => assert.ok(
                $.Tools.class.isEquivalentDom($('#qunit-fixture').html(
                ).replace(/(?: |\n)+/g, ' '),
                ' <div>german<!--deDE--><!--enUS: english --> </div> ')
            )).then(():$Deferred<Lang> => lang.switch('deDE').always(():void =>
                assert.ok($.Tools.class.isEquivalentDom(
                    $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
                    ' <div>german<!--deDE--><!--enUS: english --> </div> '))
            )).then(():$Deferred<Lang> => lang.switch('en').always(():void =>
                assert.ok($.Tools.class.isEquivalentDom(
                    $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
                    ' <div> english <!--enUS--><!--deDE:german--> </div> '))
            )).then(():$Deferred<Lang> => {
                $('#qunit-fixture').html(`
                    <div class="toc">
                        <ul>
                            <li>
                                <a href="#">english</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        english
                        <!--deDE:german-->
                    </div>
                `)
                return lang.initialize().then((
                    subLang:Lang
                ):$Deferred<Lang> => subLang.switch('de').always(():void => {
                    assert.ok(
                        $.Tools.class.isEquivalentDom($('#qunit-fixture').html(
                        ).replace(/(?: |\n)+/g, ' '),
                        ' <div class="toc"> ' +
                            '<ul> <li> <a href="#">german</a> </li> </ul>' +
                        ' </div>' +
                        ' <div>german<!--deDE--><!--enUS: english --> </div> ')
                    )
                }))
            }).then(done)
        })
        QUnit.test('refresh', (assert:Object):$Deferred<Lang> => lang.refresh(
        ).always((subLang:Lang):void => assert.strictEqual(subLang, lang)))
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
        QUnit.test('_handleSwitchEffect', (assert:Object):$Deferred<Lang> =>
            lang._handleSwitchEffect('deDE', false).always((
                subLang:Lang
            ):void => assert.strictEqual(subLang, lang)))
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
            $.Lang().always((lang:Lang):void => {
                assert.strictEqual(lang._switchLanguage('deDE'), lang)
                assert.strictEqual(lang.currentLanguage, 'deDE')
            })
        )
        QUnit.test('_switchCurrentLanguageIndicator', (assert:Object):void =>
            assert.strictEqual(
                lang._switchCurrentLanguageIndicator('deDE'), lang))
        // / endregion
        // endregion
    })
    // region hot module replacement handler
    if (typeof module === 'object' && 'hot' in module && module.hot) {
        module.hot.accept()
        // IgnoreTypeCheck
        module.hot.dispose(():void => {
            /*
                NOTE: We have to delay status indicator reset because qunits
                status updates are delayed as well.
            */
            setTimeout(():void => {
                if (!$('.fail').length) {
                    window.document.title = '✔ test'
                    $('#qunit-banner').removeClass('qunit-fail').addClass(
                        'qunit-pass')
                }
            }, 0)
            $('#qunit-tests').html('')
            console.clear()
        })
    }
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
