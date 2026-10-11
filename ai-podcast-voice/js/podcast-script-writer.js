/* Podcast Script Writer: interview / solo / narrative structured scripts */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('swForm');
  if(!form) return;
  form.querySelectorAll('input[name=format]').forEach(function(r){
    r.addEventListener('change', function(){
      $('guestField').style.display = (document.querySelector('input[name=format]:checked').value === 'interview') ? '' : 'none';
    });
  });
  form.addEventListener('submit', function(e){ e.preventDefault(); generateScript(); });
});

function tsAt(frac, totalMin){
  return mmss(Math.round(frac * totalMin * 60));
}

function generateScript(){
  var box = $('swResults');
  var title = ($('swTitle').value || '').trim();
  var topic = ($('swTopic').value || '').trim();
  var format = document.querySelector('input[name=format]:checked').value;
  var totalMin = parseInt($('swDuration').value, 10) || 30;
  var guest = ($('swGuest').value || '').trim() || 'our guest';
  if(title.length < 3 || topic.length < 3){ setError('swResults', 'Please enter an episode title and topic (at least 3 characters each).'); return; }

  var topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  var lines = []; /* {t, speaker, cue, text} */

  if(format === 'interview'){
    lines = [
      {t:tsAt(0,totalMin), speaker:'HOST', cue:'[Cold open: best 20s clip from later in the episode]',
       text:'"' + topicCap + ' changed everything for me when..." — wait for it. This is ' + title + ', and today we go deep.'},
      {t:tsAt(0.03,totalMin), speaker:'HOST', cue:'[Theme music fades under]',
       text:'Welcome back to the show. I’m your host, and today we’re talking ' + topic + ' — what it really is, what the hype gets wrong, and what actually works. Joining me is ' + guest + '. Welcome!'},
      {t:tsAt(0.08,totalMin), speaker:'GUEST', cue:'',
       text:'Thanks for having me — this is one of my favorite topics, so let’s get into it.'},
      {t:tsAt(0.10,totalMin), speaker:'HOST', cue:'[Question 1: origin story]',
       text:'Let’s start at the beginning. How did you first get into ' + topic + ', and what pulled you in?'},
      {t:tsAt(0.28,totalMin), speaker:'HOST', cue:'[Question 2: the misconception]',
       text:'What’s the biggest misconception people have about ' + topic + '?'},
      {t:tsAt(0.46,totalMin), speaker:'HOST', cue:'[Question 3: practical]',
       text:'For someone listening who wants to start with ' + topic + ' this week — what’s the single most important first step?'},
      {t:tsAt(0.64,totalMin), speaker:'HOST', cue:'[Question 4: future]',
       text:'Where do you see ' + topic + ' going in the next two years? What should listeners watch for?'},
      {t:tsAt(0.80,totalMin), speaker:'HOST', cue:'[Lightning round: 30-second answers]',
       text:'Lightning round — quick answers. Best resource on ' + topic + '? One tool you can’t live without? Biggest mistake beginners make?'},
      {t:tsAt(0.88,totalMin), speaker:'HOST', cue:'[Wrap]',
       text: guest + ', this was fantastic. Where can listeners find you and your work on ' + topic + '?'},
      {t:tsAt(0.94,totalMin), speaker:'HOST', cue:'[Outro: CTA + theme music]',
       text:'That’s ' + title + '. If this helped you, share it with one person and leave a review — it keeps the show going. See you next time.'}
    ];
  } else if(format === 'solo'){
    lines = [
      {t:tsAt(0,totalMin), speaker:'HOST', cue:'[Hook: no intro music yet]',
       text:'Nobody talks about this side of ' + topic + ' — but after today, you’ll see it completely differently.'},
      {t:tsAt(0.04,totalMin), speaker:'HOST', cue:'[Theme music, then under]',
       text:'Welcome to ' + title + '. I’m your host. Today: ' + topic + ' — the full breakdown, no fluff. Three big ideas, let’s go.'},
      {t:tsAt(0.10,totalMin), speaker:'HOST', cue:'[Idea 1]',
       text:'Idea one: the foundation of ' + topic + '. Here’s what it actually means, in plain English... [tell a personal story or example here]'},
      {t:tsAt(0.38,totalMin), speaker:'HOST', cue:'[Idea 2]',
       text:'Idea two — and this is where most people mess up ' + topic + '. The mistake is... and here’s the fix...'},
      {t:tsAt(0.64,totalMin), speaker:'HOST', cue:'[Idea 3]',
       text:'Idea three: the advanced move. Once you’ve got the basics of ' + topic + ' down, this is what separates the pros...'},
      {t:tsAt(0.86,totalMin), speaker:'HOST', cue:'[Recap]',
       text:'Quick recap: one — [foundation]; two — [avoid the mistake]; three — [the pro move]. Write those down.'},
      {t:tsAt(0.94,totalMin), speaker:'HOST', cue:'[CTA + outro music]',
       text:'If you got value from this, subscribe and share it with someone learning ' + topic + '. See you in the next episode.'}
    ];
  } else {
    lines = [
      {t:tsAt(0,totalMin), speaker:'NARRATOR', cue:'[Cold open: ambient sound, a scene in progress]',
       text:'It was supposed to be an ordinary day. Then ' + topic + ' changed everything...'},
      {t:tsAt(0.05,totalMin), speaker:'NARRATOR', cue:'[Title card music]',
       text:'This is ' + title + ' — a story about ' + topic + '. I’m your narrator.'},
      {t:tsAt(0.10,totalMin), speaker:'NARRATOR', cue:'[Act 1: set the world]',
       text:'To understand what happened, you have to understand the world before ' + topic + '. Picture it: [describe the setting, the stakes, the people].'},
      {t:tsAt(0.38,totalMin), speaker:'NARRATOR', cue:'[Act 2: the turn — music shifts]',
       text:'And then, the turn. [Describe the pivotal moment around ' + topic + '. Raise the tension. End the act on a question.]'},
      {t:tsAt(0.66,totalMin), speaker:'NARRATOR', cue:'[Act 3: climax]',
       text:'This is the moment everything hinged on. [Describe the climax — the decision, the discovery, the confrontation involving ' + topic + '.]'},
      {t:tsAt(0.86,totalMin), speaker:'NARRATOR', cue:'[Resolution: music softens]',
       text:'In the end, ' + topic + ' taught us this: [the theme, the lesson, the lingering question].'},
      {t:tsAt(0.95,totalMin), speaker:'NARRATOR', cue:'[Credits + CTA]',
       text:'Thanks for listening to ' + title + '. Subscribe for the next story — and tell a friend who loves a good mystery.'}
    ];
  }

  var htmlOut = '<div class="result-hero"><div class="lbl">Structured script</div><div class="big">' + esc(title) + '</div>' +
    '<div class="lbl">' + format.charAt(0).toUpperCase()+format.slice(1) + ' format &middot; ~' + totalMin + ' min &middot; ' + lines.length + ' cues</div></div>';
  lines.forEach(function(l){
    htmlOut += '<div class="script-line"><div class="meta"><span class="ts">' + l.t + '</span><span class="speaker">' + esc(l.speaker) + '</span>' +
      (l.cue ? '<span class="cue">' + esc(l.cue) + '</span>' : '') + '</div><p>' + esc(l.text) + '</p></div>';
  });
  htmlOut += '<button type="button" class="btn btn-primary" id="copyScript">Copy script as text</button>';
  box.innerHTML = htmlOut;

  var plain = title.toUpperCase() + ' — ' + format.toUpperCase() + ' SCRIPT (~' + totalMin + ' min)\nTopic: ' + topic + '\n\n' +
    lines.map(function(l){ return '[' + l.t + '] ' + l.speaker + (l.cue ? ' ' + l.cue : '') + '\n' + l.text; }).join('\n\n');
  $('copyScript').addEventListener('click', function(){ copyText(plain, this); });
}
