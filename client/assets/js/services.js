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
      return ($window.sessionStorage.session) ? JSON.parse($window.sessionStorage.session) : false;
    } // end getSession method
  };
}])

.factory('Manager', ['$http', function($http) {
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
}]) // end Manager service

.factory('Interface', ['$window', 'Manager', function($window, Manager) {
  // less do ah
  var interfaz = {};
  return {
    getInterface: function(m_id) {
      // grabdad that interface
      return new Promise(function(resolve, reject) {
        Manager.getManagerItem(m_id, 'interface').then(function(ifaz) {
          interfaz = ifaz;
          resolve(ifaz);
        }).catch(function(e) {
          reject(e);
        });
      }); // end promiseus
    }, // end getInterface method

    getTags: function(contacts) {
      var tags = [];
      for (var i = 0; i < contacts.length; i++) {
        contacts[i].tags.map(function(tag) {
          tags.push(tag);
        });
      }
      interfaz.tags = tags;
      return tags;
    } // end getTags
  }; // end ret
}]) // end interface factory

.factory('Record', ['$http', function($http) {
  return {
    getRecords: function(m_id, type, opts) {
      opts = opts || {};
      return new Promise(function(resolve, reject) {
        $http.get("http://burnsy.wreet.xyz/manager/" + m_id + "/" + type)
        .success(function(records) {
          resolve(records);
        }).error(function(mess, status) {
          reject(mess);
        });
      }); // end promise
    },// end getRecords method

    saveRecord: function(url, record) {
      return new Promise(function(resolve, reject) {
        $http.post(url, record)
        .success(function(record) {
          resolve(record);
        }).error(function(mess, status) {
          reject(mess);
        });
      }); // end promise
    },

    deleteRecord: function(url, record) {
      return new Promise(function(resolve, reject) {
        $http.delete(url, record)
        .success(function(record) {
          resolve(record);
        }).error(function(mess, status) {
          reject(mess);
        });
      }); // end promise
    },
  };
}])  // end record service

//this will format phone numbers
//found at https://jsfiddle.net/jorgecas99/S7aSj/
.filter('tel', function () {
  return function (tel) {
    if (!tel) { return ''; }

    var value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {
      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };
});
