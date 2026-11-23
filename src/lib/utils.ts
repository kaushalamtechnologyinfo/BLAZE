export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function excerpt(text: string, len = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len).replace(/\s\S*$/, "") + "…" : t;
}

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function telHref(phone: string) {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}

export function waHref(num: string, text = "Hello Blazetech Engineering, I would like to enquire about your products.") {
  return `https://wa.me/${num.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
