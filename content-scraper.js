DOMLoadedCallbacks.push(function() {

  for (tag in elementAttributes) {
    var attributes = elementAttributes[tag];
    var els = document.getElementsByTagName(tag);
    for (var i = 0; i < els.length; ++i) {
      var el = els[i];
      if (el[egDataKey] && el[egDataKey] == sessionId) {
        console.log('script added by eg');
        continue;
      }
      initialValues = {}
      for (var j = 0; j < attributes.length; ++j) {
        var attribute = attributes[j];
        var val = extractAttribute(el, attribute);
        initialValues[attribute] = val;
        if (isBadUrl(val)) {
          queuePayload({url: val, method: 'GET', source: tag.toLowerCase() + "_" + attribute}); 
        }
      }
      watchElementAttributes(el, attributes, initialValues);
    }
  }

});