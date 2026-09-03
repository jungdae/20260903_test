(function () {
  "use strict";

  var timeEl = document.getElementById("seoul-time");
  var light = document.getElementById("light");
  var enter = document.getElementById("enter");
  var veil = document.getElementById("veil");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function seoulClock() {
    if (!timeEl) return;
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());
    var hour = "00";
    var minute = "00";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].type === "hour") hour = parts[i].value;
      if (parts[i].type === "minute") minute = parts[i].value;
    }
    var text = hour + ":" + minute;
    timeEl.textContent = text;
    timeEl.setAttribute("datetime", text);
  }

  seoulClock();
  setInterval(seoulClock, 1000);

  if (light && fine && !reduce) {
    var tx = window.innerWidth * 0.62;
    var ty = window.innerHeight * 0.38;
    var x = tx;
    var y = ty;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    function follow() {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      light.style.transform = "translate(" + x + "px," + y + "px)";
      requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);
  }

  if (enter && veil) {
    enter.addEventListener("click", function () {
      veil.hidden = false;
      requestAnimationFrame(function () {
        veil.classList.add("on");
      });
      window.setTimeout(function () {
        veil.classList.remove("on");
        window.setTimeout(function () {
          veil.hidden = true;
        }, 1100);
      }, 900);
    });
  }
})();
