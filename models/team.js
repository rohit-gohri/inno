var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between 3 and 50 characters'
    })
];
var Team = new Schema({
    name: {type:String,validator:nameValidator,unique:true,dropDups:true},
    members: [{type: Schema.ObjectId, ref: 'Account'}],
    captain: {type: Schema.ObjectId, ref: 'Account'}
});


module.exports = mongoose.model('Team', Team);
