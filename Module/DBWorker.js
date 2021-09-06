// Moduleの読込
importScripts('DBTools.js');

// main.jsからのpostMessageを受取る
self.addEventListener('message', function(e) {
  let cmd = e.data.cmd;
  //  self.postMessage(e.data);

  // DBの名前
  const dbName = e.data.name;
  // 受取ったDataを変数に格納
  const journal = e.data.msg;
  // DBに接続、または無い場合には新規作成
  let request = indexedDB.open(dbName, 2);

  // DBの作成に失敗した場合
  request.addEventListener('error', function(event) {
    // エラー処理
    console.log('データベースの作成・接続に失敗');
    });

  switch (cmd) {
    case "TEST":
      self.postMessage({'cmd': 'TEST', 'msg': e.data.msg});
      break;
    case "CREATE":
      
      // DB作成成功後の処理
      //KeyPathと検索用のindexを設定
      const indexArray = ["idNum", "date", "DrCode", "DrAmount", "CrCode", "CrAmount", "remarksColumn"];
      const KeyPath = "idNum";
      createDataBase(request, journal, KeyPath, indexArray);
      
      break;
    case "ADD":
      // データの追加
      addData(request, journal);
      break;
    case "PUT":
      // データの上書き更新
      putData(request, journal);
      break;
    case "READ":
      // データの読出し
      readData(request);
      break;
    default:
      break;
  };
  
}, false);