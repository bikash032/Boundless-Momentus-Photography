const userSvc = require("./user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppConfig, StatusValue } = require("../../config/constant");
const { generateRandomString } = require("../../utils/helpers");
const { DateTime } = require("luxon");
const { object } = require("joi");
class UserController {
    createUser = async (req, res, next) => {
        try {
            const payload = await userSvc.transformUserCreate(req);

            const user = await userSvc.storeUser(payload);
            res.json({
                data: user,
                message: "User is registered successfully",
                stattus: "USER_REGISTERED",
                options: null,
            });
        } catch (exception) {
            next(exception);
        }
    };
    userActivate = async (req, res, next) => {
        try {
            const { token } = req.params;
            const user = await userSvc.getSingleUserByFilter({
                activationToken: token,
            });
            if (!user) {
                throw {
                    code: 422,
                    message:
                        "user not found or token is already used or activated",
                    status: "VALIDATION_FAILED",
                };
            }
            const updateUser = await userSvc.updateUserByID(user.id, {
                activationToken: null,
                status: "active",
            });
            if (!updateUser.success) {
                res.json({
                    code: 400,
                    data: null,
                    message:
                        "user is not activated as Token is already expired",
                });
            }

            res.json({
                code: 200,
                data: user,
                message: "user is successful activated",
            });
        } catch (exception) {
            next(exception);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const userExist = await userSvc.getSingleUserByFilter({
                email: email,
            });

            if (!userExist) {
                throw {
                    code: 422,
                    message: "User doesnot Exists",
                    status: "USER_NOT_FOUND",
                };
            }
            if (!bcrypt.compareSync(password, userExist.password)) {
                throw {
                    code: 422,
                    message: "Crediential does not matches",
                    status: "CREDIENTIAL_DOES_NOT_MATCH",
                };
            }

            if (
                userExist.dataValues.activationToken !== null ||
                userExist.dataValues.status !== "active"
            ) {
                throw {
                    code: 422,
                    message: "User not activated",
                    status: "USER_NOT_ACTIVATED",
                };
            }
            let accessToken = jwt.sign(
                {
                    sub: userExist.id,
                },
                AppConfig.jwtSecret,
                {
                    expiresIn: 3 * 60 * 60,
                }
            );
            res.json({
                data: {
                    accessToken: accessToken,
                },
                message: "User is logged in successfully",
                status: "OK",
                options: null,
            });
        } catch (err) {
            next(err);
        }
    };
    getUserLoggedIn = async (req, res, next) => {
        res.json({
            data: req.loggedInUser,
            message: "My Profile",
            status: "OK",
            options: null,
        });
    };
    forgetPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await userSvc.getSingleUserByFilter({
                email: email,
            });
            if (!user) {
                throw {
                    code: 422,
                    message: "user not found",
                    status: "USER_NOT_FOUND",
                };
            }
            let token = generateRandomString(100);
            let expiryTime = DateTime.now()
                .plus({ hour: 1 })
                .toFormat("yyyy-MM-dd HH:mm:ss");
            // user update
            await userSvc.updateUserByID(user.id, {
                forgetPasswordToken: token,
                expiryTime: expiryTime,
            });
            //notify
            // await userSvc.forgetPasswordNotify({
            //     email: user.email,
            //     token: token,
            //     name: user.name,
            // });
            res.json({
                data: token,
                message:
                    "Your request has been sent. please check your email to update your password",
                status: "OK",
                options: null,
            });
        } catch (exception) {
            next(exception);
        }
    };
    verifyForgetPasswordToken = async (req, res, next) => {
        try {
            const token = req.params.token || null;
            const user = await userSvc.verifyForgetPasswordToken(token);
            const newForgetPasswordToken = generateRandomString(100);
            await userSvc.updateUserByID(user.id, {
                forgetPasswordToken: newForgetPasswordToken,
                expiryTime: DateTime.now()
                    .plus({ hour: 1 })
                    .toFormat("yyyy-MM-dd HH:mm:ss"),
            });
            res.json({
                data: newForgetPasswordToken,
                status: "TOKEN_VERIFIED",
                message: "Forget password Token verified",
                options: null,
            });
        } catch (err) {
            next(err);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const { token, password, confirmPassword } = req.body;

            const user = await userSvc.verifyForgetPasswordToken(token);
            if (password === confirmPassword) {
                await userSvc.updateUserByID(user.id, {
                    password: bcrypt.hashSync(password, 10),
                    forgetPasswordToken: null,
                    activationToken: null,
                    expiryTime: null,
                    status: StatusValue.ACTIVE,
                });
            } else {
                res.json({
                    data: null,
                    message: "Your password doesnt match",
                    status: "Type same password",
                    options: null,
                });
            }

            res.json({
                data: null,
                message:
                    "your password has been changedsuccesfully. Please login to continue",
                status: "PASSWORD_UPDATED",
                options: null,
            });
        } catch (exception) {
            next(exception);
        }
    };
    updatePasswordForLoggedInUser = async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;
            if (oldPassword === newPassword) {
                throw {
                    code: 400,
                    message: "old password cannot use as new password",
                    status: "VALIDATION_FAILED",
                    detail: {
                        newPassword: "old password cannot use as new password",
                    },
                };
            }

            const loggedinUser = await userSvc.getSingleUserByFilter({
                id: req.loggedinUser.id,
            });
            if (!bcrypt.compareSync(oldPassword, loggedinUser.password)) {
                throw {
                    code: 400,
                    message: "Old password does not matched",
                    status: "VALIDATION_FAILED",
                    detail: {
                        oldPassword: "old password does not match",
                    },
                };
            }
            await userSvc.updateUserByID(loggedinUser.id, {
                password: bcrypt.hashSync(newPassword, 10),
            });
            res.json({
                data: null,
                message: "your password has been changed successfully",
                status: "PASSWORD_UPDATED_SUCCESSFULLY",
            });
        } catch (exception) {
            next(exception);
        }
    };
}

const userCtrl = new UserController();
module.exports = userCtrl;
