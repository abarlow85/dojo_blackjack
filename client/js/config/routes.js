
myApp.config(function($routeProvider){

	

		.when('/', {
			templateUrl: './static/partials/partial1.html',
			controller:  \'user\sController\',
		})
		.when('/someroute', {
			templateUrl: './static/partials/partial2.html',
			controller: \'game\sController\'
		})
		.when('/route', {
			templateUrl: './static/partials/partial3.html',
			controller: \'delete\sController\'
		})
		.otherwise({
			redirectTo: '/'
		})
});

