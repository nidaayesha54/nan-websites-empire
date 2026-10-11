/* Case converter */
function convertCase(mode) {
  var ta = document.getElementById('cc-input');
  if (!ta) return;
  var t = ta.value;
  var out = t;
  if (mode === 'upper') out = t.toUpperCase();
  else if (mode === 'lower') out = t.toLowerCase();
  else if (mode === 'title') out = t.toLowerCase().replace(/(?<=\s|^|[([{-])\S/g, function (m) { return m.toUpperCase(); });
  else if (mode === 'sentence') out = t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function (c) { return c.toUpperCase(); });
  else if (mode === 'alt') {
    var r = '', up = true;
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (/[a-zA-Z]/.test(ch)) { r += up ? ch.toUpperCase() : ch.toLowerCase(); up = !up; }
      else r += ch;
    }
    out = r;
  } else if (mode === 'inverse') {
    out = t.split('').map(function (c) {
      return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
    }).join('');
  }
  var o = document.getElementById('cc-output');
  if (o) o.value = out;
}
