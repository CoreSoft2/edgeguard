
DOMLoadedCallbacks.push(function() {

  document.body.addEventListener("click", function(e) {
    if (e.target.nodeName == 'A') {
      var href = e.target.getAttribute('href');
      if (isBadUrl(href)) {
        e.preventDefault();
        queuePayload({method: 'GET', url: href, source: 'link_click'})
        console.log('redirecting to ' + href)
        window.setTimeout(function() {
          window.location.href = href;
        }, 100);
      }      
    };
  });

  document.body.addEventListener("submit", function(e) {
    if (e.target.nodeName == 'FORM') {
      var action = e.target.getAttribute('action');
      var method = e.target.getAttribute('method');
      if (!method) { method = 'GET' };
      if (isBadUrl(action)) {
        console.log('remote');
        e.preventDefault();
        queuePayload({method: method, url: action, source: 'form_submit'});
        window.setTimeout(function() {
          e.target.submit();
        }, 100);
      }
    }
    return true;
  }, true);

});



