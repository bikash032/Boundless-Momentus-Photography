const cloudinarySvc = require("../../services/caludinary.service");
const { generateRandomString } = require("../../utils/helpers");
const UserModel = require("./user");
const bcrypt = require("bcryptjs");
class UserService {
    transformUserCreate = async (req) => {
        try {
            let data = req.body;

            data.name = data.fullName;
            let file = await cloudinarySvc.uploadFile(req.file.path, "user");
            data.password = bcrypt.hashSync(data.password, 10);
            data.image = file;
            data.status = "inactive";
            data.activationToken = generateRandomString(100);
            delete data.confirmPassword;
            delete data.fullName;
            return data;
        } catch (exception) {
            throw exception;
        }
    };
    storeUser = async (data) => {
        try {
            const user = await UserModel.create(data);
            return user;
        } catch (exception) {
            throw exception;
        }
    };
    getSingleUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne({
                where: { ...filter },
            });

            return user;
        } catch (exception) {
            throw exception;
        }
    };
    updateUserByID = async (id, updateData) => {
        try {
            const [updatedRows] = await UserModel.update(updateData, {
                where: { id },
            });
            return updatedRows > 0
                ? { success: true, message: "User updated successfully" }
                : { success: false, message: "User not found or not updated" };
        } catch (exception) {
            throw exception;
        }
    };
    mapLoggedInUser = (user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            address: user.address,
            phone: user.phone,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };
    verifyForgetPasswordToken = async (token) => {
        if (!token) {
            throw {
                code: 422,
                status: "TOKEN_EXPECTED",
                message: "Forget password token expected",
            };
        }
        const user = await this.getSingleUserByFilter({
            forgetPasswordToken: token,
        });

        if (!user) {
            throw {
                code: 422,
                status: "TOKEN_NOT_FOUND",
                message: "Token does not exists or already expired",
            };
        }
        const tokenExpiryTime = user.expiryTime.getTime();
        const nowTime = Date.now();
        if (nowTime > tokenExpiryTime) {
            throw {
                code: 422,
                message: "Token Expired",
                status: "FORGET_TOKEN_EXPIRED",
            };
        }
        return user;
    };
}
const userSvc = new UserService();
module.exports = userSvc;
