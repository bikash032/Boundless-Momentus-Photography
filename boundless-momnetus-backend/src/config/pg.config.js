const { Sequelize } = require("sequelize");
const { PgConfig } = require("./constant");

const sequelize = new Sequelize(
    PgConfig.dbName,
    PgConfig.username,
    PgConfig.password,
    {
        host: PgConfig.host,
        port: PgConfig.port,
        dialect: PgConfig.dialect,
    }
);

sequelize
    .authenticate()
    .then((res) => {
        console.log("SQL Server connected....");
    })
    .catch((error) => {
        console.log("Error connecting server.");
    });

module.exports = sequelize;
