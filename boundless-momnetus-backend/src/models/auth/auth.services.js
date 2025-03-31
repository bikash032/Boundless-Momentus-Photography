const cloudinarySvc = require("../../services/caludinary.service");
const bcrypt = require("bcryptjs");
const { generateRandomString } = require("../../utils/helpers");
class AuthServices {
    registerTransform = async (req) => {
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
}

const authSvc = new AuthServices();
module.exports = authSvc;
