/* eslint-disable array-callback-return */
const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "chefs" });

function find(filters) {
  let query = `SELECT chefs.*, count(recipes) AS total_recipes
  FROM chefs LEFT JOIN recipes ON(recipes.chef_id = chefs.id)`;
  if (filters) {
    Object.keys(filters).map((key) => {
      query += ` ${key}`;
      Object.keys(filters[key]).map((field) => {
        query += ` ${field} = '${filters[key][field]}'`;
      });
    });
  }
  query += `GROUP BY chefs.id`;
  return db.query(query);
}

module.exports = {
  ...Base,
  async findAll() {
    const results = await find();
    return results.rows;
  },
  async find(id) {
    const results = await find({ where: { "chefs.id": id } });
    return results.rows[0];
  },
};
