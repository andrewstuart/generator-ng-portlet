'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');

describe('ng-portlet:app', function () {
  before(function (done) {


    var p = path.join(__dirname, '../generators/app');

    helpers.run(p)
    .inTmpDir(function(dir) {
      ['web', 'data', 'fs'].forEach(f => mkdirp.sync(dir + '/' + f));
      var testBuild = path.resolve(__dirname, 'files');
      fs.copySync(testBuild, dir);
      console.log(dir);
    })
    .withOptions({ skipInstall: true })
    .withPrompts({
      portletName: 'testers',
      rootPath: '.',
      webRoot: 'web',
      dataDir: 'data',
      fspath: 'fs'
    })
    .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'fs/testers/scripts/module.js',
      'data/portlet-definition/testers.portlet-definition.xml',
      'uportal-portlets-overlay/jasig-widget-portlets/src/main/webapp/WEB-INF/jsp/testers.jsp'
    ]);
  });
});
