
// first let's detect any side effects from code loaded before this script
detectSideEffects();

detectTimers();

// now lets override builtin objects that can exfiltrate data
executeAll(overrides);

// then load remaining async scripts
var asyncQueuePointer = 0;

function evaluateScripts() {
  while (boot["asq"][asyncQueuePointer] && boot["asq"][asyncQueuePointer]["src"]) {
    eval(boot["asq"][asyncQueuePointer]["src"]);
    ++asyncQueuePointer;
  }
}

arrayMap(boot["asq"], function(el) {
  if (!el["src"]) {
    el["cb"] = evaluateScripts;
  }
})

evaluateScripts();

// then hash the source of this js

selfHash = murmurDigest(boot["src"]);
console.log(selfHash);

// now lets sort out the DOM loaded events

var callbacksExecuted = false;
var execCallbacks = function() {
  if (callbacksExecuted){ return; }
  DOMLoadTime = generateTimestamp() - timestamp;
  body = documentObject.body;
  hasAddEventListener = !!body.addEventListener;
  callbacksExecuted = true;
  executeAll(DOMLoadedCallbacks);  
  prepareInitialReport();  
};

if (documentObject.addEventListener) {
  documentObject.addEventListener('DOMContentLoaded', execCallbacks);
  documentObject.addEventListener('load', execCallbacks);
}
else {
  document.onreadystatechange = execCallbacks;
}
if (document.readyState === 'complete') {
  execCallbacks();
}
windowObject.setTimeout(execCallbacks, 5000);