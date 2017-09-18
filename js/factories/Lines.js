myMetroModule.factory('Lines', ['$http', function($http){
    return $http({
	method: 'GET',
	url: 'https://api.wmata.com/Rail.svc/json/jLines',
	headers: {
	    'api_key': '0ef75c136a0a4f5196f20ee0f54ad8a3'
	}
    }).then(function(response) {
	return response
    });
}]);
