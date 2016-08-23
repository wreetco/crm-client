angular.module('application.directives', [])

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

.directive('wMasonry', function() {
	return function($scope,  $el) {
		// setup the masonry deal
		$('#masonry-container').masonry({
			itemSelector: '#masonry-container .col',
			columnWidth: '.l3',
			percentPosition: true
		});
	};
})

.directive('wrmn', function($compile) {
	return {
		restrict: 'A',
		scope: false,
		link: function($scope, $el) {
			if (!wrmn.is_initd) wrmn.init(document.getElementById('wmenu'), {menu_width: document.body.offsetWidth * .56, width_offset: 33});
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
		restrict: 'A',
		scope: {
			obj: "=wEditable",
		}, 
		controller: function($scope) {
			if (!$scope.el) $scope.el = {};
			$scope.save = function() {
				// clean up, save the changes
				$scope.el.empty(); // fuck the el down
				$timeout(function() {
					$scope.el.append($scope.obj);
					$scope.el.bind('click', function() {$scope.clickHandler($scope.el)});
				}, 0);
			};
			
			$scope.cancel = function() {
				// cancel changes, undo the setup
				$scope.el.empty(); // fuck the el down
				$timeout(function() {
					$scope.el.append($scope.original_value);
					$scope.obj = $scope.original_value;
					$scope.el.bind('click', function() {$scope.clickHandler($scope.el)});
				}, 0);
			};
			
			$scope.clickHandler = function($el) {
				// store a ref
				$scope.el = $el;
				$scope.original_value = $scope.obj;
				$el.text(''); // clear the urrea
				$compile($el.append("<input ng-model='obj'>"))($scope); // add the field
				// setup some icons for krohner
				var html = "<div><i class='material-icons green-check' ng-click='save()'>check</i>";
				html += "<i class='material-icons red-text' ng-click='cancel()'>cancel</i></div>";
				// pop them in there  
				$compile($el.append(html))($scope);
				// clean up
				$el.unbind('click'); // remove click handler shens
				$el[0].getElementsByTagName('input')[0].focus(); // reporting for duty cron
			};
		}, // end controller 
		link: function($scope, $el) {
			$el.click(function () {
				$scope.clickHandler($el);
			});
		}
	}
})


;