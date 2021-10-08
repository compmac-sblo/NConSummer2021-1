// Moduleの読込
importScripts('DBTools.js');

const myEventTarget = new EventTarget();
const DBevent = new CustomEvent('DBReady');

let setCmd = "",
    setMsg = "";

myEventTarget.addEventListener('DBReady', function (e) {
  self.postMessage({'cmd': setCmd, 'msg': setMsg});
  console.log(setCmd + '送信');
}, false);

// main.jsからのpostMessageを受取る
self.addEventListener('message', function(e) {
  const getCmd = e.data.cmd;
  //  self.postMessage(e.data);

  // DBname&storeNameをDBobjに設定
  const DBobj = new DBobject(e.data.DBobj.DBname, e.data.DBobj.storeName);

  // 受取ったDataを変数に格納
  const journals = e.data.msg;
  // DBに接続、または無い場合には新規作成
  const DBOpenRequest = indexedDB.open(DBobj.getDBName(), 1);

  // 
  
  

  // DBの作成に失敗した場合
  DBOpenRequest.addEventListener('error', function(event) {
    // エラー処理
    console.log('データベースの作成・接続に失敗');
    setCmd = 'error';
    setMsg = 'データベースの作成・接続に失敗しました';
    myEventTarget.dispatchEvent(DBevent);
    //self.postMessage({'cmd': 'error', 'msg': 'データベースの作成・接続に失敗しました'});
  });

  // 新規作成後にobjectStoreとKeyPath、indexを作成
  DBOpenRequest.addEventListener('upgradeneeded', function(event) {
    const db = event.target.result;
    // "idNum" は一意であることが保証されていますので、キーパスとして使用します。
    const KeyPath = "idNum";
    // 検索用にindexを設定
    const indexArray = ["idNum", "date", "DrCode", "DrAmount", "CrCode", "CrAmount", "remarksColumn"];
    // objectSoreの作成
    createDataBaseObjectStore(KeyPath, indexArray, db, DBobj.getObjectStoreName())
    .then(() => {
      setCmd = 'success';
      setMsg = 'データベースにobjectStoreとKeyPath、indexの成功';
      myEventTarget.dispatchEvent(DBevent);
    });
  });

  
  DBOpenRequest.addEventListener('success', function (event) {
    const db = DBOpenRequest.result;
    const storeName = DBobj.getObjectStoreName();

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
        addData(db, storeName, journals)
          .then(() => {
            setCmd = 'success';
            setMsg = 'データベースに追記成功';
            console.log('データの追加成功');})
          .catch(() => {
            setCmd = 'error';
            setMsg = 'データベースの追加が失敗しました';})
          .finally(() => {
            myEventTarget.dispatchEvent(DBevent);
          });
        break;
      case "PUT":
        // データの上書き更新
        console.log('データの更新開始');
        putData(db, storeName, "readwrite", journals)
          .then(() => {
            setCmd = 'success';
            setMsg = 'データベースの更新成功';})
          .catch(() => {
            setCmd = 'error';
            setMsg = 'データベースの更新が失敗しました';})
          .finally(() => {
            myEventTarget.dispatchEvent(DBevent);
          });
        break;
      case "FIND":
        // データを探す
        findData(db, storeName, "readonly", journals)
          .then(() => {
            setCmd = 'success';
            setMsg = 'データベースから見つけました';
          })
          .catch(() => {
            setCmd = 'error';
            setMsg = 'データベースから見つけられませんでした';
          })
          .finally(() => {
            myEventTarget.dispatchEvent(DBevent);
          });
        break;
      case "READ":
        // データの読出し
        readData(db, storeName, "readonly")
          .then((msg) => {
            setCmd = 'read';
            setMsg = msg;
            console.log(msg);})
          .catch(() => {
            setCmd = 'error';
            setMsg = '読出しに失敗しました';})
          .finally(() => {
            myEventTarget.dispatchEvent(DBevent);
          })
        break;
      default:
        break;
    }
    db.close();
    setCmd = '';
    setMsg = '';
  });
}, false);