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

    function preprocessCode(code) {
        return code.replace(/\/\b(\w+)\b/g, (match, variableName) => {
            const variable = fields.find((v) => v.value === variableName);
            if (variable) {
                return `DATA[${variable.id}]`; // Use ID in the replacement
            } else {
                return match; // Return the original match if the variable isn't found
            }
        });
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
