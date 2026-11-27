import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MissingAltError, transformImages } from '../src/lib/news-images.ts';

const img = (props: Record<string, unknown>) => ({ type: 'element', tagName: 'img', properties: props, children: [] });
const p = (...children: any[]) => ({ type: 'element', tagName: 'p', properties: {}, children });
const root = (...children: any[]) => ({ type: 'root', children });

test('Bild allein im Absatz wird zu figure mit lazy loading', () => {
  const tree: any = root(p(img({ src: '/images/news/x/a.svg', alt: 'Diagramm' })));
  transformImages(tree, 'x.md');
  const figure = tree.children[0];
  assert.equal(figure.tagName, 'figure');
  assert.deepEqual(figure.properties.className, ['post-figure']);
  assert.equal(figure.children.length, 1);
  assert.equal(figure.children[0].properties.loading, 'lazy');
  assert.equal(figure.children[0].properties.decoding, 'async');
});

test('title wird zur Bildunterschrift', () => {
  const tree: any = root(p({ type: 'text', value: '\n' }, img({ src: '/a.svg', alt: 'A', title: 'Quelle: Stape' })));
  transformImages(tree, 'x.md');
  const [image, caption] = tree.children[0].children;
  assert.equal(image.properties.title, undefined);
  assert.equal(caption.tagName, 'figcaption');
  assert.equal(caption.children[0].value, 'Quelle: Stape');
});

test('Bild im Fließtext bleibt inline, bekommt aber lazy loading', () => {
  const tree: any = root(p({ type: 'text', value: 'Text ' }, img({ src: '/a.svg', alt: 'Icon' })));
  transformImages(tree, 'x.md');
  assert.equal(tree.children[0].tagName, 'p');
  assert.equal(tree.children[0].children[1].properties.loading, 'lazy');
});

test('fehlender oder leerer Alt-Text bricht ab', () => {
  for (const alt of [undefined, '', '   ']) {
    const tree: any = root(p(img({ src: '/images/news/x/a.svg', alt })));
    assert.throws(() => transformImages(tree, 'src/content/news/de/x.md'), (err: unknown) =>
      err instanceof MissingAltError && /x\.md.*a\.svg.*Alt-Text/.test(err.message));
  }
});
