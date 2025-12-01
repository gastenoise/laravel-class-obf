import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

/**
 * Collect classnames from CSS content (fully robust version)
 * - Handles nested selectors (&)
 * - Handles :is(), :where(), :not(), :has()
 * - Handles @media, @supports, @layer, @container
 * - Ignores @keyframes selectors (not CSS classes)
 * - Skips invalid selectors but does NOT break the build
 * - Guarantees uniqueness and returns sorted output
 *
 * @param {string} cssContent
 * @returns {string[]} unique classnames extracted from selectors
 */
export async function collectFromCss(cssContent) {
    const classes = new Set();

    let root;
    try {
        root = postcss.parse(cssContent);
    } catch (err) {
        // File-level syntax error → ignore safely
        return [];
    }

    root.walkRules(rule => {
        let selector = rule.selector;

        // Skip keyframes (they contain "from", "to", percentages)
        if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) {
            return;
        }

        try {
            const processor = selectorParser(selectors => {
                // Extract real classes
                selectors.walkClasses(node => {
                    // Normalize class name (PostCSS preserves raw)
                    if (node && node.value) {
                        classes.add(node.value.trim());
                    }
                });

                // Handle nested "&" selectors (postcss-nesting style)
                selectors.walkNesting(node => {
                    // "&.active" → extract "active"
                    const parent = node.parent;
                    if (!parent) return;

                    parent.walkClasses(n => {
                        if (n && n.value) {
                            classes.add(n.value.trim());
                        }
                    });
                });

            });

            processor.processSync(selector);

        } catch (_) {
            // Malformed selector: skip, but do NOT break main process
        }
    });

    return [...classes].sort();
}
