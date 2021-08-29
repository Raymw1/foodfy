const Chef = require("../model/Chef");

const chefServices = require("../services/chefServices");
const recipeServices = require("../services/recipeServices");

module.exports = {
  async index(req, res) {
    try {
      const recipes = await recipeServices.load("getRecipes", { all: true });
      while (recipes.length > 6) {
        recipes.pop();
      }
      return res.render("public/index", { recipes });
    } catch (err) {
      console.error(err);
      return res.render("public/index", { error: "Algo deu errado!" });
    }
  },
  about(req, res) {
    return res.render("public/about");
  },
  async recipes(req, res) {
    try {
      const { filter, page, limit } = req.query;
      const { recipes, pagination } = await recipeServices.load("paginate", {
        filter,
        page,
        limit,
      });
      return res.render("public/recipes", { recipes, filter, pagination });
    } catch (err) {
      console.error(err);
      return res.render("public/index", { error: "Algo deu errado!" });
    }
  },
  async recipe(req, res) {
    try {
      const recipe = await recipeServices.load("getRecipe", {
        id: req.params.id,
      });
      if (!recipe) {
        return res.send("Recipe not found");
      }
      return res.render("public/recipe", { recipe });
    } catch (err) {
      console.error(err);
      return res.render("public/index", { error: "Algo deu errado!" });
    }
  },
  async chefs(req, res) {
    try {
      let chefs = await Chef.findAll();
      chefs = await chefServices.getChefs(chefs);
      return res.render("public/chefs", { chefs });
    } catch (err) {
      console.error(err);
      return res.render("public/index", { error: "Algo deu errado!" });
    }
  },
};
