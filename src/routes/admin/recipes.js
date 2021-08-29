const express = require("express");
const routes = express.Router();
const recipes = require("../../app/controllers/admin/RecipeController");
const multer = require("../../app/middlewares/multer");
const {
  onlyUsers,
  checkIfIsOfOwnUserOrAdmin,
  checkIfIsAllowedToChange,
} = require("../../app/middlewares/session");
const recipeValidator = require("../../app/validators/recipeValidator");

routes.get("/", onlyUsers, recipes.index); // Mostrar a lista de receitas
routes.get("/create", onlyUsers, recipes.create); // Mostrar formulário de nova receita
routes.get("/:id", onlyUsers, checkIfIsAllowedToChange, recipes.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", onlyUsers, checkIfIsOfOwnUserOrAdmin, recipes.edit); // Mostrar formulário de edição de receita
routes.post(
  "/",
  onlyUsers,
  multer.array("photos", 5),
  recipeValidator.post,
  recipes.post
); // Cadastrar nova receita
routes.put(
  "/",
  onlyUsers,
  multer.array("photos", 5),
  checkIfIsOfOwnUserOrAdmin,
  recipeValidator.put,
  recipes.put
); // Editar uma receita
routes.delete("/", onlyUsers, checkIfIsOfOwnUserOrAdmin, recipes.delete); // Deletar uma receita

module.exports = routes;
