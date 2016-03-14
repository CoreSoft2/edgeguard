DOMLoadedCallbacks.push(function() {

  for (tag in elementAttributes) {
    var attributes = elementAttributes[tag];
    var els = document.getElementsByTagName(tag);
    arrayMap(els, function(el) {
      var initialValues = {}
      arrayMap(attributes, function(attribute) {
        var val = extractAttribute(el, attribute);
        initialValues[attribute] = val;
        if (isBadUrl(val)) {
          var method = tag === 'FORM' ? (extractAttribute(el, 'method') || 'GET') : 'GET';
          queuePayload(buildPayload(method.toUpperCase(), val, tag.toLowerCase() + "_" + attribute))          
        }
      })
      watchElementAttributes(el, attributes, initialValues);
    });
  }

});