// This listens for events that cause navigation, i.e. clicking on an
// anchor or submitting a form


DOMLoadedCallbacks.push(function() {

  if (hasAddEventListener) {

    documentObject.addEventListener("click", function(e) {
      var target = e.target;
      if (target.nodeName == 'A') {
        var href = extractAttribute(target, 'href');
        if (isBadUrl(href)) {
          reportSync(buildPayload('GET', href, 'link_click'))
          redirect = false
        }
      };
    });

    documentObject.addEventListener("submit", function(e) {
      var target = e.target;
      if (target.nodeName == 'FORM') {
        var action = extractAttribute(target, 'action');
        var method = extractAttribute(target, 'method');
        if (!method) { method = 'GET' };
        if (isBadUrl(action)) {
          var obj = buildPayload(method.toUpperCase(), action, 'form_submit')
          populatePayload(obj)
          deliverJSONP(obj)
          redirect = false
        }
      }
      return true;
    }, true);

  }

});
