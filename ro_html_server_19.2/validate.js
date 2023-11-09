const Joi = require("joi");

function validLogin(params) {
  const schema = Joi.object({
    userid: Joi.string().min(4).required(),
    user_pass: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    sex: Joi.valid("男", "女"),
  });
  return schema.validate(params);
}

function validPost(params) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });
  return schema.validate(params);
}

function validRole(params) {
  const schema = Joi.object({
    group_id: Joi.number().integer().min(0).max(99).required(),
  });
  return schema.validate(params);
}

// const data = validLogin({ userid: 1234 });
// console.log(data);

module.exports.validLogin = validLogin;
module.exports.validPost = validPost;
module.exports.validRole = validRole;
