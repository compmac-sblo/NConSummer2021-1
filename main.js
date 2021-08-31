// Moduleの読込
import * as test from './Module/ModuleTest1.js'


console.log("test");
test.test1();
test.test2();
test.test3();
test.test4();

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


// データをDataBaseに保存
worker.postMessage({'cmd': 'CREATE', 'name': DBName, 'msg': ''});
worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': customerData});
worker.postMessage({'cmd': 'ADD', 'name': DBName, 'msg': customerData2});

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
    default:
      break;
  }
}, false);
