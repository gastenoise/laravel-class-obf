import { obfFor } from './hash.js';

describe('obfFor deterministic hashing', () => {

    const secret = 'test-secret';

    test('same input produces same output', () => {
        const a = obfFor('button-primary', secret, 8);
        const b = obfFor('button-primary', secret, 8);
        expect(a).toBe(b);
    });

    test('different inputs produce different outputs', () => {
        const a = obfFor('btn', secret, 8);
        const b = obfFor('card', secret, 8);
        expect(a).not.toBe(b);
    });

    test('different secret changes output', () => {
        const a = obfFor('btn', 'secretA', 8);
        const b = obfFor('btn', 'secretB', 8);
        expect(a).not.toBe(b);
    });

    test('token length respected', () => {
        const a = obfFor('btn', secret, 4);
        expect(a.length).toBe(1 + 4); // prefix + token
    });
});
