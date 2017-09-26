myMetroModule.controller('MetroCtrl', ['$scope', 'Lines', 'LineData', 'PathBtwnStations', 'Prediction', function($scope, Lines, LineData, PathBtwnStations, Prediction){

    // Pull all line data so can be used by scope
    $scope.lines = getLineData();

    ///////////////
    // FUNCTIONS //
    ///////////////

    // Line Data
    function getLineData(){
        // initialize dicitonary of lines
        var lineData = {};

        // call the API
        Lines.then(function(response){
            //loop through response
            angular.forEach(response.data.Lines, function(metroLine){
                lineData[metroLine.LineCode] = {
                    'LineCode': metroLine.LineCode,
                    'StartStationCode': metroLine.StartStationCode,
                    'EndStationCode': metroLine.EndStationCode,
                    'DisplayName': metroLine.DisplayName,
                    'Destinations': [
                        metroLine.StartStationCode,
                        metroLine.EndStationCode,
                        metroLine.InternalDestination1,
                        metroLine.InternalDestination2
                    ]
                }
            });
        });

        return lineData;
    }

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
        var lineData = getLineData();

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
                line     = 'No Line';


                // figure out what line
                angular.forEach(lineData, function(lineInfo, lineCode){
                    if(destCode != "" && lineInfo['Destinations'].indexOf(destCode) !== -1){
                        line = lineInfo['DisplayName']
                    }
                });

                // figure out if stopCode already in dictionary
                if ( !(stopCode in stopPredData) ){
                    stopPredData[stopCode] = {};
                }

                // figure out if the line is already in dictionary
                if ( !(line in stopPredData[stopCode]) ){
                    stopPredData[stopCode][line] = {};
                }

                // figure out if destination already in stop's dictionary
                if ( !(destName in stopPredData[stopCode][line]) ){
                    stopPredData[stopCode][line][destName] = [];
                }

                stopPredData[stopCode][line][destName].push(time);
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
