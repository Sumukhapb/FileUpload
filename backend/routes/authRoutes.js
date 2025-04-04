const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login", user: req.user || null });
});

router.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login"); 
  }

  // console.log("Authenticated User:", req.user);

  if (!req.user) {
    return res.redirect("/login");
  }

  res.render("dashboard", { title: "Dashboard", user: req.user });
});

module.exports = router;
