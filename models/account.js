var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    provider: String,
    providerData: Object,
    accessToken: String,
    inno_id: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    photo: String,
    dob: Date,
    gender: String,
    phone_no: String,
    college: String,
    course: String,
    year: String,
    dateJoined: Date,
    is_em: Boolean,
    is_admin: Boolean,
    is_new: Boolean
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
