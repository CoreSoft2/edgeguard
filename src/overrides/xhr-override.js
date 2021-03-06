// Override the XMLHttpRequest constructor

overrides.push(function() {

  var xhrAttributes = ['timeout', 'withCredentials', 'upload',
    'responseURL', 'status', 'statusText', 'responseType',
    'response', 'responseText', 'responseXML', 'readyState']

  var xhrHandlers = ['onloadstart',
    'onprogress', 'onabort', 'onerror', 'onload',
    'ontimeout', 'onloadend', 'onreadystatechange']

  var xhrMethods = ['setRequestHeader', 'getResponseHeader', 'getAllResponseHeaders', 'overrideMimeType']

  window.XMLHttpRequest = wrapBuiltin(window.XMLHttpRequest, xhrAttributes, xhrHandlers, xhrMethods, function(orig, altered, _, syncAttributes) {

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
        queuePayload(buildPayload(altered._method, altered._url, 'XHR'));
      }
      var ret = orig.send.apply(orig, arguments);
      syncAttributes();
      return ret
    }

  });

});
