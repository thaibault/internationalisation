#!/usr/bin/env require

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

###!
    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This plugin provided client side internationalisation support for websites.
###

## standalone
## do (jQuery) ->
this.require([['jQuery.Tools', 'jquery-tools-1.0.coffee']], (jQuery) ->
##

# endregion

# region plugins/classes

    ###*
        @memberOf jQuery
        @class
        @extends jQuery.Tools
    ###
    class Lang extends jQuery.Tools.class

    # region private properties

        __name__: 'Lang'

    # endregion

    # region protected  properties

        ###*
            Saves default options for manipulating the Gui's behaviour.

            @property {Object}
        ###
        _options: {}
        _domNodes: {}

    # endregion

    # region public methods

        # region special methods

        initialize: (options={}) ->
            super options
            # Grab elements
            this._domNodes = this.grabDomNodes this._options.domNodes

            jQuery('.d').contents().filter(function() {
                return this.nodeName === '#comment'
            }).each(function() {
                jQuery(this.nodeValue).each(function() {
                    $this = jQuery(this);
                    if($this.hasClass('d')) {
                        console.log($this);
                        jQuery('.d').text($this.text())
                    }
                });
            });

            this

        # endregion

    # endregion

    # region protected methods

        # region event methods


        # endregion

    # endregion

    ###* @ignore ###
    jQuery.Lang = Lang

# endregion

## standalone
)
