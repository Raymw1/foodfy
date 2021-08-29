/* eslint-disable camelcase */
const File = require("../model/File");

async function getImage(file_id) {
  const image = await File.find(file_id);
  return {
    id: image?.id,
    name: image?.name,
    src: image?.path.replace("public", ""),
  };
}

module.exports = {
  async getChef(chef) {
    return {
      ...chef,
      image: await getImage(chef.avatar),
    };
  },
  async getChefs(chefs) {
    const chefsPromise = chefs.map(this.getChef);
    return Promise.all(chefsPromise);
  },
};
