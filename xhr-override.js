var Old = window.XMLHttpRequest;
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