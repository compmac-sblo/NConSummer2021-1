self.addEventListener('message', function(e) {
  let cmd = e.data.cmd;
//  self.postMessage(e.data);
  switch (cmd) {
    case "TEST":
      self.postMessage({'cmd': 'TEST', 'msg': e.data.msg});
      break;
    case "DB":
      const dbName = "the_name";
      const customerData = e.data.msg;
      let request = indexedDB.open(dbName, 2);
      request.onerror = function(event) {
        // エラー処理
        self.postMessage({'cmd': 'error', 'msg': 'データベースの作成失敗'});
      };
      request.onupgradeneeded = function(event) {
        self.postMessage({'cmd': 'success', 'msg': 'DB作成成功'});
        self.postMessage({'cmd': 'success', 'msg': customerData});
        let db = event.target.result;
        
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
            self.postMessage({'cmd': 'customer', 'msg': customer});
            customerObjectStore.add(customer);
          });
        };
      };
      this.self.postMessage({'cmd': 'success', 'msg': 'データベースに保存成功'});
      break;

    default:
      break;
  }
}, false);