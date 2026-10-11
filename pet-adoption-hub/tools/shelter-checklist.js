/* PetAdoptionHub — Shelter Visit Checklist */
(function () {
  'use strict';

  var ITEMS = {
    before: [
      'Photo ID and proof of address packed',
      'Written landlord pet permission (if renting)',
      'List of everyone in the household + their availability to meet the pet',
      'Budget estimate done (try our cost calculator)',
      'Shelter hours, fees, and adoption policy checked online',
      'Carrier or leash + collar ready in the car',
      'List of your current pets\' vaccination records'
    ],
    observe: [
      'Is the kennel/cattery clean, dry, and odor-controlled?',
      'Do staff handle animals gently and know them by name?',
      'Does the animal approach you calmly (not cowering or frantic)?',
      'Check eyes, nose, coat: clear, clean, no discharge or bald patches',
      'Watch the animal eat or take a treat — appetite is a health signal',
      'Ask to spend 15–20 min in a meet-and-greet room, not just the kennel',
      'Note energy level: matches your lifestyle? (couch potato vs. marathoner)',
      'Observe with kids/other dogs if relevant to your home'
    ]
  };

  var QUESTIONS = {
    dog: [
      'Why was this dog surrendered? Any known bite or aggression history?',
      'How is the dog with kids, cats, and other dogs?',
      'Is the dog house-trained? Crate-trained?',
      'What is the dog\'s energy level and daily exercise need?',
      'Any known medical issues or ongoing medication?',
      'Has the dog been spayed/neutered, vaccinated, and microchipped?',
      'How does the dog behave on leash and in the car?',
      'What food is the dog currently eating?',
      'Has the dog had any professional training or behavioral assessment?',
      'What is the return policy if the adoption doesn\'t work out?'
    ],
    cat: [
      'Why was this cat surrendered? Any litter-box issues?',
      'Is the cat comfortable being held and handled?',
      'How is the cat with other cats, dogs, and kids?',
      'Any known medical issues (FIV/FeLV status?) or medication?',
      'Is the cat spayed/neutered, vaccinated, and microchipped?',
      'Indoor-only, or used to going outside?',
      'What litter and food is the cat currently using?',
      'Is the cat a lap cat, playful, or independent — what\'s the personality?',
      'Any history of scratching furniture (and declawed status — hopefully not)?',
      'What is the return policy if the adoption doesn\'t work out?'
    ],
    small: [
      'What is the animal\'s age and expected lifespan?',
      'Any known health issues or special dietary needs?',
      'Is the animal handled regularly / socialized with people?',
      'What size habitat does this animal need as an adult?',
      'What is the animal\'s current diet — exact brands and portions?',
      'Is the animal bonded to a cage-mate that must be adopted together?',
      'Any species-specific legal restrictions in my state/city?',
      'Do you have a care sheet I can take home?',
      'What is the return policy if the adoption doesn\'t work out?',
      'Which exotic vet nearby do you recommend?'
    ]
  };

  var STORE_KEY = 'pah_shelter_checklist_v1';

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  var state = loadState();
  var total = 0, done = 0;

  function render(containerId, items) {
    var box = document.getElementById(containerId);
    items.forEach(function (text) {
      var key = containerId + '|' + text;
      total++;
      var label = document.createElement('label');
      label.className = 'check-item' + (state[key] ? ' done' : '');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!state[key];
      if (input.checked) { done++; }
      var span = document.createElement('span');
      span.className = 'txt';
      span.textContent = text;
      input.addEventListener('change', function () {
        state[key] = input.checked;
        saveState(state);
        label.classList.toggle('done', input.checked);
        updateProgress();
      });
      label.appendChild(input);
      label.appendChild(span);
      box.appendChild(label);
    });
  }

  function updateProgress() {
    var d = 0;
    Object.keys(state).forEach(function (k) { if (state[k]) { d++; } });
    document.getElementById('progress-fill').style.width = Math.round(d / total * 100) + '%';
    document.getElementById('progress-text').textContent = d + ' of ' + total + ' done';
  }

  render('checklist-before', ITEMS.before);
  render('checklist-observe', ITEMS.observe);
  updateProgress();

  document.getElementById('reset-btn').addEventListener('click', function () {
    if (!confirm('Reset all checklist progress?')) { return; }
    state = {};
    saveState(state);
    document.getElementById('checklist-before').innerHTML = '';
    document.getElementById('checklist-observe').innerHTML = '';
    total = 0; done = 0;
    render('checklist-before', ITEMS.before);
    render('checklist-observe', ITEMS.observe);
    updateProgress();
  });

  document.getElementById('print-btn').addEventListener('click', function () {
    window.print();
  });

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  document.getElementById('qgen-btn').addEventListener('click', function () {
    var type = document.getElementById('qgen-type').value;
    var list = shuffled(QUESTIONS[type]).slice(0, 8);
    var out = document.getElementById('qgen-output');
    out.innerHTML = '';
    list.forEach(function (q) {
      var li = document.createElement('li');
      li.textContent = q;
      out.appendChild(li);
    });
  });
})();
