// Live mini-sheet of the Excel course stand (sheetblock.py renders the table).
// Inlined after sheet_eval.js: uses Book, formatted, references, tokenize,
// parseAddress, address, colNumber from it.
//
// Select a cell (mouse or arrows): the formula bar shows its formula and the cells
// it reads get coloured frames, as in Excel. An input cell can be retyped
// (Enter, F2 or a double click; Enter/Tab keep the text, Esc cancels); the
// sheet recomputes and «Вернуть исходные» restores the author's numbers.
var REF_COLORS = ["#1f4fd0", "#7a3fb8", "#0b6e75", "#2a6a3a", "#9a5b00"];

document.querySelectorAll("[data-sheetblock]").forEach(function (fig) {
  var data = JSON.parse(fig.querySelector(".sheet-data").textContent);
  var original = {};
  var book = new Book();
  var formats = {};
  var editable = {};
  data.sheets.forEach(function (s) {
    var sheet = book.sheet(s.name);
    s.filtered.forEach(function (r) {
      sheet.filtered.add(r);
    });
    s.hidden.forEach(function (r) {
      sheet.hidden.add(r);
    });
    Object.keys(s.inputs).forEach(function (a) {
      book.set(s.name, a, s.inputs[a]);
      original[s.name + "!" + a] = s.inputs[a];
    });
    Object.keys(s.formats).forEach(function (a) {
      formats[s.name + "!" + a] = s.formats[a];
    });
    s.edit.forEach(function (a) {
      editable[s.name + "!" + a] = true;
    });
  });
  var panels = [].slice.call(fig.querySelectorAll(".sheet-scroll"));
  var tabs = [].slice.call(fig.querySelectorAll(".sheet-tabs [role=tab]"));
  var addrBox = fig.querySelector(".sheet-addr");
  var fBox = fig.querySelector(".sheet-f");
  var live = fig.querySelector(".sheet-live");
  var reset = fig.querySelector(".sheet-reset");
  var current = data.select
    ? { sheet: data.select[0], addr: data.select[1] }
    : null;
  var editing = null;

  function panelOf(name) {
    return panels.filter(function (p) {
      return p.dataset.sheetName === name;
    })[0];
  }
  function td(name, addr) {
    var p = panelOf(name);
    return p && p.querySelector('td[data-a="' + addr + '"]');
  }
  function input(name, addr) {
    return book.sheet(name).inputs.get(parseAddress(addr).join(",")) || "";
  }
  function kind(v) {
    if (v !== null && typeof v === "object" && "err" in v) return "err";
    if (typeof v === "boolean") return "bool";
    if (typeof v === "number") return "num";
    if (v === EMPTY) return "empty";
    return "txt";
  }

  function recompute(flash) {
    var changedCount = 0;
    book.cache.clear();
    panels.forEach(function (p) {
      var name = p.dataset.sheetName;
      p.querySelectorAll("td[data-a]").forEach(function (cell) {
        if (editing && editing.cell === cell) return;
        var a = cell.dataset.a;
        var v = book.value(name, a);
        var text = formatted(v, formats[name + "!" + a]);
        var changed = cell.textContent !== text;
        cell.textContent = text;
        ["num", "txt", "bool", "err", "empty"].forEach(function (k) {
          cell.classList.toggle(k, k === kind(v));
        });
        cell.classList.toggle("f", input(name, a).charAt(0) === "=");
        if (changed && input(name, a).charAt(0) === "=") changedCount++;
        if (flash && changed) {
          cell.classList.remove("chg");
          void cell.offsetWidth;
          cell.classList.add("chg");
        }
      });
    });
    return changedCount;
  }

  function showSheet(name) {
    panels.forEach(function (p, i) {
      var on = p.dataset.sheetName === name;
      p.hidden = !on;
      if (tabs[i]) {
        tabs[i].setAttribute("aria-selected", on);
        tabs[i].tabIndex = on ? 0 : -1;
      }
    });
  }

  function clearFrames() {
    fig.querySelectorAll("td.ref").forEach(function (c) {
      c.classList.remove("ref");
      c.style.removeProperty("--rc");
      c.removeAttribute("data-edge");
    });
    tabs.forEach(function (t) {
      t.style.removeProperty("--rc");
      t.classList.remove("ref");
    });
  }

  function frame(name, ref, color) {
    var p = panelOf(name);
    if (!p) return;
    for (var r = ref.r1; r <= ref.r2; r++) {
      for (var c = ref.c1; c <= ref.c2; c++) {
        var cell = p.querySelector('td[data-a="' + address(r, c) + '"]');
        if (!cell) continue;
        var edge =
          (r === ref.r1 ? "t" : "") +
          (r === ref.r2 ? "b" : "") +
          (c === ref.c1 ? "l" : "") +
          (c === ref.c2 ? "r" : "");
        cell.classList.add("ref");
        cell.style.setProperty("--rc", color);
        cell.setAttribute("data-edge", edge);
      }
    }
    tabs.forEach(function (t) {
      if (t.textContent === name && p.hidden) {
        t.classList.add("ref");
        t.style.setProperty("--rc", color);
      }
    });
  }

  function formulaHtml(text) {
    // the formula with every reference coloured as its frame
    if (text.charAt(0) !== "=") return { html: escapeHtml(text), refs: [] };
    var toks;
    try {
      toks = tokenize(text);
    } catch (e) {
      return { html: escapeHtml(text), refs: [] };
    }
    var out = "",
      pos = 0,
      refs = [],
      seen = {};
    toks.forEach(function (t) {
      if (t.kind !== "ref") return;
      if (!(t.text in seen)) {
        seen[t.text] = REF_COLORS[Object.keys(seen).length % REF_COLORS.length];
        refs.push({ text: t.text, color: seen[t.text] });
      }
      out +=
        escapeHtml(text.slice(pos, t.start)) +
        '<span class="rf" style="--rc:' +
        seen[t.text] +
        '">' +
        escapeHtml(t.text) +
        "</span>";
      pos = t.start + t.text.length;
    });
    return { html: out + escapeHtml(text.slice(pos)), refs: refs };
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function select(name, addr, focus) {
    var cell = td(name, addr);
    if (!cell) return;
    current = { sheet: name, addr: addr };
    fig.querySelectorAll("td.sel").forEach(function (c) {
      c.classList.remove("sel");
      c.tabIndex = -1;
      c.setAttribute("aria-selected", "false");
    });
    cell.classList.add("sel");
    cell.tabIndex = 0;
    cell.setAttribute("aria-selected", "true");
    if (focus) cell.focus();
    addrBox.textContent = (data.sheets.length > 1 ? name + "!" : "") + addr;
    var text = input(name, addr);
    var f = formulaHtml(text);
    fBox.innerHTML = f.html;
    clearFrames();
    f.refs.forEach(function (r) {
      var ref = parseRef(r.text);
      frame(ref.sheet === null ? name : ref.sheet, ref, r.color);
    });
  }

  function say(name, addr) {
    var v = book.value(name, addr);
    live.textContent = addr + ": " + formatted(v, formats[name + "!" + addr]);
  }

  function startEdit(cell, typedChar) {
    var name = cell.closest(".sheet-scroll").dataset.sheetName,
      a = cell.dataset.a;
    if (!editable[name + "!" + a]) {
      live.textContent =
        input(name, a).charAt(0) === "="
          ? "Это формула: её считает таблица. Измени исходные числа."
          : "Эту ячейку в примере не меняем.";
      return;
    }
    var box = document.createElement("input");
    box.type = "text";
    box.className = "sheet-in";
    box.value = typedChar !== undefined ? typedChar : input(name, a);
    box.setAttribute("aria-label", "Ячейка " + a);
    editing = { cell: cell, name: name, addr: a, box: box };
    cell.textContent = "";
    cell.appendChild(box);
    box.focus();
    if (typedChar === undefined) box.select();
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        commit(true);
        move(
          e.key === "Tab"
            ? e.shiftKey
              ? [0, -1]
              : [0, 1]
            : e.shiftKey
              ? [-1, 0]
              : [1, 0],
          true,
        );
      } else if (e.key === "Escape") {
        e.preventDefault();
        commit(false);
        select(name, a, true);
      }
    });
    box.addEventListener("blur", function () {
      if (editing && editing.box === box) commit(true);
    });
  }

  function commit(keep) {
    var e = editing;
    if (!e) return;
    editing = null;
    if (keep && e.box.value !== input(e.name, e.addr)) {
      book.set(e.name, e.addr, e.box.value);
      reset.hidden = false;
      var n = recompute(true);
      say(e.name, e.addr);
      live.textContent += n
        ? " — пересчитано формул: " + n
        : " — формулы не изменились";
    } else recompute(false);
    select(e.name, e.addr, false);
  }

  function move(d, quiet) {
    if (!current) return;
    var p = panelOf(current.sheet);
    var rc = parseAddress(current.addr),
      r = rc[0] + d[0],
      c = rc[1] + d[1];
    var rows = [].slice
      .call(p.querySelectorAll("tbody tr"))
      .filter(function (tr) {
        return !tr.hasAttribute("data-hidden");
      });
    var nums = rows.map(function (tr) {
      return Number(tr.querySelector("th").textContent);
    });
    if (d[0]) {
      var i = nums.indexOf(rc[0]) + d[0];
      if (i < 0 || i >= nums.length) return;
      r = nums[i];
    }
    if (td(current.sheet, address(r, c))) {
      select(current.sheet, address(r, c), true);
      if (!quiet) say(current.sheet, address(r, c));
    }
  }

  panels.forEach(function (p) {
    p.querySelectorAll("td[data-a]").forEach(function (cell) {
      cell.tabIndex = -1;
      cell.setAttribute("role", "gridcell");
      cell.addEventListener("click", function () {
        if (!editing || editing.cell !== cell)
          select(p.dataset.sheetName, cell.dataset.a, true);
      });
      cell.addEventListener("dblclick", function () {
        startEdit(cell);
      });
      cell.addEventListener("keydown", function (e) {
        if (editing) return;
        var arrows = {
          ArrowUp: [-1, 0],
          ArrowDown: [1, 0],
          ArrowLeft: [0, -1],
          ArrowRight: [0, 1],
        };
        if (arrows[e.key]) {
          e.preventDefault();
          move(arrows[e.key]);
        } else if (e.key === "Enter" || e.key === "F2") {
          e.preventDefault();
          startEdit(cell);
        } else if (
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          e.preventDefault();
          startEdit(cell, e.key);
        }
      });
    });
    var table = p.querySelector("table");
    table.setAttribute("role", "grid");
    table.setAttribute("aria-label", "Лист «" + p.dataset.sheetName + "»");
  });
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      // the selected formula keeps its frames: on the sheet it reads from they
      // show which cells of that sheet it uses
      showSheet(panels[i].dataset.sheetName);
      if (current) select(current.sheet, current.addr, false);
    });
  });
  reset.addEventListener("click", function () {
    data.sheets.forEach(function (s) {
      var sheet = book.sheet(s.name);
      sheet.inputs.clear();
      Object.keys(s.inputs).forEach(function (a) {
        sheet.inputs.set(parseAddress(a).join(","), s.inputs[a]);
      });
    });
    recompute(true);
    reset.hidden = true;
    live.textContent = "Исходные числа восстановлены.";
    if (current) select(current.sheet, current.addr, false);
  });

  fig.setAttribute("data-ready", "");
  recompute(false);
  if (!current) {
    var firstF = fig.querySelector("td.f") || fig.querySelector("td[data-a]");
    current = {
      sheet: firstF.closest(".sheet-scroll").dataset.sheetName,
      addr: firstF.dataset.a,
    };
  }
  select(current.sheet, current.addr, false);
  // a wide sheet hides the chosen cell to the right: scroll the sheet, not the page
  var start = td(current.sheet, current.addr);
  var pane = start && start.closest(".sheet-scroll");
  if (pane) {
    var over =
      start.getBoundingClientRect().right - pane.getBoundingClientRect().right;
    if (over > 0) pane.scrollLeft += over + 8;
  }
});
