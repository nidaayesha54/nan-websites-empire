/* PetAdoptionHub — Adoption Cost Calculator */
(function () {
  'use strict';

  var DEFAULTS = {
    dog:    { fee: 200, vet: 150, supplies: 180, food: 50, insurance: 35, misc: 25 },
    cat:    { fee: 100, vet: 120, supplies: 120, food: 30, insurance: 25, misc: 15 },
    rabbit: { fee: 50,  vet: 100, supplies: 140, food: 25, insurance: 0,  misc: 15 },
    bird:   { fee: 75,  vet: 80,  supplies: 150, food: 20, insurance: 0,  misc: 10 }
  };

  var NOTES = {
    dog: 'Includes spay/neuter (often bundled in the fee). Training classes not included — budget $150–$300 if needed.',
    cat: 'Cats are usually the most affordable first-year pets. A cat tree + scratcher saves your furniture.',
    rabbit: 'Rabbits need an exotic vet (pricier visits) and daily fresh greens. Spay/neuter is strongly recommended.',
    bird: 'Cage quality matters most — buy the biggest you can afford. Annual avian checkups run $80–$150.'
  };

  function num(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  var petType = document.getElementById('pet-type');
  petType.addEventListener('change', function () {
    var d = DEFAULTS[petType.value];
    ['fee', 'vet', 'supplies', 'food', 'insurance', 'misc'].forEach(function (k) {
      document.getElementById(k).value = d[k];
    });
    calculate();
  });

  function money(n) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function calculate() {
    var fee = num('fee'), vet = num('vet'), supplies = num('supplies');
    var food = num('food'), insurance = num('insurance'), misc = num('misc');

    var oneTime = fee + vet + supplies;
    var monthly = food + insurance + misc;
    var firstYear = oneTime + monthly * 12;
    var yearly = monthly * 12 + vet * 0.5; // rough annual vet baseline

    var type = petType.value;
    var label = type.charAt(0).toUpperCase() + type.slice(1);

    var html =
      '<h3 style="margin-top:26px">Your ' + label + ' Cost Breakdown</h3>' +
      '<table class="cost-table"><thead><tr><th>Item</th><th>Cost</th></tr></thead><tbody>' +
      '<tr><td>Adoption fee (one-time)</td><td>' + money(fee) + '</td></tr>' +
      '<tr><td>First vet visit + vaccines (one-time)</td><td>' + money(vet) + '</td></tr>' +
      '<tr><td>Initial supplies (one-time)</td><td>' + money(supplies) + '</td></tr>' +
      '<tr><td>Food (monthly × 12)</td><td>' + money(food * 12) + '</td></tr>' +
      '<tr><td>Insurance (monthly × 12)</td><td>' + money(insurance * 12) + '</td></tr>' +
      '<tr><td>Misc (monthly × 12)</td><td>' + money(misc * 12) + '</td></tr>' +
      '</tbody><tfoot><tr><td>Estimated FIRST-YEAR total</td><td>' + money(firstYear) + '</td></tr></tfoot></table>' +
      '<div class="callout"><strong>Year 2+ estimate:</strong> about ' + money(yearly) +
      ' per year (ongoing food, insurance, misc + routine vet). ' + NOTES[type] + '</div>';

    if (firstYear > 2500) {
      html += '<div class="callout"><strong>💡 Saving tip:</strong> look for shelter fee-waived events (often holidays), buy supplies secondhand, and ask your vet about wellness plans.</div>';
    }

    document.getElementById('calc-result').innerHTML = html;
  }

  document.getElementById('calc-btn').addEventListener('click', calculate);
  calculate(); // render on load
})();
