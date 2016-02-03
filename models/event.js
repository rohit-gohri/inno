var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({
    name: String,
    details: String,
    fbLink: String,
    photo: String,
    minParticipants: Number,
    isTeamEvent: Boolean,
    category: String,
    participants: [{type: Schema.ObjectId, ref: 'Account'}],
    managers: [{type: Schema.ObjectId, ref: 'Account'}],
    winners: [{type: Schema.ObjectId, ref: 'Account'}],
    teams: [{type: Schema.ObjectId, ref: 'Team'}]
});


module.exports = mongoose.model('Event', Event);
