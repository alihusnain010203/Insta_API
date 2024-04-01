const express = require("express");
const passport = require("passport");
const router = express.Router();
const sendMail = require("../../utils/sendMail.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../../Database/Models/User.js");
const errorHandler = require("../../utils/errorHandler.js");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/fail" }),
  (req, res) => {
    res.redirect(`http://localhost:5173/wait?id=${req.user._id}`);
  }
);

router.get("/google/fail", (req, res) => {
  res
    .status(400)
    .json({ success: false, data: "google Authentication Failed" });
});

router.post("/getUser", async (req, res, next) => {
  const id = req.body.id;

  try {
    if (!id) {
      next(errorHandler(400, "Please Provide User ID"));
    }
    const user = await UserModel.findById({ _id: id });
    if (!user) {
      console.log(id);
      next(errorHandler(404, "User Not Found"));
    } else {
      const { password, ...rest } = user._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      res.status(200).json({ success: true, data: rest, token });
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
});

// Logout Route

router.get("/google/logout", (req, res) => {
  req.logout();
  res.status(200).json({ success: true, data: "User Logged Out" });
});

module.exports = router;
