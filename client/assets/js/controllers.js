angular.module('application.controllers', ['nvd3'])

.controller('AccountController', ['$scope', '$window', '$location', 'Accounts', function($scope, $window, $location, Accounts) {
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
      var target = angular.element('#materialize-lean-overlay-1');
      target.remove();
      var target = angular.element('#materialize-lean-overlay-2');
      target.remove();
      $location.path('/contact');
      $scope.$apply();
    }).catch(function(err) {
      // fucked it up bradley
      console.log("Login failed with error: " + err);
    });
  }; // end login method
}])

.controller('LogoutController', ['$scope', '$window', '$http', '$controller', '$location', '$route', 'Session', function($scope, $window, $http, $controller, $location, $route, Session) {
  $controller('AccountController', {$scope: $scope});

  //logout button calls the check function to open the modal and confirm a logout
  $scope.check = function(){
    $('#logout').openModal();
  };

  //the confirm button in our logout partial will call this to clear
  // out the current session and localstorage.
  $scope.logout = function(){
    $http.delete("http://burnsy.wreet.xyz/auth", { 'cron': true }).success(function(result) {
      $('#logout').closeModal();
      //var target = angular.element('#materialize-lean-overlay-1');
      //target.remove();
      delete window.sessionStorage.session;
      delete localStorage.contacts;
      delete localStorage.interface;
      $location.path('/');
      $window.location.reload();
    }).error(function(err) {
      Materialize.toast('Please Try Again', 5000);
      console.log("error logging out: " + err);
    });
  };

}])

.controller('ManagerController', ['$scope', '$window', 'Manager', function($scope, $window, Manager) {

}])

