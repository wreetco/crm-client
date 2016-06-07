angular.module('application.services', [])
	.factory('Accounts', function($http) {
		return {
			login: function(email, passwd) {
				return new Promise(function(resolve, reject) {
					var req = JSON.stringify( { email, passwd });

					$http.post("http://burnsy.wreet.xyz/auth", req)
						.success(function(data, status) {
							resolve(data);
					})
						.error(function(data, status) {
							reject({data,status});
				   	});
				}); // end promise

			}, // end login method
		};
	}) // end accounts service




;

