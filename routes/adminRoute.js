const express = require("express");
const path = require("path");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const users = [];

router.get("/add-product", isAuth, adminController.getAddProduct);

// router.get("/add-user", adminController.getAddUser);

router.get("/products", isAuth, adminController.getAdminProducts);

router.get("/products/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/add-product",
  [
    body("title", "Title should have min 3 Charecters.")
      .isString()
      .isLength({ min: 3 }),
    body("imageUrl", "Please enater valid url.").isURL(),
    body("price", "Price accepts only numbers.").isFloat(),
    body(
      "description",
      "Discrption should have min 3 and maximum 400 charecters"
    )
      .trim()
      .isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postProduct
);

// router.post("/add-user", adminController.postUser);

router.post(
  "/edit-product",
  [
    body("title", "Title should have min 3 Charecters.")
      .isString()
      .isLength({ min: 3 }),
    body("imageUrl", "Please enater valid url.").isURL(),
    body("price", "Price accepts only numbers.").isFloat(),
    body(
      "description",
      "Discrption should have min 3 and maximum 400 charecters"
    )
      .trim()
      .isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
