import "../App.css";
const FinalCodeView = ({ code }) => {
    return (
        <div className="final-code-view">
            <h2>Final Code</h2>
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
};

FinalCodeView.propTypes = {
    code: String,
};

export default FinalCodeView;
