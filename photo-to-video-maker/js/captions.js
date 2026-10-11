/* Slideshow caption / title / hashtag generator */
(function () {
  'use strict';

  var TITLES = {
    birthday: {
      heartfelt: ['A Year in Moments: {N}\'s Birthday Story', 'Celebrating {N}: Every Memory, Every Smile', '{N} — Another Beautiful Year'],
      funny: ['{N} Survived Another Year 🎉', 'Officially Older, Still Immature: {N}', 'Cake > Age: {N}\'s Birthday Slideshow'],
      inspirational: ['{N}: Chapter {Y} Begins', 'To the Next Adventure, {N}', '{N} — Stronger Every Year']
    },
    wedding: {
      heartfelt: ['Forever Begins: {N}\'s Wedding Day', 'Two Hearts, One Story — {N}', '{N}: The Day Everything Changed'],
      funny: ['We Put a Ring on It: {N}', '{N} — Legally Stuck Together Now', 'Swipe Right Worked: {N}\'s Wedding'],
      inspirational: ['Love, Written in Moments: {N}', '{N}: The Beginning of Always', 'Two Souls, One Journey — {N}']
    },
    travel: {
      heartfelt: ['Wander Often, Wonder Always: {N}', '{N} — Memories in Every Mile', 'The World Through {N}\'s Eyes'],
      funny: ['{N} Needs a Bigger Suitcase', 'Jet Lag Is Temporary, {N}\'s Photos Are Forever', '{N} Went Broke for These Views'],
      inspirational: ['Beyond the Horizon: {N}', '{N} — Collect Moments, Not Things', 'Every Mile Tells a Story: {N}']
    },
    family: {
      heartfelt: ['Home Is Where {N} Is', '{N}: Our Greatest Story', 'Generations of Love — {N}'],
      funny: ['The {N} Circus: Now Showing', '{N} Family — We Put the Fun in Dysfunctional', 'Proof {N} Actually Gets Along'],
      inspirational: ['Roots & Wings: {N}', '{N} — Built on Love', 'Together Is Everything: {N}']
    },
    baby: {
      heartfelt: ['Hello, World: Meet {N}', '{N}\'s First Moments', 'Tiny Fingers, Huge Love — {N}'],
      funny: ['{N}: Professional Napper', 'Sleep? Never Heard of It: {N}', '{N} — Cuter Than Your Baby (Sorry)'],
      inspirational: ['A New Star Arrives: {N}', '{N} — The Adventure Begins', 'Small Beginnings, Big Dreams: {N}']
    },
    business: {
      heartfelt: ['Our Journey: {N}', '{N} — Built by People, Powered by Passion', 'Milestones That Made {N}'],
      funny: ['{N}: We Survived Q4', 'PowerPoints Were Harmed Making {N}', '{N} — Coffee-Fueled Since Day One'],
      inspirational: ['{N}: From Vision to Victory', 'Building Tomorrow: {N}', '{N} — The Story Behind the Success']
    }
  };

  var CAPTIONS = {
    heartfelt: [
      'Every photo tells a story — here is {N}\'s, frame by frame. ❤️',
      'Moments fade, memories stay. Celebrating {N} today and always.',
      'Some moments you never want to forget. {N}, this one\'s for you.'
    ],
    funny: [
      'Warning: excessive nostalgia ahead. {N} did not approve this slideshow. 😂',
      'We found these photos. {N} can\'t delete them now.',
      'A totally unbiased look at {N}. (Okay, slightly biased.)'
    ],
    inspirational: [
      'Look how far {N} has come. The best is still ahead. 🌟',
      'Every ending is a new beginning — {N}\'s story continues.',
      'Dream big, {N}. This is only the trailer.'
    ]
  };

  var TAGS = {
    birthday: ['#BirthdaySlideshow', '#HappyBirthday', '#BirthdayMemories', '#PhotoToVideo', '#BirthdayVideo'],
    wedding: ['#WeddingSlideshow', '#WeddingDay', '#JustMarried', '#WeddingMemories', '#PhotoToVideo'],
    travel: ['#TravelSlideshow', '#Wanderlust', '#TravelMemories', '#VacationVideo', '#PhotoToVideo'],
    family: ['#FamilySlideshow', '#FamilyMemories', '#FamilyFirst', '#FamilyLove', '#PhotoToVideo'],
    baby: ['#BabySlideshow', '#BabyMemories', '#NewBaby', '#BabyMilestones', '#PhotoToVideo'],
    business: ['#CompanyMilestones', '#OurStory', '#BusinessJourney', '#TeamWork', '#PhotoToVideo']
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function chipVal(id) {
    var on = document.querySelector('#' + id + ' .chip.on');
    return on ? on.getAttribute('data-v') : null;
  }

  function generate() {
    var occ = chipVal('occChips') || 'birthday';
    var tone = chipVal('toneChips') || 'heartfelt';
    var name = (document.getElementById('capName').value || '').trim() || 'this story';
    var year = new Date().getFullYear();

    var titles = TITLES[occ][tone].map(function (t) {
      return t.replace(/{N}/g, name).replace(/{Y}/g, year);
    });
    document.getElementById('titles').innerHTML = titles.map(function (t, i) {
      return '<div class="caption-item"><b>' + (i + 1) + '.</b> ' + t +
        ' <span class="copy-btn" data-copy="' + t.replace(/"/g, '&quot;') + '">Copy</span></div>';
    }).join('');

    var caps = CAPTIONS[tone].map(function (t) { return t.replace(/{N}/g, name); });
    document.getElementById('captions').innerHTML = caps.map(function (t, i) {
      return '<div class="caption-item"><b>' + (i + 1) + '.</b> ' + t +
        ' <span class="copy-btn" data-copy="' + t.replace(/"/g, '&quot;') + '">Copy</span></div>';
    }).join('');

    var tags = TAGS[occ].join(' ');
    document.getElementById('hashtags').textContent = tags;
    bindCopy();
    document.getElementById('capResult').style.display = 'block';
    document.getElementById('capResult').scrollIntoView({ behavior: 'smooth' });
  }

  function bindCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.onclick = function () {
        navigator.clipboard.writeText(el.getAttribute('data-copy')).then(function () {
          el.textContent = 'Copied ✓';
          setTimeout(function () { el.textContent = 'Copy'; }, 1500);
        });
      };
    });
  }

  function init() {
    if (!document.getElementById('genBtn')) return;
    ['occChips', 'toneChips'].forEach(function (id) {
      document.querySelectorAll('#' + id + ' .chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          document.querySelectorAll('#' + id + ' .chip').forEach(function (c) { c.classList.remove('on'); });
          chip.classList.add('on');
        });
      });
    });
    document.getElementById('genBtn').addEventListener('click', generate);
    document.getElementById('copyTags').addEventListener('click', function () {
      var t = document.getElementById('hashtags').textContent;
      navigator.clipboard.writeText(t).then(function () {
        document.getElementById('copyTags').textContent = 'Copied ✓';
        setTimeout(function () { document.getElementById('copyTags').textContent = 'Copy hashtags'; }, 1500);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
