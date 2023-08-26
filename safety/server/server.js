const express = require("express");
const app = express();
const port = 3005;
var bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors());

const dbConnection = require("./db.js");
dbConnection.query("SELECT * from record", function (error, results, fields) {
  if (error) throw error;
  console.log("users: ", results);
});

// JSON 파싱 미들웨어 설정
app.use(bodyParser.json());

// 클라이언트에서 보낸 데이터를 받아서 DB에 저장
app.post("/submit-report", (req, res) => {
  const reportText = req.body.reportText;
  console.log("Received report text:", reportText); // 추가된 부분

  // 데이터를 DB에 저장하는 쿼리 실행
  const query = "INSERT INTO record(content) VALUES (?)";

  dbConnection.query(query, [reportText], (error, results) => {
    if (error) {
      console.error("Error saving report to DB:", error);
      res.status(500).json({ error: "Error saving report" });
    } else {
      console.log("Report saved to DB:", results);
      res.status(200).json({ message: "Report saved successfully" });
    }
  });
});

//제보 목록 조회 시 데이터 전달.
app.get("/get-admin-data", (req, res) => {
  const query = "SELECT * FROM record"; // admin_data는 조회하려는 테이블 이름
  console.log("제보 목록 데이터 조회");

  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching admin data:", error);
      res.status(500).json({ error: "Error fetching admin data" });
    } else {
      console.log("Admin data fetched:", results);
      res.status(200).json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
