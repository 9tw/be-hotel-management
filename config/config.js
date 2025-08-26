require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: process.env.DB_DIALECT,
  },
};
