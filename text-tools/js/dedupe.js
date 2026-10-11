/* Remove duplicate lines */
function dedupe() {
  var ta = document.getElementById('dd-input');
  if (!ta) return;
  var caseSensitive = document.getElementById('dd-case').checked;
  var trimLines = document.getElementById('dd-trim').checked;
  var ignoreEmpty = document.getElementById('dd-empty').checked;
  var seen = {}, result = [], removed = 0;
  ta.value.split('\n').forEach(function (line) {
    var l = trimLines ? line.trim() : line;
    if (ignoreEmpty && l === '') return;
    var key = caseSensitive ? l : l.toLowerCase();
    if (seen[key]) { removed++; return; }
    seen[key] = true;
    result.push(l);
  });
  document.getElementById('dd-output').value = result.join('\n');
  var st = document.getElementById('dd-stats');
  if (st) st.textContent = result.length + ' unique lines · ' + removed + ' duplicates removed';
}
