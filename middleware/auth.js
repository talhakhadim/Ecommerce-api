const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  //   checking if the token is send in the header or in the cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //spliting the bearer and token and asigning the token to token variable
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("no token provided", 400));
  }
  try {
    //verify the token with jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //creating the user property to the re.user so we can use it later
    req.user = await User.findById(decoded.id);
  } catch (err) {
    return next(new ErrorResponse("invalid token", 401));
  }

  next();
});
exports.verifyAdmin = asyncHandler((req, res, next) => {
  if (req.user.isAdmin !== true) {
    return next(
      new ErrorResponse("You are not authorize to access this route", 401)
    );
  }
  next();
});
