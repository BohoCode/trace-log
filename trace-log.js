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

var dateHelper = {
    pad : function(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    },

    toISOString : function(date) {
        return date.getUTCFullYear() +
            '-' + this.pad(date.getUTCMonth() + 1) +
            '-' + this.pad(date.getUTCDate()) +
            'T' + this.pad(date.getUTCHours()) +
            ':' + this.pad(date.getUTCMinutes()) +
            ':' + this.pad(date.getUTCSeconds()) +
            '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    }
};


class Logger {

    static setGlobalDefaults(libraryName, logLevel, jsonOutput) {
        var defaultLevel = Logger.LEVEL[logLevel];
        if(typeof defaultLevel === 'undefined'){
            Console.error("Unrecognised logLevel " + logLevel + "Defaulting to INFO");
            Logger.prototype.defaultLogLevel = Logger.LEVEL.INFO;
        } else {
            Logger.prototype.defaultLogLevel = defaultLevel;
        }
        Logger.prototype.libraryName = libraryName;
        Logger.prototype.jsonOutput = jsonOutput;
        Logger.prototype.debugLogger = require('debug')(libraryName);
        Logger.prototype.debugLogger.log = console.log.bind(console);
        Logger.prototype.errorLogger = require('debug')(libraryName);
        Logger.prototype.errorLogger.log = console.error.bind(console);
    };

    constructor(moduleName, localLogLevel, outputJson){
        this.moduleName = moduleName;
        var logLevel = Logger.LEVEL[localLogLevel];
        if(typeof logLevel !== 'undefined') {
            this.localLogLevel = localLogLevel;
        }
    };

    getSubModuleLogger(subModuleName, localLogLevel){
        var catSubModuleName = this.moduleName + ">" + subModuleName;
        var subModuleLogLevel = this.localLogLevel;
        var subModuleJsonOutput = Logger.jsonOutput;
        if(typeof localLogLevel !== 'undefined'){
            subModuleLogLevel = localLogLevel;
        }
        return new Logger(catSubModuleName, subModuleLogLevel, subModuleJsonOutput);
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
        this.makeLogEntry(Logger.LEVEL.FATAL, template, args);
    }

    makeLogEntry(logLevel, template, args){
        var validLogLevel = Logger.LEVEL[this.localLogLevel];
        if(typeof validLogLevel === 'undefined'){
            validLogLevel = this.defaultLogLevel;
        }

        // If we have one arg that isn't an array then put it into an array so that we may
        // us vsprintf
        var sanArgs = [].concat( args );

        if(logLevel <= validLogLevel){
            var providedLogMessage = vsprintf(template, sanArgs);
            var strLevel = "[" + this.getStringLogLevel(logLevel) + "] ";
            let outputMessage;
            if(this.jsonOutput){
                let logObject = {
                    level: this.getStringLogLevel(logLevel),
                    logger_name: this.libraryName,
                    module_name: this.moduleName,
                    message: providedLogMessage
                }
                logObject['@timestamp'] = dateHelper.toISOString(new Date());
                outputMessage = JSON.stringify(logObject);
                if(logLevel <= Logger.LEVEL.ERROR){
                    console.error(outputMessage);
                } else {
                    console.log(outputMessage);
                }
            } else {
                outputMessage = strLevel + " " + this.moduleName + ": " + providedLogMessage;
                if(logLevel <= Logger.LEVEL.ERROR){
                    this.errorLogger(outputMessage);
                }else{
                    this.debugLogger(outputMessage);
                }
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