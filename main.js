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
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];
const customerData2 = [
  { ssn: "666-44-4444", name: "Any", age: 35, email: "any@company.com" },
  { ssn: "777-55-5555", name: "June", age: 32, email: "june@home.org" }
];


// DataBaseにストアを作成
worker.postMessage({'cmd': 'CREATE', 'name': DBName, 'msg': ''});
// データをDataBaseに保存
worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': customerData});
worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': customerData2});
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
    const test = parseInt(name[0].value);
    console.log(test);
    if (isNaN(test)) {
      console.log("数値以外");
      return ;
    }
    console.log("続く");
    // DBに追記
    //worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': customerData2});

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