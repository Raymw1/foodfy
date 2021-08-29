const { verifyForm } = require("../../lib/utils");
const Chef = require("../model/Chef");
const chefServices = require("../services/chefServices");

module.exports = {
  post(req, res, next) {
    const emptyFields = verifyForm(req.body);
    const data = { chef: emptyFields?.user, error: emptyFields?.error };
    const noImage = req.files.length === 0;
    if (emptyFields) return res.render("admin/chefs/create", { ...data });
    if (noImage)
      return res.render("admin/chefs/create", {
        chef: req.body,
        error: "Insira pelo menos uma imagem!",
      });
    next();
  },
  async put(req, res, next) {
    const emptyFields = verifyForm(req.body);
    let chef = await Chef.find(req.body.id);
    chef = await chefServices.getChef(chef);
    if (emptyFields)
      return res.render("admin/chefs/edit", {
        chef,
        error: emptyFields?.error,
      });
    if (req.body.removed_files.length >= 1 && !req.files?.length >= 1)
      return res.render("admin/chefs/edit", {
        chef,
        error: "Insira pelo menos uma imagem!",
      });
    next();
  },
  async delete(req, res, next) {
    const chef = await Chef.find(req.body.id);
    if (!chef)
      return res.render("admin/chefs/index", {
        chefs: await chefServices.getChefs(await Chef.findAll()),
        error: "Chef não encontrado",
      });
    const errorDelete = chef.total_recipes > 0;
    const blockDelete = errorDelete;
    if (errorDelete)
      return res.render("admin/chefs/edit", {
        chef,
        blockDelete,
        error: "Você não pode deletar este chef, ele possui mais de 1 receita!",
      });
    next();
  },
};
