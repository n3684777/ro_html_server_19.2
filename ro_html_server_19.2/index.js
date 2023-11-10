const express = require("express");
const app = express();
const ejs = require("ejs");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const mysql = require("./mysql");
const mongoose = require("./mongoose");
const flash = require("connect-flash");
require("./config/passport");
const authRoute = require("./routes/auth");
const boardRoute = require("./routes/board");
const memberRoute = require("./routes/member");

//models
const User = require("./models/user");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ resave: false, saveUninitialized: false, secret: "123456" }));

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/board", boardRoute);
app.use("/member", memberRoute);

// async function login() {
//   let foundUser = await mysql.query(
//     `select * from login where userid = 'q3684777' `,
//     (err, result) => {
//       if (err) {
//         throw Error(err);
//       }
//       if (result[0]) {
//         console.log(result);
//         console.log("have");
//       }
//     }
//   );
//   // console.log(foundUser);
// }
// login();

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

//測試網頁搜尋
app.get("/test", (req, res) => {
  res.render("test", { user: req.user });
  // res.json(1);
});

app.get("/test2", (req, res) => {
  let data = [1, 2, 3, 4, 5];
  res.send(data);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.listen(8051, () => {
  console.log("listening on 8051 port");
});
