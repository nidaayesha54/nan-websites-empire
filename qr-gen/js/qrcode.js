/* QRGen - compact QR Code encoder.
 * Byte mode, error-correction levels L and M, versions 1-7.
 * 100% self-contained: no network, no dependencies. All processing is local.
 * Algorithm follows the ISO/IEC 18004 QR Code specification.
 */
(function (root) {
'use strict';

/* ---- Error-correction tables (verified: data + ec == total for every row) ----
 * version -> [totalCodewords, ecCodewordsPerBlock, numBlocks, dataCodewordsPerBlock]
 */
var ECC = {
  0: { // L
    1: [26, 7, 1, 19], 2: [44, 10, 1, 34], 3: [70, 15, 1, 55],
    4: [100, 20, 1, 80], 5: [134, 26, 1, 108],
    6: [172, 18, 2, 68], 7: [196, 20, 2, 78]
  },
  1: { // M
    1: [26, 10, 1, 16], 2: [44, 16, 1, 28], 3: [70, 26, 1, 44],
    4: [100, 18, 2, 32], 5: [134, 24, 2, 43],
    6: [172, 16, 4, 27], 7: [196, 18, 4, 31]
  }
};

var ALIGN_POS = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26],
  5: [6, 30], 6: [6, 34], 7: [6, 22, 38]
};
var REMAINDER_BITS = { 1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 0 };
var VERSION_INFO = { 7: 0x07C94 }; // 18-bit BCH, versions >= 7 only
// 15-bit format strings: indices 0-7 = L, 8-15 = M; low 3 bits = mask
var FORMAT_INFO = [
  0x77C4, 0x72F3, 0x7DAA, 0x789D, 0x662F, 0x6318, 0x6C41, 0x6976,
  0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0
];

/* ---- Galois field GF(256) ---- */
var EXP = new Array(512), LOG = new Array(256);
(function initGf() {
  var x = 1;
  for (var i = 0; i < 255; i++) {
    EXP[i] = x; LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11D;
  }
  for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
})();
function gfMul(a, b) {
  return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
}

/* Reed-Solomon generator polynomial of given degree: product of (x + a^i) */
function rsGenerator(degree) {
  var gen = [1];
  for (var i = 0; i < degree; i++) {
    var next = new Array(gen.length + 1);
    for (var k = 0; k < next.length; k++) next[k] = 0;
    for (var j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= gfMul(gen[j], EXP[i]);
    }
    gen = next;
  }
  return gen;
}

/* Reed-Solomon remainder: returns `degree` error-correction codewords */
function rsRemainder(data, degree) {
  var gen = rsGenerator(degree);
  var res = data.slice();
  for (var i = 0; i < degree; i++) res.push(0);
  for (var p = 0; p < data.length; p++) {
    var factor = res[p];
    if (factor !== 0) {
      for (var q = 0; q < gen.length; q++)
        res[p + q] ^= gfMul(gen[q], factor);
    }
  }
  return res.slice(data.length);
}

/* ---- bit buffer ---- */
function BitBuffer() { this.bits = []; }
BitBuffer.prototype.appendBits = function (val, len) {
  for (var i = len - 1; i >= 0; i--) this.bits.push((val >>> i) & 1);
};
BitBuffer.prototype.toBytes = function () {
  var out = [];
  for (var i = 0; i < this.bits.length; i += 8) {
    var b = 0;
    for (var j = 0; j < 8 && i + j < this.bits.length; j++)
      b = (b << 1) | this.bits[i + j];
    if ((i + 8) > this.bits.length) b <<= (8 - (this.bits.length - i));
    out.push(b);
  }
  return out;
};

function utf8Bytes(str) {
  if (typeof TextEncoder !== 'undefined')
    return Array.prototype.slice.call(new TextEncoder().encode(str));
  var s = unescape(encodeURIComponent(str)), out = [];
  for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i) & 0xFF);
  return out;
}

/* ---- version selection ---- */
function chooseVersion(dataLen, ecl) {
  for (var v = 1; v <= 7; v++) {
    var row = ECC[ecl][v];
    var totalData = row[2] * row[3];
    var needed = 4 + 8 + 8 * dataLen + 4; // mode + count + data + terminator
    if (Math.ceil(needed / 8) <= totalData) return v;
  }
  return 0; // too long
}

/* ---- matrix helpers ---- */
function makeMatrix(size, fill) {
  var m = new Array(size);
  for (var y = 0; y < size; y++) {
    m[y] = new Array(size);
    for (var x = 0; x < size; x++) m[y][x] = fill;
  }
  return m;
}

