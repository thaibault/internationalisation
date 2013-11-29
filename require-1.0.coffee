#!/usr/bin/env require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

###
This native javaScript module provides a full featured import mechanism like
python, php, c++ etc..

Copyright
---------

Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

Conventions
-----------

(rcX := require convention number x)

- **rc1**
Capitalized variables are constant and shouldn't be mutable.
- **rc2**
Properties with preceding underscores shouldn't be accessed from the outer
scope. They could accessed in inherited objects (protected attributes).
- **rc3**
Property with two preceding underscore shouldn't be accessed from any location
then the object itself (private attributes).
- **rc4**
Follow the javascript OOP conventions like camel-case class-names methods and
property names.
- **rc5**
Class-names have a leading upper case letter.
- **rc6**
Methods and functions are starting with a lower case letter.
- **rc7**
Do not use more chars then 79 in one line.
- **rc8**
Use short and/or long description doc-strings for all definitions.
- **rc9**
Write qunit tests for each unit it is possible and try to reach 100% path
coverage.

- **rc10** Sorting imports as following:
    1. Import all standard modules and packages,
    2. then all from third party,
    3. now import your own modules or packages.
    4. Sort import names alphabetically and separate the previous defined parts
       with blank lines.
- **rc11**
Prefix global reference from global context with "this" and with "window" in
none global contexts.
- **rc12**
Don't use any abbreviations.
- **rc13**
Try to use small cyclomatic complexity in all units (less then eight is a good
measurement).
- **rc14**
Use one of the plugin pattern described in "jQuery.Tools".
- **rc15**
Use the area statement syntax to structure your code and make it possible to
fold them in many IDE's (see Structure of meta documenting below).
- **rc16**
Always think that code is more read than written.
- **rc17** By choosing witch quotes to use follow this priority.
    1. Single quote (')
    2. Double quote (")
- **rc18**
Indent function parameter which doesn't match in one line like:

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

Structure of meta documenting (see rc15)
----------------------------------------

    // region header

    window.require([['ia', 'ia-1.0'], ['ib', 'ib-2.0']]), function(ia, ib) {

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
-------------------------

0. window
1. window.require
3. jQuery
4. jQuery.Tools
5. jQuery.*

This means that a module in level "i" could only import a full module in its
header in level "j" if "j < i" is valid.

Author
------

t.sickert@gmail.com (Torben Sickert)

Version
-------

1.0 stable
###

# endregion

# region classes

class Require
    ###
        This class can be used as function for defining dependencies for
        modules.
        Note that this function searches in the same resource as the first
        javaScript include tag in your markup if given dependency resource
        doesn't start with "http://".
        You can manually change this behavior by adding a search base via
        "window.require.basePath".

        **example**

        >>> window.require([['jQuery', 'jquery-3.0.1']], function() {
        ...     jQuery('div#id').show('slow');
        ... });
    ###

    # region properties

    ###
        These properties could be understand as static (or class instead of
        object) properties.
    ###
    ###
        **self {Require}**
        This variable saves a static reference to this class to make self
        referencing via introspection possible.
    ###
    self = Require
    ###
        **appendTimeStamp {Boolean}**
        If setted all resources will be appended by a timestamp string to
        make each request unique.
        This is useful to workaround some browsers caching mechanisms
        which aren't required.
    ###
    this.appendTimeStamp
    ###
        **scopeIndicator {String}**
        Current scope indicator set by module.
    ###
    this.scopeIndicator = ''
    ###
        **logging** {Boolean}
        Indicates if debugging is active.
    ###
    this.logging
    ###
        **basePath {Object}**
        Saves the base path for relative defined module locations.
    ###
    this.basePath
    ###
        **noConflict {Boolean}**
        If the require scope should be deleted after serving all dependencies
        are loaded this property should be set to "true".
    ###
    this.noConflict
    ###
        **injectingNode {DomNode}**
        Caches a reference to the dom node for injecting needed script tags.
        You can alter this property to specify where to inject required
        scripts. Default is the head node.
    ###
    this.injectingNode
    ###
        **initializedLoadings {String[]}**
        Saves all loaded script resources to prevent double script
        loading. You can alter this property to specify where to inject
        required scripts.
        You can add scripts you have loaded via other mechanisms.
    ###
    this.initializedLoadings
    ###
        **passiv {Boolean}**
        Indicates if require should load resource on its own. If set to false
        require doesn't load any scripts.
    ###
    this.passiv
    ###
        **scriptTypes {Object}**
        Describes all supported scripts with their needed properties to
        load them. A Mapping from file endings to their script node types.
    ###
    this.scriptTypes
    ###
        **asyncronModulePatternHandling {Object}**
        Defines a mapping from regular expression pattern which detects all
        modules to load via ajax to their corresponding handler functions. A
        css, JavaScript and CoffeeScript loader is included by default.
    ###
    this.asyncronModulePatternHandling
    ###
        **context {Object}**
        Defines scope where the required dependencies have to be present. In
        other words "require.context" will reference "this" in given callback
        functions.
    ###
    this.context
    ###
        **onEverythingIsLoaded {Function}**
        Saves a callback function triggered if all scripts where loaded
        completely. The defined value references to "this".
    ###
    this.onEverythingIsLoaded
    ###
        **_callQueue {Object[]}**
        Saves function calls to require for running them in right order to
        guarantee dependencies. It consist of a list of tuples storing
        needed dependency as string and arguments to be given to callback
        function if dependency is determined.
    ###
    this._callQueue
    ###
        **_referenceBackup {Mixed}**
        Saves the initially pointed target of global variable
        "window.require" to reset that reference in "noConflict" mode.
    ###
    this._referenceBackup = window.require
    ###
        **_defaultAsynchronModulePatternHandler {Object}**
        Handles all default asynchron module pattern handler.
    ###
    this._defaultAsynchronModulePatternHandler =
        '^.+\.css$': (cssContent) ->
            styleNode = document.createElement 'style'
            styleNode.type = 'text/css'
            styleNode.appendChild document.createTextNode cssContent
            self.injectingNode.appendChild styleNode
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
                    js + '\n/*//# sourceMappingURL=data:application/json;' +
                    'base64,' +
                    (btoa unescape encodeURIComponent v3SourceMap) + '\n//@ ' +
                    'sourceURL=' + module[1] + '*/')
            else
                window.CoffeeScript.run(
                    coffeeScriptCode, coffeeScriptCompilerOptions)

    # endregion

    # region public methods

        # region special methods

    constructor: (modules, onLoaded, onLoadedArguments...) ->
        ###
            This method is used as initializer. Class properties will be
            initialized if its the first call to require. This methods gets the
            same arguments as the global "require" constructor.

            **modules {Array[String[]]}** - A list of string array which
                                            describes needed modules. Every
                                            element is a tuple consisting of an
                                            object reference which has to be
                                            available after script was loading
                                            and the module name (basename of
                                            script file with or without file
                                            extension).

            **onLoaded {Function}**       - A callback function to load after
                                            all dependences are available.

            Additional arguments are forwarded to given callback function.

            **returns {Require}**         - Returns the current function
                                            (class).
        ###
        # Set class property default values.
        if not self.context?
            self.context = this
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
        if not self.injectingNode?
            self.injectingNode = document.getElementsByTagName('head')[0]
        if not self.scriptTypes?
            self.scriptTypes = '.js': 'text/javascript'
        if not self.asyncronModulePatternHandling?
            self.asyncronModulePatternHandling = {}
        if not self.onEverythingIsLoaded?
            self.onEverythingIsLoaded = ->
        for pattern, handler of self._defaultAsynchronModulePatternHandler
            if not self.asyncronModulePatternHandling[pattern]?
                self.asyncronModulePatternHandling[pattern] = handler
        if not self._callQueue?
            self._callQueue = []
        # NOTE: A constructor doesn't return last statement by default.
        return self::_load.apply Require, arguments

        # endregion

    # endregion

    # region protected methods

    _load: (parameter...) ->
        ###
            Loads needed modules and run the "onLoaded" callback function. This
            methods gets the same arguments as the global "Require"
            constructor.

            **returns {Require}** - Returns the current function (class).
        ###
        ###
            This method is alway working with argument array for easy
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
        if parameter[parameter.length - 1] isnt Require
            # Save a copy if initially given dependencies.
            parameter.push parameter[0].slice 0
            # Mark array as initialized.
            parameter.push Require
        parameter[0] = [parameter[0]] if typeof parameter[0] is 'string'
        if parameter[0].length
            # Grab first needed dependency from given queue.
            module = parameter[0].shift()
            if(typeof(module) is 'object' and
               self::_isModuleLoaded module)
                ###
                    If module is already there make a recursive call with
                    one module dependency less.
                ###
                self::_load.apply Require, parameter
            else if (
                typeof(module) is 'string' or
                not self::_isLoadingInitialized module[0], parameter
            )
                ###
                    If module is currently not loading put current function
                    call initialize loading needed resource.
                ###
                module = ['', module] if typeof(module) is 'string'
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
                self::_load.apply Require, self._callQueue.pop()[1]
        self::_handleNoConflict()
    _initializeResourceLoading: (module, parameter) ->
        ###
            Initialize loading of needed resources.

            **module {String[]}**    - A tuple (consisting of module indicator
                                       and module file path) which should be
                                       loaded.

            **parameter {Object[]}** - Saves arguments indented to be given to
                                       the on load function.

            **returns {Require}**    - Returns the current function (class).
        ###
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
                    try
                        readyState = ajaxObject.readyState
                    catch error
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
    _generateLoadedHandlerArguments: (parameters) ->
        ###
            Generates an array of arguments from initially given arguments to
            the require constructor. The generated arguments are designed to
            give loaded handler a useful scope

            **parameters {Object[]}** - Initially given arguments.

            **returns {Object[]}**    - Returns an array of arguments.
        ###
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
    _appendResourceDomNode: (scriptNode, module, parameters) ->
        ###
            Appends a given script loading tag inside the dom tree.

            **scriptNode {DomNode}**  - Dom node where to append script loading
                                        node.

            **module {String[]}**     - A tuple (consisting of module indicator
                                        and module file path) which should be
                                        loaded.

            **parameters {Object[]}** - Saves arguments indented to be given to
                                        the on load function.

            **returns {Require}**     - Returns the current function (class).
        ###
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
        self.injectingNode.appendChild scriptNode
        self
    _getScriptFilePath: (scriptFilePath) ->
        ###
            Creates a new script loading tag.

            **scriptFilePath {String}** - Path pointing to the file resource.

            **returns {String}**        - The absolute path to needed resource.
        ###
        if scriptFilePath.substring(0, 'http://'.length) is 'http://'
            return scriptFilePath
        extension = scriptFilePath.substring(
            scriptFilePath.lastIndexOf('.') + 1)
        if self.basePath[extension]
            return self.basePath[extension] + scriptFilePath
        self.basePath.default + scriptFilePath
    _createScriptLoadingNode: (scriptFilePath) ->
        ###
            Creates a new script loading tag.

            **scriptFilePath {String}** - Path pointing to the file resource.

            **returns {DomNode}**       - Returns script node needed to load
                                          given script resource.
        ###
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
    _scriptLoaded: (module, parameters) ->
        ###
            If script was loaded it will be deleted from the
            "initializedLoading" array. If all dependencies for this module are
            available the sequence could continue otherwise the current
            sequence status (the parameter array) will be saved in a queue for
            continue later.

            **module {String[]}**     - A tuple of module name to indicate if a
                                        module is presence and its file path
                                        resource.

            **parameters {Object[]}** - Saves arguments indented to be given
                                        to the on load function.

            **returns {Require}**     -  Returns the current function (class).
        ###
        hasScopeIndicator = module[0] isnt ''
        if self.scopeIndicator and not module[0]
            module[0] = self.scopeIndicator
        self.scopeIndicator = ''
        if typeof parameters[2] is 'string'
            parameters[2] = [parameters[2]]
        for value, key in parameters[2]
            if(not hasScopeIndicator and typeof value is 'string' and
               module[1] is value)
                parameters[2][key] = module
        for value, key in self.initializedLoadings
            if module[0] is value
                self.initializedLoadings.splice key, 1
                break
        if self::_isModuleLoaded module
            self::_load.apply require, parameters
        else
            self._callQueue.push [module[0], parameters]
        self
    _handleNoConflict: ->
        ###
            If "noConflict" property is set it will be handled by this method.
            It clears the called scope from the "Require" name and optionally
            runs a callback function given by the "noConflict" property after
            all dependencies are resolved.

            **returns {Require}** - Returns the current function (class).
        ###
        if self._callQueue.length is 0 and self.initializedLoadings.length is 0
            self::_log 'All resources are loaded so far.'
            if self.noConflict
                # Restore previous setted value to the "Require" reference.
                window.require = self._referenceBackup
            self.onEverythingIsLoaded()
            self.onEverythingIsLoaded = ->
        self
    _isLoadingInitialized: (moduleName, parameters) ->
        ###
            Determines if the given "moduleObject" is currently loading. If the
            given module is currently loading the current sequence status will
            be stored in the "callQueue" for continuing later.

            **moduleName {String}**   - A module object to indicate if a module
                                        is presence.

            **parameters {Object[]}** - The current status of solving the
                                        initially described arguments.

            **returns {Boolean}**     - If given module object is currently
                                        loading "true" will be given back and
                                        "false" otherwise.
        ###
        for key, value in self.initializedLoadings
            if moduleName is value
                self._callQueue.push [moduleName, parameters]
                return true
        if moduleName
            self.initializedLoadings.push moduleName
        false
    _isModuleLoaded: (module) ->
        ###
            Determines if the given "moduleObject" is present in the global
            (window) scope.

            **module {String[]}** - A tuple of module name to indicate if a
                                    module is presence and its file path.

            **returns {Boolean}** - If given module object is present this
                                    method will return "true" and "false"
                                    otherwise.
        ###
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
    _log: (message) ->
        ###
            If logging is enabled. Method shows the given message in the
            browsers console if possible or in a standalone alert-window as
            fallback.

            **message {String}** - A logging message.

            **returns {undefined|false}** - Returns the return value of
                                            "window.console.log()" or
                                            "window.alert()" or "false" if
                                            logging is disabled.
        ###
        if self.logging
            if window.console and window.console.log
                return window.console.log "require: #{message}"
            return window.alert "require: #{message}"
        false

    # endregion

this.require = Require

# endregion
