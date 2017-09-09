myAppModule.controller('LineCtrl', ['$scope', 'LineData', function($scope, LineData){
    function displayLinedata(lineCode) {
	LineData.getLineData($scope.lineCode).then(function(response){
	    $scope.stopData = response.data.Stations;
	});
    }
}]);
