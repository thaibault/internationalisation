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
import {beforeAll, describe, expect, test} from '@jest/globals'
import {
    $,
    $Global,
    $T,
    augment$,
    currentRequire,
    determine$,
    FirstParameter,
    HTMLItem,
    Tools
} from 'clientnode'
import {getInitializedBrowser} from 'weboptimizer/browser'

/*
    NOTE: Import and use only as type. Since real loading should be delayed
    until dom environment has been created.
*/
import Internationalisation from './index'
// endregion
describe('Internationalisation', (): void => {
    // region mockup
    let $domNode: $T<HTMLBodyElement>
    let internationalisation: Internationalisation<HTMLBodyElement>

    beforeAll(async (): Promise<void> => {
        await getInitializedBrowser()

        if (currentRequire)
            (globalThis as unknown as $Global).$ =
                currentRequire<typeof import('jquery')>('jquery')

        augment$(determine$())
        /*
            NOTE: Import plugin with side effects (augmenting "$" scope
            registering plugin) when other imports are only used as type.
        */
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./index')

        if (Object.prototype.hasOwnProperty.call(
            globalThis.window, 'localStorage'
        ))
            globalThis.window.localStorage.removeItem('Internationalisation')

        const $body = $(window.document.body as HTMLBodyElement)
        $domNode = await $body.Internationalisation({
            allowedLanguages: ['enUS', 'deDE', 'frFR'], initial: 'enUS'
        })

        internationalisation = $domNode.data('Internationalisation') as
            Internationalisation<HTMLBodyElement>
    })
    // endregion
    // region tests
    /// region public methods
    //// region special
    test('initialize', (): Promise<void> =>
        expect(internationalisation.initialize())
            .resolves
            .toStrictEqual($domNode)
    )
    //// endregion
    test('switch', async (): Promise<void> => {
        expect(await internationalisation.switch('en')).toStrictEqual($domNode)
        $domNode.html('<div>english<!--deDE:german--></div>')
        await internationalisation.switch('deDE')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/[ \n]+/g, ' '),
            (
                '<div style="opacity: 1">' +
                    'german<!--deDE--><!--enUS:english-->' +
                '</div>'
            )
        )).toStrictEqual(true)

        await internationalisation.switch('deDE')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/[ \n]+/g, ' '),
            '<div style="opacity: 1">' +
                'german<!--deDE--><!--enUS:english-->' +
            '</div>'
        )).toStrictEqual(true)
        await internationalisation.switch('en')
        expect(Tools.isEquivalentDOM(
            $domNode.html().replace(/[ \n]+/g, ' '),
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
            $domNode.html().replace(/[ \n]+/g, ' '),
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
    test('refresh', (): Promise<void> =>
        expect(internationalisation.refresh()).resolves.toStrictEqual($domNode)
    )
    /// endregion
    /// region protected methods
    /*
        NOTE: We cannot use clientnode's "testEach" helper since
        "internationalisation isn't available during test specification time.
    */
    test.each([
        ['deDE', 'de'],
        ['deDE', 'de-de'],
        ['enUS', 'en-us'],
        ['frFR', 'fr'],
        ['enUS', '']
    ])(
        `'%s' === _normalizeLanguage('%s')`,
        (
            expected: ReturnType<Internationalisation['_normalizeLanguage']>,
            given: FirstParameter<Internationalisation['_normalizeLanguage']>
        ) => {
            expect(internationalisation._normalizeLanguage(given))
                .toStrictEqual(expected)
        }
    )
    test('_determineUsefulLanguage', (): void => {
        if (typeof globalThis.window.localStorage !== 'undefined') {
            globalThis.window.localStorage[
                internationalisation.options.sessionDescription
            ] = 'enUS'
            expect(internationalisation._determineUsefulLanguage())
                .toStrictEqual('enUS')
            delete globalThis.window.localStorage[
                internationalisation.options.sessionDescription
            ]
        }
        let referenceLanguage: string = internationalisation.options.default
        if (
            Object.prototype.hasOwnProperty.call(globalThis, 'navigator') &&
            typeof globalThis.navigator.language !== 'undefined'
        )
            referenceLanguage = globalThis.navigator.language
        expect(internationalisation._normalizeLanguage(
            internationalisation._determineUsefulLanguage()
        )).toStrictEqual(
            internationalisation._normalizeLanguage(referenceLanguage)
        )
    })
    test('_handleSwitchEffect', (): Promise<void> =>
        expect(internationalisation._handleSwitchEffect('deDE', false))
            .resolves
            .toBeUndefined()
    )
    test('_addTextNodeToFade', () => {
        internationalisation._addTextNodeToFade($domNode)

        expect(internationalisation._$domNodeToFade?.has($domNode[0]).length)
            .toStrictEqual(1)
    })
    test('_registerTextNodeToChange', () => {
        internationalisation._registerTextNodeToChange(
            $domNode,
            $domNode.children() as $T<HTMLItem>,
            ['1', '2', '3'],
            $domNode.children()
        )

        expect(internationalisation._replacements[0].$textNodeToTranslate)
            .toStrictEqual($domNode)

        expect(internationalisation._replacements).toHaveLength(1)
        internationalisation._replacements = []
    })
    test('_ensureLastTextNodeHavingLanguageIndicator', () => {
        expect(internationalisation._ensureLastTextNodeHavingLanguageIndicator(
            null, null, false
        )).toStrictEqual(null)
    })
    test('_switchLanguage', async (): Promise<void> => {
        const subInternationalisation: Internationalisation<HTMLBodyElement> =
            (await $domNode.Internationalisation())
                .data('Internationalisation') as
                    Internationalisation<HTMLBodyElement>

        subInternationalisation._switchLanguage('enUS')
        expect(subInternationalisation.currentLanguage)
            .toStrictEqual('enUS')

        subInternationalisation._switchLanguage('deDE')
        expect(subInternationalisation.currentLanguage)
            .toStrictEqual('deDE')
    })
    test('_switchCurrentLanguageIndicator', () => {
        const englishLink =
            `#${internationalisation.options.languageHashPrefix}enUS`
        const $englishLink = $(`<a href="${englishLink}">`)
        const germanLink =
            `#${internationalisation.options.languageHashPrefix}deDE`
        const $germanLink = $(`<a href="${germanLink}">`)
        $domNode.append($englishLink)
        $domNode.append($germanLink)

        internationalisation._switchCurrentLanguageIndicator('enUS')
        internationalisation.currentLanguage = 'enUS'

        expect($englishLink.hasClass(
            internationalisation.options.currentLanguageIndicatorClassName
        )).toStrictEqual(true)
        expect($germanLink.hasClass(
            internationalisation.options.currentLanguageIndicatorClassName
        )).toStrictEqual(false)

        internationalisation._switchCurrentLanguageIndicator('deDE')
        internationalisation.currentLanguage = 'deDE'

        expect($englishLink.hasClass(
            internationalisation.options.currentLanguageIndicatorClassName
        )).toStrictEqual(false)
        expect($germanLink.hasClass(
            internationalisation.options.currentLanguageIndicatorClassName
        )).toStrictEqual(true)
    })
    /// endregion
    // endregion
})
