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
  objectStore.transaction.oncomplete = function(event) {
    console.log('データベースの作成完了');
  }
  console.log('データベースにobjectStoreとKeyPath、indexの成功');
}

function addData(objectStore, journal) {
  // データの追記(上書きは出来ない)
  const ObjectStore = objectStore;
  let result;
  journal.forEach( journals => {
    console.log(journals);
    const request = ObjectStore.add(journals);
    if(request) { result = true; }
    else { return false; }
  });
  return result;
}

function putData(objectStore, journal) {
  // データの更新
  const ObjectStore = objectStore;
  console.log(journal[0].idNum);
  const request = ObjectStore.get(journal[0].idNum);
  request.addEventListener('error', function (e) {
    console.log("更新エラー:そのidNumはDBにありません。");
    //self.postMessage({'cmd': 'error', 'msg': '更新エラー:そのidNumはDBにありません。'});
  });
  request.addEventListener('success', function (e) {
    const request = ObjectStore.put(journal[0]);
    request.addEventListener('success', function (e) {
      console.log("更新が成功");
    });
  });
}

function findData(objectStore, journal) {
  const ObjectStore = objectStore;
}


function readData(objectStore) {
  const ObjectStore = objectStore;
  ObjectStore.openCursor()
              .addEventListener('success', function (event) {
    const cursor = event.target.result;
    if (cursor) {
      //self.postMessage({'cmd': 'read', 'msg': [cursor.key, cursor.value.name]});
      cursor.continue();
    } else {
    }
  });
  console.log('データベースから読出し成功');
}