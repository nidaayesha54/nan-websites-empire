/* AIVideoPromptsPro — prompt library: search, category filter, copy */
(function(){
  var CATS = ["All","Cinematic","Product Ads","Anime","Nature","Horror","Comedy","Travel","Food","Fashion","Abstract"];
  var chips = document.getElementById("chips");
  var search = document.getElementById("search");
  var results = document.getElementById("results");
  var count = document.getElementById("count");
  var activeCat = "All";

  CATS.forEach(function(c){
    var b = document.createElement("button");
    b.className = "chip" + (c === "All" ? " active" : "");
    b.textContent = c;
    b.addEventListener("click", function(){
      activeCat = c;
      var all = chips.querySelectorAll(".chip");
      for (var i = 0; i < all.length; i++) all[i].classList.remove("active");
      b.classList.add("active");
      render();
    });
    chips.appendChild(b);
  });

  function esc(s){
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function render(){
    var q = search.value.trim().toLowerCase();
    var list = PRO_PROMPTS.filter(function(p){
      var okCat = activeCat === "All" || p.cat === activeCat;
      var okQ = !q || (p.title + " " + p.text + " " + p.cat).toLowerCase().indexOf(q) !== -1;
      return okCat && okQ;
    });
    count.textContent = list.length + " prompt" + (list.length === 1 ? "" : "s") + (activeCat !== "All" ? " in " + activeCat : "");
    if (!list.length){
      results.innerHTML = "<p class='section-sub'>No prompts match. Try another keyword or category.</p>";
      return;
    }
    var html = "";
    for (var i = 0; i < list.length; i++){
      var p = list[i];
      html += "<div class='prompt-card'><span class='cat'>" + esc(p.cat) + "</span>" +
        "<h3>" + esc(p.title) + "</h3>" +
        "<p class='prompt-text'>" + esc(p.text) + "</p>" +
        "<button class='copy-btn' data-i='" + PRO_PROMPTS.indexOf(p) + "'>Copy prompt</button></div>";
    }
    results.innerHTML = html;
    var btns = results.querySelectorAll(".copy-btn");
    for (var j = 0; j < btns.length; j++){
      btns[j].addEventListener("click", function(){
        var p = PRO_PROMPTS[parseInt(this.getAttribute("data-i"), 10)];
        var btn = this;
        function done(){
          btn.textContent = "Copied!";
          btn.classList.add("ok");
          setTimeout(function(){ btn.textContent = "Copy prompt"; btn.classList.remove("ok"); }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(p.text).then(done).catch(function(){ fallback(); });
        } else { fallback(); }
        function fallback(){
          var ta = document.createElement("textarea");
          ta.value = p.text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch(e){}
          document.body.removeChild(ta);
          done();
        }
      });
    }
  }

  search.addEventListener("input", render);
  render();
})();
