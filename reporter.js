var endpoint = 'http://localhost:3000/events.js';

var count = 0;

var queuePayload = function(obj) {
  if (maxReports && count > maxReports) {
    return;
  }  
  //no queues, just send for now.
  obj.origin = window.location.origin;
  obj.path = window.location.pathname;
  obj.params = window.location.search
  var fields = ['method', 'url', 'origin', 'path', 'source', 'params']    
  var params = []
  for (var i = 0; i < fields.length; ++i) {
    var field = fields[i];
    params.push(field + '=' + encodeURIComponent(obj[field]))
  }

  url = endpoint + "?" + params.join("&")
  console.log(obj)
  var scriptNode = document.createElement('SCRIPT');
  scriptNode.setAttribute('src', url)
  scriptNode[egDataKey] = nonce;
  document.body.appendChild(scriptNode);
  window.setTimeout(function() {
    document.body.removeChild(scriptNode);
  }, 100);
  count += 1;
};