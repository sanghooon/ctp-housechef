var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// arrow function doesn't work... some kind of bug...
userSchema.methods.validPassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', userSchema);
