const Recipe = require("../model/Recipe");
const User = require("../model/User");
const recipeServices = require("../services/recipeServices");

async function onlyUsers(req, res, next) {
  const id = req.session.userId;
  if (!req.session.userId) return res.redirect("/admin/users/login");
  const user = await User.find(id);
  if (!user)
    return res.render("admin/users/login", {
      error: "Usuário não cadastrado!",
    });
  req.user = user;
  next();
}

async function onlyAdmins(req, res, next) {
  const id = req.session.userId;
  if (!id) return res.redirect("/admin/users/login");
  const user = await User.find(id);
  if (!user)
    return res.render("admin/users/login", {
      error: "Usuário não cadastrado!",
    });
  if (!user.is_admin)
    return res.render("admin/profile/index", {
      user: user,
      error: "Você não tem permissão para entrar nesta área!",
    });
  req.user = user;
  next();
}

function isLoggedRedirectToProfile(req, res, next) {
  if (req.session.userId) return res.redirect("/admin/profile");
  next();
}

async function checkIfIsAdminToCreate(req, res, next) {
  const id = req.session.userId;
  if (id) {
    const user = await User.find(id);
    if (!user.is_admin) {
      return res.render("admin/profile/index", {
        user: user,
        error: "Você não tem permissão para entrar nesta área!",
      });
    }
    req.user = user;
  }
  next();
}

async function checkIfIsOfOwnUserOrAdmin(req, res, next) {
  const recipe = await Recipe.find(req.body.id || req.params.id);
  if (!recipe)
    return res.render("admin/recipes/index", {
      recipes: await recipeServices.load("getRecipes", {
        is_admin: req.session.is_admin,
        id: req.session.userId,
      }),
      error: "Esta receita não existe mais!",
    });
  if (recipe.user_id != req.session.userId && !req.user.is_admin)
    return res.render("admin/profile/index", {
      user: req.user,
      error: "Você não tem permissão para editar essa receita!",
    });
  req.user.isAllowed = true;
  req.recipe = recipe;
  next();
}

async function checkIfIsAllowedToChange(req, res, next) {
  const recipe = await recipeServices.load("getRecipe", { id: req.params.id });
  if (recipe.user_id == req.session.userId || req.user.is_admin)
    req.user.isAllowed = true;
  req.recipe = recipe;
  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToProfile,
  onlyAdmins,
  checkIfIsAdminToCreate,
  checkIfIsOfOwnUserOrAdmin,
  checkIfIsAllowedToChange,
};
