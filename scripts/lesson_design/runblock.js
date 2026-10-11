// Runnable code block of the lesson stand (```python run): shows the steps
// recorded at build time. Head: file name and «Запуск»; while running —
// back, counter, forward, close. Variables sit beside the code when there is
// room, under it otherwise; lists, dictionaries and sets are separate boxes
// that names point to. Heights are reserved for the largest step, so nothing
// jumps while stepping.
(function () {
  var ICON = {
    prev: '<path d="m15 6-6 6 6 6"/>',
    next: '<path d="m9 6 6 6-6 6"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  };
  var NS = "http://www.w3.org/2000/svg";
  function ic(n) {
    return (
      '<svg class="ic" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">' +
      ICON[n] +
      "</svg>"
    );
  }
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function rich(t) {
    return esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function typed(t) {
    return esc(t).replace(/⟪(.*?)⟫/g, '<kbd class="typed">$1</kbd>');
  }
  function kind(v) {
    if (v.charAt(0) === "[") return "список";
    if (
      v === "set()" ||
      (v.charAt(0) === "{" && v !== "{}" && v.indexOf(":") < 0)
    )
      return "множество";
    return "словарь";
  }

  document.querySelectorAll("pre[data-run]").forEach(function (pre) {
    var steps = JSON.parse(pre.dataset.run),
      last = steps.length - 1,
      i = 0;
    var box = pre.closest(".code-box"),
      head = box.querySelector(".code-head");
    var lines = pre.querySelectorAll(".ln");
    var statics = [].slice.call(box.querySelectorAll(".out"));
    var hasNames = steps.some(function (s) {
      return s.frames.some(function (f) {
        return f.names.length;
      });
    });
    var hasObjs = steps.some(function (s) {
      return Object.keys(s.objs).length;
    });
    var hasCalls = steps.some(function (s) {
      return s.frames.length > 1;
    });
    var longest = 1;
    steps.forEach(function (s) {
      s.frames.forEach(function (f) {
        f.names.forEach(function (n) {
          longest = Math.max(longest, n.n.length);
        });
      });
    });
    box.style.setProperty("--vn", longest + "ch");
    box.classList.add("run-box");
    box.tabIndex = -1;

    var go = document.createElement("button");
    go.type = "button";
    go.className = "run-go";
    go.innerHTML = ic("play") + "<span>Запуск</span>";
    go.setAttribute("aria-label", "Выполнить программу по шагам");
    var ctl = document.createElement("span");
    ctl.className = "run-ctl";
    ctl.hidden = true;
    ctl.innerHTML =
      '<button type="button" class="ib run-prev" aria-label="Предыдущий шаг">' +
      ic("prev") +
      "</button>" +
      '<span class="run-count" aria-live="polite"></span>' +
      '<button type="button" class="ib run-next" aria-label="Следующий шаг">' +
      ic("next") +
      "</button>" +
      '<button type="button" class="ib run-close" aria-label="Закончить пошаговый запуск">' +
      ic("close") +
      "</button>";
    head.append(go, ctl);

    var main = document.createElement("div");
    main.className = "run-main";
    pre.before(main);
    main.append(pre);
    var vars = document.createElement("div");
    vars.className = "run-vars";
    vars.hidden = true;
    vars.innerHTML =
      '<p class="run-h">Переменные</p><div class="vars' +
      (hasObjs ? " with-objs" : "") +
      '"><div class="frames"></div><div class="objs"></div></div>';
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "links");
    svg.setAttribute("aria-hidden", "true");
    vars.querySelector(".vars").append(svg);
    if (hasNames) main.append(vars);
    var note = document.createElement("p");
    note.className = "run-note";
    note.hidden = true;
    note.setAttribute("aria-live", "polite");
    var out = document.createElement("div");
    out.className = "out out-output out-lines run-out";
    out.hidden = true;
    out.innerHTML = '<span class="out-l">Вывод</span><pre class="out-v"></pre>';
    main.after(note);
    note.after(out);

    var prev = ctl.querySelector(".run-prev"),
      next = ctl.querySelector(".run-next");
    var count = ctl.querySelector(".run-count"),
      outV = out.querySelector(".out-v");
    var frames = vars.querySelector(".frames"),
      objs = vars.querySelector(".objs");

    function frameHtml(s) {
      var html = "";
      for (var k = s.frames.length - 1; k >= 0; k--) {
        var f = s.frames[k];
        var rows = f.names
          .map(function (n) {
            var cls =
              "var" +
              (n.ch && i > 0 ? " ch" : "") +
              (n.v === "функция" || n.v === "генератор" ? " fn" : "");
            var val =
              n.ref !== null
                ? '<span class="vref" data-ref="' + n.ref + '"></span>'
                : '<span class="vv">' + esc(n.v) + "</span>";
            return (
              '<div class="' +
              cls +
              '"><span class="vn">' +
              esc(n.n) +
              "</span>" +
              val +
              "</div>"
            );
          })
          .join("");
        if (!f.names.length && !html)
          rows = '<p class="run-empty">пока нет</p>';
        var cls =
          "fr" +
          (k ? " call" : "") +
          (k && k === s.frames.length - 1 ? " active" : "");
        var title =
          k || hasCalls ? '<span class="fr-t">' + esc(f.title) + "</span>" : "";
        html = '<div class="' + cls + '">' + title + rows + html + "</div>";
      }
      return html;
    }
    function place() {
      // each object at the height of the first name that leads to it, so the
      // arrows run almost straight and never cross other rows
      var top0 = objs.getBoundingClientRect().top,
        bottom = 0;
      objs.querySelectorAll(".obj").forEach(function (o) {
        var dot = frames.querySelector('.vref[data-ref="' + o.dataset.k + '"]');
        var want = dot ? dot.getBoundingClientRect().top - top0 - 6 : bottom;
        var y = Math.max(want, bottom);
        o.style.top = y + "px";
        bottom = y + o.offsetHeight + 10;
      });
      objs.style.height = bottom + "px";
    }
    function draw() {
      place();
      svg.replaceChildren();
      var base = svg.parentNode.getBoundingClientRect();
      svg.setAttribute("width", base.width);
      svg.setAttribute("height", base.height);
      frames.querySelectorAll(".vref").forEach(function (dot) {
        var target = objs.querySelector('[data-k="' + dot.dataset.ref + '"]');
        if (!target) return;
        var a = dot.getBoundingClientRect(),
          b = target.getBoundingClientRect();
        var x1 = a.left + a.width / 2 - base.left,
          y1 = a.top + a.height / 2 - base.top;
        var x2 = b.left - base.left - 2,
          y2 = b.top + Math.min(b.height / 2, 16) - base.top;
        var dx = Math.max(24, (x2 - x1) / 2);
        var hot = dot.parentNode.classList.contains("ch");
        var path = document.createElementNS(NS, "path");
        path.setAttribute(
          "d",
          "M" +
            x1 +
            " " +
            y1 +
            " C" +
            (x1 + dx) +
            " " +
            y1 +
            " " +
            (x2 - dx) +
            " " +
            y2 +
            " " +
            (x2 - 7) +
            " " +
            y2,
        );
        path.setAttribute("class", "link" + (hot ? " hot" : ""));
        var head = document.createElementNS(NS, "path");
        head.setAttribute("d", "M" + x2 + " " + y2 + " l-8 -4.5 v9 z");
        head.setAttribute("class", "head" + (hot ? " hot" : ""));
        svg.append(path, head);
      });
    }
    function show() {
      var s = steps[i];
      lines.forEach(function (l, k) {
        l.classList.toggle("on", s.line === k + 1);
        l.classList.toggle("bad", s.line === k + 1 && !!s.stop);
      });
      note.innerHTML =
        '<span class="run-l">' +
        (s.line ? "строка " + s.line : "начало") +
        "</span>" +
        '<span class="run-t">' +
        rich(s.text) +
        "</span>";
      frames.innerHTML = frameHtml(s);
      objs.innerHTML = Object.keys(s.objs)
        .map(function (k) {
          var o = s.objs[k];
          return (
            '<div class="obj' +
            (o.ch && i > 0 ? " ch" : "") +
            '" data-k="' +
            k +
            '"><span class="obj-t">' +
            kind(o.v) +
            "</span><code>" +
            esc(o.v) +
            "</code></div>"
          );
        })
        .join("");
      var text = s.out.replace(/\n$/, "");
      outV.innerHTML =
        (text ? typed(text) : '<span class="run-empty">пока пусто</span>') +
        (s.stop
          ? (text ? "\n" : "") +
            '<span class="out-err">' +
            esc(s.error) +
            "</span>"
          : "");
      prev.disabled = i === 0;
      next.disabled = i === last;
      count.textContent = i + " / " + last;
      draw();
    }
    function layout() {
      // beside the code when the code is narrow enough to leave the panel room
      var code = pre.querySelector("code");
      code.style.display = "inline-block";
      var codeW = code.offsetWidth + 34;
      code.style.display = "";
      var side = hasNames && box.clientWidth - codeW >= (hasObjs ? 330 : 250);
      box.classList.toggle("side", side);
      box.style.setProperty("--code-w", codeW + "px");
    }
    function reserve() {
      // the tallest step fixes the heights: stepping never shifts the page
      [note, vars, out].forEach(function (el) {
        el.style.minHeight = "";
      });
      var keep = i,
        tall = [0, 0, 0];
      for (i = 0; i <= last; i++) {
        show();
        [note, vars, out].forEach(function (el, k) {
          tall[k] = Math.max(
            tall[k],
            Math.ceil(el.getBoundingClientRect().height),
          );
        });
      }
      [note, vars, out].forEach(function (el, k) {
        el.style.minHeight = tall[k] + "px";
      });
      i = keep;
      show();
    }
    var width = 0;
    function open(on) {
      box.classList.toggle("running", on);
      vars.hidden = note.hidden = out.hidden = ctl.hidden = !on;
      go.hidden = on;
      statics.forEach(function (o) {
        o.hidden = on;
      });
      if (on) {
        i = Math.min(1, last);
        width = box.clientWidth;
        layout();
        reserve();
        box.focus({ preventScroll: true });
      } else {
        lines.forEach(function (l) {
          l.classList.remove("on", "bad");
        });
        box.classList.remove("side");
        go.focus();
      }
    }
    go.onclick = function () {
      open(true);
    };
    ctl.querySelector(".run-close").onclick = function () {
      open(false);
    };
    prev.onclick = function () {
      if (i > 0) {
        i--;
        show();
      }
    };
    next.onclick = function () {
      if (i < last) {
        i++;
        show();
      }
    };
    box.addEventListener("keydown", function (e) {
      if (!box.classList.contains("running")) return;
      if (e.key === "ArrowRight") {
        next.click();
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") {
        prev.click();
        e.preventDefault();
      }
      if (e.key === "Escape") open(false);
    });
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (!box.classList.contains("running") || box.clientWidth === width)
          return;
        width = box.clientWidth;
        layout();
        reserve();
      }).observe(box);
    }
  });
})();
