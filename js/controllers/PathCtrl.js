myAppModule.controller('PathCtrl', ['$scope', 'PathBtwnStations', function($scope, PathBtwnStations) {
    function displayPathdata(startCode, endCode) {
	LineData.getPathData($scope.startCode, $scope.endCode) {
	    $scope.pathData = response.data.Path;
	}
    }
}]);
