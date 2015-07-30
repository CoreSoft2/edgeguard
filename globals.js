var nonce = "";
for (var i = 0; i < 4; ++i) {
  nonce += Math.floor(Math.random() * 65536).toString(16);
}

var windowLocation = window.location;

var capabilities = {}
capabilities.mutationObserverObject = (window.MutationObserver || window.WebKitMutationObserver);
capabilities.hasMutationObserver = !!(capabilities.mutationObserverObject);
capabilities.hasCORS = 'withCredentials' in new XMLHttpRequest();

var DOMLoadedCallbacks = [];

var elementAttributes = {
  IMG: ['src'],
  SCRIPT: ['src'],
  OBJECT: ['data'],
  IFRAME: ['src'],
  LINK: ['href']
};

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