/* DogTrainingHub — training plan generator */
(function () {
  'use strict';

  var WEEKS = [
    {
      focus: 'Name, Marker Word & Attention',
      tasks: [
        'Charge your marker: say "Yes!" then treat, 20 times. Your dog should light up at the word.',
        'Name game: say their name once — when they look, mark and treat. 10 reps, twice daily.',
        'Hand target: hold out your palm; mark and treat any nose touch. Builds a recall foundation.',
        'Start the potty routine: outside after waking, eating, playing and napping — reward within 3 seconds.'
      ]
    },
    {
      focus: 'Sit & House Rules',
      tasks: [
        'Teach Sit by luring with a treat from nose up over the head. Add the word only once they get it.',
        'Reward "default sits" — anytime your dog sits on their own near you, pay it.',
        'Begin crate introduction: feed meals inside with the door open. See our crate training guide.',
        'Practice collar grabs: touch collar, treat. Prevents hand-shyness later.'
      ]
    },
    {
      focus: 'Down, Stay Foundations & Leash Intro',
      tasks: [
        'Teach Down by luring from Sit toward the floor between the paws.',
        'Stay: ask for Sit, wait 2 seconds, mark and treat. Build to 10 seconds this week.',
        'Leash = treats: clip the leash on indoors and play. No walks yet — just happy associations.',
        'Continue socialization: 3–5 new positive sights, sounds and surfaces this week.'
      ]
    },
    {
      focus: 'Come When Called (Recall Games)',
      tasks: [
        'Indoor recall ping-pong: two people call the dog back and forth, jackpot treats every time.',
        'Never call your dog to punish them — coming to you must always be the best decision.',
        'Practice "check-ins": on walks, reward every voluntary look at you.',
        'Add mild distractions to Sit and Down before increasing difficulty.'
      ]
    },
    {
      focus: 'Leave It, Drop It & Politeness',
      tasks: [
        'Leave It: treat in closed fist — mark the moment they back off, reward from the other hand.',
        'Drop It: trade a toy for a high-value treat. Never chase or pry jaws open.',
        'No-jump protocol: turn away when paws leave the floor; reward four-on-the-floor greetings.',
        'Practice polite door manners: Sit before the door opens.'
      ]
    },
    {
      focus: 'Loose-Leash Walking',
      tasks: [
        'Be-a-tree: the instant the leash tightens, stop. Move forward only on a loose leash.',
        'Reward position: treat at your left side every few steps to build the habit.',
        'Direction changes: when your dog forges ahead, turn and walk the other way cheerfully.',
        'Practice in boring locations first — your driveway beats the dog park for learning.'
      ]
    },
    {
      focus: 'Place, Settling & Public Manners',
      tasks: [
        'Teach Place: send to a mat or bed, reward lying down. Build duration while you eat dinner.',
        'Captured calmness: quietly treat your dog whenever they settle on their own.',
        'Practice café manners: Sit/Down/Place with distractions at increasing distance.',
        'Greeting drills: Sit for petting from friends; no petting if they jump.'
      ]
    },
    {
      focus: 'Proofing & Real-World Reliability',
      tasks: [
        'Add the 3 D\u2019s: increase Distance, Duration and Distraction one at a time — never all three.',
        'Recall from 30 feet on a long line in a safe area. Jackpot every success.',
        'Run a graduation test: Sit, Down, Stay (30 sec), Come, Leave It, loose-leash around the block.',
        'Plan maintenance: 2–3 short refresher sessions per week keeps skills sharp for life.'
      ]
    }
  ];

  var AGE_INFO = {
    'puppy-8-16': {
      label: 'Puppy (8–16 weeks)',
      session: '3–5 minute sessions, 4–6 times per day',
      note: 'The socialization window closes around 14 weeks — aim for 5 positive new experiences daily (sounds, surfaces, people, gentle dogs). Keep everything fun; this age is about exposure, not perfection.'
    },
    'puppy-4-6': {
      label: 'Puppy (4–6 months)',
      session: '5 minute sessions, 3–4 times per day',
      note: 'Teething is in full swing — provide frozen carrots, Kongs and safe chews. Expect short attention spans; end every session on a win.'
    },
    'adolescent': {
      label: 'Adolescent (6–12 months)',
      session: '5–10 minute sessions, 2–3 times per day',
      note: 'Welcome to the teenage phase! Regression is normal — previously solid cues may fall apart. Stay patient, go back to basics, and heavily reward good choices.'
    },
    'adult': {
      label: 'Adult (1–3 years)',
      session: '10 minute sessions, 2 times per day',
      note: 'Adult dogs can handle longer sessions and more complex chains. This is a great age to add distance, duration and distraction to every cue.'
    },
    'senior': {
      label: 'Senior (3+ years)',
      session: '5–8 minute low-impact sessions, 1–2 times per day',
      note: 'Old dogs absolutely learn new tricks! Keep sessions gentle on joints, use soft treats, and enjoy training as enrichment that keeps their mind sharp.'
    }
  };

  var ISSUE_INFO = {
    'barking': { drill: 'Quiet cue: wait for 2 seconds of silence, mark and treat. Build to 10 seconds before adding the word "Quiet".', tip: 'Never yell — your dog thinks you are barking along.' },
    'jumping': { drill: 'Four-on-the-floor: turn away the instant paws lift; reward the moment all feet are down. Ask for Sit before every greeting.', tip: 'Make sure guests follow the same rule — consistency wins.' },
    'leash-pulling': { drill: 'Be-a-tree + reward position: stop on tension, treat at your side. Practice 5 minutes daily.', tip: 'A front-clip harness helps while training catches up.' },
    'potty-accidents': { drill: 'Back to basics: hourly outings, reward outdoor success within 3 seconds, clean accidents with enzymatic cleaner.', tip: 'Punishing accidents only teaches your dog to hide them.' },
    'chewing': { drill: 'Trade-up game: offer a high-value treat for forbidden items; redirect to legal chews.', tip: 'Management first — if they cannot reach it, they cannot chew it.' },
    'separation-anxiety': { drill: 'Alone-training: leave for 30 seconds, return calmly before panic. Build time in tiny increments.', tip: 'Desensitize departure cues (keys, shoes) without actually leaving.' },
    'nipping': { drill: 'Reverse time-out: the instant teeth touch skin, play ends for 20 seconds. Redirect to a toy.', tip: 'Overtired puppies nip more — enforce nap times!' },
    'recall': { drill: 'Never chase your dog. Practice recall on a long line with jackpot rewards for every return.', tip: 'Reward voluntary check-ins on walks — coming close should always pay.' },
    'none': { drill: 'Fantastic! Use this plan to polish skills and add fun tricks each week.', tip: 'Maintenance sessions twice a week keep good behavior permanent.' }
  };

  var GOAL_INFO = {
    'basic-obedience': 'Sit, Down, Stay and Come reliable indoors by week 8',
    'potty-training': 'Accident-free streaks growing; puppy signals at the door by week 6+',
    'loose-leash': 'Slack-leash walks around the block by week 8',
    'tricks': '3+ fun tricks learned (Shake, Spin, Roll Over) — log them in the command tracker',
    'calm-behavior': 'Settles on mat during meals; greets guests politely',
    'socialization': '100 positive exposures checklist completed',
    'recall': 'Comes from 30 feet away with mild distractions'
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function checkedValues(name) {
    var out = [];
    var boxes = document.querySelectorAll('input[name="' + name + '"]:checked');
    for (var i = 0; i < boxes.length; i++) out.push(boxes[i].value);
    return out;
  }

  function buildPlan() {
    var rawName = document.getElementById('dog-name').value.trim();
    var name = rawName ? rawName : 'your dog';
    var ageKey = document.getElementById('dog-age').value;
    var age = AGE_INFO[ageKey] || AGE_INFO['puppy-8-16'];
    var issues = checkedValues('issue');
    if (issues.length === 0) issues = ['none'];
    var goals = checkedValues('goal');

    var html = '';
    html += '<div class="tool-form" style="border-left:6px solid var(--green)">';
    html += '<h2 style="color:var(--green-dark);margin-bottom:8px">🐶 ' + esc(name) + '\u2019s 8-Week Training Plan</h2>';
    html += '<p><strong>Age group:</strong> ' + esc(age.label) + '<br>';
    html += '<strong>Session style:</strong> ' + esc(age.session) + '</p>';
    html += '<p>' + esc(age.note) + '</p>';
    html += '<p><strong>Your goals by week 8:</strong></p><ul>';
    if (goals.length === 0) {
      html += '<li>Pick at least one goal above and regenerate — but the core plan below still works!</li>';
    } else {
      for (var g = 0; g < goals.length; g++) {
        html += '<li>' + esc(GOAL_INFO[goals[g]] || goals[g]) + '</li>';
      }
    }
    html += '</ul></div>';

    for (var w = 0; w < WEEKS.length; w++) {
      var week = WEEKS[w];
      html += '<div class="week-card">';
      html += '<h3>Week ' + (w + 1) + ': ' + esc(week.focus) + '</h3><ul>';
      for (var t = 0; t < week.tasks.length; t++) {
        html += '<li>' + esc(week.tasks[t]) + '</li>';
      }
      // Rotate issue drills across weeks so every issue gets covered
      var issue = ISSUE_INFO[issues[w % issues.length]];
      html += '<li><strong>🎯 Issue drill:</strong> ' + esc(issue.drill) + '</li>';
      html += '</ul></div>';
    }

    html += '<div class="tip"><strong>💡 Golden rules for all 8 weeks:</strong><ul>';
    html += '<li>Reward within 3 seconds — timing is everything.</li>';
    html += '<li>End every session on a success, even an easy one.</li>';
    html += '<li>Never punish mistakes — redirect and reward the right choice.</li>';
    html += '<li>Everyone in the household uses the same cues and rules.</li>';
    html += '</ul></div>';

    var tips = [];
    for (var i = 0; i < issues.length; i++) {
      if (ISSUE_INFO[issues[i]] && ISSUE_INFO[issues[i]].tip) tips.push(ISSUE_INFO[issues[i]].tip);
    }
    if (tips.length) {
      html += '<div class="warn"><strong>⚠️ For your specific issues:</strong><ul>';
      for (var k = 0; k < tips.length; k++) html += '<li>' + esc(tips[k]) + '</li>';
      html += '</ul></div>';
    }

    html += '<p class="text-center mt"><button type="button" class="btn btn-green" onclick="window.print()">🖨️ Print My Plan</button></p>';

    return html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('plan-form');
    var result = document.getElementById('plan-result');
    // Uncheck "none" if a real issue is chosen, and vice versa
    var boxes = document.querySelectorAll('input[name="issue"]');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener('change', function () {
        var noneBox = document.querySelector('input[name="issue"][value="none"]');
        if (this.value === 'none' && this.checked) {
          for (var j = 0; j < boxes.length; j++) if (boxes[j].value !== 'none') boxes[j].checked = false;
        } else if (this.checked && noneBox.checked) {
          noneBox.checked = false;
        }
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      result.innerHTML = buildPlan();
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
