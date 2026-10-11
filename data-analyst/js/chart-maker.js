// Chart Maker — pure canvas bar/line/pie charts, PNG download
(function(){
  var canvas = document.getElementById('chart');
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var PALETTE = ['#0d9488','#0ea5e9','#f59e0b','#8b5cf6','#ef4444','#10b981','#f97316','#6366f1','#ec4899','#14b8a6'];

  document.getElementById('csvfile').addEventListener('change', function(){
    var f = this.files[0];
    if(!f) return;
    var reader = new FileReader();
    reader.onload = function(e){
      var p = parseCSV(e.target.result);
      var lines = p.rows.filter(function(r){ return r[0]!==undefined && String(r[0]).trim()!==''; })
        .map(function(r){ return r[0]+', '+(r[1]!==undefined?r[1]:''); });
      document.getElementById('data').value = lines.join('\n');
      draw();
    };
    reader.readAsText(f);
  });

  document.getElementById('draw').addEventListener('click', draw);
  document.getElementById('download').addEventListener('click', function(){
    var a = document.createElement('a');
    a.download = 'chart.png';
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a); a.click(); a.remove();
  });

  function parseInput(){
    var lines = document.getElementById('data').value.split('\n');
    var labels=[], values=[];
    lines.forEach(function(line){
      line = line.trim();
      if(!line) return;
      var parts = line.split(/,(.+)/); // split on first comma
      var label = parts[0].trim();
      var val = parts.length>1 ? toNum(parts[1]) : NaN;
      if(label && !isNaN(val)){ labels.push(label); values.push(val); }
    });
    return {labels:labels, values:values};
  }

  function draw(){
    var d = parseInput();
    if(!d.labels.length){
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#64748b'; ctx.font='20px sans-serif'; ctx.textAlign='center';
      ctx.fillText('Enter at least one "Label, Value" line.', W/2, H/2);
      document.getElementById('download').disabled = true;
      return;
    }
    var type = document.getElementById('chart-type').value;
    var title = document.getElementById('chart-title').value || 'My Chart';
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign='center';
    ctx.fillText(title, W/2, 44);
    if(type==='bar') drawBar(d);
    else if(type==='line') drawLine(d);
    else drawPie(d);
    document.getElementById('download').disabled = false;
  }

  function drawBar(d){
    var n = d.labels.length;
    var maxV = Math.max.apply(null, d.values.concat([0]));
    var minV = Math.min.apply(null, d.values.concat([0]));
    var padL=70, padR=30, padT=70, padB=70;
    var cw = W-padL-padR, ch = H-padT-padB;
    var span = (maxV-minV) || 1;
    // axes
    ctx.strokeStyle='#cbd5e1'; ctx.beginPath();
    ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+ch); ctx.lineTo(padL+cw,padT+ch); ctx.stroke();
    // y gridlines (5)
    ctx.font='12px sans-serif'; ctx.fillStyle='#64748b'; ctx.textAlign='right';
    for(var g=0; g<=4; g++){
      var v = minV + span*g/4;
      var y = padT+ch - (v-minV)/span*ch;
      ctx.strokeStyle='#f1f5f9'; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cw,y); ctx.stroke();
      ctx.fillText(fmtTick(v), padL-8, y+4);
    }
    var bw = cw/n;
    for(var i=0;i<n;i++){
      var v = d.values[i];
      var hgt = (v-minV)/span*ch;
      var x = padL + i*bw + bw*0.15, w = bw*0.7;
      var y = padT+ch-hgt;
      ctx.fillStyle = PALETTE[i%PALETTE.length];
      ctx.fillRect(x, y, w, hgt);
      // value label
      ctx.fillStyle='#0f172a'; ctx.textAlign='center'; ctx.font='12px sans-serif';
      ctx.fillText(fmtNum(v), x+w/2, y-6);
      // x label (truncate)
      var lab = d.labels[i].length>14 ? d.labels[i].slice(0,13)+'…' : d.labels[i];
      ctx.save();
      ctx.translate(x+w/2, padT+ch+12); ctx.rotate(-0.0);
      ctx.fillStyle='#475569'; ctx.fillText(lab, 0, 10);
      ctx.restore();
    }
  }

  function drawLine(d){
    var n = d.labels.length;
    var maxV = Math.max.apply(null, d.values);
    var minV = Math.min.apply(null, d.values);
    if(maxV===minV){ maxV+=1; minV-=1; }
    var padL=70, padR=40, padT=70, padB=70;
    var cw = W-padL-padR, ch = H-padT-padB;
    var span = maxV-minV;
    function X(i){ return n===1 ? padL+cw/2 : padL + cw*i/(n-1); }
    function Y(v){ return padT+ch - (v-minV)/span*ch; }
    ctx.strokeStyle='#cbd5e1'; ctx.beginPath();
    ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+ch); ctx.lineTo(padL+cw,padT+ch); ctx.stroke();
    ctx.font='12px sans-serif'; ctx.fillStyle='#64748b'; ctx.textAlign='right';
    for(var g=0; g<=4; g++){
      var v = minV + span*g/4, y = Y(v);
      ctx.strokeStyle='#f1f5f9'; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cw,y); ctx.stroke();
      ctx.fillText(fmtTick(v), padL-8, y+4);
    }
    // line
    ctx.strokeStyle='#0d9488'; ctx.lineWidth=3; ctx.beginPath();
    for(var i=0;i<n;i++){ var x=X(i), y=Y(d.values[i]); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
    ctx.stroke(); ctx.lineWidth=1;
    // points + labels
    for(var j=0;j<n;j++){
      var px=X(j), py=Y(d.values[j]);
      ctx.fillStyle='#0d9488'; ctx.beginPath(); ctx.arc(px,py,6,0,7); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(px,py,2.5,0,7); ctx.fill();
      ctx.fillStyle='#0f172a'; ctx.textAlign='center';
      ctx.fillText(fmtNum(d.values[j]), px, py-12);
      var lab = d.labels[j].length>12 ? d.labels[j].slice(0,11)+'…' : d.labels[j];
      ctx.fillStyle='#475569'; ctx.fillText(lab, px, padT+ch+24);
    }
  }

  function drawPie(d){
    var total = d.values.reduce(function(a,b){return a+Math.max(0,b);},0) || 1;
    var cx = W/2 - 60, cy = H/2 + 20, r = 180;
    var ang = -Math.PI/2;
    ctx.font='13px sans-serif';
    for(var i=0;i<d.labels.length;i++){
      var frac = Math.max(0,d.values[i])/total;
      var a2 = ang + frac*Math.PI*2;
      ctx.fillStyle = PALETTE[i%PALETTE.length];
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,ang,a2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke(); ctx.lineWidth=1;
      // percent label
      var mid = ang + frac*Math.PI;
      var pctTxt = Math.round(frac*100)+'%';
      ctx.fillStyle='#0f172a'; ctx.textAlign='center';
      ctx.fillText(pctTxt, cx+Math.cos(mid)*r*0.7, cy+Math.sin(mid)*r*0.7+5);
      ang = a2;
    }
    // legend
    var lx = cx + r + 50, ly = cy - r + 10;
    ctx.textAlign='left';
    for(var j=0;j<d.labels.length;j++){
      if(ly > H-40) break;
      ctx.fillStyle = PALETTE[j%PALETTE.length];
      ctx.fillRect(lx, ly-11, 16, 12);
      ctx.fillStyle='#0f172a';
      var lab = d.labels[j].length>22 ? d.labels[j].slice(0,21)+'…' : d.labels[j];
      ctx.fillText(lab+' ('+fmtNum(d.values[j])+')', lx+22, ly);
      ly += 26;
    }
  }

  function fmtNum(v){ return Math.abs(v)>=1000 ? Number(v.toFixed(0)).toLocaleString() : String(Math.round(v*100)/100); }
  function fmtTick(v){ return Math.abs(v)>=1000 ? (v/1000)+'k' : String(Math.round(v*100)/100); }

  draw(); // initial render with sample data
})();
