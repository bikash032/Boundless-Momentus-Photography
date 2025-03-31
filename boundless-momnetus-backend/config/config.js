const { PgConfig } = require("../src/config/constant");

module.exports = {
    development: {
        username: PgConfig.username,
        password: PgConfig.password,
        database: PgConfig.dbName,
        host: PgConfig.host,
        dialect: PgConfig.dialect,
    },
    test: {
        username: PgConfig.username,
        password: PgConfig.password,
        database: PgConfig.dbName,
        host: PgConfig.host,
        dialect: PgConfig.dialect,
    },
    production: {
        username: PgConfig.username,
        password: PgConfig.password,
        database: PgConfig.dbName,
        host: PgConfig.host,
        dialect: PgConfig.dialect,
    },
};
