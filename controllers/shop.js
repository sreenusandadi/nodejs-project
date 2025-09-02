const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products: products,
        path: "/",
        pageTitle: "Product Details",
        hasProducts: products?.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        path: "/products",
        pageTitle: "Product Details",
        hasProducts: products?.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render(`shop/product-details`, {
        pageTitle: prodId,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = [...user.cart.items];
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        cartProducts: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((cart) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });

      const order = new Order({
        products: products,
        user: { userId: req.user, email: req.user.email },
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then((order) => {
      res.redirect("/orders");
    });
};

exports.postDeleteCart = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeCartItem(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout", });
};
