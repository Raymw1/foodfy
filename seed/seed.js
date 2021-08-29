require("dotenv").config();
const { hash } = require("bcryptjs");
const faker = require("faker");

const User = require("../src/app/model/User");
const File = require("../src/app/model/File");
const Chef = require("../src/app/model/Chef");
const Recipe = require("../src/app/model/Recipe");
const RecipeFiles = require("../src/app/model/RecipeFiles");

const {
  chefs: dataChefs,
  recipes: dataRecipes,
} = require("./backupfoodfy.json");

let userIds = [];
let filesCount = 0;
const totalUsers = 3;

async function createUsers() {
  const users = [];
  const password = await hash("a", 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      is_admin: Math.round(Math.random()),
    });
  }
  const usersPromise = users.map((user) => User.create(user));
  userIds = await Promise.all(usersPromise);
}

async function createChefs() {
  const chefs = [];
  const files = [];
  for (dataChef of dataChefs) {
    files.push({
      name: dataChef.name,
      path: dataChef.path,
    });
    filesCount++;
    chefs.push({
      name: dataChef.name,
      avatar: files.length,
    });
  }

  const filesPromise = files.map((file) => File.create(file));
  await Promise.all(filesPromise);

  const chefsPromise = chefs.map((chef) => Chef.create(chef));
  await Promise.all(chefsPromise);
}

async function createRecipes() {
  const recipes = [],
    files = [],
    recipeFiles = [];

  for (dataRecipe of dataRecipes) {
    files.push({
      name: dataRecipe.title,
      path: dataRecipe.path,
    });
    filesCount++;
    recipeFiles.push({
      recipe_id: files.length,
      file_id: filesCount,
    });
    recipes.push({
      chef_id: dataRecipe.chef_id,
      title: dataRecipe.title,
      ingredients: dataRecipe.ingredients,
      preparation: dataRecipe.preparation,
      information: dataRecipe.information,
      user_id: Math.ceil(Math.random() * totalUsers),
    });
  }

  const filesPromise = files.map((file) => File.create(file));
  await Promise.all(filesPromise);

  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));
  await Promise.all(recipesPromise);

  const recipeFilesPromise = recipeFiles.map((file) =>
    RecipeFiles.create(file)
  );
  await Promise.all(recipeFilesPromise);
}

async function init() {
  await createUsers();
  await createChefs();
  await createRecipes();
}

init();
