const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_INFO).then(() => {
  console.log("Connected to Mongoose");
});
