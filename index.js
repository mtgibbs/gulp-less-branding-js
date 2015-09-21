var path = require('path');
var accord = require('accord');
var gutil = require('gulp-util');
var through2 = require('through2');

var PluginError = gutil.PluginError;
var less = accord.load('less');

module.exports = function (options) {

    return through2.obj(function (file, enc, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(new PluginError('gulp-less-branding-js', 'Streaming not supported.'));
        }

        // regex for pulling out variables to make holder classes for them
        // curse you javascript for not supporting look-behind!
        // (?<=@)([A-Za-z0-9\-\_]+)(?=:)

        var variableRegex = /(@[A-Za-z0-9\-_]+)(?=:)/g;

        var contentsStr = file.contents.toString();

        var variables = contentsStr.match(variableRegex);

        console.log(variables.length);

        variables.forEach(function (variable) {
            variable = variable.slice(1);
            var clazz = ['.', variable, ' { color: @', variable, '; }'].join('');
            console.log(clazz);
            contentsStr = contentsStr.concat(clazz);
        });


        return file;
    });

}