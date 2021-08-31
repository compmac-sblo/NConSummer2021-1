
// main.jsからのpostMessageを受取る
self.addEventListener('message', function(e) {
  let cmd = e.data.cmd;
  //  self.postMessage(e.data);

  // DBの名前
  const dbName = "the_name";
  // 受取ったDataを変数に格納
  const customerData = e.data.msg;
  // DBに接続、または無い場合には新規作成
  let request = indexedDB.open(dbName, 2);

  // DBの作成に失敗した場合
  request.onerror = function(event) {
    // エラー処理
    self.postMessage({'cmd': 'error', 'msg': 'データベースの作成・接続に失敗'});
    };

  switch (cmd) {
    case "TEST":
      self.postMessage({'cmd': 'TEST', 'msg': e.data.msg});
      break;
    case "DB":
      
      // DB作成成功後の処理
      request.onupgradeneeded = function(event) {
      
        self.postMessage({'cmd': 'success', 'msg': 'DB作成成功'});
        self.postMessage({'cmd': 'success', 'msg': customerData});
        const db = event.target.result;
        
        // 顧客の情報を保存する objectStore を作成します。
        // "ssn" は一意であることが保証されていますので、キーパスとして使用します。
        // あるいは少なくとも、キックオフミーティングで言われたことです。
        const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
      
        // 顧客を名前で検索するためのインデックスを作成します。
        // 重複する可能性がありますので、一意のインデックスとしては使用できません。
        objectStore.createIndex("name", "name", { unique: false });
      
        // 顧客をメールアドレスで検索するためのインデックスを作成します。2 人の顧客が同じメールアドレスを
        // 使用しないようにしたいので、一意のインデックスを使用します。
        objectStore.createIndex("email", "email", { unique: true });
      
        // データを追加する前に objectStore の作成を完了させるため、
        // transaction oncomplete を使用します。
//        objectStore.transaction.oncomplete = function(event) {
          // 新たに作成した objectStore に値を保存します。
//          const customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
//          customerData.forEach(function(customer) {
//            self.postMessage({'cmd': 'customer', 'msg': customer});
//            customerObjectStore.add(customer);
//          });
//        };
        //db.close();
      };
      self.postMessage({'cmd': 'success', 'msg': 'データベースに保存成功'});
      break;
    case "DB2":
      // 接続に成功したら
      request.onsuccess = function(event){
        const db = event.target.result;

        const customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
          customerData.forEach(function(customer) {
            self.postMessage({'cmd': 'customer', 'msg': customer});
            customerObjectStore.add(customer);
          });
          db.close();
      };
      this.self.postMessage({'cmd': 'success', 'msg': 'データの保存成功'});
      break;
    default:
      break;
  };
  
}, false);