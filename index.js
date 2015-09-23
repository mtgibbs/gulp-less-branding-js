var path = require('path');
var accord = require('accord');
var gutil = require('gulp-util');
var through2 = require('through2');
var css = require('css');
var changeCase = require('change-case');
var assign = require('object-assign');

var PluginError = gutil.PluginError;
var less = accord.load('less');

// TODO: support choosing between a .js or .json format
// One you can just load as global variables
// One you can require into your scripts
// I suppose it depends on how you want to handle it
module.exports = function (options) {

    options = assign({
        format: 'js'
    }, options);

    // lowercase the format just because
    options.format = options.format.toLowerCase();

    validateOptions(options);

    return through2.obj(function (file, enc, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(new PluginError('gulp-less-branding-js', 'Streaming not supported.'));
        }

        var contentsStr = file.contents.toString();

        // replace all comments with empty string
        contentsStr = contentsStr.replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g, '');

        var variableRegex = /(@[A-Za-z0-9\-_]+)(?=:)/g;
        var variables = contentsStr.match(variableRegex).map(function (obj) {
            return obj.slice(1);
        });

        variables.forEach(function (variable) {
            // TODO: class these with '.gulp-less-branding' or something to stop it from colliding with existing things
            var clazz = ['.', variable, ' { color: @', variable, '; }\r\n'].join('');
            contentsStr = contentsStr.concat(clazz);
        });

        var opts = {filename: file.path, compress: false};
        less.render(contentsStr, opts).then(function (res) {

            var filename = path.basename(opts.filename).replace(/\..+$/, '');
            var ast = css.parse(res.result);

            var colorKvps = ast.stylesheet.rules
                .filter(function (rule) {
                    // This line is ballsy and stupid
                    // but for the sake of proving this out I'm leaving it for now and will fix later
                    // TODO: Fix this
                    var name = rule.selectors[0].slice(1);

                    return rule.type === 'rule' && variables.indexOf(name) > -1;
                })
                .map(function (rule) {
                    var colorDecs = rule.declarations.filter(function (declaration) {
                        return declaration.property === 'color';
                    });

                    if (colorDecs && colorDecs.length > 0) {
                        var color = colorDecs[0].value;

                        return {
                            // TODO: And here it is again!
                            key: rule.selectors[0].slice(1),
                            value: color
                        }
                    }
                });

            var name = changeCase.camel(filename);

            var result;

            switch (options.format) {

                case 'js':
                case '.js':
                case 'javascript':
                    result = generateForJavascript(name, colorKvps);
                    break;

                case 'ts':
                case '.ts':
                case 'typescript':
                    result = generateForTypescript(name, colorKvps);
                    break;

                case 'coffee':
                case '.coffee':
                case 'coffeescript':
                    result = generateForCoffeescript(name, colorKvps);
                    break;
            }

            file.contents = new Buffer(result.contents);
            file.path = gutil.replaceExtension(file.path, result.fileExt);

            return file;
        }).then(function (file) {
            callback(null, file);
        }).catch(function (err) {
            console.log(err);
            throw new PluginError('gulp-less-branding-js', err);
        }).done(undefined, callback);
    });

    function generateForJavascript(variableName, colorKvps) {

        var colorResource = {};
        colorKvps.forEach(function (kvp) {
            colorResource[changeCase.camel(kvp.key)] = kvp.value;
        });
        var contents = ['var ', variableName, 'Resource = ', JSON.stringify(colorResource, null, 4), ';'].join('');
        return {fileExt: '.js', contents: contents};
    }

    function generateForTypescript(variableName, colorKvps) {

        var colorResource = {};
        colorKvps.forEach(function (kvp) {
            colorResource[changeCase.pascal(kvp.key)] = kvp.value;
        });
        var interfaceName = ['I', changeCase.pascal(variableName), 'Resource'].join('');
        var contents = ['var ', variableName, 'Resource:', interfaceName, ' = '
                        , JSON.stringify(colorResource, null, 4), ';\n\n',
                        'interface ', interfaceName, ' {\n'].join('');

        for (var k in colorResource) {
            var type = isNaN(colorResource[k]) ? 'string' : 'number';
            contents = [contents, '    ', changeCase.pascal(k), ': ', type, ';\n'].join('');
        }
        contents = [contents, '}\n'].join('');

        return {fileExt: '.ts', contents: contents};
    }

    // DISCLAIMER: I DON'T ACTUALLY WORK IN COFFEESCRIPT EVER
    function generateForCoffeescript(variableName, colorKvps) {

        var contents = [variableName, "Resource =\n"].join('');

        colorKvps.forEach(function(kvp) {
            contents = [contents,'  ', changeCase.camel(kvp.key), ': "', kvp.value, '"', '\n'].join('');
        });

        return {fileExt: '.coffee', contents: contents};
    }

    function validateOptions(options) {

        // TODO: if more options are added, make sure to validate all of them before throwing the error
        if (['js', '.js', 'javascript',
                'ts', '.ts', 'typescript',
                'coffee', '.coffee', 'coffeescript']
                .indexOf(options.format) < 0) {
            throw new PluginError('gulp-less-branding-js', 'Format \'' + options.format + '\' not supported.');
        }
    }
}
