var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'dojocodesfeb22'}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, './client')));
app.set('views', __dirname + '/client/views/');
app.set('view engine', 'ejs');



require('./server/config/mongoose.js');
require('./server/config/authentication.js')(passport);


var server = app.listen(8000, function() {
	console.log('go to localhost:8000')
});

require('./server/config/routes.js')(app, passport, server);



