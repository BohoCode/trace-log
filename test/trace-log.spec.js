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


var expect = require('chai').expect;
var Logger = require("../trace-log");
var sinon  = require("sinon");

const LIB_NAME = "TestLibrary";
const TEST_LOG_STRING = "Test log string";
const TEST_LOG_NAME = "TestModule";
const SUB_MODULE_NAME = "SubModule";

/*jshint esversion: 6 */
describe('trace-log', function () {

    beforeEach(function () {
        sinon.stub(console, "log").returns(void 0);
        sinon.stub(console, "error").returns(void 0);
    });

    afterEach(function () {
        console.log.restore();
        console.error.restore();
    });

    it("info log messages should be written when global default log level is set to INFO", function () {
        Logger.setGlobalDefaults(LIB_NAME, 'INFO');
        var logger = new Logger(TEST_LOG_NAME);
        logger.info(TEST_LOG_STRING);
        expect(console.log.called).to.be.true;
        expect(console.log.getCall(0).args[0]).to.contain(TEST_LOG_STRING);
        expect(console.log.getCall(0).args[0]).to.contain(LIB_NAME);
        expect(console.log.getCall(0).args[0]).to.contain(TEST_LOG_NAME);
        expect(console.log.getCall(0).args[0]).to.contain("[INFO]")
    });

    it("error log messages should be written when global default log level is set to INFO", function () {
        Logger.setGlobalDefaults(LIB_NAME, 'INFO');
        var logger = new Logger(TEST_LOG_NAME);
        logger.error(TEST_LOG_STRING);
        expect(console.error.called).to.be.true;
        expect(console.error.getCall(0).args[0]).to.contain(TEST_LOG_STRING);
        expect(console.error.getCall(0).args[0]).to.contain(LIB_NAME);
        expect(console.error.getCall(0).args[0]).to.contain(TEST_LOG_NAME);
        expect(console.error.getCall(0).args[0]).to.contain("[ERROR]")
    });

    it("debug log messages should NOT be written when global default log level is set to INFO", function () {
        Logger.setGlobalDefaults(LIB_NAME, 'INFO');
        var logger = new Logger(TEST_LOG_NAME);
        logger.debug(TEST_LOG_STRING);
        expect(console.error.called).to.be.false;
        expect(console.log.called).to.be.false;
    });

    it("debug log messages should be written when global default log level is set to INFO but local logger is TRACE", function () {
        Logger.setGlobalDefaults(LIB_NAME, 'INFO');
        var logger = new Logger(TEST_LOG_NAME, Logger.LEVEL.TRACE);
        logger.debug(TEST_LOG_STRING);
        expect(console.log.called).to.be.true;
        expect(console.log.getCall(0).args[0]).to.contain(TEST_LOG_STRING);
        expect(console.log.getCall(0).args[0]).to.contain(LIB_NAME);
        expect(console.log.getCall(0).args[0]).to.contain(TEST_LOG_NAME);
        expect(console.log.getCall(0).args[0]).to.contain("[DEBUG]")
    });

    it("includes the subModuleName when obtaining a sub logger from a logger.", function () {
        Logger.setGlobalDefaults(LIB_NAME, 'INFO');
        var logger = new Logger(TEST_LOG_NAME, Logger.LEVEL.TRACE);
        var subModuleLogger = logger.getSubModuleLogger(SUB_MODULE_NAME);
        subModuleLogger.debug(TEST_LOG_STRING);
        expect(console.log.called).to.be.true;
        expect(console.log.getCall(0).args[0]).to.contain(TEST_LOG_STRING);
        expect(console.log.getCall(0).args[0]).to.contain(LIB_NAME);
        expect(console.log.getCall(0).args[0]).to.contain(TEST_LOG_NAME);
        expect(console.log.getCall(0).args[0]).to.contain(SUB_MODULE_NAME);
        expect(console.log.getCall(0).args[0]).to.contain("[DEBUG]")
    });


    it("does substitution correctly.", function(){
        Logger.setGlobalDefaults(LIB_NAME, 'DEBUG');
        var logger = new Logger(TEST_LOG_NAME);
        var thing = 'thing';
        var statusCode = {statusCode:401, message: "oops"};
        logger.info("The %s has just returned an error code of %s", [thing, statusCode]);
        expect(console.log.getCall(0).args[0]).to.contain(thing);
        expect(console.log.getCall(0).args[0]).to.contain(statusCode.toString());
    });

    it("works if one arg passed.", function(){
        Logger.setGlobalDefaults(LIB_NAME, 'DEBUG');
        var logger = new Logger(TEST_LOG_NAME);
        var thing = 'thing';
        var statusCode = {statusCode:401, message: "oops"};
        logger.info("The thing is", thing);
        expect(console.log.getCall(0).args[0]).to.contain(thing);
    });

    it("works with multiple args in an array", function(){
        Logger.setGlobalDefaults(LIB_NAME, 'DEBUG');
        var logger = new Logger(TEST_LOG_NAME);
        var name = 'Fred';
        var person = { age: 26, hair_color:'brown'};
        logger.info("Person named %s has data %j", [name, person]);
        expect(console.log.getCall(0).args[0]).to.contain(name);
        expect(console.log.getCall(0).args[0]).to.contain(JSON.stringify(person));
    })
});