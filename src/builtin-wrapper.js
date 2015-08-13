var wrapBuiltin = function(builtin, attributes, handlers, methods, addInstrumentation) {

  var constructor = function() {    
    // var callStr = "new builtin("
    // for (var i = 0; i < arguments.length; ++i) {
    //   if (i != 0) { callStr += ", " }
    //   callStr += "arguments[" + i + "]"
    // }
    // callStr += ")"
    // var orig = eval(callStr);
    // This implementation works for builtins with up to two arguments, for multi args, uncomment above
    var orig = new builtin(arguments[0], arguments[1]);
    var _this = this;
    var origArguments = arguments;

    var origLast = {}
    var thisLast = {}

    //set initial values for wrapper object
    arrayMap(attributes, function(attr) {
      _this[attr] = orig[attr];      
    })    

    var syncAttributes = function() {
      arrayMap(attributes, function(attr) {        
        var newVal;
        //if our object has changed set newVal to its new value
        if (_this[attr] !== thisLast[attr]) {
          newVal = _this[attr];
        }
        //if original has changed, set newVal to is new value, overwriting our own changes if so
        if (orig[attr] !== origLast[attr]) {
          newVal = orig[attr];
        }

        if (!newVal) { return; }

        _this[attr] = newVal;
        orig[attr] = newVal;
        thisLast[attr] = newVal;
        origLast[attr] = newVal;

      });
    };

    arrayMap(handlers, function(handler) {
      orig[handler] = function() {
        syncAttributes()
        if (_this[handler]) { _this[handler].apply(_this, arguments) }
      }
    })

    arrayMap(methods, function(method) {
      _this[method] = function() {
        syncAttributes();
        var ret = orig[method].apply(orig, arguments);
        syncAttributes();
        return ret;
      }
    })

    addInstrumentation(orig, _this, origArguments, syncAttributes);

    return this;
  }
  return constructor  
}