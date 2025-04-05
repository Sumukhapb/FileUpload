const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const engine = require("ejs-mate")
require("dotenv").config();
require("./middleware/passportConfig");
const uploadRoutes = require("./routes/uploadRoute");
const PORT = process.env.PORT;

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

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./routes/authRoutes"));
app.use("/files", uploadRoutes);

app.get("/", (req, res) => {
  res.render("login", { title: "Login", user: req.user || null });
});


app.listen(PORT, () => console.log("Server running on port 8000"));
