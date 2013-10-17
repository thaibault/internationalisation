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
    Copyright

    Torben Sickert 16.12.2012

    License

    require von Torben Sickert steht unter einer Creative Commons
    Namensnennung 3.0 Unported Lizenz.

    see http://creativecommons.org/licenses/by/3.0/deed.de

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This native javaScript module provides a full featured import mechanism
    like python, php, c++ etc..

    Conventions (rcX := require convention number x)

    - rc1 Capitalized variables are constant and shouldn't be mutable.
    - rc2 Properties with preceding underscores shouldn't be accessed from
          the outer scope. They could accessed in inherited objects
          (protected attributes).
    - rc3 Property with two preceding underscore shouldn't be accessed from
          any location then the object itself (private attributes).
    - rc4 Follow the javascript OOP conventions like camel-case class-names
          methods and property names.
    - rc5 Class-names have a leading upper case letter.
    - rc6 Methods and functions are starting with a lower case letter.
    - rc7 Do not use more chars then 79 in one line.
    - rc8 Use short and/or long description doc-strings for all definitions.
    - rc9 Write qunit tests for each unit it is possible and try to reach 100%
          path coverage.
    - rc10 Sorting imports as following:
               1. Import all standard modules and packages,
               2. then all from third party,
               3. now import your own modules or packages.
               4. Sort import names alphabetically and separate the previous
                  defined parts with blank lines.
    - rc11 Prefix global reference from global context with "this" and with
           "window" in none global contexts.
    - rc12 Don't use any abbreviations.
    - rc13 Try to use small cyclomatic complexity in all units (less then eight
           is a good measurement).
    - rc14 Use one of the plugin pattern described in "jQuery.Tools".
    - rc15 Use the area statement syntax to structure your code and make it
           possible to fold them in many IDE's
           (see Structure of meta documenting below).
    - rc16 Always think that code is more read than written.
    - rc17 By choosing witch quotes to use follow this priority.
               1. Single quote (')
               2. Double quote (")
    - rc18 Indent function parameter which doesn't match in one line like:

           function(
               parameter1, parameter2, parameter3,
               parameter4)

           instead of:

           function(parameter1,
                    parameter2,
                    parameter3,
                    parameter4)

            or:

            function(parameter1, parameter2, parameter3,
                     parameter4)

Structure of meta documenting classes. (see rc15)

    // region header

    window.require([['ia', 'ia-1.0'], ['ib', 'ib-2.0']]), function(ia) {

    // endregion

    // region plugins

        var A = function() {

        // region (public|protected|private) (properties|methods)

            // region property or method group

                // region subproperty of method or property group

            ...

                // endregion

            // endregion

        // endregion

        };

    // endregion

    // region footer

    });

    // endregion

Structure of dependencies

    0. window
    1. window.require
    3. jQuery
    4. jQuery.Tools
    5. jQuery.*

    This means that a module in level "i" could only import a full module
    in its header in level "j" if "j < i" is valid.
###


###* @name window ###

# endregion

# region classes

###*
    This class can be used as function for defining dependencies for
    modules.
    Note that this function searches in the same resource as the first
    javaScript include tag in your markup if given dependency resource
    doesn't start with "http://".
    You can manually change this behavior by adding a search base via
    "window.require.basePath".
    @memberOf window
    @class

    @example
window.require([['jQuery', 'jquery-3.0.1']], function() {
    jQuery('div#id').show('slow');
});
###
class Require
    ###
        These properties could be understand as static (or class instead of
        object) properties.
    ###

    # region public properties

    ###
        @ignore

        This variable saves a static reference to this class to make self
        referencing via introspection possible.
    ###
    self = Require
    ###*
        If setted all resources will be appended by a timestamp string to
        make each request unique.
        This is useful to workaround some browsers caching mechanisms
        which aren't required.

        @property {Boolean}
    ###
    this.appendTimeStamp
    ###*
        Indicates if debugging is active.

        @property {Boolean}
    ###
    this.logging
    ###*
        Saves the base path for relative defined module locations.

        @property {Object}
    ###
    this.basePath
    ###*
        If the require scope should be deleted after serving all
        dependencies this property should be an array with a callback
        function and its arguments following. The function will be called
        after last dependency was solved. Simply define true is also
        valid.

        @property {Boolean}
    ###
    this.noConflict
    ###*
        Caches a reference to the head for injecting needed script tags.

        @property {DomNode}
    ###
    this.headNode
    ###*
        Saves all loaded script resources to prevent double script
        loading.

        @property {String[]}
    ###
    this.initializedLoadings
    ###*
        Indicates if require should load resource on its own.

        @property {Boolean}
    ###
    this.passiv
    ###*
        Saves the initially pointed target of global variable
        "window.require" to reset that reference in "noConflict" mode.

        @property {Mixed}
    ###
    this.referenceSafe
    ###*
        Describes all supported scripts with their needed properties to
        load them. A Mapping from file endings to their script node types.

        @property {Object}
    ###
    this.scriptTypes
    ###*
        Describes a mapping from regular expression pattern which detects all
        modules to load via ajax to their corresponding handler functions.

        @property {Object}
    ###
    this.asyncronModulePatternHandling
    ###*
        Defines in which scope the required dependencies have to be present.

        @property {Object}
    ###
    this.context

    # endregion

    # region protected properties

    ###*
        Saves function calls to require for running them in right order to
        guarantee dependencies. It consist of a list of tuples storing
        needed dependency as string and arguments to be given to callback
        function if dependency is determined.

        @property {Object[]}
    ###
    this._callQueue
    ###*
        Handles all default asynchron module pattern handler.

        @property {Object}
    ###
    this._defaultAsynchronModulePatternHandler =
        '^.+\.css$': (cssContent) ->
            styleNode = document.createElement 'style'
            styleNode.type = 'text/css'
            styleNode.appendChild document.createTextNode cssContent
            self.headNode.appendChild styleNode
        '^.+\.coffee$': (coffeeScriptCode, module) ->
            sourceRootPath = self.basePath.default
            if self.basePath.coffee
                sourceRootPath = self.basePath.coffee
            coffeeScriptCompilerOptions =
                header: false
                sourceMap: false
                filename: module[1]
                generatedFile: module[1].substr(
                    0, module[1].lastIndexOf('.') + 1
                ) + 'js'
                sourceRoot: sourceRootPath
                sourceFiles: [module[1]]
            if window.btoa? and window.JSON? and window.unescape? and
               window.encodeURIComponent?
                coffeeScriptCompilerOptions.sourceMap = true
                # NOTE: Workaround to enable source maps for asynchron loaded
                # coffee scripts.
                {js, v3SourceMap} = window.CoffeeScript.compile(
                    coffeeScriptCode, coffeeScriptCompilerOptions)
                # NOTE: Additional commend syntax with "/*...*/" is necessary
                # to support internet explorer.
                window.eval(
                    js + '\n/*//@ sourceMappingURL=data:application/json;' +
                    'base64,' +
                    (btoa unescape encodeURIComponent v3SourceMap) + '\n//@ ' +
                    'sourceURL=' + module[1] + '*/')
            else
                window.CoffeeScript.run(
                    coffeeScriptCode, coffeeScriptCompilerOptions)

    # endregion

    # region public methods

        # region special methods

    ###*
        @description This method is used as initializer. Class properties
                     will be initialized if its the first call to require.
                     This methods gets the same arguments as the global
                     "require" constructor.

        @param {Array[String[]]} modules A list of string array which describes
                                         needed modules. Every element is a
                                         tuple consisting of an object
                                         reference which has to be available
                                         after script was loading and the
                                         module name (basename of script file
                                         with or without file extension).
        @param {Function} onLoaded A callback function to load after all
                                   dependences are available.
        @param {Object} onLoadedArguments A various number of arguments given
                                          to the "onLoaded" callback function.

        @returns {require} Returns the current instance.
    ###
    constructor: (modules, onLoaded, onLoadedArguments) ->
        # Set class property default values.
        if not self.context?
            self.context = this
        if not self.referenceSafe?
            self.referenceSafe = this.require
        if not self.basePath?
            self.basePath = {}
            for scriptNode in document.getElementsByTagName 'script'
                if not self.basePath.default
                    self.basePath.default = scriptNode.src.substring(
                        0, scriptNode.src.lastIndexOf('/') + 1)
                extension = scriptNode.src.substring(
                    scriptNode.src.lastIndexOf('.') + 1)
                if extension and not self.basePath[extension]
                    self.basePath[extension] = scriptNode.src.substring(
                        0, scriptNode.src.lastIndexOf('/') + 1)
        for type, path of self.basePath
            if path.substring(path.length - 1) isnt '/'
                self.basePath[type] += '/'
        if not self.appendTimeStamp?
            self.appendTimeStamp = false
        if not self.passiv?
            self.passiv = false
        if not self.logging?
            self.logging = false
        if not self.noConflict?
            self.noConflict = false
        if not self.initializedLoadings?
            self.initializedLoadings = []
        if not self.headNode?
            self.headNode = document.getElementsByTagName('head')[0]
        if not self.scriptTypes?
            self.scriptTypes = '.js': 'text/javascript'
        if not self.asyncronModulePatternHandling?
            self.asyncronModulePatternHandling = {}
        for pattern, handler of self._defaultAsynchronModulePatternHandler
            if not self.asyncronModulePatternHandling[pattern]?
                self.asyncronModulePatternHandling[pattern] = handler
        if not self._callQueue?
            self._callQueue = []
        self::_load.apply require, arguments

        # endregion

    # endregion

    # region protected methods

    ###*
        @description Loads needed modules and run the "onLoaded" callback
                     function. This methods gets the same arguments as the
                     global "require" constructor.

        @returns {require} Returns the current instance.
    ###
    _load: (parameter...) ->
        ###
            This method is alway working with arguments array for easy
            recursive calling itself with a dynamic number of arguments.
        ###
        ###
            If you convert arguments object to an array.

            This following outcomment line would be responsible for a bug
            in yuicompressor.
            Because of declaration of arguments the parser things that
            arguments is a local variable and could be renamed.
            It doesn't care about that the magic arguments object is
            necessary to generate the arguments array in this context.

            var arguments = Array.prototype.slice.call(arguments);

            use something like this instead:

            var parameter = Array.prototype.slice.call(arguments);
        ###
        ###
            Make sure that we have a copy of given array containing needed
            dependencies.
        ###
        if parameter[parameter.length - 1] isnt require
            # Save a copy if initially given dependencies.
            parameter.push parameter[0].slice 0
            # Mark array as initialized.
            parameter.push require
        if parameter[0].length
            # Grab first needed dependency from given queue.
            module = parameter[0].shift()
            if(typeof(module) is 'object' and
               self::_isModuleLoaded module)
                ###
                    If module is already there make a recursive call with
                    one module dependency less.
                ###
                self::_load.apply require, parameter
            else if (
                typeof(module) is 'string' or
                not self::_isLoadingInitialized module[0], parameter
            )
                ###
                    If module is currently not loading put current function
                    call initialize loading needed resource.
                ###
                if typeof(module) is 'string'
                    module = ['', module]
                if self.passiv
                    self::_log(
                        "Prevent loading module \"#{module[0]}\" in passiv " +
                        "mode.")
                else
                    self::_initializeResourceLoading module, parameter
        else
            ###
                Call a given event handler (if provided as second argument)
                when all dependencies are determined.
            ###
            if parameter.length > 3
                parameter[1].apply(
                    self.context, self::_generateLoadedHandlerArguments(
                        parameter))
            ###
                If other dependencies aren't determined yet try to
                determine it now after a new dependency was loaded.
            ###
            if(self._callQueue.length and self::_isModuleLoaded(
                self._callQueue[self._callQueue.length - 1])
            )
                self::_load.apply require, self._callQueue.pop()[1]
        if require and self._handleNoConflict
            return self::_handleNoConflict()
        self
    ###*
        @description Initialize loading of needed resources.

        @param {String[]} module A tuple (consisting of module indicator
                                 and module file path) which should be
                                 loaded.
        @param {Object[]} parameters Saves arguments indented to be given
                                     to the on load function.

        @returns {require} Returns the current instance.
    ###
    _initializeResourceLoading: (module, parameter) ->
        isAsyncronRequest = false
        shortcut = self.asyncronModulePatternHandling
        for asyncronModulePattern, callback of shortcut
            if new RegExp(asyncronModulePattern).test module[1]
                if window.XMLHttpRequest
                    ajaxObject = new XMLHttpRequest
                else
                    ajaxObject = new ActiveXObject 'Microsoft.XMLHTTP'
                ajaxObject.open(
                    'GET', self::_getScriptFilePath module[1], true)
                ajaxObject.onreadystatechange = ->
                    # NOTE: Internet explorer throws an exception here instead
                    # of showing the error code in the "status" property.
                    # TODO check in IE
                    try
                        readyState = ajaxObject.readyState
                    catch
                        throw new Error(
                            "Running resource \"#{module[1]}\" failed via " +
                            "ajax cased by exception: \"#{error}\".")
                    if readyState is 4 and ajaxObject.status in [0, 200]
                        shortcut[asyncronModulePattern](
                            ajaxObject.responseText, module, parameter)
                        self::_scriptLoaded module, parameter
                        # Delete event after passing it once.
                        ajaxObject.onreadystatechange = null
                    else if ajaxObject.status isnt 200
                        self::_log(
                            "Loading resource \"#{module[1]}\" failed " +
                            "via ajax with status \"#{ajaxObject.status}" +
                            "\" in state \"#{ajaxObject.readyState}\".")
                ajaxObject.send null
                isAsyncronRequest = true
                break
        if not isAsyncronRequest
            self::_appendResourceDomNode(
                self::_createScriptLoadingNode(module[1]), module, parameter)
        type = 'header dom node'
        if isAsyncronRequest
            type = 'ajax'
        self::_log "Initialized loading of \"#{module[1]}\" via #{type}."
        self
    ###*
        @description Generates an array of arguments from initially given
                     arguments to the require constructor. The generated
                     arguments are designed to give loaded handler a useful
                     scope

        @param {Object[]} parameters Initially given arguments.

        @returns {Object[]} Returns an array of arguments.
    ###
    _generateLoadedHandlerArguments: (parameters) ->
        additionalArguments = []
        for index in [0..parameters[parameters.length - 2].length - 1]
            if parameters[parameters.length - 2][index].length is 2
                moduleObjects =
                    parameters[parameters.length - 2][index][0].split '.'
                query = self.context
                for subIndex in [0..moduleObjects.length - 1]
                    query = query[moduleObjects[subIndex]]
                    additionalArguments.push query
        parameters.slice(2, parameters.length - 2).concat(
            additionalArguments, parameters[parameters.length - 2])
    ###*
        @description Appends a given script loading tag inside the dom
                     tree.

        @param {DomNode} ScriptNode Dom node where to append script
                                    loading node.
        @param {String[]} module A tuple (consisting of module indicator
                                 and module file path) which should be
                                 loaded.
        @param {Object[]} parameters Saves arguments indented to be given
                                     to the on load function.

        @returns {require} Returns the current instance.
    ###
    _appendResourceDomNode: (scriptNode, module, parameters) ->
        ###
            Internet explorer workaround for capturing event when
            script is loaded.
        ###
        if scriptNode.readyState
            scriptNode.onreadystatechange = ->
                if(scriptNode.readyState is 'loaded' or
                   scriptNode.readyState is 'complete')
                    self::_scriptLoaded module, parameters
                    # Delete event after passing it once.
                    scriptNode.onreadystatechange = null
        else
            scriptNode.onload = ->
                self::_scriptLoaded module, parameters
                # Delete event after passing it once.
                scriptNode.onload = null
        self.headNode.appendChild scriptNode
        self
    ###*
        @description Creates a new script loading tag.

        @param {String} scriptFilePath Path pointing to the file resource.

        @returns {String} The absolute path to needed resource.
    ###
    _getScriptFilePath: (scriptFilePath) ->
        if scriptFilePath.substring(0, 'http://'.length) is 'http://'
            return scriptFilePath
        extension = scriptFilePath.substring(
            scriptFilePath.lastIndexOf('.') + 1)
        if self.basePath[extension]
            return self.basePath[extension] + scriptFilePath
        self.basePath.default + scriptFilePath
    ###*
        @description Creates a new script loading tag.

        @param {String} scriptFilePath Path pointing to the file resource.

        @returns {DomNode} Returns script node needed to load given script
                           resource.
    ###
    _createScriptLoadingNode: (scriptFilePath) ->
        scriptNode = document.createElement 'script'
        scriptNode.src = self::_getScriptFilePath scriptFilePath
        hasExtension = false
        for extension, scriptType of self.scriptTypes
            if scriptNode.src.substr(-extension.length) is extension
                hasExtension = true
                break
        if not hasExtension
            scriptNode.src += extension
        scriptNode.type = scriptType
        if self.appendTimeStamp
            scriptNode.src += "?timestamp=#{(new Date).getTime()}"
        scriptNode
    ###*
        @description If script was loaded it will be deleted from the
                     "initializedLoading" array. If all dependencies for
                     this module are available the sequence could continue
                     otherwise the current sequence status
                     (the parameter array) will be saved in a queue for
                     continue later.

        @param {String[]} module A tuple of module name to indicate if a
                          module is presence and its file path resource.
        @param {Object[]} parameters Saves arguments indented to be given
                                     to the on load function.

        @returns {require} Returns the current instance.
    ###
    _scriptLoaded: (module, parameters) ->
        for key, value in self.initializedLoadings
            if module[0] is value
                self.initializedLoadings.splice key, 1
                break
        if self::_isModuleLoaded module
            self::_load.apply require, parameters
        else
            self._callQueue.push [module[0], parameters]
        self
    ###*
        @description If "noConflict" property is set it will be handled
                     by this method. It clear the called scope from the
                     "require" name and optionally runs a callback
                     function given by the "noConflict" property after all
                     dependencies are solved.

        @returns {require} Returns the current instance.
    ###
    _handleNoConflict: ->
        if self._callQueue.length is 0 and self.initializedLoadings.length is 0
            self::_log 'All resources are loaded so far.'
            if require and self.noConflict
                if self.noConflict is true
                    ###
                        Restore previous setted value to the "require"
                        reference.
                    ###
                    require = self.referenceSafe
                else
                    # Workaround to not copy not only the reference.
                    callback = self.noConflict.slice()
                    require = undefined
                    callback[0].apply self.context, callback.slice 1
        self
    ###*
        @description Determines if the given "moduleObject" is currently
                     loading. If the given module is currently loading
                     the current sequence status will be stored in the
                     "callQueue" for continuing later.

        @param {String} moduleName A module object to indicate if a module
                                   is presence.
        @param {Object[]} parameters The current status of solving the
                                     initially described arguments.

        @returns {Boolean} If given module object is currently loading
                           "true" will be given back and "false" otherwise.
    ###
    _isLoadingInitialized: (moduleName, parameters) ->
        for key, value in self.initializedLoadings
            if moduleName is value
                self._callQueue.push [moduleName, parameters]
                return true
        if moduleName
            self.initializedLoadings.push moduleName
        false
    ###*
        @description Determines if the given "moduleObject" is present in the
                     global (window) scope.

        @param {String[]} module A tuple of module name to indicate if a
                                 module is presence and its file path.

        @returns {Boolean} If given module object is present this method
                           will return "true" and "false" otherwise.
    ###
    _isModuleLoaded: (module) ->
        query = self.context
        if module[0]
            moduleObjects = module[0].split '.'
            for index in [0..moduleObjects.length - 1]
                if query[moduleObjects[index]]
                    query = query[moduleObjects[index]]
                else
                    self::_log(
                        "\"#{module[0]}\" isn\'t available because \"" +
                        "#{moduleObjects[index]}\" is missing in \"" +
                        "#{query.toString()}\".")
                    return false
            self::_log "\"#{module[0]}\" is loaded complete."
        else
            self::_log "\"#{module[1]}\" is loaded complete."
        true
    ###*
        @description If logging is enabled. Method shows the given message
                     in the browsers console if possible or in a standalone
                     alert-window as fallback.

        @param {String} message A logging message.

        @returns {undefined|false} Returns the return value of
                                   "window.console.log()" or
                                   "window.alert()" or "false" if logging
                                   is disabled.
    ###
    _log: (message) ->
        if self.logging
            if window.console and window.console.log
                return window.console.log "require: #{message}"
            return window.alert "require: #{message}"
        false

    # endregion

###* @ignore ###
this.require = Require

# endregion
