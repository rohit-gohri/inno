var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({
    name: {type:String, unique:true, dropDups:true, trim:true},
    linkName: {type:String, unique:true, dropDups:true, trim:true},
    shortDetails: String,
    details: {type:String, trim: true},
    fbLink: {type:String, trim: true},
    photo: String,
    minParticipants: {type:Number, default:'1'},
    isTeamEvent: {type:Boolean,default:false},
    category: String,
    managers: [{type: Schema.ObjectId, ref: 'Account'}],
    // In case of team events, participants and winners refer to team._id of teams
    participants: [{type: Schema.ObjectId}],
    winners: [{type: Schema.ObjectId}]
});


module.exports = mongoose.model('Event', Event);
