<%%@ page contentType="text/html" isELIgnored="false" %>
<%%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%%@ taglib prefix="portlet" uri="http://java.sun.com/portlet_2_0" %>

<portlet:defineObjects/>

<c:set var="nc"><portlet:namespace/></c:set>
<c:set var="lc" value="${fn:toLowerCase(nc)}" />
<c:set var="n" value="${fn:replace(lc, '_', '')}"/>

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
      var app = angular.module('${n}-<%= portletName %>', []);
      register(app);
      angular.bootstrap(document.getElementById('${n}-<%= portletName %>'), ['${n}-<%= portletName %>']);
    }

    function register(app) {
      app.controller('<%= camelName + "Controller" %>', function($scope) {
        $scope.awesomeThings = ['AngularJS', 'Bower', 'Grunt', 'Yeoman', 'uPortal', 'Open Source!'];
      });
    }
  })(window, underscore);
</script>

<style>
  #<%= portletName %>[ng-cloak] {
    display: none;
  }
</style>

<div id="${n}-<%= portletName %>" ng-cloak ng-controller="<%= camelName + 'Controller' %>">
  <h1>Awesome Things</h1>
  <ul>
    <li ng-repeat="thing in awesomeThings"> {{$index + 1}}. {{thing}} </li>
  </ul>
</div>
