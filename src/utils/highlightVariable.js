/**
 * Highlights variables in the editor based on a given regex pattern.
 *
 * This function fetches the text content of the editor, searches for matches
 * using the provided regex pattern, and applies inline decorations to highlight
 * the matched variables. The decorations are updated efficiently to ensure
 * performance.
 *
 * @param {object} editor - The Monaco editor instance.
 * @param {object} monaco - The Monaco editor library.
 * @param {RegExp} regexPattern - The regular expression pattern to match variables.
 * @param {object} decorationsRef - A React ref object storing current decorations.
 */

export const highlightVariables = (
    editor,
    monaco,
    regexPattern,
    decorationsRef
) => {
    const model = editor.getModel();
    if (!model) return;

    const matches = [...model.getValue().matchAll(regexPattern)];
    const decorations = matches
        .map((match) => {
            if (match.index !== undefined) {
                return {
                    range: new monaco.Range(
                        model.getPositionAt(match.index).lineNumber,
                        model.getPositionAt(match.index).column,
                        model.getPositionAt(
                            match.index + match[0].length
                        ).lineNumber,
                        model.getPositionAt(
                            match.index + match[0].length
                        ).column
                    ),
                    options: { inlineClassName: "highlighted-text" },
                };
            }
            return null;
        })
        .filter(Boolean);

    editor.deltaDecorations(decorationsRef.current, []);

    // Update decorations properly
    decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        decorations
    );
};
