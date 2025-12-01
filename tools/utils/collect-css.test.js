import { collectFromCss } from './collect-css';

describe('collectFromCss — Industrial Tests', () => {

    const sort = arr => [...arr].sort();

    test('simple classes', async () => {
        const css = `
            .a { color: red; }
            .b, .c { margin: 10px; }
        `;
        const out = await collectFromCss(css);
        expect(sort(out)).toEqual(sort(['a', 'b', 'c']));
    });

    test('complex selectors with combinators', async () => {
        const css = `
            .card .header > .item + .item.active:hover:not(.disabled) {}
        `;
        const out = await collectFromCss(css);

        expect(sort(out)).toEqual(sort([
            'card', 'header', 'item', 'active', 'disabled'
        ]));
    });

    test('modern pseudo selectors: :is(), :where(), :has()', async () => {
        const css = `
            :is(.x, .y .z) {}
            :where(.foo, .bar) {}
            .container:has(.child.active) {}
        `;
        const out = await collectFromCss(css);

        expect(sort(out)).toEqual(sort([
            'x', 'y', 'z', 'foo', 'bar', 'container', 'child', 'active'
        ]));
    });

    test('nested selectors (&)', async () => {
        const css = `
            .btn {
                &.primary { }
                &:hover { }
                &.large:hover:not(.disabled) { }
            }
        `;
        const out = await collectFromCss(css);

        expect(sort(out)).toEqual(sort([
            'btn', 'primary', 'large', 'disabled'
        ]));
    });

    test('@media, @supports, @layer, @container', async () => {
        const css = `
            @media (min-width: 600px) {
                .responsive { }
            }
            @supports (display: grid) {
                .supports-grid { }
            }
            @layer utilities {
                .u-hidden { display:none; }
            }
            @container sidebar (min-width: 300px) {
                .inside-container { }
            }
        `;
        const out = await collectFromCss(css);

        expect(sort(out)).toEqual(sort([
            'responsive', 'supports-grid', 'u-hidden', 'inside-container'
        ]));
    });

    test('should skip invalid rules but keep valid classnames in tolerated selectors', async () => {
        const css = `
            .valid { }
            .bad$$selector { }
            #another.bad$%class { }
            .ok { }
        `;
        const out = await collectFromCss(css);

        expect(sort(out)).toEqual(sort([
            'valid', 'bad$$selector', 'bad$%class', 'ok'
        ]));
    });

    test('should ignore classes inside strings', async () => {
        const css = `
            .card { content: ".fake-class"; }
            .real {}
        `;
        const out = await collectFromCss(css);
        expect(sort(out)).toEqual(sort(['card', 'real']));
    });

});