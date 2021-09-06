// createDataBase(request, journal)
// addData(request, journal)
// readData(request)





function createDataBase(request, journal, keyPath, indexArray) {
  request.addEventListener('upgradeneeded', function(event) {
      
    self.postMessage({'cmd': 'success', 'msg': 'DB作成成功'});
    self.postMessage({'cmd': 'success', 'msg': journal});
    const db = event.target.result;
    
    // 情報を保存する objectStore を作成します。
    // "idNum" は一意であることが保証されていますので、キーパスとして使用します。
    const objectStore = db.createObjectStore("accountBook", { keyPath: keyPath });
    self.postMessage({'cmd': 'success', 'msg': 'KeyPath作成成功'});
    self.postMessage({'cmd': 'success', 'msg': keyPath });
    self.postMessage({'cmd': 'success', 'msg': indexArray });
    // 名前やcodeで検索するためのインデックスを作成します。
    // 重複する可能性がありますので、一意のインデックスとしては使用できません。
    if(Array.isArray(indexArray)){
      for (let index = 0; index < indexArray.length; index++) {
        objectStore.createIndex(indexArray[index], indexArray[index], { unique: false });
    }
    } else {
      objectStore.createIndex(indexArray, indexArray, { unique: false });
    }
    // データを追加する前に objectStore の作成を完了させるため、
    // transaction oncomplete を使用します。
//        objectStore.transaction.oncomplete = function(event) {
      // 新たに作成した objectStore に値を保存します。
//          const customerObjectStore = db.transaction("accountBook", "readwrite").objectStore("accountBook");
//          journal.forEach(function(customer) {
//            self.postMessage({'cmd': 'customer', 'msg': customer});
//            customerObjectStore.add(customer);
//          });
//        };
    //db.close();
    self.postMessage({'cmd': 'success', 'msg': 'データベースに保存成功'});
  });
}



function addData(request, journal) {
  request.addEventListener('success', function(event){
    const db = event.target.result;
    // データの挿入(上書きは出来ない)
    const ObjectStore = db.transaction("accountBook", "readwrite")
                                  .objectStore("accountBook");
      journal.forEach(function(customer) {
        self.postMessage({'cmd': 'customer', 'msg': customer});
        ObjectStore.add(customer);
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
    const customerObjectStore = db.transaction("accountBook", "readonly")
                                  .objectStore("accountBook");
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