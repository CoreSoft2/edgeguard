// This file contains the code for sending payloads to the edgeguard backend

var count = 0;
var queue = [];
var validationSent = false;
var maxURLQueryLength = 2048;

var populatePayload = function(obj) {
  obj[originKey] = windowLocation.protocol + "//" + windowLocation.host;
  obj[pathKey] = windowLocation.pathname;
  obj[paramsKey] = windowLocation.search;
}

var deliver = hasCORS ? deliverCORS : deliverJSONP

if (navigator && navigator.sendBeacon) {
  reportSync = function(obj) {
    populatePayload(obj)
    var blob = new Blob([JSON.stringify({data: obj})], {type: 'application/json; charset=UTF-8'})
    debugLog("sending blob: " + obj)
    navigator.sendBeacon(proto + "//" + endpoint + '/events.json', blob)
  }
} else {
  reportSync = function(obj) {
    populatePayload(obj)
    deliverJSONP(obj)
  }
}

var flushQueue = function() {
  if (queue.length == 0 || count > maxEvents) { return; }
  var payload = []
  var mouseHistory = mouseHistories.shift()
  // if (!mouseHistory) {
  //   attachMouseHandler();
  //   return;
  // }

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
  //el['mh'] = serializeMouseHistory(mouseHistory)
  deliver(el);
  count += 1
}

var queueTimer;
var queueLoop = function() {
  flushQueue();
  queueTimer = setTimeout(queueLoop, 150);
}


var queuePayload = function(obj) {

  debugLog('queuing', obj)

  populatePayload(obj)

  queue.push(obj);
  clearTimeout(queueTimer);
  queueLoop();

};

//validationReadyCallbacks.push(queueLoop);
