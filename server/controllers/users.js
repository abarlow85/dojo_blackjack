
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {

	show: function(req, res) {
		User.findOne({_id: req.session.passport.user}, function(err, user){
			if(err){
				console.log('error');
			} else {
				// console.log(users)
				res.render('dashboard', {currentUser:user});
			}
		});
	},

	showStats: function(req, res){
		User.findOne({_id: req.params.id}, function(err, user){
			if (err) {
				console.log('error');
			} else {
				res.json(user);
			}
		});
	},

	login: function(callback) {
		User.find({}, function(err, users){
			if(err){
				console.log('error');
			} else {
				
				callback(users);
			}
		});
		
	},

	update_record: function(data, callback) {
		var game = {dealer: data.dealer, score: data.score, created_at: new Date};

		User.findByIdAndUpdate(data._id, {$push: {games:game}, record: data.record}, {new: true}, function(err, user){
			if (err) {
				console.log(err)
				console.log('didnt work');
				callback(err);
			} else {
				callback(user);
			}
		});
	},

	index: function(req, res) {
		User.find({}, function(err, users){
			res.json(users);
		});
		
	},
}
