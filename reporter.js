var endpoint = 'http://localhost:3001/events';

var count = 0;
var queue = [];
var validationSent = false;
var maxURLQueryLength = 2048;

var payloadToParams = function(data) {
  var str = ""
  for (var i = 0; i < data.length; ++i) {
    var el = data[i];
    str += "data[][_]=0&"
    for (var k in el) {
      str += "data[][" + k + "]=" + encodeURIComponent(el[k]) + "&"
    }
  }
  return str.slice(0, -1);
}

var deliverJSONP = function(data) {

  var url = endpoint + '/generate.js?' + payloadToParams(data);  

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
  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint + '.json');
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var payload = payloadToParams(data);
  xhr.send(payload);
}

var deliver = hasCORS ? deliverCORS : deliverJSONP

var flushQueue = function() {
  if (queue.length == 0) { return; }  
  if (!validationSent) {
    queue.unshift({t: 'v', mh: mouseHistorySerialized, hc: hasCORS, 
      hmo: hasMutationObserver, ts: timestamp, 
      dl: DOMLoadTime, hws: hasWebSockets});
    validationSent = true;
  }  
  deliver(queue);
  queue = [];
}

var queueLoop = function() {
  flushQueue();
  setTimeout(queueLoop, 500);
}

var queuePayload = function(obj) {
  if (maxReports && count > maxReports) {
    return;
  }  
  //no queues, just send for now.
  obj[originKey] = windowLocation.origin;
  obj[pathKey] = windowLocation.pathname;
  obj[paramsKey] = windowLocation.search  

  queue.push(obj);  
  
  // count += 1;
};

validationReadyCallbacks.push(queueLoop);