/* ---- main encode ---- */
function encode(text, ecl) {
  if (ecl !== 0 && ecl !== 1) ecl = 1;
  var data = utf8Bytes(String(text));
  if (data.length === 0) throw new Error('Enter some text first.');
  var version = chooseVersion(data.length, ecl);
  if (version === 0)
    throw new Error('Text too long for a QR code (max ~' +
      (ecl === 1 ? '122' : '154') + ' characters at this error-correction level). Shorten it or switch to level L.');

  var row = ECC[ecl][version];
  var ecPerBlock = row[1], numBlocks = row[2], dataPerBlock = row[3];
  var size = 17 + 4 * version;

  /* 1. data codewords */
  var bb = new BitBuffer();
  bb.appendBits(4, 4);                    // byte mode
  bb.appendBits(data.length, 8);          // character count (versions 1-9)
  for (var i = 0; i < data.length; i++) bb.appendBits(data[i], 8);
  var capacityBits = numBlocks * dataPerBlock * 8;
  var termBits = Math.min(4, capacityBits - bb.bits.length);
  bb.appendBits(0, termBits);
  while (bb.bits.length % 8 !== 0) bb.bits.push(0);
  var codewords = bb.toBytes();
  var pad = [0xEC, 0x11], pi = 0;
  while (codewords.length < numBlocks * dataPerBlock)
    codewords.push(pad[(pi++) % 2]);

  /* 2. split into blocks, add EC, interleave */
  var blocks = [];
  for (var b = 0; b < numBlocks; b++) {
    var blk = codewords.slice(b * dataPerBlock, (b + 1) * dataPerBlock);
    blocks.push({ data: blk, ec: rsRemainder(blk, ecPerBlock) });
  }
  var final = [];
  for (var k = 0; k < dataPerBlock; k++)
    for (var b2 = 0; b2 < numBlocks; b2++) final.push(blocks[b2].data[k]);
  for (var k2 = 0; k2 < ecPerBlock; k2++)
    for (var b3 = 0; b3 < numBlocks; b3++) final.push(blocks[b3].ec[k2]);

  /* 3. bit stream */
  var bits = [];
  for (var f = 0; f < final.length; f++)
    for (var bit = 7; bit >= 0; bit--) bits.push((final[f] >>> bit) & 1);
  for (var r = 0; r < REMAINDER_BITS[version]; r++) bits.push(0);

  /* 4. function patterns */
  var UNSET = -1;
  var modules = makeMatrix(size, UNSET);
  var isFunc = makeMatrix(size, false);
  function setFunc(x, y, v) { modules[y][x] = v; isFunc[y][x] = true; }

  function drawFinder(cx, cy) {
    for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= size || y >= size) continue;
      var dist = Math.max(Math.abs(dx), Math.abs(dy));
      setFunc(x, y, dist !== 2 && dist !== 4 ? 1 : 0);
    }
  }
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  for (var t = 8; t < size - 8; t++) {
    setFunc(t, 6, t % 2 === 0 ? 1 : 0);
    setFunc(6, t, t % 2 === 0 ? 1 : 0);
  }
  var ap = ALIGN_POS[version];
  for (var ai = 0; ai < ap.length; ai++) for (var aj = 0; aj < ap.length; aj++) {
    if ((ai === 0 && aj === 0) || (ai === 0 && aj === ap.length - 1) ||
        (ai === ap.length - 1 && aj === 0)) continue; // overlaps finders
    var ax = ap[aj], ay = ap[ai];
    for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++)
      setFunc(ax + dx2, ay + dy2, Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1 ? 1 : 0);
  }
  setFunc(8, 4 * version + 9, 1); // dark module (column 8)

  /* reserve format-info and version-info areas BEFORE data placement */
  for (var rfi = 0; rfi <= 5; rfi++) { setFunc(rfi, 8, 0); setFunc(8, rfi, 0); }
  setFunc(8, 7, 0); setFunc(7, 8, 0); setFunc(8, 8, 0);
  for (var rfi2 = 0; rfi2 <= 6; rfi2++) setFunc(8, size - 1 - rfi2, 0); // col 8, rows size-1..size-7
  for (var rfi3 = 0; rfi3 <= 7; rfi3++) setFunc(size - 8 + rfi3, 8, 0); // row 8, cols size-8..size-1
  if (version >= 7) {
    for (var rvi = 0; rvi < 18; rvi++) {
      setFunc(size - 11 + (rvi % 3), Math.floor(rvi / 3), 0);
      setFunc(Math.floor(rvi / 3), size - 11 + (rvi % 3), 0);
    }
  }

  /* 5. place data bits (zigzag) */
  var bi = 0;
  for (var right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // skip vertical timing column
    for (var vert = 0; vert < size; vert++) {
      for (var j = 0; j < 2; j++) {
        var x = right - j;
        var upward = ((right + 1) & 2) === 0;
        var y = upward ? size - 1 - vert : vert;
        if (modules[y][x] === UNSET && bi < bits.length) {
          modules[y][x] = bits[bi++];
        }
      }
    }
  }
  if (bi !== bits.length) throw new Error('Internal QR layout error.');

  /* 6. masking */
  function maskBit(mask, x, y) {
    switch (mask) {
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
      case 5: return ((x * y) % 2 + (x * y) % 3) === 0;
      case 6: return (((x * y) % 2 + (x * y) % 3) % 2) === 0;
      default: return (((x + y) % 2 + (x * y) % 3) % 2) === 0;
    }
  }
  function applyMask(mask) {
    var out = makeMatrix(size, 0);
    for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
      var v = modules[y][x];
      out[y][x] = (!isFunc[y][x] && maskBit(mask, x, y)) ? 1 - v : v;
    }
    return out;
  }
  function penalty(m) {
    var p = 0, x, y;
    // Rule 1: consecutive runs
    for (y = 0; y < size; y++) {
      var run = 1, prev = m[y][0];
      for (x = 1; x < size; x++) {
        if (m[y][x] === prev) { run++; } else {
          if (run >= 5) p += 3 + (run - 5);
          run = 1; prev = m[y][x];
        }
      }
      if (run >= 5) p += 3 + (run - 5);
    }
    for (x = 0; x < size; x++) {
      var run2 = 1, prev2 = m[0][x];
      for (y = 1; y < size; y++) {
        if (m[y][x] === prev2) { run2++; } else {
          if (run2 >= 5) p += 3 + (run2 - 5);
          run2 = 1; prev2 = m[y][x];
        }
      }
      if (run2 >= 5) p += 3 + (run2 - 5);
    }
    // Rule 2: 2x2 blocks
    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
      var c = m[y][x];
      if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
    }
    // Rule 3: finder-like patterns
    function pat(line) {
      for (var i = 0; i <= line.length - 11; i++) {
        var s = line.slice(i, i + 11).join('');
        if (s === '10111010000' || s === '00001011101') p += 40;
      }
    }
    for (y = 0; y < size; y++) pat(m[y]);
    for (x = 0; x < size; x++) {
      var col = [];
      for (y = 0; y < size; y++) col.push(m[y][x]);
      pat(col);
    }
    // Rule 4: dark ratio
    var dark = 0;
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) dark += m[y][x];
    var ratio = dark * 100 / (size * size);
    p += Math.floor(Math.abs(ratio - 50) / 5) * 10;
    return p;
  }
  var bestMask = 0, bestScore = Infinity, masked = null;
  for (var mk = 0; mk < 8; mk++) {
    var cand = applyMask(mk);
    var score = penalty(cand);
    if (score < bestScore) { bestScore = score; bestMask = mk; masked = cand; }
  }

  /* 7. format info: 15 bits b14..b0 */
  var fmt = FORMAT_INFO[(ecl === 1 ? 8 : 0) + bestMask];
  function gbit(v, i) { return (v >>> i) & 1; }
  // top-left copy
  for (var fi = 0; fi <= 5; fi++) masked[8][fi] = gbit(fmt, 14 - fi); // (8,0..5)=b14..b9
  masked[8][7] = gbit(fmt, 8);
  masked[8][8] = gbit(fmt, 7);
  masked[7][8] = gbit(fmt, 6);
  for (var fj = 0; fj <= 5; fj++) masked[5 - fj][8] = gbit(fmt, 5 - fj); // (5..0,8)=b5..b0
  // second copy, vertical: (size-1..size-7, 8) = b14..b8
  for (var fk = 0; fk <= 6; fk++) masked[size - 1 - fk][8] = gbit(fmt, 14 - fk);
  // second copy, horizontal: (8, size-8..size-1) = b7..b0
  for (var fl = 0; fl <= 7; fl++) masked[8][size - 8 + fl] = gbit(fmt, 7 - fl);

  /* 8. version info (v7) */
  if (version >= 7) {
    var vi = VERSION_INFO[version];
    for (var k3 = 0; k3 < 18; k3++) {
      var b = gbit(vi, k3);
      masked[size - 11 + (k3 % 3)][Math.floor(k3 / 3)] = b;
      masked[Math.floor(k3 / 3)][size - 11 + (k3 % 3)] = b;
    }
  }

  return { size: size, modules: masked, version: version, mask: bestMask, ecl: ecl };
}

var api = { encode: encode };
/* test hooks (not part of public API) */
api._rsRemainder = rsRemainder;
api._rsGenerator = rsGenerator;
api._gfMul = gfMul;
api._ECC = ECC;
api._FORMAT_INFO = FORMAT_INFO;

if (typeof module !== 'undefined' && module.exports) module.exports = api;
else root.QRCode = api;

})(typeof window !== 'undefined' ? window : globalThis);
