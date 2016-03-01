console.log("Executing self deleting script");

var scripts = document.getElementsByTagName("SCRIPT");
for (var i = 0; i< scripts.length; ++i) {
  if (scripts[i].src.slice(-14) == "self-delete.js") {
    scripts[i].parentElement.removeChild(scripts[i]);
  }
}