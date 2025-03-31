require("dotenv").config();

const AppConfig = {
    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
};

const PgConfig = {
    host: process.env.PG_HOST,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    dbName: process.env.PG_DBNAME,
    port: process.env.PG_PORT,
    dialect: process.env.DB_DIALECT,
};

const SmtpConfig = {
    provider: process.env.SMTP_PROVIDER,
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    prossword: process.env.SMTP_PWD,
    port: process.env.SMTP_PORT,
    fromAddress: process.env.FROM_ADDRESS,
};
const StatusValue = {
    ACTIVE: "active",
    INACTIVE: "inactive",
};

const UserRole = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    SELLER: "seller",
};

module.exports = {
    AppConfig,
    SmtpConfig,
    StatusValue,
    UserRole,
    PgConfig,
};
