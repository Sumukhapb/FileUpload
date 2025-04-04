const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
require("dotenv").config();
require("./middleware/passportConfig"); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./routes/authRoutes"));
app.use("/files", require("./routes/uploadRoute"));


app.get("/", (req, res) => {
  res.render("login");
});

app.listen(8000, () => console.log("Server running on port 8000"));
