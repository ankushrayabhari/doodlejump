var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var User = require('./models/user.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var expressHandlebars  = require('express-handlebars');
var cookieParser = require('cookie-parser');
var validator = require('express-validator');

var app = express();
app.use(express.static(__dirname+'/../client/static'));

app.use(session({
	secret: 'doodle',
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());
app.use(validator());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var handlebars = expressHandlebars.create({
	defaultLayout: 'noauth', 
	extname: '.hbs',
	layoutsDir: __dirname+'/../client/views/layouts/'
});
app.set('views', __dirname+'/../client/views');
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

passport.serializeUser(function(user, done) {
    console.log("serialize", user.username);
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	console.log("deserialize", username);
    User.findOne({username :  username }, function(err, user) {
        done(err, user);
    });
});

passport.use('local', new LocalStrategy({ passReqToCallback : true }, function(req, username, password, done) {
		User.findOne({username :  username }, function(err, user) {
			if (err) return done(err);
			if (!user) return done(null, false);
			if (!user.verifyPassword(password)) return done(null, false);
			return done(null, user);
		});
	})
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.get('/', function(req, res) {
	if(req.isAuthenticated()) {
		res.render('game', {
			user: req.user,
			layout: 'auth'
		});
	}
	else {
		res.render('game');
	}
});

app.get('/profile', function(req, res) {
	if(req.isAuthenticated()) {
		res.render('profile', {
			user: req.user,
			layout: 'auth'
		});
	}
	else {
		req.flash('errors', ["You must be logged in to do that."]);
		res.redirect('/login');
	}
});

app.get('/register', function(req, res) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	}
	else {
		res.render('register', {errors: req.flash('errors'), info: req.flash('info')[0]});
	}
});

app.post('/register', function(req, res) {
	var data = {
		username: req.body.username,
		password: req.body.password
	};

	req.checkBody('username', 'Enter a valid username.').notEmpty().isAlphanumeric();
	req.checkBody('password', 'Enter a valid password.').notEmpty().isLength({min:6});

	var errors = req.validationErrors();
	if(errors) {
		req.flash('errors', errors);
		req.flash('info', data);
		res.redirect('/register');
	}
	else {
		if (!req.user) {
            User.findOne({'username': data.username}, function(err, user) {
                if (user) {
                	req.flash('errors', ["That username already exists."]);
                	req.flash('info', data);
                    res.redirect('/register');
                } else {
                    var user = new User(data);

                    user.save(function(err) {
                        if (err) {
                        	req.flash('errors', ["There was an error processing your request."]);
                			req.flash('info', data);
                			res.redirect('/register');
                		}
                		else {
                			req.flash('info', data);
                			res.redirect('/login');
                		}
                    });
                }

            });
        }
	}
});

app.get('/login', function(req, res) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	}
	else {
    	res.render('login', {errors: req.flash('errors'), info: req.flash('info')[0]});
	}
});

app.post('/login', function(req, res, next) {
	var data = {
		username: req.body.username,
		password: req.body.password
	};

	req.checkBody('username', 'Enter a valid username.').notEmpty().isAlphanumeric();
	req.checkBody('password', 'Enter a valid password.').notEmpty().isLength({min:6});

	var errors = req.validationErrors();
	if(errors) {
		req.flash('errors', errors);
		req.flash('info', data);
		res.redirect('/login');
	}
	else {
		passport.authenticate('local', function (error, user, info) {
			if (error) return next(error);

			if (!user) {
				req.flash('errors', ["Incorrect username or password."]);
				req.flash('info', {username: req.body.username});
				res.redirect('/login');
			}

			req.login(user, function(err) {
				if (err) return next(err);
				res.redirect('/');
			});
		})(req, res, next);
	}
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000);