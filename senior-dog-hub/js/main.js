'use strict';
// SeniorDogHub shared helpers
var SDH = {
  $: function(id) { return document.getElementById(id); },
  fmt: function(n, dec) {
    return Number(n).toLocaleString('en-US', {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec || 0
    });
  }
};
