(function () {
  "use strict";
  var el = document.getElementById("seoul-time");
  if (!el) return;
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
})();
