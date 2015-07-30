DOMLoadedCallbacks.push(function() {

  var registerNewElement = function(el, type) {
    var attributes = elementAttributes[type];
    var originalValues = {}
    for (var i = 0; i < attributes.length; ++i) {
      var attribute = attributes[i];
      var val = extractAttribute(el, attribute);
      originalValues[attribute] = val;
      if (isBadUrl(val)) {
        queue_payload({url: val, method: 'GET', source: type + "_" + attribute});
      }
    }
    watchElementAttributes(el, attributes, originalValues);
  }

  if (capabilities.hasMutationObserver) {
    var callback = function(mutationRecords) {
      for (var i = 0; i < mutationRecords.length; ++i) {
        var record = mutationRecords[i];
        var newNodes = record.addedNodes
        for (var j = 0; j < newNodes.length; ++j) {
          var node = newNodes[j];
          for (var tagName in elementAttributes) {
            if (node.tagName == tagName) {
              registerNewElement(node, tagName);
              break;
            }
          }
        }
      }
    }
    var observer = new capabilities.mutationObserverObject(callback);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

});