const Router = require("express").Router();
const Post = require("../models/post");

function veifty(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "請先登入帳號以使用留言功能");
    res.redirect("/auth/login");
  } else {
    next();
  }
}

Router.get("/", veifty, async (req, res) => {
  let postAll = await Post.find({});
  res.render("board", { user: req.user, Post: postAll });
});

Router.post("/", veifty, async (req, res) => {
  const { title, content, anonymous } = req.body;

  const newPost = await Post.create({
    title,
    content,
    author: anonymous ? "匿名" : req.user.userid,
  });

  try {
    const savePost = await newPost.save();

    res.redirect("/board");
  } catch (err) {
    res.status(401).send(err);
  }
});

module.exports = Router;
