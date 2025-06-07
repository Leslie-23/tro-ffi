import Joi from "joi";

const envSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
}).unknown();

const { error } = envSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);
