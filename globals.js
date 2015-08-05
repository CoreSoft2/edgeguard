var generateTimestamp = function() {
  var current = new Date();
  return Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 
    current.getUTCDate(), current.getUTCHours(), current.getUTCMinutes(), 
    current.getUTCSeconds(), current.getUTCMilliseconds());
}

var timestamp = generateTimestamp();
var DOMLoadTime;

var windowObject = window;
var windowLocation = windowObject.location;
var documentObject = document;
var body = null;

var originKey = 'o'
var pathKey = 'p'
var paramsKey = 'ps'
var urlKey = 'u'
var sourceKey = 's'
var methodKey = 'm'

var buildPayload = function(method, url, source) {
  var ret = {}
  ret[methodKey] = method
  ret[urlKey] = url
  ret[sourceKey] = source
  return ret;
}

var mutationObserverObject = (windowObject.MutationObserver || windowObject.WebKitMutationObserver);
var hasMutationObserver = !!(mutationObserverObject);
var hasWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
var hasCORS = 'withCredentials' in new XMLHttpRequest();

var DOMLoadedCallbacks = [];
var validationReadyCallbacks = [];

var srcParam = 'src';
var elementAttributes = {
  IMG: [srcParam],
  SCRIPT: [srcParam],
  OBJECT: ['data'],
  IFRAME: [srcParam],
  LINK: ['href']
};

var sessionId = null;

var mouseHistory = null;
var mouseHistorySerialized = null;

var extractAttribute = function(element, attribute) {
  return element[attribute] || element.getAttribute(attribute);
}

var domainProtoMatch = function(domain, protocol) {
  return domain == windowLocation.host && protocol == windowLocation.protocol
}

var isBadUrl = function(url) {
  if (!url) { return false; }

  var trimmed = url.trim();
  var protocol = trimmed.match(/^https?:/)[0]
  var domain;
  if (protocol) {
    domain = trimmed.match(/^https?:\/\/([^\/]*)/)[1]
    return !domainProtoMatch(domain, protocol);
  }

  var relativeProto = !!trimmed.match(/^\/\//)
  if (relativeProto) {
    protocol = windowLocation.protocol;
    domain = trimmed.match(/^\/\/([^\/]*)/)
    return !domainProtoMatch(domain, protocol);
  }
  return false;

};

// assigning these to variables should allow better minification
var egIdKey = "_eg_key";
var egElementKey = "_el";
var egDataKey = "_eg_data";

var maxReports = 100;