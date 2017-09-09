myAppModule.factory('LineData', ['$http', function($http){

    return {
	getLineData: function(lineCode){
	    return $http({
		method: 'GET',
		url: 'https://api.wmata.com/Rail.svc/json/jStations?LineCode=' + lineCode,
		headers: {
		    'api_key': '0ef75c136a0a4f5196f20ee0f54ad8a3'
		}
	    }).then(function(response) {
    		return response
	    });
	}
    }

}]);
