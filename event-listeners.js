
DOMLoadedCallbacks.push(function() {

  body.addEventListener("click", function(e) {
    var target = e.target;
    if (target.nodeName == 'A') {
      var href = extractAttribute(target, 'href');
      if (isBadUrl(href)) {
        e.preventDefault();
        queuePayload({method: 'GET', url: href, source: 'link_click'})
        flushQueue();        
        windowObject.setTimeout(function() {
          windowLocation.href = href;
        }, 100);
      }      
    };
  });

  body.addEventListener("submit", function(e) {
    var target = e.target;
    if (target.nodeName == 'FORM') {
      var action = extractAttribute(target, 'action');
      var method = extractAttribute(target, 'method');
      if (!method) { method = 'GET' };
      if (isBadUrl(action)) {
        console.log('remote');
        e.preventDefault();
        queuePayload({method: method, url: action, source: 'form_submit'});
        flushQueue();
        windowObject.setTimeout(function() {
          target.submit();
        }, 100);
      }
    }
    return true;
  }, true);

});



