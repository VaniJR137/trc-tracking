const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("tracking_system", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL connection established successfully."))
  .catch((err) => console.error("❌ Unable to connect to the database:", err));

module.exports = sequelize;
