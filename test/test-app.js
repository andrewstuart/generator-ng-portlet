'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('ng-portlet:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ name: 'TheGen' })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'TheGen.jsp'
    ]);
  });
});
