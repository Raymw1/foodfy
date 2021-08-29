const express = require("express");
const routes = express.Router();
const chefs = require("../../app/controllers/admin/ChefController");
const multer = require("../../app/middlewares/multer");
const { onlyUsers, onlyAdmins } = require("../../app/middlewares/session");
const chefValidator = require("../../app/validators/chefValidator");

routes.get("/", onlyUsers, chefs.index); // Mostrar a lista de receitas
routes.get("/create", onlyAdmins, chefs.create); // Mostrar formulário de nova receita
routes.get("/:id", onlyUsers, chefs.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", onlyAdmins, chefs.edit); // Mostrar formulário de edição de receita
routes.post(
  "/",
  onlyAdmins,
  multer.array("avatar", 1),
  chefValidator.post,
  chefs.post
); // Cadastrar nova receita
routes.put(
  "/",
  onlyAdmins,
  multer.array("avatar", 1),
  chefValidator.put,
  chefs.put
); // Editar uma receita
routes.delete("/", onlyAdmins, chefValidator.delete, chefs.delete); // Deletar uma receita

module.exports = routes;
