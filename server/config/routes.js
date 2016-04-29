
var users = require('../controllers/users.js')
// var passport = require('passport');
// var config = require('./oauth.js');
// var auth = require('./authentication.js');
// require any other controllers here





module.exports = function(app, passport, server) {

	var io = require('socket.io').listen(server)


	io.sockets.on('connection', function (socket) {
		console.log('connection')

		socket.on('connected', function(){
			console.log('connected');
			users.login(function(output){
				console.log('broadcast');
				socket.broadcast.emit('new_user', output);
			});
		});


		socket.on("game_over", function(data){

			// console.log(data);
			users.update_record(data, function(output){
				if (output._id){
					io.emit('global_result', {_id: output._id, name: output.name, record: output.record, games: output.games});
					socket.emit('user_result', {record: output.record})
				}
			});
		});

	});

	app.get('/', function(req, res){
		res.render('index');
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));

	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', { 
			failureRedirect: '/',
			successRedirect: '/dashboard' 
	}));

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	app.get('/auth/google/callback',
        passport.authenticate('google', {
        successRedirect : '/dashboard',
        failureRedirect : '/'
    }));


	app.get('/dashboard', isLoggedIn, function(req, res){
		users.show(req, res);
	});

	app.get('/users', function(req, res){
		users.index(req, res);
	});

	app.get('/users/:id', function(req, res){
		res.render('user');
	});

	app.post('/users/:id', function(req, res){
		users.showStats(req, res);
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

}

//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    } else {
    	res.redirect('/');
    }

    // if they aren't redirect them to the home page
    
}