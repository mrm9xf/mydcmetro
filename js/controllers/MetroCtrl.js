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

    ///////////////
    // FUNCTIONS //
    ///////////////

    // Function callable from scope in view to get route data
    $scope.displayPathdata = function(startCode, endCode){
	$scope.pathList = displayPathdata(startCode, endCode);
    }

    // Route Data
    function displayPathdata(startCode, endCode) {
        // create new list to house the stop order for the start / end supplied
        var stopList = [];
        var stopData = [];

        //call the path API
	PathBtwnStations.getPathData(startCode, endCode).then(function(response){
            // loop through the response
            angular.forEach(response.data.Path, function(pathData){
                // push the station code into the stop list
                stopList.push(pathData.StationCode);
                stopData.push({
                    'stationCode': pathData.StationCode,
                    'stationName': pathData.StationName
                });
            });
            $scope.predictionData = getPrediction(stopList);
	});

        return stopData;
    }

    // Prediction Data
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

    ////////////////////////////////////////
    // INITIALIZE PAGE TO RED LINE ONLOAD //
    ////////////////////////////////////////
    $scope.lineCode = 'RD';
    $scope.pathList = displayPathdata('A15', 'B11');
}]);
