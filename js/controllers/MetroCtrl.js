myMetroModule.controller('MetroCtrl', ['$scope', 'Lines', 'LineData', 'PathBtwnStations', 'Prediction', function($scope, Lines, LineData, PathBtwnStations, Prediction){

    // PULL ALL LINE DATA
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

	$scope.lines = metroLines;
    });

    // INITIALIZE LINE DATA TO RED LINE
    //$scope.lineData = displayLineData('RD');

    $scope.displayLineData = function(lineCode){
	$scope.lineData = displayLineData(lineCode);
    }

    ///////////////
    // FUNCTIONS //
    ///////////////

    // function to pull stop data for the line passed
    function displayLineData(lineCode){
        $scope.lineCode = lineCode;
	// create new dictionary for stop data, to be keyed by station code
	var stopData = {};
        var startCode = metroLines[lineCode]['StartStationCode'];
        var endCode = metroLines[lineCode]['EndStationCode'];
        console.log(startCode, endCode);

	// call the LineData api
	LineData.getLineData(lineCode).then(function(response){
	    // loop through the response
	    angular.forEach(response.data.Stations, function(stopInfo){
		// assign the station code its full stop detail
		stopData[stopInfo.Code] = stopInfo;
	    });
	    // save results in lineData to be accessed while in scope
	});

        return stopData;
    }

    // PATH DATA (START STATION, END STATION)
    //$scope.pathList = displayPathdata('A15', 'B11');

    $scope.displayPathdata = function(startCode, endCode){
	$scope.pathList = displayPathdata(startCode, endCode);
    }

    function displayPathdata(startCode, endCode) {
        // create new list to house the stop order for the start / end supplied
        var stopList = [];

        //call the path API
	PathBtwnStations.getPathData(startCode, endCode).then(function(response){
            // loop through the response
            angular.forEach(response.data.Path, function(pathData){
                // push the station code into the stop list
                stopList.push(pathData.StationCode)
            });
            $scope.predictionData = getPrediction(stopList);
	});

        return stopList;
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
                stopCode = predData.LocationCode;
                stopName = predData.LocationName;
                destCode = predData.DestinationCode;
                destName = predData.DestinationName;
                time     = predData.Min;

                // figure out if stopCode already in dictionary
                if ( !(stopCode in stopPredData) ){
                    stopPredData[stopCode] = {};
                }

                // figure out if destination already in stop's dictionary
                if ( !(destName in stopPredData[stopCode]) ){
                    stopPredData[stopCode][destName] = [];
                }

                stopPredData[stopCode][destName].push(time);
            });

	});

	return stopPredData;
    }
}]);
