/* eslint-disable react/prop-types */
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import "../App.css";

const MonacoEditorWithSlash = ({ onCodeChange, fields }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        console.log("Fields length:", fields.length);

        if (!monaco || !fields || fields.length === 0) return;

        // Define a theme for highlighting
        monaco.editor.defineTheme("myCustomTheme", {
            base: "vs",
            inherit: true,
            rules: [],
            colors: {},
        });

        monaco.editor.setTheme("myCustomTheme");

        monaco.languages.registerCompletionItemProvider("python", {
            triggerCharacters: ["/"],
            provideCompletionItems: function (model, position) {
                var textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                // No suggestions unless "/" is typed
                const lastSlashIndex = textUntilPosition.lastIndexOf("/");
                console.log("lastSlashIndex", lastSlashIndex);
                const lastChar = textUntilPosition.slice(-1);

                console.log("lastChar", lastChar);
                if (lastChar !== "/") {
                    return { suggestions: [] };
                }

                // No suggestion on comment and string
                const lineNumber = position.lineNumber;
                const lineContent = model.getLineContent(lineNumber);
                const column = position.column;

                const tokens = monaco.editor.tokenize(
                    lineContent,
                    model.getLanguageId()
                )[0];

                let tokenType = null;
                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];
                    const nextToken = tokens[i + 1];
                    const startOffset = token.offset;
                    const endOffset = nextToken
                        ? nextToken.offset
                        : lineContent.length;

                    if (column - 1 >= startOffset && column - 1 < endOffset) {
                        tokenType = token.type;
                        break;
                    }
                }

                if (
                    tokenType &&
                    (tokenType.includes("string") ||
                        tokenType.includes("comment"))
                ) {
                    return { suggestions: [] };
                }

                var range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: 1,
                    endColumn: position.column,
                };

                const suggestions = fields.map((variable, index) => ({
                    label: `${variable.p_title} : ${variable.label}`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `data["${variable.p_title}"]["${variable.label}"]`,
                    documentation: `Insert variable ${variable.value}`,
                    filterText: "/",
                    sortText: String(index).padStart(4, "0"),
                    range: range,
                }));
                return {
                    suggestions: suggestions,
                };
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
