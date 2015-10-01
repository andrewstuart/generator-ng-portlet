'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

var license = require('./license.js');

function findParentDir(name, dir) {
  dir = dir || process.cwd();
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

function simpleJspPath (root) {
  root = root || findRoot();
  return root + '/uportal-portlets-overlay/jasig-widget-portlets/src/main/webapp/WEB-INF/jsp';
}

function getDataPath(root) {
  root = root || findRoot();

  var buildProps = fs.readFileSync(path.resolve(root, 'build.properties')).toString();

  buildProps = buildProps.split('\n')

  var dataLine = _.find(buildProps, function(line) {
    return _.startsWith(line, 'quickstart_entities.location=');
  });

  if ( !dataLine ) { return root; }
  var dataDir = dataLine.split('=')[1];
  return dataDir ? path.resolve(root, dataDir) : root;
}

function getWebRoot(dir) {
  var srcDir = findParentDir('src', dir);
  var moduleDir = path.basename(path.dirname(srcDir));
  return moduleDir === 'uportal-war' ? '/uPortal' : '/' + moduleDir;
}

var Generator = module.exports = yeoman.generators.Base.extend({
  init: function() {
    var gen = this;

    gen.argument('name', { type: String, required: false});
    gen.portletName = gen.name || path.basename(process.cwd());
    gen.license = {
      js: license(),
      xml: license({head: '<!--', mid: '', tail: '-->'}),
      jsp: license({head: '<%--', mid: '', tail: '--%>'})
    };
    gen.license.java = gen.license.js;

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
        jsp: simpleJspPath(props.rootPath) + '/' + this.portletName + '.jsp'
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
  },
  install: function() {
    var gen = this;
    var done = gen.async();

    if ( gen.scaffoldSupportFiles ) {
      gen.prompt([{
        type: 'confirm',
        name: 'init',
        message: 'Would you like to import the new portlet?',
        default: true
      }], function(props) {
        if (props.init) {
          var ant = child_process.spawn('ant', ['data-import', '-Dfile', gen.data.file], {
            cwd: gen.path.root
          });

          var res = '';
          var err = '';

          ant.stdout.on('data', function(d) {
            gen.log(d.toString());
          });

          ant.stderr.on('data', function(d) {
            err += d;
          });


          ant.on('close', function(code) {
            if ( code !== 0 ) {
              gen.log(yosay('Uh oh, Ant exited with code ' + code));
              gen.log(chalk.red(err));
            } else {
              gen.log(yosay('Looks like everything went well. Enjoy your ' +
                            chalk.red(gen.portletName) + ' portlet!'));
            }
            done();
          });

          return;
        }
        done();
      });
    }
  }
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
        default: path.resolve(findParentDir('src', simpleJspPath()), 'main/webapp')
      },{
        type: 'input',
        name: 'webRoot',
        message: 'What will be the base url (webapp url) for your static files?',
        default: getWebRoot(simpleJspPath())
      }], function(props) {
        gen.web.root = props.webRoot;
        gen.static.root = props.fspath;

        //Set up directories

        //Setup main module script file locations
        _.each(['static', 'web'], function(cfg) {

          gen[cfg].root = path.resolve(gen[cfg].root, gen.snakeName);

          ['scripts', 'css', 'images'].forEach(function(dir) {
            gen[cfg][dir] = path.resolve(gen[cfg].root, dir)
          });

          gen[cfg].module = path.resolve(gen[cfg].scripts, 'module.js');
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
        name: 'dataDir',
        message: 'What directory should be used for the data files?',
        default: getDataPath(gen.path.root)
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
        gen.data.file = path.resolve(gen.data.dataDir, 'portlet-definition', gen.portletName + '.portlet-definition.xml')

        done();
      });
    } else {
      done();
    }
  });
}
