import "./App.css";
import MonacoEditorWithSlash from "./components/MonacoEditorWithSlash";
import FinalCodeView from "./components/FinalCodeView";
import { useState } from "react";

const fields = [
    {
        id: 1001,
        label: "Invoice Number",
        value: "invoice_number",
    },
    {
        id: 1002,
        label: "User Name",
        value: "user_name",
    },
    {
        id: 1003,
        label: "User Email",
        value: "user_email",
    },
    {
        id: 1004,
        label: "Order ID",
        value: "order_id",
    },
    {
        id: 1005,
        label: "Address",
        value: "address",
    },
];

function App() {
    const [code, setCode] = useState("");
    const [finalCode, setFinalCode] = useState("");

    // function preprocessCode(code) {
    //     return code.replace(/\/\b(\w+)\b/g, (match, variableName) => {
    //         const variable = fields.find((v) => v.value === variableName);
    //         if (variable) {
    //             return `DATA[${variable.id}]`; // Use ID in the replacement
    //         } else {
    //             return match; // Return the original match if the variable isn't found
    //         }
    //     });
    // }
    function preprocessCode(code) {
        const fieldsMap = {};
        fields.forEach((field) => {
            fieldsMap[field.value] = field.id;
        });

        let result = "";
        let i = 0;
        const length = code.length;
        let inSingleQuoteString = false;
        let inDoubleQuoteString = false;
        let inTripleSingleQuoteString = false;
        let inTripleDoubleQuoteString = false;
        let inComment = false;

        while (i < length) {
            const c = code[i];

            // Handle comments
            if (inComment) {
                if (c === "\n") {
                    inComment = false;
                }
                result += c;
                i++;
                continue;
            }

            // Handle triple-quoted strings
            if (inTripleSingleQuoteString) {
                if (code.substr(i, 3) === "'''") {
                    inTripleSingleQuoteString = false;
                    result += "'''";
                    i += 3;
                } else {
                    result += c;
                    i++;
                }
                continue;
            }

            if (inTripleDoubleQuoteString) {
                if (code.substr(i, 3) === '"""') {
                    inTripleDoubleQuoteString = false;
                    result += '"""';
                    i += 3;
                } else {
                    result += c;
                    i++;
                }
                continue;
            }

            // Handle single-quoted strings
            if (inSingleQuoteString) {
                if (c === "'" && code[i - 1] !== "\\") {
                    inSingleQuoteString = false;
                }
                result += c;
                i++;
                continue;
            }

            // Handle double-quoted strings
            if (inDoubleQuoteString) {
                if (c === '"' && code[i - 1] !== "\\") {
                    inDoubleQuoteString = false;
                }
                result += c;
                i++;
                continue;
            }

            // Detect start of comment
            if (c === "#") {
                inComment = true;
                result += c;
                i++;
                continue;
            }

            // Detect start of triple-quoted strings
            if (code.substr(i, 3) === "'''") {
                inTripleSingleQuoteString = true;
                result += "'''";
                i += 3;
                continue;
            }

            if (code.substr(i, 3) === '"""') {
                inTripleDoubleQuoteString = true;
                result += '"""';
                i += 3;
                continue;
            }

            // Detect start of single-quoted string
            if (c === "'") {
                inSingleQuoteString = true;
                result += c;
                i++;
                continue;
            }

            // Detect start of double-quoted string
            if (c === '"') {
                inDoubleQuoteString = true;
                result += c;
                i++;
                continue;
            }

            // Outside strings and comments, check for variable references
            if (c === "/") {
                // Check if this is the start of a variable reference
                const variableMatch = code.substr(i).match(/^\/(\w+)/);
                if (variableMatch) {
                    const variableName = variableMatch[1];
                    // eslint-disable-next-line no-prototype-builtins
                    if (fieldsMap.hasOwnProperty(variableName)) {
                        // Replace with DATA[id]
                        result += `DATA[${fieldsMap[variableName]}]`;
                        i += variableMatch[0].length;
                    } else {
                        // Variable not found; keep original text
                        result += `/${variableName}`;
                        i += variableMatch[0].length;
                    }
                    continue;
                } else {
                    // Just a '/', add it
                    result += c;
                    i++;
                    continue;
                }
            }

            // Regular character
            result += c;
            i++;
        }

        return result;
    }

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const handleSubmit = () => {
        const finalCode = preprocessCode(code);
        setFinalCode(finalCode);
    };
    return (
        <div className="app-container">
            <MonacoEditorWithSlash
                onCodeChange={handleCodeChange}
                fields={fields}
            />
            <div className="button-container">
                <button onClick={handleSubmit}>Submit Code</button>
            </div>
            <FinalCodeView code={finalCode} />
        </div>
    );
}

export default App;
