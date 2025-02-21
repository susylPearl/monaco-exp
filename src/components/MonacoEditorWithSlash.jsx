/* eslint-disable react/prop-types */
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import "../App.css";

const MonacoEditorWithSlash = ({ onCodeChange, fields }) => {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!monaco || !fields || fields.length === 0) return;

    // 🔹 Register a new language that extends Python
    //monaco.languages.register({ id: "pythonWithVariables" });

    // 🔹 Create a regex pattern dynamically
    const variablePattern = fields
      .map((field) => field.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape special characters
      .join("|");

    const regexPattern = new RegExp(`/(?:${variablePattern})`, "g");

    // 🔹 Define a theme for highlighting
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs",
      inherit: true,
      rules: [
        // {
        //   token: "highlightedVariable",
        //   foreground: "FFA500",
        //   fontStyle: "bold",
        // },
      ],
      colors: {
        //"editor.foreground": "#FFFFFF",
        // "editor.background": "#1E1E1E",
      },
    });

    monaco.editor.setTheme("myCustomTheme");

    // 🔹 Define syntax highlighting with correct language ID
    // monaco.languages.setMonarchTokensProvider("pythonWithVariables", {
    //   tokenizer: {
    //     root: [[regexPattern, "highlightedVariable"]],
    //   },
    // });

    // 🔹 Apply highlighting initially
    highlightVariables(editor, monaco, regexPattern);

    // 🔹 Register autocomplete provider for "/"
    monaco.languages.registerCompletionItemProvider("python", {
      triggerCharacters: ["/"],
      provideCompletionItems: (model, position) => {
        const suggestions = fields.map((variable) => ({
          label: `/${variable.label}`,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: `${variable.value}`, // Include `/`
          documentation: `Insert variable ${variable.value}`,
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
        }));

        return { suggestions };
      },
    });

    // 🔹 Notify parent component
    onCodeChange(editor.getValue());

    // 🔹 Listen for content changes & update highlights
    editor.onDidChangeModelContent(() => {
      onCodeChange(editor.getValue());
      highlightVariables(editor, monaco, regexPattern);
    });
  };

  const highlightVariables = (editor, monaco, regexPattern) => {
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
              model.getPositionAt(match.index + match[0].length).lineNumber,
              model.getPositionAt(match.index + match[0].length).column
            ),
            options: { inlineClassName: "highlighted-text" },
          };
        }
        return null;
      })
      .filter(Boolean);

    // 🔹 Update decorations properly
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      decorations
    );
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
