"use strict";
const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path');

// 画像保存の設定
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

let bbs = []; // 投稿を保持する配列（IDとコメントを追加）

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 投稿チェック
app.post("/check", (req, res) => {
    res.json({ number: bbs.length });
});

// 投稿を読む
app.post("/read", (req, res) => {
    const start = Number(req.body.start);
    res.json({ messages: bbs.slice(start) });
});

// 投稿を保存
app.post("/post", upload.single('image'), (req, res) => {
    const name = req.body.name;
    const message = req.body.message;
    const image = req.file ? '/uploads/' + req.file.filename : '';
    const id = bbs.length + 1;
    bbs.push({ id, name, message, image, comments: [] });
    res.json({ number: bbs.length });
});

// 投稿削除
app.post("/delete", (req, res) => {
    const id = Number(req.body.id);
    bbs = bbs.filter(post => post.id !== id);
    res.json({ number: bbs.length });
});

// コメントの追加
app.post("/comment", (req, res) => {
    const postId = Number(req.body.id);
    const comment = req.body.comment;
    const post = bbs.find(post => post.id === postId);
    if (post) {
        post.comments.push(comment);
    }
    res.json({ success: true });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
