var arrayMap = function(arr, func) {
  var ret = []
  for (var i = 0; i < arr.length; ++i) {
    ret.push(func(arr[i]));
  }
  return ret;
}

var generateTimestamp = Date.now

var endpoint = '192.168.3.7:3000';
var proto = 'http:'

var timestamp = generateTimestamp();
var DOMLoadTime;

var OrigXHR = XMLHttpRequest;

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

var hasAddEventListener;
var hasDOMAttrModified;
var hasDOMNodeInserted;

var buildPayload = function(method, url, source) {
  var ret = {}
  ret[methodKey] = method
  ret[urlKey] = url
  ret[sourceKey] = source
  return ret;
}

var mutationObserverObject = (windowObject.MutationObserver || windowObject.WebKitMutationObserver);
var hasMutationObserver = !!(mutationObserverObject);
var hasWebSockets;
var hasCORS = 'withCredentials' in new XMLHttpRequest();

var DOMLoadedCallbacks = [];
var validationReadyCallbacks = [];

var trimStr;
if (String.prototype.trim !== 'function') {
  trimStr = function(str) {
    return str.replace(/^\s+|\s+$/g, '')
  }
} else {
  trimStr = function(str) {
    return str.trim();
  }
}

var srcParam = 'src';
var elementAttributes = {
  IMG: [srcParam],
  SCRIPT: [srcParam],
  OBJECT: ['data'],
  IFRAME: [srcParam],
  LINK: ['href'],
  A: ['href'],
  FORM: ['action']
};

var serializeMouseHistory = function(history) {
  var str = "";
  arrayMap(history, function(pos) {        
    str += "," + pos.x + ":" + pos.y;
  });
  return str.slice(1);
}

var sessionId = null;

var mouseHistories = [];
var historyBufferCount = 20;

var attachMouseHandler;


var extractAttribute = function(element, attribute) {
  return element[attribute] || element.getAttribute(attribute);
}

var whitelist = ["insert whitelist here"];

var domainProtoMatch = function(domain, protocol) {
  return (domain == windowLocation.host && protocol == windowLocation.protocol) || (whitelist.indexOf(domain) > 0)
}


var isBadUrl = function(url) {
  if (!url) { return false; }

  var trimmed = trimStr(url);
  var protocol = (trimmed.match(/^(http|ws)s?:/) || [])[0]
  var domain;
  if (protocol) {
    domain = trimmed.match(/^(http|ws)s?:\/\/([^\/]*)/)[2]
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

//the maximum number of events to send per page load
var maxEvents = 100;