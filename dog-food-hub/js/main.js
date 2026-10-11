/* DogFoodHub shared helpers (no dependencies) */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function fmt(n, d) {
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: d === undefined ? 1 : d, minimumFractionDigits: 0 });
  }

  // Convert weight to kilograms based on unit
  function toKg(value, unit) {
    value = parseFloat(value);
    if (isNaN(value) || value <= 0) return NaN;
    return unit === 'lb' ? value * 0.45359237 : value;
  }

  function validNumber(inputEl, msgEl) {
    var v = parseFloat(inputEl.value);
    if (isNaN(v) || v <= 0) {
      if (msgEl) msgEl.textContent = 'Please enter a valid positive number.';
      inputEl.focus();
      return NaN;
    }
    if (msgEl) msgEl.textContent = '';
    return v;
  }

  window.DFH = { $: $, fmt: fmt, toKg: toKg, validNumber: validNumber };
})();
