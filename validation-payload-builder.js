
DOMLoadedCallbacks.push(function() {
  var trackingMouse = true;
  var mousePositions = [];
  var offset = 0;
  var threshold = 100;
  var maxSamples = 128;
  var minSamples = 64;
  
  var mouseHandlerAttached = false;
  var distance = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };
  var mouseMove = function(x, y) {
    if (mouseHistories.length > historyBufferCount) { 
      documentObject.mouseMove = null;
      mouseHandlerAttached = false;
      return;
    }
    mousePositions.push({x: x, y: y})
    if (mousePositions.length > maxSamples) {
      offset += 1;
    }
    var totalDist = distance(mousePositions[offset], mousePositions[mousePositions.length - 1]);
    if (totalDist > threshold && mousePositions.length > minSamples) {
      mouseHistories.push(mousePositions.slice(offset, mousePositions.length));
      if (!sessionId) {
        createSessionId();
        arrayMap(validationReadyCallbacks, function(func) { func() });
      }
    }
  };  
  attachMouseHandler = function() {
    if (mouseHandlerAttached) { return; }
    mouseHandlerAttached = true;
    documentObject.onmousemove = function(event) {
      var e = event || window.event;
      mouseMove(e.clientX, e.clientY);    
    };
  }

  attachMouseHandler()

});