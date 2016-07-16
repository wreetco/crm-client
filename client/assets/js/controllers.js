angular.module('application.controllers', ['nvd3'])

.controller('AccountController',
			['$scope', '$window', '$location', 'Accounts',
			function($scope, $window, $location, Accounts) {
	((!$window.sessionStorage.session) ? $('#login').openModal() : $location.path('/'));

	$scope.login = function() {
		var email = $('#email').val();
		var passwd = $('#password').val();

    	Accounts.login(email, passwd).then(function(sess) {
			// store it
			var session = {
				token: sess._id,
				user: sess.user
			};
			//console.log(session);
			$window.sessionStorage.session = JSON.stringify(session);

			$("#login").closeModal();
			$location.path('/contact');
			$scope.$apply();
    	}).catch(function(err) {
			// fucked it up bradley
			console.log("Login failed with error: " + err);
    	});
	}; // end login method
}])

.controller('ManagerController',
			['$scope', '$window', 'Manager',
			function($scope, $window, Manager) {

}])

.controller('HomeController',
			['$scope', '$window', 'Interface',
			function($scope, $window, Interface) {
  $scope.test = "bradhadi thunderfuck kush";

  $scope.getInterface = function() {
    // for now we only can handle the one manager interface, though the
    // backend is ready to support more when we want to add that capability
    // to that end, grab the first manager from the user array
    var m_id = JSON.parse(window.sessionStorage.session).user.managers[0];
    Interface.getInterface(m_id).then(function(interface) {
      console.log(interface);
      // store the thing
      window.localStorage.interface = JSON.stringify(interface);
      $scope.interface = interface;
    }).catch(function(err) { // sup, mike, chyea
      console.log(JSON.stringify(err));
    });
  };

  // alert("test");
  function setActive(event) {
    $(".activeTab").remove();

    var activeTab = $("<span></span>");
    //activeTab.addClass("material-icons");
    activeTab.addClass("right");
    activeTab.addClass("activeTab");
    activeTab.text(">");
    $(event.target).append(activeTab);
  }
  $("a.activatable").click(setActive);

  (function() { // sup
    if (!localStorage.interface)
      $scope.getInterface();
    if (!$scope.interface)
      $scope.interface = JSON.parse(localStorage.interface);
  })();
}])

// record controller is god
.controller('RecordController',
			['$scope', 'Record',
			function($scope, Record) {
  // roch's
  $scope.getRecords = function(m_id, type, opts) {
    // get a manager's record of type
    return new Promise(function(resolve, reject) {
      Record.getRecords(m_id, type).then(function(records) {
        resolve(records);
        // store the thing
      }).catch(function(err) {
        reject(err);
      });
    });
  };
}])

// and the various types of records are but loyal subjects
.controller('ContactController', ['$scope', '$window', '$controller', 'Session', 'Interface', function($scope, $window, $controller, Session, Interface) {
  $controller('RecordController', {$scope: $scope}); // simulated ng inheritance amidoinitrite

  //this displays the proper partial in the right hand sidebar
  //  gives us a contact object to work with
  //  and an interface object
  $scope.infoBar = function(c){
    //contact object
    c = c || null;
    $scope.current_contact = c;
    //interface object
    $scope.current_interface = JSON.parse($window.localStorage.interface);
    //fields obj
    $scope.current_fields = $scope.current_interface.tabs[0].sections[0].fields;
    //adjust the display
    $('#contact-info-card').css('display', 'block');
    $('#contact-show-card').css('display', 'none');


    //debug
    console.log($scope.current_contact);
    console.log($scope.current_interface);
    console.log($scope.current_fields);
  };


  (function() {
    // make sure we have contacts
    if (!localStorage.contacts) {
      var sess = Session.getSession();
      if (!sess) return 0;
      $scope.getRecords(sess.user.managers[0], 'records', null)
      .then(function(contacts) {
        $scope.contacts = contacts;
        // store it
        localStorage.contacts = JSON.stringify(contacts);
      }).catch(function(err) {
        console.log(err);
      });
    }
    else if (!$scope.contacts)
      $scope.contacts = JSON.parse(localStorage.contacts);
    if (!$scope.tags)
      $scope.tags = Interface.getTags($scope.contacts);
  })();

}]) // end ContactController

// end of record descendants

.controller('SettingsController',
			['$scope',
			function($scope) {
  $scope.test = "Test Output Settings Page";

  $scope.theme = 'dark-theme';

}])

.controller('StatisticsController',
			['$scope',
			function($scope) {
  //This defines the graph on the stats page
  $scope.options = {
    chart: {
      type: 'lineChart',
      height: 450,
      margin : {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      x: function(d){ return d.x; },
      y: function(d){ return d.y; },
      useInteractiveGuideline: true,
      dispatch: {
        stateChange: function(e){ console.log("stateChange"); },
        changeState: function(e){ console.log("changeState"); },
        tooltipShow: function(e){ console.log("tooltipShow"); },
        tooltipHide: function(e){ console.log("tooltipHide"); }
      },
      xAxis: {
        axisLabel: 'Time (ms)'
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      },
      callback: function(chart){
        console.log("!!! lineChart callback !!!");
      }
    },
    title: {
      enable: true,
      text: 'Title for Line Chart'
    },
    subtitle: {
      enable: true,
      text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
      css: {
        'text-align': 'center',
        'margin': '10px 13px 0px 7px'
      }
    },
    caption: {
      enable: true,
      html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec.',
      css: {
        'text-align': 'justify',
        'margin': '10px 13px 0px 7px'
      }
    }
  };

  $scope.data = sinAndCos();

  /*Random Data Generator */
  function sinAndCos() {
    var sin = [],sin2 = [],
        cos = [];

    //Data is represented as an array of {x,y} pairs.
    for (var i = 0; i < 100; i++) {
      sin.push({x: i, y: Math.sin(i/10)});
      sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
      cos.push({x: i, y: 0.5 * Math.cos(i/10+ 2) + Math.random() / 10});
    }

    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin,      //values - represents the array of {x,y} data points
        key: 'Sine Wave', //key  - the name of the series.
        color: '#ff7f0e'  //color - optional: choose your own line color.
      },
      {
        values: cos,
        key: 'Cosine Wave',
        color: '#2ca02c'
      },
      {
        values: sin2,
        key: 'Another sine wave',
        color: '#7777ff',
        area: true      //area - set to true if you want this line to turn into a filled area chart.
      }
    ];
  }

  $scope.options2 = {
    chart: {
      type: 'pieChart',
      height: 500,
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: true,
      duration: 500,
      labelThreshold: 0.01,
      labelSunbeamLayout: true,
      legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
    }
  };

  $scope.data2 = [
    {
      key: "One",
      y: 5
    },
    {
      key: "Two",
      y: 2
    },
    {
      key: "Three",
      y: 9
    },
    {
      key: "Four",
      y: 7
    },
    {
      key: "Five",
      y: 4
    },
    {
      key: "Six",
      y: 3
    },
    {
      key: "Seven",
      y: 0.5
    }
  ];
}])
;
