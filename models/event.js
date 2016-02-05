var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({
    name: {type:String,unique:true,dropDups:true},
    details: String,
    fbLink: String,
    photo: String,
    minParticipants: {type:Number, default:'1'},
    isTeamEvent: {type:Boolean,default:false},
    category: String,
    managers: [{type: Schema.ObjectId, ref: 'Account'}],
    // In case of team events, participants and winners refer to captian of team events
    participants: [{type: Schema.ObjectId, ref: 'Account'}],
    winners: [{type: Schema.ObjectId, ref: 'Account'}]
});


module.exports = mongoose.model('Event', Event);
