const UserModel = require("../../Database/Models/User");
const express = require("express");
const router = express.Router();
// GetUser

router.get("/getUser", async (req, res) => {
  const user = await UserModel.findOne({ email: req.email });
  if (user) {
    const {
      email,
      name,
      DPurl,
      Notifications,
      followers,
      following,
      bio,
      posts,
    } = user;
    res
      .status(200)
      .json({
        user: {
          email,
          name,
          DPurl,
          Notifications,
          followers,
          following,
          bio,
          posts,
        },
      });
  } else {
    res.status(400).json({ success: false, data: "User Not Found" });
  }
});

module.exports = router;
