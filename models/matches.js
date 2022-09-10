var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const createMeetingPlace = () => {
  const possibleMeetingPlace = [
    "CCIS Quad",
    "ECHA Starbucks",
    "Telus Building",
    "KATZ",
    "DICE Floor 1",
  ];
  return possibleMeetingPlace[
    Math.floor(Math.random() * possibleMeetingPlace.length)
  ];
};
const MatchesSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  matchDate: { type: Date, default: Date.now },
  meetingPlace: { type: String, required: true, default: createMeetingPlace() },
});

//Export model
module.exports = mongoose.model("Matches", MatchesSchema);
