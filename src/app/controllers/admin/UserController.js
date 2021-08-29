const { hash } = require("bcryptjs");
const mailer = require("../../../lib/mailer");

const User = require("../../model/User");
const Recipe = require("../../model/Recipe");
const recipeServices = require("../../services/recipeServices");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.findAll();
      return res.render("admin/users/index", { users });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  registerForm(req, res) {
    return res.render("admin/users/create");
  },
  async post(req, res) {
    try {
      let { name, email, password, is_admin } = req.body;
      password = await hash(password, 8);
      is_admin = !!is_admin;
      const userId = await User.create({ name, email, password, is_admin });

      req.session.userId = req.user?.is_admin ? req.session.userId : userId;

      await mailer.sendMail({
        to: req.body.email,
        from: process.env.APP_MAIL,
        subject: "Você foi registrado com sucesso!",
        html: `<h2>Acesse sua conta agora</h2>
        <p>Não se preocupe, clique no link abaixo para acessar sua conta</p>
        <p><a href="http://127.0.0.1:3000/admin/users/login" target="_blank">Acessar minha conta</a></p>`,
      });

      req.session.save((err) => {
        if (err) throw err;
        if (req.user?.is_admin) {
          return res.redirect(`/admin/users/${userId}/edit`);
        }
        return res.redirect("/admin/profile");
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/create", { error: "Algo deu errado!" });
    }
  },
  async editForm(req, res) {
    try {
      const data = await User.find(req.params.id);
      return res.render("admin/users/edit", { data });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { error: "Algo deu errado!" });
    }
  },
  async update(req, res) {
    try {
      let { name, email, is_admin } = req.body;
      is_admin = !!is_admin;
      await User.update(req.params.id, { name, email, is_admin });
      return res.render(`admin/users/edit`, {
        data: { ...req.body, id: req.params.id },
        success: "Usuário atualizado com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        data: { ...req.body, id: req.params.id },
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      const user = await User.find(id);
      if (!user)
        return res.render("admin/profile", {
          error: "Usuário não encontrado!",
        });
      if (user.is_admin)
        return res.render("admin/users/edit", {
          data: user,
          error: "Este usuário não pode ser deletado!",
        });

      const recipes = await Recipe.findAll({ where: { user_id: id } });
      const recipesPromise = recipes.map(async (recipe) => {
        await recipeServices.load("deleteRecipe", { recipe_id: recipe.id });
      });
      await Promise.all(recipesPromise);

      await User.delete(id);
      const users = await User.findAll();
      return res.render(`admin/users/index`, {
        users,
        success: "Usuário deletado com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
};
