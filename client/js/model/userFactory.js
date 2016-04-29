
myApp.factory('userFactory', function($http){

	var factory = {}
	var users = []
	var user;

	factory.index = function(callback) {
		$http.get('/users').success(function(output){
			users = output;
			callback(users);
		});
	}

	factory.refresh = function(data, callback){
		users = data;
		callback(users);
	}

	factory.update = function(data, callback){
		for (user in users) {
			if (users[user]._id == data._id) {
				users[user].record.wins = data.record.wins;
				users[user].record.losses = data.record.losses;
				users[user].games = data.games;
			}
		}
		callback(users)
	}

	factory.show = function(route, callback){
		$http.post(route).success(function(output){
			user = output;
			callback(user);
		});
	}

	return factory;
});

