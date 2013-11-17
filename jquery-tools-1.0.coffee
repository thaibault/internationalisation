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
    This module provides common reusable logic for every jQuery non trivial
    plugin.
###

###*
    @name $
    @see www.jquery.com
###
## standalone do ($=this.jQuery) ->
this.require [['jQuery', 'jquery-2.0.3']], ($) ->

# endregion

# region plugins/classes

    ###*
        This plugin provides such interface logic like generic controller logic
        for integrating plugins into $, mutual exclusion for depending gui
        elements, logging additional string, array or function handling. A set
        of helper functions to parse option objects dom trees or handle events
        is also provided.

        @memberOf $
        @class
    ###
    class Tools

    # region properties

        ###*
            Saves the $ wrapped dom node.

            @property {Object}
        ###
        $domNode: null
        ###*
            Saves a mapping from key codes to their corresponding name.

            @property {Object}
        ###
        keyCode:
            BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13
            ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34
            PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38
        ###*
            Saves default options for manipulating the default behaviour.

            @property {Object}
        ###
        _options:
            logging: false
            domNodeSelectorPrefix: 'body'
            domNode: {}
        ###*
            Used for internal mutual exclusion in critical areas. To prevent
            race conditions. Represents a map with critical area description
            and queues saving all functions waiting for unlocking their
            mapped critical area.

            @property {Object}
        ###
        _locks: {}
        ###*
            This variable contains a collection of methods usually binded to
            the console object.
        ###
        _consoleMethods: [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time',
            'timeEnd', 'timeStamp', 'trace', 'warn']
        ###*
            Saves the class name for introspection.

            @property {String}
        ###
        __name__: 'Tools'
        ###*
            Indicates if an instance was derived from this class.

            @property {Boolean}
        ###
        __tools__: true

    # endregion

    # region public methods

        # region special

        ###*
            @description This method should be overwritten normally. It is
                         triggered if current object is created via the "new"
                         keyword.

            @returns {$.Tools} Returns the current instance.
        ###
        constructor: (@$domNode) ->
            # Avoid errors in browsers that lack a console.
            for method in this._consoleMethods
                if not window.console?
                    window.console = {}
                # Only stub the $ empty method.
                if not window.console[method]?
                    console[method] = $.noop()
            this
        ###*
            @description This method could be overwritten normally.
                         It acts like a destructor.

            @returns {$.Tools} Returns the current instance.
        ###
        destructor: ->
            this.off '*'
            this
        ###*
            @description This method should be overwritten normally. It is
                         triggered if current object was created via the "new"
                         keyword and is called now.

            @param {Object} options An options object.

            @returns {$.Tools} Returns the current instance.
        ###
        initialize: (options={}) ->
            if options
                this._options = $.extend true, this._options, options
            # The selector prefix should be parsed after extending options
            # because the selector would be overwritten otherwise.
            this._options.domNodeSelectorPrefix = this.stringFormat(
                this._options.domNodeSelectorPrefix,
                this.camelCaseStringToDelimited this.__name__)
            this

        # endregion

        # region object orientation

        ###*
            @description Defines a generic controller for $ plugins.

            @param {Object|String} object The object or class to control.
                                          If "object" is a class an instance
                                          will be generated.
            @param {Arguments} parameter The initially given arguments object.

            @returns {Mixed} Returns whatever the initializer method returns.
        ###
        controller: (object, parameter, $domNode=null) ->
            parameter = this.argumentsObjectToArray parameter
            if not object.__name__?
                object = new object $domNode
                if not object.__tools__?
                    object = $.extend true, new Tools(), object
            if $domNode?
                if $domNode.data object.__name__
                    object = $domNode.data object.__name__
                else
                    $domNode.data object.__name__, object
            if object[parameter[0]]?
                return object[parameter[0]].apply object, parameter.slice 1
            else if not parameter.length or $.type(parameter[0]) is 'object'
                ###
                    If an options object or no method name is given the
                    initializer will be called.
                ###
                return object.initialize.apply object, parameter
            $.error(
                "Method \"#{parameter[0]}\" does not exist on $-extension " +
                "#{object.__name__}\".")
        ###*
            @description Extends a given object with the tools attributes.

            @param {Object} childAttributs The attributes from child.

            @returns {$.Tools} Returns the current instance.
        ###
        extend: (childAttributes) ->
            if childAttributes
                $.extend true, this, childAttributes
            this

        # endregion

        # region mutual exclusion

        ###*
            @description Calling this method introduces a starting point for a
                         critical area with potential race conditions.
                         The area will be binded to given description string.
                         So don't use same names for different areas.

            @param {String} description A short string describing the criticial
                                        areas properties.
            @param {Function} callbackFunction A procedure which should only be
                                               executed if the interpreter
                                               isn't in the given critical
                                               area. The lock description
                                               string will be given to the
                                               callback function.
            @param {Boolean} autoRelease Release the lock after execution of
                                         given callback.

            @returns {$.Tools} Returns the current instance.
        ###
        acquireLock: (description, callbackFunction, autoRelease=false) ->
            ###
                NOTE: The "window.setTimeout()" wrapper guarantees that the
                following function will be executed without any context
                switches in all browsers.
                If you want to understand more about that,
                "What are event loops?" might be a good question.
            ###
            window.setTimeout(
                (=>
                    wrappedCallbackFunction = (description) =>
                        callbackFunction(description)
                        if autoRelease
                            this.releaseLock(description)
                    if not this._locks[description]?
                        this._locks[description] = []
                        wrappedCallbackFunction description
                    else
                        this._locks[description].push wrappedCallbackFunction
                ),
                0)
            this
        ###*
            @description Calling this method  causes the given critical area to
                         be finished and all functions given to
                         "this.acquireLock()" will be executed in right order.

            @param {String} description A short string describing the criticial
                                        areas properties.

            @returns {$.Tools} Returns the current instance.
        ###
        releaseLock: (description) ->
            ###
                NOTE: The "window.setTimeout()" wrapper guarantees that the
                following function will be executed without any context
                switches in all browsers.
                If you want to understand more about that,
                "What are event loops?" might be a good question.
            ###
            window.setTimeout(
                (=>
                    if this._locks[description]?
                        if this._locks[description].length
                            this._locks[description].shift()(description)
                            if not this._locks[description].length
                                this._locks[description] = undefined
                        else
                            this._locks[description] = undefined),
                0)
            this

        # endregion

        # region language fixes

        ###*
            @description This method fixes an ugly javascript bug.
                         If you add a mouseout event listener to a dom node
                         the given handler will be called each time any dom
                         node inside the observed dom node triggers a mouseout
                         event. This methods guarantees that the given event
                         handler is only called if the observed dom node was
                         leaved.

            @param {Function} eventHandler The mouse out event handler.

            @returns {Function} Returns the given function wrapped by the
                                workaround logic.
        ###
        mouseOutEventHandlerFix: (eventHandler) ->
            self = this
            (event) ->
                relatedTarget = event.toElement
                if event.relatedTarget
                    relatedTarget = event.relatedTarget
                while relatedTarget and relatedTarget.tagName isnt 'BODY'
                    if relatedTarget is this
                        return
                    relatedTarget = relatedTarget.parentNode
                eventHandler.apply self, arguments

        # endregion

        # region logging

        ###*
            @description Shows the given object's representation in the
                         browsers console if possible or in a standalone
                         alert-window as fallback.

            @param {Mixed} object Any type to show.
            @param {Boolean} force If set to "true" given input will be shown
                                   independly from current logging
                                   configuration or interpreter's console
                                   implementation.
            @param {Boolean} avoidAnnotation If set to "true" given input
                                             has no module or log level
                                             specific annotations.

            @returns {$.Tools} Returns the current instance.
        ###
        log: (object, force=false, avoidAnnotation=false, level='info') ->
            if this._options.logging or force
                if avoidAnnotation
                    message = object
                else if $.type(object) is 'string'
                    message = (
                        "#{this.__name__} (#{level}): " +
                        this.stringFormat.apply(this, arguments))
                else if $.isNumeric object
                    message = (
                        "#{this.__name__} (#{level}): #{object.toString()}")
                else if $.type(object) is 'boolean'
                    message = (
                        "#{this.__name__} (#{level}): #{object.toString()}")
                else
                    this.log ",--------------------------------------------,"
                    this.log object, force, true
                    this.log "'--------------------------------------------'"
                if message
                    if window.console?[level]? == $.noop() and force
                        window.alert message
                    window.console[level] message
            this
        ###*
            @description Wrapper method for the native console method usually
                         provided by interpreter.

            @param {Mixed} object Any type to show.
            @param {Boolean} force If set to "true" given input will be shown
                                   independly from current logging
                                   configuration or interpreter's console
                                   implementation.
            @param {Boolean} avoidAnnotation If set to "true" given input
                                             has no module or log level
                                             specific annotations.

            @returns {$.Tools} Returns the current instance.
        ###
        info: (object, force=false, avoidAnnotation=false, level='info') ->
            this.log object, force, avoidAnnotation, level
        ###*
            @description Wrapper method for the native console method usually
                         provided by interpreter.

            @param {Mixed} object Any type to show.
            @param {Boolean} force If set to "true" given input will be shown
                                   independly from current logging
                                   configuration or interpreter's console
                                   implementation.
            @param {Boolean} avoidAnnotation If set to "true" given input
                                             has no module or log level
                                             specific annotations.

            @returns {$.Tools} Returns the current instance.
        ###
        debug: (object, force=false, avoidAnnotation=false, level='debug') ->
            this.log object, force, avoidAnnotation, level
        ###*
            @description Wrapper method for the native console method usually
                         provided by interpreter.

            @param {Mixed} object Any type to show.
            @param {Boolean} force If set to "true" given input will be shown
                                   independly from current logging
                                   configuration or interpreter's console
                                   implementation.
            @param {Boolean} avoidAnnotation If set to "true" given input
                                             has no module or log level
                                             specific annotations.

            @returns {$.Tools} Returns the current instance.
        ###
        error: (object, force=false, avoidAnnotation=false, level='error') ->
            this.log object, force, avoidAnnotation, level
        ###*
            @description Wrapper method for the native console method usually
                         provided by interpreter.

            @param {Mixed} object Any type to show.
            @param {Boolean} force If set to "true" given input will be shown
                                   independly from current logging
                                   configuration or interpreter's console
                                   implementation.
            @param {Boolean} avoidAnnotation If set to "true" given input
                                             has no module or log level
                                             specific annotations.

            @returns {$.Tools} Returns the current instance.
        ###
        warn: (object, force=false, avoidAnnotation=false, level='warn') ->
            this.log object, force, avoidAnnotation, level
        ###*
            @description Dumps a given object in a human readable format.

            @param {Object} object Any type.

            @returns {String} Returns the searialized object.
        ###
        show: (object) ->
            output = ''
            if $.type(object) is 'string'
                output = object
            else
                $.each object, (key, value) ->
                    if value is undefined
                        value = 'undefined'
                    else if value is null
                        value = 'null'
                    output += "#{key.toString()}: #{value.toString()}\n"
            output = output.toString() if not output
            "#{$.trim(output)}\n(Type: \"#{$.type(object)}\")"

        # endregion

        # region dom node handling

        ###*
            @description Removes a selector prefix from a given selector.
                         This methods searches in the options object for a
                         given "domNodeSelectorPrefix".

            @param {String} domNodeSelector The dom node selector to slice.

            @return {String} Returns the silced selector.
        ###
        sliceDomNodeSelectorPrefix: (domNodeSelector) ->
            if(this._options?.domNodeSelectorPrefix? and
               domNodeSelector.substring(
                0, this._options.domNodeSelectorPrefix.length) is
               this._options.domNodeSelectorPrefix)
                return $.trim(domNodeSelector.substring(
                    this._options.domNodeSelectorPrefix.length))
            domNodeSelector
        ###*
            @description Determines the dom node name of a given dom node
                         string.

            @param {String} domNode A given to dom node selector to determine
                            its name.

            @returns {String}

            @example
