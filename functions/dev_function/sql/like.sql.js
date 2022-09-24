const getLikeSQL = (type, userId, key, value) =>
  `SELECT * FROM LIKES WHERE user_id='${userId}' AND type='${type}' AND ${key}='${value}'`;

const deleteLikeSQL = (value, userId = '9044000000014072', type = 'POST') =>
  `DELETE FROM LIKES WHERE ${type}='${value}' AND user_id='${userId}'`;

const getLikesSQL = (type, id) =>
  `SELECT PROFILE.username,PROFILE.email FROM LIKES JOIN PROFILE ON LIKES.user_id = PROFILE.ROWID WHERE LIKES.${type}='${id}'`;

module.exports = {
  getLikeSQL,
  deleteLikeSQL,
  getLikesSQL,
};
