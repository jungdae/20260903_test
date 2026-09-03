(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  var title = document.getElementById("title");
  if (title && !reduce) {
    var text = title.textContent;
    title.textContent = "";
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement("span");
      s.textContent = text[i];
      s.style.animationDelay = (0.35 + i * 0.12) + "s";
      title.appendChild(s);
    }
  }

  var light = document.getElementById("gate-light");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (light && fine && !reduce) {
    var tx = window.innerWidth * 0.5;
    var ty = window.innerHeight * 0.38;
    var x = tx, y = ty;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
    }, { passive: true });
    (function follow() {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      light.style.transform = "translate(" + x + "px," + y + "px)";
      requestAnimationFrame(follow);
    })();
  }

  var canvas = document.getElementById("gate-dust");
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext("2d");
    var w = 0, h = 0, specks = [];
    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      specks = [];
      var n = w < 700 ? 18 : 32;
      for (var i = 0; i < n; i++) {
        specks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + Math.random() * 1.1,
          v: 0.08 + Math.random() * 0.18,
          a: 0.12 + Math.random() * 0.25
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < specks.length; i++) {
        var p = specks[i];
        p.y -= p.v;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        ctx.fillStyle = "rgba(212,180,131," + p.a + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  }

  var nodes = document.querySelectorAll(".reveal");
  if (nodes.length) {
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
  }
})();
