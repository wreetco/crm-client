angular.module('application.services', [])
// some interceptrons
.factory('httpAddAuthHeaderIntercept', ['Session', function(Session) {
  return {
    request: function($config) {
      if(Session.isLoggedIn()) {
        $config.headers.Authorization = JSON.parse(window.sessionStorage.session).token;
      }
      return $config;
    }
  };
}])

// actual factories
.factory('Accounts', ['$http', function($http) {
  return {
    login: function(email, passwd) {
      return new Promise(function(resolve, reject) {
        var req = JSON.stringify( { email, passwd });
        $http.post("http://burnsy.wreet.xyz/auth", req)
        .success(function(data, status) {
          // future reqs will want the token
          resolve(data);
        })
        .error(function(data, status) {
          reject({data,status});
        });
      }); // end promise

    } // end login method
  };
}]) // end accounts service

.factory('Session', ['$window', function($window) {
  return {
    isLoggedIn: function() {
      if ($window.sessionStorage.session)
        return true;
      else
        return false;
    }, // end isLoggedIn method

    getSession: function() {
      return JSON.parse($window.sessionStorage.session);
    } // end getSession method
  };
}])

.factory('Manager', function($http) {
  return {
    getManagerItem: function(manager_id, item) {
      return new Promise(function(resolve, reject) {
        $http.get("http://burnsy.wreet.xyz/manager/"+manager_id+"/"+item).success(function(data) {
          resolve(data);
        }).error(function(data, status) {
          reject({
            data: data,
            status: status
          });
        });
      }); // end promise
    } // end getManagerItem method
  }; // end ret
}) // end Manager service
;

