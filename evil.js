var orig = Node.prototype.appendChild;
Node.prototype.appendChild = function() {
  return orig.apply(this, arguments)
}
