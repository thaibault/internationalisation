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
import {
    createDomNodes, FirstParameter, globalContext, HTMLItem, isEquivalentDOM
} from 'clientnode'
import {getInitializedBrowser} from 'weboptimizer/browser'

import {beforeAll, describe, expect, test} from '@jest/globals'

/*
    NOTE: Import and use only as type. Since real loading should be delayed
    until dom environment has been created.
*/
import Internationalization from './index'
// endregion
describe('Internationalisation', (): void => {
    // region mockup
    let root: Internationalization

    beforeAll(async (): Promise<void> => {
        await getInitializedBrowser()

        if (Object.prototype.hasOwnProperty.call(
            globalContext.window, 'localStorage'
        ))
            globalContext.window?.localStorage.removeItem(
                'Internationalisation'
            )

        customElements.define(
            'test-internationalization', Internationalization
        )

        root = (globalContext.document as Document)
            .createElement('test-internationalization') as
                Internationalization
        globalContext.document?.body.appendChild(root)
    })
    // endregion
    // region tests
    /// region public methods
    test('switch', async (): Promise<void> => {
        expect(await root.switch('en')).toStrictEqual(root)
        root.innerHTML = '<div>english<!--deDE:german--></div>'
        await root.switch('deDE')
        expect(isEquivalentDOM(
            root.innerHTML.replace(/[ \n]+/g, ' '),
            (
                '<div style="opacity: 1">' +
                    'german<!--deDE--><!--enUS:english-->' +
                '</div>'
            )
        )).toStrictEqual(true)

        await root.switch('deDE')
        expect(isEquivalentDOM(
            root.innerHTML.replace(/[ \n]+/g, ' '),
            '<div style="opacity: 1">' +
                'german<!--deDE--><!--enUS:english-->' +
            '</div>'
        )).toStrictEqual(true)
        await root.switch('en')
        expect(isEquivalentDOM(
            root.innerHTML.replace(/[ \n]+/g, ' '),
            '<div style="opacity: 1">' +
                'english<!--enUS--><!--deDE:german-->' +
            '</div>'
        )).toStrictEqual(true)
        root.innerHTML = `
            <div class="toc">
                <ul><li><a href="#">english</a></li></ul>
            </div>
            <div>english<!--deDE:german--></div>
        `
        await root.switch('de')
        expect(isEquivalentDOM(
            root.innerHTML.replace(/[ \n]+/g, ' '),
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
        expect(root.refresh()).resolves.toStrictEqual(root)
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
            expected: ReturnType<Internationalization['_normalizeLanguage']>,
            given: FirstParameter<Internationalization['_normalizeLanguage']>
        ) => {
            expect(root._normalizeLanguage(given)).toStrictEqual(expected)
        }
    )
    test('_determineUsefulLanguage', (): void => {
        if (typeof globalThis.window.localStorage !== 'undefined') {
            globalThis.window.localStorage[root.options.sessionDescription] =
                'enUS'
            expect(root._determineUsefulLanguage())
                .toStrictEqual('enUS')
            delete globalThis.window.localStorage[
                root.options.sessionDescription
            ]
        }
        let referenceLanguage: string = root.options.default
        if (
            Object.prototype.hasOwnProperty.call(globalThis, 'navigator') &&
            typeof globalThis.navigator.language !== 'undefined'
        )
            referenceLanguage = globalThis.navigator.language
        expect(root._normalizeLanguage(root._determineUsefulLanguage()))
            .toStrictEqual(root._normalizeLanguage(referenceLanguage))
    })
    test('_handleSwitchEffect', (): Promise<void> =>
        expect(root._handleSwitchEffect('deDE', false))
            .resolves
            .toBeUndefined()
    )
    test('_registerTextNodeToChange', () => {
        root._registerTextNodeToChange(
            root,
            root.children[0] as HTMLItem,
            ['1', '2', '3'],
            root.children[0] as HTMLElement
        )

        expect(root._replacements[0].textNodeToTranslate)
            .toStrictEqual(root)

        expect(root._replacements).toHaveLength(1)
        root._replacements = []
    })
    test('_ensureLastTextNodeHavingLanguageIndicator', () => {
        expect(root._ensureLastTextNodeHavingLanguageIndicator(
            null, null, false
        )).toStrictEqual(null)
    })
    test('_switchLanguage', async (): Promise<void> => {
        root._switchLanguage('enUS')
        expect(root.currentLanguage).toStrictEqual('enUS')

        root._switchLanguage('deDE')
        expect(root.currentLanguage).toStrictEqual('deDE')
    })
    test('_switchCurrentLanguageIndicator', () => {
        const englishLink = createDomNodes(
            `<a href="#${root.options.languageHashPrefix}enUS">`
        ) as HTMLAnchorElement
        const germanLink = createDomNodes(
            `<a href="#${root.options.languageHashPrefix}deDE">`
        ) as HTMLAnchorElement
        root.append(englishLink)
        root.append(germanLink)

        root._switchCurrentLanguageIndicator('enUS')
        root.currentLanguage = 'enUS'

        expect(englishLink.classList.contains(
            root.options.currentLanguageIndicatorClassName
        )).toStrictEqual(true)
        expect(germanLink.classList.contains(
            root.options.currentLanguageIndicatorClassName
        )).toStrictEqual(false)

        root._switchCurrentLanguageIndicator('deDE')
        root.currentLanguage = 'deDE'

        expect(englishLink.classList.contains(
            root.options.currentLanguageIndicatorClassName
        )).toStrictEqual(false)
        expect(germanLink.classList.contains(
            root.options.currentLanguageIndicatorClassName
        )).toStrictEqual(true)
    })
    /// endregion
    // endregion
})
