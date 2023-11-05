const Joi = require("joi");

const schema = Joi.object({ userid: Joi.string().min(3).required() });

async function valid() {
  let data = await schema.validate({ userid: "1334" });
  if (data.error) {
    console.log(data.error.details[0].message);
  }
}

valid();
