import React from "react";

type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "table"; rows: string[][] };

const BULLET = /^[•▪●◦\-–*]\s*/;
const isShort = (l: string) => l.length <= 95 && !/[.,;]$/.test(l) && !BULLET.test(l) && !l.includes("\t");

/** Converts the plain-text content (as stored in the admin) into structured blocks. */
export function parseRich(text: string): Block[] {
  const out: Block[] = [];
  const blocks = (text || "").replace(/\r/g, "").split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.includes("\t")) {
        const rows: string[][] = [];
        while (i < lines.length && lines[i].includes("\t")) rows.push(lines[i++].split("\t").map((c) => c.trim()));
        out.push({ t: "table", rows });
        continue;
      }
      if (BULLET.test(line)) {
        const items: string[] = [];
        while (i < lines.length && BULLET.test(lines[i])) items.push(lines[i++].replace(BULLET, ""));
        out.push({ t: "ul", items });
        continue;
      }
      // a run of short lines
      if (isShort(line)) {
        let j = i;
        while (j < lines.length && isShort(lines[j])) j++;
        const run = lines.slice(i, j);
        const followedByText = j < lines.length;
        if (run.length === 1) {
          out.push(followedByText || lines.length > 1 ? { t: "h", text: line } : { t: "p", text: line });
        } else {
          // first item is a heading if the block starts with it, rest is a list
          const startsBlock = i === 0;
          if (startsBlock && run.length >= 2) {
            out.push({ t: "h", text: run[0] });
            if (run.length - 1 === 1 && followedByText) out.push({ t: "h", text: run[1] });
            else if (run.length > 1) out.push({ t: "ul", items: run.slice(1) });
          } else out.push({ t: "ul", items: run });
        }
        i = j;
        continue;
      }
      out.push({ t: "p", text: line });
      i++;
    }
  }
  return out;
}

function inline(text: string) {
  // **bold** support
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
}

function Item({ text }: { text: string }) {
  const m = text.match(/^([^:]{2,40}):\s+(.+)$/);
  if (m) return (<><strong>{m[1]}:</strong> {inline(m[2])}</>);
  return <>{inline(text)}</>;
}

export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = parseRich(text);
  return (
    <div className={"prose-bt " + className}>
      {blocks.map((b, i) => {
        if (b.t === "h") return <h3 key={i}>{b.text.replace(/:$/, "")}</h3>;
        if (b.t === "p") return <p key={i}>{inline(b.text)}</p>;
        if (b.t === "ul")
          return (
            <ul key={i} className={b.items.length > 5 && b.items.every((x) => x.length < 60) ? "cols" : ""}>
              {b.items.map((it, k) => (
                <li key={k}><Item text={it} /></li>
              ))}
            </ul>
          );
        const [head, ...rest] = b.rows;
        return (
          <div key={i} className="tbl">
            <table>
              <thead><tr>{head.map((c, k) => <th key={k}>{c}</th>)}</tr></thead>
              <tbody>{rest.map((r, k) => <tr key={k}>{r.map((c, n) => <td key={n}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
