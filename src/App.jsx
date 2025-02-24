import "./App.css";
import MonacoEditorWithSlash from "./components/MonacoEditorWithSlash";
import FinalCodeView from "./components/FinalCodeView";
import { useState } from "react";

const fields = [
    {
        acc: 1,
        content: {
            conf: 1,
            confidence: 1.0,
            is_valid_format: true,
            model: "gpt_kv_extractor",
            orig_value: "10001",
            page: 1,
            position: [553, 121, 581, 129],
            review_required: false,
            validation_source: "human",
            value: "10001",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "%s",
        format_message: "",
        id: 1001001,
        id_auto_extract: 1001001,
        id_auto_extract_label: "Invoice Number",
        ignore: false,
        label: "Invoice Number",
        low_confidence: false,
        order: 1,
        p_title: "Basic Information",
        p_type: "basic_info",
        parent_id: 1001,
        time_spent: 0,
        type: "string",
        user_id: "66583a53dbd922778293594c",
        validation_source: null,
    },
    {
        acc: 1,
        content: {
            conf: 1,
            confidence: 1.0,
            is_valid_format: true,
            model: "gpt_kv_extractor",
            orig_value: "10/08/2013",
            page: 1,
            position: [531, 133, 582, 143],
            review_required: false,
            validation_source: "human",
            value: "10/08/2013",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "dd/mm/yyyy",
        format_message: "",
        id: 1001002,
        id_auto_extract: 1001002,
        id_auto_extract_label: "Issue Date",
        ignore: false,
        label: "Issue Date",
        low_confidence: false,
        order: 2,
        p_title: "Basic Information",
        p_type: "basic_info",
        parent_id: 1001,
        time_spent: 0,
        type: "date",
        user_id: "66583a53dbd922778293594c",
        validation_source: null,
    },
    {
        acc: 1,
        content: {
            conf: 1,
            confidence: 1.0,
            is_valid_format: true,
            model: "gpt_kv_extractor",
            orig_value: "Cash",
            page: 1,
            position: [558, 172, 582, 181],
            review_required: false,
            validation_source: "human",
            value: "Cash",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "%s",
        format_message: "",
        id: 1001003,
        id_auto_extract: 1001003,
        id_auto_extract_label: "Terms",
        ignore: false,
        label: "Terms",
        low_confidence: false,
        order: 3,
        p_title: "Basic Information",
        p_type: "basic_info",
        parent_id: 1001,
        time_spent: 0,
        type: "string",
        user_id: "66583a53dbd922778293594c",
        validation_source: null,
    },
    {
        acc: 0,
        content: {
            confidence: 1.0,
            is_valid_format: true,
            orig_value: "",
            page: 1,
            position: [553, 121, 581, 129],
            review_required: false,
            validation_source: "human",
            value: "10001",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "%s",
        format_message: "",
        id: 1001004,
        id_auto_extract: 1001004,
        id_auto_extract_label: "Order Id/Tracking No",
        ignore: false,
        label: "Order Id/Tracking No",
        low_confidence: false,
        order: 4,
        p_title: "Basic Information",
        p_type: "basic_info",
        parent_id: 1001,
        time_spent: 0,
        type: "string",
        user_id: "66583a53dbd922778293594c",
        validation_source: "human",
    },
    {
        acc: 1,
        content: {
            conf: 1,
            confidence: 1.0,
            is_valid_format: true,
            model: "gpt_kv_extractor",
            orig_value: "Your Business Name",
            page: 1,
            position: [29, 30, 236, 45],
            review_required: false,
            validation_source: "human",
            value: "Your Business Name",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "%s",
        format_message: "",
        id: 1002001,
        id_auto_extract: 1002001,
        id_auto_extract_label: "Name",
        ignore: false,
        label: "Name",
        low_confidence: false,
        order: 1,
        p_title: "Seller Detail",
        p_type: "contact_info",
        parent_id: 1002,
        time_spent: 0,
        type: "string",
        user_id: "66583a53dbd922778293594c",
        validation_source: null,
    },
    {
        acc: 1,
        content: {
            conf: 1,
            confidence: 0.95,
            is_valid_format: true,
            model: "ml",
            orig_value: "Street Address, City, State Postcode, Country",
            page: 1,
            position: [28, 52, 217, 62],
            review_required: false,
            validation_source: "human",
            value: "Street Address, City, State Postcode, Country",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "%s",
        format_message: "",
        id: 1002002,
        id_auto_extract: 1002002,
        id_auto_extract_label: "Address",
        ignore: false,
        label: "Address",
        low_confidence: false,
        order: 2,
        p_title: "Seller Detail",
        p_type: "contact_info",
        parent_id: 1002,
        time_spent: 0,
        type: "string",
        user_id: "66583a53dbd922778293594c",
        validation_source: null,
    },
    {
        acc: 1,
        content: {
            confidence: 1.0,
            is_valid_format: true,
            localization_error: "Unable to locate value in document",
            model: "gpt_kv_extractor",
            orig_value: "yourtaxreg:no",
            page: 1,
            position: [0, 0, 0, 0],
            review_required: false,
            validation_source: "human",
            value: "yourtaxreg:no",
        },
        doc_id: "26178335d4a346f8bfd909b4f35216de",
        format: "%s",
        format_message: "",
        id: 1002003,
        id_auto_extract: 1002003,
        id_auto_extract_label: "GST/ VAT Number",
        ignore: false,
        label: "GST/ VAT Number",
        low_confidence: false,
        order: 3,
        p_title: "Seller Detail",
        p_type: "contact_info",
        parent_id: 1002,
        time_spent: 0,
        type: "string",
        user_id: "66583a53dbd922778293594c",
        validation_source: "human",
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
