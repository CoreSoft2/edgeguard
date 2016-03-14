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

DEBUG = true

function debugLog() {
  if (DEBUG) {
    console.log.apply(console, arguments)    
  }
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

// we need this to figure out if someone has changed window.location in a script
var originalHref = windowLocation.href;

// this variable is set to true if we can determine what caused the navigation
// we can catch link clicks, form submit, F5 pressed, Ctrl + R pressed
var validNavigation = false;

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

var origin = windowLocation.host

// TODO crypto
var secret = "<%= secret %>"

function buildPayload(method, url, source) {
  var ret = {}
  ret[methodKey] = method
  ret[urlKey] = url
  ret[sourceKey] = source
  ret[originKey] = origin
  return ret;
}

function extractAttribute(target, attr) {
  console.log(target, attr)
  return target[attr] || target.getAttribute(attr)
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

var elementAttributes = {
  IMG: [srcParam],
  OBJECT: ['data'],
  IFRAME: [srcParam],
  LINK: ['href'],
  A: ['href'],
  FORM: ['action'],
  SCRIPT: [srcParam]
};

var serializeMouseHistory = function(history) {
  var str = "";
  arrayMap(history, function(pos) {        
    str += "," + pos.x + ":" + pos.y;
  });
  return str.slice(1);
}

var whitelist = ['code.jquery.com', 'www.google.com', 'hiderefer.com', endpoint]
console.log(whitelist)

var domainProtoMatch = function(domain, protocol) {
  return (domain == windowLocation.host && protocol == windowLocation.protocol) || (whitelist.indexOf(domain) >= 0)
}

var isBadUrl = function(url) {
  if (!url) { return false; }

  var trimmed = trimStr(url);
  var protocol = (trimmed.match(/^(http|ws)s?:/) || [])[0]
  var domain;
  console.log(url)
  console.log("protocol: " + protocol)
  if (protocol) {
    domain = trimmed.match(/^(http|ws)s?:\/\/([^\/]*)/)[2]
    console.log("domain: " + domain)
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