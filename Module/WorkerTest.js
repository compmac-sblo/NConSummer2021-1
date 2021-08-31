// Moduleの読込
importScripts('DBTools.js');

// main.jsからのpostMessageを受取る
self.addEventListener('message', function(e) {
  let cmd = e.data.cmd;
  //  self.postMessage(e.data);

  // DBの名前
  const dbName = e.data.name;
  // 受取ったDataを変数に格納
  const customerData = e.data.msg;
  // DBに接続、または無い場合には新規作成
  let request = indexedDB.open(dbName, 2);

  // DBの作成に失敗した場合
  request.onerror = function(event) {
    // エラー処理
    self.postMessage({'cmd': 'error', 'msg': 'データベースの作成・接続に失敗'});
    };

  switch (cmd) {
    case "TEST":
      self.postMessage({'cmd': 'TEST', 'msg': e.data.msg});
      break;
    case "CREATE":
      
      // DB作成成功後の処理
      createDataBase(request, customerData);
      
      break;
    case "ADD":
      // 接続に成功したら
      addData(request, customerData);
      break;
    default:
      break;
  };
  
}, false);