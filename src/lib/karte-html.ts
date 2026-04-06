const SECTION_DEFINITIONS = [
  { id: "section-souhy", labels: ["総評"] },
  { id: "section-kuchikomi", labels: ["口コミ分析", "口コミ解析"] },
  { id: "section-jikaku", labels: ["自覚症状"] },
  { id: "section-monshin", labels: ["自己問診"] },
  { id: "section-shohousen", labels: ["処方箋"] },
  { id: "section-action", labels: ["アクション", "次のアクション"] },
] as const;

const BLOCKED_TAGS = ["script", "iframe", "object", "embed", "form"] as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function injectSectionAnchor(html: string, id: string, labels: readonly string[]) {
  if (html.includes(`id="${id}"`) || html.includes(`id='${id}'`)) {
    return html;
  }

  for (const label of labels) {
    const headingPattern = new RegExp(
      `<h([1-6])([^>]*)>([\\s\\S]*?${escapeRegExp(label)}[\\s\\S]*?)<\\/h\\1>`,
      "i",
    );

    if (headingPattern.test(html)) {
      return html.replace(
        headingPattern,
        `<h$1$2 id="${id}">$3</h$1>`,
      );
    }
  }

  return html;
}

export function decorateKarteHtml(rawHtml: string) {
  let html = rawHtml;

  for (const section of SECTION_DEFINITIONS) {
    html = injectSectionAnchor(html, section.id, section.labels);
  }

  return html;
}

export function sanitizeKarteHtml(rawHtml: string) {
  let html = rawHtml;

  for (const tag of BLOCKED_TAGS) {
    html = html.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"),
      "",
    );
    html = html.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }

  html = html.replace(/<meta[^>]+http-equiv=["']?refresh["']?[^>]*>/gi, "");
  html = html.replace(/\s+on[a-z-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, "");

  return html;
}

export function prepareKarteHtml(rawHtml: string) {
  return decorateKarteHtml(sanitizeKarteHtml(rawHtml));
}
