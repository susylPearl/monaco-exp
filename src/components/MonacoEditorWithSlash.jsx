import Editor from "@monaco-editor/react";
import { useRef } from "react";

const variables = ["user_name", "user_email", "order_id", "invoice_number"];

const MonacoEditorWithSlash = () => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register autocomplete provider for "/"
    monaco.languages.registerCompletionItemProvider("plaintext", {
      triggerCharacters: ["/"],
      provideCompletionItems: () => {
        const suggestions = variables.map((variable) => ({
          label: `/${variable}`,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: variable,
          documentation: `Insert variable ${variable}`,
        }));

        return { suggestions };
      },
    });
  };

  return (
    <Editor
      height="400px"
      width="1000px"
      defaultLanguage="plaintext"
      theme="vs-dark"
      onMount={handleEditorDidMount}
    />
  );
};

export default MonacoEditorWithSlash;
