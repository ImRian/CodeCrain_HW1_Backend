const connection = require("../dbConfig");

const commentCtrl = {
  // 댓글 목록 조회
  getComments: async (req, res) => {
    let { page, limit, notice_id } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    let sqlForRows = `SELECT * FROM notices_db.comments `;
    let sqlForCount = `SELECT COUNT(*) AS count FROM notices_db.comments `;

    // 특정 공지사항의 댓글만 필터링하는 조건 추가
    if (notice_id) {
      sqlForRows += `WHERE notice_id = ${connection.escape(notice_id)} `;
      sqlForCount += `WHERE notice_id = ${connection.escape(notice_id)} `;
    }

    sqlForRows += `ORDER BY created_date DESC, created_time DESC LIMIT ${limit} OFFSET ${offset};`;
    sqlForCount += `;`;

    connection.query(sqlForCount, (error, countResult) => {
      if (error)
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      const totalCount = countResult[0].count;

      connection.query(sqlForRows, (error, rows) => {
        if (error)
          return res.status(500).json({ message: "서버 오류가 발생했습니다." });
        res.json({
          comments: rows,
          totalComments: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        });
      });
    });
  },

  // 댓글 추가
  insertComment: async (req, res) => {
    const { notice_id, nickname, comment } = req.body;

    const sql = `INSERT INTO notices_db.comments (notice_id, nickname, comment, created_date, created_time) VALUES (${connection.escape(
      notice_id
    )}, ${connection.escape(nickname)}, ${connection.escape(
      comment
    )}, CURDATE(), CURTIME());`;

    connection.query(sql, (error, result) => {
      if (error) {
        console.error("댓글 추가 중 오류 발생: ", error);
        return res
          .status(500)
          .json({ message: "댓글을 추가하는 데 실패했습니다." });
      }
      res.json({
        message: "댓글이 성공적으로 추가되었습니다.",
        commentId: result.insertId,
      });
    });
  },
  // 댓글 컨트롤러 내에 특정 공지사항의 댓글 조회 기능 추가
  getCommentDetail: async (req, res) => {
    const { notice_id } = req.params; // URL에서 notice_id 추출
    const sql = `SELECT * FROM notices_db.comments WHERE notice_id = ${connection.escape(
      notice_id
    )} ORDER BY created_date DESC, created_time DESC;`;

    connection.query(sql, (error, results) => {
      if (error)
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      res.json({ comments: results });
    });
  },
};

module.exports = commentCtrl;
