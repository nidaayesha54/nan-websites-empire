// Salary <-> hourly converter + overtime calculator
(function () {
  'use strict';
  var fmt$ = function (n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var parse = function (v) { var n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

  function calcStoH() {
    var salary = parse(document.getElementById('salary').value);
    var hours = parse(document.getElementById('hours').value);
    var weeks = parse(document.getElementById('weeks').value);
    var err = document.getElementById('err1');
    var res = document.getElementById('res1');
    err.textContent = '';
    if (salary <= 0 || hours <= 0 || weeks <= 0) {
      err.textContent = 'Enter a salary, hours per week, and weeks per year (all above 0).';
      res.classList.remove('show');
      return;
    }
    var hourly = salary / (hours * weeks);
    res.innerHTML = '<h3>Salary → Hourly</h3>' +
      '<div class="kv"><span>Hourly rate</span><b>' + fmt$(hourly) + '/hr</b></div>' +
      '<div class="kv"><span>Weekly</span><b>' + fmt$(salary / weeks) + '</b></div>' +
      '<div class="kv"><span>Biweekly</span><b>' + fmt$(salary / weeks * 2) + '</b></div>' +
      '<div class="kv"><span>Monthly</span><b>' + fmt$(salary / 12) + '</b></div>' +
      '<div class="verdict">' + fmt$(salary) + '/year at ' + hours + ' hrs/week = <b>' + fmt$(hourly) + ' per hour</b>.</div>';
    res.classList.add('show');
  }

  function calcHtoS() {
    var hourly = parse(document.getElementById('hourly').value);
    var hours = parse(document.getElementById('hours2').value);
    var weeks = parse(document.getElementById('weeks2').value);
    var err = document.getElementById('err2');
    var res = document.getElementById('res2');
    err.textContent = '';
    if (hourly <= 0 || hours <= 0 || weeks <= 0) {
      err.textContent = 'Enter an hourly rate, hours per week, and weeks per year (all above 0).';
      res.classList.remove('show');
      return;
    }
    var annual = hourly * hours * weeks;
    res.innerHTML = '<h3>Hourly → Salary</h3>' +
      '<div class="kv"><span>Annual salary equivalent</span><b>' + fmt$(annual) + '/yr</b></div>' +
      '<div class="kv"><span>Weekly</span><b>' + fmt$(hourly * hours) + '</b></div>' +
      '<div class="kv"><span>Biweekly</span><b>' + fmt$(hourly * hours * 2) + '</b></div>' +
      '<div class="kv"><span>Monthly</span><b>' + fmt$(annual / 12) + '</b></div>' +
      '<div class="verdict">' + fmt$(hourly) + '/hr at ' + hours + ' hrs/week = <b>' + fmt$(annual) + ' per year</b>.</div>';
    res.classList.add('show');
  }

  function calcOT() {
    var rate = parse(document.getElementById('otRate').value);
    var otHours = parse(document.getElementById('otHours').value);
    var err = document.getElementById('err3');
    var res = document.getElementById('res3');
    err.textContent = '';
    if (rate <= 0 || otHours <= 0) {
      err.textContent = 'Enter your hourly rate and overtime hours per week (above 0).';
      res.classList.remove('show');
      return;
    }
    var otRate = rate * 1.5;
    var weeklyOT = otHours * otRate;
    res.innerHTML = '<h3>Overtime Pay (1.5×)</h3>' +
      '<div class="kv"><span>Overtime rate</span><b>' + fmt$(otRate) + '/hr</b></div>' +
      '<div class="kv"><span>Extra per week</span><b>' + fmt$(weeklyOT) + '</b></div>' +
      '<div class="kv"><span>Extra per year (52 weeks)</span><b>' + fmt$(weeklyOT * 52) + '</b></div>' +
      '<div class="verdict">' + otHours + ' overtime hours/week at ' + fmt$(rate) + '/hr adds <b>' + fmt$(weeklyOT * 52) + '/year</b> before taxes.</div>';
    res.classList.add('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn1').addEventListener('click', calcStoH);
    document.getElementById('btn2').addEventListener('click', calcHtoS);
    document.getElementById('btn3').addEventListener('click', calcOT);
  });
})();
