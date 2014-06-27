/*
    v8php, by Ingwie Phoenix, 2014

    This is a very, very simple NodeJS module and PHP SAPI at once. It provides bindings from PHP to NodeJS.

    In this module, I will only wrap the most-needed functions, as well as maybe a zval->v8::Object and vice-versa wrapper.

    The goal of this extension is, to provide a way to speed up the cooperation of nodejs and PHP. Especially for webServers - if you plan to write an APACHE
    replacement, for example. :)

    Why this is all one file?
    ...well, why not.
*/

// PHP includes are many. And extern too.
extern "C" {
#include <main/php.h>
#include <main/php_main.h>
#include <main/SAPI.h>
#include <ext/standard/info.h>
#include <ext/standard/php_var.h>
#include <main/php_variables.h>
#include <ext/standard/php_smart_str.h>
}

// v8 is easy.
#include <node.h>
#include <v8.h>

// PHP has none. So we can savely go this way.
using namespace v8;

// We will store important information - read/write callbacks - in this one.
Object Callbacks;


// Start/Stop routines
Handle<Value> start(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}
Handle<Value> stop(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}


// Set output handlers. Puts them into the Callbakc object and ensures argument lengths.
Handle<Value> set_output_cb(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}
Handle<Value> set_error_cb(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}

// Add header.
// Same syntax as the PHP header() function...just that theyre not printed, but added to PHP itself.
Handle<Value> header(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}

// Start a request context. And end it, too.
Handle<Value> rq_start(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}
Handle<Value> rq_end(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}

// Execute a file or a string.
Handle<Value> exec_file(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}
Handle<Value> exec_str(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}

// Some additional features that we may want.
// Mind you, these now modify the actual structure! You MUST modify these before you call PHP.start(), otherwise...
Handle<Value> set_ini(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}
Handle<Value> set_argcv(const Arguments& args) {
  HandleScope scope;
  return scope.Close(True());
}

// Convenience macro.
#define NJS_SET_FNC(target, name, function) target->Set(String::New(name), FunctionTemplate::New(function)->GetFunction());

void init(Handle<Object> exports) {
    NJS_SET_FNC(exports, "start", start);
    NJS_SET_FNC(exports, "stop", stop);

    NJS_SET_FNC(exports, "rq_start", rq_start);
    NJS_SET_FNC(exports, "rq_stop", rq_stop);

    NJS_SET_FNC(exports, "onError", set_error_cb);
    NJS_SET_FNC(exports, "onOutput", set_output_cb);

    NJS_SET_FNC(exports, "header", header);

    NJS_SET_FNC(exports, "execFile", exec_file);
    NJS_SET_FNC(exports, "exec", exec_str);

    NJS_SET_FNC(exports, "setINI", set_ini);
    NJS_SET_FNC(exports, "setArgs", set_argcv);
}

// Nodejs module setup
NODE_MODULE(v8php, init)

// ... PHP module setup. Yeah, thats quite a difference here.
#define PHP_V8PHP_VERSION "0.0.1"
#define PHP_V8PHP_EXTNAME "v8php"

extern zend_module_entry v8php_module_entry;
#define phpext_v8php_ptr &v8php_module_entry

// We export zero functions. But just to be very clear, we do this.
static function_entry my_functions[] = {
    {NULL, NULL, NULL}
};

// the following code creates an entry for the module and registers it with Zend.
zend_module_entry v8php_module_entry = {
#if ZEND_MODULE_API_NO >= 20010901
    STANDARD_MODULE_HEADER,
#endif
    PHP_V8PHP_EXTNAME,
    my_functions,
    NULL, // name of the MINIT function or NULL if not applicable
    NULL, // name of the MSHUTDOWN function or NULL if not applicable
    NULL, // name of the RINIT function or NULL if not applicable
    NULL, // name of the RSHUTDOWN function or NULL if not applicable
    NULL, // name of the MINFO function or NULL if not applicable
#if ZEND_MODULE_API_NO >= 20010901
    PHP_V8PHP_VERSION,
#endif
    STANDARD_MODULE_PROPERTIES
};

ZEND_GET_MODULE(v8php)
