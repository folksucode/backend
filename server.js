const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/cover')
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const uploadcover = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15 // 15 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and JPG files are allowed!'), false);
        }
    }
}).single('cover');

const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// const conn = mysql.createConnection({
//     host: "localhost",
//     port: 3307,
//     user: "root",
//     password: "",
//     database: "prototype",
// });

// conn.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return;
//     }
//     console.log('Connected to the database');
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
    res.send('Hello, API!');
});

app.post('/uploadcover', (req, res) => {
    uploadcover(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ msg: err.message });
        } else if (err) {
            return res.status(400).json({ msg: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'No file selected!' });
        }

        res.json({
            msg: 'File uploaded',
            file: `uploads/cover/${req.file.filename}`
        });
    });
});

