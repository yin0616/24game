function cardValue(value) {
  value = value.trim().toUpperCase();

  if (value === "A" || value==="a") return 1;
  if (value === "J"|| value==="j") return 11;
  if (value === "Q"|| value==="q") return 12;
  if (value === "K"|| value==="k") return 13;

  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new Error("輸入錯誤：" + value);
  }
  return n;
}

const EPS = 1e-6;

function dfs(items, results) {
  if (items.length === 1) {
    if (Math.abs(items[0].value - 24) < EPS) {
      results.add(items[0].expr);
    }
    return;
  }

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;

      const a = items[i];
      const b = items[j];
      const rest = items.filter((_, k) => k !== i && k !== j);

      for (const op of ["+", "-", "*", "/"]) {
        let candidates = [];

        if (op === "+")
          candidates.push({ value: a.value + b.value, expr: `(${a.expr}+${b.expr})` });

        if (op === "-")
          candidates.push(
            { value: a.value - b.value, expr: `(${a.expr}-${b.expr})` },
            { value: b.value - a.value, expr: `(${b.expr}-${a.expr})` }
          );

        if (op === "*")
          candidates.push({ value: a.value * b.value, expr: `(${a.expr}*${b.expr})` });

        if (op === "/") {
          if (Math.abs(b.value) > EPS)
            candidates.push({ value: a.value / b.value, expr: `(${a.expr}/${b.expr})` });
          if (Math.abs(a.value) > EPS)
            candidates.push({ value: b.value / a.value, expr: `(${b.expr}/${a.expr})` });
        }

        for (const c of candidates) {
          dfs([...rest, c], results);
        }
      }
    }
  }
}

function solve() {
  const summary = document.getElementById("summary");
  const output = document.getElementById("output");

  try {
    const inputs = [
      c1.value,
      c2.value,
      c3.value,
      c4.value
    ];

    const items = inputs.map(v => ({
      value: cardValue(v),
      expr: v.trim().toUpperCase()
    }));

    const results = new Set();
    dfs(items, results);

    if (results.size === 0) {
      summary.textContent = "無解";
      output.textContent = "";
    } else {
      summary.textContent = `共找到 ${results.size} 種解法`;
      output.textContent =
        [...results].map(e => `${e} = 24`).join("\n");
    }

  } catch (err) {
    summary.textContent = "輸入錯誤";
    output.textContent = err.message;
  }
}