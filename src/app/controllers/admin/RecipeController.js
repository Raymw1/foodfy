const { unlinkSync } = require("fs");

const Recipe = require("../../model/Recipe");
const File = require("../../model/File");
const Chef = require("../../model/Chef");
const RecipeFiles = require("../../model/RecipeFiles");

const recipeServices = require("../../services/recipeServices");
const { parseToArray } = require("../../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      const recipes = await recipeServices.load("getRecipes", {
        is_admin: req.user.is_admin,
        id: req.session.userId,
      });
      return res.render("admin/recipes/index", { recipes });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async show(req, res) {
    try {
      const recipe = await recipeServices.load("getRecipe", {
        id: req.params.id,
      });
      return res.render("admin/recipes/show", {
        recipe,
        isAllowed: req.user.isAllowed,
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async create(req, res) {
    try {
      const chefs = await Chef.findAll();
      return res.render("admin/recipes/create", { chefs });
    } catch (err) {
      console.error(err);
      return res.render("admin/recipes/create", { error: "Algo deu errado!" });
    }
  },
  async post(req, res) {
    try {
      const { userId } = req.session;
      let { chef_id, title, ingredients, preparation, information } = req.body;
      ingredients = parseToArray(ingredients);
      preparation = parseToArray(preparation);
      const recipe_id = await Recipe.create({
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        user_id: userId,
      });
      const filesPromise = req.files.map(async (file) => {
        const file_id = await File.create({
          name: file.filename,
          path: file.path,
        });
        await RecipeFiles.create({ recipe_id, file_id });
      });
      await Promise.all(filesPromise);
      const recipe = await recipeServices.load("getRecipe", { id: recipe_id });
      return res.render(`admin/recipes/show`, {
        recipe,
        success: "Receita criada com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/recipes/create", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async edit(req, res) {
    try {
      const recipe = await recipeServices.load("getRecipe", {
        id: req.params.id,
      });
      if (!recipe) {
        return res.send("Recipe not found");
      }
      const chefs = await Chef.findAll();
      return res.render("admin/recipes/edit", { recipe, chefs });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async put(req, res) {
    try {
      let { id, chef_id, title, ingredients, preparation, information } =
        req.body;
      ingredients = parseToArray(ingredients);
      preparation = parseToArray(preparation);
      await Recipe.update(id, {
        chef_id,
        title,
        ingredients,
        preparation,
        information,
      });

      const filesPromise = req.files.map(async (file) => {
        const file_id = await File.create({
          name: file.filename,
          path: file.path,
        });
        await RecipeFiles.create({ recipe_id: req.body.id, file_id });
      });
      await Promise.all(filesPromise);

      if (req.body.removed_files) {
        const removed_files = req.body.removed_files.split(",");
        removed_files.pop();
        const removedFilesPromise = removed_files.map(async (id) => {
          await RecipeFiles.deleteIf({ where: { file_id: id } });
          const pathFile = (await File.find(id))?.path;
          await File.delete(id);
          unlinkSync(pathFile);
        });
        await Promise.all(removedFilesPromise);
      }
      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async delete(req, res) {
    try {
      await recipeServices.load("deleteRecipe", { recipe_id: req.body.id });
      const recipes = await recipeServices.load("getRecipes", {
        is_admin: req.session.is_admin,
      });
      return res.render(`admin/recipes/index`, {
        recipes,
        success: "Receita deletada com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
};
