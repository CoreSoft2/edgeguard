var constructorNames = ["XMLHttpRequest", "WebSocket", "MozWebSocket", "XDomainRequest"]

var constructors = {}
arrayMap(constructorNames, function(name) {
  if (window[name]) {
    constructors[name] = window[name];
  }
})

var builtinMethods = {}
var nodeMethods = ["appendChild", "removeChild", "insertBefore", "replaceChild", "cloneNode"];
arrayMap(["Node", "Element", "HTMLDocument"], function(obj) {
  builtinMethods[obj] = nodeMethods;
})

function isNative(name, funcString) {
  var regexStr = "^function " + name + "\\(\\) \\{\\s*\\[native code\\]\\s*\\}$"
  return !!funcString.match(new RegExp(regexStr));
}

function detectSideEffects() {
  for (name in constructors) {
    if (!isNative(name, "" + constructors[name])) {
      debugLog(name + " has been overridden")
    }
  }
  for (objectName in builtinMethods) {
    arrayMap(builtinMethods[objectName], function(method) {
      if (!isNative(method, "" + window[objectName].prototype[method])) {
        debugLog(objectName + "." + method + " has been overridden")
      }
    })
  }
}
