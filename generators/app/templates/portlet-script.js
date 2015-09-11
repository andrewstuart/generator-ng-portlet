<%- license.js %>

(function(window, _) {
  'use strict';

  window.up = window.up || {};
  window.up.ngApp = window.up.ngApp || {};
  window.up.ngApp.bootstrap = window.up.ngApp.bootstrap || {};

  if (typeof window.angular === 'undefined') {
    var ANGULAR_SCRIPT_ID = 'angular-uportal-script';

    var scr = document.getElementById(ANGULAR_SCRIPT_ID);

    if (!scr) {
      scr = document.createElement('script');
      scr.type = 'text/javascript';
      scr.id = ANGULAR_SCRIPT_ID;
      scr.async = true;
      scr.charset = 'utf-8';
      scr.src = 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.4/angular.js';
      document.body.appendChild(scr);
    }
    scr.addEventListener('load', bootstrap);
  } else {
    if (window.up.ngApp) {
      register(window.up.ngApp);
    } else {
      bootstrap(angular);
    }
  }

  window.up.ngApp.bootstrap.<%= camelName %> = function bootstrap(n) {
    var app = angular.module(n + '-<%= portletName %>', []);
    register(app);
    angular.bootstrap(document.getElementById(n + '-<%= portletName %>'), [n + '-<%= portletName %>']);
  }

  function register(app) {
    app.controller('<%= camelName + "Controller" %>', function($scope) {
      $scope.awesomeThings = ['AngularJS', 'Bower', 'Grunt', 'Yeoman', 'uPortal', 'Open Source!'];
    });
  }
})(window, underscore);
