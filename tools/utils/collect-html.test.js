import { collectFromHtml, extractTokensFromAttribute } from './collect-html';

describe('collectFromHtml / extractTokensFromAttribute', () => {
    test('extractTokensFromAttribute filters blade tokens and returns valid class names', () => {
        const val = '{{ $foo }} btn-primary  btn-2  ';
        const tokens = extractTokensFromAttribute(val);
        expect(tokens).toEqual(['btn-2', 'btn-primary'].sort());
    });

    test('collectFromHtml extracts classes from nested elements', () => {
        const html = `
      <div class="container mx-auto">
        <header class="site-header">
          <nav class="nav nav--main">
            <ul class="menu list-reset">
              <li class="menu__item active"><a class="menu__link" href="#">Home</a></li>
            </ul>
          </nav>
        </header>
        <main class="content">
          <div class="card card--shadow">
            <p class="text-sm">Hello</p>
          </div>
        </main>
      </div>
    `;
        const classes = collectFromHtml(html);
        // expected set
        const expected = [
            'active', 'card', 'card--shadow', 'container', 'content',
            'list-reset', 'menu', 'menu__item', 'menu__link',
            'mx-auto', 'nav', 'nav--main', 'site-header', 'text-sm'
        ].sort();
        expect(classes).toEqual(expected);
    });

    test('collectFromHtml handles blade-like attributes, preserves literal classes only', () => {
        const html = `
      <div class="{{ $containerClass }} container">
        <button class="btn {{ $primary ? 'btn-primary' : '' }} btn-lg">OK</button>
        <span class="icon icon--small"></span>
      </div>
    `;
        const classes = collectFromHtml(html);
        // We do NOT evaluate blade expressions; only literal tokens matching pattern are returned
        const expected = ['btn', 'btn-lg', 'container', 'icon', 'icon--small'].sort();
        expect(classes).toEqual(expected);
    });

    test('collectFromHtml returns empty array for empty input', () => {
        expect(collectFromHtml('')).toEqual([]);
    });

    test('collectFromHtml throws if non-string', () => {
        expect(() => collectFromHtml(null)).toThrow();
        expect(() => collectFromHtml({})).toThrow();
    });
});
