var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var chefSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  //photo: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true }
  //service: { type: String, required: true },
});

chefSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

chefSchema.methods.validPassword = function(password) {
  var chef = this;
  return bcrypt.compareSync(password, chef.password);
}

module.exports = mongoose.model('Chef', chefSchema);
