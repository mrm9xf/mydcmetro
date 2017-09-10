myAppModule.controller('MyFirstCtrl', ['$scope', 'Lines', 'LineData', 'PathBtwnStations', 'Prediction', function($scope, Lines, LineData, PathBtwnStations, Prediction){
    Lines.then(function(response){
	$scope.lines = response.data.Lines;
    });

    // initialize the data for the red line
    displayLineData('RD');

    $scope.displayLineData = function(lineCode){
	$scope.lineData = displayLineData(lineCode);
    }
    
    function displayLineData(lineCode){
	// create new dictionary for stop data, to be keyed by station code
	var stopData = {}

	// call the LineData api
	LineData.getLineData(lineCode).then(function(response){
	    // loop through the response
	    angular.forEach(response.data.Stations, function(stopInfo){
		// assign the station code its full stop detail
		stopData[stopInfo.Code] = stopInfo;
	    });
	    // save results in lineData to be accessed while in scope
	    $scope.lineData = stopData;
	});
    }

    $scope.pathData = displayPathdata('A15', 'B11');

    $scope.displayPathdata = function(startCode, endCode){
	displayPathdata(startCode, endCode);
    }

    function displayPathdata(startCode, endCode) {
	PathBtwnStations.getPathData(startCode, endCode).then(function(response){
	    $scope.pathData = response.data.Path;
	});
    }

    function getPrediction(lineCodeList){
	Prediction.getPrediction(lineCodeList).then(function(response){
	    $scope.predictionData = response.data.Trains;
	});
    }
}]);
