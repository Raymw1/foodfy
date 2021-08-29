const { verifyForm } = require("../../lib/utils");
const User = require("../model/User");
const { checkIfIsAdminToCreate } = require("../middlewares/session");

module.exports = {
  async show(req, res, next) {
    const { userId: id } = req.session;
    const user = await User.find(id);
    if (!user)
      return res.render("admin/users/create", {
        error: "Usuário não encontrado!",
      });
    req.user = user;
    next();
  },
  async post(req, res, next) {
    const emptyFields = verifyForm(req.body);
    await checkIfIsAdminToCreate(req, res, () => {});
    if (emptyFields)
      return res.render("admin/users/create", {
        data: emptyFields.user,
        error: emptyFields.error,
      });
    const { name, email, password, passwordRepeat } = req.body;
    const data = { name, email };
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat))
      return res.render("admin/users/create", {
        data,
        error: "Insira um email válido",
      });
    const user = await User.findOne({ where: { email } });
    if (user)
      return res.render("admin/users/create", {
        data,
        error: "Email já cadastrado!",
      });
    if (password !== passwordRepeat)
      return res.render("admin/users/create", {
        data,
        error: "Senhas diferentes, tente novamente!",
      });
    next();
  },
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    let data = {
      data: { ...emptyFields?.user, id: req.params.id },
      error: emptyFields?.error,
    };
    if (emptyFields) return res.render("admin/users/edit", { ...data });
    const { email } = req.body;
    data = { ...req.body, id: req.params.id };
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat))
      return res.render("admin/users/edit", {
        data,
        error: "Insira um email válido",
      });
    const user = await User.findOne({
      where: { email },
      "and not": { id: req.params.id },
    });
    if (user)
      return res.render("admin/users/edit", {
        data,
        error: "Email já cadastrado!",
      });
    next();
  },
};
