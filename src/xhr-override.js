

var xhrAttributes = ['timeout', 'withCredentials', 'upload', 
  'responseURL', 'status', 'statusText', 'responseType',
  'response', 'responseText', 'responseXML', 'readyState']

var xhrHandlers = ['onloadstart',
  'onprogress', 'onabort', 'onerror', 'onload', 
  'ontimeout', 'onloadend', 'onreadystatechange']

var xhrMethods = ['setRequestHeader', 'getResponseHeader', 'getAllResponseHeaders', 'overrideMimeType']

window.XMLHttpRequest = wrapBuiltin(window.XMLHttpRequest, xhrAttributes, xhrHandlers, xhrMethods, function(original, altered, _, syncAttributes) {

  altered.open = function() {
    altered._method = arguments[0]
    altered._url = arguments[1]
    syncAttributes();
    var ret = orig.open.apply(orig, arguments);
    syncAttributes();
    return ret;
  };

  altered.send = function() {
    syncAttributes();
    if (isBadUrl(altered._url)) {
      queuePayload({method: altered._method, url: altered._url, source: 'XHR'});
    }
    var ret = orig.send.apply(orig, arguments);
    syncAttributes();
    return ret
  }

});