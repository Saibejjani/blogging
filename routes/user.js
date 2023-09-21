const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("Signin");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenrateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("signin", {
      error: "incorrect password or email.",
    });
  }
});

router.get("/signup", (req, res) => {
  return res.render("Signup");
});

router.post("/signup", async (req, res) => {
  console.log(req?.body);
  const { fullName, email, password } = req.body;
  const result = await User.create({ fullName, email, password });
  console.log(result);
  res.redirect("/");
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
