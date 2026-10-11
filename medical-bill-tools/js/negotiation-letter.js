/* Negotiation Letter Generator logic */
(function () {
  'use strict';

  var currentLetter = '';

  function init() {
    var btn = document.getElementById('genBtn');
    if (!btn) return;
    btn.addEventListener('click', generate);
    document.getElementById('copyBtn').addEventListener('click', function () {
      window.mbhCopy(currentLetter, this);
    });
    document.getElementById('dlBtn').addEventListener('click', function () {
      window.mbhDownload('medical-bill-negotiation-letter.txt', currentLetter);
    });
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function generate() {
    var name = val('fName') || '[Your Full Name]';
    var address = val('fAddress') || '[Your Address]';
    var provider = val('fProvider') || '[Provider / Hospital Name]';
    var account = val('fAccount') || '[Account Number]';
    var date = val('fDate') || '[Date of Service]';
    var amount = parseFloat(val('fAmount')) || 0;
    var offer = parseFloat(val('fOffer')) || 0;
    var reason = val('fReason') || '[brief description of your financial hardship]';
    var tone = val('fTone') || 'discount';

    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var amountStr = amount > 0 ? window.mbhMoney(amount) : '[billed amount]';
    var offerStr = offer > 0 ? window.mbhMoney(offer) : '[amount you can pay]';

    var askParagraph;
    if (tone === 'plan') {
      askParagraph = 'I am writing to request an interest-free payment plan for this balance. I can reliably pay ' + offerStr + ' per month, and I am committed to paying the account in full under those terms. Please confirm the plan in writing, including that no interest or fees will be added.';
    } else if (tone === 'assistance') {
      askParagraph = 'I am writing to ask to be screened for your financial assistance (charity care) program. Based on my current financial situation, I believe I may qualify for a reduction. Please send me the financial assistance application and confirm what documentation you need.';
    } else {
      askParagraph = 'I am writing to request a reduction of this bill. I am prepared to resolve this account promptly with a lump-sum payment of ' + offerStr + ' if you can accept it as payment in full. Please confirm in writing that this payment will settle the account completely with no remaining balance.';
    }

    currentLetter =
      name + '\n' + address + '\n\n' + today + '\n\n' +
      'Billing Department\n' + provider + '\n\n' +
      'Re: Request for bill reduction — Account ' + account + '\n' +
      'Date of service: ' + date + '\n' +
      'Billed amount: ' + amountStr + '\n\n' +
      'Dear Billing Department,\n\n' +
      askParagraph + '\n\n' +
      'A brief explanation of my situation: ' + reason + '\n\n' +
      'I have reviewed my itemized bill and my insurance Explanation of Benefits. Before I proceed, I would also like to confirm that all charges are correct and that my insurer\'s negotiated rates were applied.\n\n' +
      'Please respond in writing to the address above. I appreciate your time and any assistance you can provide.\n\n' +
      'Sincerely,\n' + name;

    var box = document.getElementById('letterBox');
    document.getElementById('letterText').textContent = currentLetter;
    box.classList.add('show');
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
