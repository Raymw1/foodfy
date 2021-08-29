const express = require("express");
const routes = express.Router();
const { onlyUsers } = require("../../app/middlewares/session");
const userValidator = require("../../app/validators/userValidator");
const profileValidator = require("../../app/validators/profileValidator");
const ProfileController = require("../../app/controllers/admin/ProfileController");

routes.get("/", onlyUsers, userValidator.show, ProfileController.show);
routes.put("/", onlyUsers, profileValidator.update, ProfileController.update);

module.exports = routes;
