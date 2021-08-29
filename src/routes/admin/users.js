const express = require("express");
const routes = express.Router();
const UserController = require("../../app/controllers/admin/UserController");
const SessionController = require("../../app/controllers/admin/SessionController");
const userValidator = require("../../app/validators/userValidator");
const sessionValidator = require("../../app/validators/sessionValidator");
const {
  onlyAdmins,
  isLoggedRedirectToProfile,
  checkIfIsAdminToCreate,
} = require("../../app/middlewares/session");

/* ============= REGISTER ============= */
routes.get("/create", checkIfIsAdminToCreate, UserController.registerForm);
routes.post("/create", userValidator.post, UserController.post);

/* ============= LOGIN ============= */
routes.get("/login", isLoggedRedirectToProfile, SessionController.loginForm);
routes.post("/login", sessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);

/* ============= RESET PASS ============= */
routes.get("/forgot-password", SessionController.forgotForm);
routes.get("/password-reset", SessionController.resetForm);
routes.post(
  "/forgot-password",
  sessionValidator.forgot,
  SessionController.forgot
);
routes.post("/password-reset", sessionValidator.reset, SessionController.reset);

/* ============= USER ============= */
routes.get("/", onlyAdmins, UserController.list);
routes.get(
  "/:id/edit",
  onlyAdmins,
  checkIfIsAdminToCreate,
  UserController.editForm
);
routes.put(
  "/:id",
  onlyAdmins,
  checkIfIsAdminToCreate,
  userValidator.update,
  UserController.update
); // Editar um usuário
routes.delete("/:id", onlyAdmins, UserController.delete); // Deletar um usuário

module.exports = routes;
