// server.js
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const DATA_FILE = 'mbti_results.json';

app.use(cors());
app.use(bodyParser.json());

// โหลดข้อมูล
function loadResults() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// บันทึกข้อมูล
function saveResults(results) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
}

app.post('/submit', (req, res) => {
  const { nickname, mbti } = req.body;
  const results = loadResults();
  results.push({ nickname, mbti });
  saveResults(results);

  const stats = results.reduce((acc, curr) => {
    acc[curr.mbti] = (acc[curr.mbti] || 0) + 1;
    return acc;
  }, {});
  res.json({ message: 'บันทึกสำเร็จ', stats });
});

app.get('/stats', (req, res) => {
  const results = loadResults();
  res.json({ total: results.length, results });
});

app.listen(3000, () => console.log('Server running on port 3000'));
