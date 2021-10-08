// class DBobject(dbName, objectStoreName)
// createDataBaseObjectStore(request, journal, keyPath, indexArray, db)
// addData(objectStore, journal)
// putData(objectStore, journal)
// findData(objectStore, journal)
// readData(objectStore)




// DB関係の情報を保持するためのクラス
class DBobject {
  constructor(dbName, objectStoreName) {
    if(typeof(dbName) === "string") {
      this.dbName = dbName || "the_name"; // 空文字対策
    } else { 
      // error 
      console.log('DBobjectの初期化でdbNameに文字列以外を設定しようとしているので、初期値として"the_name"を設定');
      this.dbName = "the_name";
    }
    if(typeof(objectStoreName) === "string") {
      this.objectStoreName = objectStoreName || "accountBook"; // 空文字対策
    } else {
      // error
      console.log('DBobjectの初期化でobjectStoreNameに文字列以外を設定しようとしているので、初期値として"accountBook"を設定');
      this.objectStoreName = "accountBook";
    }
  }

  setDBName(dbName) {
    if(typeof(dbName) === "string") {
      this.dbName = dbName;
    } else { 
      // error 
      console.log('DBobjectのdbNameプロパティに文字列以外を設定しようとしている');
    }
  }
  setObjectStoreName(objectStoreName) {
    if(typeof(objectStoreName) === "string") {
      this.objectStoreName = objectStoreName;
    } else {
      // error
      console.log('DBobjectのobjectStoreNameプロパティに文字列以外を設定しようとしている');
    }
  }
  getDBName() {
    return this.dbName;
  }
  getObjectStoreName() {
    return this.objectStoreName;
  }
}



// 情報を保存する objectStore を作成します。
async function createDataBaseObjectStore(keyPath, indexArray, db, storeName) {

  const objectStore = db.createObjectStore(storeName, { keyPath: keyPath });

  //debug用
  //console.log('KeyPath作成成功-DBTools');
  //console.log(keyPath);
  //console.log(indexArray);

  // 検索するためのインデックスを作成します。
  // 重複する可能性がありますので、一意のインデックスとしては使用できません。
  try {
    if(Array.isArray(indexArray)){
      for (let index = 0; index < indexArray.length; index++) {
        objectStore.createIndex(indexArray[index], indexArray[index], { unique: false });
      }
      console.log('データベースにobjectStoreとKeyPath、indexの成功');
      return;
    } else {
      objectStore.createIndex(indexArray, indexArray, { unique: false });
      console.log('データベースにobjectStoreとKeyPath、indexの成功');
      return;
    }
  } catch (error) {
    throw new Error('')
  }
  
}


/**** 
* @param {IDBDatabase} db
* @param {String} storeName
* @param {Object} journals
****/

// データの追記(上書きは出来ない)
async function addData(db, storeName, journals) {
  console.log('add 開始');
  const transaction = db.transaction(storeName, "readwrite");
  const objectStore = transaction.objectStore(storeName);
  let objectStoreRequest;

  for (let journal of journals){
    objectStoreRequest = objectStore.add(journal);
  }

  transaction.addEventListener('complete' , function (event) {
    console.log("Add all done!");
    //return; // resolve
  });
  transaction.addEventListener('error' , function (event) {
    console.log("AddData Error! transaction");
    transaction.abort(); // ロールバック！
  });
  transaction.addEventListener('abort' , function (event) {
    console.log("AddData Transaction aborted!");
    //throw new Error('AddData Error!');
  });

  objectStoreRequest.addEventListener('success', function (event) {
    console.log('addData Success!');
  });
  objectStoreRequest.addEventListener('error', function (event) {
    console.log('addData Error!');
    transaction.dispatchEvent('error'); 
  });


}


/**** 
* @param {IDBDatabase} db
* @param {String} storeName
* @param {Object} journals
****/

// データの更新
async function putData(db, storeName, param, journals) {
  
  const transaction = db.transaction(storeName, param);
  const objectStore = transaction.objectStore(storeName);
  

  let objectStoreRequest;
  

  journals.forEach( journal => {
    //debug用
    //console.log(journals.idNum);

    // 更新するidNumをDataBaseから取得可能か判定
    if(objectStore.get(journal.idNum)){
      // DataBaseを更新
    objectStoreRequest = objectStore.put(journal);
    }
  });

  transaction.addEventListener('complete' , function(event) {
    console.log("Put all done!");
    return; // resolve
  });
  transaction.addEventListener('error' , function(event) {
    console.log("Put Data Error! transaction");
    transaction.abort(); // ロールバック！
  });
  transaction.addEventListener('abort' , function(event) {
    console.log("Put Data Transaction aborted!");
    throw new Error('Put Data Error!');
  });

  objectStoreRequest.addEventListener('success', function (event) {
    console.log('PutData Success!');
  });
  objectStoreRequest.addEventListener('error', function (event) {
    console.log('PutData Error!');
    transaction.dispatchEvent('error');
  });
}


/**** 
* @param {IDBDatabase} db
* @param {String} storeName
* @param {Object} journals
****/

async function findData(db, storeName, param, journals) {
  const transaction = db.transaction(storeName, param);
  const objectStore = transaction.objectStore(storeName);
  console.log('検索開始');

  let objectStoreRequest;

  transaction.addEventListener('complete' , function(event) {
    console.log('Find Data!');
    return; // resolve
  });
  transaction.addEventListener('error' , function(event) {
    console.log("Find Data Error! transaction");
    transaction.abort(); // ロールバック！
  });
  transaction.addEventListener('abort' , function(event) {
    console.log("Find Data Transaction aborted!");
    throw new Error('Find Data Error!');
  });

  objectStoreRequest.addEventListener('success', function (event) {
    console.log('FindData Success!');
  });
  objectStoreRequest.addEventListener('error', function (event) {
    console.log('FindData Error!');
    transaction.dispatchEvent('error');
  });


}


/**** 
* @param {IDBDatabase} db
* @param {String} storeName
* @param {Object} journals
****/
// 全データの読出し
async function readData(db, storeName, param) {
  console.log('読出し開始');

  const transaction = db.transaction(storeName, param);
  const objectStore = transaction.objectStore(storeName);
    
  const objectStoreRequest = objectStore.getAll();
  let result = {};

  console.info(objectStoreRequest);
  console.info(objectStoreRequest.result);

  transaction.addEventListener('complete' , function(event) {
    console.info('Read Data!' + event.target.result);
    result = event.target.result; // resolve
  });
  transaction.addEventListener('error' , function(event) {
    console.log("Read Data Error! transaction");
    transaction.abort(); // ロールバック！
  });
  transaction.addEventListener('abort' , function(event) {
    console.log("Read Data Transaction aborted!");
    throw new Error('Read Data Error!');
  });

  objectStoreRequest.addEventListener('success', function (event) {
    console.info('ReadData Success!' + event.target.result);
    result = event.target.result; // resolve
  });
  objectStoreRequest.addEventListener('error', function (event) {
    console.log('ReadData Error!');
    transaction.dispatchEvent('error');
  });

  if(result) return result;
}