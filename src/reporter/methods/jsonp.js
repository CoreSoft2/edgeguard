// TODO split large payloads (max size is 2048 bytes)

var deliverJSONP = function(data) {

  var url = proto + '//' + endpoint + '/events/generate.js?' + payloadToParams(data);

  debugLog(url);

  var scriptNode = documentObject.createElement('SCRIPT');
  scriptNode.setAttribute('src', url);
  scriptNode[egDataKey] = clientSecret;
  body.appendChild(scriptNode);
  windowObject.setTimeout(function() {
    body.removeChild(scriptNode);
  }, 100);
}
