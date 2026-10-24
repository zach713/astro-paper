// Copies posts that external automation drops into src/content/blog/
// into src/content/posts/ (the folder the site actually reads),
// normalizing front matter so the build never breaks.
// Generated files are prefixed "auto-" and are git-ignored.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, basename, extname } from "node:path";

const SRC = "src/content/blog";
const DEST = "src/content/posts";
if (!existsSync(SRC)) process.exit(0);
mkdirSync(DEST, { recursive: true });

const unquote = v => v.trim().replace(/^["']|["']$/g, "");
const yamlStr = v => JSON.stringify(v);

function parse(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && listKey) { data[listKey].push(unquote(li[1])); continue; }
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    if (v === "") { data[k] = []; listKey = k; continue; }
    listKey = null;
    if (v.startsWith("[")) data[k] = v.replace(/^\[|\]$/g, "").split(",").map(unquote).filter(Boolean);
    else data[k] = unquote(v);
  }
  return { data, body: m[2] };
}

let count = 0;
for (const f of readdirSync(SRC)) {
  if (![".md", ".mdx"].includes(extname(f))) continue;
  const parsed = parse(readFileSync(join(SRC, f), "utf8"));
  if (!parsed || !parsed.data.title) continue;
  const { data, body } = parsed;
  const slug = (data.postSlug || basename(f, extname(f)))
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const out = join(DEST, `auto-${slug}.md`);
  if (existsSync(out)) continue;

  let date = new Date(data.pubDatetime || data.pubDate || Date.now());
  const now = new Date();
  if (isNaN(date) || date > now) date = new Date(now.getTime() - 3600_000);
  const tags = Array.isArray(data.tags) && data.tags.length ? data.tags : ["others"];
  const desc = data.description || data.title;

  const fm = [
    "---",
    `author: ${yamlStr(data.author || "Digital Skills Hub")}`,
    `pubDatetime: ${date.toISOString()}`,
    `title: ${yamlStr(data.title)}`,
    "featured: false",
    "draft: false",
    "tags:",
    ...tags.map(t => `  - ${yamlStr(t)}`),
    `description: ${yamlStr(desc)}`,
    "---",
    "",
  ].join("\n");
  writeFileSync(out, fm + body.trimStart());
  count++;
}
console.log(`sync-blog-posts: generated ${count} post(s)`);
