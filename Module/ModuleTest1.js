function test1(){
  console.log("モジュール1test1からの書き込み");
}

function test2(){
  console.log("モジュール1test2からの書き込み")
}

export{ test1, test2 };
export * from './ModuleTest2.js'