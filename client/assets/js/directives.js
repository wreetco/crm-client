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

.directive('wrmn', function($timeout) {
	return {
		restrict: 'A',
		scope: false,
		templateUrl: 'views/_contact_info.html',
		link: function($scope, $el) {
			if (!wrmn.is_initd) { 
				$scope.current_contact = $scope.contacts[0];
				wrmn.init(document.getElementById('wmenu'), {menu_width: document.body.offsetWidth * .7});
			}
		}
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

.directive('wEditable', function() {
	return function($scope, $el) {
		$el.bind("mouseenter", function() {
			// setup edit icons and actions
			console.log($el);
		}); 
		$el.bind('mouseout', function() {
			// tear down the edit icons and actions
		});
	};
})

;