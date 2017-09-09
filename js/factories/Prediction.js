myAppModule.factory('Prediction', ['$http', function($http){
    return {
	getPredictionData: function(lineCodeList){
	    return $http({
		method: 'GET',
		url: 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/'
		    + lineCodeList,
		headers: {
		    'api_key': '0ef75c136a0a4f5196f20ee0f54ad8a3'
		}
	    }).then(function(response) {
		return response
	    });
	}
    }
}]);
