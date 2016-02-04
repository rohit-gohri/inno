var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var validate = require('mongoose-validator');
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
    provider: String,
    providerData: Object,
    accessToken: String,
    inno_id: {type:String,unique:true,dropDups:true},
    username: {type:String,unique:true,dropDups:true},
    password: String,
    email: {type:String,validator:emailValidator,unique:true,dropDups:true},
    firstName: String,
    lastName: String,
    photo: String,
    dob: Date,
    gender: String,
    phone_no: {type:String,validate:phoneValidator,unique:true,dropDups:true},
    college: String,
    course: String,
    year: String,
    dateJoined: Date,
    is_em: {type:Boolean,default:false},
    is_admin: {type:Boolean,default:false},
    is_new: {type:Boolean,default:true},
    team: {type: Schema.ObjectId, ref: 'Team'}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
