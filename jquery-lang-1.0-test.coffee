#!/usr/bin/env require
# -*- coding: utf-8 -*-

# region header

# Copyright Torben Sickert (t.sickert["~at~"]gmail.com) 16.12.2012

# License
# -------

# This library written by Torben Sickert stand under a creative commons naming
# 3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

module 'lang'

# endregion

# region tests

    # region mock-up

lang = $.Lang()

    # endregion

    # region public methods

        # region special

test 'initialize', -> ok lang

        # endregion

test 'switch', -> strictEqual lang.switch('en'), lang
test 'refresh', -> strictEqual lang.refresh(), lang

    # endregion

    # region protected methods

test '_normalizeLanguage', ->
    strictEqual lang._normalizeLanguage('de'), 'deDE'
    strictEqual lang._normalizeLanguage('de-de'), 'deDE'
    strictEqual lang._normalizeLanguage('en-us'), 'enUS'
    strictEqual lang._normalizeLanguage('fr'), 'frFR'
    strictEqual lang._normalizeLanguage(''), 'enUS'
test '_determineUsefulLanguage', ->
    if window.localStorage?
        window.localStorage[lang._options.sessionDescription] = 'enUS'
        strictEqual lang._determineUsefulLanguage(), 'enUS'
        delete window.localStorage[lang._options.sessionDescription]

    referenceLanguage = lang._options.default
    referenceLanguage = navigator.language if navigator.language?
    strictEqual(
        lang._normalizeLanguage(lang._determineUsefulLanguage()),
        lang._normalizeLanguage referenceLanguage)
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

    # endregion

# endregion

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion
