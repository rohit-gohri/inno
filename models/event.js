var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({
    name: {type:String, unique:true, dropDups:true, trim:true},
    linkName: {type:String, unique:true, dropDups:true, trim:true},
    shortDetails: String,
    details: {type:String, trim: true},
    fbLink: {type:String, trim: true},
    contact: String,
    timings: String,
    venue: String,
    photo: String,
    minParticipants: {type:Number, default:'1'},
    isTeamEvent: {type:Boolean,default:false},
    category: [String],
    managers: [{type: Schema.ObjectId, ref: 'Account'}],
    // In case of team events, participants and winners refer to team._id of teams
    participants: [{type: Schema.ObjectId}],
    winners: [{type: Schema.ObjectId}]
});

Event.methods.next = function(cb) {
    var model = this.model("Quote");
    model.findOne()
        .where('category').equals(this.category)
        .where('_id').gt(this._id).exec(function(err, event) {
        if (err) throw err;

        if (event) {
            cb(event);
        } else {
            // If quote is null, we've wrapped around.
            model.findOne(cb);
        }
    });
};

Event.methods.previous = function(cb) {
    var model = this.model("Quote");
    model.findOne()
        .where('category').equals(this.category)
        .where('_id').lt(this._id).exec(function(err, event) {
        if (err) throw err;

        if (event) {
            cb(event);
        } else {
            // If quote is null, we've wrapped around.
            model.findOne(cb);
        }
    });
};


module.exports = mongoose.model('Event', Event);
