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
import type {$DomNode} from 'clientnode'
import registerTest from 'clientnode/test'
// NOTE: Only needed for debugging this file.
try {
    module.require('source-map-support/register')
} catch (error) {}

import type Language from './index'
// endregion
registerTest(async function(
    roundType:string, targetTechnology:?string, $:any
):Promise<void> {
    require('./index')
    const $bodyDomNode:$DomNode = $('body')
    if ('localStorage' in $.global.window)
        $.global.window.localStorage.removeItem('Language')
    const language:Language = await $.Language({
        allowedLanguages: ['enUS', 'deDE', 'frFR'],
        domNodeSelectorPrefix: 'body #qunit-fixture',
        initial: 'enUS'
    })
    // region tests
    // / region public methods
    // // region special
    this.test('initialize', (assert:Object):Promise<Language> =>
        language.initialize().then((subLanguage:Language):void =>
            assert.strictEqual(subLanguage, language)).then(assert.async()))
    // // endregion
    this.test('switch', async (assert:Object):Promise<void> => {
        const done:Function = assert.async()
        let subLanguage:Language = await language.switch('en')
        assert.strictEqual(subLanguage, language)
        $('#qunit-fixture').html('<div>english<!--deDE:german--></div>')
        await language.switch('deDE')
        assert.ok($.Tools.class.isEquivalentDom($('#qunit-fixture').html(
        ).replace(/(?: |\n)+/g, ' '), (
            '<div style="opacity: 1">' +
                'german<!--deDE--><!--enUS:english-->' +
            '</div>')))
        await language.switch('deDE')
        assert.ok($.Tools.class.isEquivalentDom(
            $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
            '<div style="opacity: 1">' +
                'german<!--deDE--><!--enUS:english-->' +
            '</div>'))
        await language.switch('en')
        assert.ok($.Tools.class.isEquivalentDom(
            $('#qunit-fixture').html().replace(/(?: |\n)+/g, ' '),
            '<div style="opacity: 1">' +
                'english<!--enUS--><!--deDE:german-->' +
            '</div>'))
        $('#qunit-fixture').html(`
            <div class="toc">
                <ul><li><a href="#">english</a></li></ul>
            </div>
            <div>english<!--deDE:german--></div>
        `)
        subLanguage = await language.initialize()
        await subLanguage.switch('de')
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
        done()
    })
    this.test('refresh', (assert:Object):Promise<Language> =>
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
            assert.strictEqual(
                language._normalizeLanguage(test[0]), test[1])
    })
    this.test('_determineUsefulLanguage', (assert:Object):void => {
        if (typeof $.global.window.localStorage !== 'undefined') {
            $.global.window.localStorage[
                language._options.sessionDescription
            ] = 'enUS'
            assert.strictEqual(language._determineUsefulLanguage(), 'enUS')
            delete $.global.window.localStorage[
                language._options.sessionDescription]
        }
        let referenceLanguage:string = language._options.default
        if (typeof $.global.navigator.language !== 'undefined')
            referenceLanguage = $.global.navigator.language
        assert.strictEqual(
            language._normalizeLanguage(
                language._determineUsefulLanguage()),
            language._normalizeLanguage(referenceLanguage))
    })
    this.test('_handleSwitchEffect', (assert:Object):Promise<Language> =>
        language._handleSwitchEffect('deDE', false).then((
            subLanguage:Language
        ):void => assert.strictEqual(subLanguage, language)).then(
            assert.async()))
    this.test('_addTextNodeToFade', (assert:Object):void =>
        assert.strictEqual(
            language._addTextNodeToFade($bodyDomNode), language))
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
        language._ensureLastTextNodeHavingLanguageIndicator(
            null, null, false
        ), null))
    this.test('_switchLanguage', (assert:Object):Promise<Language> =>
        $.Language().then((language:Language):void => {
            assert.strictEqual(language._switchLanguage('deDE'), language)
            assert.strictEqual(language.currentLanguage, 'deDE')
        }).then(assert.async()))
    this.test('_switchCurrentLanguageIndicator', (assert:Object):void =>
        assert.strictEqual(
            language._switchCurrentLanguageIndicator('deDE'), language))
    // / endregion
    // endregion
}, ['full'])
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
