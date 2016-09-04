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
import type {$Deferred, $DomNode} from 'clientNode'
import registerTest from 'clientNode/test'
import type Language from './index'
// endregion
// region declaration
declare var DEBUG:boolean
declare var TARGET_TECHNOLOGY:string
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
registerTest(function(
    roundType:string, targetTechnology:?string, $:any
):$Deferred<Language> {
    require('./index')
    const $bodyDomNode:$DomNode = $('body')
    if ('localStorage' in browserAPI.window)
        browserAPI.window.localStorage.removeItem('Language')
    const languageDeferred:$Deferred<Language> = $.Language({
        allowedLanguages: ['enUS', 'deDE', 'frFR'],
        domNodeSelectorPrefix: 'body #qunit-fixture',
        initial: 'enUS'
    })
    return languageDeferred.always((language:Language):void => {
        // region tests
        // / region public methods
        // // region special
        this.test('initialize', (assert:Object):$Deferred<Language> =>
            language.initialize().then((subLanguage:Language):void => assert.strictEqual(
                subLanguage, language
            )).then(assert.async()))
        // // endregion
        this.test('switch', (assert:Object):$Deferred<Language> => language.switch(
            'en'
        ).then((subLanguage:Language):void => assert.strictEqual(subLanguage, language)).then((
        ):$Deferred<Language> => {
            $('#qunit-fixture').html(
                '<div>english<!--deDE:german--></div>')
            return language.switch('deDE').always(():void => assert.ok(
                $.Tools.class.isEquivalentDom($('#qunit-fixture').html(
                ).replace(/(?: |\n)+/g, ' '), (
                    '<div style="opacity: 1">' +
                        'german<!--deDE--><!--enUS:english-->' +
                    '</div>'))))
        }).then(():$Deferred<Language> => language.switch('deDE').always(
            ():void => assert.ok($.Tools.class.isEquivalentDom(
                $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
                '<div style="opacity: 1">' +
                    'german<!--deDE--><!--enUS:english-->' +
                '</div>'))
        )).then(():$Deferred<Language> => language.switch('en').always(():void =>
            assert.ok($.Tools.class.isEquivalentDom(
                $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
                '<div style="opacity: 1">' +
                    'english<!--enUS--><!--deDE:german-->' +
                '</div>'))
        )).then(():$Deferred<Language> => {
            $('#qunit-fixture').html(`
                <div class="toc">
                    <ul><li><a href="#">english</a></li></ul>
                </div>
                <div>english<!--deDE:german--></div>
            `)
            return language.initialize().then((
                subLanguage:Language
            ):$Deferred<Language> => subLanguage.switch('de').always(():void =>
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
        this.test('refresh', (assert:Object):$Deferred<Language> =>
            language.refresh().then((subLanguage:Language):void =>
                assert.strictEqual(subLanguage, language)
            ).then(assert.async()))
        // / endregion
        // / region protected methods
        this.test('_normalizeLanguage', (assert:Object):void => {
            for (const test:Array<string> of [
                ['de', 'deDE'],
                ['de-de', 'deDE'],
                ['en-us', 'enUS'],
                ['fr', 'frFR'],
                ['', 'enUS']
            ])
                assert.strictEqual(language._normalizeLanguage(test[0]), test[1])
        })
        this.test('_determineUsefulLanguage', (assert:Object):void => {
            if (typeof browserAPI.window.localStorage !== 'undefined') {
                browserAPI.window.localStorage[
                    language._options.sessionDescription
                ] = 'enUS'
                assert.strictEqual(language._determineUsefulLanguage(), 'enUS')
                delete browserAPI.window.localStorage[
                    language._options.sessionDescription]
            }
            let referenceLanguage:string = language._options.default
            if (typeof navigator.language !== 'undefined')
                referenceLanguage = navigator.language
            assert.strictEqual(
                language._normalizeLanguage(language._determineUsefulLanguage()),
                language._normalizeLanguage(referenceLanguage))
        })
        this.test('_handleSwitchEffect', (assert:Object):$Deferred<Language> =>
            language._handleSwitchEffect('deDE', false).then((
                subLanguage:Language
            ):void => assert.strictEqual(subLanguage, language)).then(assert.async()))
        this.test('_addTextNodeToFade', (assert:Object):void =>
            assert.strictEqual(language._addTextNodeToFade($bodyDomNode), language))
        this.test('_registerTextNodeToChange', (assert:Object):void => {
            language._registerTextNodeToChange(
                $bodyDomNode, $bodyDomNode.children(), ['1', '2', '3'],
                $bodyDomNode.children())

            assert.strictEqual(language._replacements.length, 1)
            language._replacements = []
        })
        this.test('_ensureLastTextNodeHavingLanguageIndicator', (
            assert:Object
        ):void => assert.strictEqual(
            language._ensureLastTextNodeHavingLanguageIndicator(null, null, false),
            null))
        this.test('_switchLanguage', (assert:Object):$Deferred<Language> =>
            $.Language().then((language:Language):void => {
                assert.strictEqual(language._switchLanguage('deDE'), language)
                assert.strictEqual(language.currentLanguage, 'deDE')
            }).then(assert.async()))
        this.test('_switchCurrentLanguageIndicator', (assert:Object):void =>
            assert.strictEqual(
                language._switchCurrentLanguageIndicator('deDE'), language))
        // / endregion
        // endregion
    })
}, ['withJQuery'])
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
