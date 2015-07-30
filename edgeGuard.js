var Old = window.XMLHttpRequest;
var endpoint = 'http://localhost:3000/events.js';
var nonce = "";
for (var i = 0; i < 4; ++i) {
  nonce += Math.floor(Math.random() * 65536).toString(16);
}

var generateUID = function () {
  var str = ""
  for (var i = 0; i < 4; ++i) {
    str += Math.floor(Math.random() * 65536).toString(16);
  }
  return str;
}

var isRemote = function(url) {
  if (!url) { return false; }
  return !!(url.match(/^https?:\/\//) || url.match(/^\/\//));
}

var watchAttribute;

var setWatchAttributeBehaviour = function() {

  var mutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  if (mutationObserver) {
    var observer = new mutationObserver(function(mutations, observer) {
      mutations.forEach()
    });
    return;
  }

  var domAttrEl = document.createElement('p');
  document.body.appendChild(domAttrEl);
  var method = 'addEventListener'

  if (domAttrEl.addEventListener) {
    domAttrEl.addEventListener('DOMAttrModified', function(){
      console.log('DOMAttrModified is supported');
      watchAttribute = function(element, callback) {
        element.addEventListener('DOMAttrModified', function(e) {
          callback(e.target)
        });
      }
    })
    domAttrEl.id = 'something';
  }

  document.body.removeChild(domAttrEl); 

  if (!watchAttribute) {

  };
}



var queuePayload = function(obj) {
  //no queues, just send for now.
  obj.origin = window.location.origin;
  obj.path = window.location.pathname;
  obj.params = window.location.search
  var scriptNode = document.createElement('SCRIPT');
  var fields = ['method', 'url', 'origin', 'path', 'source', 'params']    
  var params = []
  for (var i = 0; i < fields.length; ++i) {
    var field = fields[i];
    params.push(field + '=' + encodeURIComponent(obj[field]))
  }

  url = endpoint + "?" + params.join("&")
  scriptNode.setAttribute('src', url)
  scriptNode._eg_val = nonce;
  document.body.appendChild(scriptNode);
  window.setTimeout(function() {
    document.body.removeChild(scriptNode);
  }, 100);
};

window.XMLHttpRequest = function() {
  var orig = new Old(arguments);
  var _this = this;

  var attributes = ['timeout', 'withCredentials', 'upload', 
    'responseURL', 'status', 'statusText', 'responseType',
    'response', 'responseText', 'responseXML', 'readyState']

  var handlers = ['onloadstart',
    'onprogress', 'onabort', 'onerror', 'onload', 
    'ontimeout', 'onloadend', 'onreadystatechange']

  var origLast = {}
  var thisLast = {}

  for (var i = 0; i < attributes.length; ++i) {
    var attr = attributes[i];
    _this[attr] = orig[attr];
  };


  //console.log(this);

  var syncAttributes = function() {
    for (var i = 0; i < attributes.length; ++i) {
      var attr = attributes[i];
      var newVal;
      //if our object has changed set newVal to its new value
      if (_this[attr] != thisLast[attr]) {
        newVal = _this[attr];
        //console.log("attribute " + attr + " has changed externally, new value: ");
        //console.log(newVal);
      }
      //if original has changed, set newVal to is new value, overwriting our own changes if so
      if (orig[attr] != origLast[attr]) {
        newVal = orig[attr];
        //console.log("attribute " + attr + " has changed internally, new value: ");
        //console.log(newVal);
      }

      if (!newVal) { continue; }


      _this[attr] = newVal;
      orig[attr] = newVal;
      thisLast[attr] = newVal;
      origLast[attr] = newVal;

    };
  };
  
  for (var i = 0; i < handlers.length; ++i) {
    var handler = handlers[i];
    orig[handler] = function() {
      //console.log('event ' + handler + ' was triggered');
      syncAttributes()
      if (_this[handler]) { _this[handler].apply(_this, arguments) }
    }    
  }

  this.open = function() {
    this._method = arguments[0]
    this._url = arguments[1]
    syncAttributes();
    return orig.open.apply(orig, arguments);
  };

  this.setRequestHeader = function() {
    syncAttributes();
    return orig.setRequestHeader.apply(orig, arguments);
  }

  this.send = function() {
    syncAttributes();
    queuePayload({method: this._method, url: this._url, source: 'XHR'});
    return orig.send.apply(orig, arguments);
  }

  this.getResponseHeader = function() {
    syncAttributes();
    return orig.getResponseHeader.apply(orig, arguments);
  }

  this.getAllResponseHeaders = function() {
    syncAttributes();
    return orig.getAllResponseHeaders.apply(orig, arguments);
  }

  this.overrideMimeType = function() {
    syncAttributes();
    return orig.overrideMimeType.apply(orig, arguments);
  }

  return this;

};

var validElement = function(node) {
  // console.log("nonce=" + nonce + ", data-edgeguard attr: " + node._eg_val)
  // return false;
  return !(node._eg_val === nonce);
}

var checked = {}

var generateUID = function() {

}

var beginLoop = function(tagname, attribute) {
  var queue = [];
  var checked = {};
  var curlen = 0
  var loopIter = function() {
    if (curlen == 0) {
      queue = document.getElementsByTagName(tagname);
      curlen = queue.length;
    }
    curlen -= 1;
    var el = queue[curlen];
    if (el && checked[el._eg_data] !== el && validElement(el)) {
      el._eg_data = generateUID();
      checked[el._eg_data] = el;
      var url = el.getAttribute(attribute);
      if (isRemote(url)) {
        queuePayload({url: url, method: 'GET', source: tagname.toLowerCase() + "_load"});
      }
    }
    setTimeout(loopIter, 15);
  }
  loopIter();
}

var scrapeLoadedContent = function() {
  var tagParams = {IMG: 'src', SCRIPT: 'src', LINK: 'href', IFRAME: 'src', OBJECT: 'data'}
  for (var tag in tagParams) {
    beginLoop(tag, tagParams[tag])    
  }
}

var listenersInitialized = false;
var initEventListeners = function() {

  if (listenersInitialized) { return; }
  listenersInitialized = true;

  setWatchAttributeBehaviour();
  scrapeLoadedContent();

  document.body.addEventListener("click", function(e) {
    if (!validElement(e.target)) { return; }
    if (e.target.nodeName == 'A') {
      var href = e.target.getAttribute('href');
      if (isRemote(href)) {
        e.preventDefault();
        queuePayload({method: 'GET', url: href, source: 'link_click'})
        console.log('redirecting to ' + href)
        window.setTimeout(function() {
          window.location.href = href;
        }, 100);
      }      
    };
  });

  document.body.addEventListener("submit", function(e) {
    if (!validElement(e.target)) { return; }
    if (e.target.nodeName == 'FORM') {
      var action = e.target.getAttribute('action');
      var method = e.target.getAttribute('method');
      if (!method) { method = 'GET' };
      if (isRemote(action)) {
        console.log('remote');
        e.preventDefault();
        queuePayload({method: method, url: action, source: 'form_submit'});
        window.setTimeout(function() {
          e.target.submit();
        }, 100);
      }
    }
    return true;
  }, true);

}

document.addEventListener('DOMContentLoaded', initEventListeners);
document.addEventListener('load', initEventListeners);
//document.onreadystatechange = initEventListeners;
window.setTimeout(initEventListeners, 5000);

