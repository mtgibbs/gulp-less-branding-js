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
            // TODO: class these with 'gulp-less-branding-' or something to stop it from colliding with existing things
            var clazz = ['.', variable, ' { color: @', variable, '; }\r\n'].join('');
            contentsStr = contentsStr.concat(clazz);
        });

        console.log(contentsStr);

        var opts = {filename: file.path, compress: false};
        less.render(contentsStr, opts).then(function (res) {

            var compiledCss = res.result;
            var ast = css.parse(compiledCss);


            // TODO: pull out all of the rules with selectors that match the variable names

            var rules = ast.stylesheet.rules.filter(function (rule) {
                // This line is ballsy and stupid
                // but for the sake of proving this out I'm leaving it for now and will fix later
                // TODO: Fix this
                var name = rule.selectors[0].slice(1);

                return rule.type === 'rule' && variables.indexOf(name) > -1;
            });

            // TODO: now pull out the color declaration and save it

            rules.forEach(function (rule) {
                var colorDecs = rule.declarations.filter(function (declaration) {
                    return declaration.property === 'color';
                });

                if (colorDecs && colorDecs.length > 0) {
                    var color = colorDecs[0].value;

                }
            });

            //file.contents = new Buffer(res.result);
            file.contents = new Buffer('TODO PUT THE STUFF BACK!')


            return file;
        }).then(function (file) {
            callback(null, file);
        }).catch(function (err) {
            console.log(err);
            throw new PluginError('gulp-less-branding-js', err);
        }).done(undefined, callback);
    });

}