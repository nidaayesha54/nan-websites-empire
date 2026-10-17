/* nan-datetime app logic — 100% client-side */
(function () {
  'use strict';

  /* ---------- Hijri (tabular / Kuwaiti algorithm) ---------- */
  function gregorianToHijri(y, m, d) {
    var jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4)
      + Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12)
      - Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4)
      + d - 32075;
    var l = jd - 1948440 + 10632, n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    var j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    var mo = Math.floor((24 * l) / 709), da = l - Math.floor((709 * mo) / 24), ye = 30 * n + j - 30;
    return { y: ye, m: mo, d: da };
  }

  var HIJRI_MONTHS = ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban", 'Ramadan',
    'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];

  /* ISO week number */
  function isoWeek(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function pad(n, len) {
    n = String(n);
    while (n.length < (len || 2)) n = '0' + n;
    return n;
  }

  /* ---------- Hero date ---------- */
  function renderHero() {
    var now = new Date();
    var greg = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(now);
    var el = document.getElementById('today-date');
    if (el) el.textContent = greg;

    var dow = document.getElementById('day-of-week');
    if (dow) dow.textContent = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(now);

    var wk = document.getElementById('week-number');
    if (wk) wk.textContent = isoWeek(now);

    var h = gregorianToHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
    var hel = document.getElementById('hijri-date');
    if (hel) hel.textContent = h.d + ' ' + HIJRI_MONTHS[h.m - 1] + ' ' + h.y + ' AH';
  }

  /* ---------- World clock ---------- */
  var ZONES = [
    { key: 'pk', tz: 'Asia/Karachi', label: 'Pakistan', city: 'Karachi' },
    { key: 'ae', tz: 'Asia/Dubai', label: 'Dubai', city: 'Dubai' },
    { key: 'uk', tz: 'Europe/London', label: 'London', city: 'London' },
    { key: 'ny', tz: 'America/New_York', label: 'New York', city: 'New York' },
    { key: 'to', tz: 'America/Toronto', label: 'Toronto', city: 'Toronto' },
    { key: 'sy', tz: 'Australia/Sydney', label: 'Sydney', city: 'Sydney' }
  ];

  function tickClocks() {
    var now = new Date();
    ZONES.forEach(function (z) {
      var t = document.getElementById('clock-' + z.key);
      var d = document.getElementById('clockdate-' + z.key);
      if (t) {
        t.textContent = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: true, timeZone: z.tz
        }).format(now);
      }
      if (d) {
        d.textContent = new Intl.DateTimeFormat('en-GB', {
          weekday: 'short', day: 'numeric', month: 'short', timeZone: z.tz
        }).format(now);
      }
    });
  }

  /* ---------- Countdown ---------- */
  var countdownTarget = null, countdownTimer = null;

  function fmt2(n) { return (n < 10 ? '0' : '') + n; }

  function renderCountdown() {
    var box = document.getElementById('countdown-display');
    if (!countdownTarget) return;
    var diff = countdownTarget.getTime() - Date.now();
    if (diff <= 0) {
      box.innerHTML = '<span class="cd-done" data-i18n="timesup">Time\'s up!</span>';
      applyLang(currentLang);
      clearInterval(countdownTimer);
      countdownTimer = null;
      return;
    }
    var days = Math.floor(diff / 86400000),
        hrs = Math.floor(diff / 3600000) % 24,
        min = Math.floor(diff / 60000) % 60,
        sec = Math.floor(diff / 1000) % 60;
    box.innerHTML =
      '<div class="cd-cell"><span>' + days + '</span><small data-i18n="days">Days</small></div>' +
      '<div class="cd-cell"><span>' + fmt2(hrs) + '</span><small data-i18n="hours">Hours</small></div>' +
      '<div class="cd-cell"><span>' + fmt2(min) + '</span><small data-i18n="minutes">Minutes</small></div>' +
      '<div class="cd-cell"><span>' + fmt2(sec) + '</span><small data-i18n="seconds">Seconds</small></div>';
    applyLang(currentLang);
  }

  function startCountdown() {
    var inp = document.getElementById('countdown-input');
    if (!inp || !inp.value) return;
    countdownTarget = new Date(inp.value);
    if (isNaN(countdownTarget.getTime())) return;
    if (countdownTimer) clearInterval(countdownTimer);
    renderCountdown();
    countdownTimer = setInterval(renderCountdown, 1000);
  }

  /* ---------- Stopwatch ---------- */
  var swStart = 0, swElapsed = 0, swRunning = false, swTick = null, lapCount = 0;

  function swTotal() {
    return swElapsed + (swRunning ? (Date.now() - swStart) : 0);
  }

  function swFormat(ms) {
    var h = Math.floor(ms / 3600000),
        m = Math.floor(ms / 60000) % 60,
        s = Math.floor(ms / 1000) % 60,
        milli = Math.floor(ms % 1000);
    return pad(h) + ':' + pad(m) + ':' + pad(s) + '.' + pad(milli, 3);
  }

  function swRender() {
    var el = document.getElementById('stopwatch-display');
    if (el) el.textContent = swFormat(swTotal());
  }

  function swStartFn() {
    if (swRunning) return;
    swRunning = true;
    swStart = Date.now();
    swTick = setInterval(swRender, 31);
    setSwButtons();
  }

  function swStopFn() {
    if (!swRunning) return;
    swElapsed = swTotal();
    swRunning = false;
    clearInterval(swTick);
    swRender();
    setSwButtons();
  }

  function swResetFn() {
    swRunning = false;
    clearInterval(swTick);
    swElapsed = 0;
    lapCount = 0;
    var laps = document.getElementById('laps');
    if (laps) laps.innerHTML = '';
    swRender();
    setSwButtons();
  }

  function swLapFn() {
    if (!swRunning && swTotal() === 0) return;
    lapCount++;
    var laps = document.getElementById('laps');
    if (!laps) return;
    var li = document.createElement('li');
    li.innerHTML = '<span data-i18n="lap">Lap</span> ' + lapCount + ' — <strong>' + swFormat(swTotal()) + '</strong>';
    laps.prepend(li);
    applyLang(currentLang);
  }

  function setSwButtons() {
    var bStart = document.getElementById('sw-start'),
        bStop = document.getElementById('sw-stop');
    if (bStart) bStart.disabled = swRunning;
    if (bStop) bStop.disabled = !swRunning;
  }

  /* ---------- i18n ---------- */
  var I18N = {
    en: {
      tagline: 'Free date, time & world clock tools — updated live.',
      heroSub: "Today's Date",
      week: 'Week',
      hijriTitle: 'Hijri / Islamic Date',
      hijriApprox: '(approximate — tabular calculation)',
      worldClock: 'World Clock',
      liveLabel: 'live',
      countdownTitle: 'Countdown Timer',
      countdownHint: 'Pick a date and time, then start the countdown.',
      startCountdown: 'Start Countdown',
      timesup: "Time's up!",
      days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
      stopwatchTitle: 'Stopwatch',
      start: 'Start', stop: 'Stop', reset: 'Reset', lap: 'Lap',
      articleCta: 'Read the guide',
      footerNote: 'Free tools by NAN Marketing Agency',
      networkTitle: 'More free tools from our network',
      pk: 'Pakistan', ae: 'Dubai', uk: 'London', ny: 'New York', to: 'Toronto', sy: 'Sydney'
    },
    ur: {
      tagline: 'مفت تاریخ، وقت اور عالمی گھڑی کے اوزار — براہِ راست اپڈیٹ۔',
      heroSub: 'آج کی تاریخ',
      week: 'ہفتہ',
      hijriTitle: 'ہجری / اسلامی تاریخ',
      hijriApprox: '(تقریبی — حسابی طریقہ)',
      worldClock: 'عالمی گھڑی',
      liveLabel: 'براہِ راست',
      countdownTitle: 'الٹی گنتی',
      countdownHint: 'تاریخ اور وقت منتخب کریں، پھر الٹی گنتی شروع کریں۔',
      startCountdown: 'الٹی گنتی شروع کریں',
      timesup: 'وقت ختم!',
      days: 'دن', hours: 'گھنٹے', minutes: 'منٹ', seconds: 'سیکنڈ',
      stopwatchTitle: 'اسٹاپ واچ',
      start: 'شروع کریں', stop: 'روکیں', reset: 'ری سیٹ', lap: 'لیپ',
      articleCta: 'رہنمائی پڑھیں',
      footerNote: 'NAN Marketing Agency کے مفت اوزار',
      networkTitle: 'ہمارے نیٹ ورک کے مزید مفت اوزار',
      pk: 'پاکستان', ae: 'دبئی', uk: 'لندن', ny: 'نیویارک', to: 'ٹورنٹو', sy: 'سڈنی'
    }
  };

  var currentLang = 'en';

  function applyLang(lang) {
    currentLang = lang;
    var dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k]) el.textContent = dict[k];
    });
    document.documentElement.lang = lang === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    var tgl = document.getElementById('lang-toggle');
    if (tgl) tgl.textContent = lang === 'ur' ? 'EN' : 'اردو';
  }

  function toggleLang() {
    applyLang(currentLang === 'en' ? 'ur' : 'en');
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderHero();
    tickClocks();
    setInterval(tickClocks, 1000);
    swRender();
    setSwButtons();

    var tgl = document.getElementById('lang-toggle');
    if (tgl) tgl.addEventListener('click', toggleLang);

    var cdBtn = document.getElementById('countdown-btn');
    if (cdBtn) cdBtn.addEventListener('click', startCountdown);

    var s1 = document.getElementById('sw-start');
    if (s1) s1.addEventListener('click', swStartFn);
    var s2 = document.getElementById('sw-stop');
    if (s2) s2.addEventListener('click', swStopFn);
    var s3 = document.getElementById('sw-reset');
    if (s3) s3.addEventListener('click', swResetFn);
    var s4 = document.getElementById('sw-lap');
    if (s4) s4.addEventListener('click', swLapFn);

    applyLang('en');
  });

  /* expose for sanity checks */
  window.__hijri = gregorianToHijri;
})();
