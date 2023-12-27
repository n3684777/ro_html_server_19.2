const { validRole, validLogin } = require("./validate");
let req = { user: { userid: "123" } };
console.log(req.user);
let group = { group_id: "30" };
let data = validLogin(req.user);
// console.log(data.error.details[0].message);
let data2 = validRole(group.group_id);

console.log(data2);
