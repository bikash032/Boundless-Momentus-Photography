const express = require("express");
const routes = require("./src/config/router.config");
const { SequelizeScopeError } = require("sequelize");
const app = express();
const cors = require("cors");
require("./src/config/pg.config");

app.use(
    cors({
        origin: "*", // Allow all origins
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
let PORT = 9016;
let HOST = "localhost";

app.use((req, res, next) => {
    next({ code: 404, message: "Not Found", status: "NOT_FOUND" });
});
app.use((error, req, res, next) => {
    let statusCode = error.code || 500;
    let detail = error.detail || null;
    let msg = error.message || "Inetrnal server error.....";
    let status = error.status || "SERVER_ERROR";
    if (
        error instanceof SequelizeScopeError ||
        error.name === "SequelizeUniqueConstraintError"
    ) {
        detail = null;
        const duplicateField = error.errors[0].path; // Column name (e.g., 'email')
        const duplicateValue = error.errors[0].value; // Duplicate value (e.g., 'bikash1234@gamil.com')
        msg = `${duplicateField}:${duplicateValue} is already exist in database`;
        status = "VALIDIATION_FAILED";
    }
    res.status(statusCode).json({
        status: statusCode,
        error: detail,
        message: msg,
        status: status,
    });
});
app.listen(PORT, HOST, (error) => {
    if (error) {
        console.log("Error while connection network");
    } else {
        console.log(`http://${HOST}:${PORT} is connected successfully!!`);
    }
});
