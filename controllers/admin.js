const Product = require("../models/product");
const User = require('../models/user')

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    isEdit: false,
  });
};

exports.getAddUser = (req, res)=>{
  res.render('admin/add-user', {
    pageTitle:'Add User',
    path: '/admin/add-user',
    isEdit: false
  })
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.getProductById(prodId).then((product) => {
    res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      isEdit: editMode,
      product: product,
    });
  }).catch(err=>console.log(err));
};

exports.postProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const product = new Product(title, imageUrl, price, description, null, userId);
  product.save();
  res.redirect("/");
};

exports.postUser = (req, res)=>{
  const username = req.body.username;
  const email = req.body.email;
  const user = new User(username, email);
  user.save()
}

exports.postEditProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const id = req.body.productId
  const product = new Product(title, imageUrl, price, description, id, userId);
  product.save().then(product=>{
    res.redirect("/admin/products");
  }).catch(err=>console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render("admin/products", {
      products: products,
      path: "/admin/products",
      pageTitle: "Products",
      hasProducts: products?.length > 0,
    });
  }).catch(err=>console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.delete(prodId);
  res.redirect("/admin/products");
};
