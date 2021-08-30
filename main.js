import * as test from './ModuleTest1.js'


console.log("test");
test.test1();
test.test2();
test.test3();
test.test4();

console.log("worker");
const worker = new Worker('WorkerTest.js');

worker.addEventListener('message', function(e) {
  console.log('Worker said: ', e.data);
}, false);

worker.postMessage('Hello World');
worker.postMessage({ 'cmd': 'TEST', 'msg': 'msg' });


if (!window.indexedDB) {
  window.console.log("このブラウザーは安定版の IndexedDB を対応していません。IndexedDB の機能は利用できません。");
}


// 顧客データがどのようなものかを示します
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

const dbName = "the_name";

let request = indexedDB.open(dbName, 2);

request.onerror = function(event) {
  // エラー処理
  console.log("データベースの作成失敗");
};
request.onupgradeneeded = function(event) {
  console.log("DB作成成功");
  let db = event.target.result;
  console.log(db);
  // 顧客の情報を保存する objectStore を作成します。
  // "ssn" は一意であることが保証されていますので、キーパスとして使用します。
  // あるいは少なくとも、キックオフミーティングで言われたことです。
  let objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

  // 顧客を名前で検索するためのインデックスを作成します。
  // 重複する可能性がありますので、一意のインデックスとしては使用できません。
  objectStore.createIndex("name", "name", { unique: false });

  // 顧客をメールアドレスで検索するためのインデックスを作成します。2 人の顧客が同じメールアドレスを
  // 使用しないようにしたいので、一意のインデックスを使用します。
  objectStore.createIndex("email", "email", { unique: true });

  // データを追加する前に objectStore の作成を完了させるため、
  // transaction oncomplete を使用します。
  objectStore.transaction.oncomplete = function(event) {
    // 新たに作成した objectStore に値を保存します。
    let customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
    customerData.forEach(function(customer) {
      console.log(customer);
      customerObjectStore.add(customer);
    });
  };
};