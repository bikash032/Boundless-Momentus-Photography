const Joi = require("joi");

const UserRegistrationDTO = Joi.object({
    fullName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[a-zA-Z\d@!#$%^&*]{8,25}$/
        )
        .required()
        .messages({
            "string.pattern.base":
                "Password must have at least one lowcase letter, one uppercase letter, one digit, one special character and must be between 8 to 25 character long",
        }),
    confirmPassword: Joi.string().equal(Joi.ref("password")).required(),
    role: Joi.string()
        .regex(/^(admin|customer|seller)$/)
        .default("customer")
        .messages({
            "string.pattern.base":
                "Role must be any of admin or seller or customer",
        }),
    address: Joi.string().optional(),
    phone: Joi.string(),
    gender: Joi.string().regex(/^(male|female|other)$/),
});

const UserLoginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const ForgetPasswordDTO = Joi.object({
    email: Joi.string().email().required(),
});

const ResetPasswordDTO = Joi.object({
    token: Joi.string().min(100).max(100).required(),
    password: Joi.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[a-zA-Z\d@!#$%^&*]{8,25}$/
        )
        .required()
        .messages({
            "string.pattern.base":
                "Password must have at least one lowcase letter, one uppercase letter, one digit, one special character and must be between 8 to 25 character long",
        }),
    confirmPassword: Joi.string().equal(Joi.ref("password")).required(),
});

const ChangePasswordDTO = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[a-zA-Z\d@!#$%^&*]{8,25}$/
        )
        .required()
        .messages({
            "string.pattern.base":
                "Password must have at least one lowcase letter, one uppercase letter, one digit, one special character and must be between 8 to 25 character long",
        }),
    confirmPassword: Joi.string().equal(Joi.ref("newPassword")).required(),
});

module.exports = {
    UserRegistrationDTO,
    UserLoginDTO,
    ForgetPasswordDTO,
    ResetPasswordDTO,
    ChangePasswordDTO,
};
