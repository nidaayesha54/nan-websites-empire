/* QR Generator — qrcodejs, client-side */
(function () {
  var mode = 'text';
  var tabs = document.querySelectorAll('.tab');
  var paneText = document.getElementById('pane-text');
  var paneWifi = document.getElementById('pane-wifi');
  var qrBox = document.getElementById('qr');
  var dla = document.getElementById('dla');
  var qr = null;

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      mode = t.getAttribute('data-t');
      tabs.forEach(function (x) { x.classList.remove('primary'); });
      t.classList.add('primary');
      paneText.style.display = mode === 'text' ? 'block' : 'none';
      paneWifi.style.display = mode === 'wifi' ? 'block' : 'none';
    });
  });

  document.getElementById('go').addEventListener('click', function () {
    var content;
    if (mode === 'text') {
      content = document.getElementById('txt').value.trim();
      if (!content) { alert('Enter some text or a link first.'); return; }
    } else {
      var ssid = document.getElementById('ssid').value.trim();
      var pass = document.getElementById('wpass').value;
      var sec = document.getElementById('wsec').value;
      if (!ssid) { alert('Enter the Wi-Fi network name.'); return; }
      content = 'WIFI:T:' + sec + ';S:' + ssid.replace(/;/g, '\\;') + ';P:' + pass.replace(/;/g, '\\;') + ';;';
    }
    var size = parseInt(document.getElementById('size').value, 10) || 300;
    qrBox.innerHTML = '';
    qr = new QRCode(qrBox, {
      text: content,
      width: size,
      height: size,
      correctLevel: QRCode.CorrectLevel.M
    });
    dla.style.display = 'block';
  });

  document.getElementById('dl').addEventListener('click', function () {
    var img = qrBox.querySelector('img');
    var canvas = qrBox.querySelector('canvas');
    var src;
    if (img && img.src) src = img.src;
    else if (canvas) src = canvas.toDataURL('image/png');
    if (!src) { alert('Generate a QR code first.'); return; }
    var a = document.createElement('a');
    a.href = src;
    a.download = 'qr-code.png';
    a.click();
  });
})();
