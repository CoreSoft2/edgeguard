
// first let's detect any side effects from code loaded before this script
detectSideEffects();

detectTimers();

// now lets override builtin objects that can exfiltrate data
executeAll(overrides);

// then load remaining async scripts
var asyncQueuePointer = 0;

function evaluateScripts() {
  while (boot["asq"][asyncQueuePointer] && boot["asq"][asyncQueuePointer]["src"]) {
    debugLog("Evaluating " + boot["asq"][asyncQueuePointer]["vsrc"])
    eval(boot["asq"][asyncQueuePointer]["src"]);
    asyncQueuePointer += 1;
  }
}

arrayMap(boot["asq"], function(el) {
  if (!el["src"]) {
    el["cb"] = evaluateScripts;
  }
})

boot['sfh'] = function(scriptObj) {
  scriptObj['cb'] = evaluateScripts
}

evaluateScripts();

// then hash the source of this js

selfHash = murmurDigest(boot["src"]);

// now lets sort out the DOM loaded events


var callbacksExecuted = false;
var execCallbacks = function() {
  if (callbacksExecuted){ return; }
  callbacksExecuted = true;
  DOMLoadTime = generateTimestamp() - timestamp;
  body = documentObject.body;
  hasAddEventListener = !!body.addEventListener;
  for (var i = 0; i < DOMLoadedCallbacks.length; ++i) {
    DOMLoadedCallbacks[i]()
  }
  //executeAll(DOMLoadedCallbacks);
  //prepareInitialReport();
  windowObject.clearInterval(boot['lh'])
};

var cbProxy = function(label) {
  debugLog("entry-point, callback: " + label)
  return function() {
    execCallbacks()
  }
}

windowObject.onload = cbProxy('onload')

if (documentObject.addEventListener) {
  documentObject.addEventListener('DOMContentLoaded', cbProxy('DOMContentLoaded'));
  windowObject.addEventListener('load', cbProxy('window.load'));
}
else {
  document.onreadystatechange = function() {
    cbProxy('onreadystatechange')()
  }
}
if (document.readyState === 'complete') {
  cbProxy('readyState')()
}
windowObject.setTimeout(function() {
  cbProxy('timeout')()
}, 5000);
