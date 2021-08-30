self.addEventListener('message', function(e) {
  self.postMessage(e.data);
  if (e.data.cmd === "TEST"){
    self.postMessage(e.data.msg);
  }
}, false);