const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/orders", isAuth, shopController.postOrders);

// router.get("/checkout", shopController.getCheckout);

router.post("/cart-item-delete", isAuth, shopController.postDeleteCart);

module.exports = router;
