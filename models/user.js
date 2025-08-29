const ObjectId = require("mongodb").ObjectId;
const getDb = require("../utils/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    console.log(this.cart.items);
    const productIndex = this.cart?.items?.findIndex((prod) => {
      return prod.productId.toString() === product._id.toString();
    });
    let productQty = 1;
    const updatedCartItems = this.cart ? [...this.cart?.items] : [];
    if (productIndex >= 0) {
      productQty = updatedCartItems[productIndex].qty + 1;
      updatedCartItems[productIndex] = {
        productId: product._id,
        qty: productQty,
      };
    } else {
      updatedCartItems.push({ productId: product._id, qty: 1 });
    }
    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    const proIds = this.cart?.items?.map((p) => p.productId);
    return db
      .collection("products")
      .find({ _id: { $in: proIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            qty: this.cart.items.find((p) => {
              return p.productId.toString() === product._id.toString();
            }).qty,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  static findUserById(id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(id) })
      .then((result) => result)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
