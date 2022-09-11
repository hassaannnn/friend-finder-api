var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  faculty: { type: String, required: true },
  year: { type: String, required: true },
  age: { type: String, required: true },
  fitness: { type: String, required: true },
  sociability: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  lastMeal: { type: String, required: true },
  animal: { type: String, required: true },
  languages: { type: [String], required: true },
});

//Export model
module.exports = mongoose.model("Preferences", PreferencesSchema);
