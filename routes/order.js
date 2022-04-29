const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { verifyToken } = require("../middleware/auth");
const advanceResults = require("../middleware/advanceResults");

//create orders
//end point: /api/orders/create
//access: private
router.post(
  "/:productId/create",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new ErrorResponse("product not found", 404));
    }
    req.body.userId = req.user.id;
    const { userId, quantity, amount, address } = req.body;

    const order = await Order.create({
      userId,
      products: [
        {
          productId: product.id,
          quantity,
        },
      ],
      amount,
      address,
    });
    res.status(200).json({ success: true, data: order });
  })
);
//get all orders
//end point: /api/orders/
//access: private
router.get(
  "/",
  verifyToken,
  advanceResults(Order, [
    { path: "userId", select: "username" },
    { path: "products.productId", select: "name" },
  ]),
  asyncHandler(async (req, res) => {
    res.status(200).json(res.advanceResults);
  })
);
//get single order
//end point: api/orders/:id
//private

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate({
      path: "userId",
      select: "username",
    });
    res.status(200).json({ success: true, data: order });
  })
);

//update order
//end point: api/orders/:id
//private
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse("Resource not found", 404));
    }
    if (order.userId.toString() !== req.user.id) {
      return next(
        new ErrorResponse("you don't have access to this route", 401)
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: updatedOrder });
  })
);

//delete order
//end point: api/orders/:id
//private
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorResponse("Resource not found", 404));
    }

    if (order.userId.toString() !== req.user.id && req.user.isAdmin !== true) {
      return next(
        new ErrorResponse("you don't have access to this route", 404)
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      msg: `Order deleted with id :${deletedOrder.id}`,
    });
  })
);
//get single user orders
//end point: api/orders/find/:user_id
//private

router.get(
  "/find/:user_id",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    if (req.params.user_id !== req.user.id && req.user.isAdmin !== true) {
      return next(
        new ErrorResponse("you don't have access to this route", 401)
      );
    }
    const userOrders = await Order.find({ userId: req.params.user_id }).sort(
      "-createdAt"
    );
    res.status(200).json({ success: true, data: userOrders });
  })
);

module.exports = router;
