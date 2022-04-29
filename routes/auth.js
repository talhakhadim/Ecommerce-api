const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const router = express.Router();

//register a  user
//endPoint:api/user/register
//public
router.post(
  "/register",

  asyncHandler(async (req, res, next) => {
    const { username, email, password, isAdmin } = req.body;

    const user = await User.create({ username, email, password, isAdmin });
    if (!user) {
      return next(new ErrorResponse("user not created", 400));
    }
    //get signed token
    const token = signedToken(user);
    //cookie options
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, data: user, token });
  })
);
//login user
//end point: api/user/login
//public
router.post(
  "/login",

  asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    //check if username or password is missing
    if (!username || !password) {
      return next(
        new ErrorResponse("please provide username and password", 400)
      );
    }
    //finding the user in database by username
    const user = await User.findOne({ username });
    if (!user) {
      return next(new ErrorResponse("username incorret", 400));
    }
    //match the user entered password with the hash one in the database
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return next(new ErrorResponse("password incorrect", 400));
    }

    const token = signedToken(user);
    //cookie options
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    //sending the response with the cookie

    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, msg: `Welcome ${user.username}`, token });
  })
);

//function to sign a token with jwt
const signedToken = (user) => {
  const token = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return token;
};

module.exports = router;
