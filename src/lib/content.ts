/** Der erste Ordner einer Inhaltsdatei muss dem Frontmatter-Feld `lang` entsprechen. */
export function assertLocaleFolder(id: string, lang: string): void {
  const folder = id.split('/')[0];
  if (folder !== lang) {
    throw new Error(
      `${id}: Ordner "${folder}" passt nicht zu lang "${lang}". Die Datei gehört nach …/${lang}/.`,
    );
  }
}
