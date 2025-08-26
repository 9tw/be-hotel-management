require("dotenv").config();
const process = require("process");

module.exports = {
  development: {
    use_env_variable: process.env.DB_URL,
    dialect: process.env.DB_DIALEC,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
