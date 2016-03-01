var initialTimerCount = 2; 
// one timer in bootstrap.js to check scripts (1)

function detectTimers() {
  var nextTimerId = setInterval(nop, 0);
  if (nextTimerId != initialTimerCount) {
    console.log('Alternate timer declared before edgeguard');
  }
  var rqfID = requestAnimationFrame(nop);
  if (rqfID != 1) {
    console.log('requestAnimationFrame called before edgeguard')
  } 
}