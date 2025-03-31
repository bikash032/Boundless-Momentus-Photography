const { bodyValidator } = require("../../middleware/request.validator");
const { uploader } = require("../../middleware/uploader.moddleware");
const authCtrl = require("./auth.controller");
const { UserRegistrationDTO } = require("./auth.validator");

const authRoutes = require("express").Router();

authRoutes.post(
    "/register",
    uploader().single("image"),
    bodyValidator(UserRegistrationDTO),
    authCtrl.register
);

module.exports = authRoutes;
