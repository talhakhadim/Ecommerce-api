const express = require("express");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const advanceResults = require("../middleware/advanceResults");

const router = express.Router();

//add a product
//end point: api/products/create
//private

router.post(
  "/create",
  verifyToken,
  asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(
        new ErrorResponse("you don't have permission to delete this user", 401)
      );
    }
    const product = await Product.create(req.body);

    if (!product) {
      return next(new ErrorResponse("product not added", 400));
    }

    res.status(200).json({ success: true, data: product });
  })
);
//update product
//end point: api/products/:id
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, data: product });
  })
);
//get single product
//end point: api/products/:id
//public
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    res.status(200).json({ success: true, data: product });
  })
);
//get all products
//end point: api/products/
//public
router.get(
  "/",
  advanceResults(Product),
  asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advanceResults);
  })
);

//delete a single product
//end point: api/products/:id
//private
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new ErrorResponse("Resource not found ", 404));
    }
    res.status(200).json({
      success: true,
      msg: `product with id  ${product.id} successfully deleted`,
    });
  })
);

module.exports = router;
