<script type="text/javascript">
  (function(window, _) {
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

    function bootstrap() {
      var app = angular.module('<%= portletName %>', []);
      register(app);
      angular.bootstrap(document.getElementById('<%= portletName %>'), ['<%= portletName %>']);
    }

    function register(app) {
      app.controller('<%= portletName + "Controller" %>', function($scope) {
        $scope.awesomeThings = ['AngularJS', 'Bower', 'Grunt'];
      });
    }
  })(window, underscore);
</script>

<style>
  #<%= portletName %>[ng-cloak] {
    display: none;
  }
</style>

<div id="<%= portletName %>" ng-cloak ng-controller="<%= portletName + 'Controller' %>">
  <div ng-repeat="thing in awesomeThings">
</div>
