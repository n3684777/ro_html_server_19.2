const Router = require("express").Router();
const mysql = require("../mysql");
const override = require("method-override");
const { validRole, validSend } = require("../validate");
const { response } = require("express");
const { route } = require("./auth");
const cmd = require("child_process");
Router.use(override("_method"));

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
  mysql.query("SELECT * FROM login WHERE userid != 's1'", (err, login) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      // console.log(login);
      return res.render("roles", { login, user: req.user });
    }
  });
});

//重載檔案
Router.get("/reload", veifty,(req, res) => {
  
  cmd.exec("cd C:\Users\Administrator\Desktop\GITro && rmdir /s /q server && git clone https://github.com/n3684777/server.git && Xcopy C:\Users\Administrator\Desktop\GITro\server\Sever &&C:\Users\Administrator\Desktop\Sever /S /E /Y")
});

Router.patch("/roles/:account_id", (req, res) => {
  const { account_id } = req.params;
  const { group_id } = req.body;
  const valid = validRole({ group_id });
  console.log(account_id, group_id);
  if (valid.error) {
    req.flash("error_msg", valid.error.details[0].message);
    console.log(valid.error);
    console.log("-------------------errror---------------------");
    return res.redirect("/member/roles");
  }

  mysql.query(
    `UPDATE login SET group_id = '${group_id}' WHERE account_id = '${account_id}'`,
    (err, result) => {
      if (err) return res.status(401).send("更改權限等級失敗");
    }
  );
});

// 角色清單
Router.get("/char", veifty, (req, res) => {
  if (req.user.group_id < 99) {
    return res.redirect("/");
  }
  mysql.query("SELECT * FROM `char`", (err, char) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err);
    } else {
      console.log(char);
      res.render("char", { char, user: req.user });
    }
  });
});

// 更改金錢
Router.patch("/char/:char_id", veifty, (req, res) => {
  let { zeny } = req.body;
  let { char_id } = req.params;
  if (Number(zeny) > 2147483647) {
    req.flash("error_msg", "金錢修改不能 >= 2147483647");
    return res.redirect("/member/char");
  }
  mysql.query(
    "UPDATE " + "`char`" + `SET zeny = ${zeny} WHERE char_id = ${char_id}`,
    (err, result) => {
      if (err) {
        return res.status(401).send(err);
      } else {
        res.redirect("/member/char");
      }
    }
  );
});

// 寄送物品
Router.get("/roles/send", veifty, (req, res) => {
  if (req.user.group_id < 99) {
    return res.redirect("/");
  }

  res.render("send", { user: req.user });
});

Router.post("/roles/send", veifty, (req, res) => {
  // status 0 未讀
  // status 1 已讀
  // type 1 系統發送

  const { char_name, nameid, amount } = req.body;
  const send_name = "GM發送";
  const title = `GM發送物品 道具ID - ${nameid}`;
  const message = `已寄送${nameid}道具${amount}個`;
  let char_id;
  mysql.query(
    "SELECT char_id FROM `char` WHERE name = '" + char_name + "'",
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(401).send("發送道具失敗");
      } else {
        console.log("---------------result -----------------");
        console.log(result);
        console.log("---------------result -----------------");

        if (result.length == 0) {
          req.flash("error_msg", "收貨人不存在");
          return res.redirect("/member/roles/send");
        } else {
          char_id = await result[0].char_id;
          mysql.query(
            `INSERT INTO mail (send_name,send_id,dest_id,title,message,status,time,type) VALUES('${send_name}','0','${char_id}','${title}','${message}','0','20000000','1')`,
            (err, result) => {
              if (err) {
                return res.status(401).send("寄送訊息失敗");
              }
              let valid = validSend({ amount });
              if (valid.error) {
                req.flash("error_msg", "數量應為1~30000之間");
                return res.redirect("/member/roles/send");
              }
              console.log(result);

              mysql.query(
                //identify 1 已鑑定
                `INSERT INTO mail_attachments (nameid,amount,identify) VALUES('${nameid}','${amount}','1')`,
                (err, result) => {
                  if (err) {
                    req.flash("error_msg", "寄送道具失敗");
                  } else {
                    req.flash("success_msg", "寄送道具成功");
                  }
                  return res.redirect("/member/roles/send");
                }
              );
            }
          );
        }
      }
    }
  );
});
module.exports = Router;
