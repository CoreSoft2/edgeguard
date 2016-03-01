// murmur3_32
// https://en.wikipedia.org/wiki/MurmurHash

var murmurDigest;

(function() {

  var intMax = 0xffffffff;
  var c1 = 0xcc9e2d51;
  var c2 = 0x1b873593;
  var r1 = 15;
  var r2 = 13;

  var trunc = function(val) {
    return (val & intMax) >>> 0;  
  }

  var ROL = function(val, bits) {
    return trunc((val << bits) | (val >>> (32 - bits)));
  }

  // if v1 * v2 can overflow 2^53 (js Number mantissa), results are not accurate
  var u32SafeMult = function(v1, v2) {
    // if v1 or v2 can fit in 16 bits, we should be OK
    if (v1 < 0xffff || v2 < 0xffff) {
      return v1 * v2
    } 
    // otherwise we need to split up the multiplication and truncate
    else {
      return trunc(((v1 & 0xffff) * v2) + ((((v1 >>> 16) * v2) & 0xffff) << 16) >>> 0);
    }
  }

  var fmix = function(k) {
    k = u32SafeMult(k, c1);
    k = ROL(k, r1);
    k = u32SafeMult(k, c2);
    return k;
  }

  murmurDigest = function(key, seed){
    var m = 5;
    var n = 0xe6546b64;
    var len = key.length;
    var intMax = 0xffffffff;

    var hash = seed || 0;
    var i;

    for (i = 0; (i + 4) <= len; i += 4) {
      var k = 0;
      for (var j = 0; j < 4; ++j) {
        k += (key.charCodeAt(i + j) & 0xff) << (j * 8);
      }

      k = fmix(k);

      hash = (hash ^ k) >>> 0;
      hash = ROL(hash, r2);
      hash = trunc(u32SafeMult(hash, m) + n);

    }

    var remainder = key.slice(i);
    if (remainder.length > 0) {
      var k = 0;
      for (var j = remainder.length - 1; j >= 0; --j) {
        k = (k << 8) | (remainder.charCodeAt(j) & 0xff);
      }

      k = fmix(k);

      hash = (hash ^ k) >>> 0;
    }

    hash = (hash ^ len) >>> 0;

    hash = (hash ^ (hash >>> 16)) >>> 0;
    hash = u32SafeMult(hash, 0x85ebca6b);
    hash = (hash ^ (hash >>> 13)) >>> 0;
    hash = u32SafeMult(hash, 0xc2b2ae35);
    hash = (hash ^ (hash >>> 16)) >>> 0;

    return hash;

  }
  
})();