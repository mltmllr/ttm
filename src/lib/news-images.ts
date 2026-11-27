/**
 * Bilder in Beiträgen.
 * - Jedes <img> braucht einen Alt-Text, sonst bricht der Build mit Dateiname ab.
 * - Jedes <img> bekommt loading="lazy" und decoding="async".
 * - Ein Absatz, der nur aus einem Bild besteht, wird zu <figure class="post-figure">.
 *   Ist ein Titel gesetzt (`![Alt](/pfad.svg "Bildunterschrift")`), wird er zur <figcaption>.
 * Ablage: public/images/news/<beitrag-slug>/datei.svg, Einbindung: ![Alt](/images/news/<slug>/datei.svg).
 * Ohne Abhängigkeiten, damit `node --test` die Funktion direkt prüfen kann.
 */

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

export class MissingAltError extends Error {}

function isWhitespace(node: Node): boolean {
  return node.type === 'text' && !(node.value ?? '').trim();
}

function prepareImage(img: Node, file: string): Node {
  const props = (img.properties ??= {});
  const alt = typeof props.alt === 'string' ? props.alt.trim() : '';
  if (!alt) {
    throw new MissingAltError(
      `${file}: Bild "${String(props.src ?? '')}" hat keinen Alt-Text. Schreibe ![Beschreibung](/images/news/<slug>/datei.svg).`,
    );
  }
  props.loading = 'lazy';
  props.decoding = 'async';
  return img;
}

export function transformImages(tree: Node, file = 'Beitrag'): void {
  const walk = (parent: Node) => {
    const children = parent.children ?? [];
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== 'element') continue;
      if (node.tagName === 'img') {
        prepareImage(node, file);
        continue;
      }
      const content = (node.children ?? []).filter((child) => !isWhitespace(child));
      if (node.tagName === 'p' && content.length === 1 && content[0].tagName === 'img') {
        const img = prepareImage(content[0], file);
        const title = typeof img.properties?.title === 'string' ? img.properties.title.trim() : '';
        if (title) delete img.properties!.title;
        const figure: Node = {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['post-figure'] },
          children: [img],
        };
        if (title) {
          figure.children!.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: title }],
          });
        }
        children[i] = figure;
        continue;
      }
      walk(node);
    }
  };
  walk(tree);
}

/** Datei für Fehlermeldungen kürzen: ab src/content/ bzw. tests/fixtures/. */
function shortFile(url: URL | undefined): string {
  const file = url ? decodeURIComponent(url.pathname) : 'Beitrag';
  return file.replace(/^.*?(src\/content\/|tests\/fixtures\/)/, '$1');
}

/**
 * Plugin für den Sätteri-Markdown-Prozessor von Astro (`markdown.processor: satteri({ hastPlugins })`).
 * Nutzt dieselbe Logik wie `transformImages`, damit der Unit-Test das Verhalten absichert.
 */
export const newsImagesHastPlugin = {
  name: 'ttm-news-images',
  element: {
    filter: ['p'],
    visit(node: any, ctx: any) {
      const content = (node.children ?? []).filter((child: Node) => !isWhitespace(child));
      if (!content.some((child: Node) => child.type === 'element' && child.tagName === 'img')) return;
      const copy: Node = structuredClone({ type: 'root', children: [node] });
      transformImages(copy, shortFile(ctx.fileURL));
      ctx.replaceNode(node, copy.children![0]);
    },
  },
  after(root: any, ctx: any) {
    // Bilder außerhalb von Absätzen (z. B. in Listen oder Tabellen): Alt-Text prüfen.
    const check = (parent: Node) => {
      for (const child of parent.children ?? []) {
        if (child.type !== 'element') continue;
        if (child.tagName === 'img') {
          const alt = typeof child.properties?.alt === 'string' ? child.properties.alt.trim() : '';
          if (!alt) {
            throw new MissingAltError(
              `${shortFile(ctx.fileURL)}: Bild "${String(child.properties?.src ?? '')}" hat keinen Alt-Text.`,
            );
          }
        }
        check(child);
      }
    };
    check(root);
  },
};
