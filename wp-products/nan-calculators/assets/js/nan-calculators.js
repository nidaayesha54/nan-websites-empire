/* NAN Calculators v1.0.0 — client-side calculations. No network calls, no tracking. */
(function () {
	'use strict';
	var L = window.nanCalcL10n || {};
	var UR_D = '۰۱۲۳۴۵۶۷۸۹';

	function fmt(n) {
		return 'Rs ' + Math.round(n).toLocaleString('en-PK');
	}
	function urDigits(s) {
		return String(s).replace(/[0-9]/g, function (d) { return UR_D[d]; });
	}
	function esc(s) {
		return String(s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
		});
	}
	function num(box, name) {
		var el = box.querySelector('[name="' + name + '"]');
		return el ? (parseFloat(el.value) || 0) : 0;
	}
	function row(k, v) {
		return '<tr><td>' + esc(k) + '</td><td>' + esc(v) + '</td></tr>';
	}
	function big(main, sub) {
		return '<div class="nan-calc-big">' + esc(main) + '<small>' + esc(sub) + '</small></div>';
	}
	function hint(t) {
		return '<p class="nan-calc-hint">' + esc(t) + '</p>';
	}
	function err(t) {
		return '<p class="nan-calc-err">' + esc(t) + '</p>';
	}

	function calcEOBI(box, T) {
		var wage = num(box, 'wage'), yrs = num(box, 'years'), out = '';
		if (wage <= 0 || yrs <= 0) { return err(T.eobi_err); }
		if (yrs < 14.5) {
			var grant = wage * yrs;
			out = big(fmt(grant), T.eobi_grant_title)
				+ '<table>' + row(T.eobi_service, yrs + ' ' + T.eobi_years_unit)
				+ row(T.eobi_elig, T.eobi_elig_no) + '</table>'
				+ hint(T.eobi_grant_hint);
			return out;
		}
		var p = wage * yrs / 50, atMin = p < 11500;
		if (atMin) { p = 11500; }
		out = big(fmt(p), T.eobi_pension + (atMin ? ' ' + T.eobi_min_applies : ''))
			+ '<table>' + row(T.eobi_formula, fmt(wage * yrs / 50))
			+ row(T.eobi_min_label, fmt(11500))
			+ row(T.eobi_each_year, T.eobi_two_pct) + '</table>'
			+ hint(T.eobi_hint);
		return out;
	}

	function calcOT(box, T) {
		var s = num(box, 'salary'), w = num(box, 'whrs') || 48, h = num(box, 'oth');
		if (s <= 0 || w <= 0) { return err(T.ot_err); }
		var hourly = s * 12 / (52 * w), pay = hourly * 2 * h;
		return big(fmt(pay), T.ot_pay_due)
			+ '<table>' + row(T.ot_hourly, fmt(hourly))
			+ row(T.ot_double, fmt(hourly * 2))
			+ row(T.ot_hours_row, String(h)) + '</table>'
			+ hint(T.ot_hint);
	}

	function calcGrat(box, T) {
		var w = num(box, 'gwage'), y = num(box, 'gyrs');
		if (w <= 0 || y <= 0) { return err(T.grat_err); }
		var perDay = w / 26, g = perDay * 30 * y;
		return big(fmt(g), T.grat_payable)
			+ '<table>' + row(T.grat_perday, fmt(perDay))
			+ row(T.grat_rate, T.grat_rate_val.replace('{y}', String(y))) + '</table>'
			+ hint(T.grat_hint);
	}

	function calcAge(box, T, lang) {
		var dobEl = box.querySelector('[name="dob"]');
		var numEl = box.querySelector('[name="numerals"]');
		var v = dobEl ? dobEl.value : '';
		if (!v) { return err(T.age_err_empty); }
		var b = new Date(v + 'T00:00:00'), t = new Date();
		if (b > t) { return err(T.age_err_future); }
		var y = t.getFullYear() - b.getFullYear(),
			m = t.getMonth() - b.getMonth(),
			d = t.getDate() - b.getDate();
		if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
		if (m < 0) { y--; m += 12; }
		var totalDays = Math.floor((t - b) / 86400000);
		var nb = new Date(t.getFullYear(), b.getMonth(), b.getDate());
		if (nb < t) { nb.setFullYear(nb.getFullYear() + 1); }
		var toBday = Math.ceil((nb - t) / 86400000);
		var useUr = (numEl && numEl.value === 'ur');
		function n(x) { return useUr ? urDigits(x) : String(x); }
		return '<div class="nan-calc-big">' + esc(n(y)) + ' ' + esc(T.age_years) + ' '
			+ esc(n(m)) + ' ' + esc(T.age_months) + ' ' + esc(n(d)) + ' ' + esc(T.age_days)
			+ '<small>' + esc(T.age_your_age) + '</small></div>'
			+ '<table>'
			+ row(T.age_birth_day, T.weekdays[b.getDay()])
			+ row(T.age_total_days, n(totalDays.toLocaleString('en-US').replace(/,/g, '')))
			+ row(T.age_next_bday, n(toBday) + ' ' + T.age_days_left)
			+ '</table>';
	}

	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('.nan-calc').forEach(function (box) {
			var type = box.getAttribute('data-calc');
			var lang = box.getAttribute('data-lang') || 'en';
			var T = L[lang] || L.en;
			if (!T) { return; }
			var btn = box.querySelector('.nan-calc-btn');
			var res = box.querySelector('.nan-calc-result');
			btn.addEventListener('click', function () {
				var out = '';
				if (type === 'eobi') { out = calcEOBI(box, T); }
				else if (type === 'overtime') { out = calcOT(box, T); }
				else if (type === 'gratuity') { out = calcGrat(box, T); }
				else if (type === 'age') { out = calcAge(box, T, lang); }
				res.innerHTML = out;
				res.style.display = 'block';
			});
		});
	});
})();
