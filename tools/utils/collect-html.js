// Purpose: parse HTML/Blade fragments and extract class names (unique).
import * as parse5 from 'parse5';

/**
 * Regex to match a "valid" class token:
 * - Must start and end with an alphanumeric (no token composed only of punctuation).
 * - Allows internal characters commonly used in modern utility class names:
 *   letters, digits, underscore, hyphen, colon (for variants), dot and slash (e.g. w-1/2).
 *
 * Examples allowed:
 *  - btn, btn-2, icon--small, md:hover:bg-red-500, w-1/2
 * Examples rejected:
 *  - ":"  (single punctuation)
 *  - "-btn" (starts with punctuation)
 */
const TOKEN_REGEX = /[A-Za-z0-9](?:[A-Za-z0-9_:.\-/])*[A-Za-z0-9]/g;

/**
 * Remove Blade-like expressions and noisy constructs from an attribute value.
 * - Removes {{ ... }} and {!! ... !!} blocks (Blade interpolation).
 * - Removes simple @directive(...) occurrences (e.g. @class([...])) to avoid noise.
 * This is intentionally conservative: we do NOT attempt to evaluate dynamic expressions.
 *
 * @param {string} value
 * @returns {string}
 */
function stripBladeAndDirectives(value) {
    if (!value || typeof value !== 'string') return '';
    // Remove raw/unescaped Blade output first
    let cleaned = value.replace(/{!![\s\S]*?!!}/g, ' ');
    // Remove standard Blade interpolation
    cleaned = cleaned.replace(/{{[\s\S]*?}}/g, ' ');
    // Remove simple @directive(...) occurrences (non-greedy, stops at first ')')
    // This removes things like @class(['foo' => $cond]) to avoid injecting tokens
    cleaned = cleaned.replace(/@\w+\([^)]*\)/g, ' ');
    return cleaned;
}

/**
 * Extract "word-like" class tokens from a class attribute value.
 * Uses TOKEN_REGEX to find tokens that start and end with alphanumeric chars.
 *
 * @param {string} value
 * @returns {string[]}
 */
export function extractTokensFromAttribute(value) {
    if (!value || typeof value !== 'string') return [];
    const cleaned = stripBladeAndDirectives(value);
    const matches = cleaned.match(TOKEN_REGEX) || [];
    // unique & deterministic order
    return Array.from(new Set(matches)).sort();
}

/**
 * Recursively traverse parse5 nodes and collect class attribute tokens.
 * @param {object} node
 * @param {Set<string>} out
 */
function traverse(node, out) {
    if (!node || typeof node !== 'object') return;
    // element with attrs
    if (Array.isArray(node.attrs)) {
        for (const attr of node.attrs) {
            // parse5 produces lowercase attr.name
            if (attr && attr.name === 'class' && typeof attr.value === 'string') {
                const tokens = extractTokensFromAttribute(attr.value);
                for (const t of tokens) out.add(t);
            }
        }
    }
    // children (parse5 uses childNodes; templates may use content.childNodes)
    const children = node.childNodes || (node.content && node.content.childNodes) || [];
    for (const child of children) traverse(child, out);
}

/**
 * Parse an HTML/Blade fragment and return an array of unique class names found.
 * - Accepts fragments (not only full documents).
 * - Filters out noisy Blade tokens and directive fragments.
 * - Does NOT attempt to evaluate dynamic expressions — see limitations.
 *
 * @param {string} htmlFragment
 * @returns {string[]} array of unique class names (sorted for deterministic output)
 */
export function collectFromHtml(htmlFragment) {
    if (typeof htmlFragment !== 'string') {
        throw new TypeError('collectFromHtml expects a string');
    }
    const root = parse5.parseFragment(htmlFragment, { sourceCodeLocationInfo: false });
    const set = new Set();
    traverse(root, set);
    // deterministic order
    return Array.from(set).sort();
}