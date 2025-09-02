const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const flash = require("connect-flash");
const session = require("express-session");
const dotenv = require("dotenv").config();
var MongoDBStore = require("connect-mongodb-session")(session);

const adminRoute = require("./routes/adminRoute");
const shopRoute = require("./routes/shopRoute");
const authRoutes = require("./routes/authRoute");
const uerrorController = require("./controllers/error");
const User = require("./models/user");

var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "session",
});

const app = express();

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "This is a secret",
    store: store,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);

app.use("/", shopRoute);

app.use("/", authRoutes);

app.use(uerrorController.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
