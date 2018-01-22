// This code detects whether any timers have already been added, so we can
// tell whether any code we don't know about will be run

var initialTimerCount = 2;
// one timer in bootstrap.js to check scripts (1)

function detectTimers() {
  var nextTimerId = setInterval(nop, 0);
  if (nextTimerId != initialTimerCount) {
    debugLog('Alternate timer declared before edgeguard');
  }
  var rqfID = requestAnimationFrame(nop);
  if (rqfID != 1) {
    debugLog('requestAnimationFrame called before edgeguard')
  }
}
