// Decision Tree Explorer — "Which ML algorithm fits your project?" classifier
(function () {
  // Simple binary tree: {q, yes: node|result, no: node|result}
  const TREE = {
    q: "Is your data <b>labeled</b>? (Do you know the correct answers for past examples?)",
    yes: {
      q: "Are you predicting a <b>number</b> or a <b>category</b>?",
      yes: { // number
        q: "Is the relationship roughly a <b>straight line</b>?",
        yes: { result: "Linear Regression", desc: "The simplest supervised model. Fits one line (or plane) through your data using least squares. Fast, interpretable, and the perfect first model — try it in our Regression Lab!" },
        no: { result: "Gradient Boosting / Random Forest", desc: "Ensembles of many small decision trees. They capture curves and interactions that a straight line misses, and they win most tabular-data competitions." }
      },
      no: { // category
        q: "Do you need to <b>explain WHY</b> the model makes each decision?",
        yes: { result: "Decision Tree", desc: "A flowchart of yes/no questions learned from data. Fully transparent — you can trace every single prediction back through the branches, exactly like you just did here!" },
        no: { result: "Neural Network", desc: "Layers of artificial neurons that learn complex patterns from raw data — images, text, audio. Powerful, but a 'black box' compared to trees." }
      }
    },
    no: {
      q: "Do you want to <b>find hidden groups</b> in the data?",
      yes: { result: "K-Means Clustering", desc: "Picks k centers and assigns every point to the nearest one, iterating until the groups stabilize. Great for customer segmentation — try it live in our K-Means visualizer!" },
      no: {
        q: "Do you want to <b>compress</b> the data into fewer dimensions?",
        yes: { result: "PCA (Principal Component Analysis)", desc: "Finds the directions of maximum variance and projects your data onto them — keeping the signal, dropping the noise. A staple preprocessing step." },
        no: { result: "Anomaly Detection", desc: "Learn what 'normal' looks like, then flag what isn't. Used for fraud detection, system monitoring, and quality control." }
      }
    }
  };

  const box = document.getElementById('treeBox');
  const pathEl = document.getElementById('treePath');
  let node = TREE;
  let path = [];

  function esc(s) { return s; } // questions contain safe <b> markup we authored

  function render() {
    if (node.result) {
      box.innerHTML =
        '<div class="result-box"><div style="font-size:2.4rem">🎯</div>' +
        '<h3>' + node.result + '</h3><p style="color:#c9d4e0">' + node.desc + '</p>' +
        '<button class="btn" id="treeRestart" style="margin-top:1rem">↺ Start Over</button></div>';
      document.getElementById('treeRestart').addEventListener('click', reset);
    } else {
      box.innerHTML =
        '<div class="tree-q"><h3>' + esc(node.q) + '</h3>' +
        '<div class="opts"><button class="btn" id="ansYes">Yes</button>' +
        '<button class="btn ghost" id="ansNo">No</button></div></div>';
      document.getElementById('ansYes').addEventListener('click', () => answer(true));
      document.getElementById('ansNo').addEventListener('click', () => answer(false));
    }
    pathEl.innerHTML = path.length
      ? 'Path so far: <code>' + path.map(p => (p.a ? '✓ ' : '✗ ') + p.q).join(' → ') + '</code>'
      : 'Path so far: <code>—</code>';
  }

  function shortQ(q) { const t = document.createElement('div'); t.innerHTML = q; return t.textContent.slice(0, 42) + '…'; }

  function answer(yes) {
    path.push({ q: shortQ(node.q), a: yes });
    node = yes ? node.yes : node.no;
    render();
  }
  function reset() { node = TREE; path = []; render(); }

  render();
})();
