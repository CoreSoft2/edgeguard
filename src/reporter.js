
var count = 0;
var queue = [];
var validationSent = false;
var maxURLQueryLength = 2048;

var deliver = hasCORS ? deliverCORS : deliverJSONP

var flushQueue = function() {  
  if (queue.length == 0 || count > maxEvents) { return; }
  var payload = []  
  var mouseHistory = mouseHistories.shift()
  if (!mouseHistory) {
    attachMouseHandler();
    return;
  }

  // if buffer is getting depleted, start tracking the mouse again
  if (mouseHistories.length < (historyBufferCount / 2)) { attachMouseHandler() }

  var el = queue.pop();  
  if (!validationSent) {    
    el['ts'] = generateTimestamp()
    el['pl'] = timestamp // page load clock time
    el['dl'] = DOMLoadTime
    el['sd'] = true  // session data
    validationSent = true;
  }  
  //el['sid'] = sessionId
  el['mh'] = serializeMouseHistory(mouseHistory)  
  deliver(el);
  count += 1
}

var queueLoop = function() {
  flushQueue();
  setTimeout(queueLoop, 150);
}

var queuePayload = function(obj) {  

  obj[originKey] = windowLocation.protocol + "//" + windowLocation.host;
  obj[pathKey] = windowLocation.pathname;
  obj[paramsKey] = windowLocation.search;

  queue.push(obj);  

};

validationReadyCallbacks.push(queueLoop);