$.Tools.getDomNodeName('&lt;div&gt;');
'div'

$.Tools.getDomNodeName('&lt;div&gt;&lt;/div&gt;');
'div'

$.Tools.getDomNodeName('&lt;br/&gt;');
'br'
        ###
        getDomNodeName: (domNode) ->
            domNode.match(new RegExp('^<?([a-zA-Z]+).*>?.*'))[1]
        ###*
            @description Converts an object of dom selectors to an array of
                         $ wrapped dom nodes. Note if selector
                         description as one of "class" or "id" as suffix
                         element will be ignored.

            @param {Object} domNodeSelectors An object with dom node selectors.

            @returns {Object} Returns all $ wrapped dom nodes corresponding to
                              given selectors.
        ###
        grabDomNode: (domNodeSelectors) ->
            domNodes = {}
            if domNodeSelectors?
                $.each(domNodeSelectors, (key, value) =>
                    match = value.match ', *'
                    if match
                        $.each value.split(match[0]), (key, valuePart) =>
                            if key
                                value += ", " + this._grabDomNodeHelper(
                                    key, valuePart, domNodeSelectors)
                            else
                                value = valuePart
                    domNodes[key] = $ this._grabDomNodeHelper(
                        key, value, domNodeSelectors)
                )
            if this._options.domNodeSelectorPrefix
                domNodes.parent = $ this._options.domNodeSelectorPrefix
            domNodes.window = $ window
            domNodes.document = $ document
            domNodes

        # endregion

        # region function handling

        ###*
            @description Methods given by this method has the plugin scope
                         referenced with "this". Otherwise "this" usualy
                         points to the object the given method was attached to.
                         If "method" doesn't match string arguments are passed
                         through "$.proxy()" with "context" setted as
                         "scope" or "this" if nothing is provided.

            @param {String|Function|Object} method A method name of given
                                                   scope.
            @param {Object|String} scope A given scope.

            @returns {Mixed} Returns the given methods return value.
        ###
        getMethod: (method, scope=this, additionalArguments...) ->
            ###
                This following outcomment line would be responsible for a
                bug in yuicompressor.
                Because of declaration of arguments the parser things that
                arguments is a local variable and could be renamed.
                It doesn't care about that the magic arguments object is
                neccessary to generate the arguments array in this context.

                var arguments = this.argumentsObjectToArray(arguments);

                use something like this instead:

                var parameter = this.argumentsObjectToArray(arguments);
            ###
            parameter = this.argumentsObjectToArray arguments
            if($.type(method) is 'string' and
               $.type(scope) is 'object')
                return ->
                    if not scope[method]
                        $.error(
                            "Method \"#{method}\" doesn't exists in " +
                            "\"#{scope}\".")
                    thisFunction = arguments.callee
                    parameter = $.Tools().argumentsObjectToArray(
                        arguments)
                    parameter.push thisFunction
                    scope[method].apply(scope, parameter.concat(
                        additionalArguments))
            parameter.unshift scope
            parameter.unshift method
            $.proxy.apply $, parameter

        # endregion

        # region event handling

        ###*
            @description Prevents event functions from triggering to often by
                         defining a minimal span between each function call.

            @returns {Function} Returns the wrapped method.
        ###
        debounce: (eventFunction, thresholdInMilliseconds=300) ->
            timeoutID = null
            ->
                if timeoutID?
                    window.clearTimeout timeoutID
                    timeoutID = setTimeout(
                        eventFunction, thresholdInMilliseconds)
                else
                    eventFunction()
                    timeoutID = setTimeout $.noop(), thresholdInMilliseconds
        ###*
            @description Searches for internal event handler methods and runs
                         them by default. In addition this method searches for
                         a given event method by the options object.

            @param {String} eventName An event name.
            @param {Boolean} callOnlyOptionsMethod Prevents from trying to
                                                   call an internal event
                                                   handler.
            @param {Object} scope The scope from where the given event handler
                                  should be called.

            @returns {Boolean} Returns "true" if an event handler was called
                               and "false" otherwise.
        ###
        fireEvent: (
            eventName, callOnlyOptionsMethod=false, scope=this,
            additionalArguments...
        ) ->
            scope = this if not scope
            eventHandlerName =
                'on' + eventName.substr(0, 1).toUpperCase() +
                eventName.substr 1
            if not callOnlyOptionsMethod
                if scope[eventHandlerName]
                    scope[eventHandlerName].apply scope, additionalArguments
                else if scope["_#{eventHandlerName}"]
                    scope["_#{eventHandlerName}"].apply(
                        scope, additionalArguments)
            if scope._options and scope._options[eventHandlerName]
                scope._options[eventHandlerName].apply(
                    scope, additionalArguments)
                return true
            false
        ###*
            @description A wrapper method for "$.delegate()".
                         It sets current plugin name as event scope if no scope
                         is given. Given arguments are modified and passed
                         through "$.delegate()".

            @returns {$} Returns $'s grabbed dom node.
        ###
        delegate: -> this._bindHelper arguments, false, 'delegate'
        ###*
            @description A wrapper method for "$.undelegate()". It sets current
                         plugin name as event scope if no scope is given. Given
                         arguments are modified and passed through
                         "$.undelegate()".

            @returns {$} Returns $'s grabbed dom node.
        ###
        undelegate: -> this._bindHelper arguments, true, 'undelegate'
        ###*
            @description A wrapper method for "$.on()".
                         It sets current plugin name as event scope if no scope
                         is given. Given arguments are modified and passed
                         through "$.on()".

            @returns {$} Returns $'s grabbed dom node.
        ###
        on: -> this._bindHelper arguments, false, 'on'
        ###*
            @description A wrapper method fo "$.off()".
                         It sets current plugin name as event scope if no scope
                         is given. Given arguments are modified and passed
                         through "$.off()".

            @returns {$} Returns $'s grabbed dom node.
        ###
        off: -> this._bindHelper arguments, true, 'off'
        ###*
            @description A wrapper method for "$.bind()".
                         It sets current plugin name as event scope if no scope
                         is given. Given arguments are modified and passed
                         through "$.bind()".

            @returns {$} Returns $'s grabbed dom node.
        ###
        bind: -> this._bindHelper arguments
        ###*
            @description A wrapper method fo "$.unbind()".
                         It sets current plugin name as event scope if no scope
                         is given. Given arguments are modified and passed
                         through "$.unbind()".

            @returns {$} Returns $'s grabbed dom node.
        ###
        unbind: -> this._bindHelper arguments, true
        ###*
            @description Converts a given argument object to an array.

            @param {Object} argumentsObject The arguments object to convert.

            @returns {Object[]} Returns the given arguments as array.
        ###

        # endregion

        # region array handling

        ###*
            @description Converts the interpreter given magic arguments
                         object to a standard array object.

            @param {Object} argumentsObject An argument object.

            @returns {Object[]} Returns the array containing all elements in
                                given arguments object.
        ###
        argumentsObjectToArray: (argumentsObject) ->
            Array.prototype.slice.call argumentsObject

        # endregion

        # region number handling

        ###*
            @description Rounds a given number accurate to given number of
                         digits.

            @param {Float} number The number to round.
            @param {Integer} digits The number of digits after comma.

            @returns {Float} Returns the rounded number.
        ###
        round: (number, digits=0) ->
            Math.round(number * Math.pow 10, digits) / Math.pow 10, digits

        # endregion

        # region string manipulating

        ###*
            @description Performs a string formation. Replaces every
                         placeholder "{i}" with the i'th argument.

            @param {String} string The string to format.

            @returns {String} The formatted string.
        ###
        stringFormat: (string) ->
            $.each(arguments, (key, value) ->
                string = string.replace(
                    new RegExp("\\{#{key}\\}", 'gm'), value))
            string
        ###*
            @description Converts a camel case string to a string with given
                         delimiter between each camel case seperation.

            @param {String} string The string to format.
            @param {String} delimiter The string tu put between each camel case
                                      seperation.

            @returns {String} The formatted string.
        ###
        camelCaseStringToDelimited: (string, delimiter='-') ->
            string.replace(new RegExp('(.)([A-Z])', 'g'), ->
                arguments[1] + delimiter + arguments[2]
            ).toLowerCase()
        ###*
            @description Appends a path selector to the given path if there
                         isn't one yet.

            @param {String} path The path for appending a selector.
            @param {String} pathSeperator The selector for appending to path.

            @returns {String} The appended path.
        ###
        addSeperatorToPath: (path, pathSeperator='/') ->
            path = $.trim path
            if path.substr(-1) isnt pathSeperator and path.length
                return path + pathSeperator
            path
        ###*
            @description Read a page's GET URL variables and return them as an
                         associative array.

            @param {String} key A get array key. If given only the
                                corresponding value is returned and full array
                                otherwise.

            @returns {Mixed} Returns the current get array or requested value.
                                     If requested key doesn't exist "undefined"
                                     is returned.
        ###
        getUrlVariables: (key) ->
            variables = []
            $.each(window.location.href.slice(
                window.location.href.indexOf('?') + 1
            ).split('&'), (key, value) ->
                variables.push value.split('=')[0]
                variables[value.split('=')[0]] = value.split('=')[1])
            if ($.type(key) is 'string')
                if key in variables
                    return variables[key]
                else
                    return undefined
            variables

        # endregion

    # endregion

    # region protected

        ###*
            @description Helper method for atach event handler methods and
                         their event handler removings pendants.

            @param {Object} parameter Arguments object given to methods
                                      like "bind()" or "unbind()".
            @param {Boolean} removeEvent Indicates if "unbind()" or "bind()"
                                         was given.
            @param {String} eventFunctionName Name of function to wrap.

            @returns {$} Returns $'s wrapped dom node.
        ###
        _bindHelper: (
            parameter, removeEvent=false, eventFunctionName='bind'
        ) ->
            $Object = $ parameter[0]
            if $.type(parameter[1]) is 'object' and not removeEvent
                $.each(parameter[1], (eventType, handler) =>
                    this[eventFunctionName] $Object, eventType, handler)
                return $Object
            parameter = this.argumentsObjectToArray(parameter).slice 1
            if parameter.length is 0
                parameter.push ''
            if parameter[0].indexOf('.') is -1
                parameter[0] += ".#{this.__name__}"
            if removeEvent
                return $Object[eventFunctionName].apply(
                    $Object, parameter)
            $Object[eventFunctionName].apply $Object, parameter
        ###*
            @description Converts a dom selector to a prefixed dom selector
                         string.

            @param {Integer} key Current element in options array to grab.
            @param {String} selector A dom node selector.
            @param {Object} domNodeSelectors An object with dom node selectors.

            @returns {Object}
        ###
        _grabDomNodeHelper: (key, selector, domNodeSelectors) ->
            domNodeSelectorPrefix = ''
            if this._options.domNodeSelectorPrefix
                domNodeSelectorPrefix = this._options.domNodeSelectorPrefix +
                    ' '
            if (selector.substr(0, domNodeSelectorPrefix.length) isnt
                    domNodeSelectorPrefix)
                return domNodeSelectors[key] = domNodeSelectorPrefix + selector
            selector

    # endregion

    # region handle $ extending

    ###* @ignore ###
    $.fn.Tools = -> new Tools().controller Tools, arguments, this
    ###* @ignore ###
    $.Tools = -> new Tools().controller Tools, arguments
    ###* @ignore ###
    $.Tools.class = Tools

    # endregion

# endregion
