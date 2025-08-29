const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRoute = require("./routes/adminRoute");
const shopRoute = require("./routes/shopRoute");
const uerrorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findUserById("68b100a1cd2a0def2aa9054a")
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      console.log("User from server", req.user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);

app.use("/", shopRoute);

app.use(uerrorController.get404);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("Connected server on 3000");
  });
});
