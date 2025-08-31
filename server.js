const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const adminRoute = require("./routes/adminRoute");
const shopRoute = require("./routes/shopRoute");
const uerrorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("68b18bf2715403754e01658a")
    .then((user) => {
      req.user = user
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);

app.use("/", shopRoute);

app.use(uerrorController.get404);

mongoose
  .connect(
    "mongodb+srv://sreenufriends18_db_user:6cVgQNo9S6nwX6q5@nodecluster.suzo82p.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeCluster"
  )
  .then(()=>{
    User.findOne().then(user => {
      if(!user){
        const user = new User({
          username: 'Sreenu',
          email: 'sreenu@gmail.com',
          cart: {items: []}
        })
        user.save()
      }
    })
    app.listen(3000)
  })
  .catch((err) => console.log(err));
