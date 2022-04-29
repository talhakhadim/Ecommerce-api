const express = require("express");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/async");
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../utils/errorResponse");
const advanceResults = require("../middleware/advanceResults");

const router = express.Router();

//get all users
//end point: api/user
//private
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  advanceResults(User),
  asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advanceResults);
  })
);

//get current user
//end point: api/user/me
//Private
router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  })
);
//update user
//end point: api/user/:id
//private
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    if (!req.user.id !== req.params.id) {
      return next(
        new ErrorResponse("You don't have permission to access this route", 401)
      );
    }
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { username, password: hashedPassword, email } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({ success: true, data: user });
  })
);
//delete a user
//end point: api/user/:id
//private
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    //check if this is the current login user and not an admin
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
      return next(
        new ErrorResponse("you don't have permission to delete this user", 401)
      );
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ErrorResponse("user not found", 404));
    }

    res
      .status(200)
      .json({ success: true, msg: `user deleted with id ${req.params.id}` });
  })
);

module.exports = router;
