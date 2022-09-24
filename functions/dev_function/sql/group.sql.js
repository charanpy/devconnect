const getPublicGroupSQL = (user1, user2) =>
  `SELECT * FROM GROUPS WHERE (user1='${user1}' AND user2='${user2}') OR (user1='${user2}' AND user2='${user1}')`;

const checkUserInGroupSQL = (groupId, userId) =>
  `SELECT * FROM GROUPS WHERE ROWID='${groupId}' AND user1='${userId}' OR user2='${userId}'`;

const getGroupMessageSQL = (groupId) =>
  `SELECT * FROM MESSAGE WHERE group_id='${groupId}'`;

const setSeenSQL = (groupId, userId) =>
  `UPDATE MESSAGE SET seen=true WHERE group_id='${groupId}' AND receiver='${userId}'`;

const messageNotificationSQL = (groupId, userId) =>
  `SELECT * FROM MESSAGE WHERE group_id='${groupId}' AND receiver='${userId}'`;

const getUserMessageSQL = (groupId, userId) =>
  `SELECT * FROM MESSAGE WHERE ROWID='${groupId}' AND user_id='${userId}'`;

const deleteMessageSQL = (messageId) =>
  `DELETE FROM MESSAGE WHERE ROWID='${messageId}'`;
module.exports = {
  getPublicGroupSQL,
  checkUserInGroupSQL,
  getGroupMessageSQL,
  setSeenSQL,
  messageNotificationSQL,
  getUserMessageSQL,
  deleteMessageSQL,
};
