var wsAttributes = ['readyState', 'bufferedAmount', 'url']
var wsHandlers = ['onopen', 'onmessage', 'onclose']
var wsMethods = ['send', 'close']

var instrumentWS = function(original, altered, originalArguments, syncAttributes) {
  if (isBadUrl(originalArguments[0])) {
    queuePayload({method: 'WS', url: originalArguments[0], source: 'WS'});
  }
}

if (window.WebSocket) {
  window.WebSocket = wrapBuiltin(window.WebSocket, wsAttributes, wsHandlers, wsMethods, instrumentWS);
  hasWebSockets = true;
} else if (window.MozWebSocket) {
  window.MozWebSocket = wrapBuiltin(window.MozWebSocket, wsAttributes, wsHandlers, wsMethods, instrumentWS);
  hasWebSockets = true;
}