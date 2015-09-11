'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var license = require('./license');

function findParentDir(name) {
  var dir = process.cwd();
  while ( path.basename(dir) !== name && dir !== '/') {
    dir = path.dirname(dir);
  }
  return dir;
}

function findRoot() {
  var dir = process.cwd();
  while ( dir != '/' ) {
    try {
      fs.statSync(path.resolve(dir, 'uportal-war'));
      return dir;
    } catch (e) {
      dir = path.dirname(dir);
    }
  }

  //If uportal-war directory is not found, use the current directory.
  return process.cwd();
}

function getDataPath() {
  var root = findRoot();
  if ( root === process.cwd() ) { return root; }

  var buildProps = fs.readFileSync(path.resolve(root, 'build.properties')).toString();

  buildProps = buildProps.split('\n')

  var dataLine = _.find(buildProps, function(line) {
    return _.startsWith(line, 'quickstart_entities.location=');
  });

  if ( !dataLine ) { return root; }
  var dataDir = dataLine.split('=')[1];
  return dataDir ? path.resolve(root, dataDir) : root;
}

function getWebRoot() {
  var srcDir = findParentDir('src');
  var moduleDir = path.basename(path.dirname(srcDir));
  return moduleDir === 'uportal-war' ? '/uPortal' : '/' + moduleDir;
}

var Generator = module.exports = yeoman.generators.Base.extend({
  init: function() {
    var gen = this;

    this.argument('name', { type: String, required: false});
    this.portletName = this.name || path.basename(process.cwd());
    this.license = {
      js: license(),
      xml: license({head: '<!--', mid: '', tail: '-->'}),
      jsp: license({head: '<%--', mid: '', tail: '--%>'})
    };
    this.license.java = this.license.js;

    //Default properties objects
    _.each(['path', 'web', 'static', 'data'], function(k) {
      gen[k] = {}
    });
  },

  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('NgPortlet') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'portletName',
      message: 'What is the name of your portlet?',
      default: this.portletName
    }, {
      type: 'input',
      name: 'rootPath',
      message: 'What is the root directory of your portal codebase?',
      default: findRoot()
    }];

    //TODO data dir: find root, examine build.properties for
    //quickstart_entities, make sure it's the right location.

    this.prompt(prompts, function (props) {
      this.portletName = props.portletName || this.portletName;

      this.camelName = _.camelCase(this.portletName);
      this.snakeName = _.snakeCase(this.portletName);

      // To access props later use this.props.someOption;
      this.props = props;

      _.extend(this.path, {
        root: props.rootPath,
        jsp: this.portletName + '.jsp'
      });

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('portlet.jsp'),
        this.destinationPath(this.path.jsp),
        this
      );

      if ( this.separateFiles ) {
        this.fs.copyTpl(
          this.templatePath('portlet-script.js'),
          this.destinationPath(this.static.module),
          this);
      }

      if ( this.scaffoldSupportFiles ) {
        this.fs.copyTpl(
          this.templatePath('portlet-definition.xml'),
          this.destinationPath(this.data.file),
          this
        );
      }
    }
    // },
    // projectfiles: function () {
    // }
  }//,
  // installing: function() {
  //   if ( this.props.scaffoldSupportFiles ) {
  //     this.prompt([{
  //       input: 'confirm',
  //       name: 'init',
  //       message: 'Would you like to initialize the database?',
  //       default: false
  //     }], function(props) {
  //       if (props.init) {
  //         //TODO run ant initdb
  //       }
  //     }.bind(this));
  //   }
  // }
});

Generator.prototype.separateScript = function separateScript() {
  var gen = this;
  var done = gen.async();

  gen.prompt([{
    type: 'confirm',
    name: 'separateFiles',
    message: 'Would you like the script files for your jsp to be external (not inline)?',
    default: true
  }], function(props) {
    gen.separateFiles = props.separateFiles;
    if ( gen.separateFiles ) {
      gen.prompt([{
        type: 'input',
        name: 'fspath',
        message: 'What is the desired webapp directory for static files?',
        default: findParentDir('src') + '/main/webapp'
      },{
        type: 'input',
        name: 'root',
        message: 'What will be the http base for your static files?',
        default: getWebRoot()
      }], function(props) {
        gen.web.root = props.root;
        gen.static.root = props.fspath;

        //Set up directories

        //Setup main module script file locations
        _.each(['static', 'web'], function(cfg) {

          gen[cfg].root += '/' + gen.snakeName;

          _.each(['scripts', 'css', 'images'], function(dir) {
            gen[cfg][dir] = [gen[cfg].root, dir].join('/');
          });

          gen[cfg].module = gen[cfg].scripts + '/module.js';
        });

        done();
      });
    } else {
      done();
    }
  })

};

Generator.prototype.scaffoldOtherFiles = function scaffoldOtherFiles() {
  var gen = this;
  var done = gen.async();

  gen.prompt([{
    type: 'confirm',
    name: 'scaffoldSupportFiles',
    message: 'Would you like us to scaffold out support files?'
  }], function(props) {
    gen.scaffoldSupportFiles = props.scaffoldSupportFiles;

    if ( props.scaffoldSupportFiles ) {
      return gen.prompt([{
        type: 'input',
        name: 'directory',
        message: 'What directory should be used for the data files?',
        default: getDataPath()
      },{
        type: 'input',
        name: 'fname',
        message: 'What is the fname for the portlet?',
        default: gen.portletName
      },{
        type: 'input',
        name: 'title',
        message: 'What is the portlet title?',
        default: _.capitalize(gen.camelName.replace('-', ' '))
      },{
        type: 'input',
        name: 'description',
        message: 'What should the portlet description be?',
        default: 'A really awesome portlet'
      },{
        type: 'confirm',
        name: 'showChrome',
        message: 'Should the portlet show chrome (the default border)?',
        default: true
      }], function(props) {

        _.extend(gen.data, props);
        gen.data.file = gen.data.directory + '/' + gen.portletName + '.portlet-definition.xml'

        done();
      });
    } else {
      done();
    }
  });
}
