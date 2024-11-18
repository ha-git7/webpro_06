const express = require("express");
const app = express();

app.set('view engine', 'ejs');
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
app.get("/timer-game", (req, res) => {
  res.render('timer-game');
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));