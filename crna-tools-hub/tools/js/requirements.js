// CRNA Path Checklist Generator — builds a personalized roadmap from 5 inputs
(function () {
  "use strict";

  var STEPS_ALL = [
    {
      id: "bsn",
      title: "Earn a BSN (Bachelor of Science in Nursing)",
      desc: "Complete an accredited 4-year BSN program and pass the NCLEX-RN. An ADN is possible but most CRNA programs strongly prefer or require a BSN.",
      needs: ["no-rn", "rn-adn"],
      time: "4 years"
    },
    {
      id: "rn",
      title: "Become a licensed Registered Nurse",
      desc: "Pass the NCLEX-RN and obtain your state RN license. This is the legal foundation for everything after.",
      needs: ["no-rn"],
      time: "3–6 months prep"
    },
    {
      id: "icu",
      title: "Gain 1–3 years of adult ICU experience",
      desc: "Work full-time in a high-acuity adult ICU (SICU, MICU, CVICU, neuro ICU). Programs want to see you manage ventilators, vasoactive drips, and critically ill patients independently. Most accepted applicants have 2–3 years.",
      needs: ["no-icu", "icu-under2"],
      time: "1–3 years"
    },
    {
      id: "ccrn",
      title: "Earn your CCRN certification",
      desc: "The CCRN (Critical Care Registered Nurse) is not officially required everywhere, but it dramatically strengthens your application and proves ICU mastery. Requires ~1,750 hours of direct bedside critical-care practice.",
      needs: ["no-ccrn"],
      time: "2–4 months study"
    },
    {
      id: "shadow",
      title: "Shadow a CRNA (40+ hours)",
      desc: "Most programs require documented shadowing. It proves you understand the role and gives you a mentor who can write your recommendation letter.",
      needs: ["no-shadow"],
      time: "1–2 months"
    },
    {
      id: "gpa",
      title: "Strengthen your GPA / prerequisites",
      desc: "Competitive applicants have 3.5+ GPAs. Retake key sciences (chemistry, pharmacology, statistics, anatomy) if needed — many programs look at your science GPA separately.",
      needs: ["low-gpa"],
      time: "1–2 semesters"
    },
    {
      id: "research",
      title: "Research accredited DNP nurse anesthesia programs",
      desc: "As of 2025, all US programs are doctoral (DNP or DNAP). Compare cost, attrition rates, first-time board pass rates, and clinical site variety. The COA database lists every accredited program.",
      needs: ["all"],
      time: "1–2 months"
    },
    {
      id: "apply",
      title: "Apply to 3–5 programs",
      desc: "Typical requirements: BSN, RN license, ICU experience, CCRN (recommended), 3 recommendation letters (one from a CRNA), personal statement, and an interview. Application cycles open 9–12 months before start dates.",
      needs: ["all"],
      time: "1 application cycle"
    },
    {
      id: "dnp",
      title: "Complete the 3-year doctoral program",
      desc: "36 months of intense didactic + clinical training: ~2,000 clinical hours and 600+ anesthesia cases. You cannot work during most programs — plan your finances now.",
      needs: ["all"],
      time: "3 years"
    },
    {
      id: "boards",
      title: "Pass the NCE and get licensed",
      desc: "Pass the National Certification Examination (NCE) to earn the CRNA credential, then obtain your state's APRN license. Start applying for jobs 3–6 months before graduation.",
      needs: ["all"],
      time: "2–4 months"
    }
  ];

  var PROFILES = {
    "student":  { needs: ["no-rn"],        label: "Nursing student / pre-nursing" },
    "rn-noicu":{ needs: ["no-icu"],       label: "RN, no ICU experience yet" },
    "icu-new": { needs: ["icu-under2"],   label: "ICU RN, under 2 years" },
    "icu-exp": { needs: [],               label: "ICU RN, 2+ years" }
  };

  function init() {
    var btn = document.getElementById("gen-btn");
    var out = document.getElementById("roadmap");
    if (!btn || !out) { return; }

    btn.addEventListener("click", function () {
      var profile = document.querySelector('input[name="profile"]:checked');
      var ccrn = document.querySelector('input[name="ccrn"]:checked');
      var shadow = document.querySelector('input[name="shadow"]:checked');
      var gpa = document.querySelector('input[name="gpa"]:checked');
      if (!profile || !ccrn || !shadow || !gpa) {
        alert("Please answer all 5 questions first.");
        return;
      }

      var needs = PROFILES[profile.value].needs.slice();
      if (profile.value === "rn-noicu" || profile.value === "student") { needs.push("no-icu"); }
      if (profile.value === "rn-adn") { needs.push("rn-adn"); }
      if (ccrn.value === "no") { needs.push("no-ccrn"); }
      if (shadow.value === "no") { needs.push("no-shadow"); }
      if (gpa.value === "low") { needs.push("low-gpa"); }

      var steps = STEPS_ALL.filter(function (s) {
        return s.needs.indexOf("all") !== -1 ||
               s.needs.some(function (n) { return needs.indexOf(n) !== -1; });
      });

      // Remove BSN/RN steps for experienced ICU RNs
      if (profile.value === "icu-exp" || profile.value === "icu-new") {
        steps = steps.filter(function (s) { return s.id !== "bsn" && s.id !== "rn"; });
      }
      // Keep ICU step only if relevant
      if (profile.value === "icu-exp") {
        steps = steps.filter(function (s) { return s.id !== "icu"; });
      }

      // Estimated total timeline
      var years = 0;
      steps.forEach(function (s) {
        if (s.id === "bsn") { years += 4; }
        else if (s.id === "icu") { years += (profile.value === "icu-new" ? 1.5 : 2.5); }
        else if (s.id === "dnp") { years += 3; }
        else if (s.id === "gpa") { years += 1; }
      });

      var html = '<h3>Your personalized CRNA roadmap</h3>' +
        '<p class="hint">Based on your answers: <strong>' +
        PROFILES[profile.value].label + '</strong>' +
        (years > 0 ? ' · Estimated timeline: <strong>~' + years.toFixed(1) + ' years</strong> from today to CRNA' : '') +
        '</p><div class="steps">';

      steps.forEach(function (s, i) {
        html += '<div class="checkline"><input type="checkbox" id="step-' + i + '">' +
          '<label for="step-' + i + '" style="font-weight:400"><strong>' + (i + 1) + '. ' + s.title + '</strong>' +
          '<br><span class="hint">' + s.desc + ' <em>Typical time: ' + s.time + '.</em></span></label></div>';
      });
      html += '</div><p class="hint" style="margin-top:14px">Tick boxes as you complete each milestone. ' +
        '<a href="../tools/crna-roi.html">Check if CRNA school pays off for you →</a></p>';

      out.innerHTML = html;
      out.classList.add("show");
      out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
