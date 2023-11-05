const Router = require("express").Router();
const mysql = require("../mysql");
function veifty(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "請登入帳號才能使用會員功能");
    return res.redirect("/auth/login");
  } else {
    next();
  }
}

Router.get("/", veifty, (req, res) => {
  const { group_id } = req.user;
  res.render("member", { user: req.user });
});

// 權限設定
Router.get("/roles", veifty, (req, res) => {
  if (req.user.group_id < 99) {
    return res.redirect("/");
  }
  mysql.query("SELECT * FROM login", (err, login) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      console.log(login);
      return res.render("roles", { login });
    }
  });
});

module.exports = Router;
