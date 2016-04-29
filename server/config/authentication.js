var Strategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./oauth.js')
var mongoose = require('mongoose');
var User = mongoose.model('User');
// var session = require('express-session');


module.exports = function(passport){


	passport.serializeUser(function(user, done) {
  		console.log('serializeUser: ' + user._id);
 		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
  		User.findById(id, function(err, user){
      		if(!err) done(null, user);
      		else done(err, null);
    	});
	});

	passport.use(new Strategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields: config.facebook.profileFields
	},
	function(accessToken, refreshToken, profile, cb) {

			User.findOne({oauth: profile.id}, function(err, user){
				if (err) {
					console.log(err);
				}
				if (!err && user !== null) {
					console.log('existing user');
					// session.user = user._id;
					cb(null, user);
				} else {
					user = new User({
						oauth: profile.id,
						name: profile.displayName,
					});
					user.save(function(err){
						if (err) {
							console.log(err);
						} else {
							console.log('user saved');
							// session = user._id;
							cb(null, user);
						}
					});
				}

			});
	
	}));

	passport.use(new GoogleStrategy({

        clientID        : config.google.clientID,
        clientSecret    : config.google.clientSecret,
        callbackURL     : config.google.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                	User.findOne({'name': profile.displayName}, function(err, user){
                		if (err)
                    		return done(err);

                		if (user) {

                    // if a user is found, log them in
                    		return done(null, user);
                    	}
                	});
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.name  = profile.displayName;
   

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
}