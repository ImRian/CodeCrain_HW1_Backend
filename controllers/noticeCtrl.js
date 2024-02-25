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
          currentPage: page
        });
      });
    });
  },
  insertNotice: async (req, res) => {
    const { id, title, date_posted } = req.body;
    const sql = `INSERT INTO notices_db.notices (id, title, date_posted) 
                 VALUES ('${id}', '${title}', '${date_posted}');`;

    connection.query(sql, (error, rows) => {
      if (error) throw error;
      res.send(rows);
    });
  },
};

module.exports = noticeCtrl;