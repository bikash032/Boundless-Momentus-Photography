const authSvc = require("./auth.services");

class AuthController {
    register = async (req, res, next) => {
        try {
            let data = await authSvc.registerTransform(req);
        } catch (exception) {
            next(exception);
        }
    };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
