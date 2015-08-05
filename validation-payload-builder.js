
DOMLoadedCallbacks.push(function() {
  var trackingMouse = true;
  var mousePositions = [];
  var offset = 0;
  var threshold = 200;
  var maxSamples = 128;
  var minSamples = 32;
  var distance = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };
  var mouseMove = function(x, y) {
    mousePositions.push({x: x, y: y})
    if (mousePositions.length > maxSamples) {
      offset += 1;
    }
    var totalDist = distance(mousePositions[offset], mousePositions[mousePositions.length - 1]);
    if (totalDist > threshold && mousePositions.length > minSamples) {      
      trackingMouse = false;
      mouseHistory = mousePositions.slice(offset, mousePositions.length);
      mouseHistorySerialized = ""
      for (var i = 0; i < mouseHistory.length; ++i) {
        var pos = mouseHistory[i];
        if (i != 0) { mouseHistorySerialized += "," }
        mouseHistorySerialized += pos.x + ":" + pos.y;
      }
      createSessionId();
      for (var i = 0; i < validationReadyCallbacks.length; ++i) {
        validationReadyCallbacks[i]();
      }
    }
  };
  documentObject.onmousemove = function(event) {
    var e = event || window.event;
    mouseMove(e.clientX, e.clientY);
    if (!trackingMouse) {
      documentObject.onmousemove = null;
      return;
    }
  };


});