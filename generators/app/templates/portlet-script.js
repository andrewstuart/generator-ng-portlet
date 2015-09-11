<%- license.js %>

(function(window, _) {
  'use strict';

  if (window.up.ngApp) {
    //If loaded, register right away.
    register(window.up.ngApp);
  } else {
    //Otherwise, let jsp call your bootstrapper once angular is loaded.
    window.up = window.up || {};
    window.up.ngApp = window.up.ngApp || {};
    window.up.ngApp.bootstrap = window.up.ngApp.bootstrap || {};

    window.up.ngApp.bootstrap.<%= camelName %> = function(n) {
      var app = angular.module(n + '-<%= portletName %>', []);
      register(app);
      var bootEle = document.getElementById(n + '-<%= portletName %>');
      angular.bootstrap(bootEle, [n + '-<%= portletName %>']);
    }
  }


  function register(app) {
    app.controller('<%= camelName + "Controller" %>', function($scope) {
      $scope.awesomeThings = ['AngularJS', 'Bower', 'Grunt', 'Yeoman', 'uPortal', 'Open Source!'];
    });
  }
})(window, up.underscore);
