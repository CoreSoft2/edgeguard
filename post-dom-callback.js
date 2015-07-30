
var callbacksExecuted = false;
var execCallbacks = function() {
  if (callbacksExecuted){ return; }
  callbacksExecuted = true;
  for (var i = 0; i < DOMLoadedCallbacks.length; ++i){
    DOMLoadedCallbacks[i]();
  }
};

document.addEventListener('DOMContentLoaded', execCallbacks);
document.addEventListener('load', execCallbacks);
//document.onreadystatechange = execCallbacks;
window.setTimeout(execCallbacks, 5000);

