var embed2_dir = "./embed2-sapi/src/";
var files = {
    c: [embed2_dir+"php_embed2.c"],
    cxx: ["v8php.cc"]
};

// Simple "which" utility function. Ment to pick up compiler(s) or tool(s).
function which(prog) {
    var dirs = process.env["PATH"].split(require("path").delimiter);
    var fnd= false;
    var whe;
    for(var i=0; i<dirs.length; i++) {
        var pt=require("path").join(dirs[i], prog);
        if( require("fs").existsSync(pt) ) {
            fnd=true;
            whe=pt;
            break;
        }
    }
    return {found:fnd, where:whe};
}

function check_res(result) {
    if(typeof result == "boolean") {
        console.log( (result==true?"Yes.":"No.") );
    } else {
        console.log(result);
    }
}
function checking(msg, callback) {
    process.stdout.write("checking for "+msg+"... ");
    check_res(callback());
}

// Config variables
var CC;
var CXX;
var PC;
var ZTS;

checking("C compiler", function(){
    var ccs = ["clang", "gcc", "cc", "cl"];
    for(var i=0; i<ccs.length; i++) {
        var s = which(ccs[i]);
        if(s.found == true) {
            CC=s.where;
            return CC;
        }
    }
    return false;
});

checking("C++ compiler", function(){
    var ccs = ["clang++", "g++", "c++", "cl"];
    for(var i=0; i<ccs.length; i++) {
        var s = which(ccs[i]);
        if(s.found == true) {
            CXX=s.where;
            return CXX;
        }
    }
    return false;
});

checking("'php-config' script", function(){
    var searchFor;
    if(process.env['VP_PHP_CONFIG']) {
        searchFor=process.env['VP_PHP_CONFIG'];
    } else {
        searchFor="php-config";
    }

    var wres=which(searchFor);
    if(wres.found) {
        PC=wres.where;
        return true;
    } else {
        return false;
    }
});
// If we have no PC set, then we should do something about it.
if(typeof PC == "undefined") {
    console.error("*** ERROR\n    No php-config could be found. Make sure PHP is installed properly and php-config available.\n\n*** Aborting.");
}

// --configure-options
checking("PHP ZTS support", function(){
    var exec = require("execSync").exec;
    var fs = require("fs");
    var cflags = exec([PC, "--includes"].join(" "));
    var ldflags = exec([PC, "--ldflags"].join(" "));
    fs.writeFile(
        "php_zts_test.c",
        "#include <php_config.h>\n"
        +"#include <stdio.h>\n"
        +"int main(int argc, char** argv){\n"
        +"#ifdef ZTS\n"
        +"printf('1');\n"
        +"#endif\n"
        +"}",
        "utf-8"
    );
    exec([CC, cflags.stdout.replace('\n',' '), ldflags.stdout.replace('\n',' '), "php_zts_test.c", "-o pzt"].join(" "));

    // Return value
    var rtv = exec(process.cwd() + require("path").sep + "pzt");

    // Kill files.
    if(fs.existsSync("pzt")) fs.unlinkSync("pzt");
    if(fs.existsSync("php_zts_test.c")) fs.unlinkSync("php_zts_test.c");

    if(rtv.stdout.replace('\n', " ") == "1") {
        ZTS=true;
        return true;
    } else {
        ZTS=false;
        return false;
    }
});

// We may only continue, if ZTS is enabled.
if(ZTS==false) {
    console.error(
        "\n\n*** ERROR ***\n\n",
        "    In order to build this module, you need to have a PHP with ZTS support enabled!\n",
        "    You can do so, by compiling PHP with the option --enable-maintainer-zts\n",
        "    You can find the source code for PHP, to build your version, at: http://github.com/php\n\n",
        "*** Aborting."
    );
}

// This is ridiculous. No, seriously. In order to get this working, I had to read cryptic, generated, makefiles...
/*
    Compiling "shared objects" on linux:
        gcc -shared input.c -o output.so

    On OS X however...
        clang -bundle -undefined dynamic_lookup input.c -o output.so

    I BELIVE, I am not sure, that using -undefined and selecting dynamic lookup, tells the linker to not check for missing synbols.
    Rather, make it trust, that once oyu need the library, somebody else provides the symbols for you.
    Seriously. Wouldnt -bundle be enough on its own? D:
*/
switch(require("os").type.toLowerCase()){
case 'darwin':
    var eflags="-bundle -undefined dynamic_lookup";
    break;
case 'linux':
    var eflags="-shared";
    break;
default:
    console.error("Unimplemented OS.");
}

// Now, lets get interesting. We now can actually try and compile. New methods needed.
function compile(type, file, cmdArr) {
    console.log("    "+type.toUpperCase()+": "+file);
    require("execSync").run(cmdArr.join(" "));
}

// Compile. Really easy.
compile(
    "C", files.c.join(" "),
    [CC, cflags, "-c", files.c.join(" ")]
);
/*compile(
    "C++", files.cxx.join(" "),
    [CXX, cflags, "-c", files.cxx.join(" ")]
);
compile(
    ".node", files.cxx.join(" "),
    [CXX, eflags, "*.o -o v8php.node"]
);*/
