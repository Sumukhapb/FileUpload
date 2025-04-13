const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const engine = require("ejs-mate");
require("dotenv").config();
require("./config/passportConfig");
const uploadRoutes = require("./routes/uploadRoute");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const connectDB = require("./config/database");
const PORT = process.env.PORT;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDb Connected"))
//   .catch((err) => console.log("fuck you " , err));

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./routes/authRoutes"));
app.use("/files", uploadRoutes);

app.get("/", (req, res) => {
  res.render("login", { title: "Login", user: req.user || null });
});

app.listen(PORT, () => console.log("Server running on port 8000"));
