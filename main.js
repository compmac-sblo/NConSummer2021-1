// Moduleの読込
import * as test from './Module/ModuleTest1.js'


console.log("test");
test.test1();
test.test2();
test.test3();
test.test4();

// DataBaseの名前
let DBName ="the_name";

// indexedDBが使用出来るかどうかの確認
if (!window.indexedDB) {
  window.console.log("このブラウザーは安定版の IndexedDB を対応していません。IndexedDB の機能は利用できません。");
}

// DataBase操作を別スレッドに移す為にWorkerを作成
const worker = new Worker('./Module/WorkerTest.js');

// 顧客データがどのようなものかを示します
const journal = [
  { idNum: 1, date: "2021/09/01", Dr: 111, DrAmount: 1000000, Cr: 900, CrAmount: 1000000, remarksColumn: "現金"},
  { idNum: 2, date: "2021/09/02", Dr: 200, DrAmount: 1000000, Cr: 111, CrAmount: 1000000, remarksColumn: "預入"}
];
const journal2 = [
  { idNum: 3, date: "2021/09/03", Dr: 300, DrAmount: 1000000, Cr: 500, CrAmount: 1000000, remarksColumn: "そのた"},
  { idNum: 4, date: "2021/09/04", Dr: 400, DrAmount: 1000000, Cr: 611, CrAmount: 1000000, remarksColumn: "hoge"}
];


// DataBaseにストアを作成
worker.postMessage({'cmd': 'CREATE', 'name': DBName, 'msg': ''});
// データをDataBaseに保存
worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': journal});
worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': journal2});
// // データをDataBaseから取得
worker.postMessage({'cmd': 'READ', 'name': DBName, 'msg': ''});

// Workerから戻って来たものを分類と実行
worker.addEventListener('message', function(e) {
  console.log('Worker said: ', e.data);
  const cmd = e.data.cmd;
  switch (cmd) {
    case 'TEST':
      console.log(e.data.msg);
      break;
    case 'error':
      console.log(e.data.msg);
      break;
    case 'success':
      console.log(e.data.msg);
      break;
    case 'db':
      console.log(e.data.msg);
      break;
    case 'customer':
      console.log(e.data.msg);
      break;
    case 'read':
      console.log("読出し:" + e.data.msg);
      break;
    default:
      break;
  }
}, false);


// 最後の欄でEnterを押すと仕訳をDBに追記
const enter = document.getElementById("remarksColumn");

enter.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    console.log("Enterが押されました");
    const name = document.getElementsByName("journalEntry");
    console.log(name);

    // idNumを数値変換
    const idNum = parseInt(name[0].value);
    console.log(idNum);
    if (Number.isNaN(idNum)) {
      console.log("数値以外が入っています");
      return ;
    }
    // dateをDateにobj変換
    const data = new Date(name[1].value);
    console.log(data);
    if (!(date instanceof Date)) {
      console.log("日付が不正です");
      return ;
    }


    console.log("続く");
    // DBに追記
    //worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': journal2});

  }
  
});

const button = document.getElementById("button");

button.addEventListener('click', function (e) {
  console.log(button.value);
//  switch (e.value) {
//    case value:
//      
//      break;
//  
//    default:
//      break;
//  }
});