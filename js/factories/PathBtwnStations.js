myAppModule.factory('PathBtwnStations', ['$http', function($http){
    return {
	getPathData: function(startStation, endStation){
	    return $http({
		method: 'GET',
		url: 'https://api.wmata.com/Rail.svc/json/jPath?'
		    + 'FromStationCode=' + startStation
		    + '&ToStationCode=' + endStation,
		headers: {
		    'api_key': '0ef75c136a0a4f5196f20ee0f54ad8a3'
		}
	    }).then(function(response) {
		return response
	    });
	}
    }
}]);
