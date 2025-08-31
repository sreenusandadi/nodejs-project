const express = require("express");
const path = require("path");

const adminController = require("../controllers/admin");

const router = express.Router();

const users = [];

router.get("/add-product", adminController.getAddProduct);

// router.get("/add-user", adminController.getAddUser);

router.get("/products", adminController.getAdminProducts);

router.get("/products/:productId", adminController.getEditProduct);

router.post("/add-product", adminController.postProduct);

// router.post("/add-user", adminController.postUser);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
