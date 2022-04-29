require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/error");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const cookieParser = require("cookie-parser");
const corse = require("cors");
const app = express();

app.use(cookieParser());
app.use(corse());

app.use(express.json({ extended: false }));

app.use("/api/auth/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
const port = process.env.PORT || 5000;

connectDB();
app.use(errorHandler);
app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});
