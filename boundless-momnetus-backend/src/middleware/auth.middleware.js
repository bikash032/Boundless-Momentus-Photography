const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/constant");
const userSvc = require("../models/users/user.service");
const loginCheck = async (req, res, next) => {
    try {
        let token = req.headers["authorization"] || null;
        if (!token) {
            next({
                code: 401,
                message: "Please login first",
                status: "TOKEN_EXPECTED",
            });
        } else {
            token = token.split(" ").pop();

            const data = jwt.verify(token, AppConfig.jwtSecret);

            const user = await userSvc.getSingleUserByFilter({
                id: data.sub,
            });

            if (!user) {
                next({
                    message: "User does not exists",
                    code: 401,
                    status: "USER_NOT_FOUND",
                });
            } else {
                req.loggedInUser = userSvc.mapLoggedInUser(user);

                next();
            }
        }
    } catch (exception) {
        if (exception instanceof jwt.JsonWebTokenError) {
            let status = "";
            if (exception.message === "invalid token") {
                status = "MALFORMED_HEADER_JWT";
            } else if (exception.message === "jwt expired") {
                status = "JWT_EXPIRED";
            }
            next({
                message: exception.message,
                code: 401,
                status: status,
            });
        } else {
            next({
                detail: exception.message,
                message: "Invalid Token",
                code: 401,
                status: "TOKEN_WANTED",
            });
        }
    }
};
const checkPermission = (role) => {
    return (req, res, next) => {
        let loggedinUser = req.loggedInUser;
        if (loggedinUser.role === "admin" || role.includes(loggedinUser.role)) {
            next();
        } else {
            next({
                message: "Access denied",
                code: 403,
                status: "PERMISSION DENIED",
            });
        }
    };
};
module.exports = {
    loginCheck,
    checkPermission,
};
