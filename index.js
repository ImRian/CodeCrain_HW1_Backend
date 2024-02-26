const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = 4005;

app.listen(port, () => {
  console.log("server listening on port", port);
});

// 프론트에서
app.use("/api/notices", require("./routes/noticeRouter"));
app.use("/api/comments", require("./routes/commentRouter"));