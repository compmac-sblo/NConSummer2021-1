// createDataBase(request, journal)
// addData(request, journal)
// readData(request)





function createDataBaseObjectStore(request, journal, keyPath, indexArray, db) {
  // 情報を保存する objectStore を作成します。
  const objectStore = db.createObjectStore("accountBook", { keyPath: keyPath });
  console.log('KeyPath作成成功-DBTools');
  console.log(keyPath);
  console.log(indexArray);

  // 検索するためのインデックスを作成します。
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
  //objectStore.transaction.oncomplete = function(event) {
  //  db.close();
  //}
  console.log('データベースにobjectStoreとKeyPath、indexの成功');
}



function addData(db, journal) {
  // データの挿入(上書きは出来ない)
  const ObjectStore = db.transaction("accountBook", "readwrite")
                        .objectStore("accountBook");
  journal.forEach(function(journals) {
    console.log(journals);
    self.postMessage({'cmd': 'add', 'msg': journals});
    const request = ObjectStore.add(journals);
    request.addEventListener('error', function (e) {
      console.log('データベースに追記失敗');
      self.postMessage({'cmd': 'error', 'msg': 'データベースに追記が失敗しました'});
    });
    request.addEventListener('success', function (e) {
      console.log('データベースに追記成功');
    });
  });
  db.close();
}

function putData(db, journal) {
  // データの更新
  const ObjectStore = db.transaction("accountBook", "readwrite")
                        .objectStore("accountBook");
  console.log(journal[0].idNum);
  const request = ObjectStore.get(journal[0].idNum);
  request.addEventListener('error', function (e) {
    console.log("更新エラー:そのidNumはDBにありません。");
    self.postMessage({'cmd': 'error', 'msg': '更新エラー:そのidNumはDBにありません。'});
  });
  request.addEventListener('success', function (e) {
    const request = ObjectStore.put(journal[0]);
    request.addEventListener('success', function (e) {
      console.log("更新が成功");
    });
  });
  db.close();
}

function searchData(db, journal) {
  
}


function readData(db) {
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
  console.log('データベースに保存成功');
}