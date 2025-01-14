# webpro_06
## このプログラムについて
## ファイル一覧
ファイル名 | 説明
-|-
app5.js | プログラム本体
public/janken.html | じゃんけんの開始画面
views/janken.ejs | じゃんけんのテンプレートファイル
public/number-guess.html | 数当てゲームの開始画面
views/number-guess.ejs | 数当てゲームのテンプレート
views/timer-game,ejs | 反射神経測定の開始画面,テンプレートファイル

サーバーの起動方法
```javascript
node app5.js
```
をターミナルで入力する.
サーバーを開いた後にwebブラウザでそれぞれ
```javascript
localhost:8080/janken
localhost:8080/number-guess
localhost:8080/timer-game
```
を開く.
## プログラムの説明
じゃんけんのプログラムでは,ユーザーが選んだ手に対して,サーバー側でコンピュータがランダムに手を決定し,その勝敗を判定する.勝敗に応じて,勝ち数や試行回数を更新し,その結果を画面に表示するといったプログラムである.  
数当てゲームのプログラムでは,ユーザーが入力した予想の数をもとに,コンピュータがランダムに生成した正解の数と比較する.予想が正解であれば,正解.小さければ,もっと大きい数です.大きければ,もっと小さい数です.という返答をする.ユーザーには試行回数も表示され,ゲームを繰り返すたびに試行回数がカウントされていくといったプログラムである.  
反射神経測定のプログラムでは,ユーザーが反応ボタンをクリックした瞬間と,ボタンが表示された瞬間のタイムスタンプの差を計算して反応速度を求める.測定された反応時間は,秒単位で表示され,小数点以下3桁まで表示されるといったプログラムである.  
## 各機能のプログラムのフローチャート
じゃんけんのフローチャート
```mermaid
flowchart TD;
A[ユーザーが手を選ぶ] --> B[勝敗の判定のためにCPUの手をランダムに選ぶ];
    B --> C{ユーザーの手とCPUの手が同じか?};
    C -- はい --> D[引き分け];
    C -- いいえ --> E{ユーザーが勝つ条件か?};
    E -- はい --> F[勝ち];
    E -- いいえ --> G[負け];
    D --> H[勝敗を表示];
    F --> H;
    G --> H;
    H --> I[勝ち数を更新];
    I --> J[総試合数を更新];
    J --> K[結果を表示];
    K --> L[結果を画面に表示];
    L --> M[次の対戦が可能];
```
数当てゲームのフローチャート
```mermaid
flowchart TD;
A[プレイヤーが予想する数を入力] --> B{予想値が入力されているか?}
    B -- いいえ --> C[ゲーム開始画面を表示]
    B -- はい --> D[ランダムな数1~100を生成]
    D --> E{予想値とランダムな数が一致するか?}
    E -- はい --> F[正解！おめでとう！]
    E -- いいえ --> G{予想値 < ランダムな数?}
    G -- はい --> H[もっと大きい数です！]
    G -- いいえ --> I[もっと小さい数です！]
    F --> J[試行回数を1回増やす]
    H --> J
    I --> J
    J --> K[結果、メッセージ、試行回数、正しい数を表示]
    K --> L[次の予想が可能]
```
反射神経測定機能のフローチャート
```mermaid
flowchart TD;
    A[ゲーム開始ボタンをクリック] --> B[スタートボタンを無効化];
    B --> C[反応ボタンを非表示にする];
    C --> D[ランダムな遅延時間2〜5秒を設定];
    D --> E[遅延後に反応ボタンを表示];
    E --> F[タイムスタンプ startTime を記録];
    F --> G[反応ボタンが表示されたことを表示];
    G --> H[ユーザーが反応ボタンをクリック];
    H --> I[クリック時にタイムスタンプendTimeを記録];
    I --> J[反応速度を計算 endTime - startTime];
    J --> K[反応速度を画面に表示];
    K --> L[スタートボタンを再び有効化];
    L --> M[反応ボタンを非表示];
    M --> N[ゲームが終了];
```
