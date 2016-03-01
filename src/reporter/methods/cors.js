
//TODO detect IE < 11 and use XDR

var deliverCORS = function(data) {
  var xhr = new OrigXHR();
  xhr.open('POST', proto + '//' + endpoint + '/events');
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var payload = payloadToParams(data);
  xhr.send(payload);
}