const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "recipes" });

module.exports = {
  ...Base,
  async paginate(params) {
    const { filter, limit, offset } = params;
    let query = "";
    let filterQuery = "";
    let totalQuery = "(SELECT count(*) FROM recipes) AS total";
    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
      totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`;
    }
    query = `
    SELECT recipes.*, ${totalQuery} FROM recipes 
    ${filterQuery}
    ORDER BY recipes.updated_at DESC LIMIT $1 OFFSET $2
    ;`;
    const results = await db.query(query, [limit, offset]);
    return results.rows;
  },
};
