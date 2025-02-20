import Editor from "@monaco-editor/react";
import { useRef } from "react";
import "../App.css";

const MonacoEditorWithSlash = ({ onCodeChange, fields }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        monaco.languages.register({ id: "pythonWithVariables" });

        monaco.languages.setMonarchTokensProvider("python", {
            // Extend Python
            tokenizer: {
                root: [
                    [
                        /\/\w+/,
                        { token: "custom-variable", foreground: "0078D7" },
                    ],
                ],
            },
        });

        monaco.editor.defineTheme("myCoolTheme", {
            base: "vs",
            inherit: false,
            rules: [
                {
                    token: "custom-variable",
                    foreground: "808080",
                    fontStyle: "bold",
                },
            ],
        });

        monaco.languages.setLanguageConfiguration("python", {});

        // Register autocomplete provider for "/"
        monaco.languages.registerCompletionItemProvider("python", {
            triggerCharacters: ["/"],
            provideCompletionItems: (model, position) => {
                const suggestions = fields.map((variable) => ({
                    label: `/${variable.label}`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: variable.value,
                    documentation: `Insert variable ${variable.value}`,
                    range: {
                        // Important: Define the range for replacement
                        startLineNumber: position.lineNumber,
                        // startColumn: position.column - 1, // -1 to include the "/"
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column,
                    },
                }));

                return { suggestions };
            },
        });

        // Notify parent component of initial code
        onCodeChange(editor.getValue());

        // Listen for changes and update code in parent
        editor.onDidChangeModelContent(() => {
            onCodeChange(editor.getValue());
        });
    };

    return (
        <div className="editor-container">
            <Editor
                height="400px"
                width="1000px"
                defaultLanguage="python"
                // theme="vs-dark"
                theme="myCoolTheme"
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

MonacoEditorWithSlash.propTypes = {
    onCodeChange: Function,
    fields: Array,
};

export default MonacoEditorWithSlash;
