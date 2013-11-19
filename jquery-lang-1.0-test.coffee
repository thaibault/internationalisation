# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

# Copyright Torben Sickert 16.12.2012

# License
#    This library written by Torben Sickert stand under a creative commons
#    naming 3.0 unported license.
#    see http://creativecommons.org/licenses/by/3.0/deed.de

module 'Lang'

# endregion

# region tests

    # region public methods

        # region special

test 'initialize', -> ok $.Lang()

        # endregion

test 'switch', -> ok $.Lang().switch 'en'

    # endregion

    # region protected methods

test '_normalizeLanguage', ->
    strictEqual $.Lang()._normalizeLanguage('de'), 'deDE'
    strictEqual $.Lang()._normalizeLanguage('de-de'), 'deDE'
    strictEqual $.Lang()._normalizeLanguage('en-us'), 'enUS'
    strictEqual $.Lang()._normalizeLanguage('fr'), 'frFR'
    strictEqual $.Lang()._normalizeLanguage(''), 'enUS'
test '_determineUsefulLanguage', ->
    $.cookie $.Lang()._options.cookieDescription, 'enUS'

    strictEqual $.Lang()._determineUsefulLanguage(), 'enUS'

    $.removeCookie $.Lang()._options.cookieDescription

    if navigator.language?
        strictEqual(
            $.Lang()._determineUsefulLanguage(),
            $.Lang()._normalizeLanguage navigator.language)
    else
        strictEqual(
            $.Lang()._determineUsefulLanguage(),
            $.Lang()._options.default)
test '_handleSwitchEffect', -> ok $.Lang()._handleSwitchEffect 'deDE'
test '_registerTextNodeToChange', ->
    lang = $.Lang()
    lang._registerTextNodeToChange $('body'), 1, [1, 2, 3], 1

    strictEqual lang._replacements.length, 1
test '_checkLastTextNodeHavingLanguageIndicator', ->
    strictEqual $.Lang()._checkLastTextNodeHavingLanguageIndicator(null, 1), 1
test '_handleLanguageSwitching', -> ok $.Lang()._handleLanguageSwitching()
test '_switchLanguage', ->
    lang = $.Lang()
    lang._switchLanguage 'deDE'

    strictEqual lang.currentLanguage, 'deDE'
test '_switchCurrentLanguageIndicator', ->
    ok $.Lang()._switchCurrentLanguageIndicator 'deDE'

    # endregion

# endregion
