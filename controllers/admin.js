const { validationResult } = require("express-validator");

const Product = require("../models/product");
const User = require("../models/user");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    isEdit: false,
    isError: false,
    errorObj: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    product: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
  });
};

exports.getAddUser = (req, res) => {
  res.render("admin/add-user", {
    pageTitle: "Add User",
    path: "/admin/add-user",
    isEdit: false,
  });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        path: "/admin/edit-product",
        pageTitle: "Edit Product",
        isEdit: editMode,
        product: product,
        isError: false,
        errorObj: {
          title: "",
          imageUrl: "",
          price: "",
          description: "",
        },
      });
    })
    .catch((err) => console.log(err));
};

exports.postProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const titleErrorMsg = errors
      .array()
      .find((err) => err.path === "title")?.msg;
    const imgUrlErrorMsg = errors
      .array()
      .find((err) => err.path === "imageUrl")?.msg;
    const priceErrorMsg = errors
      .array()
      .find((err) => err.path === "price")?.msg;
    const descErrorMsg = errors
      .array()
      .find((err) => err.path === "description")?.msg;
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      isEdit: false,
      isError: true,
      errorObj: {
        title: titleErrorMsg,
        imageUrl: imgUrlErrorMsg,
        price: priceErrorMsg,
        description: descErrorMsg,
      },
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
    });
  }
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
  });
  product.save();
  res.redirect("/");
};

exports.postUser = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const user = new User(username, email);
  user.save();
};

exports.postEditProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const prodId = req.body.productId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const titleErrorMsg = errors
      .array()
      .find((err) => err.path === "title")?.msg;
    const imgUrlErrorMsg = errors
      .array()
      .find((err) => err.path === "imageUrl")?.msg;
    const priceErrorMsg = errors
      .array()
      .find((err) => err.path === "price")?.msg;
    const descErrorMsg = errors
      .array()
      .find((err) => err.path === "description")?.msg;
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      isEdit: false,
      isError: true,
      errorObj: {
        title: titleErrorMsg,
        imageUrl: imgUrlErrorMsg,
        price: priceErrorMsg,
        description: descErrorMsg,
      },
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        _id: prodId
      },
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save().then((product) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        products: products,
        path: "/admin/products",
        pageTitle: "Products",
        hasProducts: products?.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id }).then(() => {
    res.redirect("/admin/products");
  });
};
