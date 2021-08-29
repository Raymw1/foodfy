/* eslint-disable eqeqeq */
const { verifyForm } = require("../../lib/utils");
const { compare } = require("bcryptjs");
const User = require("../model/User");

module.exports = {
  async login(req, res, next) {
    const emptyFields = verifyForm(req.body);
    if (emptyFields) return res.render("admin/users/login", emptyFields);
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.render("admin/users/login", {
        user: req.body,
        error: "Usuário não cadastrado!",
      });
    const passed = await compare(password, user.password);
    if (!passed)
      return res.render("admin/users/login", {
        user: req.body,
        error: "Por favor, insira corretamente sua senha!",
      });
    req.user = user;
    next();
  },
  async forgot(req, res, next) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.render("admin/users/forgot-password", {
          email,
          error: "Email não cadastrado",
        });
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
    }
  },
  async reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body;
    try {
      const emptyFields = verifyForm(req.body);
      if (emptyFields)
        return res.render("admin/users/reset-password", {
          data: emptyFields.user,
          error: emptyFields.error,
          token,
        });
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.render("admin/users/reset-password", {
          data: req.body,
          token,
          error: "Email não cadastrado",
        });

      if (password !== passwordRepeat)
        return res.render("admin/users/reset-password", {
          data: req.body,
          token,
          error: "Senhas diferentes!",
        });

      if (token != user.reset_token)
        return res.render("admin/users/reset-password", {
          data: req.body,
          token,
          error: "Token inválido! Solicite uma nova recuperação de senha.",
        });

      let now = new Date();
      now = now.setHours(now.getHours());

      if (now > user.reset_token_expires)
        return res.render("admin/users/reset-password", {
          data: req.body,
          token,
          error: "Token expirado! Solicite uma nova recuperação de senha.",
        });

      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      if (err)
        return res.render("admin/users/password-reset", {
          data: req.body,
          token: req.query.token,
          error: "Erro inesperado, tente novamente!",
        });
    }
  },
};
