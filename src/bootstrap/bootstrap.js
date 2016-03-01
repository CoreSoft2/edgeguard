
var boot = {}
boot["js"] = [];
boot["asq"] = []

var scriptObj = {}
var vscriptObj = {}
var myLoop;

function finish() {
  clearInterval(myLoop);
  for (var k in scriptObj) { boot["js"].push(k); };
  eval(boot["src"]);
}
//TODO add XDR for IE < 11
function loadScriptAsync(src, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', src)
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(xhr.responseText);
    }
  }
  xhr.send();
}

loadScriptAsync('build/edgeguard.js', function(resp) {
  boot["src"] = resp;
  finish.call(boot);
})

function queueScript(vsrc) {
  vscriptObj[vsrc] = 1;
  var obj = {vsrc: vsrc}
  boot["asq"].push(obj);            
  loadScriptAsync(vsrc, function(resp) {
    obj["src"] = resp;
    if (obj["cb"]) {
      obj["cb"]();
    }
  });
}
//TODO check inline scripts and store source for fingerprinting
function checkScripts() {
  var els = document.scripts;
  for (var i = 0; i < els.length; ++i) {
    var el = els[i];    
    scriptObj[el.src] = 1;
    var vsrc = el.getAttribute('vsrc');
    if (vsrc && !vscriptObj[vsrc]) {
      queueScript(vsrc);
    }
  }
}
myLoop = setInterval(checkScripts, 10);