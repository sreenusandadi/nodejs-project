const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Product", productSchema);

// const path = require("path");
// const fs = require("fs");
// const mongodb = require("mongodb");
// const getDb = require("../utils/database").getDb;

// const Cart = require("./cart");

// const ObjectId = mongodb.ObjectId;

// const p = path.join(
//   path.dirname(require.main.filename),
//   "data",
//   "products.json"
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       return cb([]);
//     }
//     cb(JSON.parse(fileContent));
//   });
// };

// module.exports = class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this.userId = userId;
//     this._id = id ? new ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb();
//     let dbOps;
//     if (this._id) {
//       dbOps = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOps = db.collection("products").insertOne(this);
//     }
//     return dbOps.then((product) => product).catch((err) => console.log(err));
//   }

//   static delete(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(id) })
//       .then(result=>{
//         console.log('Deleted successfully!')
//       })
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static getProductById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(id) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }
// };
