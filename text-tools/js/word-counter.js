/* Word counter: words, chars, chars-no-space, sentences, paragraphs, reading time */
document.addEventListener('DOMContentLoaded', function () {
  var ta = document.getElementById('wc-input');
  if (!ta) return;
  function count() {
    var text = ta.value;
    var words = (text.trim().match(/\S+/g) || []).length;
    var chars = text.length;
    var charsNoSpace = text.replace(/\s/g, '').length;
    var sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length;
    var paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n|\n/).filter(function (p) { return p.trim().length > 0; }).length;
    var readingMin = words / 200;
    var reading = words === 0 ? '0 sec' :
      (readingMin < 1 ? Math.max(1, Math.round(readingMin * 60)) + ' sec'
        : Math.floor(readingMin) + ' min ' + Math.round((readingMin % 1) * 60) + ' sec');
    var speaking = words === 0 ? '0 sec' :
      Math.floor(words / 150) + ' min ' + Math.round((words / 150 % 1) * 60) + ' sec';
    set('st-words', words); set('st-chars', chars); set('st-charsns', charsNoSpace);
    set('st-sent', sentences); set('st-para', paragraphs);
    set('st-read', reading); set('st-speak', speaking);
  }
  function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  ta.addEventListener('input', count);
  count();
});
