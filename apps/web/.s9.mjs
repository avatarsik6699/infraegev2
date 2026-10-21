import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
for (const s of ["tablicy-i-klyuchi","svyaz-listov-vpr","otbor-zapisey","vklad-zapisi"]) {
  await p.goto(`http://localhost:8080/ege/3-svyazannye-tablicy/${s}`, { waitUntil: "networkidle" });
  const blocks = p.locator("[data-sheet-block]");
  const n = await blocks.count();
  for (let i = 0; i < n; i++) {
    const blk = blocks.nth(i);
    const vis = await blk.isVisible();
    const btns = blk.locator("button[aria-current], ul button");
    const k = await btns.count();
    for (let j = 0; j < k; j++) {
      if (!vis) break;
      const btn = btns.nth(j);
      const label = (await btn.innerText()).split("\n")[0];
      await btn.click();
      await p.waitForTimeout(150);
      const sel = await blk.evaluate((el) => {
        const c = el.querySelector("td[data-selected]");
        if (!c) return "NONE";
        const r = c.getBoundingClientRect(), box = c.closest("[data-sheet-name]").getBoundingClientRect();
        return `${c.closest("tr").querySelector("th").textContent}:${c.textContent} inview=${r.left >= box.left - 1 && r.right <= box.right + 1}`;
      });
      const bar = await blk.evaluate((el) => el.querySelector("[class*=bar], [class*=formula]")?.textContent?.slice(0, 50));
      console.log(s, i, label, "->", sel);
    }
    if (!vis) console.log(s, i, "hidden block (tab)");
  }
}
await b.close();
