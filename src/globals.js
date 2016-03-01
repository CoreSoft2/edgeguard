function arrayMap(arr, func) {
  var ret = []
  for (var i = 0; i < arr.length; ++i) {
    ret.push(func(arr[i]));
  }
  return ret;
}

function executeAll(functions) {
  arrayMap(functions, function(f) { f(); });
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

var selfHash;

// TODO crypto
var secret = "<%= secret %>"

function buildPayload(method, url, source) {
  var ret = {}
  ret[methodKey] = method
  ret[urlKey] = url
  ret[sourceKey] = source
  return ret;
}

function extractAttribute(target, attr) {
  target.getAttribute(attr)
}

var overrides = []

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

function nop(){}

var srcParam = 'src';
//scripts are handled separately
var elementAttributes = {
  IMG: [srcParam],
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

var clientSecret = null;

var mouseHistories = [];
var historyBufferCount = 20;

var attachMouseHandler;

// assigning these to variables should allow better minification
var egIdKey = "_eg_key";
var egElementKey = "_el";
var egDataKey = "_eg_data";

//the maximum number of events to send per page load
var maxEvents = 100;