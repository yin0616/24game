function cardValue(value) {
  value = value.toUpperCase();

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

function dfs(items, ops, results) {

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

      for (let k = 0; k < ops.length; k++) {
        const op = ops[k];
        const nextOps = ops.filter((_, x) => x !== k);

        let candidates = [];

        if (op === "+") {
          candidates.push({
            value: a.value + b.value,
            expr: `(${a.expr}+${b.expr})`
          });
        }

        if (op === "-") {
          candidates.push(
            {
              value: a.value - b.value,
              expr: `(${a.expr}-${b.expr})`
            },
            {
              value: b.value - a.value,
              expr: `(${b.expr}-${a.expr})`
            }
          );
        }

        if (op === "*") {
          candidates.push({
            value: a.value * b.value,
            expr: `(${a.expr}*${b.expr})`
          });
        }

        if (op === "/") {
          if (Math.abs(b.value) > EPS) {
            candidates.push({
              value: a.value / b.value,
              expr: `(${a.expr}/${b.expr})`
            });
          }
          if (Math.abs(a.value) > EPS) {
            candidates.push({
              value: b.value / a.value,
              expr: `(${b.expr}/${a.expr})`
            });
          }
        }

        for (const c of candidates) {
          dfs([...rest, c], nextOps, results);
        }
      }
    }
  }
}

function combinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];

  const [first, ...rest] = arr;

  return [
    ...combinations(rest, k - 1).map(c => [first, ...c]),
    ...combinations(rest, k)
  ];
}


function solve() {
  const summary = document.getElementById("summary");
  const output = document.getElementById("output");

  try {
    const inputs = [
      document.getElementById("c1").value.trim(),
      document.getElementById("c2").value.trim(),
      document.getElementById("c3").value.trim(),
      document.getElementById("c4").value.trim()
    ];

    const items = inputs.map(s => ({
      value: cardValue(s),
      expr: s.toUpperCase()
    }));

    const results = new Set();

    const ALL_OPS = ["+", "-", "*", "/"];
    const opSets = combinations(ALL_OPS, 3);

    for (const ops of opSets) {
      dfs(items, ops, results);
    }

    if (results.size === 0) {
      summary.textContent = "無解";
      output.textContent = "";
    } else {
      summary.textContent = `共找到 ${results.size} 種解法`;
      output.textContent =
        [...results].map(e => `${e} = 24`).join("\n");
    }

  } catch (e) {
    summary.textContent = "輸入錯誤";
    output.textContent = e.message;
  }
}

