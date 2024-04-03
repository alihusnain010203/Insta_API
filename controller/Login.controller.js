const UserModal = require("../Database/Models/User.js");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/errorHandler.js");
const jwt = require("jsonwebtoken");
const sendMail=require("../utils/sendMail.js")
const SignUp = async (req, res, next) => {
  const { name, email, password,DPurl} = req.body;

  try {
    const user = await UserModal.findOne({ email: email });

    if (user) {
      return next(errorHandler(409, "User Already Exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModal({
      name,
      email,
      password: hashedPassword,
      DPurl,
    });

    await newUser.save();
    // remove password from user
    const { password: userPassword, ...data } = newUser._doc;
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET_KEY
    );
    res.status(201).json({
      success: true,
      data: { ...data },
      token: token,
    });
  } catch (err) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModal.findOne({ email: email });

    if (!user) {
      next(errorHandler(404, "User Not Found"));
    }
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      next(errorHandler(401, "Invalid Credentials"));
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET_KEY
    );

    //   remove password from user

    const { password: userPassword, ...data } = user._doc;

    res.status(200).json({
      success: true,
      data: { ...data },
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

const findUserByEmail = async (req,res,next) => {
    const { email } = req.body;
    console.log(email);
    const user = await UserModal.findOne({
        email: email,
    });
    console.log(user);
    if (!user) {
       return next(errorHandler(404, "User Not Found"));
    }
    // get online DPUrl and name of user
    const { DPurl, name } = user;
    return res.status(200).json({
        success: true,
        data: { DPurl, name },

    });
   
};

const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModal.findOne({
    email: email,
  });
    if (!user) {
        return next(errorHandler(404, "User Not Found"));
    }
    // generate OTP of six digits
    const otp = Math.floor(100000 + Math.random() * 900000);
    // send OTP to user email

    await sendMail(email, "OTP for Password Reset", `Your OTP is ${otp}`);

    // store OTP in database

    user.OTP = otp;
    await user.save();

    // delete OTP after 5 minutes

    setTimeout(async () => {
        user.OTP = null;
        await user.save();
    }, 300000);




    return res.status(200).json({
        success: true,
        data: "OTP sent successfully",
    });

}

const sendPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await UserModal.findOne({
    email: email,
  });
    if (!user) {
        return next(errorHandler(404, "User Not Found"));
    }
    if (user.OTP !== otp) {
        return next(errorHandler(401, "Invalid OTP"));
    }
    // change password
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return res.status(200).json({
        success: true,
        data: "Password changed successfully",
    });
}


const Logout = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "User Logged Out Successfully",
  });
};

module.exports = { SignUp, Login, Logout, findUserByEmail,sendOtp,sendPassword};
