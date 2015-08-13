

var count = 0;
var queue = [];
var validationSent = false;
var maxURLQueryLength = 2048;

var payloadToParams = function(data) {
  var str = ""
  for (var k in data) {
    str += "data[" + k + "]=" + encodeURIComponent(data[k]) + "&"
  } 
  return str.slice(0, -1);
}

var deliverJSONP = function(data) {

  var url = proto + '//' + endpoint + '/events/generate.js?' + payloadToParams(data);  

  console.log(url);

  var scriptNode = documentObject.createElement('SCRIPT');
  scriptNode.setAttribute('src', url);
  scriptNode[egDataKey] = sessionId;
  body.appendChild(scriptNode);
  windowObject.setTimeout(function() {
    body.removeChild(scriptNode);
  }, 100);
}

var deliverCORS = function(data) {
  var xhr = new OrigXHR();
  xhr.open('POST', proto + '//' + endpoint + '/events');
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var payload = payloadToParams(data);
  xhr.send(payload);
}

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
    el['hc'] = hasCORS; 
    el['hmo'] = hasMutationObserver
    el['ts'] = generateTimestamp()
    el['pl'] = timestamp // page load clock time
    el['dl'] = DOMLoadTime
    el['hws'] = hasWebSockets
    el['hael'] = hasAddEventListener
    el['sd'] = true  // session data
    validationSent = true;
  }  
  el['sid'] = sessionId
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