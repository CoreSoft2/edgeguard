
var callbacksExecuted = false;
var execCallbacks = function() {
  if (callbacksExecuted){ return; }
  DOMLoadTime = generateTimestamp() - timestamp;
  console.log(DOMLoadTime);
  body = documentObject.body;
  callbacksExecuted = true;
  for (var i = 0; i < DOMLoadedCallbacks.length; ++i){
    DOMLoadedCallbacks[i]();
  }
};

documentObject.addEventListener('DOMContentLoaded', execCallbacks);
documentObject.addEventListener('load', execCallbacks);
//document.onreadystatechange = execCallbacks;
windowObject.setTimeout(execCallbacks, 5000);

