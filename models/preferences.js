var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  faculty: { type: String, required: true },
  year: { type: String, required: true },
  major: { type: String, required: true },
  minor: { type: String, required: true },
  fitness: { type: Boolean, required: true },
  sociability: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
});
