/* eslint-disable react/prop-types */
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import "../App.css";

const MonacoEditorWithSlash = ({ onCodeChange, fields }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        if (!monaco || !fields || fields.length === 0) return;

        // Define a theme for highlighting
        monaco.editor.defineTheme("myCustomTheme", {
            base: "vs",
            inherit: true,
            rules: [],
            colors: {},
        });

        monaco.editor.setTheme("myCustomTheme");

        // Register autocomplete provider for "/"
        monaco.languages.registerCompletionItemProvider("python", {
            triggerCharacters: ["/"],
            provideCompletionItems: (model, position) => {
                const lineNumber = position.lineNumber;
                const column = position.column;

                // Get the content of the line
                const lineContent = model.getLineContent(lineNumber);
                const textUntilPosition = lineContent.substring(0, column - 1);

                // Find the last '/' character before the cursor
                const lastSlashIndex = textUntilPosition.lastIndexOf("/");

                // if (lastSlashIndex === -1) {
                //     // No '/' character found; do not provide suggestions
                //     return { suggestions: [] };
                // }

                // Tokenize the line
                const tokens = monaco.editor.tokenize(
                    lineContent,
                    model.getLanguageId()
                )[0];

                console.log(tokens, lineContent);

                let tokenType = null;
                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];
                    const nextToken = tokens[i + 1];
                    const startOffset = token.offset;
                    const endOffset = nextToken
                        ? nextToken.offset
                        : lineContent.length;

                    if (column - 1 >= startOffset && column - 1 < endOffset) {
                        tokenType = token.type; // e.g., 'string.python', 'comment.python'
                        break;
                    }
                }

                // If the token is a comment or string, do not provide suggestions
                if (
                    tokenType &&
                    (tokenType.includes("string") ||
                        tokenType.includes("comment"))
                ) {
                    return { suggestions: [] };
                }

                // Calculate the range to replace: from character after '/', up to the cursor position
                const startColumn = lastSlashIndex + 1; // '+2' because columns are 1-based
                const endColumn = column;

                const suggestions = fields.map((variable) => ({
                    label: `${variable.p_title} : ${variable.label}`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `data["${variable.p_title}"]["${variable.label}"]`, // Include `/`
                    documentation: `Insert variable ${variable.value}`,
                    filterText: `${variable.label}`,
                    range: new monaco.Range(
                        // position.lineNumber,
                        // position.column - 1,
                        // position.lineNumber,
                        // position.column

                        lineNumber,
                        startColumn,
                        lineNumber,
                        endColumn
                    ),
                }));

                return { suggestions };
            },
        });

        // Notify parent component
        onCodeChange(editor.getValue());

        // Listen for content changes & update highlights
        editor.onDidChangeModelContent(() => {
            onCodeChange(editor.getValue());
            // highlightVariables(editor, monaco, regexPattern);
            // replaceVariables(editor, monaco, fields);
        });
    };

    return (
        <div className="editor-container">
            <Editor
                height="400px"
                width="1000px"
                defaultLanguage="python"
                theme="myCustomTheme"
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default MonacoEditorWithSlash;
