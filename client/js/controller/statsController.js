
myApp.controller('statsController', function($scope, $location, $window, userFactory){
	
	$scope.scores = {
		11: 0,
		12: 0,
		13: 0,
		14: 0,
		15: 0,
		16: 0,
		17: 0,
		18: 0,
		19: 0,
		20: 0,
		21: 0
	}

	userFactory.show($location.path(), function(data){
		$scope.user = data;
		for (game in $scope.user.games) {
			if ($scope.scores[$scope.user.games[game].score] !== undefined){
				$scope.scores[$scope.user.games[game].score]++
			}
		}
	});


});

