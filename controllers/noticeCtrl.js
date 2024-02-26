const connection = require("../dbConfig");

const noticeCtrl = {
  getNotices: async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 4;
    const offset = (page - 1) * limit;

    const sqlForRows = `SELECT * FROM notices_db.notices LIMIT ${limit} OFFSET ${offset};`;
    const sqlForCount = `SELECT COUNT(*) AS count FROM notices_db.notices;`;

    // 총 공지사항 수를 조회하는 쿼리
    connection.query(sqlForCount, (error, countResult) => {
      if (error) throw error;
      const totalCount = countResult[0].count;

      // 공지사항 목록을 조회하는 쿼리
      connection.query(sqlForRows, (error, rows) => {
        if (error) throw error;
        res.json({
          notices: rows,
          totalNotices: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        });
      });
    });
  },
  insertNotice: async (req, res) => {
    // 여기서 content, likes, posted_time을 추가로 추출합니다.
    const { id, title, date_posted, content, likes, posted_time } = req.body;

    // 이제 SQL 쿼리에도 content, likes, posted_time 값을 포함합니다.
    const sql = `INSERT INTO notices_db.notices (id, title, date_posted, content, likes, posted_time) 
                 VALUES ('${id}', '${title}', '${date_posted}', '${content}', ${likes}, '${posted_time}');`;

    connection.query(sql, (error, rows) => {
      if (error) throw error;
      res.send(rows);
    });
  },
  getNoticeDetail: async (req, res) => {
    const { noticeId } = req.params; // URL에서 공지사항 ID를 추출
    const sql = `SELECT * FROM notices_db.notices WHERE id = ${connection.escape(
      noticeId
    )};`;

    connection.query(sql, (error, result) => {
      if (error) {
        return res.status(500).send("서버 오류가 발생했습니다.");
      }
      if (result.length > 0) {
        return res.json(result[0]);
      } else {
        return res.status(404).send("해당 공지사항을 찾을 수 없습니다.");
      }
    });
  },

  updateLikes: async (req, res) => {
    const { noticeId } = req.params; // URL에서 공지사항 ID를 추출
    const { increment } = req.body; // 요청 본문에서 'increment' 값을 추출 (true이면 증가, false이면 감소)

    // '좋아요' 수를 증가시키거나 감소시키는 SQL 쿼리
    const sql = `UPDATE notices_db.notices SET likes = likes ${
      increment ? "+" : "-"
    } 1 WHERE id = ${connection.escape(noticeId)};`;

    connection.query(sql, (error, result) => {
      if (error) {
        return res.status(500).send("서버 오류가 발생했습니다.");
      }
      return res.status(200).send("좋아요 수가 업데이트되었습니다.");
    });
  },
};

module.exports = noticeCtrl;
