const authRoutes = require("../models/auth/auth.routes");
const userRouter = require("../models/users/user.router");

const routes = require("express").Router();

routes.use("/auth", authRoutes);
routes.use("/admin",userRouter)
// routes.use("/admin", adminRoutes);
// routes.use("/contact", contactRoutes);

module.exports = routes;
