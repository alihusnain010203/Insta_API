const passport = require("passport");
const UserModel = require("../../Database/Models/User.js");
const googleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const errorHandler = require("../../utils/errorHandler.js");
dotenv.config();

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/apiv1/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      let __json = profile._json;

      try {
        let user = await UserModel.findOne({ email: __json.email });
        if (user) {
          done(null, user);
        } else {
          // Unique password with the help of email
          __json.password = __json.email + __json.name;

          // Hashing the password
          const hashPassword = await bcrypt.hash(__json.password, 10);

          let user = new UserModel({
            name: __json.name,
            email: __json.email,
            DPurl: __json.picture,
            password: hashPassword,
            followers: [],
            following: [],
            bio: "",
            posts: [],
            Notifications: [],
          });

          
          await user.save();

          done(null, user);
        }
      } catch (error) {
        console.error("Error in passport strategy:", error);
        done(error, null);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
