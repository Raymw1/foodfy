/* eslint-disable camelcase */
const { unlinkSync } = require("fs");

const Chef = require("../model/Chef");
const File = require("../model/File");
const Recipe = require("../model/Recipe");
const RecipeFiles = require("../model/RecipeFiles");

async function getImages(file_id) {
  const image = await File.find(file_id);
  return {
    id: image?.id,
    name: image?.name,
    src: image?.path.replace("public", ""),
  };
}

async function getChefAndImage(recipe) {
  const file_id = (
    await RecipeFiles.findOne({ where: { recipe_id: recipe.id } })
  )?.file_id;
  recipe.image = file_id ? await getImages(file_id) : null;
  recipe.chef_name = (
    await Chef.findOne({ where: { id: recipe.chef_id } })
  ).name;
  return recipe;
}

module.exports = {
  load(service, filters) {
    this.filters = filters;
    return this[service]();
  },
  async getRecipes() {
    try {
      let recipes = [];
      if (this.filters?.is_admin || this.filters?.all) {
        recipes = await Recipe.findAll();
      } else if (this.filters?.chef_id) {
        recipes = await Recipe.findAll({
          where: { chef_id: this.filters.chef_id },
        });
      } else {
        recipes = await Recipe.findAll({ where: { user_id: this.filters.id } });
      }
      const recipesPromise = recipes.map(getChefAndImage);
      return Promise.all(recipesPromise);
    } catch (err) {
      console.error(err);
    }
  },
  async paginate() {
    try {
      let { page, filter, limit } = this.filters;
      page = page || 1;
      limit = limit || 6;
      const offset = limit * (page - 1);
      const params = {
        filter,
        page,
        limit,
        offset,
      };
      let recipes = await Recipe.paginate(params);
      const total = recipes[0]?.total || 0;
      const pagination = {
        total: Math.ceil(total / limit),
        page,
      };
      const recipesPromise = recipes.map(getChefAndImage);
      recipes = await Promise.all(recipesPromise);
      return { recipes, pagination };
    } catch (err) {
      console.error(err);
    }
  },
  async getRecipe() {
    const recipe = await Recipe.find(this.filters.id);
    const images = await RecipeFiles.findAll({
      where: { recipe_id: this.filters.id },
    });
    const imagesPromise = images.map((image) => getImages(image.file_id));
    recipe.images = await Promise.all(imagesPromise);
    recipe.chef_name = (
      await Chef.findOne({ where: { id: recipe.chef_id } })
    ).name;
    return recipe;
  },
  async deleteRecipe() {
    const { recipe_id } = this.filters;
    const files = await RecipeFiles.findAll({ where: { recipe_id } });

    await Recipe.delete(recipe_id);
    await RecipeFiles.deleteIf({ where: { recipe_id } });
    const filesPromise = files.map(async (file) => {
      const pathFile = (await File.find(file.file_id))?.path;
      File.delete(file.file_id);
      unlinkSync(pathFile);
    });
    await Promise.all(filesPromise);
  },
};
