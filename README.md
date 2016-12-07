# trace-log

Terrible name, but hey, it's hard to come up with a good name for a logging library. My motivation for writing this was to create a logging class that would wrap my calls to stdout or stderr and provide a context to the log message. e.g. rather than;

```
// File testFile.js
var logger = require('debug')('MyLibrary');

var testFunction = function(){
	logger('doing some stuff');
};
```

Which would generated the following debug output;

`MyLibrary doing some stuff +0ms`

I wanted the logging framework to provide more context to the log output, so you could work out which file or function a log entry was coming from. I wanted a log output more like this;

`MyLibrary testFile.js>testFunction() [DEBUG]: doing some stuff +0ms`


## Getting Started

The code is available from github. You can clone it from there or you can install it with npm if using it as a dependency of something you're building.

### Prerequisities

You will need to have nodejs and npm installed to use this library.

### Installing

If cloning the repository manually you will need to run  `npm install` in the trace-log repository directory, this will download and install all the dependent libraries in the node_modules directory.

If installing as a dependency of something you're building run the following command in your project's route directory; that in which your package.json exists.

`npm install --save trace-log`


## Running the tests

There are some mocha tests included. To run these;
`npm run test`

This library also uses the 'debug' library and no logging will be made unless the environment variable `DEBUG` is set so that output will be made. For the purpose of running the tests you can enable all debug;
`export DEBUG=*`


## Usage
To use in your code;

```
// File testFile.js
#require the library
var Logger = require('trace-log');

#Set the libary name and global log level
Logger.setGlobalDefaults("people-modeller", "TRACE");

#Create a logger
var logger = new Logger('Person.js');
logger.trace("Loading module");
var Person = function(name){
	var personLogger = logger.getSubModuleLogger('Person');
	personLogger.trace("name is %s", name);
};

module.export = Person;

```

### Log Levels 

The log level specified will limit the logging output to those log message made at that log level or more important. Valid log levels, ordered by importance, most important first;

* FATAL
* ERROR
* WARN
* INFO
* DEBUG
* TRACE

## Authors

* - *Initial work* - [BohoCode](https://github.com/BohoCode)

See also the list of [contributors](https://github.com/BohoCode/trace-log/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to sunny days. 
