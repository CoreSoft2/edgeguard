var payloadToParams = function(data) {
  var str = ""
  for (var k in data) {
    str += "data[" + k + "]=" + encodeURIComponent(data[k]) + "&"
  } 
  return str.slice(0, -1);
}