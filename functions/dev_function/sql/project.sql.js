const { formatRequestBody } = require('./helper');

const getProjectsSQL =
  // 'SELECT PROJECT.*,PROFILE.* FROM PROJECT JOIN PROFILE ON PROJECT.user_id = PROFILE.ROWID';
  'SELECT PROJECT.description,PROJECT.user_id,PROJECT.ROWID,PROJECT.user_id,PROJECT.media,PROFILE.username,PROFILE.media,PROJECT.CREATEDTIME,COUNT(LIKES.ROWID) FROM PROJECT JOIN PROFILE ON PROJECT.user_id = PROFILE.ROWID LEFT JOIN LIKES ON LIKES.project_id=PROJECT.ROWID GROUP BY PROJECT.description,PROJECT.ROWID,PROJECT.user_id,PROJECT.media,PROFILE.username,PROFILE.media,PROJECT.CREATEDTIME,PROJECT.user_id ORDER BY PROJECT.CREATEDTIME DESC';

const getUserProj = (userId) =>
  `SELECT PROJECT.description,PROJECT.user_id,PROJECT.ROWID,PROJECT.user_id,PROJECT.media,PROFILE.username,PROFILE.media,PROJECT.CREATEDTIME,COUNT(LIKES.ROWID) FROM PROJECT JOIN PROFILE ON PROJECT.user_id = PROFILE.ROWID LEFT JOIN LIKES ON LIKES.project_id=PROJECT.ROWID WHERE PROJECT.user_id='${userId}' GROUP BY PROJECT.description,PROJECT.ROWID,PROJECT.user_id,PROJECT.media,PROFILE.username,PROFILE.media,PROJECT.CREATEDTIME,PROJECT.user_id`;

const getProjectByIdSQL = (projectId) =>
  `${getProjectsSQL} WHERE ROWID=${projectId}`;

const getProjectSQL = (projectId, userId = '9044000000014072') =>
  `SELECT * FROM PROJECT WHERE ROWID='${projectId}' AND user_id='${userId}'`;

const searchProjectSQL = (title, tags) =>
  `SELECT PROJECT.description,PROJECT.user_id,PROJECT.ROWID,PROJECT.user_id,PROJECT.media,PROJECT.project_title,
  PROFILE.username,PROFILE.media,PROJECT.CREATEDTIME,COUNT(LIKES.ROWID) FROM PROJECT 
  JOIN PROFILE ON PROJECT.user_id = PROFILE.ROWID LEFT 
  JOIN LIKES ON LIKES.project_id=PROJECT.ROWID 
  WHERE ${title ? `project_title LIKE '*${title}*'` : ''} ${
    tags && title ? 'OR' : ''
  } ${tags ? `tags LIKE '*${tags}*'` : ''}
  GROUP BY PROJECT.project_title,PROJECT.description,PROJECT.ROWID,PROJECT.user_id,PROJECT.media,PROFILE.username,PROFILE.media,PROJECT.CREATEDTIME,PROJECT.user_id`;

const updateProjectSQL = (projectId, body, userId = '9044000000014072') =>
  `UPDATE PROJECT SET ${formatRequestBody(
    body
  )} WHERE ROWID='${projectId}' AND user_id='${userId}'`;

const deleteProjectSQL = (projectId, userId = '9044000000014072') =>
  `DELETE FROM PROJECT WHERE ROWID='${projectId}' AND user_id='${userId}'`;

module.exports = {
  getProjectsSQL,
  getUserProj,
  getProjectByIdSQL,
  updateProjectSQL,
  getProjectSQL,
  deleteProjectSQL,
  searchProjectSQL,
};
