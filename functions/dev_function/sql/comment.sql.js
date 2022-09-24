const getComment = (type, id) =>
  `SELECT COMMENT.*,PROFILE.media,PROFILE.username FROM COMMENT
    JOIN PROFILE ON COMMENT.user_id=PROFILE.ROWID
    WHERE ${type}='${id}'
`;

module.exports = {
  getComment,
};
