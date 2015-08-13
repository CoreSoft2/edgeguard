
var callbacksExecuted = false;
var execCallbacks = function() {
  if (callbacksExecuted){ return; }
  DOMLoadTime = generateTimestamp() - timestamp;
  body = documentObject.body;
  hasAddEventListener = !!body.addEventListener;
  callbacksExecuted = true;
  arrayMap(DOMLoadedCallbacks, function(func) { func() });  
};

if (documentObject.addEventListener) {
  documentObject.addEventListener('DOMContentLoaded', execCallbacks);
  documentObject.addEventListener('load', execCallbacks);
}
else {
  document.onreadystatechange = execCallbacks;
}
windowObject.setTimeout(execCallbacks, 5000);

