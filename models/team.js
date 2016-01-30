var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
    name: String,
    members: [{type: Schema.ObjectId, ref: 'users'}],
    captain: {type: Schema.ObjectId, ref: 'users'}
});


module.exports = mongoose.model('Team', Team);
