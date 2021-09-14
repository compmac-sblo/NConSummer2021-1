// createDataBaseObjectStore(request, journal, keyPath, indexArray, db)
// addData(objectStore, journal)
// putData(objectStore, journal)
// findData(objectStore, journal)
// readData(objectStore)



// 情報を保存する objectStore を作成します。
function createDataBaseObjectStore(request, journal, keyPath, indexArray, db) {
  
  const objectStore = db.createObjectStore("accountBook", { keyPath: keyPath });

  //debug用
  //console.log('KeyPath作成成功-DBTools');
  //console.log(keyPath);
  //console.log(indexArray);

  // 検索するためのインデックスを作成します。
  // 重複する可能性がありますので、一意のインデックスとしては使用できません。
  if(Array.isArray(indexArray)){
    for (let index = 0; index < indexArray.length; index++) {
      objectStore.createIndex(indexArray[index], indexArray[index], { unique: false });
  }
  } else {
    objectStore.createIndex(indexArray, indexArray, { unique: false });
  }
  // objectStore の作成を完了させるため、
  // transaction oncomplete を使用します。
  objectStore.transaction.oncomplete = function(event) {
    console.log('データベースの作成完了');
  }
  console.log('データベースにobjectStoreとKeyPath、indexの成功');
}


// データの追記(上書きは出来ない)
function addData(objectStore, journal) {
  
  const ObjectStore = objectStore;
  let result;

  journal.forEach( journals => {

    //debug用
    //console.log(journals);

    const request = ObjectStore.add(journals);

    if(request) { result = true; }
    else { return false; }
  });
  return result;
}

// データの更新
function putData(objectStore, journal) {
  
  const ObjectStore = objectStore;
  let result;

  journal.forEach( journals => {

    //debug用
    //console.log(journals.idNum);

    // 更新するidNumをDataBaseから取得
    const request = ObjectStore.get(journals.idNum);

    if(request) { 
      // DataBaseを更新
      const request2 = ObjectStore.put(journals);
      if(request2) { result = true; }
      else { return false; }
    } else { return false; }
  });
  return result;
}

function findData(objectStore, journal) {
  const ObjectStore = objectStore;
}

// 全データの読出し
function readData(objectStore) {
  const ObjectStore = objectStore;
  console.log('読出し開始');
  return new Promise((resolve, reject) => {
    try {
      ObjectStore.getAll()
                  .addEventListener('success', function (event) {
        console.log("Got all customers: " + event.target.result);
        console.log(event.target.result); 
        resolve(event.target.result);
      });
    } catch(error) {
        reject();
      }
  });
}