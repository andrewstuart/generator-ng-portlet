'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  init: function() {
    this.argument('name', { type: String, required: false});
    this.portletName = this.name || path.basename(process.cwd());
    // this.portletName = _.camelcase(_.slugify(_.humanize(this.portletName)));
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the good ' + chalk.red('NgPortlet') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of your generator?',
      default: this.portletName
    }];

    this.prompt(prompts, function (props) {
      this.portletName = props.portletName || this.portletName;
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('portlet.jsp'),
        this.destinationPath((this.props.name || this.portletName) + '.jsp'),
        this
      );
    }
    // },
    // projectfiles: function () {
    // }
  },

  install: function () {
    this.installDependencies();
  }
});
