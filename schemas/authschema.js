const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const authSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
authSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = model("User", authSchema);
