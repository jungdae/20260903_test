(function () {
  "use strict";

  var timeEl = document.getElementById("seoul-time");
  var cursor = document.getElementById("cursor");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function clock() {
    if (!timeEl) return;
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var h = "00", m = "00";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].type === "hour") h = parts[i].value;
      if (parts[i].type === "minute") m = parts[i].value;
    }
    timeEl.textContent = h + ":" + m;
  }
  clock();
  setInterval(clock, 1000);

  if (cursor && fine) {
    document.body.classList.add("has-cursor");
    window.addEventListener("pointermove", function (e) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }, { passive: true });
  }

  var nodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  } else {
    nodes.forEach(function (n) { n.classList.add("in"); });
  }
})();
