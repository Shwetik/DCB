// backend/routes/index.js
const express = require('express');
const userRouter = require("./user");
const accountRouter = require("./account");
const adminRouter = require("./admin");
const orderRouter = require("./order");
const cartRouter = require("./cart");

const router = express.Router();

router.use("/user", userRouter)
router.use("/account", accountRouter)
router.use("/admin", adminRouter)
router.use("/order", orderRouter)
router.use("/cart", cartRouter)

module.exports = router;