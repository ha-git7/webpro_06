const express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/luck", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';
  console.log('あなたの運勢は' + luck + 'です');
  res.render('luck', { number: num, luck: luck });
});
app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win)||0;
  let total = Number(req.query.total)||0;
  console.log({ hand, win, total });

  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗の判定
  let judgement = '';
  if (hand === cpu) {
    judgement = '引き分け';
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };
  
  res.render('janken', display);
});
app.get("/number-guess", (req, res) => {
  let playerGuess = req.query.guess;
  let attempts = Number(req.query.attempts) || 0;
  let correctNumber = Math.floor(Math.random() * 100) + 1;  // 1〜100のランダムな数

  let result = '';
  let message = '';
  
  if (playerGuess) {
      if (playerGuess == correctNumber) {
          result = '正解！おめでとう！';
      } else if (playerGuess < correctNumber) {
          result = 'もっと大きい数です！';
      } else {
          result = 'もっと小さい数です！';
      }
      attempts += 1;
  }

  res.render('number-guess', {
      result: result,
      message: message,
      attempts: attempts,
      correctNumber: correctNumber
  });
});
function shufflePuzzle() {
  let puzzle = Array.from({ length: 16 }, (_, index) => index);
  puzzle = shuffleArray(puzzle);
  return puzzle;
}

// 配列をシャッフルするヘルパー関数
function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// パズルが解けたかどうかをチェックする関数
function isSolved(puzzle) {
  return puzzle.every((value, index) => value === index);
}

// ゲームページのルート（スライドパズルの初期化）
app.get('/slide-puzzle', (req, res) => {
  let puzzle = shufflePuzzle();
  res.render('slide-puzzle', { puzzle, isSolved: false });
});

// タイルを移動するエンドポイント
app.get('/move-tile', (req, res) => {
  let index = parseInt(req.query.index, 10);
  let puzzle = req.session.puzzle || shufflePuzzle();

  // 空きスペース（0）のインデックスを取得
  let emptyIndex = puzzle.indexOf(0);

  // 移動可能な場合、タイルをスライド
  if (canMove(index, emptyIndex)) {
      [puzzle[index], puzzle[emptyIndex]] = [puzzle[emptyIndex], puzzle[index]];
  }

  // ゲームが解けたか確認
  let isSolvedFlag = isSolved(puzzle);

  // セッションにパズルを保存
  req.session.puzzle = puzzle;

  // 結果を返す
  res.json({ success: true, isSolved: isSolvedFlag });
});

// タイルが移動可能かどうかを確認する関数
function canMove(index, emptyIndex) {
  const validMoves = [
      -1, 1, -4, 4 // 左右上下に1つ、または4つ（4x4のグリッドのため）
  ];
  const isValidMove = validMoves.some(offset => index === emptyIndex + offset);
  const isSameRow = Math.floor(index / 4) === Math.floor(emptyIndex / 4);
  return isValidMove && isSameRow;
}
const session = require('express-session');
app.use(session({
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.listen(8080, () => console.log("Example app listening on port 8080!"));