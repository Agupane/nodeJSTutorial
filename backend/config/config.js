const Joi = require('joi')

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config()

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  MONGO_PWD: Joi.string()
    .required()
    .description('Mongo DB password admin'),
  MONGO_USER: Joi.string()
    .required()
    .description('Mongo DB admin user'),
  MONGO_DB_NAME: Joi.string()
    .required()
    .description('Mongo DB name'),
  ENCRYPT_PK: Joi.string()
    .required()
    .description('Encrypt PK')
})
  .unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  mongo: {
    user: envVars.MONGO_USER,
    db: envVars.MONGO_DB_NAME,
    pwd: envVars.MONGO_PWD
  },
  encryptPk: envVars.ENCRYPT_PK
}

module.exports = config