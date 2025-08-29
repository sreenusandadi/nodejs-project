const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  Product.getProductById(prodId)
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
  req.user.getCart().then(products=>{
    console.log(products)
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        cartProducts: products,
      });
  }).catch(err=>console.log(err));
  // Cart.getCart((cartData) => {
  //   let cartProducts = [];
  //   Product.fetchAll((products) => {
  //     for (let product of products) {
  //       const cartItem = cartData.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartItem) {
  //         const productData = products.find((prod) => prod.id === cartItem.id);
  //         if (productData) {
  //           const cartProductData = {
  //             productData: productData,
  //             qty: cartItem.qty,
  //           };
  //           cartProducts.push(cartProductData);
  //         }
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Cart",
  //       cartProducts: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getProductById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((cart) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCart = (req, res) => {
  const prodId = req.body.productId;
  Product.fetchAll((products) => {
    const product = products.find((prod) => prod.id === prodId);
    Cart.deleteCartItem(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};
