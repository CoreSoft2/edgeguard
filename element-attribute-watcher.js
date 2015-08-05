var watchElementAttributes;

var lastElAttributes = {};
var lastId = 0;
var nextId = function() {
  return lastId++;
} 

var setLastValues = function(el, values) {
  var id = nextId();
  el[egIdKey] = id;
  lastElAttributes[id] = values;
  // this means that even if an attacker changes the _el_id value on a node, we can correlate it
  // using DOM Node equality
  lastElAttributes[id][egElementKey] = el;
}

var detectChanges = function(el, values) {
  var id = el[egIdKey];
  var lastValues = lastElAttributes[id];
  if (lastValues[egElementKey] != el) {
    setLastValues(el, values);
    return values;
  } else {
    var changes = {}
    for (var attrName in values) {
      attrValue = values[attrName];
      if (lastValues[attrName] != attrValue) {
        changes[attrName] = attrValue;
      }
    }
    setLastValues(el, values)
    return changes;
  }
}

if (hasMutationObserver) {
  
  watchElementAttributes = function(el, attributes, initialValues) {
    setLastValues(el, initialValues);
    var tagName = el.nodeName.toLowerCase();
    var observerCallback = function(mutationRecords) {
      var newValues = {}
      for (var j = 0; j < mutationRecords.length; ++j) {
        var target = mutationRecords[j].target;
        for (var i = 0; i < attributes.length; ++i) {
          var attribute = attributes[i];
          newValues[attribute] = extractAttribute(target, attribute);
        }
        var changed = detectChanges(target, newValues);
        for (var k in changed) {          
          queuePayload(buildPayload('GET', changed[k], tagName + "_" + k));
        }
      }
    }
    var attributeObserver = new mutationObserverObject(observerCallback);
    attributeObserver.observe(el, {      
      attributes: true,
      attributeFilter: attributes
    });
  }

} else {
  // TODO implement alternative method of watching attributes
  watchElementAttributes = function(el, attributes) {
    
  }

}