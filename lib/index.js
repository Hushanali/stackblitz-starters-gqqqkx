let sq = require("sequelize");

let sequelize = new sq.Sequelize({
  dialect: "sqlite",
  Storage: "./database.sqlite",
});

module.exports = {
  DataTypes: sq.DataTypes,
  sequelize,
};