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

jQuery-incrementer
==================

This plugin extends an html input field which serves a number to be given.
Handling validation and easy incrementing or decrementing of given value is
provided.

Examples:
--------

    #!/usr/bin/env javaScript

    jQuery('body form input.number').incrementer();

    jQuery('body form input.number').incrementer('logging': true);
