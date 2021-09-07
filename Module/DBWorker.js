// Moduleの読込
importScripts('DBTools.js');

// main.jsからのpostMessageを受取る
self.addEventListener('message', function(e) {
  const cmd = e.data.cmd;
  //  self.postMessage(e.data);

  // DBの名前
  const dbName = e.data.name;
  // 受取ったDataを変数に格納
  const journal = e.data.msg;
  // DBに接続、または無い場合には新規作成
  const request = indexedDB.open(dbName, 2);

  // DBの作成に失敗した場合
  request.addEventListener('error', function(event) {
    // エラー処理
    console.log('データベースの作成・接続に失敗');
    self.postMessage({'cmd': 'error', 'msg': 'データベースの作成・接続に失敗しました'});
  });

  // 新規作成後にobjectStoreとKeyPath、indexを作成
  request.addEventListener('upgradeneeded', function(event) {
    const db = event.target.result;
    // "idNum" は一意であることが保証されていますので、キーパスとして使用します。
    const KeyPath = "idNum";
    // 検索用にindexを設定
    const indexArray = ["idNum", "date", "DrCode", "DrAmount", "CrCode", "CrAmount", "remarksColumn"];
    // objectSoreの作成
    createDataBaseObjectStore(request, journal, KeyPath, indexArray, db);
  });

  
  request.addEventListener('success', function (event) {
    const db = event.target.result;
    function objectStore(db, params) {
      return db.transaction("accountBook", params)
                .objectStore("accountBook");
    }
    switch (cmd) {
      case "TEST":
        self.postMessage({'cmd': 'TEST', 'msg': e.data.msg});
        break;
      //case "CREATE":
      //  
      //  // DB作成成功後の処理
      //  //KeyPathと検索用のindexを設定
      //  const indexArray = ["idNum", "date", "DrCode", "DrAmount", "CrCode", "CrAmount", "remarksColumn"];
      //  const KeyPath = "idNum";
      //  createDataBase(request, journal, KeyPath, indexArray);
      //  
      //  break;
      case "ADD":
        // データの追加
        //self.postMessage({'cmd': 'success', 'msg': 'データの追加開始'});
        console.log('データの追加開始')
        if(addData(objectStore(db, "readwrite"), journal)){
          self.postMessage({'cmd':'success', 'msg': 'データベースに追記成功'});
        }else{
          self.postMessage({'cmd': 'error', 'msg': 'データベースに追記が失敗しました'});
        }
        //result.addEventListener('success', function (e) {
        //  self.postMessage({'cmd':'success', 'msg': 'データベースに追記成功'});
        //});
        //result.addEventListener('error', function (e) {
        //  self.postMessage({'cmd': 'error', 'msg': 'データベースに追記が失敗しました'});
        //});
        break;
      case "PUT":
        // データの上書き更新
        putData(objectStore(db, "readwrite"), journal);
        break;
      case "FIND":
        // データを探す
        findData(objectStore(db, "readonly"), journal);
        break;
      case "READ":
        // データの読出し
        readData(objectStore(db, "readonly"));
        break;
      default:
        break;
    }
    db.close();
  });
}, false);