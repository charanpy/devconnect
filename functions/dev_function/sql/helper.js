const addComma = (index, length) => (index < length - 1 ? ',' : '');

const formatRequestBody = (body) => {
  const keys = body ? Object.keys(body) : [];

  let data = '';
  keys.forEach((col, index) => {
    data += `${col}='${body[col]}'${addComma(index, keys.length)}`;
  });

  return data;
};

const updateQuerySQL = (
  table,
  value,
  body,
  key = 'ROWID',
  userId = '9044000000014072'
) =>
  `UPDATE ${table} SET ${formatRequestBody(
    body
  )} WHERE ${key}='${value}' AND user_id='${userId}'`;

const selectQuerySQL = (table, rowId, userId = '9044000000014072') =>
  `SELECT * FROM ${table} WHERE ROWID='${rowId}' AND user_id='${userId}'`;

const deleteQuerySQL = (table, rowId, userId = '9044000000014072') =>
  `DELETE FROM ${table} WHERE ROWID='${rowId}' AND user_id='${userId}'`;
module.exports = {
  formatRequestBody,
  updateQuerySQL,
  selectQuerySQL,
  deleteQuerySQL,
};
