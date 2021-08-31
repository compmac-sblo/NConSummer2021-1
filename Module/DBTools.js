// createDataBase(request, customerData)
// addData(request, customerData)
// readData(request)





function createDataBase(request, customerData) {
  request.addEventListener('upgradeneeded', function(event) {
      
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
    self.postMessage({'cmd': 'success', 'msg': 'データベースに保存成功'});
  });
}



function addData(request, customerData) {
  request.addEventListener('success', function(event){
    const db = event.target.result;
    // データの挿入(上書きは出来ない)
    const customerObjectStore = db.transaction("customers", "readwrite")
                                  .objectStore("customers");
      customerData.forEach(function(customer) {
        self.postMessage({'cmd': 'customer', 'msg': customer});
        customerObjectStore.add(customer);
      });
      db.close();
      self.postMessage({'cmd': 'success', 'msg': 'データの保存成功'});
    }
  );
}



function readData(request) {
  request.addEventListener('success', function(event){
    const db = event.target.result;
    // データの挿入(上書きは出来ない)
    const customerObjectStore = db.transaction("customers", "readonly")
                                  .objectStore("customers");
    customerObjectStore.openCursor()
                        .addEventListener('success', function (event) {
      const cursor = event.target.result;
      if (cursor) {
        self.postMessage({'cmd': 'read', 'msg': [cursor.key, cursor.value.name]});
        cursor.continue();
      } else {

      }
    });
    
      db.close();
      self.postMessage({'cmd': 'success', 'msg': 'データの保存成功'});
    }
  );
}