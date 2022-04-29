const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { verifyToken } = require("../middleware/auth");
const advanceResults = require("../middleware/advanceResults");

//create cart
//end point: /api/cart/create
//access: private
router.post(
  "/create",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const cart = await Cart.create({
      userId: req.user._id,
      products: req.body.products,
    });

    res.status(201).json({
      success: true,
      data: cart,
    });
  })
);
//get single cart
//end point: /api/cart/:id
//access: private

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return next(
        new ErrorResponse(`Cart not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  })
);
//update cart
//end point: api/cart/:id
//access: private
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cart) {
      return next(
        new ErrorResponse(`Cart not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  })
);
//delete cart
//end point: api/cart/:id
//access: private
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return next(
        new ErrorResponse(`Cart not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, msg: `Cart deleted successfully` });
  })
);

module.exports = router;
