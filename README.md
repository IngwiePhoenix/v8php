# v8php - Embed PHP into v8.

This is a work-in-progress project, that will allow you to create and use a PHP instance from within nodejs, in order to enhance interaction with the two different worlds. The API will be designed to be async and modeled after `child_process.spawn`.

## Features I want to implement
- Creating a new PHP instance, even simultanous ones. That means, that I need to find a precise way to connect one php worker thread to exactly one object - in reference.
- Using request contexts. I.e., pretending to be something like Apache.
- Preparing the "built-in" INI.
- Forwarding header information (`request.headers`).
- Creating an async API to allow non-blocking usage.

## A possible API usage.
```javascript
function my_handler(request, response) {
    var PHP = require("v8php").requestEngine,
        proc = PHP(__dirname+"/"+request.url, {
            max_script_execution: 100,
            // ... snip. More options, actually INI settings.
        });

    proc.on("header",function(string){ response.header(string); });
    proc.on("output",function(chunk){ response.write(chunk.toString("utf-8")); });
    proc.on("error",function(chunk){ console.error(chunk.toString("utf-8")); });
    proc.on("end",function(chunk){ request.end(); });
}
```

## Needed
You need PHP configured with `--enable-embed` and `--enable-maintainer-zts`. We are actually using another abstraction, the embed2 SAPI, but this one is compiled in the process of this module, and linked inside. The module, unline others, is not built using `node-gyp` or `phpize`. We use `build.js` in order to do that. Its simple, but reqrueis information from both sides. You need `node-gyp` installed in order for the script to be able to pick up or download neccessary nodejs development files.

## Possible object structure
```javascript
PHP: {
    requestEngine: [Function], // Returns an event emitter that handles HTTP-ish requests.
    cliEngine: [Function], // Simpler interface, its like the php-cli SAPI.
    modules: [...], // Name:Version list of all available modules. Might do that, might not. Really, depends...
    version: "..."
}
```
