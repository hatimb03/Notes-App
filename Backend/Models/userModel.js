const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdOn: {
    type: Date,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("User", userSchema);
