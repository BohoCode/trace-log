/*
 *
 * Copyright (c) 2016 Jamie Bowen
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*jshint esversion: 6 */
var vsprintf = require("sprintf-js").vsprintf;

class Logger {

    static setGlobalDefaults(libraryName, logLevel) {
        Logger.defaultLogLevel = Logger.LEVEL[logLevel];
        if(typeof Logger.defaultLogLevel === 'undefined'){
            Console.error("Unrecognised logLevel " + logLevel + "Defaulting to INFO");
            Logger.defaultLogLevel = Logger.LEVEL.INFO;
        }
        Logger.libraryName = libraryName;
        Logger.debug = require('debug')(libraryName);
        Logger.debug.log = console.log.bind(console);
        Logger.error = require('debug')(libraryName);
        Logger.error.log = console.error.bind(console);
    };

    constructor(moduleName, localLogLevel){
        this.moduleName = moduleName;
        var logLevel = Logger.LEVEL[localLogLevel];
        if(typeof localLogLevel !== 'undefined') {
            this.localLogLevel = localLogLevel;
        }
    }

    getSubModuleLogger(subModuleName, localLogLevel){
        var catSubModuleName = this.moduleName + ">" + subModuleName;
        var subModuleLogLevel = this.localLogLevel;
        if(typeof localLogLevel !== 'undefined'){
            subModuleLogLevel = localLogLevel;
        }
        return new Logger(catSubModuleName, subModuleLogLevel);
    }

    trace(template, args){
        this.makeLogEntry(Logger.LEVEL.TRACE, template, args);
    }

    debug(template, args){
        this.makeLogEntry(Logger.LEVEL.DEBUG, template, args);
    }

    info(template, args){
        this.makeLogEntry(Logger.LEVEL.INFO, template, args);
    }

    warn(template, args){
        this.makeLogEntry(Logger.LEVEL.WARN, template, args);
    }

    error(template, args){
        this.makeLogEntry(Logger.LEVEL.ERROR, template, args);
    }

    fatal(template, args){
        this.makeLogEntry(LEVEL.FATAL, template, args);
    }

    makeLogEntry(logLevel, template, args){
        var validLogLevel = Logger.defaultLogLevel;
        if(typeof this.localLogLevel !== 'undefined'){
            validLogLevel = this.localLogLevel;
        }

        if((typeof args !== 'undefined') && (typeof args !== 'array')){
            var newArgs = [args];
            args = newArgs;
        }

        if(logLevel <= validLogLevel){
            var providedLogMessage = vsprintf(template, args);
            var strLevel = "[" + this.getStringLogLevel(logLevel) + "] ";
            if(logLevel <= Logger.LEVEL.ERROR){
                Logger.error(strLevel + " " + this.moduleName + ": " + providedLogMessage);
            }else{
                Logger.debug(strLevel + " " + this.moduleName + ": " + providedLogMessage);
            }
        }
    }

    getStringLogLevel(dbgValue){
        for (var name in Logger.LEVEL){
            if(Logger.LEVEL[name] === dbgValue){
                return name;
            }
        }
    }
}

Logger.LEVEL = {
    FATAL: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5
};

Logger.defaultLogLevel = Logger.LEVEL.DEBUG;
Logger.libraryName = "call Logger.globalValues() to set library name and global log level";


module.exports = Logger;