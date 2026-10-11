/* Study Daily — Pomodoro study timer (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var display = document.getElementById("timer-display");
  var modeLabel = document.getElementById("timer-mode");
  var barFill = document.getElementById("timer-bar-fill");
  var logList = document.getElementById("session-log");
  var startBtn = document.getElementById("btn-start");
  var pauseBtn = document.getElementById("btn-pause");
  var resetBtn = document.getElementById("btn-reset");
  var skipBtn = document.getElementById("btn-skip");
  var focusInput = document.getElementById("focus-min");
  var shortInput = document.getElementById("short-min");
  var longInput = document.getElementById("long-min");

  var MODES = { FOCUS: "focus", SHORT: "short", LONG: "long" };
  var state = { mode: MODES.FOCUS, remaining: 25 * 60, total: 25 * 60, running: false,
                completed: 0, timerId: null, lastTick: 0 };

  function mins(id, fallback) {
    var v = parseInt(document.getElementById(id).value, 10);
    if (isNaN(v) || v < 1) v = fallback;
    if (v > 180) v = 180;
    return v;
  }
  function setMode(mode) {
    state.mode = mode;
    var m = mode === MODES.FOCUS ? mins("focus-min", 25)
         : mode === MODES.SHORT ? mins("short-min", 5) : mins("long-min", 15);
    state.total = m * 60;
    state.remaining = state.total;
    modeLabel.textContent = mode === MODES.FOCUS ? "🎯 Focus time"
      : mode === MODES.SHORT ? "☕ Short break" : "🌿 Long break";
    render();
  }
  function fmt(s) {
    s = Math.max(0, Math.ceil(s));
    var m = Math.floor(s / 60), sec = s % 60;
    return (m < 10 ? "0" + m : "" + m) + ":" + (sec < 10 ? "0" + sec : "" + sec);
  }
  function render() {
    display.textContent = fmt(state.remaining);
    var pct = state.total > 0 ? (1 - state.remaining / state.total) * 100 : 0;
    barFill.style.width = Math.min(100, Math.max(0, pct)) + "%";
    document.title = fmt(state.remaining) + " — Study Timer";
  }
  function tick() {
    var now = Date.now();
    var dt = (now - state.lastTick) / 1000;
    state.lastTick = now;
    state.remaining -= dt;
    if (state.remaining <= 0) { finishSession(); return; }
    render();
  }
  function start() {
    if (state.running) return;
    if (state.remaining <= 0) setMode(state.mode);
    state.running = true;
    state.lastTick = Date.now();
    state.timerId = setInterval(tick, 250);
    startBtn.disabled = true;
  }
  function pause() {
    state.running = false;
    clearInterval(state.timerId);
    startBtn.disabled = false;
    render();
  }
  function reset() {
    pause();
    setMode(state.mode);
  }
  function finishSession() {
    pause();
    try {
      if (window.AudioContext || window.webkitAudioContext) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        var ctx = new Ctx(), o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 880; o.type = "sine";
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        o.start(); o.stop(ctx.currentTime + 0.65);
      }
    } catch (e) { /* audio not available — silent finish */ }
    if (state.mode === MODES.FOCUS) {
      state.completed++;
      log("✅ Focus session #" + state.completed + " completed (" + mins("focus-min", 25) + " min)");
      setMode(state.completed % 4 === 0 ? MODES.LONG : MODES.SHORT);
    } else {
      log("☕ Break over — back to focus!");
      setMode(MODES.FOCUS);
    }
    start();
  }
  function log(msg) {
    var li = document.createElement("li");
    var t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    li.textContent = "[" + t + "] " + msg;
    logList.prepend(li);
  }
  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);
  skipBtn.addEventListener("click", function () { pause(); finishSession(); });
  [focusInput, shortInput, longInput].forEach(function (el) {
    el.addEventListener("change", function () { if (!state.running) setMode(state.mode); });
  });
  setMode(MODES.FOCUS);
})();
