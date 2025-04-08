const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

//  GOOGLE AUTH 

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

// LOCAL LOGIN 

router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

// LOCAL SIGNUP

router.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.redirect("/auth/login");
    }

    const newUser = new User({
      name,
      email,
      password,
      provider: "local",
    });

    await newUser.save();

    // Auto-login after signup
    req.login(newUser, (err) => {
      if (err) throw err;
      return res.redirect("/dashboard");
    });
  } catch (error) {
    console.error(error);
    res.redirect("/auth/signup");
  }
});

//  LOGOUT 
router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

// LOGIN PAGE 

router.get("/auth/login", (req, res) => {
  res.render("login", { title: "Login", user: req.user || null });
});

// SIGNUP PAGE

router.get("/auth/signup", (req, res) => {
  res.render("signup", { title: "Signup", user: req.user || null });
});

// DASHBOARD

router.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  res.render("dashboard", { title: "Dashboard", user: req.user, showLink: true });
});

module.exports = router;
