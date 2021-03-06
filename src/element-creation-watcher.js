// The element creation watcher allows you to watch DOM element creation, so you can catch
// malicious code creating new dangerous elements, e.g. form 

DOMLoadedCallbacks.push(function() {


  var registerNewElement = function(el, type) {
    var attributes = elementAttributes[type];
    var originalValues = {}
    //if (extractAttribute(el, egDataKey) == clientSecret) { return; }
    arrayMap(attributes, function(attribute) {
      var val = extractAttribute(el, attribute);
      originalValues[attribute] = val;
      if (isBadUrl(val)) {
        queuePayload(buildPayload('GET', val, type.toLowerCase() + "_" + attribute + "_create"));
      }
    })
    watchElementAttributes(el, attributes, originalValues);
  }

  // mutationRecords only report the parent node if a whole tree of nodes are
  // added at the same time. We need to descend the tree to check all of them
  var descendTree = function(node) {
    if (elementAttributes[node.tagName]) {
      registerNewElement(node, node.tagName)
    }
    arrayMap(node.childNodes, descendTree)
  }

  if (hasMutationObserver) {
    var callback = function(mutationRecords) {
      arrayMap(mutationRecords, function(record) {
        arrayMap(record.addedNodes, function(node) {
          descendTree(node)
        })
      })
    }
    var observer = new mutationObserverObject(callback);
    observer.observe(body, {
      childList: true,
      subtree: true
    });
  } else {
    // don't bother with DOMNodeInserted for IE9, it's slow and buggy
    // we'll hack the Element constructor so when a new node is added we'll get notified

    var validElements = []
    for (var k in elementAttributes) { validElements.push(k); }

    var funcs = ['appendChild', 'insertBefore', 'replaceChild']

    arrayMap(funcs, function(func) {
      var func =  funcs[i];
      (function(orig) {
        Element.prototype[func] = function(newElement, element) {
          var nodeName = newElement.nodeName
          if (validElements.indexOf(nodeName) >= 0) {
            registerNewElement(newElement, nodeName);
          }
          return orig.apply(this, [newElement, element]);
        }
      })(Element.prototype[func]);
    });

  }

});
