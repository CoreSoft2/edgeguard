var createSecret = function() {  
  var parts = []
  var total = 0
  var counter = 0
  for (var i = 0; i < 32; ++i) {
    var pos = mouseHistories[0][i];
    var str = pos.x.toString() + pos.y.toString();
    var newNum = Number(str);
    total += newNum;
    counter += 1
    if (counter == 4) {
      total += Math.floor(Math.random() * 32768);
      total = total % 65536;
      parts.push(total.toString(16));
      counter = 0;
    }
  }
  clientSecret = parts.join("");  
}