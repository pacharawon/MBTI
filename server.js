const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const DATA_FILE = 'mbti_results.json';

app.use(cors());
app.use(bodyParser.json());

// โหลดข้อมูลจากไฟล์ JSON
function loadResults() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// บันทึกข้อมูลลงไฟล์ JSON
function saveResults(results) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
}

// API บันทึกข้อมูลผู้ใช้
app.post('/submit', (req, res) => {
    let { nickname, mbti } = req.body;
    let results = loadResults();
    results.push({ nickname, mbti });
    saveResults(results);

    // คำนวณสถิติ MBTI
    let stats = results.reduce((acc, user) => {
        acc[user.mbti] = (acc[user.mbti] || 0) + 1;
        return acc;
    }, {});

    res.json({ message: 'บันทึกสำเร็จ', stats });
});

// API ดึงข้อมูลสถิติ
app.get('/stats', (req, res) => {
    let results = loadResults();
    let total = results.length;
    let stats = results.reduce((acc, user) => {
        acc[user.mbti] = (acc[user.mbti] || 0) + 1;
        return acc;
    }, {});
    res.json({ total, stats });
});

app.listen(3000, () => console.log('Server running on port 3000'));
