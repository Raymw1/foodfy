/* eslint-disable camelcase */
const { verifyForm, parseToArray } = require("../../lib/utils");
const Chef = require("../model/Chef");
const recipeServices = require("../services/recipeServices");

module.exports = {
  async post(req, res, next) {
    const chefs = await Chef.findAll();
    const noImage = req.files.length === 0;
    req.body.ingredients = parseToArray(req.body.ingredients);
    req.body.preparation = parseToArray(req.body.preparation);
    if (noImage)
      return res.render("admin/recipes/create", {
        files: req.files,
        recipe: req.body,
        chefs,
        error: "Insira pelo menos uma imagem!",
      });
    const emptyFields = verifyForm(req.body);
    const data = {
      recipe: {
        ...emptyFields?.user,
        ingredients: parseToArray(emptyFields?.user.ingredients),
        preparation: parseToArray(emptyFields?.user.preparation),
      },
      error: emptyFields?.error,
    };
    if (emptyFields)
      return res.render("admin/recipes/create", { ...data, chefs });
    next();
  },
  async put(req, res, next) {
    const chefs = await Chef.findAll();
    const emptyFields = verifyForm(req.body);
    const recipe = await recipeServices.load("getRecipe", { id: req.body.id });
    const removed_files = req.body.removed_files.split(",");
    removed_files.pop();
    const noPhotos =
      recipe.images?.length + req.files?.length - removed_files.length <= 0;
    const data = {
      recipe: {
        ...emptyFields?.user,
        ingredients: parseToArray(emptyFields?.user.ingredients),
        images: recipe.images,
        preparation: parseToArray(emptyFields?.user.preparation),
      },
      error: emptyFields?.error,
    };
    if (recipe.images?.length + req.files?.length > 5)
      return res.render("admin/recipes/edit", {
        recipe,
        chefs,
        error: "Insira no máximo 5 imagens!",
      });
    if (noPhotos)
      return res.render("admin/recipes/edit", {
        recipe,
        chefs,
        error: "Insira pelo menos 1 imagem!",
      });
    if (emptyFields)
      return res.render("admin/recipes/edit", { ...data, chefs });
    next();
  },
};
