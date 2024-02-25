const noticeCtrl = require("../controllers/noticeCtrl");
const router = require("express").Router();

// apinotices/
router.route("/").get(noticeCtrl.getNotices).post(noticeCtrl.insertNotice);
module.exports = router;
