const { compare } = require("bcryptjs");

const User = require("../model/User");
const { verifyForm } = require("../../lib/utils");

module.exports = {
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    if (emptyFields)
      return res.render("admin/profile/index", { ...emptyFields });
    const { email, password } = req.body;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat))
      return res.render("admin/profile/index", {
        user: { ...req.body },
        error: "Insira um email válido",
      });
    const { userId: id } = req.session;
    let user = await User.findOne({ where: { email }, "and not": { id } });
    if (user)
      return res.render("admin/profile/index", {
        user: { ...req.body },
        error: "Email já cadastrado!",
      });
    user = await User.find(id);
    const passed = await compare(password, user.password);
    if (!passed)
      return res.render("admin/profile/index", {
        user: { ...req.body },
        error: "Por favor, insira corretamente sua senha!",
      });
    req.user = user;
    next();
  },
};
