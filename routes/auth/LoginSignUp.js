const express=require('express');
const {SignUp,Login,Logout,findUserByEmail, sendOtp,sendPassword}=require("../../controller/Login.controller.js");
const router=express.Router();

router.post('/register',SignUp);

router.post('/login',Login);

router.post("/find",findUserByEmail)

router.post('/getotp',sendOtp);

router.get('/logout',Logout);

router.post('/setpassword',sendPassword);

module.exports=router;