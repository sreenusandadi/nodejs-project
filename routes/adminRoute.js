const express = require("express");
const path = require("path");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const users = [];

router.get("/add-product", isAuth, adminController.getAddProduct);

// router.get("/add-user", adminController.getAddUser);

router.get("/products", isAuth, adminController.getAdminProducts);

router.get("/products/:productId", isAuth, adminController.getEditProduct);

router.post("/add-product", isAuth, adminController.postProduct);

// router.post("/add-user", adminController.postUser);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
