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
          const endOffset = nextToken ? nextToken.offset : lineContent.length;

          if (column - 1 >= startOffset && column - 1 < endOffset) {
            tokenType = token.type; // e.g., 'string.python', 'comment.python'
            break;
          }
        }

        // No suggestions unless "/" is typed

        var textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const lastChar = textUntilPosition.slice(-1);

        if (lastChar !== "/") {
          return { suggestions: [] };
        }

        // If the token is a comment or string, do not provide suggestions
        if (
          tokenType &&
          (tokenType.includes("string") || tokenType.includes("comment"))
        ) {
          return { suggestions: [] };
        }

        const textBeforeCursor = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2, // two index before i.e for tokens '/' & '{'
          endLineNumber: position.lineNumber, // one index after i.e for token '}'
          endColumn: position.column + 1,
        });

        // Check if the token is inside curly braces
        const insideCurlyBraces =
          textBeforeCursor.includes("{") && textBeforeCursor.includes("}");

        const suggestions = fields.map((variable) => ({
          label: `${variable.p_title} : ${variable.label}`,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: insideCurlyBraces
            ? `data[\\"${variable.p_title}\\"][\\"${variable.label}\\"]`
            : `data["${variable.p_title}"]["${variable.label}"]`,
          documentation: `Insert variable ${variable.value}`,
          filterText: "/",
          range: new monaco.Range(
            position.lineNumber,
            position.column - 1,
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
