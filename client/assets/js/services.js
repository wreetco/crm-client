angular.module('application.services', [])
.factory('httpRequestInterceptor', function($window) {
  return {
    request: function($config) {
      if(JSON.parse(window.sessionStorage.session).token) {
        $config.headers.Authorization = JSON.parse(window.sessionStorage.session).token;
      }
      return $config;
    }
  };
})

.factory('Accounts', function($http) {
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

    }, // end login method
  };
}) // end accounts service

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
    } // end getInterface method
  }; // end ret
}) // end Manager service


;

