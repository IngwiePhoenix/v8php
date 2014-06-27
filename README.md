# v8php - Embed PHP into v8.

This is simply a project to help me use PHP from within javascript. It requires that you have previously built PHP with embed-sapi and maintainer-zts enabled.

## To use...

```js
var php = require("v8php");

// Tell the interpreter to start up.
php.start();

// Do INI setting
php.set("max_execution_time", 200);

// Add header
php.header("GET /index.php?r=site");

// Run a script file
php.run("myfile.php");

// Copy output to local variable.
var output = php.output;

// Reset interpreter state
php.reset();

// Shut down the interpreter.
php.shutdown();
```

## How can this be useful?
Put this extension to work within your Express application, for example. Or just utilize it in your CLI app. In my case, I am spawning a bunch of these instances and using them to serve requests.

## To build...
There is `build.js` in the source tree. This is what gets ran. It picks up corresponding PHP and NodeJS headers and other ocmpiler flags. It then compiles you a .node file. `index.js` will help you to load the module.
