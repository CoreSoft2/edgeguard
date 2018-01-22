// The element attribute watcher allows you to watch for changes to attributes on DOM elements
// e.g. watch for malicious code changing the value of the 'action' parameter on a form

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

var elQueue = []

function getAttrChangedVector(tagName, attribute) {
  return tagName + "_" + attribute + "_mutate";
}

if (hasMutationObserver) {

  watchElementAttributes = function(el, attributes, initialValues) {
    setLastValues(el, initialValues);
    var tagName = el.nodeName.toLowerCase();
    var observerCallback = function(mutationRecords) {
      var newValues = {}
      arrayMap(mutationRecords, function(record) {
        var target = record.target;
        arrayMap(attributes, function(attribute) {
          newValues[attribute] = extractAttribute(target, attribute);
        })
        var changed = detectChanges(target, newValues);
        for (var k in changed) {
          queuePayload(buildPayload('GET', changed[k], getAttrChangedVector(tagName, k)));
        }
      });
    }
    var attributeObserver = new mutationObserverObject(observerCallback);
    attributeObserver.observe(el, {
      attributes: true,
      attributeFilter: attributes
    });
  }

// if we don't have mutation observers, then try onpropertychange event
} else {

  DOMLoadedCallbacks.push(function() {

    var testNode = documentObject.createElement('P');
    body.appendChild(testNode);
    testNode.setAttribute('href', 'a');

    var attributeChangeDetected = false;

    var func = 'attachEvent'
    var eventName = 'onpropertychange'
    var attrNameKey = 'propertyName'
    var testCallback = function(event) {
      if (event[attrNameKey] == 'href') {
        attributeChangeDetected = true;
      }
    }

    if (hasAddEventListener) {
      func = 'addEventListener'
      eventName = 'DOMAttrModified'
      attrNameKey = 'attrName'
      testCallback = function(event) {
        if (event.attrChange && event[attrNameKey] == 'href') {
          attributeChangeDetected = true;
        }
      }
    }

    testNode[func](eventName, testCallback)
    testNode.setAttribute('href', 'b')
    body.removeChild(testNode)

    if (attributeChangeDetected) {
      watchElementAttributes = function(el, attributes, initialValues) {
        setLastValues(el, initialValues)
        var tagName = el.nodeName.toLowerCase();
        var attributeChangedCallback = function(event) {
          var newValues = {}
          var attrName = event[attrNameKey]
          newValues[attrName] = extractAttribute(el, attrName);
          var changed = detectChanges(el, newValues);
          for (var k in changed) {
            queuePayload(buildPayload('GET', changed[k], getAttrChangedVector(tagName, k)));
          }
        }
        el[func](eventName, attributeChangedCallback);
      }
    // if onpropertychange event doesn't work, instrument setAttribute
    } else {

    }

    arrayMap(elQueue, function(elementData) {
      watchElementAttributes(elementData.el, elementData.attrs, elementData.iv)
    })

  });

  watchElementAttributes = function(el, attributes, initialValues) {
    elQueue.push({el: el, attrs: attributes, iv: initialValues});
  }

}
