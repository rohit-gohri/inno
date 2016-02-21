var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongoosePaginate = require('mongoose-paginate');
var validate = require('mongoose-validator');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://127.0.0.1:27017/innovision');
autoIncrement.initialize(connection);

var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between 3 and 50 characters'
    })
];
var emailValidator=[
    validate({
        validator: 'isEmail',
        message: "not a valid email"
    })
];
var phoneValidator = [
    validate({
        validator: 'isLength',
        arguments: [10, 10],
        message: 'phonenumber should be 10 digits'
    })
];

var Account = new Schema({
    accNo: Number,
    provider: String,
    providerData: Object,
    accessToken: String,
    inno_id: {type:String, unique:true, dropDups:true, sparse:true},
    password: String,
    email: {type:String, validator:emailValidator, unique:true, dropDups:true, trim: true},
    firstName: String,
    lastName: String,
    endpoint:String,
    photo: String,
    dob: Date,
    gender: String,
    phone_no: {type:String, validate:phoneValidator, unique:true, dropDups:true, sparse:true, trim: true},
    college: {type:String, trim: true},
    course: {type:String, trim: true},
    year: String,
    dateJoined: Date,
    is_em: {type:Boolean,default:false},
    is_admin: {type:Boolean,default:false},
    is_new: {type:Boolean,default:true}
});

Account.plugin(autoIncrement.plugin, {model: 'Account', field: 'accNo'});
Account.plugin(passportLocalMongoose, {usernameField: 'email', usernameLowerCase: true});
Account.plugin(mongoosePaginate);

module.exports = mongoose.model('Account', Account);
