var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picURL: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
});

//Export model
module.exports = mongoose.model("User", userSchema);
