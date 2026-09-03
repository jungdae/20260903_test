(function () {
  "use strict";
  var el = document.getElementById("seoul-time");
  if (!el) return;
  function tick() {
    var parts = new Intl.DateTimeFormat("ko-KR", {
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
    el.textContent = text;
    el.setAttribute("datetime", text);
  }
  tick();
  setInterval(tick, 1000);
})();

(function () {
  "use strict";

  var canvas = document.getElementById("field");
  var fog = document.getElementById("fog");
  var grain = document.getElementById("grain");
  var button = document.getElementById("breathe");
  if (!canvas || !fog || !button) return;

  var ctx = canvas.getContext("2d", { alpha: true });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var w = 0;
  var h = 0;
  var dpr = 1;
  var particles = [];
  var target = { x: 0.5, y: 0.42 };
  var fogPos = { x: 0.5, y: 0.42 };
  var drift = { t: 0, ax: 0.018, ay: 0.013 };
  var running = !reduce;
  var last = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed(count) {
    particles = [];
    var n = count || (w < 500 ? 36 : 64);
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.04 - Math.random() * 0.12,
        a: 0.12 + Math.random() * 0.35,
        warm: Math.random() > 0.62
      });
    }
  }

  function setFog(x, y) {
    fog.style.setProperty("--fog-x", (x * 100).toFixed(2) + "%");
    fog.style.setProperty("--fog-y", (y * 100).toFixed(2) + "%");
  }

  function step(now) {
    if (!running) return;
    var dt = Math.min(32, now - last || 16);
    last = now;

    if (!finePointer) {
      drift.t += dt * 0.00018;
      target.x = 0.5 + Math.sin(drift.t) * 0.22 + Math.sin(drift.t * 0.37) * 0.08;
      target.y = 0.42 + Math.cos(drift.t * 0.81) * 0.16;
    }

    fogPos.x += (target.x - fogPos.x) * 0.045;
    fogPos.y += (target.y - fogPos.y) * 0.045;
    setFog(fogPos.x, fogPos.y);

    ctx.clearRect(0, 0, w, h);
    var gx = fogPos.x * w;
    var gy = fogPos.y * h;

    var glow = ctx.createRadialGradient(gx, gy, 8, gx, gy, Math.min(w, h) * 0.42);
    glow.addColorStop(0, "rgba(227,154,60,0.13)");
    glow.addColorStop(0.35, "rgba(42,36,96,0.08)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx + (gx - p.x) * 0.00035;
      p.y += p.vy;
      if (p.y < -8) {
        p.y = h + 6;
        p.x = Math.random() * w;
      }
      if (p.x < -8) p.x = w + 4;
      if (p.x > w + 8) p.x = -4;
      ctx.beginPath();
      ctx.fillStyle = p.warm
        ? "rgba(227,154,60," + p.a + ")"
        : "rgba(196,210,255," + p.a * 0.55 + ")";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  function retrigger() {
    seed();
    fog.classList.remove("kick");
    void fog.offsetWidth;
    fog.style.animation = "none";
    void fog.offsetWidth;
    fog.style.animation = "";
    if (grain) {
      grain.classList.add("pulse");
      window.setTimeout(function () {
        grain.classList.remove("pulse");
      }, 520);
    }
    target.x = 0.38 + Math.random() * 0.24;
    target.y = 0.32 + Math.random() * 0.22;
    if (reduce) {
      setFog(target.x, target.y);
    }
  }

  window.addEventListener("resize", function () {
    resize();
    if (particles.length === 0) seed();
  }, { passive: true });

  if (finePointer) {
    window.addEventListener("pointermove", function (e) {
      target.x = e.clientX / Math.max(1, w);
      target.y = e.clientY / Math.max(1, h);
    }, { passive: true });
  }

  button.addEventListener("click", retrigger);

  resize();
  seed();
  setFog(fogPos.x, fogPos.y);

  if (running) {
    requestAnimationFrame(step);
  } else {
    ctx.clearRect(0, 0, w, h);
  }
})();
