var should = require('should');
var brandingToJS = require('../');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

function createVinyl(brandingFileName, contents) {
    var base = path.join(__dirname, 'fixtures');
    var filePath = path.join(base, brandingFileName);

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: contents || fs.readFileSync(filePath)
    });
}

describe('gulp-less-branding-js', function () {
    describe('brandingToJS()', function () {

        it('should compile a _branding.less to _branding.js', function (done) {
            var brandingFile = createVinyl('_branding.less');

            var stream = brandingToJS();
            stream.once('data', function (output) {


                done();
            });
            stream.write(brandingFile);
            stream.end();
        });
    });
});