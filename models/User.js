const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please add a user name"],
      unique: [true, "user already exists"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "email is not valid",
      ],
      required: [true, "please provide a password"],
      unique: [true, "user already registered"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "password must be at least 6 characters long"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(this.password, salt);
  this.password = hashedpassword;
});

module.exports = mongoose.model("User", userSchema);
