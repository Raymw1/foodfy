const express = require("express");
const routes = express.Router();
const publicController = require("../../app/controllers/publicController");

routes.get("/", publicController.index);
routes.get("/about", publicController.about);
routes.get("/recipes", publicController.recipes);
routes.get("/recipes/:id", publicController.recipe);
routes.get("/chefs", publicController.chefs);

module.exports = routes;
