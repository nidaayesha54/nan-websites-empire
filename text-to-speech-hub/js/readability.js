// Readability Scorer — Flesch Reading Ease, Flesch-Kincaid Grade + spoken duration
(function(){
  var input = document.getElementById('readText');
  var out = document.getElementById('readOut');

  function countSyllables(word){
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if(!word) return 0;
    if(word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]e|ed|[^laeiouy]es)$/, '');
    word = word.replace(/^y/, '');
    var m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  function gradeLabel(ease){
    if(ease >= 90) return 'Very easy — 5th grade (great for spoken scripts)';
    if(ease >= 80) return 'Easy — 6th grade';
    if(ease >= 70) return 'Fairly easy — 7th grade';
    if(ease >= 60) return 'Standard — 8th–9th grade';
    if(ease >= 50) return 'Fairly difficult — 10th–12th grade';
    if(ease >= 30) return 'Difficult — college level (simplify for voice)';
    return 'Very difficult — simplify before recording';
  }

  function analyze(){
    var t = input.value.trim();
    if(!t){ out.innerHTML = '<p class="status">Paste your script above to score it.</p>'; return; }
    var words = t.split(/\s+/).filter(Boolean);
    var sentences = t.split(/[.!?…]+/).filter(function(s){ return s.trim().length > 0; });
    var syllables = words.reduce(function(sum, w){ return sum + countSyllables(w); }, 0);
    var wCount = words.length, sCount = Math.max(sentences.length, 1);

    var ease = 206.835 - 1.015 * (wCount / sCount) - 84.6 * (syllables / wCount);
    ease = Math.max(0, Math.min(100, ease));
    var grade = 0.39 * (wCount / sCount) + 11.8 * (syllables / wCount) - 15.59;
    grade = Math.max(0, grade);

    var mins = wCount / 150, m = Math.floor(mins), s = Math.round((mins - m) * 60);
    var avgLen = (wCount / sCount).toFixed(1);

    out.innerHTML =
      '<div class="score-big">' + ease.toFixed(1) + '</div>' +
      '<p><b>Flesch Reading Ease:</b> ' + ease.toFixed(1) + ' — ' + gradeLabel(ease) + '</p>' +
      '<table>' +
      '<tr><th>Flesch-Kincaid Grade Level</th><td><b>' + grade.toFixed(1) + '</b></td></tr>' +
      '<tr><th>Words</th><td>' + wCount.toLocaleString() + '</td></tr>' +
      '<tr><th>Sentences</th><td>' + sCount + '</td></tr>' +
      '<tr><th>Syllables</th><td>' + syllables.toLocaleString() + '</td></tr>' +
      '<tr><th>Avg. sentence length</th><td>' + avgLen + ' words</td></tr>' +
      '<tr><th>Estimated spoken duration</th><td><b>' + m + 'm ' + s + 's</b> @150 wpm</td></tr>' +
      '</table>' +
      (ease < 60 ? '<p class="status">💡 Voice tip: short sentences (under 20 words) and plain words score higher and sound more natural when spoken aloud.</p>' : '<p class="status">✅ Voice-ready: this script will sound natural when read aloud.</p>');
  }

  document.getElementById('readScore').addEventListener('click', analyze);
  input.addEventListener('input', analyze);
})();