.controller('HomeController', ['$scope', '$window', 'Interface', function($scope, $window, Interface) {
  $scope.getInterface = function() {
    // for now we only can handle the one manager interface, though the
    // backend is ready to support more when we want to add that capability
    // to that end, grab the first manager from the user array
    var m_id = JSON.parse(window.sessionStorage.session).user.managers[0];
    Interface.getInterface(m_id).then(function(interface) {
      // store the thing
      window.localStorage.interface = JSON.stringify(interface);
      $scope.interface = interface;
      console.log($scope.interface);
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
    if (!$scope.interface)
      $scope.getInterface();
  })();
}])

// record controller is god
.controller('RecordController', ['$scope', 'Record', 'Session', function($scope, Record, Session) {
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

  $scope.saveRec = function(record, callback) {
    Record.saveRecord("http://burnsy.wreet.xyz/record", record).then(function(r) {
      callback(r);
    }).catch(function(e) {
      console.log("saveRecord error: " + e);
      callback(new Error(e));
    });
  };

  $scope.deleteRec = function(path, callback) {
    Record.deleteRecord("http://burnsy.wreet.xyz/record/" + path).then(function(r) {
      callback(r);
    }).catch(function(e) {
      console.log("deleteRecord error: " + e);
      callback(new Error(e));
    });
  };

  $scope.newField = function(data, callback) {
    Record.newField("http://burnsy.wreet.xyz/", data).then(function(r) {
      callback(r);
    }).catch(function(e) {
      console.log("Save Field Error: " + e);
      callback(new Error(e));
    });
  };
}])

// and the various types of records are but loyal subjects
.controller('ContactController', ['$scope', '$window', '$controller', '$timeout', '$location', 'Session', 'Interface', function($scope, $window, $controller, $timeout, $location, Session, Interface) {
  $controller('RecordController', {$scope: $scope}); // simulated ng inheritance amidoinitrite
  ////////////////////////////////////////////////////////////////
  //contact is a record format used for posting
  //  to the DB
  ///////////////////////////////////////////////////////////////
  $scope.contact = {
    record: {
      tags: [],
      id: null,
    },
    manager: null,
  };

  // Information Side Nav Bar is called when clicking on a contact, it handles
  //  displaying contact info and the editing features
  ///////////////////////////////////////////////////////////////
  $scope.infoBar = function(c){
    //contact object
    c = c || null;
    $scope.current_contact = c;
    //interface object
    $scope.current_interface = JSON.parse($window.localStorage.interface);
    //fields obj
    $scope.current_fields = $scope.current_interface.tabs;

    for (var i = 0; i < $scope.current_interface.tabs; i++) {
      if ($scope.current_interface.tabs[i].name === "Contacts") {
        $scope.current_fields = $scope.current_interface.tabs[i];
      }
    }
    //adjust the display
    $('#contact-info-card').css('display', 'block');
    $('#contact-post-card').css('display', 'none');


    //clean out our chips deal
    $('.chip').remove();
    for(var i = 0; i < $scope.current_contact.tags.length; i++){
      $('#chip-section').append("<div class=\"chip\" id=\"#tag-id-" + $scope.current_contact.tags[i].name + "\">" + $scope.current_contact.tags[i].name + " <i class=\"close material-icons\">close</i>");
    }
    //move this to be the last child
    $('#chip-section #new-tag').appendTo('#chip-section');
  };


  // Post Side Nav Bar is called when posting a new record
  /////////////////////////////////////////////////////////////////
  $scope.postBar = function(){
    //clean up
    //let make sure this is empty before we do anything.
    $('.chip').remove();
    $scope.contact = {
      record: {
        tags: [],
      },
      manager: null,
    };
    //interface object
    $scope.current_interface = JSON.parse($window.localStorage.interface);
    //fields obj
    $scope.current_fields = $scope.current_interface.tabs[0].sections[0].fields;
    console.log($scope.current_fields);
    //adjust the display so the partial can be seen
    $('#contact-info-card').css('display', 'none');
    $('#contact-post-card').css('display', 'block');

  };

  // Post Record
  //////////////////////////////////////////////////////////////////
  $scope.postRecord = function (r) {
    //lets just fill out the tags
    $('.chip').each(function(i) {
      var str = $( this ).text();
      var lastIndex = str.lastIndexOf(" ");
      str = str.substring(0, lastIndex);
      $scope.contact.record.tags.push(str);
    });
    //get manager id
    $scope.current_session = JSON.parse($window.sessionStorage.session);
    $scope.contact.manager = $scope.current_session.user.managers[0];
    //save the record to the db
    console.log($scope.contact);
    $scope.saveRecord($scope.contact);
  };

  //called from the _contact_info partial, it handles putting
  //  the edited contact into the proper form for posting to the DB
  //////////////////////////////////////////////////////////////////
  $scope.updateRecord = function(r){
    for (var key in r.x) {
      $scope.contact.record[key] = r.x[key];
    }
    $scope.contact.record.id = r._id;
    $('.chip').each(function(i) {
      var str = $( this ).text();
      console.log(str);
      str = str.replace(/^[a-z0-9_-]+$/ig, "");
      console.log(str);

      //$scope.contact.record.tags.push(str);
    });
    $scope.contact.manager = r.manager;
    $scope.saveRecord($scope.contact);
    //
    $scope.contact = {
      record: {
        tags: [],
        id: null,
      },
      manager: null,
    };
  };

  //saveRecord is used to save either a new record or one that has
  //  been edited, requires a contact be passed into it
  ///////////////////////////////////////////////////////////////////
  $scope.saveRecord = function(r){
    //the passed in contact is assigned to post_data
    $scope.post_data = r;
    //assign the manager ID to the new record
    $scope.post_data.manager = Session.getSession().user.managers[0];
    $scope.saveRec(JSON.stringify($scope.post_data), function(res) {
      if (!(res instanceof Error)){
        //Success, refresh contacts with the new contact
        var sess = Session.getSession();
        if (!sess) return 0;
        $scope.getRecords(sess.user.managers[0], 'records', null)
        .then(function(contacts) {
          $scope.contacts = contacts;

          $scope.tags = Interface.getTags($scope.contacts);
          $scope.$apply();
          // store it to localstorage
          localStorage.contacts = JSON.stringify(contacts);
          //Now that we have saved, lets clear this out.
          $scope.contact = {
            record: {
              tags: [],
              id: null,
            },
            manager: null,
          };
          //close the slideout
          $('.button-collapse').sideNav('hide');
          Materialize.toast('Successfully Saved!', 5000);
        }).catch(function(err) {
          console.log(err);
        });
      }
      else {
        console.log(res);
        Materialize.toast('Please Try Again.', 5000);
      }
    });
  };
  // Add Field
  ///////////////////////////////////////////////////////////////
  $scope.addField = function(){

    //FIG-TUR
    $scope.new_field = {
      tab: {
        type: 'String',
      },
      section: {
        type: 'String',
      },
      name: {
        type: 'String',
      },
      db_name: {
        type: 'String',
      },
      type: {
        type: 'String',
      },
      //optional
      visibility: "",
      order: null,
    };



  };

  // Add Tag Box
  ///////////////////////////////////////////////////////////////
  $scope.tagBox = function(r){
    $scope.box_id = "#dropdown-box-" + r._id;
    $scope.input_id = "#tag-box-input-" + r._id;
    $scope.input_icon_id = "#tag-box-input-icon-" + r._id;
    $($scope.box_id).hide();
    $($scope.input_id).show();
    $($scope.input_icon_id).show();
    $($scope.input_id).focus();
    $scope.check = $scope.tagCheck(r);
  };

  // Close Tag Box
  ///////////////////////////////////////////////////////////////
  $scope.closeTagBox = function(id){
    $scope.box_id = "#dropdown-box-" + id;
    $scope.input_id = "#tag-box-input-" + id;
    $scope.input_icon_id = "#tag-box-input-icon-" + id;
    $($scope.box_id).show();
    $($scope.input_id).hide();
    $($scope.input_icon_id).hide();
  };

  // Tag Check
  ///////////////////////////////////////////////////////////////
  $scope.tagCheck = function(r){
    $scope.box_id = "#dropdown-box-" + r._id;
    $scope.input_id = "#tag-box-input-" + r._id;
    $scope.input_icon_id = "#tag-box-input-icon-" + r._id;
    $( $scope.input_id ).keypress(function(e) {
      if(e.keyCode === 13){
        var tag_name = $($scope.input_id).val();
        for(var i = 0; i < r.tags.length; i++){
          if(r.tags[i].name === tag_name){
            Materialize.toast('Tag Already Assigned', 5000);
            $($scope.box_id).show();
            $($scope.input_id).hide();
            $($scope.input_icon_id).hide();
            $($scope.input_id).val('');
            return;
          }
        }

        //Lets build the contact obj to post
        $scope.contact = {
          record: {
            tags: [],
            id: null,
          },
          manager: null,
        };
        //record stuff
        for (var key in r.x) {
          $scope.contact.record[key] = r.x[key];
        }
        //tags
        for (var j = 0; j < r.tags.length; j++){
          $scope.contact.record.tags.push(r.tags[j].name);
        }
        $scope.contact.record.tags.push(tag_name);
        //assign manager id
        var sess = Session.getSession();
        $scope.contact.manager = sess.user.managers[0];
        //assign record id
        $scope.contact.record.id = r._id;
        //let saveRecord handle the rest
        $scope.saveRecord($scope.contact);
        return;
      }
    });
  };


  // Delete Record
  ///////////////////////////////////////////////////////////////
  $scope.deleteRecord = function(id){
    var sess = Session.getSession();
    $scope.delete_path = sess.user.managers[0] + "/" + id;
    $scope.deleteRec($scope.delete_path, function(res) {
      if (!(res instanceof Error)){
        if (sess) {
          Materialize.toast('Successfully Deleted!', 5000);
          //we have a session, update contacts now that deletion is done
          $scope.getRecords(sess.user.managers[0], 'records', null).then(function(contacts) {
            $scope.contacts = contacts;
            $scope.tags = Interface.getTags($scope.contacts);
            $scope.$apply();
            // store it to localstorage
            localStorage.contacts = JSON.stringify(contacts);
            console.log(res);
            $scope.$apply();
          }).catch(function(err) {
            //couldn't get records
            console.log(err);
          });
        }
        else {
          //didn't have a session
          console.log("Session error");
        }
      }
      else {
        //couldn't delete
        console.log(res);
      }
    });
  };

  // Multi Delete Record
  ///////////////////////////////////////////////////////////////
  $scope.multiDeleteRecord = function(){
    $scope.delete_collection = [];

    $(".record-checkbox").each(function(i, value) {
      if(this.checked){
        $scope.delete_collection.push(this.value);
      }
    });

    $($scope.delete_collection).each(function(i, value) {
      $scope.deleteRecord($scope.delete_collection[i]);
    });


  };

  ///////////////////////////////////////////////////////////////
  (function() {
    if (!$scope.contacts) {
      if (localStorage.contacts)
        $scope.contacts = JSON.parse(localStorage.contacts);
      else {
        //$scope.contacts = JSON.parse(localStorage.contacts);
        var sess = Session.getSession();
        if (!sess) return 0;
        $scope.getRecords(sess.user.managers[0], 'records', null)
        .then(function(contacts) {
          $scope.contacts = contacts;
          // store it
          localStorage.contacts = JSON.stringify(contacts);
          $scope.$apply();
        }).catch(function(err) {
          console.log(err);
        });
      }
    } // end contact check
  })();

}]) // end ContactController

// end of record descendants

.controller('SettingsController', ['$scope', '$window', '$controller', 'Setting', 'Interface', 'Session', 'Record', function($scope, $window, $controller, Setting, Interface, Session, Record) {
  $controller('RecordController', {$scope: $scope}); //Well the Record Controller is our god.
  // Save Theme
  /////////////////////////////////////////////////////////////////
  $scope.saveTheme = function(){
    console.log($('#settings-color-theme input:checked').val());
    if(!$('#settings-color-theme input:checked').val()){
      $scope.theme = 'dark-theme';
    }
    else {
      $scope.theme = $('#settings-color-theme input:checked').val();
      //lets update the database
      $scope.settings = {theme: $scope.theme};
      $scope.updateSettingsWrap($scope.settings, function(res){
        console.log(res);
      });

      $("#theme").removeClass();
      $("#theme").addClass($scope.theme);
    }
  };

  // Update Settings
  ////////////////////////////////////////////////////////////////
  // expects k/v pairs in JSON {{key: value},{key1: value1}}
  $scope.updateSettingsWrap = function(settings, callback){
    console.log("Not done on API side");
    Setting.updateSettings("http://burnsy.wreet.xyz/user/settings", settings).then(function(s) {
      console.log(s);
      callback(s);
    }).catch(function(e) {
      console.log(e);
      callback(new Error(e));
    });
  };

  $scope.parseCSVInput = function(contents){
    var lines = contents.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for(var i = 1; i < lines.length; i++){
      if(lines[i] === ''){
        continue;
      }
      var obj = {};
      var currentline = lines[i].split(",");

      for(var j = 0; j < headers.length; j++){
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    $scope.current_interface = JSON.parse($window.localStorage.interface);
    $scope.current_fields = $scope.current_interface.tabs[0].sections[0].fields;
    $scope.sess = Session.getSession();

    console.log(result);

    for(var k = 0; k < result.length; k++){
      $scope.hasData = false;
      $scope.contact = {
        record: {
          tags: [],
        },
        manager: null,
      };
      for(var l = 0; l < $scope.current_fields.length; l++){
        if($scope.current_fields[l].db_name in result[k]){
          //insert into our contact deal
          $scope.contact.record[$scope.current_fields[l].db_name] = result[k][$scope.current_fields[l].db_name];
          $scope.hasData = true;
        }
      }

      if($scope.hasData === true){
        //$scope.contact.record.id = $scope.sess.user._id;
        $scope.contact.manager = $scope.sess.user.managers[0];
        //Post
        $scope.saveRec($scope.contact, function(res) {
          if (!(res instanceof Error)){
            console.log("-----> post good");
            console.log(res);
          }
          else {
            console.log(res);
            Materialize.toast('Please Try Again.', 5000);
          }
        });
      }
    }
    $scope.getRecords($scope.sess.user.managers[0], 'records', null)
    .then(function(contacts) {
      $scope.contacts = contacts;

      $scope.tags = Interface.getTags($scope.contacts);
      $scope.$apply();
      // store it to localstorage
      localStorage.contacts = JSON.stringify(contacts);
      //Now that we have saved, lets clear this out.
      $scope.contact = {
        record: {
          tags: [],
          id: null,
        },
        manager: null,
      };
    }).catch(function(err) {
      console.log(err);
    });

  };

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
