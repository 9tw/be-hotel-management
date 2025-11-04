require("dotenv").config();
const process = require("process");

module.exports = {
  development: {
    use_env_variable: "DB_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
