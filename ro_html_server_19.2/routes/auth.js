const Router = require("express").Router();
const passport = require("passport");
const mysql = require("../mysql");

Router.use((req, res, next) => {
  console.log("A request coming into auth.js");
  next();
});

function veifty(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
}

// signup

Router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

Router.post("/signup", (req, res) => {
  const { email, userid, user_pass, sex } = req.body;

  mysql.query(
    `SELECT userid FROM login WHERE userid = '${userid}'`,
    (err, result) => {
      if (result[0]) {
        req.flash("error_msg", "此帳號已存在");
        return res.redirect("/auth/signup");
      } else {
        mysql.query(
          `INSERT INTO login(userid,email,user_pass,sex) VALUES('${userid}','${email}','${user_pass}','${sex}')`,
          (err, result) => {
            if (err) {
              console.log(err);
              res.send("註冊錯誤");
            } else {
              console.log(result);
              req.flash("success_msg", "註冊成功，五秒後導向至登入頁面");
              res.render("ok", {
                user: req.user,
              });
            }
          }
        );
      }
    }
  );
});
// local login

Router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

Router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "帳號或密碼輸入錯誤",
  }),
  (req, res) => {
    console.log(req.user);

    res.redirect("/");
  }
);

// logout

Router.get("/logout", (req, res) => {
  req.logOut(() => {});
  res.redirect("/");
});

module.exports = Router;
