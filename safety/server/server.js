const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const socketIo = require('socket.io');
const http = require('http').createServer(app);

const io = socketIo(http, {
  cors: {
    origin: "http://localhost:3000", // 클라이언트의 주소
    methods: ["GET", "POST"],
    credentials: true
  }
});


const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트의 주소
  credentials: true,
};

app.use(cors(corsOptions));


io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('newReport', (report) => {
    // 데이터를 DB에 저장하는 코드

    // 저장된 데이터를 모든 클라이언트에게 브로드캐스트
    io.emit('reportUpdate', report);
  });
});

const apiRouter = require('./api');

http.listen(8080, function () {
  console.log('listening port 8080');
});

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', apiRouter);

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_PASSWORD,
  database: 'safety',
  port: '3306'
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.post('/submit-report', (req, res) => {
  const { latitude, longitude, reportText } = req.body;
  
  const query = `INSERT INTO reports (latitude, longitude, reportText) VALUES (?, ?, ?)`;
  db.query(query, [latitude, longitude, reportText], (error, results) => {
    if (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'An error occurred while saving data' });
    } else {
      console.log('Data saved successfully');
      res.json({ message: 'Data saved successfully' });
    }
  });
});

app.get('/get-reports', (req, res) => {
  const query = `SELECT * FROM reports`;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

process.on('SIGINT', () => {
  db.end();
  process.exit();
});
