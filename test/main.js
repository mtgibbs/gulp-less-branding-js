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
    describe('brandingToJS() - Branding to Javascript', function () {

        it('should compile a _branding.less to _branding.js', function (done) {
            var brandingFile = createVinyl('_branding.less');

            var stream = brandingToJS();
            stream.once('data', function (output) {

                //console.log(output);
                should.exist(output);
                should.exist(output.path);
                should.exist(output.relative);
                should.exist(output.contents);

                // clean new line characters for windows compat
                var singleLineContents = output.contents.toString().replace(/\r?\n/g, '');
                var expected = fs.readFileSync(path.join(__dirname, 'expect/_branding.js'), 'utf8').replace(/\r?\n/g, '');

                String(singleLineContents).should.equal(expected);

                done();
            });
            stream.write(brandingFile);
            stream.end();
        });



        it('should compile a .less with variables commented out', function (done) {
            var brandingFile = createVinyl('_hasComments.less');

            var stream = brandingToJS();
            stream.once('data', function (output) {

                //console.log(output);
                should.exist(output);
                should.exist(output.path);
                should.exist(output.relative);
                should.exist(output.contents);

                // clean new line characters for windows compat
                var singleLineContents = output.contents.toString().replace(/\r?\n/g, '');
                var expected = fs.readFileSync(path.join(__dirname, 'expect/_hasComments.js'), 'utf8').replace(/\r?\n/g, '');

                String(singleLineContents).should.equal(expected);

                done();
            });
            stream.write(brandingFile);
            stream.end();
        });

        it('should compile a .less with variable names that match class names', function (done) {
            var brandingFile = createVinyl('_hasExistingClass.less');

            var stream = brandingToJS();
            stream.once('data', function (output) {

                //console.log(output);
                should.exist(output);
                should.exist(output.path);
                should.exist(output.relative);
                should.exist(output.contents);

                // clean new line characters for windows compat
                var singleLineContents = output.contents.toString().replace(/\r?\n/g, '');
                var expected = fs.readFileSync(path.join(__dirname, 'expect/_hasExistingClass.js'), 'utf8').replace(/\r?\n/g, '');

                String(singleLineContents).should.equal(expected);

                done();
            });
            stream.write(brandingFile);
            stream.end();
        });
    });

    describe('brandingToJS({format: "ts"}) - Branding to Typescript', function () {
        it('should compile a _branding.less to _branding.ts', function (done) {
            var brandingFile = createVinyl('_branding.less');

            var stream = brandingToJS({format: 'ts'});
            stream.once('data', function (output) {

                //console.log(output);
                should.exist(output);
                should.exist(output.path);
                should.exist(output.relative);
                should.exist(output.contents);

                // clean new line characters for windows compat
                var singleLineContents = output.contents.toString().replace(/\r?\n/g, '');
                var expected = fs.readFileSync(path.join(__dirname, 'expect/_branding.ts'), 'utf8').replace(/\r?\n/g, '');

                String(singleLineContents).should.equal(expected);

                done();
            });
            stream.write(brandingFile);
            stream.end();
        });
    });

    describe('brandingToJS({format: "JSON"}) - Branding to JSON', function () {
      it('should compile a _branding.less to _branding.json', function (done) {
          var brandingFile = createVinyl('_branding.less');

          var stream = brandingToJS({format: 'JSON'});
          stream.once('data', function (output) {

              //console.log(output);
              should.exist(output);
              should.exist(output.path);
              should.exist(output.relative);
              should.exist(output.contents);

              // clean new line characters for windows compat
              var singleLineContents = output.contents.toString().replace(/\r?\n/g, '');
              var expected = fs.readFileSync(path.join(__dirname, 'expect/_branding.json'), 'utf8').replace(/\r?\n/g, '');

              String(singleLineContents).should.equal(expected);

              done();
          });
          stream.write(brandingFile);
          stream.end();
      });
    });

    describe('brandingToJS({format: "coffee"}) - Branding to CoffeeScript', function () {
        it('should compile a _branding.less to _branding.coffee', function (done) {
            var brandingFile = createVinyl('_branding.less');

            var stream = brandingToJS({format: 'coffee'});
            stream.once('data', function (output) {

                //console.log(output);
                should.exist(output);
                should.exist(output.path);
                should.exist(output.relative);
                should.exist(output.contents);

                // clean new line characters for windows compat
                var singleLineContents = output.contents.toString().replace(/\r?\n/g, '');
                var expected = fs.readFileSync(path.join(__dirname, 'expect/_branding.coffee'), 'utf8').replace(/\r?\n/g, '');

                String(singleLineContents).should.equal(expected);

                done();
            });
            stream.write(brandingFile);
            stream.end();
        });
    });
});
