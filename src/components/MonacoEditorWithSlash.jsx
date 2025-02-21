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

    //e Register a new language that extends Python
    //monaco.languages.register({ id: "pythonWithVariables" });

    // Create a regex pattern dynamically
    const variablePattern = fields
      .map((field) => field.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape special characters
      .join("|");

    const regexPattern = new RegExp(`/(?:${variablePattern})`, "g");

    // Define a theme for highlighting
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

    // Define syntax highlighting with correct language ID
    // monaco.languages.setMonarchTokensProvider("pythonWithVariables", {
    //   tokenizer: {
    //     root: [[regexPattern, "highlightedVariable"]],
    //   },
    // });

    // Apply highlighting initially
    highlightVariables(editor, monaco, regexPattern);

    // Register autocomplete provider for "/"
    monaco.languages.registerCompletionItemProvider("python", {
      triggerCharacters: ["/"],
      provideCompletionItems: (model, position) => {
        const lineNumber = position.lineNumber;
        const column = position.column;

        // Get the content of the line
        const lineContent = model.getLineContent(lineNumber);

        // Tokenize the line
        const tokens = monaco.editor.tokenize(
          lineContent,
          model.getLanguageId()
        )[0];

        console.log(tokens, "tokens");

        let tokenType = null;
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          const nextToken = tokens[i + 1];
          const startOffset = token.offset;
          const endOffset = nextToken ? nextToken.offset : lineContent.length;

          if (column - 1 >= startOffset && column - 1 < endOffset) {
            tokenType = token.type; // e.g., 'string.python', 'comment.python'
            break;
          }
        }
        if (tokenType) {
          console.log(
            "tokenType include comment",
            tokenType.includes("comment")
          );
        }

        // If the token is a comment or string, do not provide suggestions
        if (
          tokenType &&
          (tokenType.includes("string") || tokenType.includes("comment"))
        ) {
          return { suggestions: [] };
        }

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

    // Notify parent component
    onCodeChange(editor.getValue());

    // Listen for content changes & update highlights
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

    editor.deltaDecorations(decorationsRef.current, []);

    // Update decorations properly
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
