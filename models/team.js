var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
    name: String,
    members: [{type: Schema.ObjectId, ref: 'Account'}],
    captain: {type: Schema.ObjectId, ref: 'Account'}
});


module.exports = mongoose.model('Team', Team);
