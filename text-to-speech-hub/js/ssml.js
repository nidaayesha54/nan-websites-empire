// SSML Helper — builds an SSML snippet from selected tags
(function(){
  var out = document.getElementById('ssmlOut');
  var copyBtn = document.getElementById('ssmlCopy');
  var desc = document.getElementById('ssmlDesc');

  var tagDocs = {
    break: '<break> — inserts a pause. Attributes: time (e.g. "500ms", "1s") or strength ("x-weak" … "x-strong").',
    emphasis: '<emphasis> — stresses a word. Levels: "strong", "moderate", "reduced".',
    prosody: '<prosody> — controls rate, pitch, volume. E.g. rate="slow", pitch="+10%", volume="loud".',
    sayAs: '<say-as> — pronunciation hint: interpret-as="date", "time", "digits", "spell-out".',
    sub: '<sub> — alias substitution: alias="read this instead" for abbreviations.',
    paragraph: '<p> — paragraph break (strong pause between blocks of text).',
    sentence: '<s> — sentence break (moderate pause between sentences).',
    whisper: 'Amazon Polly / Google <amazon:effect name="whispered"> — whispered voice effect.',
    lang: '<lang> — switches language mid-text, e.g. xml:lang="es-ES".'
  };

  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function build(){
    var base = document.getElementById('ssmlBase').value.trim() || 'Your text goes here.';
    var selected = [];
    document.querySelectorAll('.tagcheck:checked').forEach(function(c){ selected.push(c.value); });

    var notes = selected.map(function(t){ return '• ' + tagDocs[t]; }).join('\n');
    desc.innerHTML = selected.length ? esc(notes).replace(/\n/g,'<br>') : 'Select one or more tags above to see what each does.';

    var inner = esc(base);
    var wrapped = inner;

    if(selected.indexOf('paragraph') > -1) wrapped = '<p>' + wrapped + '</p>';
    if(selected.indexOf('sentence') > -1) wrapped = wrapped.replace(/\. /g, '. </s><s> ');
    if(selected.indexOf('break') > -1) wrapped = wrapped.replace(/, /g, ',<break time="400ms"/> ');
    if(selected.indexOf('emphasis') > -1) wrapped = wrapped.replace(/\b(amazing|incredible|never|always|free|secret|new)\b/i, '<emphasis level="strong">$1</emphasis>');
    if(selected.indexOf('prosody') > -1) wrapped = '<prosody rate="95%" pitch="+5%">' + wrapped + '</prosody>';
    if(selected.indexOf('sayAs') > -1) wrapped = wrapped.replace(/\b\d{3}-\d{3}-\d{4}\b/g, '<say-as interpret-as="digits">$&</say-as>');
    if(selected.indexOf('sub') > -1) wrapped = wrapped.replace(/\b(USA|AI|CEO)\b/g, '<sub alias="U. S. A.">$1</sub>');
    if(selected.indexOf('whisper') > -1) wrapped = '<amazon:effect name="whispered">' + wrapped + '</amazon:effect>';
    if(selected.indexOf('lang') > -1) wrapped = wrapped + ' <lang xml:lang="es-ES">¡Hola!</lang>';

    var ssml = '<speak>\n  ' + wrapped + '\n</speak>';
    out.textContent = ssml;
    return ssml;
  }

  document.getElementById('ssmlBuild').addEventListener('click', build);
  document.querySelectorAll('.tagcheck').forEach(function(c){ c.addEventListener('change', build); });
  copyBtn.addEventListener('click', function(){
    var t = out.textContent;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ copyBtn.textContent = 'Copied!'; setTimeout(function(){ copyBtn.textContent = 'Copy SSML'; }, 1500); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      copyBtn.textContent = 'Copied!';
    }
  });
  build();
})();
