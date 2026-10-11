/* APA 7th / MLA 9th citation generator — books & websites */
(function(){
  "use strict";

  function splitAuthor(raw){
    // expects "Last, First" — returns {last, first, initial}
    var parts = raw.split(",");
    var last = (parts[0]||"").trim();
    var first = (parts[1]||"").trim();
    var initial = first ? first.charAt(0).toUpperCase()+"." : "";
    return {last:last, first:first, initial:initial};
  }

  function generate(){
    var style = document.getElementById("style").value;
    var type = document.getElementById("srcType").value;
    var a = splitAuthor(document.getElementById("author").value);
    var year = document.getElementById("year").value.trim();
    var title = document.getElementById("title").value.trim();
    var cite = "";

    if (type === "book"){
      var publisher = document.getElementById("publisher").value.trim();
      if (style === "apa"){
        // Smith, J. (2024). Title of book. Publisher.
        cite = a.last + (a.initial ? ", "+a.initial : "") +
               (year ? " ("+year+")." : ".") +
               (title ? " "+title+"." : "") +
               (publisher ? " "+publisher+"." : "");
      } else {
        // Smith, John. Title of Book. Publisher, 2024.
        cite = a.last + (a.first ? ", "+a.first : "") + "." +
               (title ? " "+title+"." : "") +
               (publisher ? " "+publisher+"," : "") +
               (year ? " "+year+"." : "");
      }
    } else {
      var site = document.getElementById("siteName").value.trim();
      var url = document.getElementById("url").value.trim();
      var accessed = document.getElementById("accessDate").value.trim();
      if (style === "apa"){
        // Smith, J. (2024, January 5). Title of page. Site Name. https://url
        cite = a.last + (a.initial ? ", "+a.initial : "") +
               (year ? " ("+year+")." : ".") +
               (title ? " "+title+"." : "") +
               (site ? " "+site+"." : "") +
               (url ? " "+url : "");
      } else {
        // Smith, John. "Title of Page." Website Name, Day Month Year, URL.
        cite = a.last + (a.first ? ", "+a.first : "") + "." +
               (title ? ' "'+title+'."' : "") +
               (site ? " "+site+"," : "") +
               (accessed ? " "+accessed+"," : "") +
               (url ? " "+url+"." : "");
      }
    }

    cite = cite.replace(/\s+/g," ").trim();
    var out = document.getElementById("citeOut");
    if (!a.last && !title){ out.style.display = "none"; return; }
    document.getElementById("citeText").textContent = cite || "Fill in at least the author and title.";
    out.style.display = "block";
  }

  function toggleFields(){
    var type = document.getElementById("srcType").value;
    document.getElementById("bookFields").style.display = type==="book" ? "block" : "none";
    document.getElementById("webFields").style.display = type==="website" ? "block" : "none";
  }

  function copyCite(){
    var text = document.getElementById("citeText").textContent;
    var btn = document.getElementById("copyBtn");
    function done(){ btn.textContent = "✓ Copied!"; setTimeout(function(){ btn.textContent = "📋 Copy Citation"; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){ fallback(); });
    } else { fallback(); }
    function fallback(){
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch(e){}
      document.body.removeChild(ta); done();
    }
  }

  document.getElementById("genBtn").addEventListener("click", generate);
  document.getElementById("srcType").addEventListener("change", toggleFields);
  document.getElementById("copyBtn").addEventListener("click", copyCite);
  ["author","year","title","publisher","siteName","url","accessDate"].forEach(function(id){
    document.getElementById(id).addEventListener("input", generate);
  });
  document.getElementById("style").addEventListener("change", generate);
})();
