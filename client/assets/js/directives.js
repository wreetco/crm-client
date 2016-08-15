angular.module('application.directives', [])

.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
})

//Thanks to marko on StackOverflow https://jsfiddle.net/200eoamf/1/
.directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      element.bind('change', function(e) {
        var onFileReadFn = $parse(attrs.onReadFile);
        var reader = new FileReader();
        reader.onload = function() {
          var fileContents = reader.result;
          // invoke parsed function on scope
          // special syntax for passing in data
          // to named parameters
          // in the parsed function
          // we are providing a value for the property 'contents'
          // in the scope we pass in to the function
          scope.$apply(function() {
            onFileReadFn(scope, {
              'contents' : fileContents
            });
          });
        };
        reader.readAsText(element[0].files[0]);
      });
    }
  };
})


.directive('wrmn', function($compile) {
  return {
    restrict: 'A',
    scope: false,
    link: function($scope, $el) {
      if (!wrmn.is_initd) wrmn.init(document.getElementById('wmenu'), {menu_width: document.body.offsetWidth * 0.70, width_offset: 33});
    }
  };
})

.directive('wrmnToggleMenu', function($templateRequest, $compile) {
  return function($scope, $el, $atts) {
    $templateRequest('views/_contact_info.html').then(function(html){
      var tmp = angular.element(html);
      $("#__wrmn_right").empty();
      $("#__wrmn_right").append(tmp);
      $compile(tmp)($scope);
    });
  };
})

.directive('wrmnToggleMenu', function() {
  return {
    scope: {
      current_contact: "=wrmnToggleMenu"
    },
    link: function($scope, $el) {
      $el.on('click', function() {
        $scope.$apply(function() {
          $scope.$parent.$parent.infoBar($scope.current_contact);
          wrmn.cron.toggleMenu('right');
        });
      });
    }
  };
})

.directive('wEditable', function($timeout, $compile) {
  return {
    scope: {
      obj: "=wEditable",
    },
    controller: function($scope) {
      $scope.save = function() {
        //save that shit breh
        console.log("save");
        var wrapper = $($scope.id).parent();
        var newval = wrapper.children().first().val();
        //empty the wedit span
        wrapper.empty();
        //reinsert new value
        wrapper.text(newval);
      };
      $scope.cancel = function() {
        // don't change anything just empty and replace
        console.log("cancel");
        var wrapper = $($scope.id).parent();
        //empty the wedit span
        console.log(wrapper);
        $($scope.id).parent().empty();
        //reset the value/model
        $scope.obj = $scope.orig;
        //put in the original value
        wrapper.text($scope.obj);
      };
    },
    link: function($scope, $el) {
      $el.click(function() {
        //ID for each one
        $scope.id = $el.attr("w-editable");
        var editz = "<input type='text' ng-model='obj' autofocus id='" + $scope.id + "' ng-blur='cancel();' />" +
                    "<i class='material-icons green-text' style='border: 1px solid red;' ng-click='save();'>check</i>" +
                    "<i class='material-icons red-text' style='border: 1px solid red;' ng-click='cancel();'>cancel</i>";
        //I need to keep a copy of the original value
        $scope.orig = $scope.obj;
        editz = angular.element(editz);
        // clear the parent
        $el.empty();
        // add div to the dom
        $el.append($compile(editz)($scope));
        // watch for change
      });
    }
  };
})

;
