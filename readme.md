<!-- region modline

vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:

endregion

region header

Copyright Torben Sickert 16.12.2012

License
   This library written by Torben Sickert stand under a creative commons
   naming 3.0 unported license.
   see http://creativecommons.org/licenses/by/3.0/deed.de

endregion -->

jquery-lang
===========

A jQuery plugin to replace alternate version of text for client side
internationalization.
<!--deDE:
    Ein jQuery-Plugin zum Klientseitigem ersetzten von verschiedenen
    Textversionen.
-->
<!--frFR:
    Un plugin jQuery pour remplacer version alternative de texte pour le côté
    client l'internationalisation.
-->

Example:
--------

    #!HTML

    <script type="text/javascript" src="distributionBundle/jquery-2.0.3.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-tools-1.0.js"></script>
    <script type="text/javascript" src="distributionBundle/jquery-lang-1.0.js"></script>
    <script type="text/javascript">
        $.Lang({
            domNodeSelectorPrefix: 'body',
            default: 'enUS',
            domNodeClassPrefix: '',
            fadeEffect: true,
            textNodeParent: {
                fadeIn: {duration: 'normal'},
                fadeOut: {duration: 'normal'}
            },
            replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',
            currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$',
            replacementDomNodeName: '#comment',
            replaceDomNodeName: '#text',
            toolsLockDescription: '{1}Switch',
            languageHashPrefix: 'lang-',
            currentLanguageIndicatorClassName: 'current',
            cookieDescription: '{1}Last',
            languageMapping: {
                deDE: ['de', 'de-de'],
                enUS: ['en', 'en-us'],
                enEN: ['en-en'],
                frFR: ['fr', 'fr-fr']
            },
            onSwitched: $.noop()
        });
    </script>

To add two versions of a text string you can simply add your translation
directly in markup. See how easy it is:
<!--deDE:
    Um zwei Sprachversionen eines Text Knotens im Markup anzubieten müssen
    einfach nur per Kommentar alternative Versionen hinter dem zu übersetzenden
    String gesetzt werden.
-->
<!--frFR:
    Doit offrir deux versions linguistiques d'un nœud de texte dans la balise
    facile à traduire que par Commentez versions alternatives derrière le
    Chaîne à être réglé.
-->

<!--showExample-->

    #!HTML

    <p>
        Your englisch version.
        <!--deDE:
            Ihre deutsche Variante.
        -->
        <!--frFR:
            Sa version française.
        -->
    </p>

With the above initialisation you can simple add this links everywhere in your
page to switch language. On click you will switch the current language
interactively. Try it by yourself:
<!--deDE:
    Mit der oben aufgezeigten Konfiguration können Sie einfach folgenden Links
    an beliebiger Stelle im Markup plazieren. Beim Klicken auf die
    Sprach-Wechsel-Links wird die Sprache Ihrer Webseite entsprechend
    angepasst. Versuchen Sie selbst:
-->
<!--frFR:
    Avec la configuration ci-dessus, vous pouvez simplement identifié les liens
    suivants placer n'importe où dans le balisage. Lorsque vous cliquez sur l'
    Langue échange de liens est la langue de votre site en conséquence
    ajustée. Essayez par vous-même:
-->

<!--showExample-->

    #!HTML

    <a href="#lang-deDE">de</a>
    <a href="#lang-enUS">en</a>
    <a href="#lang-frFR">fr</a>
