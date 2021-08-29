const express = require("express");
const routes = express.Router();
const public = require("./public/index");
const recipes = require("./admin/recipes");
const chefs = require("./admin/chefs");
const users = require("./admin/users");
const profile = require("./admin/profile");

/* =================== PUBLIC =================== */
routes.use(public);

/* =================== ADMIN =================== */
/* ============= RECIPES ============= */
routes.use("/admin/recipes", recipes);

/* ============= CHEFS ============= */
routes.use("/admin/chefs", chefs);

/* ============= PROFILE ============= */
routes.use("/admin/profile", profile);

/* ============= USERS ============= */
routes.use("/admin/users", users);

/* ============= ALIAS ============= */
routes.get("/admin", function (req, res) {
  return res.redirect("/admin/recipes");
});

module.exports = routes;
