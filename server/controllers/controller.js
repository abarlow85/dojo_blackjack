
var mongoose = require('mongoose');
var Model = mongoose.model('Model');

module.exports = {

	index: function(req, res) {
		console.log('index controller')
		Customer.find({}, function(err, customers){
			res.json(customers);
		});
	},

	create: function(req, res) {
		var something = new Model(req.body);
		something.save(function(err) {
			if (err) {
				res.json({errors: something.errors});
			} else {
				res.json(something);
			}
		});
	},

	delete: function(req, res) {
		var query = {_id: req.params.id};
		Model.remove(query, function(err){
			if (err) {
				res.json(err);
			} else {
				res.json({status: true});
			}
		});
	}
}

