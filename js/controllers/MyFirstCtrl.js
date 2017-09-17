myAppModule.controller('MyFirstCtrl', ['$scope', 'Lines', 'LineData', 'PathBtwnStations', 'Prediction', function($scope, Lines, LineData, PathBtwnStations, Prediction){
    // ALL LINE DATA
    Lines.then(function(response){
        // initialize dictionary of lines
        metroLines = {};

        // loop through the response
        angular.forEach(response.data.Lines, function(metroLine){
            metroLines[metroLine.LineCode] = {
                'LineCode': metroLine.LineCode,
                'StartStationCode': metroLine.StartStationCode,
                'EndStationCode': metroLine.EndStationCode,
                'DisplayName': metroLine.DisplayName
            }
        })

	$scope.lines = metroLines;;
    });

    // LINE DATA
    displayLineData('RD');

    $scope.displayLineData = function(lineCode){
	$scope.lineData = displayLineData(lineCode);
    }

    function displayLineData(lineCode){
        $scope.lineCode = lineCode;
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

    // PATH DATA (START STATION, END STATION)
    $scope.pathData = displayPathdata('A15', 'B11');

    $scope.displayPathdata = function(startCode, endCode){
	displayPathdata(startCode, endCode);
    }

    function displayPathdata(startCode, endCode) {
        // create new list to house the stop order for the start / end supplied
        stopList = [];

        //call the path API
	PathBtwnStations.getPathData(startCode, endCode).then(function(response){
            // loop through the response
            angular.forEach(response.data.Path, function(pathData){
                // push the station code into the stop list
                stopList.push(pathData.StationCode)
            });
	    $scope.pathList = stopList;
            getPrediction(stopList);
	});
    }

    // PREDICTION DATA
    // getPrediction(['A14']);

    function getPrediction(lineCodeList){
        // create new dictionary for each stop's prediction data
        var stopPredData = {};

        // call the prediction API
	Prediction.getPredictionData(lineCodeList).then(function(response){
            // loop through the response
            angular.forEach(response.data.Trains, function(predData){
                // pull out the data points I need
                stopCode    = predData.LocationCode;
                destCode    = predData.DestinationCode;
                destination = predData.DestinationName;
                time        = predData.Min;

                // figure out if stopCode already in dictionary
                if ( !(stopCode in stopPredData) ){
                    stopPredData[stopCode] = {};
                }

                // figure out if destination already in stop's dictionary
                if ( !(destination in stopPredData[stopCode]) ){
                    stopPredData[stopCode][destination] = [];
                }

                stopPredData[stopCode][destination].push(time);
            });

	    $scope.predictionData = stopPredData;
	});
    }
}]);
