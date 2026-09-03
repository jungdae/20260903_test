(function () {
  "use strict";
  var el = document.getElementById("seoul-time");
  if (el) {
    function tick() {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var h = "00", m = "00";
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === "hour") h = parts[i].value;
        if (parts[i].type === "minute") m = parts[i].value;
      }
      el.textContent = h + ":" + m;
    }
    tick();
    setInterval(tick, 1000);
  }

  var nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16 });
    nodes.forEach(function (n) { io.observe(n); });
  } else {
    nodes.forEach(function (n) { n.classList.add("in"); });
  }
})();
