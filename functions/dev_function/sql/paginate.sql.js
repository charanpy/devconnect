const paginateSQL = (tableName, limit = 10, offset = 0, clauses = null) => {
  return `SELECT * FROM ${tableName} ${
    clauses || ''
  } LIMIT ${limit} OFFSET ${offset}`;
};

module.exports = {
  paginateSQL,
};
