/* TaxHub shared tax engine — 2026 tax year (IRS Revenue Procedure 2025-32)
   Figures verified Oct 2026 against IRS releases. Estimates only. */
'use strict';

const TAX_YEAR = 2026;

// Standard deductions, 2026
const STD_DEDUCTION = {
  single: 16100,
  mfj: 32200,
  mfs: 16100,
  hoh: 24150
};

// Filing status labels
const FILING_LABELS = {
  single: 'Single',
  mfj: 'Married Filing Jointly',
  mfs: 'Married Filing Separately',
  hoh: 'Head of Household'
};

// 2026 federal income tax brackets — upper bounds per rate, by filing status.
// Each entry: [rate, upperBound] (last entry = Infinity).
const BRACKETS = {
  single: [[0.10, 12400], [0.12, 50400], [0.22, 105700], [0.24, 201775], [0.32, 256225], [0.35, 640600], [0.37, Infinity]],
  mfj:    [[0.10, 24800], [0.12, 100800], [0.22, 211400], [0.24, 403550], [0.32, 512450], [0.35, 768700], [0.37, Infinity]],
  mfs:    [[0.10, 12400], [0.12, 50400], [0.22, 105700], [0.24, 201775], [0.32, 256225], [0.35, 384350], [0.37, Infinity]],
  hoh:    [[0.10, 17700], [0.12, 67450], [0.22, 105700], [0.24, 201750], [0.32, 256200], [0.35, 640600], [0.37, Infinity]]
};

// Self-employment tax constants, 2026
const SE = {
  rate: 0.153,          // combined SE rate
  netFactor: 0.9235,    // only 92.35% of net earnings subject to SE tax
  ssRate: 0.124,        // Social Security portion
  ssCap: 184500,        // SS wage base 2026
  medRate: 0.029,       // Medicare portion (no cap)
  addlMedRate: 0.009,   // additional Medicare tax
  addlMedThreshold: { single: 200000, mfj: 250000, mfs: 125000, hoh: 200000 }
};

/**
 * Compute federal income tax on taxable income using marginal brackets.
 * @param {number} taxableIncome
 * @param {string} status one of single|mfj|mfs|hoh
 * @returns {{tax:number, marginalRate:number, effectiveRate:number, breakdown:Array}}
 */
function computeFederalTax(taxableIncome, status) {
  const brackets = BRACKETS[status] || BRACKETS.single;
  let tax = 0, lower = 0, marginalRate = 0;
  const breakdown = [];
  for (const [rate, upper] of brackets) {
    if (taxableIncome <= lower) break;
    const inBracket = Math.min(taxableIncome, upper) - lower;
    const portion = inBracket * rate;
    tax += portion;
    if (inBracket > 0) {
      marginalRate = rate;
      breakdown.push({ rate, from: lower, to: Math.min(taxableIncome, upper), amount: portion });
    }
    lower = upper;
  }
  return {
    tax: Math.round(tax * 100) / 100,
    marginalRate,
    effectiveRate: taxableIncome > 0 ? tax / taxableIncome : 0,
    breakdown
  };
}

/**
 * Full liability from gross income: subtracts standard deduction (or 0 if itemizing input).
 */
function computeLiability(grossIncome, status, deduction) {
  const ded = typeof deduction === 'number' ? deduction : (STD_DEDUCTION[status] || 16100);
  const taxable = Math.max(0, grossIncome - ded);
  const r = computeFederalTax(taxable, status);
  return { taxableIncome: taxable, deduction: ded, ...r };
}

/**
 * Self-employment tax (Schedule SE method): 15.3% of 92.35% of net earnings,
 * with 12.4% SS portion capped at the 2026 wage base, 2.9% Medicare uncapped,
 * +0.9% additional Medicare over threshold.
 */
function computeSETax(netEarnings, status) {
  const seBase = Math.max(0, netEarnings * SE.netFactor);
  const ssTax = Math.min(seBase, SE.ssCap) * SE.ssRate;
  const medTax = seBase * SE.medRate;
  const threshold = SE.addlMedThreshold[status] || SE.addlMedThreshold.single;
  const addlMed = Math.max(0, seBase - threshold) * SE.addlMedRate;
  const total = ssTax + medTax + addlMed;
  return {
    seBase: Math.round(seBase * 100) / 100,
    ssTax: Math.round(ssTax * 100) / 100,
    medTax: Math.round(medTax * 100) / 100,
    addlMedTax: Math.round(addlMed * 100) / 100,
    total: Math.round(total * 100) / 100,
    deductibleHalf: Math.round((total / 2) * 100) / 100
  };
}

function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}
function fmt2(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

if (typeof module !== 'undefined') module.exports = { TAX_YEAR, STD_DEDUCTION, FILING_LABELS, BRACKETS, SE, computeFederalTax, computeLiability, computeSETax };
