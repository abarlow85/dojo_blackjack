
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	oauth: Number,
	name: String,
	games: [],
	record: {type: Object, default: {wins: 0, losses: 0}},
	created_at: {type: Date, default: new Date},
	google           : {
        id           : String,
        token        : String,
        name         : String
    }
});

var User = mongoose.model('User', userSchema);

