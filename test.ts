// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import Tools, {augment$, determine$} from 'clientnode'
import {$Global, $DomNode} from 'clientnode/type'
import {getInitializedBrowser} from 'weboptimizer/browser'
import {InitializedBrowser} from 'weboptimizer/type'

/*
    NOTE: Import and use only as type. Since real loading should be delayed
    until dom environment has been created.
*/
import Internationalisation from './index'
// endregion
describe('Internationalisation', ():void => {
    // region mockup
    let $domNode:$DomNode<HTMLBodyElement>
    let internationalisation:Internationalisation<HTMLBodyElement>
    let internationalisationClass:typeof Internationalisation
    beforeAll(async ():Promise<void> => {
        const browser:InitializedBrowser = await getInitializedBrowser()
        globalThis.window = browser.window as Window & typeof globalThis
        (globalThis as $Global).$ = require('jquery')
        augment$(determine$())
        /*
            NOTE: Import plugin with side effects (augmenting "$" scope /
            registering plugin) when other imports are only used as type.
        */
        internationalisationClass = require('./index').default
        if (globalThis.window.localStorage)
            globalThis.window.localStorage
                .removeItem(internationalisationClass._name)
        $domNode = await $(window.document.body as HTMLBodyElement)
            .Internationalisation({
                allowedLanguages: ['enUS', 'deDE', 'frFR'], initial: 'enUS'
            })
        internationalisation = $domNode.data(internationalisationClass._name)
    })
    // endregion
    // region tests
    // / region public methods
    // // region special
    test('initialize', ():Promise<void> =>
        expect(internationalisation.initialize())
            .resolves
            .toStrictEqual($domNode)
    )
    // // endregion
    test('switch', async ():Promise<void> => {
        expect(await internationalisation.switch('en')).toStrictEqual($domNode)
        $domNode.html('<div>english<!--deDE:german--></div>')
        await internationalisation.switch('deDE')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/(?: |\n)+/g, ' '),
            (
                '<div style="opacity: 1">' +
                    'german<!--deDE--><!--enUS:english-->' +
                '</div>'
            )
        )).toStrictEqual(true)
        return
        await internationalisation.switch('deDE')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/(?: |\n)+/g, ' '),
            '<div style="opacity: 1">' +
                'german<!--deDE--><!--enUS:english-->' +
            '</div>'
        )).toStrictEqual(true)
        await internationalisation.switch('en')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/(?: |\n)+/g, ' '),
            '<div style="opacity: 1">' +
                'english<!--enUS--><!--deDE:german-->' +
            '</div>'
        )).toStrictEqual(true)
        $domNode.html(`
            <div class="toc">
                <ul><li><a href="#">english</a></li></ul>
            </div>
            <div>english<!--deDE:german--></div>
        `)
        await internationalisation.initialize()
        await internationalisation.switch('de')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/(?: |\n)+/g, ' '),
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
            '</div> '
        )).toStrictEqual(true)
    })
    test('refresh', ():Promise<void> =>
        expect(internationalisation.refresh()).resolves.toStrictEqual($domNode)
    )
    // / endregion
    // / region protected methods
    test.each([
        ['de', 'deDE'],
        ['de-de', 'deDE'],
        ['en-us', 'enUS'],
        ['fr', 'frFR'],
        ['', 'enUS']
    ])(
        `_normalizeLanguage('%s') === '%s'`,
        (given:string, expected:string):void =>
            expect(internationalisation._normalizeLanguage(given))
                .toStrictEqual(expected)
    )
    test('_determineUsefulLanguage', ():void => {
        if (typeof globalThis.window.localStorage !== 'undefined') {
            globalThis.window.localStorage[
                internationalisation._options.sessionDescription
            ] = 'enUS'
            expect(internationalisation._determineUsefulLanguage())
                .toStrictEqual('enUS')
            delete globalThis.window.localStorage[
                internationalisation._options.sessionDescription
            ]
        }
        let referenceLanguage:string = internationalisation._options.default
        if (
            'navigator' in globalThis &&
            globalThis.navigator &&
            typeof globalThis.navigator.language !== 'undefined'
        )
            referenceLanguage = globalThis.navigator.language
        expect(internationalisation._normalizeLanguage(
            internationalisation._determineUsefulLanguage()
        )).toStrictEqual(
            internationalisation._normalizeLanguage(referenceLanguage)
        )
    })
    test('_handleSwitchEffect', ():Promise<void> =>
        expect(internationalisation._handleSwitchEffect('deDE', false))
            .resolves
            .toBeUndefined()
    )
    test('_addTextNodeToFade', ():void =>
        expect(internationalisation._addTextNodeToFade($domNode))
            .toBeUndefined()
    )
    test('_registerTextNodeToChange', ():void => {
        expect(internationalisation._registerTextNodeToChange(
            $domNode,
            $domNode.children(),
            ['1', '2', '3'],
            $domNode.children()
        )).toBeUndefined()

        expect(internationalisation._replacements).toHaveLength(1)
        internationalisation._replacements = []
    })
    test('_ensureLastTextNodeHavingLanguageIndicator', ():void =>
        expect(internationalisation._ensureLastTextNodeHavingLanguageIndicator(
            null, null, false
        )).toStrictEqual(null)
    )
    test('_switchLanguage', async ():Promise<void> => {
        const subInternationalisation:Internationalisation<HTMLBodyElement> =
            (await $domNode.Internationalisation())
                .data(internationalisationClass._name)
        expect(subInternationalisation._switchLanguage('deDE')).toBeUndefined()
        expect(subInternationalisation.currentLanguage).toStrictEqual('deDE')
    })
    test('_switchCurrentLanguageIndicator', ():void =>
        expect(internationalisation._switchCurrentLanguageIndicator('deDE'))
            .toBeUndefined()
    )
    // / endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
