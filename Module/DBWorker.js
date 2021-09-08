// Moduleの読込
importScripts('DBTools.js');

// main.jsからのpostMessageを受取る
self.addEventListener('message', function(e) {
  const getCmd = e.data.cmd;
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
    self.postMessage({'cmd': 'success', 'msg': 'データベースにobjectStoreとKeyPath、indexの成功'});
  });

  
  request.addEventListener('success', function (event) {
    const db = event.target.result;
    let setCmd = "",
        setMsg = "";
    function objectStore(db, params) {
      return db.transaction("accountBook", params)
                .objectStore("accountBook");
    }
    switch (getCmd) {
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
        console.log('データの追加開始')
        if(addData(objectStore(db, "readwrite"), journal)){
          setCmd = 'success';
          setMsg = 'データベースに追記成功';
        }else{
          setCmd = 'error';
          setMsg = 'データベースに追記が失敗しました';
        }
        break;
      case "PUT":
        // データの上書き更新
        console.log('データの更新開始');
        if(putData(objectStore(db, "readwrite"), journal)){
          setCmd = 'success';
          setMsg = 'データベースの更新成功';
        }else{
          setCmd = 'error';
          setMsg = 'データベースの更新が失敗しました';
        }
        break;
      case "FIND":
        // データを探す
        if(findData(objectStore(db, "readonly"), journal)){
          setCmd = 'success';
          setMsg = 'データベースから見つけました';
        }else{
          setCmd = 'error';
          setMsg = 'データベースから見つけられませんでした';
        }
        break;
      case "READ":
        // データの読出し
        let msg = readData(objectStore(db, 'readonly'));
        if(msg){
          setCmd = 'read';
          setMsg = msg;
        }else{
          setCmd = 'error';
          setMsg = 'データベースから読み出せませんでした';
        }
        console.log(msg);
        break;
      default:
        break;
    }
    db.close();
    self.postMessage({'cmd': setCmd, 'msg': setMsg});
  });
}, false);