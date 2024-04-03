const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const session = require("express-session");

const passportSetup=require("./routes/auth/passportStrategy.js")
const dotenv = require("dotenv");
const DBconnect=require("./Database/connection/DBconnect");
const googleRoutes=require("./routes/auth/auth.js")
const authRoutes=require("./routes/auth/LoginSignUp.js")
const UserRoutes=require("./routes/users/user.js")
const postRoutes=require("./routes/post/post.route.js")
// Middleware

dotenv.config();
app.use(cors(
  {
    origin: ["http://localhost:5173","http://localhost:3000","http://localhost:5174"],
    credentials: true,

  }
));
app.use(express.json());
app.use(cookieParser());
app.use(session ({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

DBconnect();

// Routes

app.use("/auth/apiv1",googleRoutes);
app.use("/authSimple/apiv1",authRoutes);
app.use("/user/apiv1",UserRoutes);
app.use("/post/apiv1",postRoutes);


app.get("/", (req, res) => {
  res.send("Hello World");
});

// Global Error Handler

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    error: err.message,
  });
});


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
