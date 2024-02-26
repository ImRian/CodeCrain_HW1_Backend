const commentCtrl = require("../controllers/commentCtrl"); // 댓글 컨트롤러 추가
const router = require("express").Router();

router.route("/").get(commentCtrl.getComments).post(commentCtrl.insertComment);

router.route("/:notice_id").get(commentCtrl.getCommentDetail);
module.exports = router;