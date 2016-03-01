DOMLoadedCallbacks.push(function() {

  for (tag in elementAttributes) {
    var attributes = elementAttributes[tag];
    var els = document.getElementsByTagName(tag);
    arrayMap(els, function(el) {
      initialValues = {}
      arrayMap(attributes, function(attribute) {
        var val = extractAttribute(el, attribute);
        initialValues[attribute] = val;
        if (isBadUrl(val)) {
          queuePayload({url: val, method: 'GET', source: tag.toLowerCase() + "_" + attribute}); 
        }
      })
      watchElementAttributes(el, attributes, initialValues);
    });
  }

});