var path = require('path');
var accord = require('accord');
var gutil = require('gulp-util');
var through2 = require('through2');
var css = require('css');

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

        var variableRegex = /(@[A-Za-z0-9\-_]+)(?=:)/g;
        var contentsStr = file.contents.toString();
        var variables = contentsStr.match(variableRegex).map(function (obj) {
            return obj.slice(1);
        });


        variables.forEach(function (variable) {
            var clazz = ['.', variable, ' { color: @', variable, '; }\r\n'].join('');
            contentsStr = contentsStr.concat(clazz);
        });

        console.log(contentsStr);

        var opts = {filename: file.path, compress: false};
        less.render(contentsStr, opts).then(function (res) {

            var compiledCss = new Buffer(res.result);
            var ast = css.parse(compiledCss);


            file.contents = new Buffer(res.result);


            return file;
        }).then(function (file) {
            callback(null, file);
        }).catch(function (err) {
            console.log(err);
            throw new PluginError('gulp-less-branding-js', err);
        }).done(undefined, callback);
    });

}