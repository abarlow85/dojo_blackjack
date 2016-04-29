
var myApp = angular.module('myApp', []);

myApp.controller('usersController', function($scope, $window, userFactory){

	$scope.users = [];

	userFactory.index(function(data){
		$scope.users = data;
	});

	socket.on('new_user', function(data){
		userFactory.refresh(data, function(output){
			$scope.$apply(function(){
				$scope.users = output;
			});
		});
		
	});


	socket.on('global_result', function(data){

		userFactory.update(data, function(users){
			$scope.$apply(function(){
				$scope.users = users;
			});
		});
		
	});

});

