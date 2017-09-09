myAppModule.controller('MyFirstCtrl', ['$scope', 'Lines', 'LineData', 'PathBtwnStations', 'Prediction', function($scope, Lines, LineData, PathBtwnStations, Prediction){
    Lines.then(function(response){
	$scope.lines = response.data.Lines;
    });

    $scope.lineData = displayLineData('RD');
    
    $scope.displayLineData = function(lineCode){
	displayLineData(lineCode);
    }

    function displayLineData(lineCode){
	LineData.getLineData(lineCode).then(function(response){
	    $scope.lineData = response.data.Stations;
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
