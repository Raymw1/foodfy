const User = require("../../model/User");

module.exports = {
  show(req, res) {
    const { user } = req;
    return res.render("admin/profile/index", { user });
  },
  async update(req, res) {
    try {
      const { name, email } = req.body;
      const id = await User.update(req.user.id, { name, email });
      req.user = await User.find(id);
      return res.render("admin/profile/index", {
        user: req.user,
        success: "Usuário atualizado com sucesso!",
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
