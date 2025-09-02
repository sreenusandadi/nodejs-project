const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const productIndex = this.cart?.items?.findIndex((prod) => {
    return prod.productId.toString() === product._id.toString();
  });
  let productQty = 1;
  const updatedCartItems = this.cart.items ? [...this.cart?.items] : [];
  if (productIndex >= 0) {
    productQty = updatedCartItems[productIndex].quantity + 1;
    updatedCartItems[productIndex] = {
      productId: product._id,
      quantity: productQty,
    };
  } else {
    updatedCartItems.push({ productId: product._id, quantity: 1 });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  this.save();
};

userSchema.methods.removeCartItem = function (productId) {
  const updatedItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  console.log(updatedItems);
  this.cart.items = updatedItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const ObjectId = require("mongodb").ObjectId;
// const getDb = require("../utils/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id ? new ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const db = getDb();
//     const productIndex = this.cart?.items?.findIndex((prod) => {
//       return prod.productId.toString() === product._id.toString();
//     });
//     let productQty = 1;
//     const updatedCartItems = this.cart.items ? [...this.cart?.items] : [];
//     if (productIndex >= 0) {
//       productQty = updatedCartItems[productIndex].qty + 1;
//       updatedCartItems[productIndex] = {
//         productId: product._id,
//         qty: productQty,
//       };
//     } else {
//       updatedCartItems.push({ productId: product._id, qty: 1 });
//     }
//     const updatedCart = { items: updatedCartItems };
//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     const db = getDb();
//     const proIds = this.cart?.items?.map((p) => p.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: proIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             qty: this.cart.items.find((p) => {
//               return p.productId.toString() === product._id.toString();
//             }).qty,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }

//   deleteCartItem(productId) {
//     const updatedItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedItems } } }
//       );
//   }

// addOrders() {
//   const db = getDb();
//   return this.getCart()
//     .then((products) => {
//       const order = {
//         items: products,
//         user: {
//           _id: this._id,
//           name: this.username,
//         },
//       };
//       console.log('post order data', order)
//       return db.collection("orders").insertOne(order);
//     })
//     .then(() => {
//       this.cart = {items: []};
//       return db
//         .collection("users")
//         .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//     });
// }

//   getOrders(){
//     const db = getDb();
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
//   }

//   static findUserById(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(id) })
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
