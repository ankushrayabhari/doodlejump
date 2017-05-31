var mongoose = require('mongoose');

var citation = mongoose.Schema({
	username: String,
	password: String,
	highscore: {
		type: Number,
		default: 0
	}
});

user.methods.verifyPassword = function(password) {
	return (this.password == password);
}

module.exports = mongoose.model('User', user);