// schema.validateAsync(data)
const bodyValidator = (schema) => {
    return async (req, res, next) => {
        try {
            const data = req.body;

            let result = await schema.validateAsync(data, {
                abortEarly: false,
            });

            next(); // next call
        } catch (exception) {
            let msgs = {};
            if (exception.details) {
                exception.details.map((errorObj) => {
                    msgs[errorObj.context["label"]] = errorObj.message;
                });
            }

            next({
                code: 400,
                detail: msgs,
                message: "Validation Failed",
                status: "BAD_REQUEST",
            });
        }
    };
};

module.exports = {
    bodyValidator,
};
